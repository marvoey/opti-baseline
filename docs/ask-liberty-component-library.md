# Ask Liberty: Component Library

**Source:** `public/use-case-1-ask-liberty.html`
**Scope:** every component needed to build the 8 page variations. The **header and footer are excluded**.
**Companion docs:** [Page-by-page component usage](./ask-liberty-page-components.md) · [Mockup overview](./use-case-1-ask-liberty.md)

Components are described at design level (what a designer or developer would build and reuse), not as raw HTML tags. In the page list, pages are numbered 0–7: 0 Home, 1 Rental car, 2 Required coverage, 3 Texas, 4 Burst pipe, 5 Bundling, 6 Claim status, 7 Legal question.

---

## Design tokens used by every component

| Token | Value | Used for |
|---|---|---|
| `navy` | `#1A1446` | Headings, dark buttons, step numbers |
| `lmy` (Liberty yellow) | `#FFD000` | Accent bars, warning icons, quote borders |
| `lmt` (teal) | `#06748C` | Primary buttons, links, icons |
| `lmtd` (dark teal) | `#045A6D` | Button hover, mist-pill text |
| `cream` / `creamb` | `#FFF8DB` / `#FFE680` | Callout and feature card background and border |
| `mist` | `#E6F4F6` | Soft teal backgrounds, pills, handoff banner |
| Gray band | `#F5F5F5` | Section bands, table headers |
| Font | Roboto (300/400/500/700) | All text |
| Type scale | H1 40–42px light · H2 30px light · body 14–17px | Headings use light weight; emphasis uses bold |

---

## A. Page shell and navigation

### C01 Ask bar
- **Purpose:** shows the question being answered and lets the visitor ask a new one.
- **Anatomy:** gray strip, rounded pill input with a search icon (pre-filled with the question), teal "Ask" button.
- **Behaviour:** Enter or button re-runs the keyword router (`reask`).
- **Built by:** `ask()` (line 528), placed with `data-c="ask"`.
- **Pages:** 1–7.

### C02 Breadcrumb trail
- **Purpose:** shows where the answer sits in the topic tree.
- **Anatomy:** small gray text: "Answers › Section › Topic", all but the last item as links.
- **Variants:** "Answers" plus 2 topic levels (pages 1, 2, 4, 5, 6, 7) or plus 3 topic levels (page 3, which ends in "Texas").
- **Built by:** `crumb()` (line 531), `data-c="crumb"`.
- **Pages:** 1–7.

### C03 Page title block
- **Purpose:** the headline and the short direct answer.
- **Anatomy:** centered H1 (40px light) and a lead paragraph. The lead is streamed in word by word during the reveal.
- **Variants:**
  - standard (pages 1, 2, 4, 5, 6)
  - with a state pill above the H1 (page 3, see C22)
  - with two buttons below the lead (page 7)
- **Pages:** 1–7. (Home uses C06 instead.)

### C04 Section heading
- **Purpose:** introduces a block of content.
- **Anatomy:** centered H2 (30px light), with optional gray supporting paragraph.
- **Variants:** with supporting text (pages 1, 2, 4 first heading) or heading only (pages 0, 3, 4 second heading, 5, 6, 7).
- **Pages:** 0–7 (page 4 uses it twice).

### C05 Accent bar
- **Purpose:** small yellow rule under a heading. Gives the site its visual signature.
- **Anatomy:** 44px × 4px rounded bar. Left-aligned, or centered inside stat cards.
- **Behaviour:** animates in by growing in width.
- **Pages:** 1 (×1), 2 (×1), 3 (×4), 4 (×1), 5 (×4). Counts include the bars inside C09, C18 and C19.

---

## B. Home-only components

### C06 Search hero
- **Purpose:** the starting point for asking a question.
- **Anatomy:** H1 "Get clear answers about your insurance", subtitle, large pill input with search icon, teal "Ask" button. The input turns teal on focus.
- **Behaviour:** `submitHome()` routes the typed question; an empty box uses the rental car question.
- **Pages:** 0.

