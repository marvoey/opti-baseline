# CIBC Mellon Demo Notes

Strategy and engineering reference for the CIBC Mellon Agentic CMS demo. These
documents define the conceptual model, the demo script, and the assembly logic
that drives the live prototype.

## Core argument

A modern CMS should shift from a static page destination to an **intent-driven
assembly engine**: the AI maps a natural language query to a layout skeleton,
fetches governed content blocks by taxonomy tags, and composes a deterministic
response — no hallucination, no free-form generation.

---

## Documents

### `agentic-cms-blueprint.md`

The master architecture document. Defines the universal model the demo is built on.

- **Six intents** that act as AI assembly triggers — Discover/Recommend,
  Educate/Enable, Resolve/Support, Simulate/Transact, Create/Synthesize, Govern/Review.
- **Five layout skeletons** — Sidebar 25/75, Split 60/40, Grid/Masonry, Hero/Feature,
  Sequential Feed — each paired to specific intents.
- **Four atomic building blocks** — Prose, Action, Card, and Global Compliance.
  Compliance blocks are AI-uneditable and auto-injected by governance rules.
- **Multi-industry examples** — shows the same intent → layout → block pattern
  across Financial Services, Healthcare, Retail, Airlines, and others.
- **Stacking patterns** — how layouts compose into full experiences: Daily Briefing
  (Hero + Grid + Feed), Learn & Execute (Sidebar + Split), Infinite Agentic Scroll.

### `trigger-queries.md`

The demo script. Three complete trigger query sets — one per demo stack. Each query
is tagged with the extracted entity values (intent, persona, geo, service) that drive
the CMS fetch.

| Stack | Anchor query | Intent | Layout |
|---|---|---|---|
| Strategic Expansion | *"What custody and FX services do we need to expand a Canadian mid-cap fund into European Equities?"* | `discover_recommend` | Hero → Sidebar → Grid → Action |
| Regulatory Impact | *"Summarize the new Canadian regulatory reporting requirements for digital assets and ESG."* | `educate_govern` | Split → Timeline → Full-Width Compliance |
| Complex Onboarding | *"Initiate an RFP for pension fund recordkeeping."* | `simulate_transact` | Hero Stepper → Split Form → Grid |

Ten variation rows per anchor query show how small phrasing changes shift the
extracted persona, geo, or service tags — and therefore which content blocks are fetched.

### `trigger-queries-discover-recommend.md`

Focused extract of the Strategic Expansion query set (Discover/Recommend intent only).
Use this as a standalone reference when working on the Hero → Sidebar → Grid layout
or as a seed when prompting content generation for that stack.

### `sidebar-retrieval-logic.md`

Engineering spec for how the AI assembles the 25/75 Sidebar layout (Educate/Govern
intent) without hallucination. Four sequential steps:

1. **Entity extraction** — maps the query to `intent`, `geo`, and `domain` taxonomy tags.
2. **Deterministic CMS query** — fetches `Paragraph` blocks matching those tags exactly.
3. **Governance Lock** — a hardcoded second query injects a `ComplianceBlock` at a fixed
   position. Legal owns the disclaimer text; the AI cannot touch it.
4. **Domino Effect** — the sidebar nav is not fetched from the CMS. It is auto-generated
   by scanning the `<h2>`/`<h3>` headings already placed in the main column.

### `taxonomy-values.md`

Canonical enumeration of all valid values for the four taxonomy axes. The source of truth
for tagging content items — mirrors the enums in `cms/BasicBlocks/`.

| Axis | Values |
|---|---|
| **Intent** | `discover_recommend`, `educate_govern`, `simulate_transact` |
| **Persona** | `asset_manager`, `pension_fund`, `corporate_sponsor`, `foreign_institution`, `insurance_provider` |
| **Geo** | `canada`, `europe`, `united_states`, `global` |
| **Service** | `fund_administration`, `foreign_exchange`, `treasury_services`, `etf_services`, `alternative_investments`, `securities_lending`, `global_custody`, `recordkeeping`, `esg`, `regulatory`, `tax`, `digital_assets`, `onboarding`, `compliance` |

---

## Prompts (`prompts/`)

### `prompts/content-research.md`

Guardrail prompt for AI-assisted CIBC Mellon content authoring. Enforces a strict
source priority order and prohibits inventing products, platform names, fees, performance
figures, regulatory requirements, technology features, or jurisdictional coverage.

Apply this context whenever drafting or fact-checking CIBC Mellon content. It is also
installed as the `cibc-content-research` Claude Code skill at `.claude/skills/cibc-content-research/`.

---

## HTML prototypes (`html/`)

Open directly in a browser. No build step required.

### `html/developer-wireframes.html`

Three annotated layout skeleton wireframes showing the block and slot structure for each demo stack:
- **Stack 1** — Strategic Expansion Briefing (Hero → Sidebar → Grid → Action)
- **Stack 2** — Regulatory Impact Assembly (Split → Timeline → Compliance)
- **Stack 3** — Complex Onboarding Workflow (Hero Stepper → Split Form → Grid)

Tailwind-styled. Developer reference for component placement and proportions.

### `html/challenger-sale-reframe.html`

A polished interactive pitch page designed for the Challenger Sale narrative. Reframes
the conversation from feature-sell to strategic enablement — positions CIBC Mellon as
an intent-driven operational infrastructure rather than a collection of point products.

### `html/sidebar-layout-overview.html`

Interactive diagram illustrating the 25/75 Sidebar assembly logic: how the Prose Block,
the Governance Lock (Compliance Block), and the auto-generated Nav Block relate to each
other and are assembled in sequence.

### `html/layout-demo.html`

Live Agentic CMS playground. Renders real layout examples (Sidebar, Split) with
Optimizely brand styles. Demonstrates the universal layout system across different
content scenarios including API documentation and patient triage intake.

---

## Wireframes (`wireframes/`)

Three PNG screenshots captured 2026-07-21 of the wireframe and layout demo pages.
Used for reference and presentation.
