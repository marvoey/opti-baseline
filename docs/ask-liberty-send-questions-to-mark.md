# Ask Liberty: "Send questions to Mark" (setup and reference guide)

This guide explains how the **Send questions to Mark** feature works and exactly what has to be set up on each side: the website (this repo), the CMS, and Mark (Optimizely Opal). It is written so that someone, or Mark itself, can set everything up from this page alone.

Related documents:
- `docs/ask-liberty-mark-roundtrip-plan.md` – the design decisions, build status and probe results.
- `docs/ask-liberty-cms-plan.md` – how the Ask Liberty pages are built in the CMS.

---

## 1. What the feature does

On the Ask Liberty home page a visitor types a question. With the feature **off**, a simulated progress card plays and the question is routed to an answer page by keyword matching. With the feature **on**:

1. The website sends the question to a **Mark workflow agent**.
2. Mark **classifies** the question (intent, product, topic, state, and so on). Mark does **not** write an answer.
3. Mark calls a **tool on the website** (`liberty_ask`) with that classification.
4. The website matches the classification to one of the **approved CMS answer pages** and sends the visitor there. The progress card shows Mark's own classification chips and its one-sentence reasoning.

The trust story: Mark understands the question; the answer is always approved, governed CMS content. Anything unclear or out of scope goes to the `/help` page.

If Mark is slow, down or misconfigured, the website falls back to the keyword routing and says so on the card ("Mark is taking longer than usual, using approved keyword routing."). The visitor always lands on a page.

### The on/off switch

The switch is a checkbox in the CMS, so no redeploy is needed to change it:

- Open the **Ask Liberty start page** (the page the home page points to) in the CMS editor.
- **Send questions to Mark** (`UseMark`): tick to send questions to Mark; untick for the simulated card.
- **Mark timeout (seconds)** (`MarkTimeoutSeconds`): how long the browser waits for Mark before using keyword routing. Default 20, allowed 5 to 60.

Ticking the box only takes effect when the server also has everything it needs (section 5). It is always ignored in CMS preview and the on-page editor.

---

## 2. The round trip, step by step

```
Browser                    Website (Next.js on Vercel)                 Mark (Opal)              CMS
   │                              │                                       │                      │
   │ POST /api/opal/ask           │                                       │                      │
   │ {question} ────────────────▶ │ makes correlationId (32 hex)          │                      │
   │                              │ POST OPAL_WEBHOOK_URL                 │                      │
   │                              │ {question, correlationId} ──────────▶ │ workflow starts      │
   │ ◀── event: sent ──────────── │ ◀── 2xx (acknowledged) ────────────── │ classifier runs      │
   │                              │                                       │                      │
   │                              │   waits, checking the CMS store       │                      │
   │                              │   every 1 s (first check at 1.5 s)    │                      │
   │                              │                                       │ calls liberty_ask    │
   │                              │ ◀── POST /api/tools/liberty_ask ───── │ {payload:{...}}      │
   │                              │ validates, whitelists fields          │                      │
   │                              │ stores a draft item keyed by the id ─────────────────────────▶ │
   │                              │ finds the item, reads it, ────────────────────────────────────▶ │
   │ ◀── event: result ────────── │ sends the result, then deletes the item                       │
   │ matches a CMS question,      │                                                               │
   │ plays the card, navigates    │                                                               │
```

Why the CMS holds the reply: Mark's tool call and the visitor's open request can land on **different server instances** on Vercel, so the reply needs a shared place to wait. The CMS is that place (a short-lived draft item, never published, deleted as soon as it is read). No Redis or other extra service is used.

**Events the browser receives** on `POST /api/opal/ask` (a server-sent-events stream):

| Event | Meaning |
|---|---|
| `sent` | Mark acknowledged the question (the webhook answered 2xx). |
| `result` | Mark's classification arrived. Data: `{ "payload": { ...fields } }`. |
| `timeout` | No reply within the server's hold limit (60 s). |
| `error` | `{ "code": "webhook" }` (Mark did not accept the question) or `{ "code": "store" }` (the CMS store failed 3 times). |

