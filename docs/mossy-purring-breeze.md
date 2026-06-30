# Atomic design system (V1) for Optimizely Visual Builder

## Context

`cms/CibcHero.tsx` is a monolithic `_component` whose look (eyebrow pill, serif
headline, subtext, two CTAs, themed teal/stone shell) is baked in. We want to
recreate it — and future blocks like cards/CTAs — from **reusable atomic
elements** composed in a Visual Builder section/row/column grid, with
**display templates** providing the per-instance flexibility.

The repo has the block vocabulary (`_component` + `sectionEnabled`) but **no
`_section` type, no `OptimizelyGridSection` usage, and no row/column render
components** — those are net-new. This plan adds a `V1`-prefixed atomic system:
five atoms (Text, Button, Image, Icon, Divider) + Section/Row/Column primitives,
variants driven by single per-type display templates (settings, not tags), then
seeds a sample atomic hero so a working reference exists.

Decisions confirmed with the user: **`V1` prefix**, **settings-on-one-template
variants**, **atoms = Text/Button/Image/Icon/Divider + Section/Row/Column**,
**also seed a sample hero**.

## Conventions to follow (from existing code)

- Each `cms/*.tsx` exports the `contentType()`, its `displayTemplate()`(s), and a
  default React component (see `cms/CibcHero.tsx`, `cms/CibcAssetGrid.tsx`).
- Display templates use `contentType` (atoms/section) or `nodeType` (row/column)
  targeting, `isDefault: true`, `select`/`checkbox` editors. Component reads
  `displaySettings?.x` (typed `ContentProps<typeof Template>`).
- Reuse helpers: `OptiLink`/`ctaHref` (`cms/shared.ts`), `getPreviewUtils` (`pa`,
  `src`), the edit-guard href pattern + `__composition` self-marking from
  `cms/Hero.tsx`, `ComponentWrapper` (`cms/wrappers.tsx`).
- Map variant choices to existing **tokens** (`cibc-teal`, `cibc-teal-dark`,
  `cibc-gold`, `cibc-gold-bright`, `cibc-stone`, `cibc-ink`; `font-serif`,
  `font-sans`) — never raw hex — so the system stays rebrandable via `globals.css`.
- All atoms `_component` with `compositionBehaviors: ['elementEnabled', 'sectionEnabled']`.
- Push glob is `./cms/**/*.tsx` (`optimizely.config.mjs`); keep non-type helpers `.ts`.

## Files to create

Each atom: one `cms/V1<Name>.tsx` with content type + default display template +
component. Element components self-mark their block boundary via
`content.__composition` + `pa(block)` (grid does **not** wrap leaves — skill §4).

- **`cms/V1Text.tsx`** — `V1Text`. Field: `Text` (string, required, localized).
  Template `V1TextDefault` settings: `variant`
  (eyebrow|display|heading|title|body|caption), `tone`
  (default|muted|gold|onDark), `align` (left|center|right). Variant→tag+classes:
  - eyebrow → `<span>` pill `px-2.5 py-0.5 rounded-full text-xs font-semibold border border-cibc-gold/50 bg-cibc-gold/15 text-cibc-gold tracking-wide`
  - display → `<h1 class="font-serif text-4xl md:text-5xl font-semibold leading-tight">`; heading → `<h2 font-serif text-3xl>`; title → `<h3>`
  - body → `<p text-lg>`; caption → `<p text-sm>`. tone: muted `text-cibc-ink/70`, gold `text-cibc-gold`, onDark `text-white/70`.
- **`cms/V1Button.tsx`** — `V1Button`. Field: `Link` (link, required, localized;
  use `OptiLink`/`ctaHref`, edit-guard href like `Hero.tsx`). Template
  `V1ButtonDefault`: `variant` (primary|secondary|ghost), `size` (sm|md|lg).
  primary `bg-cibc-gold text-cibc-teal-dark font-bold rounded-lg hover:bg-cibc-gold-bright shadow-lg`; secondary `border border-cibc-teal/30 text-cibc-teal hover:bg-cibc-teal/5 rounded-lg font-bold`; ghost text-only. size: sm `px-4 py-2 text-sm` / md `px-6 py-3` / lg `px-7 py-3.5 text-lg`.
- **`cms/V1Image.tsx`** — `V1Image`. Fields: `Image` (contentReference,
  allowedTypes `['_image']`), `ImageUrl` (url override), `Alt` (string). Use
  `src()`; url-override precedence as in `Hero.tsx`. Template `V1ImageDefault`:
  `ratio` (auto|square|wide|portrait), `rounded` (none|md|lg|full), `fit` (cover|contain).
- **`cms/V1Icon.tsx`** — `V1Icon`. Fields: `Name` (string enum of a curated
  `lucide-react` whitelist, e.g. BarChart3/ChevronRight/ShieldCheck/...), `Label`
  (string, optional a11y). Template `V1IconDefault`: `size` (sm|md|lg|xl), `tone`
  (default|gold|teal|muted). Component maps `Name`→icon via a small explicit map
  (lucide-react is already a dep).
