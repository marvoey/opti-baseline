# Ask Liberty in the CMS: plan and outcome

**Source mockup:** `public/use-case-1-ask-liberty.html` (8 pages)
**Components:** `app/_components_liberty` (C01–C33, see [component library](./ask-liberty-component-library.md))
**Page-by-page spec:** [ask-liberty-page-components.md](./ask-liberty-page-components.md)
**Status:** all six steps done. Work is committed (`bdb6455`, `2626b50`) and pushed. The deployed site serves the new pages.

---

## 1. Goal

Rebuild the Ask Liberty mockup as real pages in the Optimizely CMS, using the Liberty components, so that:

- every Liberty component is a **section-enabled block** in Visual Builder (an editor drops one block straight on the canvas, with no section, row or column nesting);
- any block can be saved as a **shared (global) block** and reused;
- the home page is the Ask Liberty page, with the search hero and the "simulated retrieval" animation built into the page type itself.

Decisions made along the way:

| Decision | Choice |
|---|---|
| Which pages | All 8 (home plus 7 answer pages), as separate experiences |
| Repeated rows (table rows, cards, sources, tiles) | Small embedded item blocks, not JSON |
| Loading animation | Kept (progress card, then staged reveal) |
| Links in item blocks | A plain URL text field **and** a link picker; the plain URL wins |
| Home page type | New `Ask Liberty` experience type |
| Answer pages | Same experience type, with a "Page layout" choice |

---

## 2. What was built

### Page type: `Ask Liberty` (`AskLibertyExperience`, `_experience`)
File: `cms/liberty/AskLibertyExperience.tsx`

- **Home layout (default):** heading, subtitle, search box, suggested questions. Asking plays the four-step progress card (send, classify, retrieve, build), then opens the matching answer page.
- **Answer layout:** ask bar at the top, then the canvas builds in with the staged reveal. A new question from the ask bar goes to the home page as `/?q=…`, which plays the card and opens the right answer. Routing rules therefore live only on the home page.
- **Questions** are embedded `LibAskQuestion` items: question text, answer page URL (text and picker), keywords, classification chips, retrieved lines, warning style. A typed question goes to the first question (top to bottom) whose keyword appears in it, else the first question. Keywords are matched as plain text, never as patterns.
- **CMS preview and Visual Builder:** the ask flow, progress card, reveal and navigation are all switched off (any content with a `preview_token`). On-page-editing markers stay on the heading and subtitle.
- Other properties: `SkipAnimation`, `PageLayout`, `AskBarQuestion`, `AskPageUrl`, `MetaTitle`, `MetaDescription`, `Heading`, `Subtitle`, `Placeholder`, `ButtonLabel`.

### Blocks (all `_component` with `compositionBehaviors: ['sectionEnabled']`, prefixed `Lib`)

| Family (file) | Blocks |
|---|---|
| Shell (`LibShell.tsx`) | Ask bar, Breadcrumb, Title block (optional state pill and two buttons), Section heading, Accent bar |
| Answer (`LibAnswer.tsx`) | Answer block, Answer with sidebar, Callout panel, Step list, Coverage table, Feature cards, Stat cards, Benefit columns, Illustration |
| Home and task (`LibTask.tsx`) | Question tiles, State selector, State pill, State comparison, Account action card, Handoff banner, Answer link cards, Button, Related questions, Helpful row |
| Sources (`LibSourcesBlock.tsx`) | Sources |

That is 25 section-enabled blocks. Eleven small item types are embedded inside them and the page type (`LibCrumb`, `LibCoverageRow`, `LibFeatureCard`, `LibStatCard`, `LibBenefitColumn`, `LibQuestionTile`, `LibComparisonState`, `LibAnswerLinkCard`, `LibRelatedQuestion`, `LibSource`, `LibAskQuestion`). Together with the Ask Liberty page type and the four types that were already in the project (`Page`, `RichTextBlock`, `BlankExperience`, `BlankSection`) there are **41 code-defined types**.

Shared pieces: `cms/liberty/LibertyBlock.tsx` (page width, spacing and editing overlays for every block) and `cms/liberty/shared.ts` (property builders, `resolveHref`, spacing).

Rules every block follows:

- Empty CMS fields render empty. The demo copy is never used as a fallback.
- All links go through `safeHref`, so `javascript:` and `data:` URLs become `#`.
- Every block has a "Spacing above" choice.

### Small changes to existing components
`AiProgressPanel` (optional `onComplete`), `SearchHero` (optional `onSubmit`, `editAttrs`), `SuggestedChips` (optional `onSelect`). All are unused unless passed.

### Other
- `scripts/check-content-types.mjs` now scans `cms/` subfolders and reads type keys without paren matching. `npm run cms:check` reports 41 code types present in the CMS.

---

## 3. Content in the CMS

All pages are children of the start page.

| Page | Address | Content key |
|---|---|---|
| Ask Liberty (start page, home) | `/` | `c9cf418497da462aa824dfff683361e9` |
| Rental car | `/rental-car` | `f35d7bfb0b614567a9c874edb2894012` |
| Required coverage | `/required-coverage` | `59af857af6ea4862b832d13704f039b0` |
| Texas | `/required-coverage/texas` | `ab95184c5f354297a3acd982512897db` |
| Burst pipe | `/burst-pipe` | `863c6eabba494aca94d016a002354cf7` |
| Bundling | `/bundling` | `7eee3068a3174e28bc5fb77cd43aee3b` |
| Claim status | `/claim-status` | `78aaeaabc311478facbdb0aa6ec16e07` |
| Legal question | `/legal-question` | `82b45c6339bf417898412c2688ca672e` |

