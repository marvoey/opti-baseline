'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const http = require('http');

const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'graph-response.json'), 'utf8'));
const HOME = fixture.data.CfaIntranetHome.items[0];
const NEWS = fixture.data.CfaIntranetPage.items.find((p) => p._metadata.displayName === 'News');
const HOME_KEY = HOME._metadata.key;
const NEWS_KEY = NEWS._metadata.key;
const TOKEN = 'eyJhbGciOi.preview-token_value.sig';

/* a Graph response for a preview query: requested item(s) + the normal site data */
const previewResponse = ({ home = [], page = [] } = {}) => ({
  data: {
    PreviewHome: { items: home },
    PreviewPage: { items: page },
    SiteHome: fixture.data.CfaIntranetHome,
    SitePages: fixture.data.CfaIntranetPage,
  },
});
const clone = (o) => JSON.parse(JSON.stringify(o));
const fakeFetch = (body, status = 200, capture) => async (url, init) => {
  if (capture) Object.assign(capture, { url, init, calls: (capture.calls || 0) + 1 });
  return { ok: status >= 200 && status < 300, status, text: async () => (typeof body === 'string' ? body : JSON.stringify(body)) };
};

const g = require('../lib/graph');

test('preview params: accepts GUIDs (with/without hyphens), defaults ctx, treats empty/neutral locale as none', () => {
  assert.deepEqual(g.parsePreviewParams({ key: HOME_KEY, ver: '212', loc: 'en', ctx: 'edit' }), { key: HOME_KEY, ver: '212', loc: 'en', ctx: 'edit' });
  assert.equal(g.parsePreviewParams({ key: '4F68AA9E-CE44-4EA8-87EC-63BF28C558B1', ver: '1' }).key, HOME_KEY);
  assert.equal(g.parsePreviewParams({ key: HOME_KEY, ver: '1' }).ctx, 'preview');
  assert.equal(g.parsePreviewParams({ key: HOME_KEY, ver: '1', loc: '' }).loc, null);
  assert.equal(g.parsePreviewParams({ key: HOME_KEY, ver: '1', loc: 'neutral' }).loc, null);
  assert.equal(g.parsePreviewParams({ key: HOME_KEY, ver: '1', loc: 'sv-SE' }).loc, 'sv-SE');
});

