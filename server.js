'use strict';
/** Local dev server: serves ./public, /api/content, /preview and /api/preview. `npm start` -> http://localhost:$PORT (default 3000) */
const http = require('http');
const fs = require('fs');
const path = require('path');

// tiny .env loader (no dotenv dependency). Earlier files win: .env.omni, then .env
for (const name of ['.env.omni', '.env']) {
  try {
    for (const line of fs.readFileSync(path.join(__dirname, name), 'utf8').split(/\r?\n/)) {
      const m = line.match(/^\s*([A-Za-z_][A-Za-z0-9_]*)\s*=\s*(.*?)\s*$/);
      // skip empty values so a blank line in .env can't shadow a real value in another file
      if (m && m[2] && !line.trim().startsWith('#') && process.env[m[1]] === undefined) process.env[m[1]] = m[2].replace(/^["']|["']$/g, '');
    }
  } catch { /* file missing - fine */ }
}

const content = require('./api/content');
const preview = require('./api/preview');
const previewPage = require('./api/preview-page');
const PUBLIC = path.join(__dirname, 'public');
const TYPES = { '.html': 'text/html; charset=utf-8', '.js': 'text/javascript', '.css': 'text/css', '.json': 'application/json', '.svg': 'image/svg+xml', '.png': 'image/png', '.ico': 'image/x-icon' };

function start(port = process.env.PORT || 3000) {
  const server = http.createServer((req, res) => {
    const url = new URL(req.url, 'http://localhost');
    if (url.pathname === '/api/content') return content(req, res);
    if (url.pathname === '/api/preview') return preview(req, res);
    if (url.pathname === '/preview') return previewPage(req, res);
    let pathname;
    try { pathname = decodeURIComponent(url.pathname); } catch { res.statusCode = 400; return res.end('Bad request'); }
    const rel = pathname === '/' ? '/index.html' : pathname;
    const file = path.normalize(path.join(PUBLIC, rel));
    if (file !== PUBLIC && !file.startsWith(PUBLIC + path.sep)) { res.statusCode = 403; return res.end('Forbidden'); }
    const send = (f, buf) => { res.setHeader('Content-Type', TYPES[path.extname(f)] || 'application/octet-stream'); res.end(buf); };
    fs.readFile(file, (err, buf) => {
      if (!err) return send(file, buf);
      // Page routes (/news/, /time-off, ...) are rendered by the front end: hand them index.html.
      // Missing files (with an extension) and unknown /api/ paths stay 404.
      if (!path.extname(pathname) && !pathname.startsWith('/api/')) {
        return fs.readFile(path.join(PUBLIC, 'index.html'), (e2, html) => {
          if (e2) { res.statusCode = 404; return res.end('Not found'); }
          send('index.html', html);
        });
      }
      res.statusCode = 404; res.end('Not found');
    });
  });
  return new Promise((resolve) => server.listen(port, () => {
    console.log(`The Coop running at http://localhost:${server.address().port}`);
    resolve(server);
  }));
}

if (require.main === module) start();
module.exports = { start };
