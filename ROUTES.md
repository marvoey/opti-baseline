# Routes

All routes in this Next.js 16 App Router project. Public URLs reflect the proxy rewrite rules in `proxy.ts` — the default locale (`en`) is clean (no prefix); non-default locales are prefixed (e.g. `/fr/...`).

---

## Proxy (`proxy.ts`)

| Incoming URL | Action | Result |
|---|---|---|
| `/` | Redirect | `/kb-workspace` |
| `/en/...` | Redirect (canonical) | `/...` (strips default locale prefix) |
| `/fr/...`, `/sv/...`, etc. | Pass-through | `app/[locale]/...` with locale param set |
| `/...` (no locale) | Rewrite | `app/en/...` (injects default locale) |

Excluded from proxy (pass through as-is): `api`, `_next/static`, `_next/image`, `preview`, `kb-preview`, `admin`, `util`, `rationale`, `demo-v2`, `demo-flow`, `demo`, `kb`, `component-library`, and any path with a file extension.

---

## Pages

### CMS / Optimizely

| Public URL | File | Description |
|---|---|---|
| `/:slug*` | `app/[locale]/[[...slug]]/page.tsx` | Catch-all CMS renderer. Resolves slug against Optimizely Graph via `getContentByPath` and renders with `OptimizelyComponent`. Uses `React.cache` to share one Graph request between metadata generation and render. |
| `/preview` | `app/preview/page.tsx` | Optimizely live-preview / on-page-editing target for any CMS content type. Accepts standard preview params (`preview_token`, `key`, `ctx`, `ver`, `loc`). `force-dynamic`. |
| `/kb-preview` | `app/kb-preview/page.tsx` | CMS preview target specifically for knowledge-base content types. Renders taxonomy pills (LOB / Topic / Jurisdiction) and an Opal-style response bubble. `force-dynamic`. |

### KB Workspace

| Public URL | File | Description |
|---|---|---|
| `/kb-workspace/:slug*` | `app/[locale]/kb-workspace/[[...slug]]/page.tsx` | Force-dynamic catch-all. Reads the first slug segment, runs `twoPassResolve` against policy content, and renders `KbWorkspaceShell`. |
| `/kb-workspace/opal` | `app/[locale]/kb-workspace/opal/page.tsx` | Live Opal Knowledge Assistant chat UI. Submits questions to `POST /api/opal/trigger`, listens on `GET /api/opal/response` (SSE) for the structured payload, then fetches matching policy content from `/api/kb-content`. Client component. |
| `/kb-workspace/test` | `app/[locale]/kb-workspace/test/page.tsx` | Interactive KB filter UI. Lets users pick LOB, topic, and jurisdiction, then calls `fetchKbBlocks` server action against Optimizely Graph. Client component. |
| `/kb-workspace/cms` | `app/[locale]/kb-workspace/cms/page.tsx` | Architecture visualiser mapping an Opal response to the underlying CMS content model fields, with hover-to-highlight cross-linking. Client component. |
| `/kb-workspace/webhook` | `app/[locale]/kb-workspace/webhook/page.tsx` | Animated architecture visualiser for the async Opal webhook-and-tool flow. Simulates a 4-stage sequence with a live SVG diagram and JSON payload terminal. Client component. |

### Demo

| Public URL | File | Description |
|---|---|---|
| `/demo` | `app/demo/page.tsx` | Primary guided demo. A scripted multi-turn Opal consultant workspace for FL hail deductibles, a behind-the-scenes architecture panel, and a glass claim workflow with vendor dispatch. Client component. |
| `/demo/cms` | `app/demo/cms/page.tsx` | Architecture visualiser showing how an Opal chat response maps to CMS SaaS content model fields. Client component. |
| `/demo/webhook` | `app/demo/webhook/page.tsx` | Animated architecture diagram for the async Opal webhook flow. Identical structure to `/kb-workspace/webhook`. Client component. |
| `/demo-v2` | `app/demo-v2/page.tsx` | Simulated Progressive Intelligent Enablement Portal with Consult / Resolve / Simulate intent tabs and animated Optimizely content-assembly sequences. Client component. |
| `/demo-flow` | `app/demo-flow/page.tsx` | Full-screen 12-slide interactive presentation pitching the Optimizely × Progressive Agentic CMS concept. Keyboard/click navigable. Client component. |
| `/[locale]/demo-marketing` | `app/[locale]/demo-marketing/page.tsx` | Static mock Progressive car insurance landing page with hardcoded CMS block annotations (WayfindingBlock, ProseBlock, CardBlock, etc.) for demo purposes. |

