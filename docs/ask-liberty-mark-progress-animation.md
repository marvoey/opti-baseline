# Ask Liberty: the Mark progress animation (what it shows and where the code is)

This document describes the **progress card** that plays on the Ask Liberty home page when **Send questions to Mark** is on: which questions produce it, exactly what it shows at each step and where each piece of text comes from, and which file handles each part.

Companion documents:
- `docs/ask-liberty-send-questions-to-mark.md` – how to set up Mark, the tool, and the environment.
- `docs/ask-liberty-mark-roundtrip-plan.md` – design decisions and probe results.

---

## 1. Which questions produce the Mark animation

The Mark animation runs for **any question asked on the Ask Liberty home page** while all of these are true. There is no list of "Mark questions"; every question goes to Mark.

| Condition | Where it is decided |
|---|---|
| The **Send questions to Mark** checkbox is ticked on the Ask Liberty page in the CMS | `cms/liberty/AskLibertyExperience.tsx:257` (`markEnabled`) |
| The server is ready: webhook URL, tool token and the three CMS store values are all set | `lib/askMark/config.ts` (`markReady()`), also checked again by `/api/opal/ask` |
| The page is not in CMS preview or the on-page editor | same line (`!editing`) |
| **Skip animation** is not ticked on the page (if it is, the visitor goes straight to the page) | `AskLibertyHero.tsx:148` (`askTyped`) and `:162` (`askChip`) |
| The typed text is not empty (an empty box uses the simulated flow and the first question) | `AskLibertyHero.tsx:157` |

### The three ways a question starts

| How the visitor asks | What Mark classifies | Where the visitor lands |
|---|---|---|
| **Types** a question in the search box | the typed text | the page of the CMS question that Mark's classification matches (see section 4) |
| **Clicks a suggested question** (a chip) | the chip's question text | **always that chip's own page.** Mark still classifies, so the card shows Mark's real chips and reasoning, but Mark cannot change the destination |
| Arrives from an **answer page's ask bar** (`/?q=<question>`) | the text in `q` | same as typing it. The address is cleaned up (the `?q=` is removed) and the question runs as if typed |

### When the Mark animation does not play (the simulated card plays instead)

- Checkbox off, server not ready, or CMS preview: the original timed animation plays with the CMS question's own chips and keyword routing.
- Mark does not answer in time or an error occurs: see section 5.

---

## 2. What the card shows: step by step

The card has four steps. **Mark drives steps 1 and 2 and chooses which question's step 3 is shown. Steps 3 and 4 are content from the CMS, not from Mark.**

Timings are at normal speed (`speed = 1`). "Reply" means the moment Mark's classification reaches the browser.

| Step | What is on screen | Where the text comes from | When it advances |
|---|---|---|---|
| Header | "Ask Liberty" label, then the visitor's question in quotes | the question text the visitor typed or clicked | at once |
| **1. Send question to Mark** | Active: "Sending your question to Mark" with moving dots. Done: "Question sent to Mark" with a tick | fixed texts in `AiProgressPanel.tsx` (`DEFAULT_TEXTS.sending` / `.sent`) | Stays active at least 0.7 s and until the website reports the question was **accepted by Mark** (the `sent` event). Then 0.3 s pause, progress bar to 25% |
| **2. Classify the question** | Active: "Mark is classifying your question". When the reply arrives, **chips** appear one by one. Done: "Done classifying your question" | texts: fixed. **Chips: from Mark's reply** (and warning chips from the CMS, see below) | Stays active until the reply arrives (the `result` event). Then one chip every 0.3 s, then 0.25 s, then done, progress bar to 55%, 0.45 s pause |
| Reasoning line (under the chips) | "How your question was understood: *<one sentence>*" | **Mark's `reasoning` field** (up to 200 characters) | Appears once all chips are showing. Not shown if Mark supplied no reasoning, or if there are no chips at all |
| **3. Retrieve approved content** | Active: the **retrieving label** with a shimmer for 1.3 s. Then the retrieved **lines**, one every 0.24 s. Done: the **retrieved label** (yellow "!" if the question needs more detail, and the last line is flagged) | the matched CMS question's **Retrieving text**, **Retrieved text**, **Retrieved items** and **Needs more detail** fields. Defaults: "Retrieving approved Liberty Mutual content" / "Approved content retrieved" | After the lines, 0.2 s, then done, progress bar to 85%, 0.5 s pause |
| **4. Build your answer** | Active: "Building your answer". Done: "Your answer is ready" | fixed texts | Progress bar to 100%, 0.75 s, then done |
| Hand-off | the card finishes, then the browser opens the matched page | the matched question's answer page URL | 0.6 s after "Your answer is ready" |