The browser then uses keyword routing for `timeout` and `error`.

---

## 3. What Mark must be set up to do

Three things are built in Mark. Nothing in this repo creates them.

### 3.1 Workflow agent with a webhook trigger

Create a workflow agent that starts from a **Webhook trigger**. Copy the trigger's URL into `OPAL_WEBHOOK_URL`. Set the trigger's authentication so it expects the header `Authorization: Bearer <token>`, and put that token in `OPAL_WEBHOOK_TOKEN`.

**What the website sends to the webhook** (HTTP POST, `Content-Type: application/json`):

```json
{
  "question": "What's the minimum car insurance in Texas?",
  "correlationId": "3f2a9c1e8b7d4a6f9e0c5d2b1a8f7e63"
}
```

| Field | Details |
|---|---|
| `question` | The visitor's text, 1 to 300 characters. May contain personal details, so treat it as sensitive and do not store it. |
| `correlationId` | 32 lowercase hexadecimal characters (a GUID without dashes). Made by the website for this one question. **Mark must pass it back unchanged.** |

**Webhook response:** the website waits up to **8 seconds** for any 2xx response and treats that as "Mark accepted the question". Anything else (or no answer) is shown to the visitor as an error and keyword routing is used. The classification must **not** be returned in the webhook response; it is delivered by calling the tool (3.3).

### 3.2 Classifier agent ("Ask Liberty classifier")

A specialized agent that the workflow calls with the question. It must return values from the **closed lists in section 4** (exact spelling; matching is case-insensitive but otherwise exact). Suggested prompt:

```
You classify one customer question for Liberty Mutual's "Ask Liberty" website.
You only classify. Never answer the question, give advice, or quote policy terms.

Return these fields, using ONLY the values listed (exact spelling):

intent (required), one of:
  Learn about coverage | Learn about requirements | Compare options |
  Account service | Legal advice | Out of scope
product (optional), one of: Auto | Home | Home + Auto
topic (optional), one of:
  Rental cars | Water damage | State minimums | Bundling | Claim status
coverage (optional, display only): short phrase such as
  Collision & comprehensive | Dwelling
state (optional): the full US state name ONLY if the customer names one, for
  example Texas. Otherwise leave it out.
confidence (required): a number from 0 to 1
reasoning (required): ONE sentence, at most 200 characters, saying how you
  understood the question. Do not repeat personal details from the question.

Rules:
- If the question is not about car, home, renters or bundled insurance, or asks
  for legal advice, or you are unsure, use intent "Out of scope" or
  "Legal advice" and a low confidence.
- Leave a field out rather than guessing a value that is not in the list.
- Questions about the status or payment of an existing claim: intent
  "Account service", topic "Claim status".
- Asking whether to sue, hire a lawyer or take legal action: intent
  "Legal advice", no topic.
```

### 3.3 Tool registry: register the website's tool

In Mark, add a **tool registry** (Connectors → Registries) with:

| Setting | Value |
|---|---|
| Discovery URL | `https://<your-site>/api/discovery` (for example `https://libertymutual.optimoey.com/api/discovery`) |
| Authentication | Bearer token, set to the same value as `OPAL_TOOL_TOKEN` on the website |

The discovery endpoint is public and read-only. It returns:

```json
{
  "functions": [
    {
      "name": "liberty_ask",
      "description": "Returns the classification of a Liberty Mutual customer question to the Ask Liberty website. Call exactly once per question, passing the correlationId you received with the question. Return only the classification fields. Never answer the question.",
      "endpoint": "/tools/liberty_ask",
      "http_method": "POST",
      "parameters": [
        {
          "name": "payload",
          "type": "object",
          "required": true,
          "description": "The classification of the question. Must include the correlationId you were given, plus intent, product, topic, coverage, state, confidence and reasoning as available."
        }
      ]
    }
  ]
}
```

