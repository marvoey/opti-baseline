# Ask Liberty: Mark round trip (revised plan)

**Replaces:** [Ask Liberty – Plan_ Port the Mark Round Trip from progressive2](./Ask%20Liberty%20–%20Plan_%20Port%20the%20Mark%20Round%20Trip%20from%20progressive2.md). The original stays as written; this plan keeps its goal and applies the review corrections.
**Status:** code built and committed on branch `libertymutual-mark`; waiting on the CMS setup, the Preview probe and the Mark side (see "Build status" below).
**Feasibility:** confirmed. All files the original names exist on `origin/progressive2` and behave as described, and the CMS API supports everything the shared store needs (section 2).

**Decisions (confirmed by the project owner)**

| Question | Decision |
|---|---|
| Shared store for Mark's reply | **The CMS** (Content Management API). No Redis and no other new service. |
| Landing page for unmatched questions | **A new `/help` page.** |
| On/off switch | **A checkbox in the CMS** on the Ask Liberty page type. |
| Keep or delete Mark's stored replies | **Delete on read.** No setting to keep them. |

## Build status

| Step (section 10) | Status |
|---|---|
| 1. Branch `libertymutual-mark` | Done |
| 2. CMS: dedicated API client, results folder, `LibAskResult` type, env vars | **Done locally.** The `LibAskResult` type is pushed, `.env.example` is updated, the dedicated API client is in `.env`, and the folder "Ask Liberty Mark results" exists (key `9eadec1758ce456e912f63aa29478e65`, inside the "Liberty Mutual" assets folder). **Still to do by the project owner:** add `ASK_MARK_RESULTS_FOLDER_KEY` to `.env`, and set the three `ASK_MARK_*` values on Vercel. |
| 3. Server code (client, store, `ask`, tools, registry, parser, stub) | Done. Tested locally: tool route authentication and validation, question route guards, rate limit, a real stream read by the browser-side reader, disconnect clean-up, no question text in logs. **The reply store is tested against the live CMS** (create, read, delete on read, duplicate ignored, sweep, unknown id), and the property format is confirmed. |
| 4. Reliability probe | Script written and **run locally against the live CMS** (see "Probe results"). **Delivery passes; the 3 s overhead target is not met reliably.** The run on a Vercel Preview deployment is still to do. |
| 5. `useAskMark` | Done (reader in `askStream.ts`, tested against the real route) |
| 6. `AiProgressPanel` controlled mode and the hero's Mark path | Done and compiled, **not yet seen in a browser** |
| 7. `matchClassification` | Done; 41 checks pass, including the whole section 11 table |
| 8. CMS properties, questions, `/help`, keyword fix | New properties added and the `/help` page is **published**. The new questions and the `rent` → `rental` fix are saved as a **draft** (version 750) of the home page, to be published after this code is deployed (the live site does not know `HideChip` yet, so publishing earlier would show four extra chips). |
| 9. Mark agents and tool registration | Not started (needs the Mark workspace) |
| 10. End to end with ngrok, then deploy; Firewall rule | Not started |

Refinements made while building (not in the plan above): the cleanup sweep runs at most once every 2 minutes per server instance, the per-address limit is configurable with `ASK_MARK_RATE_LIMIT` (default 10, only raised for the probe), the stub reports its own delay in `reasoning` so the probe can measure the overhead, and clicking a suggested-question chip still asks Mark (for the card) but always goes to the chip's own page.

**Probe results** (local production build, stand-in for Mark answering after 3 to 5 s, 5 questions at once, live CMS):

| Run | Asks | Delivered | Overhead beyond the stub: median / 95th percentile / worst | Items left | Pass mark |
|---|---|---|---|---|---|
| 30 asks, checks every 1 s | 30 | 30 | 1.9 s / 3.3 s / 3.6 s | 0 | Overhead missed |
| 30 asks, early key lookup added | 30 | 30 | 2.1 s / 5.9 s / 14.9 s | 0 | Overhead missed |
| 30 asks, same code, repeated | 30 | 30 | 1.1 s / 4.3 s / 5.4 s | 0 | Overhead missed |
| 30 asks, send before delete, checks every 0.5 s | 30 | 30 | 0.6 to 1.1 s / 4.3 s / 4.6 to 5.4 s (two runs) | 0 | Overhead missed |
| 30 asks, same code, repeated | 30 | 30 | 1.2 s / 2.7 s / 2.9 s | 0 | **Passed** |
| 100 asks | 100 | 100 | 0.8 s / 3.8 s / 9.0 s | 2 (two deletes got a 429 and were not retried) | Overhead and cleanliness missed |
| 100 asks, delete retried on 429, checks every 1 s | 100 | 100 | 1.3 s / 5.2 s / 18.2 s | 0 from this run | Overhead missed |

