# Ask Liberty: how a question is matched to an answer page

This document explains, in order, how the website decides **which answer page** a visitor lands on, and which **progress card content** is shown on the way. There are two routing methods. Both choose from the same list: the **questions defined on the Ask Liberty page in the CMS**.

| Method | Used when | Looks at |
|---|---|---|
| **A. Classification matching** | Send questions to Mark is on, and Mark answered in time | Mark's classification: intent, product, topic, state, confidence |
| **B. Keyword routing** | Mark is off, Mark is slow or failed, A found nothing, or the page is in simulated mode | The visitor's typed text |

A **clicked suggested question** skips both: it always goes to its own page.

Code: `app/_components_liberty/matchClassification.ts` (method A) and `app/_components_liberty/askRouting.ts` (method B). Related guides: `docs/ask-liberty-send-questions-to-mark.md` and `docs/ask-liberty-mark-progress-animation.md`.

---

## 1. What a CMS question is (the thing being matched)

The **Suggested questions** field on the Ask Liberty page is a list of **Liberty Ask Question** items. Each entry is normally a **shared block** from the "Ask Liberty Questions" folder in the CMS (one block per question, named after the question), added to the list in the order the questions should be matched. The field also accepts a question created directly on the page. The list order is the chip order and the keyword priority.

Each question has fields that the matching reads:

| CMS field | Used for |
|---|---|
| **Question** | Method B exact match; the chip text; the text echoed on the card |
| **Keywords** | Method B (comma separated words) |
| **Classification chips** (`Label \| Value`) | Method A. Only the chips labelled **Intent**, **Product**, **Topic** and **State** are read |
| **Fallback question** | Marks the one question where unmatched or unsafe questions land |
| **Hide as a suggested-question chip** | Keeps the question out of the suggested chips; it can still be matched |
| **Answer page URL / picker** | Where the visitor lands |
| Retrieving text, Retrieved text, Retrieved items, Needs more detail | The card's step 3 once this question is chosen |

The chip **labels** must be spelled exactly `Intent`, `Product`, `Topic` and `State` (case does not matter). A chip with a different label (for example `Handling`, `Coverage`) is shown on the card but never used to match.

A question is **state-specific** when its `State` chip holds a real state name (for example `Texas`). A `State` chip of `Needed` or `Not needed`, or no `State` chip at all, means **not state-specific** ("generic").

---

## 2. Method A: matching Mark's classification

Mark returns `intent`, `product`, `topic`, `state`, `confidence` and so on. All comparisons are **exact**, ignoring only capital letters and spaces at the ends. "Rental cars" matches "rental cars" but not "Rental car".

### Step 0: the safety check (before any matching)

The visitor goes straight to the **fallback question** (`/help`) if either is true:
- `intent` is `Out of scope`
- `confidence` is **below 0.6**. A **missing or invalid** confidence counts as 0, so it also goes to the fallback.

No matching rule runs in this case. If the page has no question marked as the fallback, the visitor goes through method B instead.

### Step 1: the rules, in order. The first rule that finds a question wins

The fallback question is never chosen by these rules. Questions are checked in the order the editor listed them.

| # | Rule | Looks at | Candidates |
|---|---|---|---|
| 1 | **Topic and state** | Mark gave a topic **and** a state; a question has the same topic and the same state | all questions |
| 2 | **Topic and product** | Mark gave a topic and a product | generic questions only |
| 3 | **Topic** | Mark gave a topic | generic questions only |
| 4 | **Intent** | Mark gave an intent | generic questions that have **no Topic chip** (today only the legal question) |
| – | Nothing matched | | falls to method B (section 3) |

What this means in practice:
- **Topic decides.** Product is only used to choose between two questions that share a topic (rule 2). If the product does not match, rule 3 still finds the question by topic alone.
- **State-specific pages are opt-in.** The Texas page is only reachable when Mark names `Texas` together with the topic `State minimums` (rule 1). Any other state falls through to the generic page for that topic.
- **Intent alone is a last resort.** It only matches questions with no topic. Today that is just the legal question (`Legal advice`). The claims question has the topic `Claim status`, so it is matched by topic (rule 3), not by intent.

---

## 3. Method B: keyword routing (the typed text)

Used when method A is not available or found nothing (`routeQuestion`). Tried in this order:

1. **Exact question.** The typed text equals a question's text, ignoring capitals and end spaces.
2. **Keyword.** The **first question, in editor order**, with any keyword that appears **anywhere inside** the typed text. Keywords are plain lower-case text, never patterns (so `requir` finds "required" and "requirements").
3. **The fallback question** (`/help`).
4. **The first question** in the list (only if no fallback is marked).