test('preview params: rejects bad key/ver/loc/ctx without echoing the input', () => {
  const bad = [
    { key: 'nope', ver: '1' },
    { key: HOME_KEY + 'z', ver: '1' },
    { key: HOME_KEY, ver: 'abc' },
    { key: HOME_KEY, ver: '12345678901' },
    { key: HOME_KEY, ver: '1; drop' },
    { key: HOME_KEY, ver: '1', loc: 'en" } } query { x' },
    { key: HOME_KEY, ver: '1', ctx: 'admin' },
    {},
  ];
  for (const q of bad) {
    assert.throws(() => g.parsePreviewParams(q), (e) => e instanceof g.BadRequestError && !/drop|query \{ x/.test(e.message), JSON.stringify(q));
  }
});

test('preview token: required, and malformed values are rejected', () => {
  assert.throws(() => g.parsePreviewToken(undefined), g.AuthError);
  assert.throws(() => g.parsePreviewToken(''), g.AuthError);
  assert.throws(() => g.parsePreviewToken('has space'), g.BadRequestError);
  assert.throws(() => g.parsePreviewToken('x'.repeat(4097)), g.BadRequestError);
  assert.equal(g.parsePreviewToken(TOKEN), TOKEN);
});

test('cmsOrigin: https origin only, taken from config', () => {
  assert.equal(g.cmsOrigin({ OPTIMIZELY_CMS_URL: 'https://app-abc.cms.optimizely.com/ui/x?y=1' }), 'https://app-abc.cms.optimizely.com');
  assert.equal(g.cmsOrigin({ OPTIMIZELY_CMS_URL: 'http://app.example.com' }), null);
  assert.equal(g.cmsOrigin({ OPTIMIZELY_CMS_URL: 'javascript:alert(1)' }), null);
  assert.equal(g.cmsOrigin({}), null);
});

test('query: key/version/locale are variables, never part of the query text', () => {
  for (const withLocale of [true, false]) {
    const q = g.buildPreviewQuery(withLocale);
    assert.ok(q.includes('$key') && q.includes('$ver'));
    assert.equal(q.includes('$loc'), withLocale);
    assert.ok(!q.includes(HOME_KEY));
  }
});

test('fetchPreview: sends a Bearer preview token + variables, and returns the requested home version', async () => {
  const cap = {};
  const out = await g.fetchPreview({ key: HOME_KEY, ver: '212', loc: 'en', ctx: 'preview', token: TOKEN },
    { OPTIMIZELY_GRAPH_GATEWAY: 'https://graph.test/' }, fakeFetch(previewResponse({ home: [clone(HOME)] }), 200, cap));
  assert.equal(cap.url, 'https://graph.test/content/v2');
  assert.equal(cap.init.headers.Authorization, `Bearer ${TOKEN}`);
  const body = JSON.parse(cap.init.body);
  assert.deepEqual(body.variables, { key: HOME_KEY, ver: '212', loc: 'en' });
  assert.ok(!body.query.includes(TOKEN) && !body.query.includes(HOME_KEY));
  assert.equal(out.preview.kind, 'home');
  assert.equal(out.preview.cmsOrigin, null);
  assert.equal(out.home.key, HOME_KEY);
  assert.equal(out.includesDrafts, true);
  assert.ok(out.pages.length >= 5);
});

test('fetchPreview: a previewed page replaces that page in the site; node ids are kept for the editor', async () => {
  const draft = clone(NEWS);
  draft._metadata.version = '300';
  draft.PageIntro = 'DRAFT INTRO';
  draft.composition.nodes.forEach((n, i) => { n.key = `node-${i}`; });
  const out = await g.fetchPreview({ key: NEWS_KEY, ver: '300', loc: 'en', ctx: 'edit', token: TOKEN },
    { OPTIMIZELY_CMS_URL: 'https://app-abc.cms.optimizely.com/ui' }, fakeFetch(previewResponse({ page: [draft] })));
  assert.equal(out.preview.kind, 'page');
  assert.equal(out.preview.routeSegment, 'news');
  assert.equal(out.preview.cmsOrigin, 'https://app-abc.cms.optimizely.com');
  const news = out.pages.filter((p) => p.key === NEWS_KEY);
  assert.equal(news.length, 1);
  assert.equal(news[0].properties.PageIntro, 'DRAFT INTRO');
  assert.equal(news[0].version, '300');
  assert.equal(news[0].nodes[0].id, 'node-0');
  assert.ok(out.home.key); // context home comes from the normal site data
});

test('fetchPreview: no locale -> locale variable omitted', async () => {
  const cap = {};
  await g.fetchPreview({ key: HOME_KEY, ver: '212', token: TOKEN }, {}, fakeFetch(previewResponse({ home: [clone(HOME)] }), 200, cap));
  assert.deepEqual(JSON.parse(cap.init.body).variables, { key: HOME_KEY, ver: '212' });
});

test('fetchPreview: missing token rejects BEFORE any network call', async () => {
  const cap = {};
  await assert.rejects(() => g.fetchPreview({ key: HOME_KEY, ver: '212' }, {}, fakeFetch({}, 200, cap)), g.AuthError);
  assert.equal(cap.calls, undefined);
});

test('fetchPreview: bad params reject before any network call', async () => {
  const cap = {};
  await assert.rejects(() => g.fetchPreview({ key: 'x', ver: '1', token: TOKEN }, {}, fakeFetch({}, 200, cap)), g.BadRequestError);
  assert.equal(cap.calls, undefined);
});

test('fetchPreview: Graph 401/403 -> AuthError, version not found -> NotFoundError, wrong version is not returned', async () => {
  const args = { key: HOME_KEY, ver: '212', loc: 'en', token: TOKEN };
  await assert.rejects(() => g.fetchPreview(args, {}, fakeFetch({ code: 'AUTHENTICATION_ERROR' }, 401)), g.AuthError);
  await assert.rejects(() => g.fetchPreview(args, {}, fakeFetch({}, 403)), g.AuthError);
  await assert.rejects(() => g.fetchPreview(args, {}, fakeFetch(previewResponse())), g.NotFoundError);
  const other = clone(HOME); other._metadata.version = '999';
  await assert.rejects(() => g.fetchPreview(args, {}, fakeFetch(previewResponse({ home: [other] }))), g.NotFoundError);
  await assert.rejects(() => g.fetchPreview(args, {}, fakeFetch({ errors: [{ message: 'boom' }] })), g.UpstreamError);
});

/* ---------- HTTP level: real server + fake Graph ---------- */

async function withServer(fn) {
  const seen = [];
  const graph = http.createServer((req, res) => {
    let b = '';
    req.on('data', (c) => (b += c));
    req.on('end', () => {
      seen.push({ auth: req.headers.authorization, body: JSON.parse(b || '{}') });
      if (req.headers.authorization === 'Bearer rejected-token-xyz') { res.statusCode = 401; return res.end('{"code":"AUTHENTICATION_ERROR"}'); }
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify(previewResponse({ home: [clone(HOME)] })));
    });
  });
  await new Promise((r) => graph.listen(0, r));
  // set before requiring server.js: its .env loader never overrides values that are already set
  process.env.OPTIMIZELY_GRAPH_GATEWAY = `http://localhost:${graph.address().port}`;
  process.env.OPTIMIZELY_CMS_URL = 'https://app-test.cms.optimizely.com/ui';
  const srv = await require('../server').start(0);
  const base = `http://localhost:${srv.address().port}`;
  try { await fn(base, seen); } finally { srv.close(); graph.close(); }
}