Shared blocks (in the shared assets folder `e56f85d0e8334e02976a2d11fe4d598c`):

| Block | Content key |
|---|---|
| Ask Liberty: Helpful row (shared), used on 6 pages | `f5f9beb024844ed7aa79df9f23f194c5` |
| Ask Liberty: Sources – Rental car | `e1a0e3dc69a34d6095c41bc580f5d16b` |

Test pages kept on purpose: "Liberty block test" (`/liberty-spike`, `4c8f15e551f849af948f8e1c5e5912a5`) and "Answer layout test" (`/answer-layout-test`, `2586057d7f7d4ddf9edfa74564f30925`).

`HOME_PAGE_CONTENT_ID` in `.env` is the Ask Liberty page. The app does not read it; the home page is found by asking Graph for `/` on the site's host.

---

## 4. Steps (all done)

1. **Push and deploy.** Done by the project owner.
2. **Remaining blocks.** 24 new section-enabled blocks (25 with Sources) plus item types, pushed with `npm run cms:push`.
3. **Answer pages.** "Page layout" choice on the Ask Liberty type, ask bar and reveal.
4. **Shared blocks.** Only the helpful row is identical across pages (6 of 7). Sources, related questions and the "other ways to get help" cards differ on every page, so they stayed inline.
5. **Build the pages.** Seven answer pages plus the home tile band; the home questions now point at the CMS pages.
6. **Housekeeping.** Check script updated, `.env` updated, work committed.

---

## 5. Differences from the mockup

- **Progress card on arrival.** In the mockup the card plays on the answer page. Here it plays on the home page (for a typed or clicked question), then the answer page builds in with the reveal.
- **Claim status cards stack.** The mockup puts the log-in and look-up cards side by side. As separate blocks they stack.
- **Every state opens Texas.** The state selector submits to the Texas page, so choosing Ohio also opens Texas. Only Texas has content, as in the mockup.
- **Links.** Most links inside answer pages go to `#`, as in the mockup. Linked: breadcrumb root, the state pill, the Texas breadcrumb step, and the home chips and tiles.
- **Odd tile kept.** "What should I do after a car accident?" opens the legal page, as in the mockup.
- **Search hero, suggested chips and progress panel** are part of the page type, not separate blocks.
- **One file per family**, not one file per block.

---

## 6. Things to know when editing

- **The CMS is shared with other sites.** Every type here is prefixed `Lib` (or is `AskLibertyExperience`). Never run `cms:push:all`. The normal `npm run cms:push` only pushes types that do not exist yet. To add a property to an existing type, use the CMS type-update tool (or the CMS UI) and mirror it in code.
- **Links in item blocks.** The tool used to fill in content cannot set a link-picker value inside an item block, so item types have both a plain `LinkUrl` text field and a `Link` picker. The plain URL wins.
- **Callout links** (in Answer with sidebar and Callout panel) are one text line each: `Label | Description | URL`, plain URL only.
- **Classification chips** on a question are one line each: `Label | Value`, or `Label | Value | warn` for yellow.
- **Dropdown values cannot be empty.** "No icon" on feature cards is the value `none`.
- **Property names are stable on purpose.** Renaming or removing a property on a type with content is a breaking change that needs the CMS's breaking-change flag and drops data.
- **Dev server.** `npm run dev` rewrites `lib/locales.generated.ts` from the CMS locale list. Restore it with `git checkout -- lib/locales.generated.ts` before committing. The CMS preview URL must point at `http://localhost:<PORT>/preview` for local testing.
- **Reveal flash.** On answer pages the full content can show for a moment before it hides and builds in, because the reveal runs after the page loads.
- **Building page content through the CMS tools.** Blocks placed on a page's canvas store embedded items in the raw form `{ "properties": { "Field": { "value": … } } }`. Top-level fields and plain text lists can be sent flat. A layout is sent as `composition: { nodeType: 'experience', layoutType: 'outline', nodes: [ { nodeType: 'component', layoutType: 'outline', component: { contentType, properties } } ] }`, and a shared block is referenced with `component: { reference: 'cms://content/<key>' }`.

---

## 7. How to test

1. Run `npm run dev` and open the site.
2. **Home:** click each suggested question and type a few sentences. The card should run for about 8 to 9 seconds, then open the answer page. Click each tile.
3. **Answer pages:** open each of the seven pages. The content should build in piece by piece and the lead should appear word by word. Compare with the mockup.
4. **Re-ask:** change the question in an answer page's ask bar. You should land on the home page, see the card, and arrive at the matching answer.
5. **Narrow window and reduced motion:** nothing should scroll sideways except the coverage table; reduced motion skips the animations.
6. **CMS preview:** the ask flow should be off, and you should be able to edit the heading and subtitle, add a block and see it update.
7. **Shared block:** change the helpful row's "Last reviewed" text, publish, and check it on every answer page.
8. Run `npx tsc --noEmit`, `npx eslint cms app/_components_liberty` and `npm run cms:check`.

---

## 8. Ideas for later

- A page per state (so Ohio and the others do not open Texas), or a lookup that routes by state.
- Side-by-side layout for the two claim cards, if a two-column block is acceptable.
- Real destinations for the `#` links.
- Tuning the keyword rules from real questions.
- Making sure the "Page layout" and "Spacing above" dropdowns show as dropdowns in the editor (not yet checked in the CMS UI).