### C07 Suggested-question chips
- **Purpose:** one-click example questions.
- **Anatomy:** row of 4 outlined pill buttons that turn teal on hover.
- **Pages:** 0.

### C08 Question tile grid
- **Purpose:** browsable popular questions.
- **Anatomy:** gray band with C04 heading, then a 3-column grid of 6 white tiles. Each tile has a category label (CAR, HOME, BUNDLES, CLAIMS), the question and "Get the answer ›".
- **Pages:** 0.

---

## C. Answer content

### C09 Answer block
- **Purpose:** the main explanation.
- **Anatomy:** two-tone H2 (bold first line, light second line), C05 accent bar, 1–2 body paragraphs.
- **Pages:** 1–5.

### C10 Answer + sidebar layout
- **Purpose:** pairs the explanation with a helpful side panel.
- **Anatomy:** 2-column grid: C09 on the left (flexible), C11 on the right (340px). Stacks on mobile.
- **Pages:** 1–5.

### C11 Callout panel
- **Purpose:** side panel with practical next steps.
- **Anatomy:** cream card with a title and one of 4 bodies:

| Variant | Content | Page |
|---|---|---|
| Checklist | 4 check items plus a text link | 1 ("Before you pick up the keys"), 3 ("Coverages Texas drivers often add") |
| Text plus link | One paragraph and a link | 2 ("Not sure what you need?") |
| Numbered steps | C13 steps plus a full-width primary button | 4 ("If a pipe just burst") |
| Link list | 3 link-plus-description pairs | 5 (no title) |

### C12 Checklist item
- **Purpose:** short benefit or to-do line.
- **Anatomy:** teal check icon plus text. The same check icon is used inside table cells (see C15).
- **Built by:** `CHECK` constant plus `data-c="check"`.
- **Pages:** 1 (4 list items, 3 table cells), 3 (4 list items), 4 (2 table cells).

### C13 Numbered step list
- **Purpose:** ordered "what to do now" actions.
- **Anatomy:** navy numbered circle plus text, 4 items.
- **Pages:** 4.

### C14 Coverage table
- **Purpose:** compares situations or coverages with a typical outcome.
- **Anatomy:** bordered, rounded table made of grid rows (header plus 5 rows). Columns are 200px (name) / flexible (real-life example) / 180–190px (outcome). Alternate rows are striped. The name cell is a link or plain text.
- **Behaviour:** each row reveals one after another.
- **Pages:** 1 ("Coverage / Real-life example / Applies to your rental"), 4 ("Situation / Real-life example / Typically covered").

### C15 Status indicator (inside table cells)
- **Purpose:** the outcome column of C14.
- **Variants:**
  - **Positive:** check icon plus text ("Yes", "If on your policy")
  - **Mist pill:** teal text, soft teal background ("Optional coverage", "Separate flood policy", "With optional coverage")
  - **Gray pill:** neutral ("Varies by policy", "Usually not")
- **Pages:** 1, 4.

### C16 Feature card
- **Purpose:** highlights one idea, product or help option.
- **Anatomy:** cream card with optional C17 icon badge, title (18px medium), short description and optional "Learn more ›" link. Always used as a row of 3.
- **Variants:**
  - icon only, no link (page 2)
  - icon plus "Learn more" link (page 4)
  - icon plus quote link (page 5)
  - no icon, link only (page 6)
- **Pages:** 2, 4, 5, 6.

### C17 Icon badge
- **Purpose:** quick visual cue on a card.
- **Anatomy:** white circle (40px, or 56px on page 7) with a teal line icon.
- **Icon set:** `auto`, `home`, `condo`, `renters`, `life` are used. `pet`, `moto` and `biz` are defined but unused.
- **Built by:** `svgI()` with the `ICONS` map, `data-c="icon"`.
- **Pages:** 2 (auto, home, life), 4 (home, condo, renters), 5 (home, renters, condo), 7 (auto).