Mark appends the `endpoint` to the registry's base (`https://<your-site>/api`), so the call goes to `POST https://<your-site>/api/tools/liberty_ask`.

The workflow's last step must **call `liberty_ask` exactly once** with the classifier's output plus the `correlationId` from the webhook.

**The tool call:**

```http
POST /api/tools/liberty_ask
Authorization: Bearer <OPAL_TOOL_TOKEN>
Content-Type: application/json

{
  "parameters": {
    "payload": {
      "correlationId": "3f2a9c1e8b7d4a6f9e0c5d2b1a8f7e63",
      "intent": "Learn about requirements",
      "product": "Auto",
      "topic": "State minimums",
      "state": "Texas",
      "confidence": 0.87,
      "reasoning": "The question asks for car insurance minimums in Texas."
    }
  }
}
```

(The body may also be sent without the outer `parameters` wrapper: `{ "payload": { ... } }`.)

**Payload fields.** Anything not listed is dropped. Text is trimmed, control characters are removed, and length is capped.

| Field | Type | Required | Limit | Notes |
|---|---|---|---|---|
| `correlationId` | string | **yes** | exactly 32 hex characters | Trimmed and lower-cased by the server. **Dashes are not accepted.** Wrong or missing: HTTP 400. |
| `intent` | string | strongly | 60 characters | See section 4. |
| `product` | string | no | 60 | |
| `topic` | string | no | 60 | |
| `coverage` | string | no | 60 | Shown as a chip; not used for matching. |
| `state` | string | no | 60 | Only set it when the visitor names a state. |
| `confidence` | number 0 to 1 | strongly | | A numeric string such as `"0.8"` is accepted. Out of range is dropped (which counts as 0 and triggers the fallback). |
| `reasoning` | string | no | 200 | One sentence, shown on the progress card only. |

**Responses:**

| Status | Body | Meaning |
|---|---|---|
| 200 | `{ "success": true, "stored": true }` | Reply stored; the waiting visitor request will pick it up. |
| 200 | `{ "success": true, "stored": false }` | A reply for this id was already stored. The **first reply wins**; later ones are ignored. |
| 400 | `{ "error": "..." }` | Body is not JSON, `payload` is not an object, or `correlationId` is missing or malformed. |
| 401 | `{ "error": "Unauthorized" }` | Bearer token missing or wrong, **or `OPAL_TOOL_TOKEN` is not set on the website** (it refuses everything when unset). |
| 404 | `{ "error": "Tool not found" }` | The tool name in the URL is not `liberty_ask`. |
| 413 | `{ "error": "Request too large" }` | Body over 8 KB. |
| 503 | `{ "error": "Could not store the reply" }` | The CMS store failed. Mark may retry once; a duplicate is harmless. |

### 3.4 Timing Mark should aim for

- Reply (call the tool) as soon as the classification is ready. The website starts checking 1.5 s after sending the question and then every second.
- The browser gives up after the CMS **Mark timeout** (default 20 s) and uses keyword routing. The server holds the question open at most 60 s.
- Aim for a total workflow time under about 10 s. The round trip itself adds roughly 1 s typically (see the probe results in the plan document).
- A reply that arrives after the visitor has already been routed is harmless: it is stored, never read, and removed by the sweep (section 7).

---

## 4. The values Mark must use (closed lists) and how they are matched

The website does not ask Mark for a page address. It compares Mark's classification to the **questions defined on the Ask Liberty page in the CMS** and picks one deterministically. So the classifier's lists must match the classification chips on those CMS questions.

### 4.1 Values in use today

