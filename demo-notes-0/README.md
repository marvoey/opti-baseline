# Optimizely JavaScript SDK Reference

Tutorial series and reference docs for `@optimizely/cms-sdk` v2, pulled from
the [episerver/content-js-sdk](https://github.com/episerver/content-js-sdk) repo.

Read the numbered files in order for a full walkthrough. Jump to individual files or
the supplementary reference docs for specific API lookups.

---

## Tutorial series

| # | File | What it covers |
|---|---|---|
| 1 | `1-installation.md` | Install the CLI and SDK; scaffold a Next.js project with TypeScript + App Router |
| 2 | `2-setup.md` | Create a CMS API key; configure `.env`; create `optimizely.config.mjs` with glob patterns and property groups |
| 3 | `3-modelling.md` | All 14 property types; `mayContainTypes`; the full contracts system — extending, merging precedence, and cross-type relationships |
| 4 | `4-create-content.md` | Create a content item in the CMS UI; create an Application; set a start page and clear the URL slug |
| 5 | `5-fetching.md` | Register content types; `getContentByPath`; `getContent` with GraphReference format; full `GraphClient` API |
| 6 | `6-rendering-react.md` | Typed React components with `ContentProps`; `initReactComponentRegistry`; `withAppContext`; `setContext`/`getContext` for request-scoped data without prop drilling |
| 7 | `7-live-preview.md` | `/preview` route with `getPreviewContent`; `<PreviewComponent>`; `pa()` click-to-edit overlays; `getPreviewUtils`; locale-aware preview |
| 8 | `8-experience.md` | Visual Builder experiences; `_experience` and `_section` base types; `compositionBehaviors`; custom row/column render props; mixing static properties with composed areas |
| 9 | `9-display-settings.md` | `displayTemplate()` targeting baseType/contentType/nodeType; `select` and `checkbox` editor types; `tag` property; both registration patterns |
| 10 | `10-richtext-component-react.md` | `<RichText>` all props; every element and leaf type; HTML attribute normalisation to React props |
| 11 | `11-dam-assets.md` | `damAssets()` helpers; `getSrcset`; `isDamImageAsset`; `getDamAssetType`; type-safe conditional rendering; Next.js `remotePatterns` config |
| 12 | `12-client-utils.md` | `getPath()` for breadcrumb building; `getItems()` for navigation menus; combined layout example |
| 13 | `13-agent-skills.md` | Four AI agent skills: `optimizely-model`, `optimizely-model-react`, `optimizely-preview`, `optimizely-setup` — installation and worked workflow examples |
| 14 | `14-cli-commands.md` | Full CLI reference: all commands and flags, env vars, workflow recipes (initial setup, sync, CI/CD), troubleshooting |

---

## Supplementary reference

### `content-type-definition-reference.md`

Complete grammar for `contentType()` sourced from the SDK `.d.ts` files. Covers:
- All `baseType` discriminators and the fields they unlock
- All 14 property types with their per-type extra fields
- Compound options: `enum`, `allowedTypes`/`restrictedTypes`, `array.items`
- Worked example using a real content type from this project

### `crafting-queries-filters-and-relationships.md`

GraphQL query authoring guide for Optimizely Graph. Covers:
- Filter operators: equality, comparison, string (`contains`/`match`), array limits
- AND/OR and nested logical operators
- Performance patterns: `item` instead of `items` with `limit: 1` for better cache hits
- Apollo stored-query templates

### `observability.md`

Built-in OpenTelemetry tracing and metrics. Zero-overhead (uses only `@opentelemetry/api`). Covers:
- Quick-start via `instrumentation.js`
- Every instrumented span (`get_by_path`, `get`, `get_preview`, `query.create`, `graph.request`, `component.resolve`, `react.render_component`) with all attributes
- All histogram and counter metrics
- Accessing metric instruments directly for custom recording

---

## Images (`images/`)

Screenshots referenced by the tutorial files showing the CMS UI at key steps:
`create-api-key.png`, `create-application.png`, `create-page-dialog.png`,
`create-page.png`, `dashboard.png`, `publish.png`, `save-your-secret.png`.
