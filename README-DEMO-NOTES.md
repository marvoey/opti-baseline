# Demo Notes

Reference material for the CIBC Mellon Agentic CMS demo. Not production code —
these docs inform demo design, content strategy, AI orchestration logic, and SDK usage.

Three directories:

| Directory | Purpose |
|---|---|
| `demo-notes-1/` | Challenger Sale strategy, POC delivery playbook, and formal RFP documents |
| `demo-notes-2/` | Agentic CMS architecture, trigger queries, retrieval logic, wireframes, prototypes |
| `demo-notes-3/` | Seed files and seeding process — how demo content gets into CMS |
| `demo-notes-0/` | Optimizely JavaScript SDK tutorial series (installation → advanced querying) |

---

## demo-notes-1 — Challenger Sale & RFP Materials

Strategic pitch materials and formal RFP documents. Establishes the commercial
narrative, the June 25 POC delivery plan, and the official Optimizely RFP responses.

### Strategic narrative

| File | What it covers |
|---|---|
| `critical-business-issues.md` | Five quantified business drivers — the "why they can't wait" foundation for the entire pitch |
| `agility-gap.md` | Defines the "Agility Gap" concept across four dimensions and maps each to an Optimizely solution |
| `strategic-evolution-map.md` | Challenger reframe ladder: each literal RFP requirement elevated to a C-suite commercial narrative, with a three-step talking script |
| `commercial-insights.md` | The four Challenger commercial insights — reframes the platform as an "Operational Command Center" to reach COO and CRO, not marketing |
| `cms-block-alignment.md` | Maps each commercial insight to a CIBC-prefixed CMS content type (`CibcAlertFeed`, `CibcAssetGrid`, `CibcRegulatoryDirective`, `CibcOnboardingJourney`) |
| `poc-operational-strategy.md` | Scene-by-scene June 25 demo playbook across three scenarios: T+1 Emergency, Private Market Asset Intake, OSFI Compliance Moat |

### RFP documents (`rfp/`)

| File | What it covers |
|---|---|
| `rfp/rfp-section-1-introduction.md` | CIBC Mellon's official RFP: company context, scope of work, 16 DXP + 13 DAM capability requirements |
| `rfp/schedule-a-third-party-response.md` | Optimizely's formal responses to all 19 RFP questionnaire sections: org profile, certifications, fees, AI governance, ESG, DEI |
| `rfp/schedule-b-governance-controls.md` | Security due diligence — 19 control domains with Optimizely's compliance responses, including the detailed AI governance section (Table 17) |
| `rfp/schedule-d-business-requirements.md` | Feature compliance matrix — ~55 requirements each scored 0–3; underpins Schedule A |

---

## demo-notes-2 — CIBC Mellon Demo Strategy

Strategy and engineering notes for the Agentic CMS demo. The core argument: a modern
CMS should shift from static page destination to an **intent-driven assembly engine**
where AI maps a user query to a layout, fetches governed content blocks, and composes
a deterministic response.

### Markdown docs

#### `agentic-cms-blueprint.md`

The master architecture document. Defines the conceptual model that the demo is built on:

- **Six universal intents** that act as AI assembly triggers: Discover/Recommend,
  Educate/Enable, Resolve/Support, Simulate/Transact, Create/Synthesize, Govern/Review.
- **Five layout skeletons** that each intent maps to: Sidebar 25/75, Split 60/40,
  Grid/Masonry, Hero/Feature, Sequential Feed.
- **Four atomic building blocks**: Prose/Typography, Action/Interactive, Card/Item
  Container, and Global Compliance (AI-uneditable, auto-injected by governance rules).
- **Multi-industry scenario examples** (Financial Services, Healthcare, Retail, etc.)
  showing how the same intent → layout → block pattern applies across verticals.
- **Stacking patterns** — how layouts compose into full-page experiences: "Daily
  Briefing" (Hero + Grid + Feed), "Learn & Execute" (Sidebar + Split), "Infinite
  Agentic Scroll" (conversational stacking).