test('GET /preview serves the page, allows only the CMS to frame it, and is not cacheable', () => withServer(async (base) => {
  const r = await fetch(`${base}/preview?key=${HOME_KEY}&ver=212&loc=en&ctx=edit&preview_token=${TOKEN}`);
  assert.equal(r.status, 200);
  assert.match(r.headers.get('content-type'), /text\/html/);
  assert.equal(r.headers.get('content-security-policy'), "frame-ancestors 'self' https://app-test.cms.optimizely.com");
  assert.equal(r.headers.get('x-frame-options'), null);
  assert.equal(r.headers.get('referrer-policy'), 'no-referrer');
  assert.equal(r.headers.get('cache-control'), 'no-store');
  assert.match(await r.text(), /<main id="app">/);
}));

test('GET /api/preview: 401 without a token (Graph never called), 400 for bad ver, 200 with a token', () => withServer(async (base, seen) => {
  let r = await fetch(`${base}/api/preview?key=${HOME_KEY}&ver=212&loc=en`);
  assert.equal(r.status, 401);
  assert.equal(seen.length, 0);

  r = await fetch(`${base}/api/preview?key=${HOME_KEY}&ver=abc&loc=en`, { headers: { Authorization: `Bearer ${TOKEN}` } });
  assert.equal(r.status, 400);
  assert.equal(seen.length, 0);

  r = await fetch(`${base}/api/preview?key=${HOME_KEY}&ver=212&loc=en&ctx=edit`, { headers: { Authorization: `Bearer ${TOKEN}` } });
  assert.equal(r.status, 200);
  assert.equal(r.headers.get('cache-control'), 'no-store');
  const j = await r.json();
  assert.equal(j.preview.kind, 'home');
  assert.equal(j.preview.cmsOrigin, 'https://app-test.cms.optimizely.com');
  assert.equal(seen.length, 1);
  assert.equal(seen[0].auth, `Bearer ${TOKEN}`);
}));

test('GET /api/preview: token also accepted as ?preview_token=, Graph 401 -> 401 and the token never appears in the response', () => withServer(async (base) => {
  let r = await fetch(`${base}/api/preview?key=${HOME_KEY}&ver=212&loc=en&preview_token=${TOKEN}`);
  assert.equal(r.status, 200);
  r = await fetch(`${base}/api/preview?key=${HOME_KEY}&ver=212&loc=en&preview_token=rejected-token-xyz`);
  assert.equal(r.status, 401);
  const text = await r.text();
  assert.ok(!text.includes('rejected-token-xyz'));
  assert.ok(!text.includes('Bearer'));
  r = await fetch(`${base}/api/preview?key=${HOME_KEY}&ver=212`, { method: 'POST' });
  assert.equal(r.status, 405);
}));
