'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');
const http = require('http');
const { transform, authFor, fetchSite, buildQuery, ConfigError, NotFoundError, UpstreamError } = require('../lib/graph');

const fixture = JSON.parse(fs.readFileSync(path.join(__dirname, 'fixtures', 'graph-response.json'), 'utf8'));
const okFetch = (capture) => async (url, init) => {
  if (capture) Object.assign(capture, { url, init });
  return { ok: true, status: 200, text: async () => JSON.stringify(fixture) };
};

test('query asks for every section type and no named fragments', () => {
  const q = buildQuery();
  for (const t of ['CfaHeroBanner', 'CfaQuickLinksSection', 'CfaNewsListSection', 'CfaRecognitionSection', 'CfaEventsSection', 'CfaDirectorySection', 'CfaResourceLibrarySection', 'CfaTimeOffSection']) {
    assert.ok(q.includes(`... on ${t}`), t);
  }
  assert.ok(!/^\s*fragment\s/m.test(q));
});

test('transform: real Graph response -> front-end shape', () => {
  const s = transform(fixture);
  assert.equal(s.home.properties.SiteName, 'The Coop');
  assert.deepEqual(s.home.nodes.map((n) => n.contentType),
    ['CfaHeroBanner', 'CfaQuickLinksSection', 'CfaNewsListSection', 'CfaRecognitionSection', 'CfaEventsSection']);
  assert.deepEqual(s.pages.map((p) => p.routeSegment).sort(), ['directory', 'events', 'news', 'resources', 'time-off']);
  const by = (seg) => s.pages.find((p) => p.routeSegment === seg);
  assert.equal(by('news').nodes[0].properties.Articles.length, 6);
  assert.equal(by('directory').nodes[0].properties.People.length, 6);
  assert.equal(by('resources').nodes[0].properties.Documents.length, 6);
  assert.equal(by('events').nodes[0].properties.Events.length, 4);
  assert.equal(by('time-off').nodes[0].properties.DefaultHoursAvailable, 64);
  assert.equal(by('time-off').nodes[0].properties.BlockSundays, true);
  assert.ok(/Sundays/.test(by('time-off').nodes[0].properties.IntroText.html));
  assert.equal(by('news').properties.NavOrder, 10);
  assert.equal(s.includesDrafts, true);
});

test('transform: nested items are wrapped as { properties } and internals are stripped', () => {
  const art = transform(fixture).pages.find((p) => p.routeSegment === 'news').nodes[0].properties.Articles[0];
  assert.ok(art.properties.Headline);
  assert.equal(art.properties.__typename, undefined);
  assert.equal(art.properties._metadata, undefined);
  assert.ok(art.properties.Body.html.startsWith('<p>'));
});

test('transform: quick link Target becomes a hash route; an empty link (as Graph returns it) has a null href', () => {
  const clone = JSON.parse(JSON.stringify(fixture));
  const links = clone.data.CfaIntranetHome.items[0].composition.nodes.find((n) => n.component.Links).component.Links;
  links[0].Target = { url: { default: '/time-off/' }, text: 'x' };
  links[1].Target = { url: { default: 'https://example.com/a' }, text: null };
  const out = transform(clone).home.nodes.find((n) => n.contentType === 'CfaQuickLinksSection').properties.Links;
  assert.equal(out[0].properties.Target.href, '#/time-off');
  assert.equal(out[1].properties.Target.href, 'https://example.com/a');
  assert.equal(out[2].properties.Target.href, null); // Graph returns { url: { default: null } } for unset links
});

test('transform: keeps newest version per key and filters locale', () => {
  const clone = JSON.parse(JSON.stringify(fixture));
  const first = clone.data.CfaIntranetPage.items[0];
  const older = JSON.parse(JSON.stringify(first)); older._metadata.version = '1'; older.PageIntro = 'OLD';
  const sv = JSON.parse(JSON.stringify(first)); sv._metadata.locale = 'sv'; sv._metadata.key = 'other';
  clone.data.CfaIntranetPage.items.push(older, sv);
  const s = transform(clone, { locale: 'en' });
  assert.equal(s.pages.length, 5);
  assert.ok(!s.pages.some((p) => p.properties.PageIntro === 'OLD'));
});

test('transform: nothing returned -> NotFoundError with publish hint', () => {
  assert.throws(() => transform({ data: { CfaIntranetHome: { items: [] }, CfaIntranetPage: { items: [] } } }), (e) => e instanceof NotFoundError && /Publish/.test(e.message));
});