#### `trigger-queries.md`

The demo script. Realistic institutional queries that drive each of the three core
demo architectures. Each query is tagged with extracted entity values (intent, persona,
geo, service) showing how the AI parses natural language into CMS query parameters.

| Demo stack | Anchor query | Intent | Layout |
|---|---|---|---|
| Strategic Expansion | *"What custody and FX services do we need to expand a Canadian mid-cap fund into European Equities?"* | `discover_recommend` | Hero → Sidebar → Grid → Action |
| Regulatory Impact | *"Summarize the new Canadian regulatory reporting requirements for digital assets and ESG."* | `educate_govern` | Split → Timeline → Full-Width Compliance |
| Complex Onboarding | *"Initiate an RFP for pension fund recordkeeping."* | `simulate_transact` | Hero Stepper → Split Form → Grid |

Ten variation rows per anchor query demonstrate how small changes to phrasing shift
the extracted persona, geo, or service tags — and therefore which content blocks are fetched.

#### `sidebar-retrieval-logic.md`

Engineering spec for how the AI assembles the 25/75 Sidebar layout (Educate/Govern
intent) without hallucination. Four sequential steps:

1. **Entity extraction** — natural language query → `intent`, `geo`, `domain` taxonomy tags.
2. **Deterministic CMS query** — fetches `Paragraph` blocks matching those tags (pseudo-SQL shown).
3. **Governance Lock** — a hardcoded rule fires a second query for `ComplianceBlock` matching
   the geo tag, injects the result at a fixed position. Legal team owns the disclaimer in one place.
4. **Domino Effect** — the sidebar nav is not fetched from the CMS; it is auto-generated by
   scanning the `<h2>`/`<h3>` headings already placed in the main column.

#### `taxonomy-values.md`

Canonical enumeration of all valid taxonomy field values. The definitive lookup table
for tagging content items in the CMS.

- **Intent:** `discover_recommend`, `educate_govern`, `simulate_transact`
- **Persona:** `asset_manager`, `pension_fund`, `corporate_sponsor`, `foreign_institution`, `insurance_provider`
- **Geo:** `canada`, `europe`, `united_states`, `global`
- **Service (per intent):** covers 14 service domains including `fund_administration`,
  `foreign_exchange`, `regulatory`, `digital_assets`, `esg`, `onboarding`, `compliance`, and others.

These values are mirrored in the TypeScript content type definitions in `cms/BasicBlocks/`.

#### `trigger-queries-discover-recommend.md`

A focused extract of the Strategic Expansion query set (the `discover_recommend`
stack only). Useful as a standalone reference or prompt seed when working only on
the Hero → Sidebar → Grid layout.

#### `prompts/content-research.md`

Guardrail prompt for AI-assisted content authoring. Enforces a source priority order
(CIBC Mellon official → BNY → CIBC → government/regulatory → reputable institutional)
and prohibits inventing products, platform names, fees, performance figures, regulatory
requirements, or technology features. Apply this context whenever drafting or fact-checking
CIBC Mellon content. Also available as a Claude Code skill: `cibc-content-research`.

### HTML prototypes (`html/`)

Interactive HTML files — open directly in a browser.

| File | What it shows |
|---|---|
| `developer-wireframes.html` | Three annotated layout skeleton wireframes: Strategic Expansion Briefing, Regulatory Impact Assembly, Complex Onboarding Workflow. Developer reference. |
| `challenger-sale-reframe.html` | Challenger Sale pitch page. Reframes the conversation from feature-sell to strategic enablement. |
| `sidebar-layout-overview.html` | Diagram of the 25/75 Sidebar assembly — shows how Prose Block, Governance Lock (Compliance Block), and auto-generated Nav Block relate. |
| `layout-demo.html` | Live Agentic CMS playground. Renders real layout examples (Sidebar, Split) using Optimizely brand styles. |

