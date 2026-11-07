# Use Case 1: Ask Liberty (mockup documentation)

**File:** `public/use-case-1-ask-liberty.html`
**What it is:** A self-contained, clickable mockup of an "Ask Liberty" answer experience for the Liberty Mutual RFP. There is no backend. Every answer is hardcoded and the "AI" steps are timed animations.

At a glance: **8 answer pages**, **3 loading behaviours**, plus variations in entry point, layout and display mode.

---

## 1. The 8 page variations

| # | Page | Type | What it shows |
|---|---|---|---|
| 0 | **Home** | Landing | Search box, 4 suggested-question chips, 6 "Questions people are asking" tiles, family illustration. |
| 1 | **Rental car** | Standard answer | Headline answer, "Before you pick up the keys" checklist, 5-row coverage table, 2 sources, related questions, "Was this helpful?" row. Road illustration. |
| 2 | **Required coverage** | Clarify (asks the visitor something) | Can't answer without the visitor's state. Shows a "Where is your car registered?" card and state picker (only Texas works), then general info on what most states require. |
| 3 | **Texas** | Follow-up answer | Personalised answer after picking Texas: 30/60/25 explained, Texas-specific notes, comparison with Ohio, California and Pennsylvania, sources. |
| 4 | **Burst pipe** | Standard answer | Sudden vs. gradual damage, 4-step "if a pipe just burst" list, 5-row coverage table, 3 optional coverages, sources. House illustration. |
| 5 | **Bundling** | Standard answer | Home, renters and condo bundles, 3 benefit columns, sources. Family illustration. |
| 6 | **Claim status** | Safe handoff (privacy) | Will not show claim details without verification. Offers "Log in" and "Look up a claim" cards plus other help options. No sources section. |
| 7 | **Legal question** | Fallback (out of scope) | "We can't give legal advice." Points to Start a claim or Talk to an agent and suggests 3 related answers. No sources section. |

Pages are `<section class="page">` blocks in the HTML, in the order above. The page number is also the key used by `FLOWS` and `PAGES` in the script.

---

## 2. The 3 loading behaviours

Asking a question plays a progress card with 4 steps (send question, classify, retrieve approved content, build answer). The card then collapses and the page builds in piece by piece. The steps vary in 3 ways:

| Behaviour | Used by | How it differs |
|---|---|---|
| **Standard** | Flows 1, 4, 5 | All 4 steps play in full. The classification step shows chips such as Intent, Product, Topic and State. Text refers to "Mark" (the classifier). |
| **Warning** | Flows 2, 6, 7 | Same steps, but a chip or the retrieval step turns yellow with a "!". Flow 2: "State: Needed". Flow 6: "Handling: Personal account info". Flow 7: "Outside what we can answer". |
| **Short** | Flow 3 (Texas) | Used after picking a state on flow 2. Step 1 reads "Using your selection: Texas" and step 2 "Adding your state to Mark's classification". Runs faster and skips full classification. The ask bar still shows the original "What car insurance am I required to have?" |

Home (page 0) and the controller's jump to Home skip the animation and show instantly.

An in-flight animation is cancelled whenever a new question or page is chosen (`runId` counter), so quick clicking never leaves half-built pages.

---

## 3. How a visitor reaches each page

- **Home search box.** `route()` picks the page using keywords, checked in this order:
  1. sue, lawyer, attorney, legal, court → **7**
  2. claim → **6**
  3. bundl, home and auto, auto and home, together → **5**
  4. pipe, water, leak, burst, flood → **4**
  5. texas, tx → **3**
  6. requir, minimum, by law, legally, have to have, need to have, mandatory → **2**
  7. rent → **1**
  8. home, house, condo, roof → **4**
  9. anything else → **1** (default)
- **Suggested chips and tiles** on the home page go straight to a fixed page.
- **Ask bar** at the top of every answer page re-runs the same keyword router.
- **"See requirements" button / "Texas" pill** on page 2 trigger the short Texas flow.
- **Controller window** (see section 4).

---

## 4. Display and layout variations

- **Illustrations:** 3 inline SVG scenes: `road` (page 1), `house` (page 4), `family` (pages 0 and 5). Pages 2, 3, 6 and 7 have none.
- **Header:** under 1024px it shows a hamburger menu with a dropdown panel. On desktop it shows the full nav. Between 640px and 1024px it also shows "Search" and "Log in" labels.
- **Build-in animations** (how each element appears): lead sentence streams word by word, cards and headings fade up, illustrations scale in, table rows and list items slide in from the left, yellow accent bars grow in width.
- **Controller mode** (`?controller` in the URL): press **S** on the mockup to open a small popup with a button for each of the 8 pages. This keeps the demo window showing only the Liberty site. The two windows communicate with `postMessage`. It works over `http(s)` and when opened from disk (`file://`).

---

## 5. How the file is organised

1. **`<head>`**: Tailwind (CDN) config with brand colours (navy, Liberty yellow, teal, cream, mist), Roboto font, and CSS for animations, the floating header and the logo.
2. **`<body>`**: 8 `<section class="page">` blocks. Reusable pieces are placeholders such as `<div data-c="header">`, filled in by script.
3. **Component functions** (`header`, `ask`, `crumb`, `illo`, `sources`, `related`, `helpful`, `footer`) replace each `data-c` placeholder with HTML on load.
4. **`FLOWS`**: the config for each of the 7 questions (the question text, classification chips, retrieval items, and whether it warns).
5. **Animation engine**: `runPanel` (progress card), `collect` / `prep` / `build` / `finish` (staged page reveal), `askFlow` (ties it together), `show` (instant page switch).
6. **Controller**: `ctlBoot`, `openCtl`, `onCtlMessage` and related helpers.

---

## 6. Quirks to know before a demo

- Home tile **"What should I do after a car accident?"** loads the *legal fallback* page, so the ask bar says one thing and the headline says "We can't give legal advice".
- Only **Texas** works on the state picker. Ohio, California and the others do nothing, and "Select a state" is a styled box, not a real dropdown.
- Typing "renters insurance" lands on the *rental car* page, because the router only checks for "rent".
- Questions like "How much car insurance do I need?" fall through to the rental car page (the default).
- Most links go to `#`, so they are decorative.

---

## 7. Security notes

The page is safe as a standalone mockup. User-typed text is escaped with `esc()` before it appears in the progress card, and controller messages are only accepted from the window this page opened.

Two things to fix before this pattern is reused in a real app:

1. `crumb()`, `sources()` and `related()` insert text into the page without escaping. Today that text is hardcoded, so it is harmless. If it ever comes from a CMS or user input it becomes an injection risk. Safe version:
   ```js
   // wrap every dynamic value in esc() before it goes into a template
   `<a class="lk" href="#">${esc(x)}</a>`
   ```
2. Tailwind is loaded from `cdn.tailwindcss.com` with no version pin or integrity check. That is fine for a demo, but a production build should compile Tailwind in and self-host it.