### Admin

| Public URL | File | Description |
|---|---|---|
| `/admin` | `app/admin/page.tsx` | Lists all content types from the live CMS Management API, grouped by base type in a tabbed explorer. Highlights types registered in the codebase vs. CMS-only. Supports `?type=` for tab pre-selection. `force-dynamic`. |
| `/admin/[key]` | `app/admin/[key]/page.tsx` | Detail page for a single CMS content type. Fetches the full type definition from the Management API, falling back to the in-codebase registry. Percent-encoded keys are decoded (e.g. `graph:cmp_Tag`). `force-dynamic`. |
| `/admin/import-policies` | `app/admin/import-policies/page.tsx` | Reads `policies.json` from disk and renders `ImportDashboard` for bulk-importing policy blocks into Optimizely CMS. `force-dynamic`. |
| `/admin/policies-report` | `app/admin/policies-report/page.tsx` | Shows publish status of all policy blocks from `policies.json` against the live CMS. `force-dynamic`. |

### Component Library

| Public URL | File | Description |
|---|---|---|
| `/component-library` | `app/component-library/page.tsx` | Schema cards for the four Progressive CMS content types (CorePrinciple, JurisdictionalOverride, StatutoryDisclosure, ProceduralSafeguard) with property tables and type badges. Static. |
| `/component-library/previews` | `app/component-library/previews/page.tsx` | Side-by-side render previews of all eight Progressive CMS content types as annotated Opal response / CMS model field examples. Static. |

### Rationale

| Public URL | File | Description |
|---|---|---|
| `/rationale/approach` | `app/rationale/approach/page.tsx` | Renders `approach.md` from the `agentic-cms-html` directory as a prose article via `marked`. Server component. |
| `/rationale/scope` | `app/rationale/scope/page.tsx` | Renders `scope.md` from the `agentic-cms-html` directory as a prose article via `marked`. Server component. |

### Legacy KB

| Public URL | File | Description |
|---|---|---|
| `/kb` | `app/kb/page.tsx` | Simulated Progressive Enterprise Knowledge Portal showing the "before" state: search, faceted filtering (type/status/state/year/dept), document viewer, and browse views for LOB / recent updates / agent directory. Supports `?q`, `?doc`, `?browse` query params. All data is static. |

---

## API Routes

| URL | Method | File | Description |
|---|---|---|---|
| `/api/opal/trigger` | `POST` | `app/api/opal/trigger/route.ts` | Forwards the user's question to the Opal webhook (`OPAL_WEBHOOK_URL`) with Bearer token auth, initiating an async Opal agent workflow. Requires `OPAL_WEBHOOK_URL` and `OPAL_WEBHOOK_TOKEN` env vars. |
| `/api/opal/response` | `GET` | `app/api/opal/response/route.ts` | SSE stream (`text/event-stream`). Holds an open connection and pushes Opal's structured payload once the internal pub/sub store receives a message. Closes after first message or a 3-minute timeout. |
| `/api/kb-content` | `GET` | `app/api/kb-content/route.ts` | Fetches KB policy content from Optimizely Graph by LOB, topic, and optional jurisdiction. Assembles a `PolicyContent` object (corePrinciple, override, proceduralSafeguard, disclosure) with a two-pass jurisdiction fallback. Requires `?lob` and `?topic` query params (400 if missing). |
| `/api/tools/[name]` | `POST` | `app/api/tools/[name]/route.ts` | Dynamic Opal tool executor. Looks up a registered tool by `[name]` from the registry and invokes its handler with the parsed request body. Returns 404 for unknown tools, 400 for malformed JSON. Supports Opal's nested `{ parameters: {} }` body shape. |
| `/api/discovery` | `GET` | `app/api/discovery/route.ts` | Returns the Opal tool discovery manifest (list of registered tools) as JSON. |