### C18 Stat card
- **Purpose:** show a key number with its meaning.
- **Anatomy:** bordered card with a large light figure (44px), centered C05 accent bar and a caption. Used as a row of 3.
- **Pages:** 3 ($30,000 · $60,000 · $25,000).

### C19 Benefit column
- **Purpose:** short selling point.
- **Anatomy:** title, C05 accent bar, one paragraph. Row of 3, no card background.
- **Pages:** 5 ("Save money", "One place to manage", "Flexibility").

### C20 Illustration banner
- **Purpose:** brand-friendly visual that sets the topic.
- **Anatomy:** 1200×340 SVG with a rounded frame and pale blue background. Scenes are built from reusable pieces: `car()`, `house()`, `tree()`, sun, road and rain drops.
- **Variants:** `road` (car, tree, sun, rental-agreement card), `house` (house, rain drops, trees), `family` (house, car, people, trees).
- **Built by:** `illo()` (line 537), `data-c="illo"` with `data-k`.
- **Pages:** 0 (family), 1 (road), 4 (house), 5 (family).

---

## D. Interactive and task components

### C21 State selector card
- **Purpose:** asks the visitor for the one missing detail.
- **Anatomy:** white shadowed card with a label, fake dropdown ("Select a state") beside a primary "See requirements" button, "Popular states" label with 10 state pills (Texas highlighted in teal), and a "Use my location" link.
- **Behaviour:** pulses twice for attention after build. Only the Texas pill and the main button work, and both start the short Texas flow.
- **Pages:** 2.

### C22 State pill
- **Purpose:** shows the chosen state and offers to change it.
- **Anatomy:** mist pill with a map-pin icon and "Texas · Change state" (underlined). Returns to page 2.
- **Pages:** 3.

### C23 State comparison panel
- **Purpose:** invites comparison with nearby states.
- **Anatomy:** gray rounded panel, title, 3 white link cards. Each shows the state name, minimum coverage (for example 25/50/25) and a "See … requirements ›" link.
- **Pages:** 3.

### C24 Account action card
- **Purpose:** secure routes to claim details.
- **Anatomy:** large rounded bordered card with a 48px mist icon circle (person or search icon), 24px light heading, description or form, and a button.
- **Variants:**
  - "Log in to track your claim": text, primary full-width button, "Create an account" link
  - "Look up a claim": C25 fields plus outline button
- **Pages:** 6 (×2).

### C25 Look-up form fields
- **Purpose:** identify a claim without logging in.
- **Anatomy:** a "Claim number" field and a two-up "Last name" and "ZIP code" row. Display only: they are styled boxes, not real inputs.
- **Pages:** 6.

### C26 Handoff banner
- **Purpose:** redirects an out-of-scope question to real help.
- **Anatomy:** mist rounded panel with C17 icon (56px), heading ("Were you just in an accident?"), text and a navy "Start a claim" button. Row layout on desktop, stacked on mobile.
- **Pages:** 7.

### C27 Answer link card
- **Purpose:** suggests approved answers related to a blocked question.
- **Anatomy:** whole card is a link: category label, title, description, "Read the answer ›". Used as a row of 3.
- **Note:** looks like a C08 tile but is bordered rather than shadowed and carries a description.
- **Pages:** 7.

---

## E. Buttons and trust content

### C28 Buttons
Not one component but a small family:

| Style | Look | Examples |
|---|---|---|
| Primary | Solid teal, white text, rounded | "View all car coverages" (p1), "See requirements" (p2), "Start a claim" (p4, full width), "Log in" (p6), "Start a claim" (p7) |
| Outline | Teal border and text | "Find my claim" (p6), "Talk to an agent" (p7) |
| Navy | Solid navy | "Start a claim" inside C26 (p7) |
| Text link | Teal, underlined (`lk`) | Used across all pages |
| Pill / chip | Rounded outline | See C07 and C21 |

