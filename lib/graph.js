'use strict';
/**
 * Reads The Coop intranet content from Optimizely Graph and reshapes it into
 * the JSON the front end (public/index.html) renders:
 *   { source, generatedAt, includesDrafts, home, pages: [ ... ] }
 * No dependencies. Needs Node 18+ (global fetch).
 */

class ConfigError extends Error {}
class NotFoundError extends Error {}
class UpstreamError extends Error {}
class BadRequestError extends Error {}
class AuthError extends Error {}

/* Fields requested for every section component. Keep in sync with the CMS content types (CFA: ...). */
const SECTION_FIELDS = `
  _metadata { types }
  ... on CfaHeroBanner { Headline Subheadline CtaLabel ShowTimeOfDayGreeting }
  ... on CfaQuickLinksSection { Heading Links { ... on CfaQuickLink { Label IconEmoji Target { url { default } text } } } }
  ... on CfaNewsListSection { Heading ShowCategoryFilter MaxItems Articles { ... on CfaNewsArticle { Headline Category Summary IsPinned PublishDate Body { html } } } }
  ... on CfaRecognitionSection { Heading AllowPosting FeaturedQuote FeaturedQuoteAttribution }
  ... on CfaEventsSection { Heading ShowCalendarGrid Events { ... on CfaEvent { Title EventType StartDate EndDate EventLocation RsvpEnabled Details { html } } } }
  ... on CfaDirectorySection { Heading ShowSearch ShowDepartmentFilter People { ... on CfaTeamMember { FullName JobTitle Department Location Email Phone Bio } } }
  ... on CfaResourceLibrarySection { Heading ShowTrainingProgress Documents { ... on CfaResourceDoc { Title ResourceType Description DurationMinutes LastUpdated } } }
  ... on CfaTimeOffSection { Heading IntroText { html } BlockSundays DefaultHoursAvailable }
`;

const META = '_metadata { key displayName locale status version url { hierarchical } }';
/* node `key` is what the CMS on-page editor needs as data-epi-block-id */
const COMP = `composition { nodes { nodeType key ... on CompositionComponentNode { component { ${SECTION_FIELDS} } } } }`;
const HOME_FIELDS = `${META} SiteName Tagline RestaurantName ShiftInfo ${COMP}`;
const PAGE_FIELDS = `${META} PageIcon ShowInNavigation NavOrder PageIntro ${COMP}`;

function buildQuery() {
  return `query CoopSite {
  CfaIntranetHome(limit: 20) { items { ${HOME_FIELDS} } }
  CfaIntranetPage(limit: 100) { items { ${PAGE_FIELDS} } }
}`;
}

/*
 * Preview query: the requested item (filtered by key + version [+ locale]) plus the normal
 * site query for navigation / hero context. key, version and locale are GraphQL VARIABLES -
 * request values are never concatenated into the query text.
 */
function buildPreviewQuery(withLocale) {
  const where = `where: { _metadata: { key: { eq: $key }, version: { eq: $ver }${withLocale ? ', locale: { eq: $loc }' : ''} } }`;
  return `query CoopPreview($key: String!, $ver: String!${withLocale ? ', $loc: String!' : ''}) {
  PreviewHome: CfaIntranetHome(${where}, limit: 5) { items { ${HOME_FIELDS} } }
  PreviewPage: CfaIntranetPage(${where}, limit: 5) { items { ${PAGE_FIELDS} } }
  SiteHome: CfaIntranetHome(limit: 20) { items { ${HOME_FIELDS} } }
  SitePages: CfaIntranetPage(limit: 100) { items { ${PAGE_FIELDS} } }
}`;
}

/* ---------- transform: Graph response -> front-end shape ---------- */