test('auth: single key by default, basic when app key + secret, explicit override, config errors', () => {
  assert.equal(authFor({ OPTIMIZELY_GRAPH_SINGLE_KEY: 'k' }).header, 'epi-single k');
  const b = authFor({ OPTIMIZELY_GRAPH_APP_KEY: 'a', OPTIMIZELY_GRAPH_SECRET: 's', OPTIMIZELY_GRAPH_SINGLE_KEY: 'k' });
  assert.equal(b.mode, 'basic');
  assert.equal(b.header, 'Basic ' + Buffer.from('a:s').toString('base64'));
  assert.equal(authFor({ GRAPH_AUTH_MODE: 'single', OPTIMIZELY_GRAPH_APP_KEY: 'a', OPTIMIZELY_GRAPH_SECRET: 's', OPTIMIZELY_GRAPH_SINGLE_KEY: 'k' }).mode, 'single');
  assert.throws(() => authFor({}), ConfigError);
  assert.throws(() => authFor({ GRAPH_AUTH_MODE: 'basic', OPTIMIZELY_GRAPH_APP_KEY: 'a' }), ConfigError);
  assert.throws(() => authFor({ GRAPH_AUTH_MODE: 'nope' }), ConfigError);
});

test('fetchSite: POSTs to /content/v2 with auth in a header, never in the URL', async () => {
  const cap = {};
  const site = await fetchSite({ OPTIMIZELY_GRAPH_SINGLE_KEY: 'SECRETKEY', OPTIMIZELY_GRAPH_GATEWAY: 'https://cg.example.com/' }, okFetch(cap));
  assert.equal(cap.url, 'https://cg.example.com/content/v2');
  assert.equal(cap.init.method, 'POST');
  assert.equal(cap.init.headers.Authorization, 'epi-single SECRETKEY');
  assert.ok(!cap.url.includes('SECRETKEY'));
  assert.ok(JSON.parse(cap.init.body).query.includes('CfaIntranetPage'));
  assert.match(site.source, /published content only/);
  assert.ok(site.generatedAt);
});

test('fetchSite: upstream failures become UpstreamError without leaking credentials', async () => {
  const env = { OPTIMIZELY_GRAPH_SINGLE_KEY: 'SECRETKEY' };
  await assert.rejects(fetchSite(env, async () => ({ ok: false, status: 401, text: async () => 'unauthorized' })), (e) => e instanceof UpstreamError && /401/.test(e.message) && !e.message.includes('SECRETKEY'));
  await assert.rejects(fetchSite(env, async () => ({ ok: true, status: 200, text: async () => JSON.stringify({ errors: [{ message: 'Cannot query field X' }] }) })), /Cannot query field X/);
  await assert.rejects(fetchSite(env, async () => { throw new Error('ECONNREFUSED'); }), /Could not reach/);
});

test('handler + local server end to end against a mock Graph', async () => {
  const { startMock } = require('../scripts/mock-graph');
  const mock = await startMock(0);
  Object.assign(process.env, { OPTIMIZELY_GRAPH_GATEWAY: `http://localhost:${mock.address().port}`, OPTIMIZELY_GRAPH_SINGLE_KEY: 'mock' });
  const app = await require('../server').start(0);
  const get = (p) => new Promise((resolve, reject) => http.get({ port: app.address().port, path: p }, (r) => { let b = ''; r.on('data', (c) => (b += c)); r.on('end', () => resolve({ status: r.statusCode, headers: r.headers, body: b })); }).on('error', reject));
  try {
    const api = await get('/api/content');
    assert.equal(api.status, 200);
    assert.equal(api.headers['cache-control'], 'no-store'); // fixture is Draft -> must not be CDN-cached
    const j = JSON.parse(api.body);
    assert.equal(j.pages.length, 5);
    const page = await get('/');
    assert.equal(page.status, 200);
    assert.ok(page.body.includes('/api/content'));
    delete process.env.OPTIMIZELY_GRAPH_SINGLE_KEY;
    const bad = await get('/api/content');
    assert.equal(bad.status, 500);
    assert.match(JSON.parse(bad.body).error, /OPTIMIZELY_GRAPH_SINGLE_KEY/);
  } finally { app.close(); mock.close(); }
});
