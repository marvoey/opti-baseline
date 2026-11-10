'use strict';
/**
 * GET /api/preview?key=&ver=&loc=&ctx=   (token: "Authorization: Bearer <preview_token>")
 * Returns the site JSON (same shape as /api/content) with the requested content version swapped in.
 * The preview token is issued by the CMS, lasts 5 minutes and is passed straight to Optimizely Graph.
 * Works as a Vercel Node function and (via server.js) locally.
 */
const { fetchPreview, ConfigError, NotFoundError, BadRequestError, AuthError } = require('../lib/graph');

function send(res, status, body) {
  res.statusCode = status;
  res.setHeader('Content-Type', 'application/json; charset=utf-8');
  res.setHeader('Cache-Control', 'no-store'); // drafts + per-user token: never cacheable
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Referrer-Policy', 'no-referrer');
  res.end(JSON.stringify(body));
}

module.exports = async function handler(req, res) {
  if (req.method && req.method !== 'GET' && req.method !== 'HEAD') return send(res, 405, { error: 'Method not allowed' });
  const url = new URL(req.url, 'http://localhost');
  const q = Object.fromEntries(url.searchParams);
  const bearer = /^Bearer\s+(\S+)$/i.exec(req.headers.authorization || '');
  const token = bearer ? bearer[1] : q.preview_token;
  try {
    send(res, 200, await fetchPreview({ ...q, token }));
  } catch (e) {
    const status = e instanceof BadRequestError ? 400 : e instanceof AuthError ? 401 : e instanceof NotFoundError ? 404 : e instanceof ConfigError ? 500 : 502;
    // never let the token reach logs or responses
    const msg = token ? String(e.message).split(token).join('[redacted]') : String(e.message);
    console.error('[api/preview]', status, msg);
    send(res, status, { error: msg });
  }
};