const slug = (s) => String(s || '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '');

function routeSegmentOf(item) {
  const h = item._metadata && item._metadata.url && item._metadata.url.hierarchical;
  const last = String(h || '').split('/').filter(Boolean).pop();
  return last || slug(item._metadata && item._metadata.displayName);
}

/* CMS link -> hash route used by the demo front end ("/news/" -> "#/news"). External URLs unchanged. */
function toHref(u) {
  if (!u) return null;
  if (/^https?:\/\//i.test(u)) return u;
  const p = u.replace(/\/+$/, '');
  return '#' + (p.startsWith('/') ? p : '/' + p);
}

function cleanValue(v) {
  if (Array.isArray(v)) {
    return v
      .filter((x) => x !== null && x !== undefined)
      .map((x) => (x && typeof x === 'object' ? { properties: cleanProps(x) } : x));
  }
  if (v && typeof v === 'object' && v.url && typeof v.url === 'object' && 'default' in v.url) {
    return { href: toHref(v.url.default), text: v.text || null }; // Link property
  }
  return v; // scalars, rich text { html }, null
}

function cleanProps(obj) {
  const out = {};
  for (const [k, v] of Object.entries(obj || {})) {
    if (k === '__typename' || k === '_metadata' || k === 'composition') continue;
    out[k] = cleanValue(v);
  }
  return out;
}

function pickType(types) {
  const t = types || [];
  return t.find((x) => x.startsWith('Cfa')) || t[0] || 'Unknown';
}

function nodesOf(item) {
  const nodes = (item.composition && item.composition.nodes) || [];
  return nodes
    .filter((n) => n && n.component)
    .map((n) => ({ id: n.key, contentType: pickType(n.component._metadata && n.component._metadata.types), properties: cleanProps(n.component) }));
}

function shapeItem(it) {
  return {
    key: it._metadata.key,
    displayName: it._metadata.displayName,
    routeSegment: routeSegmentOf(it),
    status: it._metadata.status,
    version: it._metadata.version,
    properties: cleanProps(it),
    nodes: nodesOf(it),
  };
}

function newest(items, locale) {
  const byKey = new Map();
  for (const it of items || []) {
    const m = it._metadata || {};
    if (locale && m.locale && m.locale !== locale) continue;
    const cur = byKey.get(m.key);
    if (!cur || (parseInt(m.version, 10) || 0) > (parseInt(cur._metadata.version, 10) || 0)) byKey.set(m.key, it);
  }
  return [...byKey.values()];
}

function transform(json, opts = {}) {
  const locale = opts.locale || 'en';
  const data = (json && json.data) || {};
  const homes = newest(data.CfaIntranetHome && data.CfaIntranetHome.items, locale);
  const pages = newest(data.CfaIntranetPage && data.CfaIntranetPage.items, locale);
  if (!homes.length) {
    throw new NotFoundError(
      'No CfaIntranetHome content returned by Graph. Publish the CMS pages (single-key access returns published content only) or use app key + secret to read drafts.'
    );
  }
  const all = [...homes, ...pages];
  return {
    home: shapeItem(homes[0]),
    pages: pages.map(shapeItem),
    includesDrafts: all.some((i) => String(i._metadata.status || '').toLowerCase() !== 'published'),
  };
}

/* ---------- Graph request ---------- */

function authFor(env) {
  const appKey = env.OPTIMIZELY_GRAPH_APP_KEY;
  const secret = env.OPTIMIZELY_GRAPH_SECRET;
  const single = env.OPTIMIZELY_GRAPH_SINGLE_KEY;
  const mode = (env.GRAPH_AUTH_MODE || (appKey && secret ? 'basic' : 'single')).toLowerCase();
  if (mode === 'basic') {
    if (!appKey || !secret) throw new ConfigError('GRAPH_AUTH_MODE=basic needs OPTIMIZELY_GRAPH_APP_KEY and OPTIMIZELY_GRAPH_SECRET.');
    return { mode, header: 'Basic ' + Buffer.from(`${appKey}:${secret}`).toString('base64') };
  }
  if (mode === 'single') {
    if (!single) throw new ConfigError('Set OPTIMIZELY_GRAPH_SINGLE_KEY (published content) or OPTIMIZELY_GRAPH_APP_KEY + OPTIMIZELY_GRAPH_SECRET (incl. drafts).');
    return { mode, header: 'epi-single ' + single };
  }
  throw new ConfigError('GRAPH_AUTH_MODE must be "single" or "basic".');
}

async function fetchSite(env = process.env, fetchImpl = globalThis.fetch) {
  const auth = authFor(env);
  const gateway = (env.OPTIMIZELY_GRAPH_GATEWAY || 'https://cg.optimizely.com').replace(/\/+$/, '');
  let res;
  try {
    res = await fetchImpl(`${gateway}/content/v2`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: auth.header },
      body: JSON.stringify({ query: buildQuery() }),
    });
  } catch (e) {
    throw new UpstreamError(`Could not reach Optimizely Graph: ${e.message}`);
  }
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = null; }
  if (!res.ok) throw new UpstreamError(`Graph returned HTTP ${res.status}: ${text.slice(0, 300)}`);
  if (!json) throw new UpstreamError('Graph returned a non-JSON response.');
  if (json.errors && json.errors.length) throw new UpstreamError('Graph query error: ' + json.errors.map((e) => e.message).join('; '));
  const site = transform(json, { locale: env.CONTENT_LOCALE || 'en' });
  return {
    source: `Optimizely Graph (${auth.mode === 'basic' ? 'admin access, drafts included' : 'published content only'})`,
    generatedAt: new Date().toISOString(),
    ...site,
  };
}

/* ---------- CMS preview (GET /preview?key=&ver=&loc=&ctx=&preview_token=) ---------- */

const KEY_RE = /^[0-9a-f]{32}$/;
const VER_RE = /^\d{1,10}$/;
const LOC_RE = /^[A-Za-z]{2,3}(?:-[A-Za-z0-9]{2,8})*$/;
const TOKEN_RE = /^[A-Za-z0-9._~+/=-]{1,4096}$/;
const first = (v) => (Array.isArray(v) ? v[0] : v);