**Time after Mark's reply arrives:** the card needs about 4.05 s + (0.3 s × number of chips) + (0.24 s × number of lines). The 4.05 s is made up of 0.7 s to finish step 2, 1.3 s of shimmer, 0.7 s to finish step 3, 0.75 s for step 4 and the 0.6 s hand-off. With 5 chips and 5 lines (the rental car question) that is about **6.75 seconds** from the reply to the page opening. Before the reply, the card shows steps 1 and 2 as active for however long Mark takes.

### What Mark's reply puts on the chips

Chips are built from Mark's reply in this fixed order, skipping any field Mark left out (`chipsFromResult`, `matchClassification.ts:84`):

`Intent` · `Product` · `Topic` · `Coverage` · `State`

Then any **warning chip** defined on the matched CMS question that Mark did not already supply is added (a chip whose line ends with `| warn`, for example `State | Needed | warn`). Warning chips are yellow. Chips on the CMS question that are *not* warnings (for example `State | Not needed`) are **not** shown in Mark mode, because the chips are Mark's output, not the CMS's.

### Reduced motion

If the visitor's device asks for reduced motion, the animation is skipped. In Mark mode the card still **waits for the reply**, then shows the finished state at once (all steps done, all chips and lines visible) and hands off after the same 0.6 s.

---

## 3. The eight questions: what the card shows for each

These are the questions defined on the Ask Liberty page in the CMS. The "Mark returns" column is the classification the classifier is expected to produce (see section 4.2 of the setup guide). The chips are what the card shows in Mark mode; step 3 content is from the CMS question.

