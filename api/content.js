'use strict';
/**
 * GET /api/content  ->  site JSON for the front end.
 * Works as a Vercel Node serverless function and (via server.js) locally.
 * Uses only plain Node response APIs so both runtimes behave the same.
 */
const { fetchSite, ConfigError, NotFoundError } = require('../lib/graph');

function send(res, status, body, cache) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', cache);
  res.end(JSON.stringify(body));
}

module.exports = async function handler(req, res) {
  if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
    return send(res, 405, { error: 'Method not allowed' }, 'no-store');
  }
  try {
    const site = await fetchSite();
    // Drafts must never be cached by a shared CDN.
    const cache = site.includesDrafts ? 'no-store' : 's-maxage=30, stale-while-revalidate=300';
    send(res, 200, site, cache);
  } catch (e) {
    const status = e instanceof ConfigError ? 500 : e instanceof NotFoundError ? 404 : 502;
    console.error('[api/content]', e.message);
    send(res, status, { error: e.message }, 'no-store');
  }
};