/* Validates request values strictly. Error messages never echo the input back. */
function parsePreviewParams(q = {}) {
  const key = String(first(q.key) || '').replace(/-/g, '').toLowerCase();
  if (!KEY_RE.test(key)) throw new BadRequestError('Invalid "key": expected a content GUID.');
  const ver = String(first(q.ver) ?? '');
  if (!VER_RE.test(ver)) throw new BadRequestError('Invalid "ver": expected a version number.');
  let loc = first(q.loc);
  loc = loc === undefined || loc === null || loc === '' || String(loc).toLowerCase() === 'neutral' ? null : String(loc);
  if (loc !== null && !LOC_RE.test(loc)) throw new BadRequestError('Invalid "loc": expected a locale such as "en".');
  const rawCtx = first(q.ctx);
  const ctx = rawCtx === undefined || rawCtx === '' ? 'preview' : String(rawCtx).toLowerCase();
  if (ctx !== 'edit' && ctx !== 'preview') throw new BadRequestError('Invalid "ctx": expected "edit" or "preview".');
  return { key, ver, loc, ctx };
}

function parsePreviewToken(t) {
  if (t === undefined || t === null || t === '') throw new AuthError('A preview token is required. Open the preview from the CMS.');
  if (typeof t !== 'string' || !TOKEN_RE.test(t)) throw new BadRequestError('Malformed preview token.');
  return t;
}

/* Origin of the CMS UI, from config only (never from the request). https only. */
function cmsOrigin(env = process.env) {
  try {
    const u = new URL(env.OPTIMIZELY_CMS_URL || '');
    return u.protocol === 'https:' ? u.origin : null;
  } catch { return null; }
}

const EMPTY_HOME = { key: '', displayName: '', routeSegment: '', status: '', version: '', properties: {}, nodes: [] };

/* Graph response -> same shape as /api/content, with the requested version swapped in. */
function transformPreview(json, p) {
  const data = (json && json.data) || {};
  const sameLoc = (it) => !p.loc || String((it._metadata || {}).locale || '').toLowerCase() === p.loc.toLowerCase();
  const hit = (c) => ((c && c.items) || []).find((it) => it._metadata && it._metadata.key === p.key && String(it._metadata.version) === p.ver && sameLoc(it));
  const homeHit = hit(data.PreviewHome);
  const target = homeHit || hit(data.PreviewPage);
  if (!target) throw new NotFoundError('No content found for that key, version and locale.');

  const locale = p.loc || target._metadata.locale;
  const homes = newest(data.SiteHome && data.SiteHome.items, locale);
  const pages = newest(data.SitePages && data.SitePages.items, locale);
  const shaped = shapeItem(target);
  const list = pages.filter((it) => it._metadata.key !== p.key).map(shapeItem);
  if (!homeHit) list.push(shaped);
  return {
    home: homeHit ? shaped : homes[0] ? shapeItem(homes[0]) : EMPTY_HOME,
    pages: list,
    includesDrafts: true,
    preview: { key: p.key, ver: p.ver, loc: p.loc, ctx: p.ctx, kind: homeHit ? 'home' : 'page', routeSegment: shaped.routeSegment },
  };
}

/*
 * Reads ONE version of ONE item (usually a draft) using the short-lived preview token the CMS
 * puts in the preview URL. The token is only ever sent to Graph as a Bearer header; no admin key is used.
 */
async function fetchPreview(input, env = process.env, fetchImpl = globalThis.fetch) {
  const p = parsePreviewParams(input);
  const token = parsePreviewToken(input && input.token); // no token -> reject before any network call
  const gateway = (env.OPTIMIZELY_GRAPH_GATEWAY || 'https://cg.optimizely.com').replace(/\/+$/, '');
  const variables = { key: p.key, ver: p.ver, ...(p.loc !== null ? { loc: p.loc } : {}) };
  let res;
  try {
    res = await fetchImpl(`${gateway}/content/v2`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
      body: JSON.stringify({ query: buildPreviewQuery(p.loc !== null), variables }),
    });
  } catch (e) {
    throw new UpstreamError(`Could not reach Optimizely Graph: ${e.message}`);
  }
  const text = await res.text();
  let json;
  try { json = JSON.parse(text); } catch { json = null; }
  if (res.status === 401 || res.status === 403) {
    throw new AuthError('Optimizely Graph rejected the preview token. It is only valid for 5 minutes - reload the preview from the CMS.');
  }
  if (!res.ok) throw new UpstreamError(`Graph returned HTTP ${res.status}: ${text.slice(0, 300)}`);
  if (!json) throw new UpstreamError('Graph returned a non-JSON response.');
  if (json.errors && json.errors.length) throw new UpstreamError('Graph query error: ' + json.errors.map((e) => e.message).join('; '));
  const site = transformPreview(json, p);
  const origin = p.ctx === 'edit' ? cmsOrigin(env) : null;
  return {
    source: `Optimizely Graph (preview, version ${p.ver})`,
    generatedAt: new Date().toISOString(),
    ...site,
    preview: { ...site.preview, cmsOrigin: origin },
  };
}

module.exports = {
  buildQuery, buildPreviewQuery, transform, transformPreview, shapeItem, fetchSite, fetchPreview, authFor,
  parsePreviewParams, parsePreviewToken, cmsOrigin,
  ConfigError, NotFoundError, UpstreamError, BadRequestError, AuthError,
};