| Field | Values |
|---|---|
| `intent` | `Learn about coverage`, `Learn about requirements`, `Compare options`, `Account service`, `Legal advice`, `Out of scope` |
| `product` | `Auto`, `Home`, `Home + Auto` |
| `topic` | `Rental cars`, `Water damage`, `State minimums`, `Bundling`, `Claim status` |
| `coverage` | free text for display (for example `Collision & comprehensive`, `Dwelling`) |
| `state` | a state name, only when named (today only `Texas` has its own page) |

### 4.2 The CMS questions and where each one lands

| Question (CMS) | Classification chips (what Mark should return) | Page |
|---|---|---|
| Does my car insurance cover a rental car? | Learn about coverage · Auto · Rental cars | `/rental-car` |
| Is a burst pipe covered by home insurance? | Learn about coverage · Home · Water damage | `/burst-pipe` |
| What car insurance am I required to have? | Learn about requirements · Auto · State minimums (no state) | `/required-coverage` |
| What car insurance do I need in Texas? | Learn about requirements · Auto · State minimums · State **Texas** | `/required-coverage/texas` |
| Can I bundle home and auto? | Compare options · Home + Auto · Bundling | `/bundling` |
| My claim hasn't been paid yet, where is it? | Account service · topic Claim status | `/claim-status` |
| Should I sue the other driver? | Legal advice (no topic) | `/legal-question` |
| We couldn't find an approved answer (fallback) | (never matched by rule) | `/help` |

### 4.3 Matching rules (`app/_components_liberty/matchClassification.ts`)

Comparison is exact and case-insensitive. The first rule that finds a question wins:

1. If Mark gave **topic and state**: a question with that topic and that state (for example State minimums + Texas).
2. Among questions that are **not state-specific**: same **topic and product**.
3. Same **topic**.
4. Same **intent**, among questions that have **no topic** (today only the legal question; the claims question has the topic Claim status, so it matches by topic).
5. Nothing matched: keyword routing on the typed text, then the fallback question, then the first question.

**Fallback:** if `intent` is `Out of scope`, or `confidence` is below **0.6**, the visitor goes to the question marked **Fallback question** in the CMS (`/help`) without running the rules.

State-specific questions (a State chip that is a real state) only match when Mark names that state. "Needed" and "Not needed" in a State chip are treated as no state.

### 4.4 Example payloads and expected results

| Visitor types | Mark returns | Visitor lands on |
|---|---|---|
| Do I need rental coverage when I rent a car? | intent Learn about coverage, product Auto, topic Rental cars, confidence 0.9 | `/rental-car` |
| What's the minimum car insurance in Texas? | intent Learn about requirements, product Auto, topic State minimums, state Texas, confidence 0.87 | `/required-coverage/texas` |
| What car insurance do I need by law? | same, without state | `/required-coverage` |
| Where is my claim payment? | intent Account service, topic Claim status, confidence 0.88 | `/claim-status` |
| Should I sue the other driver? | intent Legal advice, confidence 0.9 | `/legal-question` |
| What's the best pizza in Boston? | intent Out of scope, confidence 0.3 | `/help` |
| anything, confidence 0.5 | | `/help` |

### 4.5 Keeping the lists in sync (taxonomy drift)

The lists in section 4.1 are copied from the CMS chips. **If an editor adds a question with a new Topic, Product or Intent value, the classifier prompt must get the same value**, or matches will silently fall back to keyword routing. After any CMS change to the questions, re-run the test questions in section 8. A later improvement could be a second tool that returns the current chip values from Graph so Mark always uses live values.

---

## 5. Configuration

### 5.1 Environment variables (all server-only)

Set them in `.env` locally (copy from `.env.example`) and in **Vercel → Project → Settings → Environment Variables**. **Vercel only reads changes on a new deployment**, which is why the on/off switch is a CMS checkbox and not a variable.

