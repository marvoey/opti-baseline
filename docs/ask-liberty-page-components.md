# Ask Liberty: Components Used on Each Page

**Source:** `public/use-case-1-ask-liberty.html`
**Scope:** the 8 page variations. The **header and footer are excluded** from every page.
**Companion docs:** [Component library](./ask-liberty-component-library.md) (component IDs such as C14 are defined there) · [Mockup overview](./use-case-1-ask-liberty.md)

Components are listed **top to bottom in the order they appear on screen**. On pages 1–7 the [AI progress panel (C32)](./ask-liberty-component-library.md#c32-ai-progress-panel) appears under the ask bar while the answer loads and then disappears, so it is listed once here and not repeated per page.

---

## Page 0: Home
*Landing page, no loading animation.*

| # | Component | Variant / content |
|---|---|---|
| 1 | C06 Search hero | "Get clear answers about your insurance", pill search box |
| 2 | C07 Suggested chips | 4 chips: rental car, burst pipe, required insurance, bundling |
| 3 | C20 Illustration | `family` |
| 4 | C04 Section heading | "Questions people are asking" (heading only, on a gray band) |
| 5 | C08 Tile grid | 6 tiles: Car ×2 (rental car, required insurance), Home ×1 (burst pipe), Bundles ×1, Claims ×2 (claim status, after an accident) |

---

## Page 1: Rental car
*Standard answer. Table plus checklist.*

| # | Component | Variant / content |
|---|---|---|
| 1 | C01 Ask bar | Pre-filled "Does my car insurance cover a rental car?" |
| 2 | C02 Breadcrumb | Car insurance › Rental cars |
| 3 | C03 Title block | Standard, lead says "In most cases, yes…" |
| 4 | C20 Illustration | `road` |
| 5 | C10 Answer + sidebar | Contains the two items below |
| 5a | C09 Answer block | "Your coverage usually comes with you, when you rent a car." 2 paragraphs |
| 5b | C11 Callout, checklist | "Before you pick up the keys": 4 × C12, plus a "Talk to a local agent ›" link |
| 6 | C04 Section heading | "How your coverages apply to a rental car", with supporting text |
| 7 | C14 Coverage table | Header plus 5 rows: Liability, Collision, Comprehensive, Rental car reimbursement, Rental company fees |
| 7a | C15 Status indicators | 3 positive with check (Yes, If on your policy ×2), 1 mist pill (Optional coverage), 1 gray pill (Varies by policy) |
| 8 | C28 Primary button | "View all car coverages" (centered) |
| 9 | C29 Sources | 2 sources, both libertymutual.com |
| 10 | C30 Related questions | 3 questions |
| 11 | C31 Helpful row | Standard |

---

## Page 2: Required coverage (clarify)
*Asks for the visitor's state. No sources and no helpful row.*

| # | Component | Variant / content |
|---|---|---|
| 1 | C01 Ask bar | "What car insurance am I required to have?" |
| 2 | C02 Breadcrumb | Answers › Car insurance › State requirements |
| 3 | C03 Title block | Standard, lead says "It depends on where your car is registered…" |
| 4 | C21 State selector card | Fake dropdown, "See requirements" button, 10 state pills (Texas active), "Use my location" link. Pulses for attention |
| 5 | C04 Section heading | "What most states require", with supporting text |
| 6 | C16 Feature card ×3 | Icon, no link: Bodily injury liability (auto), Property damage liability (home), Additional state coverages (life) |
| 7 | C10 Answer + sidebar | Contains the two items below |
| 7a | C09 Answer block | "Is the state minimum enough? It's a starting point." 1 paragraph |
| 7b | C11 Callout, text plus link | "Not sure what you need?" and "Find a local agent ›" |
| 8 | C30 Related questions | 3 questions |

**Gaps:** no C20 illustration, no C29 sources, no C31 helpful row.

---

## Page 3: Texas
*Follow-up answer after choosing a state.*

| # | Component | Variant / content |
|---|---|---|
| 1 | C01 Ask bar | Still shows "What car insurance am I required to have?" |
| 2 | C02 Breadcrumb | Car insurance › State requirements › Texas (4 items incl. "Answers") |
| 3 | C22 State pill | "Texas · Change state" (returns to page 2) |
| 4 | C03 Title block | "Car insurance requirements in Texas", lead says "30/60/25" |
| 5 | C04 Section heading | "What 30/60/25 means" (heading only) |
| 6 | C18 Stat card ×3 | $30,000 / $60,000 / $25,000, each with C05 accent bar |
| 7 | C10 Answer + sidebar | Contains the two items below |
| 7a | C09 Answer block | "Also good to know, if you drive in Texas." 2 paragraphs |
| 7b | C11 Callout, checklist | "Coverages Texas drivers often add": 4 × C12 (collision, comprehensive, UM/UIM, roadside) and "Get a Texas car insurance quote ›" |
| 8 | C23 State comparison panel | "Moving or comparing states?": Ohio 25/50/25, California 30/60/15, Pennsylvania 15/30/5 |
| 9 | C29 Sources | 2 sources: tdi.texas.gov and libertymutual.com |
| 10 | C30 Related questions | 3 questions |
| 11 | C31 Helpful row | Standard |

**Gaps:** no C20 illustration. Uses the *short* loading flow.

---

## Page 4: Burst pipe
*Standard answer. Home topic, table plus steps plus add-on cards.*

| # | Component | Variant / content |
|---|---|---|
| 1 | C01 Ask bar | "Is water damage from a burst pipe covered by home insurance?" |
| 2 | C02 Breadcrumb | Homeowners insurance › Water damage |
| 3 | C03 Title block | Standard, lead says "Typically, yes…" |
| 4 | C20 Illustration | `house` |
| 5 | C10 Answer + sidebar | Contains the two items below |
| 5a | C09 Answer block | "Sudden damage is usually covered, gradual damage usually isn't." 2 paragraphs |
| 5b | C11 Callout, numbered steps | "If a pipe just burst": C13 with 4 steps, and a full-width primary "Start a claim" button |
| 6 | C04 Section heading | "When water gets in: what's typically covered", with supporting text |
| 7 | C14 Coverage table | Header plus 5 rows: Burst pipe, Appliance failure, Slow ongoing leak, Flood, Water backup |
| 7a | C15 Status indicators | 2 positive with check (Yes ×2), 1 gray pill (Usually not), 2 mist pills (Separate flood policy, With optional coverage) |
| 8 | C04 Section heading | "Coverage you can add for more protection" (heading only) |
| 9 | C16 Feature card ×3 | Icon plus "Learn more ›": Water backup (home), Flood insurance (condo), Personal property replacement cost (renters) |
| 10 | C29 Sources | 2 sources |
| 11 | C30 Related questions | 3 questions |
| 12 | C31 Helpful row | Standard |

---

## Page 5: Bundling
*Standard answer. Bundle options plus benefits.*

| # | Component | Variant / content |
|---|---|---|
| 1 | C01 Ask bar | "Can I bundle my home and auto insurance?" |
| 2 | C02 Breadcrumb | Insurance discounts › Bundle and save |
| 3 | C03 Title block | Standard, lead says "Yes…" |
| 4 | C20 Illustration | `family` |
| 5 | C10 Answer + sidebar | Contains the two items below |
| 5a | C09 Answer block | "Auto and home, better together." 2 paragraphs |
| 5b | C11 Callout, link list | 3 link-plus-text pairs: What can I bundle? / How much could I save? / Can I bundle if I rent? (no title) |
| 6 | C04 Section heading | "What can you bundle with Liberty Mutual?" (heading only) |
| 7 | C16 Feature card ×3 | Icon plus quote link: Auto + home (home), Auto + renters (renters), Auto + condo (condo) |
| 8 | C19 Benefit column ×3 | Save money / One place to manage / Flexibility, each with C05 accent bar |
| 9 | C29 Sources | 2 sources |
| 10 | C30 Related questions | 3 questions |
| 11 | C31 Helpful row | Standard |

---

## Page 6: Claim status (secure handoff)
*Does not show claim data. Offers log in or look-up. No illustration, no sources.*

| # | Component | Variant / content |
|---|---|---|
| 1 | C01 Ask bar | "My claim hasn't been paid yet, where is it?" (pre-filled by the page, not by the visitor) |
| 2 | C02 Breadcrumb | Claims › Track your claim |
| 3 | C03 Title block | "Check the status of your claim", lead explains privacy verification |
| 4 | C24 Account action card, log in | Person icon, text, primary full-width "Log in" button, "Create an account" link |
| 5 | C24 Account action card, look up | Search icon, C25 fields (claim number, last name, ZIP), outline "Find my claim" button |
| 6 | C04 Section heading | "Other ways to get help with your claim" (heading only) |
| 7 | C16 Feature card ×3 | No icon, link only: Use the app, Message your claims representative, Call us 24/7 |
| 8 | C30 Related questions | 3 questions |
| 9 | C31 Helpful row | Standard |

**Gaps:** no C20 illustration, no C29 sources, no C09 answer block. The loading card uses *warning* styling (personal account info).

---

## Page 7: Legal question (fallback)
*Out-of-scope question. The shortest page.*

| # | Component | Variant / content |
|---|---|---|
| 1 | C01 Ask bar | "Should I sue the other driver?" |
| 2 | C02 Breadcrumb | Claims › After an accident |
| 3 | C03 Title block, with buttons | "We can't give legal advice", plus primary "Start a claim" and outline "Talk to an agent" |
| 4 | C26 Handoff banner | Auto icon (C17), "Were you just in an accident?", navy "Start a claim" button |
| 5 | C04 Section heading | "Answers that may help" (heading only) |
| 6 | C27 Answer link card ×3 | After an accident / Claims / Coverage |
| 7 | C31 Helpful row | Standard |

**Gaps:** no C20 illustration, no C29 sources, no C30 related questions. The loading card uses *warning* styling.

---

## Component × page matrix

● = used, ● ×n = used n times in the main page content, blank = not used. The header and footer are excluded.

| ID | Component | 0 Home | 1 Rental | 2 Required | 3 Texas | 4 Pipe | 5 Bundle | 6 Claim | 7 Legal |
|---|---|:-:|:-:|:-:|:-:|:-:|:-:|:-:|:-:|
| C01 | Ask bar | | ● | ● | ● | ● | ● | ● | ● |
| C02 | Breadcrumb | | ● | ● | ● | ● | ● | ● | ● |
| C03 | Title block | | ● | ● | ● | ● | ● | ● | ● (buttons) |
| C04 | Section heading | ● | ● | ● | ● | ● ×2 | ● | ● | ● |
| C05 | Accent bar | | ×1 | ×1 | ×4 | ×1 | ×4 | | |
| C06 | Search hero | ● | | | | | | | |
| C07 | Suggested chips | ● (4) | | | | | | | |
| C08 | Tile grid | ● (6) | | | | | | | |
| C09 | Answer block | | ● | ● | ● | ● | ● | | |
| C10 | Answer + sidebar | | ● | ● | ● | ● | ● | | |
| C11 | Callout | | checklist | text + link | checklist | steps | link list | | |
| C12 | Checklist item | | ×7 | | ×4 | ×2 | | | |
| C13 | Step list | | | | | ● (4) | | | |
| C14 | Coverage table | | ● | | | ● | | | |
| C15 | Status indicator | | ×5 | | | ×5 | | | |
| C16 | Feature card | | | ×3 | | ×3 | ×3 | ×3 | |
| C17 | Icon badge | | | ×3 | | ×3 | ×3 | | ×1 |
| C18 | Stat card | | | | ×3 | | | | |
| C19 | Benefit column | | | | | | ×3 | | |
| C20 | Illustration | family | road | | | house | family | | |
| C21 | State selector | | | ● | | | | | |
| C22 | State pill | | | | ● | | | | |
| C23 | State comparison | | | | ● | | | | |
| C24 | Account card | | | | | | | ×2 | |
| C25 | Look-up fields | | | | | | | ● | |
| C26 | Handoff banner | | | | | | | | ● |
| C27 | Answer link card | | | | | | | | ×3 |
| C28 | Buttons (primary/outline/navy) | | ● | ● | | ● | | ● | ● |
| C29 | Sources | | ● | | ● | ● | ● | | |
| C30 | Related questions | | ● | ● | ● | ● | ● | ● | |
| C31 | Helpful row | | ● | | ● | ● | ● | ● | ● |
| C32 | AI progress panel | | ● | ● | ● (short) | ● | ● | ● | ● |
| C33 | Staged reveal | | ● | ● | ● | ● | ● | ● | ● |

## Reuse summary

- **Used on every answer page (1–7):** C01, C02, C03, C04, C32, C33.
- **Used on most pages:** C30 Related (6 of 7), C31 Helpful (6 of 7), C09 + C10 + C11 (5 of 7).
- **Used on only one page:** C06, C07, C08 (Home), C13 (4), C18 (3), C19 (5), C21 (2), C22 (3), C23 (3), C24 + C25 (6), C26 + C27 (7). These are the page-specific components a build would have to create separately.
- **Pages with the fewest components:** page 0 (5 components) and page 7 (8 components including the icon badge inside the banner).