What this shows:
- **Delivery is solid:** 100 of 100 in every run, with no lost replies. This is what the CMS store was chosen for.
- **Cleanup works:** every collected reply was deleted. Two were left once, because a delete got a 429 and was not retried; deletes are now retried when rate limited.
- **A typical question adds about 1 second** beyond Mark's own time.
- **The tail is the CMS, not the design.** Creating the reply item is either fast (about 80 ms) or slow (about 1 to 1.2 s), roughly half and half under load. Occasionally a CMS call stalls for many seconds (one create exceeded the 8-second call limit, so that question answered 18 s late). The CMS also answered 429 under sustained load (about 15 calls a second).
- **So the pass mark of "95% add under 3 s" is not met reliably.** One run in seven met it; most land between 4 and 5 s. Runs vary widely because of the CMS.

Changes made while measuring: the key is looked up in the background when a question starts (makes the later create fast when Mark takes more than about 3 s), the check uses the fast item endpoint, the answer is sent before the item is deleted, a rate-limited delete is retried, slow CMS calls (over 1.5 s) are logged, and the check runs once a second.

**Decision needed from the project owner:** accept the measured behaviour for a demo, add an in-process fast path (when Mark's reply reaches the same server instance as the waiting request, hand it over in memory and skip the CMS; the CMS remains the guarantee for other cases), or change the pass mark.

**Findings from the live CMS** (these changed the code):
- **Property values must be wrapped** as `{ "value": … }` on create, the same shape the API returns on reads.
- **A new item cannot be given a status**; it always starts as a draft. The `status` field is refused.
- **Folder listings carry no names.** Entries only have `key`, `container`, `contentType`, `locales`, `created`, `lastModified` and `createdBy`. The sweep therefore uses `created`, not the item name.
- **A missing key is slow on the versions endpoint** (about 1.3 s for a 404) but fast on the item endpoint (`GET /content/{key}`, about 80 ms). The waiting request now checks with the item endpoint and reads versions only once the item exists. Warm timings: create about 100 ms, read about 60 ms, delete about 100 ms (one create in twelve took 1.4 s).
- **The item is readable straight after create** (11 of 12 immediately; the check retries anyway).

**Goal:** make "Sending your question to Mark" real. A visitor's question goes to a Mark workflow agent, Mark classifies it, and the Next.js app routes to the approved CMS answer page. Mark never writes the answer. Today the progress card runs on timers and typed questions are routed by keyword.

**Source:** `marvoey/opti-baseline@progressive2` (working round trip for the Progressive workspace).
**Target:** `marvoey/opti-baseline@libertymutual`, deployed on Vercel at `libertymutual.optimoey.com`.

---

## 1. What changed from the original plan

| # | Original plan | Revised plan | Why |
|---|---|---|---|
| 1 | An in-memory map shared by a page-wide stream and the tool route | **The CMS is the shared store.** Mark's reply is written to a short-lived draft item in a dedicated CMS folder and read back by the question's own request | The in-memory map only works if both requests land on the same server instance, which Vercel can't guarantee. A CMS item is visible to every instance, so the risk is gone. |
| 2 | A stream opened on page load (as `useOpalChat` does), plus a separate trigger request | **One streaming request per question** (`/api/opal/ask`) that starts Mark and then checks the CMS every second or two until the reply appears | A stream per home-page view would hold a server function open for up to 3 minutes per visitor. Now nothing is open until the visitor asks. |
| 3 | Install `@optimizely-opal/opal-tools-sdk` | **No SDK.** Define the six-value `ParameterType` list locally | The only thing used from it is `ParameterType`, a plain list of strings (`"object"`, `"array"`, …) with no imports. (The original's "caret on a pre-release" warning was also wrong: `^0.1.35-dev` does not match `0.1.37-dev` or `0.1.41-dev`.) |
| 4 | `NEXT_PUBLIC_ASK_MARK` as an "instant switch" | A **CMS checkbox** on the page type plus a server-side readiness check | A `NEXT_PUBLIC_*` value is fixed at build time, and on Vercel even server-side variable changes only apply to a new deployment. A CMS checkbox is the only instant switch. |
| 5 | Unmatched questions fall back to keyword routing | Unmatched questions go to a **new `/help` page** | The current `routeQuestion()` returns the first question when nothing matches, which is rental car. |
| 6 | "The hero already trims to 300 characters" | Cap typed questions to 300 in the browser **and** on the server | The cap only existed on the `?q=` path. |
| 7 | Add claims and legal as suggested questions | Add them as **hidden-chip** questions (routing only) | The question list also drives the chips; adding two visible questions would grow the hero from 4 chips to 6. |
| 8 | Texas handled by a hard-coded map in code | Texas is a **CMS question** with a `State | Texas` chip | Keeps routing editor-controlled. |
| 9 | In-memory throttle per `clientId`; `Origin` check | **Vercel Firewall rate-limit rules** as the main control, plus the origin check, schema validation of every request and a per-instance best-effort limit | An in-memory counter does not work across serverless instances, and a rotating `clientId` bypasses a per-client limit. Every question spends Mark credits and now also CMS API calls. |
| 10 | "Check the bearer token" | Check it **fail-closed and in constant time** | A naive `=== \`Bearer ${process.env.X}\`` accepts the literal text `Bearer undefined` when the variable is unset. |
| 11 | Pass Mark's payload through to the browser | **Validate and whitelist** the payload before it is stored | Only known fields, length-capped, so nothing unexpected is stored or reaches the page. |
| 12 | Test "current policy" question expects "not rental car" via fallback | Same test, now expecting `/help` | See row 5. |
| 13 | The browser chooses the `correlationId` and a `clientId` | The **server** creates the `correlationId`; there is no `clientId` | The browser can't choose or guess the handle Mark's reply is matched to. |
| 14 | (not covered) | **A dedicated CMS API client** for this feature, a **cleanup sweep**, and a **reliability probe** | The CMS is a shared system, so writes need their own revocable credential, leftovers must be removed, and the rate limits and latency need measuring before the UI depends on them. |

---

## 2. How the round trip works (revised)

```
Browser                       Next.js (Liberty)                           CMS                 Mark
───────                       ─────────────────                           ───                 ────
1. POST /api/opal/ask  ─────▶ checks (origin, size, limits)
   {question}                 cid = new random key (32 hex characters)
2.                            POST OPAL_WEBHOOK_URL {question, cid} ─────────────────────────▶ workflow agent
   ◀── stream: "sent"         (webhook acknowledges)                                            classifies
                                                                                                  │
3.                            /api/tools/liberty_ask  ◀─────────────────────────────────────────┘
                                ├─ bearer token check
                                ├─ validate + whitelist payload
                                └─ POST /v1/content (key = cid, draft) ──▶ item created
4.                            every 1–2 s: GET /v1/content/{cid}/versions ─▶ 404 until it exists
   ◀── stream: "result"       found → read properties, then
                              DELETE /v1/content/{cid} (permanent) ──────▶ item removed
5. match payload → CMS question → play the remaining steps → router.push(answer page)
```

**Why this removes the risk:** the tool route and the waiting request never need to be on the same server instance. The only thing they share is the CMS, which every instance can reach.

**What was verified in the CMS API** (from the API definition bundled with `@optimizely/cms-cli`, base `https://api.cms.optimizely.com/v1`):

| Need | API | Confirmed |
|---|---|---|
| Create an item with a key I choose | `POST /content` with `key`, `contentType`, `container`, `initialVersion` | Yes (`key` is optional and used if given; a duplicate returns 409) |
| Read an unpublished draft and its properties | `GET /content/{key}/versions` | Yes (items include the version's properties) |
| Delete immediately, no recycle bin | `DELETE /content/{key}` with header `cms-permanent-delete: true` | Yes |
| Find old leftovers | `GET /content/{folderKey}/items` | Yes |
| Rate limiting | Responses include 429 | Yes, **limits themselves are not published in the definition**, so the probe measures them |

**Not yet verified:** the exact wire format for property values on create and read (the plan assumes the raw values; confirm in step 3), and whether an API client can be restricted to one folder.

**Other properties of this design**
- The items are **drafts that are never published**, so they never reach Graph or the public site.
- The item is deleted as soon as it is read. Anything left behind (the visitor left, or Mark replied late) is removed by a **sweep** (section 3).
- This is a **demo-scale** design. Each question costs about 4 CMS API calls plus one every second or two while waiting. It is not meant for production traffic at volume. The CMS calls are wrapped in a tiny store interface (`putResult`, `takeResult`) so another backend can replace them later.

---

## 3. Files

### Port from `progressive2` (with changes)

| From `progressive2` | To `libertymutual` | Change |
|---|---|---|
| `app/api/opal/trigger/route.ts` + `app/api/opal/response/route.ts` | **`app/api/opal/ask/route.ts`** | Merged into one streaming route (section 2). Validate the body, same-origin check, 300-character cap, per-instance best-effort limit, 8-second timeout on the webhook call, `maxDuration = 60`, keep-alive ping every 10 s, CMS checks that start after 1.5 seconds (Mark never replies sooner), run every second until 10 seconds and every 2 seconds after that, with back-off on 429, stop on abort, **log ids and length only, never the question text**. At the start, run the cleanup sweep with `after()` so it doesn't delay the response. |
| `app/api/opal/_store.ts` | `app/api/opal/_resultStore.ts` | **Rewrite** as the store interface: `putResult(cid, payload)`, `takeResult(cid)` (read then delete), `sweep()` |
| `app/api/_tools/_createRegistry.ts` | same path | None |
| `app/api/_tools/types.ts` | same path | Define `ParameterType` locally instead of importing the SDK |
| `app/api/_tools/_opalHandler.ts` | same path | Validate and whitelist the payload, then `putResult`; no raw-payload logging |
| `app/api/_tools/registry.ts` | same path | Tool renamed `liberty_ask`, new description |
| `app/api/discovery/route.ts` | same path | None (stays public; Mark must read it) |
| `app/api/tools/[name]/route.ts` | same path | Bearer check (fail-closed, constant time), request size limit, drop the `registry-dev` lookup and the verbose logs |
| `kb-workspace/_hooks/useOpalChat.ts` | `app/_components_liberty/useAskMark.ts` | Rewrite: no pre-opened stream, no `kb-content` fetch; one `fetch` that reads the stream, with timeout and abort |

### New

| File | Purpose |
|---|---|
| `lib/cms/managementApi.ts` | Small server-only client for the four calls above: token fetch with caching (refresh a minute early, one request at a time), create draft, read versions, permanent delete, list children. Handles 429 with `Retry-After`. Built on the pattern in `lib/cms/contentTypes.ts`, but with its **own credentials** (section 4). |
| `cms/liberty/LibAskResult.tsx` | The content type for the stored reply (section 6). Pushed with `npm run cms:push`. Not used for rendering, so it is not registered in `cms/registry.ts`. |
| `lib/askMark/parsePayload.ts` | Validates Mark's reply: allowed fields only, lengths capped, `confidence` a number from 0 to 1 |
| `app/_components_liberty/matchClassification.ts` | The deterministic match (section 5) |
| `app/api/opal/stub/route.ts` | **Non-production only.** A stand-in for Mark's webhook: after a short delay it calls this app's `liberty_ask` tool with a canned classification, over the public URL, the same way Mark would. Refuses to run when `VERCEL_ENV` is `production`. |
| `scripts/probe-mark-roundtrip.mjs` | The reliability probe (section 10) |

**Don't port:** `app/api/kb-content`, `app/api/discovery-dev`, `app/api/_tools/registry-dev.ts`, `app/api/_tools/schema.json`, the Progressive policy types.

Keep the discovery and tool paths the same as `progressive2`: `/api/discovery` serves a manifest whose endpoints are `/tools/<name>`. That layout is what worked with Mark's registry. `proxy.ts` already excludes `api` from the locale rewrite, and `app/api` does not exist yet, so nothing collides.

### Dependencies
None to add. No Opal SDK, no storage client.

---

## 4. Environment variables (all server-only)

None of these use `NEXT_PUBLIC_`.

```bash
# --- Mark (Opal) round trip: Ask Liberty -------------------------------------
# Webhook trigger of the Mark workflow agent (Agents → workflow → Webhook trigger).
# The trigger's auth header must be "Authorization" with "Bearer <token>".
OPAL_WEBHOOK_URL=
OPAL_WEBHOOK_TOKEN=

# Bearer token Mark sends when it calls /api/tools/liberty_ask. Paste the same
# value into Mark → Connectors → Registries. Any long random string:
#   openssl rand -hex 32
# If this is empty the tool route refuses every request.
OPAL_TOOL_TOKEN=

# A DEDICATED CMS API client for this feature (CMS admin → Settings → API Clients).
# Separate from OPTIMIZELY_CMS_CLIENT_ID/SECRET so it can be revoked on its own.
ASK_MARK_CMS_CLIENT_ID=
ASK_MARK_CMS_CLIENT_SECRET=

# Key of the CMS folder that holds the short-lived reply items (section 6).
ASK_MARK_RESULTS_FOLDER_KEY=

# Non-production only. "on" makes /api/opal/stub act as Mark, so the whole round
# trip can be tested (and probed) without Mark. Never set this in Production.
ASK_MARK_STUB=off
```

- **Local `.env`:** the project owner fills in real values, using a **new** Liberty workflow agent's webhook (do not reuse the Progressive one) and a newly generated `OPAL_TOOL_TOKEN`.
- **Vercel:** add the variables for Production and Preview, then redeploy. For probing, a Preview deployment sets `ASK_MARK_STUB=on` and points `OPAL_WEBHOOK_URL` at its own `/api/opal/stub`.
- **On/off switch:** not an environment variable. It is the CMS checkbox in section 6. "Mark is available" on the server means the webhook URL, tool token, CMS client and folder key are all set.

---

## 5. Matching Mark's answer to a CMS page

No new content model for matching. Each question in the Ask Liberty home page's **Suggested questions** already carries chips such as `Product | Auto` and `Topic | Rental cars` plus a URL.

**Payload Mark sends** (inside `payload`):

| Field | Example | Notes |
|---|---|---|
| `correlationId` | 32-character key | Required; the one the app sent in the webhook body |
| `intent` | `Learn about coverage` | Closed list |
| `product` | `Auto` | Closed list |
| `topic` | `Rental cars` | Closed list |
| `coverage` | `Collision & comprehensive` | Optional |
| `state` | `Texas` | Only if the visitor named one |
| `confidence` | `0.86` | 0 to 1 |
| `reasoning` | one sentence | Shown on the card only (max 200 characters), never as the answer |

**Order the match runs in:**

1. Confidence below 0.6, or `intent = Out of scope`: go to the **fallback question** (step 6).
2. If `state` is set: a question with the same `Topic` and the same `State` chip (this is the Texas question).
3. Same `Topic` and same `Product`.
4. Same `Topic` only.
5. Same `Intent`, among questions that have no `Topic` chip (claims, legal).
6. **Fallback chain:** the existing keyword match, then the question marked **Fallback**, then the first question only if none is marked.

Questions whose `State` chip is a real state (not `Needed` or `Not needed`) match only when Mark's `state` equals it. Comparison is case-insensitive and exact. Anything that fails validation counts as "no match".

---

## 6. CMS changes

New properties (non-breaking, added with the CMS type-update tool and mirrored in code):

| Type | Property | Meaning |
|---|---|---|
| `AskLibertyExperience` | `UseMark` (checkbox) | "Send questions to Mark." The instant on/off switch. Ignored if the server is not set up for Mark. |
| `AskLibertyExperience` | `MarkTimeoutSeconds` (number) | How long the browser waits for Mark. Default 20, limited to 5–60. |
| `LibAskQuestion` | `HideChip` (checkbox) | Route to this question but do not show it as a suggested-question chip. |
| `LibAskQuestion` | `IsFallback` (checkbox) | Where unmatched or unsafe questions land. |

New type and folder for the stored reply:

- **`LibAskResult`** (`_component`, no composition behaviors, never rendered): `Intent`, `Product`, `Topic`, `Coverage`, `State` (text), `Confidence` (number), `Reasoning` (text, capped at 200 characters).
  - **Why a component:** the CMS only lets a component be created inside a folder, and a component has no web address. A page type would appear in the site tree and get a public URL.
  - **Not indexed:** every property has `indexingType: 'disabled'`, so nothing is searchable even if a draft reached Graph.
  - **Not translated:** no property is localized; the items use the default language.
  - **No question text:** the visitor's question is not a property and is never stored.
  - **Key:** each item's key is the random 32-character `correlationId`.
- **A folder "Ask Liberty Mark results"** in the CMS (the CMS's standard folder type), created once. Its key goes in `ASK_MARK_RESULTS_FOLDER_KEY`. Items in it are named `r-<time>-<short id>` so the sweep can tell their age without extra calls.
- **Delete on read, no exceptions.** Every reply is deleted as soon as the waiting request has read it. There is no setting to keep replies, in any environment. The only other way an item is removed is the sweep below.

New content (created with the CMS tools):

- **Questions on the home page:**
  - Claims: `Intent | Account service`, `Topic | Claim status`, URL `/claim-status`, hidden chip.
  - Legal: `Intent | Legal advice`, URL `/legal-question`, hidden chip.
  - Texas: `Intent | Learn about requirements`, `Product | Auto`, `Topic | State minimums`, `State | Texas`, URL `/required-coverage/texas`, hidden chip.
  - Fallback: URL `/help`, chips `Handling | Outside what we can answer | warn`, hidden chip, marked as fallback.
- **New page `/help`** (answer layout, built from existing blocks): title "We couldn't find an approved answer for that", a handoff banner to talk to an agent, a section heading and the answer link cards pointing at the existing answer pages, helpful row.
- **Keyword fix:** change `rent` to `rental` on the rental question, so "current policy" no longer matches it. Review the other keywords once the fallback exists.

**Cleanup sweep:** at the start of each question, list the folder (`/content/{folderKey}/items`) and permanently delete items whose name shows they are older than 10 minutes (at most 20 per run). This removes replies nobody collected.

---

## 7. App changes

### `AiProgressPanel` (controlled mode)
Add optional `phase?: 'sending' | 'classifying' | 'retrieving'` and `liveChips`, plus an optional `notice` line.
- When `phase` is set, steps 1 and 2 wait for it instead of timers. Each step keeps a short minimum display time so a fast reply still animates. Steps 3 and 4 are unchanged.
- With `phase` unset the panel behaves exactly as today, so simulated mode and the demo pages are untouched.

### `AskLibertyHero`
When the page's `UseMark` is on and the server is ready, `ask()` does this:
1. Shows the card in `sending` with the visitor's own words.
2. Calls `useAskMark().submit(text)`: one request to `/api/opal/ask`. The stream's `sent` event moves the card to `classifying`; its `result` event carries Mark's reply.
3. On a reply: runs `matchClassification`, shows **Mark's** chips (Intent, Product, Topic, Coverage, State), and shows the `reasoning` line under them as "How your question was understood". If the matched question has a warning chip that Mark did not supply (for example `State | Needed`), that chip is added.
4. Retrieval lines come from the **matched** question, then the card finishes and `router.push(href)` runs.
5. On timeout (the CMS value), a stream error, a CMS error or repeated 429s, or a closed connection: the card shows "Mark is taking longer than usual, using approved keyword routing", then the fallback chain in section 5 runs. The browser aborts its request, which stops the server's checks.

Unchanged: the suggested-question chips, the `/?q=` hand-off from answer-page ask bars, and CMS preview (no Mark calls, no card).

---

## 8. The Mark side (built in Mark, not in the repo)

1. **Specialized agent "Ask Liberty classifier":** closed lists that exactly match the CMS chip values.
   - `intent`: Learn about coverage · Learn about requirements · Compare options · Account service · Legal advice · Out of scope
   - `product`: Auto · Home · Home + Auto · Renters
   - `topic`: Rental cars · Water damage · State minimums · Bundling · Claim status
   - Rules: output JSON only, never answer the question, set `state` only when the visitor states one, set `confidence`.
   - Note: `Renters` has no answer page, so it ends on the `/help` page.
2. **Workflow agent:** a webhook trigger receiving `{ question, correlationId }`, then the classifier, then a call to `liberty_ask` with the classification and the same `correlationId`.
3. **Tool registry:** Mark → Connectors → Registries → discovery URL `https://libertymutual.optimoey.com/api/discovery`, Bearer = `OPAL_TOOL_TOKEN`.

**Keep the lists in sync.** If editors add a question with a new `Topic` value, the classifier prompt needs it too. A later option is a `liberty_taxonomy` tool that reads the chips from Graph.

---

## 9. Security rules for the new routes

| Route | Rules |
|---|---|
| `/api/opal/ask` | Body must be valid JSON of the expected shape; `question` trimmed and at most 300 characters; same-origin check on `Origin` / `Sec-Fetch-Site`; the server makes the `correlationId`; per-instance best-effort limit; 8-second timeout on the webhook call; never longer than 60 seconds; log ids and length only. |
| `/api/tools/[name]` | Refuse everything if `OPAL_TOOL_TOKEN` is unset; compare tokens in constant time; only the `liberty_ask` tool; request size limit; the `correlationId` must be a 32-character key; payload validated and whitelisted before it is stored; no payload logging. |
| `/api/opal/stub` | Runs only when `ASK_MARK_STUB=on` **and** `VERCEL_ENV` is not `production`; otherwise 404. |
| `/api/discovery` | Public and read-only (Mark must read it). Confirm during Mark setup whether Mark also sends the bearer here. |
| Edge | **Vercel Firewall rate-limit rules** on `/api/opal/ask`, for example a small number of requests per minute per IP. These count across all instances. Rule limits depend on the Vercel plan; confirm what is available. |

**CMS-specific rules**
- Use a **dedicated API client** for this feature so it can be revoked without touching the build and admin credentials. Check whether the client can be limited to the results folder; if it can't, record that the credential has full CMS reach.
- The reply items are **drafts, never published**, named by a random key, deleted as soon as they are read, and swept after 10 minutes. They hold Mark's classification only. The visitor's question text is never written to the CMS, but `reasoning` is Mark's own text and could repeat part of it, so it is length-capped and short-lived.
- CMS credentials stay server-only and are never logged or sent to the browser.
- Pre-existing, outside this plan: the `/admin` pages already use the general CMS credentials at runtime. If that route is reachable on the live site, it is worth reviewing separately.

Other rules: nothing from Mark is rendered as HTML (React text only); `confidence` must be a finite number from 0 to 1; the server never holds a request longer than 60 seconds.

---

## 10. Build order

| # | Step | Done when |
|---|---|---|
| 1 | Branch `libertymutual-mark` from `libertymutual` | — |
| 2 | In the CMS: create the dedicated API client and the results folder. Push the `LibAskResult` type. Add the env vars to `.env.example`, Vercel and local `.env`. | `yarn build` passes; a test create and delete works from a script |
| 3 | Write `lib/cms/managementApi.ts`, `_resultStore.ts`, the `ask` route, the tools routes, registry, handler, parser, and the non-production stub. **Confirm the property value format against the live API.** | `GET /api/discovery` lists `liberty_ask`; the negative tests in section 11 pass |
| 4 | Write `scripts/probe-mark-roundtrip.mjs` and run it against a **Preview deployment** with the stub on | **Pass mark** (all must hold): at least 99 of 100 asks delivered inside the 20-second timeout; the extra delay between the stub's reply and the browser receiving it is under 3 seconds for 95% of asks; no unrecovered 429s with 5 asks at once; **zero items left in the results folder** afterwards. The result is recorded in this document. |
| 5 | Write `useAskMark` (one request, read the stream, timeout, abort) | Works end to end against the stub |
| 6 | Add controlled mode to `AiProgressPanel` and the Mark path to `AskLibertyHero` | With `UseMark` off, behaviour is identical to today |
| 7 | Write `matchClassification` | Sample payloads route as in the section 11 table |
| 8 | CMS: new properties, new questions, `/help` page, keyword fix | Fallback reaches `/help`; Texas and claims reachable by rule |
| 9 | Build the classifier and workflow agents in Mark; register the tool | A Mark test run calls `liberty_ask` and the browser receives the reply |
| 10 | Local end to end with ngrok (`ngrok http --url=<liberty domain> 3031`; do not reuse the Progressive domain), then deploy and repeat on `libertymutual.optimoey.com`; add the Firewall rule | The section 11 tests all pass |

**The probe (step 4)** simulates Mark without Mark. The script runs 100 asks against the Preview URL. Each ask opens `/api/opal/ask`, whose webhook is the stub; the stub waits 1 to 3 seconds and then calls the `liberty_ask` tool over the public URL, exactly as Mark would. The script records, for each ask, the time from the stub's reply to the browser receiving it, counts 429 responses, and finally lists the results folder. If the pass mark is missed, stop and decide with the project owner (slower polling, a lower volume limit, or a different store) before building the UI on it.

---

## 11. Test plan

| Question typed | Expected classification | Expected page |
|---|---|---|
| Does my car insurance cover a rental car? | Auto · Rental cars | `/rental-car` |
| My pipe burst last night, am I covered? | Home · Water damage | `/burst-pipe` |
| What's the minimum car insurance in Texas? | Auto · State minimums · Texas | `/required-coverage/texas` |
| What car insurance do I legally need? | Auto · State minimums · no state | `/required-coverage` |
| Can I put my house and car on one policy? | Home + Auto · Bundling | `/bundling` |
| Where is my claim payment? | Account service · Claim status | `/claim-status` |
| Should I sue the other driver? | Legal advice | `/legal-question` |
| How much would my current policy cost? | Low confidence or out of scope | `/help` |
| Do you cover renters insurance? | Renters, no page | `/help` |
| Any question with `UseMark` off | — | Same as today (simulated); unmatched goes to `/help` |
| Any question with the webhook URL wrong | — | Timeout message, then keyword fallback, then `/help` |
| Mark never replies | — | After the CMS timeout: same fallback; the server stops checking |
| CMS unreachable, or repeated 429s | — | Same fallback; no error page |

**Negative and safety tests**
- `/api/tools/liberty_ask` with no token, a wrong token, or with `OPAL_TOOL_TOKEN` unset: 401 each time (including the literal header `Bearer undefined`).
- A reply with a malformed or unknown `correlationId`: rejected, nothing written.
- Malformed or oversized payload, an unknown field, `confidence` of 5: rejected or stripped.
- `/api/opal/ask` from another origin: 403. Question over 300 characters: 400.
- After a successful ask, the reply item is gone from the folder.
- A reply nobody collects (the visitor closed the page): removed by the sweep within 10 minutes.
- The browser closes the page mid-question: the server stops checking.
- `/api/opal/stub` in Production: 404.
- Two browser tabs asking at once each get their own answer.
- The ask bar on an answer page sends `/?q=…` and goes through Mark.
- CMS preview and Visual Builder make no Mark calls and show no card.
- Server logs contain ids and lengths, not question text.

---

## 12. Risks and open items

| Risk | Mitigation |
|---|---|
| **CMS API limits and latency** (429 exists, limits are not published; each question makes about 4 calls plus one every second or two while waiting) | The probe measures both before the UI depends on them; 1-second checks with back-off; honest fallback; demo-scale only. |
| **Writes to a shared CMS** (draft churn, possible sync and audit noise, orphaned items) | Dedicated folder, permanent delete after read, sweep after 10 minutes, probe checks for leftovers. |
| **Credential reach** (an API client that can write content, in a public app's server environment) | Dedicated, revocable client; server-only; confirm whether it can be limited to the folder; the pre-existing `/admin` use of the general credentials is flagged separately. |
| **Property value format** on the REST API is unverified | Confirm in step 3 before anything else is built on it. |
| **Mark setup can't be verified from the repo** (webhook trigger, registry, classifier agent) | The main schedule risk; start step 9 early and confirm Mark can call a public Vercel URL. |
| **Mark latency** (several seconds is possible) | CMS timeout, honest on-screen message, then fallback. Rehearse on the demo network. Untick `UseMark` in the CMS to switch back instantly. |
| **Credit abuse** (every question starts a Mark run and spends CMS calls) | Firewall rate limit plus origin check, length cap and the per-instance limit. Check which rate-limit rules the Vercel plan allows. |
| **Taxonomy drift** between CMS chips and the classifier prompt | One shared list (section 8); re-test whenever editors add a question; later the `liberty_taxonomy` tool. |
| **Discovery auth** unknown | Check during Mark setup (section 9). |
| **Messaging** | On the card, label Mark's reasoning "How your question was understood". The page content is the approved CMS answer. |
| **No test runner** in the project | Verify the matching and validation with sample payloads in a throwaway script (`node --experimental-strip-types`); adding a test runner is out of scope. |
| **Opal may call the tool more than once** | A second write for the same key is rejected (409) and ignored; the first reply wins. |

---

## 13. What this adds to the demo

- **Before:** "Sending your question to Mark" was a scripted animation with keyword routing.
- **After:** Mark classifies the question, the chips on the card are Mark's output, and Next.js routes to approved, governed CMS content. Unknown, low-confidence and out-of-scope questions land on a safe `/help` page.
- **Checklist items strengthened:** natural-language search or answer experience, fallback when the platform is uncertain, and separation between current and roadmap functionality.