| Variable | What it is | Where the value comes from |
|---|---|---|
| `OPAL_WEBHOOK_URL` | The Mark workflow's webhook trigger URL | Mark: the workflow's Webhook trigger |
| `OPAL_WEBHOOK_TOKEN` | Bearer token the website sends to that webhook | Mark: the trigger's authentication |
| `OPAL_TOOL_TOKEN` | Bearer token Mark must send to `/api/tools/liberty_ask` | Make one: `openssl rand -hex 32`. Paste the same value into Mark's registry |
| `ASK_MARK_CMS_CLIENT_ID` | CMS API client for the reply store | CMS → Settings → API Clients (a **dedicated** client so it can be revoked alone) |
| `ASK_MARK_CMS_CLIENT_SECRET` | Its secret | Same place. Never commit it |
| `ASK_MARK_RESULTS_FOLDER_KEY` | Key of the CMS folder that holds the reply items | See 5.2 |
| `ASK_MARK_STUB` | `on` makes `/api/opal/stub` act as Mark (testing only). Ignored on Vercel Production | Leave `off` |
| `ASK_MARK_RATE_LIMIT` | Questions per minute per client address per server instance (default 10) | Optional; raise only for the load probe |
| `OPTIMIZELY_CMS_API_URL` | CMS API gateway (default `https://api.cms.optimizely.com`) | Optional |

"Ready" means the webhook URL, the tool token and all three CMS store values exist (`lib/askMark/config.ts`, `markReady()`). If any is missing the route answers 503 and the page keeps the simulated card, even if the checkbox is ticked.

### 5.2 CMS setup (once)

1. **Content type `LibAskResult`.** Defined in `cms/liberty/LibAskResult.tsx`; push it with `npm run cms:push` (this pushes only types that do not exist yet). It is a plain component with no composition behavior, so it is never placed on a page and has no URL. Properties: `Intent`, `Product`, `Topic`, `Coverage`, `State`, `Confidence` (float), `Reasoning`. None is indexed or translated.
2. **A folder** named "Ask Liberty Mark results" in the CMS asset panel (a component can only be created inside a folder). Its key goes in `ASK_MARK_RESULTS_FOLDER_KEY`. Keep it empty and unpublished; nothing else should live there.
3. **A dedicated API client** with permission to create, read and delete content in that folder. Its id and secret go in the two `ASK_MARK_CMS_*` variables.
4. **The checkbox** on the Ask Liberty page (section 1), once everything else works.

The question text is **never stored in the CMS**, only Mark's classification.

---

## 6. Code map

| File | Role |
|---|---|
| `app/api/opal/ask/route.ts` | Browser entry point. Checks, creates the id, calls Mark's webhook, streams `sent` / `result` / `timeout` / `error`. |
| `app/api/discovery/route.ts` | Public tool manifest Mark reads (section 3.3). |
| `app/api/tools/[name]/route.ts` | Where Mark calls tools. Bearer check, 8 KB limit, runs the tool handler. |
| `app/api/_tools/registry.ts` | Defines the `liberty_ask` tool and its description. |
| `app/api/_tools/_opalHandler.ts` | The handler: validates the payload and stores the reply. |
| `app/api/_tools/_createRegistry.ts`, `types.ts` | Small tool registry and the discovery manifest format. |
| `app/api/opal/_resultStore.ts` | The reply store: put, take (read then delete), prepare, sweep. |
| `lib/cms/managementApi.ts` | Small client for the CMS Content Management API (token cache, retries on 429, slow-call logging). |
| `lib/askMark/config.ts` | Reads the environment and decides if the server is "ready". |
| `lib/askMark/parsePayload.ts` | Validates and whitelists Mark's payload. |
| `lib/askMark/requestGuards.ts` | Constant-time bearer check, same-origin check, body limits, rate limiter. |
| `app/api/opal/stub/route.ts` | Testing stand-in for Mark (non-production only). |
| `cms/liberty/AskLibertyExperience.tsx` | The Ask Liberty page type, including `UseMark` and `MarkTimeoutSeconds`. |
| `cms/liberty/LibAskResult.tsx` | The reply-store content type. |
| `app/_components_liberty/AskLibertyHero.tsx` | The hero: sends the question and runs the card. |
| `app/_components_liberty/useAskMark.ts`, `askStream.ts` | Browser side of the stream. |
| `app/_components_liberty/matchClassification.ts` | Section 4.3 matching and the fallback rules. |
| `app/_components_liberty/AiProgressPanel.tsx` | The progress card (controlled by phase when Mark is on). |
| `scripts/probe-mark-roundtrip.mjs` | Load and reliability probe (uses the stub, no Mark needed). |

