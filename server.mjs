// Liberty Mutual demo app: a second application that reads Optimizely Graph.
// Plain Node 20+ with no dependencies. Run it twice to get two "sites":
//   SITE=agenthub PORT=4001 node --env-file=.env server.mjs
//   SITE=lmcom    PORT=4002 node --env-file=.env server.mjs
//
// Pages
//   /                   links
//   /agent/dana         Agent Hub dashboard (also tyler, marcus, elena): CMS content + LM API data
//   /disclosure         the shared disclosure, rendered by this app (OP-13)
//   /notes              state coverage notes, optional ?state=TX (OP-23)
// Mock LM API (demo only, served by this same app)
//   POST /mock-lm/oauth/token     OAuth 2.0 client credentials
//   GET  /mock-lm/renewals?agent= renewals for one agent (bearer token required)
//
// Every page ends with "What this page called": each request, its timing, whether it can
// be cached, and the exact query and response. The Graph key and secrets are never shown.

import http from 'node:http';
import { readFile } from 'node:fs/promises';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';

const PORT = Number(process.env.PORT || 4001);
const SITE = process.env.SITE === 'lmcom' ? 'lmcom' : 'agenthub';
const GRAPH_URL = process.env.GRAPH_URL || 'https://cg.optimizely.com/content/v2';
const GRAPH_KEY = process.env.GRAPH_SINGLE_KEY || '';
const DISCLOSURE_KEY = process.env.DISCLOSURE_KEY || '917dbb01b0df49f889ddd4d72540fe1f';
const IMAGE_NAME = process.env.IMAGE_NAME || 'agent-texas-clients.jpg';
const CLIENT_ID = process.env.LM_OAUTH_CLIENT_ID || 'lm-demo-portal';
const CLIENT_SECRET = process.env.LM_OAUTH_CLIENT_SECRET || '';
const LM_API = `http://127.0.0.1:${PORT}/mock-lm`; // the app calls its own mock API (loopback only)
const LM_TIMEOUT_MS = 1500;

const SITES = {
  agenthub: { name: 'Agent Hub', tagline: 'Independent Agent Portal', noteField: 'NoteIaPortal' },
  lmcom: { name: 'LibertyMutual.com', tagline: 'Customer site', noteField: 'NoteLmCom' },
};

// The four demo agents (same as the Next.js site). A demo identity, not authentication.
const AGENTS = {
  dana: { key: 'dana', first: 'Dana', name: 'Dana Whitfield', role: 'Producer', state: 'Texas', agency: 'Harbor Light Insurance Group' },
  tyler: { key: 'tyler', first: 'Tyler', name: 'Tyler Brooks', role: 'Producer', state: 'Texas', agency: 'Lone Star Independent Agents' },
  marcus: { key: 'marcus', first: 'Marcus', name: 'Marcus Chen', role: 'Agency Principal', state: 'Florida', agency: 'Sunrise Coast Insurance Group' },
  elena: { key: 'elena', first: 'Elena', name: 'Elena Ruiz', role: 'Service Representative', state: 'Ohio', agency: 'Buckeye Independent Agency' },
};

const STATES = { TX: 'Texas', FL: 'Florida', OH: 'Ohio', WA: 'Washington' };
const PRODUCTS = { auto: 'Auto', home: 'Home', bundle: 'Home + Auto' };