An **empty** box uses the first question.

Because keywords are checked in list order and match inside words, **order and word choice matter**. For example the claims question has the keyword `claim`: a typed "how do I start a claim for my burst pipe" reaches the burst pipe question first, because it comes earlier in the list and has keywords `pipe` and `burst`.

---

## 4. What happens to the answer

The chosen question supplies:
- the **page the visitor lands on** (its answer page URL or picker), after the card finishes;
- the **card's step 3 and step 4 content** (retrieving text, retrieved lines, the yellow "needs detail" flag).

In Mark mode the **chips and the reasoning line** on the card are Mark's own. The only chips taken from the CMS question are **warning chips** (`| warn`) that Mark did not supply.

If **no page URL** is set on the chosen question, the visitor stays on the home page after the card.

---

## 5. Worked examples (checked against the code)

These were run through the actual matching code with the current eight CMS questions.

| Mark returned | Typed text | Lands on | Via |
|---|---|---|---|
| Learn about requirements · Auto · State minimums · **Texas** · 0.87 | any | `/required-coverage/texas` | rule 1 |
| same, state **Ohio** | any | `/required-coverage` | rules 2/3 (no Ohio page) |
| same, no state | any | `/required-coverage` | rule 2 |
| Learn about coverage · product **Home** · Rental cars · 0.9 | any | `/rental-car` | rule 3 (product ignored) |
| `RENTAL CARS` · `auto` (capitals differ) | any | `/rental-car` | rule 2 (case is ignored) |
| Legal advice · no topic · 0.9 | any | `/legal-question` | rule 4 |
| Learn about coverage · Auto · Rental cars · **0.6** | any | `/rental-car` | rule 2 (0.6 is allowed) |
| Learn about coverage · Auto · Rental cars · **0.59** | any | `/help` | step 0 |
| Same classification, **no confidence** | any | `/help` | step 0 |
| `Out of scope` · 0.95 | any | `/help` | step 0 |
| Topic written **"Rental car"** (not "Rental cars") | "rental car please" | `/rental-car` | rules fail, then keyword `rental` |
| Learn about requirements · state Texas · **no topic** | "what about Texas" | `/required-coverage/texas` | rules fail, then keyword `texas` |
| Account service · topic **Billing** (not in the CMS) | "x" | `/help` | rules fail, no keyword, fallback |
| Intent and topic unknown to the CMS | "hello there" | `/help` | rules fail, no keyword, fallback |
| Nothing useful (confidence only) | "my pipe burst" | `/burst-pipe` | keyword `pipe` |

---

## 6. Things to know when changing questions in the CMS

- **Adding a question.** Give it `Intent`, `Product` and `Topic` chips with exactly the values the classifier uses. Add the same value to the classifier prompt in Mark; otherwise Mark never returns it and the question is only reachable by keyword (see `docs/ask-liberty-send-questions-to-mark.md`, section 4.5).
- **Two questions with the same topic.** Rule 2 separates them by product; if the product does not separate them, the **first one in the list wins**.
- **A new state-specific page.** Give it a real state in its `State` chip and the same `Topic` as the generic question, and keep the generic one (with `State | Needed` or no State chip) as the default for every other state.
- **A question with no topic** (like legal) is matched by `Intent`. Two such questions with the same intent: the first in the list wins.
- **Wording differences break matches silently.** "Rental car" and "Rental cars" are different. Mark's lists and the CMS chips must use identical spellings. A silent miss lands on keyword routing, which usually still gives a sensible page, but it is no longer Mark's choice.
- **Keep a fallback.** Exactly one question should be marked **Fallback question**. Without one, unmatched questions land on the first question in the list.
- **Order matters** for keywords. Put the more specific questions above the more general ones (the claims keyword `claim` is general).
- **Hidden questions still match.** Hiding a question only removes its suggested chip.
- **Changing the confidence bar.** It is `MIN_CONFIDENCE = 0.6` in `matchClassification.ts`. Raising it sends more borderline questions to `/help`.

---

## 7. Quick reference

```
visitor asks
  ├─ clicked a suggested question ──────────────► that question's page (Mark still classifies for the card)
  └─ typed / ?q=
       ├─ Mark answered in time
       │    ├─ intent "Out of scope" or confidence < 0.6 (or missing) ─► fallback page
       │    └─ else rules, first hit wins:
       │         1 topic + state   2 topic + product   3 topic   4 intent (questions with no topic)
       │         └─ no hit ─► keyword routing on the typed text
       └─ Mark off / slow / failed ─► keyword routing:
            exact question ─► first keyword hit (list order) ─► fallback question ─► first question
```