- **`cms/V1Divider.tsx`** — `V1Divider`. No content fields (pure presentation).
  Template `V1DividerDefault`: `weight` (hairline|thin|thick), `tone`
  (muted|gold), `spacing` (sm|md|lg). Renders `<hr>`.
- **`cms/V1Section.tsx`** — `V1Section` (`baseType: '_section'`, `properties: {}`).
  Template `V1SectionDefault` (contentType target): `theme` (dark|light|plain),
  `decoration` (none|chart), `padding` (sm|md|lg), `rounded` (checkbox).
  Renders `<section {...pa(content)} className={themeClasses}>` + optional
  decoration, then `<OptimizelyGridSection nodes={content.nodes} row={V1Row} column={V1Column} />`.
  theme dark `bg-linear-to-br from-cibc-teal to-cibc-teal-dark text-white`; light
  `bg-cibc-stone text-cibc-teal-dark`; shell `p-12 rounded-2xl overflow-hidden relative shadow-xl`.
- **`cms/gridContainers.tsx`** — `V1Row` + `V1Column` `StructureContainer`
  render fns (`{ node, children, displaySettings }`), each applying `pa(node)` and
  reading layout from `displaySettings`. Plus nodeType display templates
  `V1RowDefault` (nodeType `row`: `gap`, `align`, `justify`) and `V1ColumnDefault`
  (nodeType `column`: `gap`, `align`). These are passed directly to
  `OptimizelyGridSection` — **not** registered in the resolver.

## Files to modify

- **`cms/registry.ts`** — (1) add the six content types to `registeredContentTypes`;
  (2) add all eight display templates (`V1TextDefault`, `V1ButtonDefault`,
  `V1ImageDefault`, `V1IconDefault`, `V1DividerDefault`, `V1SectionDefault`,
  `V1RowDefault`, `V1ColumnDefault`) to `initDisplayTemplateRegistry([...])`;
  (3) add resolver entries `V1Text/V1Button/V1Image/V1Icon/V1Divider/V1Section`
  → their components. (Row/Column omitted — passed into `OptimizelyGridSection`.)
- **`optimizely.config.mjs`** — no change needed (glob already covers `cms/*.tsx`);
  `propertyGroups` stays `[]`.

## Seed a sample atomic hero

- **`scripts/seed-atomic-hero.mjs`** — reuse the OAuth client-credentials token
  flow from `scripts/fetch-openapi.mjs` (load `.env`, `POST {gateway}/oauth/token`).
  `POST /v1/content` with `contentType: 'ExperiencePage'`,
  `initialVersion.routeSegment: 'v1-atomic-hero'`, `container` from a
  `--container <key>` arg (or `OPTIMIZELY_SEED_CONTAINER` env), and
  `initialVersion.composition` = a `CompositionNode` tree:
  `experience → section(V1Section, displayTemplate V1SectionDefault {theme:dark,decoration:chart}) → row(V1RowDefault) → column(V1ColumnDefault) → [V1Text eyebrow, V1Text display, V1Text body, V1Button primary, V1Button secondary]`.
  Element nodes: `{ nodeType:'component', component:{ contentType:'V1Text', <ContentData properties> }, displaySettings:[{ displayTemplate:'V1TextDefault', settings:{ variant:'eyebrow', ... } }] }`.
  Then publish via `POST /v1/content/{key}/versions/{version}:publish`.
- **De-risk the node shape**: the exact `component`/`displaySettings` serialization
  is the one uncertain area. The script first GETs the composition of any existing
  experience (REST `/content/versions` or Graph) to mirror the real shape; falls
  back to the `CompositionNode` schema in `cms-openapi.json` if none exists. Treat
  this step as the most likely to need one iteration.

## Verification

1. `npm run config:push` — confirm the 6 content types + 8 display templates push
   without error (all new types, so no `--force` needed).
2. `node scripts/seed-atomic-hero.mjs --container <key>` — confirm 201 + publish 200.
3. `npm run dev`; visit the seeded clean URL (`/v1-atomic-hero/`). Confirm the
   atomic hero renders at high fidelity vs `CibcHero` (eyebrow pill, serif
   headline, subtext, gold primary + outline secondary, teal gradient shell).
4. Preview/edit (`/preview` with `ctx=edit`): confirm each atom is independently
   selectable (self-marked boundaries) and that changing a display setting
   (e.g. `V1Section.theme` dark→light, `V1Button.variant` primary→ghost) updates
   the render — proving the flexibility surface.
5. Save the assembled section as a **Blueprint** in VB for editor reuse.

## Out of scope (later slices)

Additional atoms (List, Quote, Badge-as-its-own-type), a `baseType: '_component'`
template for universal settings (margin/align across all atoms), and migrating
existing `Cibc*` blocks onto the atomic system.