// ---------- helpers ----------
const h = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' })[c]);
const lines = (s) => (Array.isArray(s) ? s : String(s ?? '').split(/\r?\n/)).map((x) => String(x ?? '').trim()).filter(Boolean);
const shortDate = (iso) => { const d = iso ? new Date(iso) : null; return d && !isNaN(d) ? d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric', timeZone: 'UTC' }) : ''; };
const safeImg = (u) => (/^https:\/\//.test(u || '') ? u : '');

// ---------- Optimizely Graph ----------
async function graph(log, label, query, variables = {}) {
  const t0 = performance.now();
  let status = 0, json;
  try {
    const res = await fetch(GRAPH_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `epi-single ${GRAPH_KEY}` },
      body: JSON.stringify({ query, variables }),
    });
    status = res.status;
    const text = await res.text();
    try { json = JSON.parse(text); } catch { json = { errors: [{ message: text.slice(0, 300) || `HTTP ${status}` }] }; }
  } catch (e) {
    json = { errors: [{ message: `Could not reach Graph: ${e.message}` }] };
  }
  log.push({
    service: 'Optimizely Graph', label, method: 'POST', url: GRAPH_URL, status, ms: Math.round(performance.now() - t0),
    auth: 'epi-single key (public: published content only)',
    cache: 'Cacheable. The same response serves every agent.', cacheable: true,
    request: query.trim(), variables, response: json,
  });
  if (json.errors?.length) throw new Error(json.errors.map((e) => e.message).join('; '));
  return json.data;
}