---

## 7. Security and privacy rules (do not remove)

- **Inbound tool calls** need `Authorization: Bearer <OPAL_TOOL_TOKEN>`, compared in constant time. With no token configured, every call is refused (it never accepts a literal "Bearer undefined").
- **The browser route** (`/api/opal/ask`) only accepts same-origin browser requests, a body of at most 2 KB, a question of 1 to 300 characters, at most 50 questions in progress per instance, and a per-address limit (default 10 a minute). The per-instance limit is best effort only: **add a Vercel Firewall rate-limit rule on `/api/opal/ask`** as the real limit.
- **The tool route** accepts only registered tools and bodies up to 8 KB.
- **Whitelisting:** only the seven classification fields survive, with length caps. Anything else Mark sends is dropped, on the server and again in the browser.
- **The question text is never logged and never stored.** Logs carry only the correlation id, the character count and timings.
- **Reply items** are drafts that are never published, so they never reach Graph or the public site. Each is deleted as soon as it is read, and a **sweep** deletes any item older than 10 minutes (it runs after a question, at most every 2 minutes per instance).
- **The stub** returns 404 unless `ASK_MARK_STUB=on` **and** the deployment is not Vercel Production.
- The correlation id is made by the server, not the browser, so a visitor cannot choose it.
- Secrets live only in `.env` and Vercel environment variables. Never commit them.

---

## 8. Testing

### 8.1 Without Mark (the stub)

Use a local build or a Preview deployment, never Production.

1. Set `ASK_MARK_STUB=on`, `OPAL_WEBHOOK_URL=<site>/api/opal/stub`, any `OPAL_WEBHOOK_TOKEN` and `OPAL_TOOL_TOKEN`, and the three CMS store values.
2. Tick **Send questions to Mark** on the page (or test the route directly).
3. Ask a question on the home page. The stub acknowledges at once, waits 3 to 5 seconds, then calls `liberty_ask` over the public URL exactly as Mark would.
4. Load probe: `node --env-file=.env scripts/probe-mark-roundtrip.mjs <preview-url> --asks 100 --burst 5` (set `ASK_MARK_RATE_LIMIT` high on that Preview first). Its pass mark is in the comment at the top of the script and the measured results are in the plan document.

### 8.2 The tool endpoint by hand

Replace `<site>`, the token and the id. The id must be 32 lowercase hex characters.

```bash
curl -i -X POST "https://<site>/api/tools/liberty_ask" \
  -H "Authorization: Bearer $OPAL_TOOL_TOKEN" \
  -H "Content-Type: application/json" \
  -d '{"parameters":{"payload":{"correlationId":"0123456789abcdef0123456789abcdef","intent":"Account service","topic":"Claim status","confidence":0.9,"reasoning":"Test."}}}'
```

Expect `200 {"success":true,"stored":true}`. Without the header, expect 401. The test item is removed by the sweep after 10 minutes (or delete it in the CMS folder). Also check the discovery manifest: `curl https://<site>/api/discovery`.

### 8.3 With the real Mark

