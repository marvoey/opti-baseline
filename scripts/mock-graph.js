'use strict';
/**
 * Fake Optimizely Graph for local work without credentials.
 * Serves test/fixtures/graph-response.json (a real Graph response) at POST /content/v2,
 * then starts the app pointed at it.   npm run dev:mock
 */
const http = require('http');
const fs = require('fs');
const path = require('path');

const fixture = fs.readFileSync(path.join(__dirname, '..', 'test', 'fixtures', 'graph-response.json'));

function startMock(port = 4010) {
  const srv = http.createServer((req, res) => {
    if (req.method === 'POST' && req.url.startsWith('/content/v2')) {
      res.setHeader('Content-Type', 'application/json');
      return res.end(fixture);
    }
    res.statusCode = 404; res.end('{}');
  });
  return new Promise((r) => srv.listen(port, () => r(srv)));
}

if (require.main === module) {
  (async () => {
    const m = await startMock();
    process.env.OPTIMIZELY_GRAPH_GATEWAY = `http://localhost:${m.address().port}`;
    process.env.OPTIMIZELY_GRAPH_SINGLE_KEY = 'mock';
    await require('../server').start();
    console.log('Using mock Graph on port', m.address().port);
  })();
}
module.exports = { startMock };