- **Pages with C28 buttons:** 1, 2, 4, 6, 7. (The "Ask" button belongs to C01 and C06.)

### C29 Sources block
- **Purpose:** shows where the answer came from.
- **Anatomy:** top border, "Sources for this answer", numbered list (navy number circle, link title, domain, italic quote with yellow left border) and a small legal disclaimer.
- **Built by:** `sources()` (line 543), `data-c="sources"` with `data-s` (items split by `|`, fields by `~`).
- **Pages:** 1 (2 sources), 3 (2: Texas Department of Insurance and Liberty Mutual), 4 (2), 5 (2).

### C30 Related questions
- **Purpose:** keeps the visitor exploring.
- **Anatomy:** "People also ask" heading and a 3-column grid of bordered cards, each with a question and "Get the answer ›".
- **Built by:** `related()` (line 546), `data-c="related"` with `data-r`.
- **Pages:** 1, 2, 3, 4, 5, 6.

### C31 Helpful feedback row
- **Purpose:** collects quick feedback and shows freshness.
- **Anatomy:** "Was this answer helpful?", Yes and No pill buttons (not wired), and "Last reviewed October 2026" on the right.
- **Built by:** `helpful()` (line 548), `data-c="helpful"`.
- **Pages:** 1, 3, 4, 5, 6, 7.

---

## F. Loading experience (shown when a question is asked)

### C32 AI progress panel
- **Purpose:** shows the "assistant" working, which is the main story of the demo.
- **Anatomy:** white shadowed card containing:
  - an animated gradient avatar with a sparkle icon, an "ASK LIBERTY" label and the question echoed in quotes
  - a 4-step list: *Send question to Mark → Classify the question → Retrieve approved content → Build your answer*. Each step has a status icon (pending ring, spinning loader, teal tick or yellow "!") and a text line with animated dots while active
  - extras under steps: classification chips (mist, or cream for warnings), a shimmer skeleton while retrieving, retrieved item lines (tick or "!") and a gradient progress bar along the bottom
- **Behaviour:** collapses away when finished, then the page builds in (C33).
- **Built by:** `panelHTML()` (line 617), `runPanel()` (line 638), driven by `FLOWS`.
- **Pages:** 1–7 (not Home).

### C33 Staged reveal (behaviour, not a visual component)
- **Purpose:** makes the answer appear piece by piece.
- **Types:** `stream` (lead sentence word by word), `illo` (scale in), `accent` (grows), `row` and `li` (slide in from left), `card` (fade up), `leaf` (fade up).
- **Built by:** `collect()`, `prep()`, `build()`, `finish()` (lines 661–703). Types are detected from CSS classes, so new components inherit the animation if they use the same classes (`rounded-xl` or `rounded-2xl` for cards, `grid-cols-[200px…` for table rows).
- **Pages:** 1–7.

---

## Quick reference: components by group

| Group | IDs |
|---|---|
| A. Shell and navigation | C01 Ask bar · C02 Breadcrumb · C03 Title block · C04 Section heading · C05 Accent bar |
| B. Home-only | C06 Search hero · C07 Suggested chips · C08 Tile grid |
| C. Answer content | C09 Answer block · C10 Answer + sidebar · C11 Callout · C12 Checklist item · C13 Step list · C14 Coverage table · C15 Status indicator · C16 Feature card · C17 Icon badge · C18 Stat card · C19 Benefit column · C20 Illustration |
| D. Interactive and task | C21 State selector · C22 State pill · C23 State comparison · C24 Account card · C25 Look-up fields · C26 Handoff banner · C27 Answer link card |
| E. Buttons and trust | C28 Buttons · C29 Sources · C30 Related questions · C31 Helpful row |
| F. Loading | C32 AI progress panel · C33 Staged reveal |