### Wireframes (`wireframes/`)

Three PNG screenshots captured 2026-07-21 of the wireframe and layout demo pages.

---

## demo-notes-3 — Seed Files & Seeding Process

Engineering reference for how the demo content library gets populated into Optimizely CMS.
Covers the `seeds/` directory structure, the two seed scripts, npm shorthand commands,
required env vars, content taxonomy, and recommended seeding order.

### `Seed Files & Seeding Process.md`

Single file covering:

- **Directory structure** — annotated tree of all `seeds/` contents
- **Two seed file types** — experience JSON (Visual Builder compositions) vs library item JSON (standalone content items)
- **Reference types** — `$file`, `$richTextFile`, `$env` for inlining HTML and env-specific folder keys
- **Scripts** — `seed-paragraphs.mjs`, `seed-heroes.mjs`, `seed-experience.mjs` with `--dry-run` and `--limit` flags explained
- **npm shorthand commands** — all `seed:*` targets from `package.json`
- **Required env vars** — auth credentials and CMS folder keys
- **Content taxonomy** — Intent / Persona / Geo / Service values used for runtime filtering
- **Key generation** — one-liner for stable, idempotent CMS content keys
- **Seeding order** — recommended sequence to avoid broken references

---

## demo-notes-0 — Optimizely SDK Tutorial Series

Sequential tutorial for building a Next.js + Optimizely CMS SaaS application from
scratch using `@optimizely/cms-sdk` v2. Read in order for a full walkthrough; jump
to individual files for API reference.

### Numbered tutorial steps

| File | Topic |
|---|---|
| `1-installation.md` | Install the CLI and SDK; scaffold a Next.js project with TypeScript + App Router |
| `2-setup.md` | Create a CMS API key; configure `.env`; create `optimizely.config.mjs` |
| `3-modelling.md` | All 14 property types; `mayContainTypes`; the contracts system (extending, merging, relationships) |
| `4-create-content.md` | Create a content item in the CMS UI; create an Application; set a start page |
| `5-fetching.md` | Register content types; `getContentByPath`; `getContent`; full `GraphClient` API |
| `6-rendering-react.md` | Typed React components with `ContentProps`; `initReactComponentRegistry`; `withAppContext`; `setContext`/`getContext` |
| `7-live-preview.md` | `/preview` route with `getPreviewContent`; `<PreviewComponent>`; `pa()` click-to-edit overlays; `getPreviewUtils` |
| `8-experience.md` | Visual Builder experiences; `_experience`/`_section` base types; `compositionBehaviors`; custom row/column render props |
| `9-display-settings.md` | `displayTemplate()` targeting baseType/contentType/nodeType; `select`/`checkbox` editor types; registration patterns |
| `10-richtext-component-react.md` | `<RichText>` props; all element and leaf types; HTML attribute normalisation |
| `11-dam-assets.md` | `damAssets()` helpers; `getSrcset`; `isDamImageAsset`; type-safe conditional rendering; Next.js `remotePatterns` |
| `12-client-utils.md` | `getPath()` for breadcrumbs; `getItems()` for navigation menus |
| `14-cli-commands.md` | Full CLI reference: all commands, flags, env vars, workflow recipes, troubleshooting |
| `13-agent-skills.md` | Four AI agent skills for CMS development (`optimizely-model`, `optimizely-model-react`, `optimizely-preview`, `optimizely-setup`) |

### Supplementary reference

| File | Topic |
|---|---|
| `content-type-definition-reference.md` | Complete `contentType()` grammar — all `baseType` discriminators, all property types with per-type extra fields, sourced from the SDK `.d.ts` files |
| `crafting-queries-filters-and-relationships.md` | GraphQL querying patterns: filter operators, AND/OR logic, `item` vs `items` for cache efficiency, Apollo stored queries |
| `observability.md` | OpenTelemetry tracing and metrics; all instrumented spans and their attributes; histogram and counter metrics |
