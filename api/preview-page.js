'use strict';
/**
 * GET /preview  ->  the front end (public/index.html) with headers suited to being embedded
 * in the CMS UI. The page itself reads ?key=&ver=&loc=&ctx=&preview_token= and calls /api/preview.
 */
const fs = require('fs');
const path = require('path');
const { cmsOrigin } = require('../lib/graph');

const INDEX = path.join(__dirname, '..', 'public', 'index.html');

module.exports = function previewPage(req, res) {
  if (req.method && req.method !== 'GET' && req.method !== 'HEAD') {
    res.statusCode = 405;
    return res.end('Method not allowed');
  }
  // Only the CMS (origin from config, never from the request) may frame this page.
  // Do not also send X-Frame-Options: it would override frame-ancestors in some browsers.
  const origin = cmsOrigin();
  if (!origin) console.warn('[preview] OPTIMIZELY_CMS_URL is not set to an https URL - the CMS will not be allowed to embed /preview.');
  res.setHeader('Content-Security-Policy', `frame-ancestors 'self'${origin ? ' ' + origin : ''}`);
  res.setHeader('Referrer-Policy', 'no-referrer'); // the URL carries the preview token
  res.setHeader('Cache-Control', 'no-store');
  res.setHeader('X-Robots-Tag', 'noindex');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  fs.readFile(INDEX, (err, buf) => {
    if (err) { res.statusCode = 500; return res.end('Preview page unavailable'); }
    res.end(req.method === 'HEAD' ? undefined : buf);
  });
};