1. In Mark, run the workflow with a test body `{"question":"...","correlationId":"<32 hex>"}` and confirm it calls `liberty_ask` (a 200 with `stored: true` in Mark's run log).
2. Tick the checkbox on the Preview or Production page and ask the questions in section 4.4. Expect: the card's chips are Mark's, the reasoning line shows, then the browser goes to the page in the right-hand column.
3. Switch off Mark's webhook (wrong URL) and ask once. Expect the keyword-routing notice and a correct landing page.

---

## 9. Troubleshooting

| What you see | Likely cause |
|---|---|
| Card stays simulated, no call to Mark | Checkbox not ticked, you are in CMS preview, or the server is not "ready" (a variable is missing). The route answers 503 `Mark is not configured`. |
| `error` event with code `webhook` | `OPAL_WEBHOOK_URL` or `OPAL_WEBHOOK_TOKEN` is wrong, the workflow is not published or enabled, or Mark took over 8 s to acknowledge. The server log shows `webhook answered <status>`. |
| Mark's run log shows 401 from `liberty_ask` | The registry's bearer token does not equal `OPAL_TOOL_TOKEN`, or the variable is not set on that deployment (changes need a redeploy). |
| Mark's run log shows 400 | `correlationId` missing, has dashes, or is not the exact id from the webhook body. |
| 503 `Could not store the reply` | The CMS API client, secret or folder key is wrong, or the `LibAskResult` type is not pushed. Check the server log for the CMS status. |
| Card says Mark is taking longer, and the page is right | Mark did not reply inside the CMS timeout. Check how long the workflow takes, or raise **Mark timeout**. |
| Lands on `/help` unexpectedly | Confidence under 0.6, `intent` is `Out of scope`, or the classifier used a value that is not in the lists (taxonomy drift, section 4.5). |
| Lands on the generic required-coverage page for a Texas question | Mark did not return `state: Texas` or the topic. |
| Slow replies under load | The CMS creates items in 0.1 s or about 1 s and rate-limits (429) above about 15 calls a second. See "Probe results" in the plan document. |
| Items left in the results folder | A visitor left early or a delete was rate-limited. The sweep removes them after 10 minutes. |

---

## 10. Known limits and status

- The reply store adds about 1 second typically, with occasional slower cases (the CMS create time varies). A question never gets lost: delivery was 100 of 100 in every probe run, and a slow reply falls back to keyword routing.
- Options if the delay matters on stage: hand the reply over in memory when it reaches the same server instance (the CMS stays as the fallback), or accept the current behavior. See "Decision needed" in `docs/ask-liberty-mark-roundtrip-plan.md`.
- Tested so far with the stub against the live CMS. **Not yet tested:** the real Mark workflow, and the live card in a browser on a deployed site.
- The home page draft that has the hidden Texas, claims, legal and fallback questions must be **published after this code is deployed**; the live site does not yet know the hide-chip and fallback fields.

---

## 11. Before you go live: three things to know

1. **Two things were not confirmed against Mark itself.**
   - The registry base. This guide says Mark joins the discovery manifest's `endpoint` (`/tools/liberty_ask`) onto the registry's base, `https://<site>/api`, so the call goes to `/api/tools/liberty_ask`. That is the layout that worked in the earlier Progressive project, but check it in Mark's registry screen. If the registry shows a different base, the call will 404.
   - The webhook authentication labels. The website sends `Authorization: Bearer <OPAL_WEBHOOK_TOKEN>`. This guide does not name the exact fields in Mark's Webhook trigger screen where that token is set, so match the trigger's header to that format.

   Confirm both with the 8.3 test run before turning the feature on.

2. **The CMS checkbox may already be ticked on the unpublished home page draft.** The draft of the Ask Liberty start page that holds the hidden Texas, claims, legal and fallback questions has **Send questions to Mark** ticked. It has no effect until that draft is published. If Mark is not ready when you publish it, untick the box first. Publish it only after this code is deployed, because the live site does not yet know the hide-chip and fallback fields.

3. **The classifier's value lists must match the CMS chips.** If an editor adds a question with a new Topic, Product or Intent value, add the same value to the classifier prompt (section 3.2). Otherwise matches silently fall back to keyword routing. After any change to the questions, re-run the test questions in section 4.4. See section 4.5.