// ---------- LM API (OAuth 2.0 client credentials) ----------
async function lmToken(log) {
  const t0 = performance.now();
  const body = new URLSearchParams({ grant_type: 'client_credentials', client_id: CLIENT_ID, client_secret: CLIENT_SECRET });
  const entry = {
    service: 'LM API', label: 'OAuth 2.0 token (client credentials)', method: 'POST', url: `${LM_API}/oauth/token`,
    auth: 'client_id + client_secret (server-side only)', cache: 'Not cached. Tokens are short-lived.', cacheable: false,
    request: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=••••••••`,
  };
  try {
    const res = await fetch(entry.url, { method: 'POST', headers: { 'Content-Type': 'application/x-www-form-urlencoded' }, body, signal: AbortSignal.timeout(LM_TIMEOUT_MS) });
    const json = await res.json();
    Object.assign(entry, { status: res.status, ms: Math.round(performance.now() - t0), response: { ...json, access_token: json.access_token ? '••••••••' : undefined } });
    log.push(entry);
    if (!res.ok || !json.access_token) throw new Error(`token ${res.status}`);
    return json.access_token;
  } catch (e) {
    if (!entry.status) Object.assign(entry, { status: 'failed', ms: Math.round(performance.now() - t0), response: { error: e.message } }), log.push(entry);
    throw e;
  }
}

async function lmRenewals(log, token, agentKey) {
  const t0 = performance.now();
  const entry = {
    service: 'LM API', label: `Renewals for ${agentKey}`, method: 'GET', url: `${LM_API}/renewals?agent=${agentKey}`,
    auth: 'Authorization: Bearer ••••••••', cache: `Not cached. Per agent. Times out after ${LM_TIMEOUT_MS / 1000} s.`, cacheable: false,
    request: `GET /renewals?agent=${agentKey}`,
  };
  try {
    const res = await fetch(entry.url, { headers: { Authorization: `Bearer ${token}` }, signal: AbortSignal.timeout(LM_TIMEOUT_MS) });
    const json = await res.json();
    Object.assign(entry, { status: res.status, ms: Math.round(performance.now() - t0), response: json });
    log.push(entry);
    if (!res.ok) throw new Error(String(res.status));
    return json.items ?? [];
  } catch (e) {
    if (!entry.status) {
      const timedOut = e.name === 'TimeoutError' || e.name === 'AbortError';
      Object.assign(entry, { status: timedOut ? 'timed out' : 'failed', ms: Math.round(performance.now() - t0), response: { error: timedOut ? `No answer within ${LM_TIMEOUT_MS} ms` : e.message } });
      log.push(entry);
    }
    return null; // the card shows its CMS error text
  }
}

// ---------- audience rules (same logic as lib/agent/eligibility.ts) ----------
function eligible(p, a) {
  if (!p || p.Hidden) return false;
  const roles = [p.ForProducers && 'Producer', p.ForPrincipals && 'Agency Principal', p.ForServiceReps && 'Service Representative'].filter(Boolean);
  if (roles.length && !roles.includes(a.role)) return false;
  const states = (p.States ?? []).filter(Boolean).map((s) => s.trim().toLowerCase());
  if (states.length && !states.includes(a.state.toLowerCase())) return false;
  const agencies = (p.Agencies ?? []).filter(Boolean).map((s) => s.trim().toLowerCase());
  if (agencies.length && !agencies.some((x) => a.agency.toLowerCase().startsWith(x))) return false;
  return true;
}

// ---------- queries ----------
const PRIORITY_FIELDS = `__typename ... on AgentPriority { _metadata { key } Title Description LinkLabel Hidden ForProducers ForPrincipals ForServiceReps States Agencies }`;

const DASHBOARD_QUERY = `
query AgentHubDashboard($disclosure: AgentDisclosureWhereInput, $image: _ImageWhereInput) {
  priorities: AgentPriorities(locale: en, limit: 1) {
    items { FeaturedCount ProductPriorities { ${PRIORITY_FIELDS} } ServicePriorities { ${PRIORITY_FIELDS} } }
  }
  disclosure: AgentDisclosure(where: $disclosure, locale: en) {
    items { _metadata { key version published } Heading Paragraphs NoteIaPortal NoteLmCom }
  }
  image: _Image(where: $image, limit: 1) {
    items { _metadata { key displayName url { default } } }
  }
  renewalsCard: AgentRenewalsCard(locale: en, limit: 1) {
    items { _metadata { key version } Heading MaxItems DataSource EmptyStateText ErrorText }
  }
}`;

const DISCLOSURE_QUERY = `
query SharedDisclosure($disclosure: AgentDisclosureWhereInput) {
  AgentDisclosure(where: $disclosure, locale: en) {
    items { _metadata { key version published url { default } } Heading Paragraphs NoteIaPortal NoteLmCom }
  }
}`;

const NOTES_QUERY = `
query StateCoverageNotes {
  AgentStateCoverageNote(locale: en, limit: 50) {
    items { _metadata { key version published url { default } } Title State ProductLine EffectiveDate Body }
  }
}`;

const disclosureVars = { disclosure: { _metadata: { key: { eq: DISCLOSURE_KEY } } } };

// ---------- views ----------
function layout({ title, body, log = [], error = '' }) {
  const s = SITES[SITE];
  const graphCalls = log.filter((x) => x.service === 'Optimizely Graph').length;
  const lmCalls = log.filter((x) => x.service === 'LM API').length;
  return `<!doctype html>
<html lang="en"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1">
<title>${h(title)} | ${h(s.name)}</title>
<link rel="preconnect" href="https://fonts.googleapis.com"><link href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;700&family=Roboto+Mono&display=swap" rel="stylesheet">
<link rel="stylesheet" href="/styles.css"></head>
<body class="site-${SITE}">
<header class="top"><div class="wrap top-in">
  <a class="brand" href="/"><span class="mark" aria-hidden="true"></span><span><strong>Liberty Mutual</strong> <span class="brand-sub">${h(s.name)}</span></span></a>
  <nav>${SITE === 'agenthub' ? '<a href="/agent/dana">Dashboard</a>' : ''}<a href="/disclosure">Disclosure</a><a href="/notes">Coverage notes</a></nav>
  <span class="app-badge" title="This is a separate app reading the same Optimizely Graph content">Demo app · port ${PORT}</span>
</div></header>
<main class="wrap">
${error ? `<div class="alert"><strong>Something needs attention.</strong> ${h(error)}</div>` : ''}
${body}
</main>
${log.length ? inspector(log, graphCalls, lmCalls) : ''}
<footer class="wrap foot">Demo app for the Liberty Mutual follow-ups. Content from Optimizely CMS (SaaS) through Optimizely Graph. Renewals from a mock LM API.</footer>
</body></html>`;
}

function inspector(log, graphCalls, lmCalls) {
  const rows = log.map((e, i) => `
  <details class="call">
    <summary>
      <span class="n">${i + 1}</span>
      <span class="svc ${e.service === 'LM API' ? 'svc-lm' : 'svc-graph'}">${h(e.service)}</span>
      <span class="lbl">${h(e.label)}</span>
      <span class="st ${String(e.status).startsWith('2') ? 'ok' : 'bad'}">${h(e.status)}</span>
      <span class="ms">${h(e.ms)} ms</span>
      <span class="cache ${e.cacheable ? 'yes' : 'no'}">${e.cacheable ? 'Cacheable' : 'Per agent'}</span>
    </summary>
    <div class="call-body">
      <p><b>${h(e.method)}</b> <code>${h(e.url)}</code></p>
      <p><b>Auth:</b> ${h(e.auth)} &nbsp; <b>Caching:</b> ${h(e.cache)}</p>
      <div class="cols">
        <div><p class="cap">Request</p><pre>${h(e.request)}${e.variables && Object.keys(e.variables).length ? '\n\n# variables\n' + h(JSON.stringify(e.variables, null, 2)) : ''}</pre></div>
        <div><p class="cap">Response</p><pre>${h(JSON.stringify(e.response, null, 2).slice(0, 12000))}</pre></div>
      </div>
    </div>
  </details>`).join('');
  return `<section class="inspector"><div class="wrap">
    <h2>What this page called</h2>
    <p class="sum"><b>${graphCalls}</b> Optimizely Graph ${graphCalls === 1 ? 'call' : 'calls'} (cacheable, shared by every agent) · <b>${lmCalls}</b> LM API ${lmCalls === 1 ? 'call' : 'calls'} (per agent, never cached)</p>
    ${rows}
  </div></section>`;
}

function disclosureCard(d) {
  if (!d) return '';
  const note = d[SITES[SITE].noteField];
  return `<section class="disclosure">
    <div class="disc-head"><h3>${h(d.Heading)}</h3><span class="muted">Updated ${h(shortDate(d._metadata?.published))} · v${h(d._metadata?.version)}</span></div>
    ${lines(d.Paragraphs).map((p) => `<p>${h(p)}</p>`).join('')}
    ${note ? `<p class="note">${h(note)}</p>` : ''}
  </section>`;
}

function homePage() {
  const s = SITES[SITE];
  return layout({ title: 'Home', body: `
    <section class="hero"><p class="eyebrow">${h(s.tagline)}</p><h1>One set of approved content, more than one app.</h1>
    <p class="lead">This page is a small Node app, separate from the Liberty Mutual Next.js site. It reads the same content from Optimizely Graph.</p></section>
    <div class="grid3">
      ${SITE === 'agenthub' ? Object.values(AGENTS).map((a) => `<a class="tile" href="/agent/${a.key}"><span class="muted">${h(a.role)} · ${h(a.state)}</span><strong>${h(a.name)}</strong><span class="go">Open dashboard ›</span></a>`).join('') : ''}
      <a class="tile" href="/disclosure"><span class="muted">Shared block</span><strong>Bundle savings disclosure</strong><span class="go">Open ›</span></a>
      <a class="tile" href="/notes"><span class="muted">Structured content</span><strong>State coverage notes</strong><span class="go">Open ›</span></a>
    </div>` });
}

async function agentPage(agentKey) {
  // Own keys only: a URL like /agent/constructor must not reach Object.prototype members.
  const a = Object.hasOwn(AGENTS, agentKey) ? AGENTS[agentKey] : undefined;
  if (!a) return { status: 404, html: layout({ title: 'Not found', body: '<h1>Unknown agent</h1><p>Try <a href="/agent/dana">/agent/dana</a>.</p>' }) };
  const log = [];
  let data;
  try {
    data = await graph(log, 'Dashboard content: priorities, disclosure, image, renewals card settings', DASHBOARD_QUERY, {
      ...disclosureVars,
      image: { _metadata: { displayName: { eq: IMAGE_NAME } } },
    });
  } catch (e) {
    const hint = /AgentRenewalsCard/.test(e.message) ? ' The content type "Agent: Renewals card" does not exist yet (prep step C2).' : '';
    return { status: 502, html: layout({ title: a.name, log, error: `Graph returned an error: ${e.message}.${hint}`, body: `<h1>${h(a.name)}</h1>` }) };
  }

  const pr = data.priorities?.items?.[0] ?? {};
  const list = a.role === 'Service Representative' ? pr.ServicePriorities : pr.ProductPriorities;
  const count = Math.max(1, Math.min(6, pr.FeaturedCount || 3));
  const matched = (list ?? []).filter((p) => eligible(p, a)).slice(0, count);
  const disclosure = data.disclosure?.items?.[0];
  const img = safeImg(data.image?.items?.[0]?._metadata?.url?.default);
  const card = data.renewalsCard?.items?.[0];

  // LM data: OAuth token, then renewals. Failures affect this card only.
  let renewals = null;
  try { renewals = await lmRenewals(log, await lmToken(log), a.key); } catch { renewals = null; }

  const renewalsHtml = !card
    ? `<p class="muted">Create the shared block "Agent Renewals Card: Upcoming renewals" (prep step C9).</p>`
    : renewals === null
      ? `<p class="muted">${h(card.ErrorText)}</p>`
      : renewals.length === 0
        ? `<p class="muted">${h(card.EmptyStateText)}</p>`
        : `<ul class="renewals">${renewals.slice(0, card.MaxItems || 5).map((r) => `<li><span>${h(r.client)} · ${h(r.policy)}</span><span class="muted">${h(r.date)}</span></li>`).join('')}</ul>`;

  const body = `
    <section class="greet">
      <div class="chips"><span>${h(a.role)}</span><span>${h(a.state)}</span><span>${h(a.agency.replace(/ (Insurance Group|Independent Agents|Independent Agency)$/, ''))}</span></div>
      <h1>Good morning, <strong>${h(a.first)}</strong></h1>
      <p class="lead">Here’s what to focus on with your ${h(a.state)} clients this quarter.</p>
      <p class="demo-id">Demo identity, not a sign-in. Switch: ${Object.values(AGENTS).map((x) => `<a href="/agent/${x.key}"${x.key === a.key ? ' aria-current="page"' : ''}>${h(x.first)}</a>`).join(' · ')}</p>
    </section>

    <div class="dash">
      <section class="panel span2">
        <h2>${a.role === 'Service Representative' ? 'Tasks to help clients today' : 'Focus products this quarter'}</h2>
        <p class="muted small">From the Agent Priorities page in the CMS, matched to ${h(a.first)}’s role, state and agency.</p>
        <div class="cards">${matched.length ? matched.map((p, i) => `
          <article class="pcard${i === 0 ? ' first' : ''}"><h3>${h(p.Title)}</h3><p>${h(p.Description)}</p>
          <p class="rule">${h(p.States?.filter(Boolean).length ? p.States.join(', ') : 'Any state')} · ${h(p.Agencies?.filter(Boolean).length ? p.Agencies.join(', ') + ' only' : 'Any agency')}</p>
          ${p.LinkLabel ? `<span class="go">${h(p.LinkLabel)} ›</span>` : ''}</article>`).join('') : '<p class="muted">No priorities match this agent.</p>'}
        </div>
      </section>

      <section class="panel">
        <h2>${h(card?.Heading || 'Upcoming renewals')}</h2>
        <p class="muted small">Settings and copy from the CMS. Renewals from LM’s API.</p>
        ${renewalsHtml}
      </section>
    </div>

    ${img ? `<section class="feature"><img src="${h(img)}" alt="An independent agent reviewing coverage with homeowners"><div><h2>Wind and hail season in ${h(a.state)}</h2><p>Storm season is a good time to review wind and hail coverage with your homeowners. This image is a CMS asset delivered through Graph.</p></div></section>` : `<p class="muted small">No image named "${h(IMAGE_NAME)}" yet (prep step C8).</p>`}

    ${disclosureCard(disclosure)}`;
  return { status: 200, html: layout({ title: a.name, body, log }) };
}

async function disclosurePage() {
  const log = [];
  try {
    const data = await graph(log, 'Shared disclosure, by key, no page', DISCLOSURE_QUERY, disclosureVars);
    const d = data.AgentDisclosure?.items?.[0];
    return { status: 200, html: layout({ title: 'Disclosure', log, body: `
      <section class="hero"><p class="eyebrow">Shared block · no page, no URL (url.default is ${h(JSON.stringify(d?._metadata?.url?.default ?? null))})</p>
      <h1>The same approved disclosure, rendered by a different app.</h1>
      <p class="lead">The Next.js site shows this block on /bundling and /agent/home-auto-bundle. This app asks Graph for it by key and renders it its own way, with the ${SITE === 'agenthub' ? 'Independent Agent Portal' : 'LM.com'} note.</p></section>
      ${disclosureCard(d) || '<p class="muted">Disclosure not found. Check DISCLOSURE_KEY.</p>'}` }) };
  } catch (e) {
    return { status: 502, html: layout({ title: 'Disclosure', log, error: e.message, body: '' }) };
  }
}

async function notesPage(stateFilter) {
  const log = [];
  try {
    const data = await graph(log, 'State coverage notes, by type, no page', NOTES_QUERY);
    const all = data.AgentStateCoverageNote?.items ?? [];
    const st = (stateFilter || '').toUpperCase();
    const notes = st ? all.filter((n) => String(n.State || '').toUpperCase() === st || String(n.State || '').toLowerCase() === (STATES[st] || '').toLowerCase()) : all;
    return { status: 200, html: layout({ title: 'Coverage notes', log, body: `
      <section class="hero"><p class="eyebrow">Structured content · retrieved by type, no page</p>
      <h1>State coverage notes${st ? ` · ${h(STATES[st] || st)}` : ''}</h1>
      <p class="lead">Filter: ${['', ...Object.keys(STATES)].map((k) => `<a href="/notes${k ? '?state=' + k : ''}"${k === st ? ' aria-current="page"' : ''}>${k ? h(STATES[k]) : 'All'}</a>`).join(' · ')}</p>
      <p class="muted small">This app filters by state after the Graph call. Graph can filter too, once the State property is set to queryable.</p></section>
      ${notes.length ? notes.map((n) => `
        <article class="note-card">
          <div class="disc-head"><h3>${h(n.Title)}</h3><span class="muted">v${h(n._metadata?.version)} · published ${h(shortDate(n._metadata?.published))}</span></div>
          <p class="chips"><span>${h(STATES[n.State] || n.State)}</span>${n.ProductLine ? `<span>${h(PRODUCTS[n.ProductLine] || n.ProductLine)}</span>` : ''}${n.EffectiveDate ? `<span>Effective ${h(shortDate(n.EffectiveDate))}</span>` : ''}</p>
          ${lines(n.Body).map((p) => `<p>${h(p)}</p>`).join('')}
        </article>`).join('') : '<p class="muted">No published coverage notes yet. Video 2 creates the first one on camera.</p>'}` }) };
  } catch (e) {
    const hint = /AgentStateCoverageNote/.test(e.message) ? ' The content type "Agent: State coverage note" does not exist yet (prep step C1).' : '';
    return { status: 502, html: layout({ title: 'Coverage notes', log, error: e.message + hint, body: '' }) };
  }
}

// ---------- mock LM API (demo only) ----------
// Constant-time comparison (hashing first so the lengths always match).
const safeEqual = (a, b) => timingSafeEqual(createHash('sha256').update(String(a)).digest(), createHash('sha256').update(String(b)).digest());
const sign = (exp) => createHmac('sha256', CLIENT_SECRET).update(exp).digest('hex');
const issueToken = () => { const exp = String(Date.now() + 5 * 60_000); return `${exp}.${sign(exp)}`; };
function verifyToken(t) {
  const [exp, sig] = String(t || '').split('.');
  if (!exp || !sig || !CLIENT_SECRET || Number(exp) < Date.now()) return false;
  const a = Buffer.from(sig), b = Buffer.from(sign(exp));
  return a.length === b.length && timingSafeEqual(a, b);
}
// Fictional clients and policy numbers.
const RENEWALS = {
  dana: [
    { client: 'R. Alvarez', policy: 'Auto · TX-AU-48211', date: 'Nov 22, 2026' },
    { client: 'J. & M. Patel', policy: 'Home · TX-HO-30987', date: 'Dec 3, 2026' },
    { client: 'K. Nguyen', policy: 'Auto · TX-AU-51604', date: 'Dec 9, 2026' },
  ],
  marcus: [
    { client: 'S. Romero', policy: 'Condo · FL-CO-11872', date: 'Nov 28, 2026' },
    { client: 'D. Brooks', policy: 'Auto · FL-AU-60231', date: 'Dec 12, 2026' },
  ],
  elena: [], // empty state
};

async function readBody(req) {
  let s = '';
  for await (const chunk of req) { s += chunk; if (s.length > 4096) break; }
  return s;
}
const json = (res, status, obj) => { res.writeHead(status, { 'Content-Type': 'application/json' }); res.end(JSON.stringify(obj)); };

// ---------- server ----------
const server = http.createServer(async (req, res) => {
  // The pages are per agent and show call details: never cache, never sniff, no referrer.
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  try {
    // Inside the try: a malformed request line must give an error, not crash the server.
    const url = new URL(req.url, `http://127.0.0.1:${PORT}`);
    const path = url.pathname.replace(/\/+$/, '') || '/';
    if (req.method === 'POST' && path === '/mock-lm/oauth/token') {
      const f = new URLSearchParams(await readBody(req));
      // Evaluate every check (no short-circuit) so timing does not reveal which one failed.
      const idOk = safeEqual(f.get('client_id') ?? '', CLIENT_ID);
      const secretOk = !!CLIENT_SECRET && safeEqual(f.get('client_secret') ?? '', CLIENT_SECRET);
      const ok = f.get('grant_type') === 'client_credentials' && idOk && secretOk;
      return ok ? json(res, 200, { access_token: issueToken(), token_type: 'Bearer', expires_in: 300 }) : json(res, 401, { error: 'invalid_client' });
    }
    if (req.method === 'GET' && path === '/mock-lm/renewals') {
      if (!verifyToken((req.headers.authorization || '').replace(/^Bearer\s+/i, ''))) return json(res, 401, { error: 'unauthorized' });
      const agent = url.searchParams.get('agent') || '';
      if (agent === 'tyler') await new Promise((r) => setTimeout(r, 3000)); // slow upstream: the card gives up at 1.5 s
      return json(res, 200, { items: Object.hasOwn(RENEWALS, agent) ? RENEWALS[agent] : [] });
    }
    if (req.method !== 'GET') return json(res, 405, { error: 'method not allowed' });
    if (path === '/styles.css') {
      res.writeHead(200, { 'Content-Type': 'text/css' });
      return res.end(await readFile(new URL('./public/styles.css', import.meta.url)));
    }
    let out;
    if (path === '/') out = { status: 200, html: homePage() };
    else if (path.startsWith('/agent/')) out = await agentPage(path.split('/')[2]);
    else if (path === '/disclosure') out = await disclosurePage();
    else if (path === '/notes') out = await notesPage(url.searchParams.get('state'));
    else out = { status: 404, html: layout({ title: 'Not found', body: '<h1>Not found</h1>' }) };
    res.writeHead(out.status, { 'Content-Type': 'text/html; charset=utf-8' });
    res.end(out.html);
  } catch (e) {
    console.error('[demo app] request failed:', e.message);
    if (!res.headersSent) res.writeHead(500, { 'Content-Type': 'text/plain' });
    res.end('Something went wrong. See the terminal running the app.');
  }
});

if (!GRAPH_KEY) console.warn('GRAPH_SINGLE_KEY is not set. Graph calls will fail. Add it to .env.');
if (!CLIENT_SECRET) console.warn('LM_OAUTH_CLIENT_SECRET is not set. The renewals card will show its error text.');
// Loopback only: the app uses the Graph key and serves a mock API, so it must not be reachable from the network.
server.listen(PORT, '127.0.0.1', () => console.log(`${SITES[SITE].name} demo app on http://localhost:${PORT}`));
