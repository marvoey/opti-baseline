'use strict';
const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('fs');
const path = require('path');

const INDEX = fs.readFileSync(path.join(__dirname, '..', 'public', 'index.html'), 'utf8');

async function withServer(fn) {
  const srv = await require('../server').start(0);
  try { await fn(`http://localhost:${srv.address().port}`); } finally { srv.close(); }
}

test('page routes (/news/, /news, /time-off/) are served the app, not "Not found"', () => withServer(async (base) => {
  for (const p of ['/', '/news/', '/news', '/time-off/', '/resources/?type=training']) {
    const r = await fetch(base + p);
    assert.equal(r.status, 200, p);
    assert.match(r.headers.get('content-type'), /text\/html/, p);
    assert.equal(await r.text(), INDEX, p);
  }
}));

test('missing files and unknown /api/ paths are still 404, and the API still answers', () => withServer(async (base) => {
  assert.equal((await fetch(`${base}/missing.js`)).status, 404);
  assert.equal((await fetch(`${base}/logo.png`)).status, 404);
  assert.equal((await fetch(`${base}/api/nope`)).status, 404);
  assert.equal((await fetch(`${base}/api/content`, { method: 'POST' })).status, 405);
}));

test('path traversal is refused and malformed escapes do not crash the server', () => withServer(async (base) => {
  // raw requests: fetch() would normalise the dots away
  const http = require('http');
  const get = (p) => new Promise((resolve, reject) => {
    const u = new URL(base);
    http.get({ host: u.hostname, port: u.port, path: p }, (res) => { res.resume(); res.on('end', () => resolve(res.statusCode)); }).on('error', reject);
  });
  // plain "../" is resolved away by URL parsing, so it can only ever reach public/, never the project root
  assert.equal(await get('/../server.js'), 404);
  assert.equal(await get('/%2e%2e/server.js'), 404);
  // an encoded slash survives URL parsing and is decoded by the server: the containment check must catch it
  assert.equal(await get('/..%2fserver.js'), 403);
  assert.equal(await get('/..%2f..%2f.env'), 403);
  assert.equal(await get('/%E0%A4%A'), 400);
  assert.equal((await fetch(`${base}/`)).status, 200); // still alive
}));

test('vercel.json: /preview keeps its own handler, other non-API paths fall back to index.html', () => {
  const v = JSON.parse(fs.readFileSync(path.join(__dirname, '..', 'vercel.json'), 'utf8'));
  assert.equal(v.rewrites[0].source, '/preview');
  assert.equal(v.rewrites[0].destination, '/api/preview-page');
  const last = v.rewrites[v.rewrites.length - 1];
  assert.equal(last.destination, '/index.html');
  const re = new RegExp('^' + last.source.replace(/^\//, '/') + '$');
  for (const p of ['/news/', '/news', '/time-off/', '/']) assert.ok(re.test(p), p);
  for (const p of ['/api/content', '/api/preview']) assert.ok(!re.test(p), p);
});
