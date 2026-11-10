# The Coop - demo intranet (Optimizely CMS SaaS + Graph)

A demo Chick-fil-A team intranet. **Not production code.** Content is authored in Optimizely CMS (SaaS) as the `CFA:` content types, read through Optimizely Graph, and rendered by a static front end.

```
Browser  ->  public/index.html  ->  GET /api/content  ->  Optimizely Graph  <-  CMS (SaaS)
                (renders sections)     (serverless fn,        (https://cg.optimizely.com)
                                        keeps keys server-side)
```

No npm dependencies. Node 22+ (tested on Node 24).

## Run locally

```bash
npm test                 # 10 unit/integration tests, no network needed
npm run dev:mock         # http://localhost:3000 - fake Graph serving a real captured response, no keys needed

cp .env.example .env     # then fill in keys
npm start                # http://localhost:3000 - real Graph
```

The footer of every page shows the content source. If `/api/content` fails (no keys, 401, nothing published) the page falls back to a built-in snapshot and the footer says why.

## Deploy to Vercel

1. Push this folder to a Git repo (or run `vercel` from it).
2. New Vercel project -> **Framework Preset: Other**. Leave build/install commands empty. `vercel.json` already sets `outputDirectory: public`.
3. Add environment variables (see below) and deploy.
4. Open the deployment URL. Check the footer: it should read `Content source: Optimizely Graph (...)`.

Create this as its **own** Vercel project. Do not add it to the `omni-custom` project.

### Environment variables

| Variable | Purpose |
|---|---|
| `OPTIMIZELY_GRAPH_GATEWAY` | Default `https://cg.optimizely.com` |
| `OPTIMIZELY_GRAPH_SINGLE_KEY` | Public key. Returns **published** content only |
| `OPTIMIZELY_GRAPH_APP_KEY` + `OPTIMIZELY_GRAPH_SECRET` | Admin credentials (HTTP Basic). Intended to return **drafts** too |
| `GRAPH_AUTH_MODE` | Optional `single` / `basic`. Default: `basic` if app key + secret are set, else `single` |
| `CONTENT_LOCALE` | Optional, default `en` |

Keys are provided when the Graph account is created. See [Authentication](https://docs.optimizely.com/graph/docs/authentication) and [Single key](https://docs.optimizely.com/graph/docs/single-key).

## Read this before deploying

- **All six CMS pages are currently `Draft`.** A single key returns nothing for drafts, so either publish the pages in the CMS or use app key + secret.
- **`/api/content` has no login.** With app key + secret it serves draft content to anyone who can reach the URL. Put app key + secret only on a deployment protected by Vercel Deployment Protection, and use the single key for anything public. Draft responses are sent with `Cache-Control: no-store`; published ones are cached 30 s at the edge.
- **Not yet verified:** a real Vercel deployment, and calls to Graph over HTTP with the Basic and single-key headers. The query itself was run against the live Graph instance and its response is the test fixture. The docs do not state explicitly that Basic auth returns drafts (they do for HMAC) - check this on first run, and switch to HMAC signing if it does not.

## Where things are

| Path | What |
|---|---|
| `public/index.html` | The whole front end (hash-routed). One renderer per CMS section type, e.g. `R.CfaNewsListSection` |
| `api/content.js` | Vercel function. Also used by `server.js` locally |
| `lib/graph.js` | The GraphQL query, auth selection, and the Graph -> front-end transform |
| `server.js` | Local dev server (static + `/api/content`, tiny `.env` loader) |
| `scripts/mock-graph.js` | Fake Graph for offline dev |
| `test/` | Tests and `fixtures/graph-response.json` (real Graph response) |

## Changing content or types

- **Edit copy / add or reorder sections:** do it in the CMS. Pages are `CfaIntranetHome` and `CfaIntranetPage`; sections are the `Cfa...Section` components.
- **Add a field to an existing type:** add it to `SECTION_FIELDS` in `lib/graph.js` and use it in the matching renderer in `public/index.html`.
- **Add a new section type:** create it in the CMS, add an `... on CfaNewType { ... }` block to `SECTION_FIELDS`, and add `R.CfaNewType = (p) => ...` in `public/index.html`.

## Known limits

- The query reads **outline-layout** compositions (sections directly under the page), which is how these pages were created. Pages restructured into Visual Builder sections / rows / columns need deeper `composition.nodes` levels in `buildQuery()`.
- Pages are built from content **inline in the page**, not shared library items, so editors can't reuse an article or event across pages.
- Time off requests, RSVPs, shout-outs and training progress live in browser memory only and reset on refresh.
- Photos and files are not wired up (the CMS fields are empty).
- Page URLs in Graph resolve under the `omni-custom.vercel.app` host (the only CMS application). In-CMS preview for these pages needs a second CMS application (Settings > Applications > Hostnames) pointing at the new deployment, plus preview-token handling, which this demo does not implement.
- Graph needs to have indexed the content. If content looks stale, run the Graph reindex scheduled job in the CMS.