| # | Question | Chip? | Mark returns | Chips on the card (in order) | Step 3: label → lines → ending | Lands on |
|---|---|---|---|---|---|---|
| 1 | Does my car insurance cover a rental car? | yes | Learn about coverage · Auto · Rental cars (· Coverage) | Intent · Product · Topic (· Coverage) | "Retrieving approved Liberty Mutual content" → Answer · Rental car coverage / How your coverages apply · 5 coverages / 2 approved sources / Next step · Talk to a local agent / Disclosure → "Approved content retrieved" (green tick) | `/rental-car` |
| 2 | Is a burst pipe covered by home insurance? | yes | Learn about coverage · Home · Water damage (· Coverage) | Intent · Product · Topic (· Coverage) | "Retrieving approved Liberty Mutual content" → Answer · Burst pipes and water damage / What to do now · Start a claim / What's typically covered · 5 situations / Optional coverages / 2 approved sources → "Approved content retrieved" (green tick) | `/burst-pipe` |
| 3 | What car insurance do I need in Texas? | hidden | Learn about requirements · Auto · State minimums · **State Texas** | Intent · Product · Topic · State: Texas | "Retrieving approved Texas content" → Answer · Texas minimum coverage (30/60/25) / Texas Department of Insurance source / Nearby state comparisons / Next step · Get a Texas quote / Disclosure → "Approved Texas content retrieved" (green tick) | `/required-coverage/texas` |
| 4 | What car insurance am I required to have? | yes | Learn about requirements · Auto · State minimums (no state) | Intent · Product · Topic, then the CMS warning chip **State: Needed** (yellow) | "Checking approved content for your question" → Requirements are set by each state / Asking where your car is registered → "One detail needed: your state" (**yellow "!"**, last line flagged) | `/required-coverage` |
| 5 | Can I bundle home and auto? | yes | Compare options · Home + Auto · Bundling | Intent · Product · Topic | "Retrieving approved Liberty Mutual content" → Answer · Bundling home and auto / Bundle options · 3 / Why customers bundle / Next step · Start your bundle quote / 2 approved sources → "Approved content retrieved" (green tick) | `/bundling` |
| 6 | My claim hasn't been paid yet, where is it? | hidden | Account service · topic Claim status | Intent · Topic, then the warning chip **Handling: Personal account info** | "Finding the secure way to help" → Log in to track your claim / Look up a claim without logging in / Other ways to get help → "Secure claim options found" (**yellow "!"**) | `/claim-status` |
| 7 | Should I sue the other driver? | hidden | Legal advice (no topic) | Intent, then the warning chip **Handling: Outside what we can answer** | "Retrieving approved help options" → Approved response · Legal questions / Next steps · Start a claim or talk to an agent / 3 related answers → "Approved help options retrieved" (green tick; the page's "Needs more detail" box is off) | `/legal-question` |
| 8 | We couldn't find an approved answer (**fallback**) | hidden | intent **Out of scope**, or any answer with confidence **below 0.6** | whatever Mark returned, then the warning chip **Handling: Outside what we can answer** | "Finding the best way to help" → We can't answer this one here / Talk to an agent / Browse approved answers → "Help options found" (**yellow "!"**) | `/help` |

Notes:
- **"Chip?"** means whether the question is offered as a suggested-question chip under the search box. Hidden questions are only ever reached by a typed question (matched through Mark's classification, or by keyword in the fallback).
- Chips in brackets appear only if Mark returned that field. The classifier prompt in the setup guide asks for `coverage` for rental and burst-pipe questions, but it is optional.
- If the visitor **clicks** a chip question, the card shows **Mark's** chips and reasoning for that question text, while step 3 and the destination are the **clicked** question's.
- A reply that fits no question (for example a topic that no question has) uses keyword routing on the typed text, then the fallback question, then the first question.

---

## 4. How Mark's classification chooses the question

This is where "which step-3 content is shown and where the visitor lands" is decided (`app/_components_liberty/matchClassification.ts`).

1. **Fallback check first** (`shouldUseFallback`, line 21): intent `Out of scope`, or confidence below **0.6**, goes straight to the question marked **Is fallback** (`/help`).
2. Otherwise `matchClassification` (line 32) tries, in order, with exact case-insensitive comparison:
   1. same **topic and state** (the Texas page);
   2. among questions that are not state-specific: same **topic and product**;
   3. same **topic**;
   4. same **intent**, among questions that have **no topic** (claims and legal).
3. Nothing matched: keyword routing on the typed text, then the fallback question, then the first question (`resolveMarkQuestion`, line 67).

The matched question supplies steps 3 and 4 and the destination. The chips and reasoning stay Mark's.

---

## 5. When Mark is slow or fails

| What happens | What the visitor sees | Where |
|---|---|---|
| No reply within the timeout (CMS field **Mark timeout**, default 20 s, 5 to 60 s) | The simulated card plays (the question's own CMS chips and lines) with the line "Mark is taking longer than usual, using approved keyword routing." under the steps. The visitor lands on the page that keyword routing picks | `AskLibertyHero.tsx:140` (`MARK_NOTICE`, line 47) |
| Mark did not accept the question (`error` code `webhook`) or the reply store failed (`store`) | Same as above | same |
| A newer question is asked while one is running | The old question is cancelled and the new one starts; the old reply is ignored | `AskLibertyHero.tsx:132` (`seq`), `useAskMark.ts` (`cancel`) |
| The visitor leaves the page | The request is cancelled, which frees the server | `useAskMark.ts` |

The visitor is never left on a dead end: every outcome ends on an approved page.

---

## 6. Where each piece is handled in the code

The path of one question, from the click to the page opening:

| # | What happens | File and place |
|---|---|---|
| 1 | The page type holds the questions, the checkbox and the timeout. The renderer turns CMS fields into `AskQuestion` objects: `Classification` lines become chips (`"Label \| Value"` or `"Label \| Value \| warn"`), `RetrievedItems` become lines, `NeedsDetail` becomes `warn`, `HideChip` and `IsFallback` are carried over | `cms/liberty/AskLibertyExperience.tsx`: fields (lines 18–215), `parseChip` (220), question mapping (240–252), `markEnabled` and timeout (257–258) |
| 2 | The hero handles asking: typing, clicking a chip, or `/?q=`. Chooses Mark or the simulated flow | `app/_components_liberty/AskLibertyHero.tsx`: `askTyped` (148), `askChip` (162), `/?q=` effect (177), `runWithMark` (115), `runSimulated` (110) |
| 3 | One request is sent to the server and its event stream is read | `app/_components_liberty/useAskMark.ts` (the `fetch` to `/api/opal/ask`, timeout, cancel) and `askStream.ts` (`readAskStream`, `parseEvent`) |
| 4 | The server calls Mark's webhook and waits for the reply | `app/api/opal/ask/route.ts` (events `sent`, `result`, `timeout`, `error`) |
| 5 | Mark calls the `liberty_ask` tool; the reply is stored in the CMS and read back | `app/api/tools/[name]/route.ts`, `app/api/_tools/_opalHandler.ts`, `app/api/opal/_resultStore.ts`, `lib/askMark/parsePayload.ts` (the whitelist of fields) |
| 6 | The reply is matched to a CMS question and turned into chips | `app/_components_liberty/matchClassification.ts`: `resolveMarkQuestion` (67), `matchClassification` (32), `chipsFromResult` (84) |
| 7 | The hero moves the card through its phases: `sending`, then `classifying` when the `sent` event arrives, then `retrieving` when the result arrives (with the matched question, chips and reasoning) | `AskLibertyHero.tsx:115–145` |
| 8 | The card plays the four steps in "controlled mode" (waits for the phase instead of timers) | `app/_components_liberty/AiProgressPanel.tsx`: the `controlled` branch (304–320) waits on `untilPhase('classifying')` and `untilPhase('retrieving')`; step 3 and 4 from line 357; chips and reasoning rendering (423, 438); reduced motion (263) |
| 9 | After "Your answer is ready" the hero waits 0.6 s and opens the page | `AskLibertyHero.tsx`: `HANDOFF_MS` (45), `onComplete` (192), `go` (resolves and safety-checks the address) |

### The card's props in Mark mode

`AiProgressPanel` receives these from the hero (`AskLibertyHero.tsx`, the `run.mode === 'mark'` branch):

| Prop | Value in Mark mode |
|---|---|
| `question` | what the visitor asked |
| `phase` | `sending` → `classifying` → `retrieving` |
| `chips` | empty (the CMS chips are not used) |
| `liveChips` | Mark's chips (+ warning chips), set when the reply arrives |
| `reasoning` | Mark's one sentence |
| `items`, `warn`, `retrievingLabel`, `retrievedLabel` | from the matched CMS question |
| `onComplete` | starts the 0.6 s hand-off |

In the simulated mode, `phase`, `liveChips` and `reasoning` are not set, so the card runs on timers and shows the CMS question's own chips and lines.

---

## 7. To change what the card says

| To change | Where |
|---|---|
| Fixed texts ("Sending your question to Mark", "Done classifying your question", "Your answer is ready") and step names | `DEFAULT_TEXTS` and `DEFAULT_LABELS` in `AiProgressPanel.tsx` |
| Step 3 wording and lines for one question | CMS: the question's **Retrieving text**, **Retrieved text**, **Retrieved items** and **Needs more detail** on the Ask Liberty page |
| Yellow warning chips | CMS: add `Label \| Value \| warn` to the question's **Classification chips** |
| Chip order or which fields show | `chipsFromResult` in `matchClassification.ts` |
| Timing of the steps | the `wait(...)` values in `AiProgressPanel.tsx` (lines 304–375) and `HANDOFF_MS` in the hero |
| The slow-Mark message | `MARK_NOTICE` in `AskLibertyHero.tsx` |
| How long to wait for Mark | CMS: **Mark timeout (seconds)** |
| Which question a classification lands on | the matching rules in section 4, and the question's chips (Topic, Product, State, Intent) in the CMS |

Line numbers are for the code at the time of writing and will move as the files change; the function names are the stable reference.
