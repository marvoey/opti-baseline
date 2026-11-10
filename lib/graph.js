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

function buildQuery() {
  const meta = '_metadata { key displayName locale status version url { hierarchical } }';
  const comp = `composition { nodes { nodeType ... on CompositionComponentNode { component { ${SECTION_FIELDS} } } } }`;
  return `query CoopSite {
  CfaIntranetHome(limit: 20) { items { ${meta} SiteName Tagline RestaurantName ShiftInfo ${comp} } }
  CfaIntranetPage(limit: 100) { items { ${meta} PageIcon ShowInNavigation NavOrder PageIntro ${comp} } }
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
    .map((n) => ({ contentType: pickType(n.component._metadata && n.component._metadata.types), properties: cleanProps(n.component) }));
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
  const shape = (it) => ({
    key: it._metadata.key,
    displayName: it._metadata.displayName,
    routeSegment: routeSegmentOf(it),
    status: it._metadata.status,
    version: it._metadata.version,
    properties: cleanProps(it),
    nodes: nodesOf(it),
  });
  const all = [...homes, ...pages];
  return {
    home: shape(homes[0]),
    pages: pages.map(shape),
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

module.exports = { buildQuery, transform, fetchSite, authFor, ConfigError, NotFoundError, UpstreamError };
