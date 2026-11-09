# Ask Liberty: port the Mark round trip from `progressive2`

**Goal:** make "Sending your question to Mark" real. A visitor's question goes to a Mark workflow agent, Mark classifies it, and the Next.js app routes deterministically to the approved CMS answer page. Today the progress card in `libertymutual` runs on timers and routes typed questions by keyword.

**Source:** `marvoey/opti-baseline@progressive2`, which has a working round trip built for the Progressive knowledge workspace.
**Target:** `marvoey/opti-baseline@libertymutual`, deployed at `libertymutual.optimoey.com`.

---

## 1. How the round trip works (as built in `progressive2`)

```
Browser                         Next.js (Liberty)                    Mark
───────                         ─────────────────                    ────
1. open SSE  ───────────────▶  /api/opal/response?clientId=…
                               (subscribe clientId in _store)
2. POST question ───────────▶  /api/opal/trigger
   + clientId, correlationId     └─ POST OPAL_WEBHOOK_URL ─────────▶ workflow agent
                                    (Bearer OPAL_WEBHOOK_TOKEN)        classifies
                                                                        │
3.                             /api/tools/liberty_ask  ◀───────────────┘
                               (payload incl. clientId, correlationId)
                                 └─ broadcast(clientId, …)
4. SSE message ◀────────────── /api/opal/response pushes payload
5. match payload → CMS question → play remaining steps → router.push(answer page)
```

Mark never writes the answer. It only returns structured values. The app picks the approved page.

---

## 2. Files to port

| From `progressive2` | To `libertymutual` | Change on the way |
|---|---|---|
| `app/api/opal/trigger/route.ts` | same path | Add a same-origin check and a simple throttle (see watch-outs) |
| `app/api/opal/response/route.ts` | same path | Set `maxDuration` for Vercel; keep the heartbeat |
| `app/api/opal/_store.ts` | same path | None at first. Swap later if Vercel splits instances (see section 7) |
| `app/api/_tools/_createRegistry.ts` | same path | None |
| `app/api/_tools/types.ts` | same path | None |
| `app/api/_tools/_opalHandler.ts` | same path | Trim `console.log` of the raw payload |
| `app/api/_tools/registry.ts` | same path | Rename the tool `progressive_opal` → `liberty_ask` and rewrite its description |
| `app/api/discovery/route.ts` | same path | None |
| `app/api/tools/[name]/route.ts` | same path | Add the inbound bearer-token check; drop the `registry-dev` lookup |
| `kb-workspace/_hooks/useOpalChat.ts` | `app/_components_liberty/useAskMark.ts` | Remove the `kb-content` fetch; add the timeout and the Liberty payload type |

**Don't port:** `app/api/kb-content`, `app/api/discovery-dev`, `app/api/_tools/registry-dev.ts`, `app/api/_tools/schema.json` and the Progressive policy types. They're Progressive-specific.

**Already in place:** `proxy.ts` on `libertymutual` excludes `api` from the locale rewrite, so `/api/*` routes won't be rewritten to `/en/api/*`.

Keep the route paths identical to `progressive2`: `/api/discovery` serves a manifest whose endpoints are `/tools/<name>`. That path layout is what worked with Mark's tool registry, so don't restructure it.

---

## 3. Install the Opal tools SDK

`libertymutual` uses Yarn (`yarn.lock`, `.yarnrc.yml`):

```bash
yarn add @optimizely-opal/opal-tools-sdk@0.1.35-dev
```

- **Pin the exact version.** `progressive2` uses `^0.1.35-dev`, a pre-release. A caret range on a pre-release can pull an unexpected build.
- **Use `dependencies`, not `devDependencies`.** `types.ts` and `_opalHandler.ts` import `ParameterType` from `@optimizely-opal/opal-tools-sdk/dist/models` at runtime. It worked as a dev dependency in `progressive2` because the build bundles it, but a runtime import belongs in `dependencies`.
- **Keep the deep import.** Import only from `dist/models`, as `progressive2` does. The package root pulls in `service.js`, which pulls in `express`.

---

## 4. Environment variables

### `.env.example` (committed) — add after the Graph section

```bash
# --- Mark (Opal) round trip: Ask Liberty -------------------------------------
# The Mark workflow agent's webhook trigger. Copy both values from the webhook
# trigger in Mark (Agents → your workflow → Webhook trigger).
# The trigger's auth header must be "Authorization" with the "Bearer <token>" format.
OPAL_WEBHOOK_URL=https://your-opal-instance/webhook/...
OPAL_WEBHOOK_TOKEN=

# Bearer token Mark sends when it calls this app's tool (/api/tools/liberty_ask).
# Paste the same value into Mark → Connectors → Registries → Bearer Token.
# Any long random string, e.g. `openssl rand -hex 32`.
OPAL_TOOL_TOKEN=

# on = send questions to Mark; off = simulated flow (keyword routing + timers).
# Public and build-time: redeploy after changing it on Vercel.
NEXT_PUBLIC_ASK_MARK=off

# How long the browser waits for Mark before falling back to keyword routing (ms).
NEXT_PUBLIC_ASK_MARK_TIMEOUT_MS=20000
```

### `.env` (local, gitignored)

Fill in the real values:
- `OPAL_WEBHOOK_URL` and `OPAL_WEBHOOK_TOKEN`: from the new Liberty workflow agent's webhook trigger. Don't reuse the Progressive one.
- `OPAL_TOOL_TOKEN`: generate a new token.
- `NEXT_PUBLIC_ASK_MARK=on` for testing.

### Vercel

Add the same five variables under **Project → Settings → Environment Variables** for Production and Preview, then redeploy. `NEXT_PUBLIC_*` values are baked in at build time.

`OPAL_TOOL_TOKEN` is new; `progressive2` doesn't have it. It closes the open tool route (see section 7).

---

## 5. What changes for Liberty

### 5.1 The tool Mark calls: `liberty_ask`

`progressive_opal` sent `lob / topic / jurisdiction`. Liberty sends the same values the CMS already uses as classification chips:

```ts
// app/api/_tools/registry.ts
defineTool({
  name: 'liberty_ask',
  description:
    'Returns the classification of a Liberty Mutual customer question to the Ask Liberty website. ' +
    'Call exactly once per question with the clientId and correlationId you received.',
  parameters: OPAL_PARAMETERS,          // single `payload` dictionary, as in progressive2
  handler: createOpalHandler('liberty_ask'),
});
```

Payload Mark must send (inside `payload`):

| Field | Example | Notes |
|---|---|---|
| `clientId`, `correlationId` | from the webhook body | Required for routing back to the browser |
| `intent` | `Learn about coverage` | Closed list (see 5.4) |
| `product` | `Auto` | Closed list |
| `topic` | `Rental cars` | Closed list |
| `coverage` | `Collision & comprehensive` | Optional |
| `state` | `Texas` | Only if the visitor named one |
| `confidence` | `0.86` | 0 to 1 |
| `reasoning` | one sentence | Shown in the progress card only, never as the answer |

### 5.2 Deterministic match in Next.js

No new content model is needed. Each question in the home page's **Suggested questions** field (`AskLibertyExperience.Questions`) already has chips such as `Product | Auto` and `Topic | Rental cars`, plus a URL. The app matches Mark's values against them:

```ts
// app/_components_liberty/matchClassification.ts
export function matchClassification(p: MarkPayload, questions: AskQuestion[]) {
  if ((p.confidence ?? 0) < 0.6) return undefined;            // too unsure → fallback
  const chip = (q: AskQuestion, label: string) =>
    q.chips?.find((c) => c.label === label)?.value.toLowerCase();
  const eq = (a?: string, b?: string) => !!a && !!b && a.toLowerCase() === b;

  // 1. topic + product, 2. topic only, 3. intent only (claims / legal / out of scope)
  return (
    questions.find((q) => eq(p.topic, chip(q, 'Topic')) && eq(p.product, chip(q, 'Product'))) ??
    questions.find((q) => eq(p.topic, chip(q, 'Topic'))) ??
    questions.find((q) => eq(p.intent, chip(q, 'Intent')) && !chip(q, 'Topic'))
  );
}
// undefined → existing routeQuestion() keyword match → first question
```

- **State:** For "State minimums" with `state = Texas`, go straight to `/required-coverage/texas`. Any other state goes to `/required-coverage` (the state picker). Keep this as a small map in code until more state pages exist.
- **Fallback:** If nothing matches, the existing `routeQuestion()` keyword logic runs, so the demo never dead-ends.

### 5.3 `AskLibertyHero` and `AiProgressPanel`

Today `AskLibertyHero.ask()` picks the question first, then `AiProgressPanel` plays a fixed timeline and calls `onComplete`. With Mark live:

| Step on the card | Today | With Mark |
|---|---|---|
| 1. Send question to Mark | 1.15 s timer | Active until `/api/opal/trigger` returns 200 |
| 2. Classify the question | Chips from the CMS | Active until the SSE reply arrives; chips come from **Mark's** payload, and the `reasoning` line shows under the chips |
| 3. Retrieve approved content | CMS `RetrievedItems` | Same, taken from the **matched** question |
| 4. Build your answer | Timer | Same, then `router.push(href)` |

Changes:
- **`AiProgressPanel`:** add a controlled mode, `phase?: 'sending' | 'classifying' | 'retrieving'`, plus `liveChips`. When `phase` is set, steps 1–2 wait on it instead of timers. Steps 3–4 keep the current animation. Default behaviour (`phase` undefined) is unchanged, so the simulated mode and the demo pages still work.
- **`AskLibertyHero`:** when `NEXT_PUBLIC_ASK_MARK=on`, `ask()` calls `useAskMark().submit(text)` and starts the card in `phase='sending'`. On the reply it runs `matchClassification`, sets the matched question, and moves to `retrieving`. On timeout or error it uses `routeQuestion()` and shows "Mark is taking longer than usual, using approved keyword routing". That's honest on screen and still lands on the right page.
- **Unchanged:** suggested-question chips (they're already matched, but can still go through Mark for the visual), the `/?q=` hand-off from answer-page ask bars, and editing mode. No Mark calls happen in CMS preview.

### 5.4 The Mark side (built in Mark, not in the repo)

1. **Specialized agent "Ask Liberty classifier":** its prompt gives closed lists that exactly match the CMS chip values:
   - `intent`: Learn about coverage · Learn about requirements · Compare options · Account service · Legal advice · Out of scope
   - `product`: Auto · Home · Home + Auto · Renters
   - `topic`: Rental cars · Water damage · State minimums · Bundling · Claim status
   - Plus rules to output JSON only, never answer the question, and set `state` only when stated.
2. **Workflow agent:** a webhook trigger that receives `{ question, clientId, correlationId }`, then the classifier, then a call to `liberty_ask` with the classification plus both IDs.
3. **Tool registry:** Mark → Connectors → Registries → discovery URL `https://libertymutual.optimoey.com/api/discovery`, with Bearer = `OPAL_TOOL_TOKEN`.

**Keep the lists in sync:** if editors add a question with a new Topic chip, the classifier prompt needs that value too. A later option is a `liberty_taxonomy` tool that reads the chips from Graph, so Mark always uses the current CMS values.

### 5.5 CMS content to add first

These come from the earlier readiness review:
- **Two more suggested questions** on the Ask Liberty home: claims (`Intent | Account service`, `Topic | Claim status`, URL `/claim-status`) and legal (`Intent | Legal advice`, URL `/legal-question`). Without them, Mark's correct classification has nowhere to land.
- **Keyword fix:** change `rent` to `rental` so the fallback stops sending "current policy" questions to rental car.

---

## 6. Build order

| # | Step | Done when |
|---|---|---|
| 1 | Branch `libertymutual-mark` from `libertymutual` | — |
| 2 | Install the SDK; add env vars to `.env.example`, `.env` and Vercel | `yarn build` passes |
| 3 | Copy the API files (section 2), rename the tool, add the bearer check | `GET /api/discovery` returns `liberty_ask` |
| 4 | Port `useOpalChat` → `useAskMark` with the timeout | Unit-checked locally |
| 5 | Add the controlled mode to `AiProgressPanel` and the Mark path to `AskLibertyHero` behind `NEXT_PUBLIC_ASK_MARK` | `off` behaves exactly as today |
| 6 | Add `matchClassification` and the Texas state rule | Sample payloads route correctly |
| 7 | Build the classifier and workflow agents in Mark; register the tool | Mark test run calls `liberty_ask` |
| 8 | Local end-to-end with `ngrok` (copy `scripts/ngrok.sh` from `progressive2`) | Question → Mark → page, locally |
| 9 | Deploy to Vercel; repeat the tests on `libertymutual.optimoey.com` | Section 8 test list passes |
| 10 | CMS: add the claims and legal questions; fix keywords | Fallback and Mark both reach every page |

---

## 7. Watch-outs

| Risk | Why | Mitigation |
|---|---|---|
| **In-memory store on Vercel** | `_store.ts` keeps subscribers in a `globalThis` map. The SSE route and the tool route must run in the same process. On Vercel they can land on different instances, so the reply is dropped silently. | Test on the deployed URL early. If it's flaky, have the tool handler write the reply to a KV store (Upstash or Vercel KV) by `correlationId`, and have the browser poll `/api/opal/result?cid=…` every 1 s instead of using SSE. Polling is simpler and reliable in serverless. |
| **SSE duration limits** | `response/route.ts` holds the stream for 3 minutes. Vercel functions have a maximum duration that depends on the plan. | Set `export const maxDuration` to what your plan allows, and rely on the browser's automatic reconnect. Polling removes this issue entirely. |
| **Reply lost during reconnect** | If the stream reconnects while Mark replies, nobody is subscribed and the message is dropped. | The KV/polling option fixes this. With SSE, the client timeout falls back to keyword routing. |
| **Open tool route** | `/api/tools/[name]` in `progressive2` has no auth, so anyone could push fake answers into a visitor's session. | Check `Authorization: Bearer ${OPAL_TOOL_TOKEN}` and return 401 otherwise. |
| **Open trigger route** | `/api/opal/trigger` is public, and every call starts a Mark run that uses credits. | Same-origin check (`Origin` header must match the site), cap question length at 300 characters (the hero already trims to 300), and throttle per `clientId`. |
| **Mark latency** | A workflow run can take several seconds or longer, which feels slow in front of an audience. | Client timeout (`NEXT_PUBLIC_ASK_MARK_TIMEOUT_MS`) plus the keyword fallback. Rehearse on the demo network. Keep `NEXT_PUBLIC_ASK_MARK=off` as an instant switch back. |
| **Reachability** | Mark must reach `/api/discovery` and `/api/tools/*`. `localhost` won't work. | Use the deployed URL, or `ngrok` for local testing. |
| **Taxonomy drift** | If a CMS chip value and the classifier's list differ, matches silently fail and fall back to keywords. | Keep one shared value list, and re-test after editors add questions. The optional `liberty_taxonomy` tool fixes this permanently. |
| **Pre-release SDK** | `0.1.35-dev` may change. | Pin the exact version; only `ParameterType` is used. |
| **Logging** | `progressive2` logs raw payloads and questions. | Trim the logs before a public demo; customer questions can contain personal details. |
| **Messaging** | Mark classifies but doesn't write answers. That's the trust story, but it must be said clearly. | On the card, label Mark's reasoning as "how your question was understood"; the page content is the approved CMS answer. |

---

## 8. Test plan

| Question typed | Expected classification | Expected page |
|---|---|---|
| Does my car insurance cover a rental car? | Auto · Rental cars | `/rental-car` |
| My pipe burst last night, am I covered? | Home · Water damage | `/burst-pipe` |
| What's the minimum car insurance in Texas? | Auto · State minimums · Texas | `/required-coverage/texas` |
| What car insurance do I legally need? | Auto · State minimums · no state | `/required-coverage` |
| Can I put my house and car on one policy? | Home + Auto · Bundling | `/bundling` |
| Where is my claim payment? | Account service · Claim status | `/claim-status` |
| Should I sue the other driver? | Legal advice | `/legal-question` |
| How much would my current policy cost? | Low confidence or out of scope | Keyword fallback (after the `rental` fix, not rental car) |
| Any question with Mark turned off | — | Same as today (simulated) |
| Any question with the webhook URL wrong | — | Timeout message, then keyword fallback |

Also check:
- The ask bar on an answer page sends `/?q=…` and goes through Mark.
- CMS preview and Visual Builder make no Mark calls.
- Two browser tabs asking at once each get their own answer.
- `/api/tools/liberty_ask` without the token returns 401.

---

## 9. What this adds to the demo

- **Before:** "Sending your question to Mark" was a scripted animation with keyword routing.
- **After:** Mark really classifies the question, and the chips on the card are Mark's output. Next.js deterministically routes to approved, governed CMS content. Unknown or risky questions land on safe fallback pages.
- **Checklist items strengthened:** "Natural-language search or answer experience", "Fallback when the platform is uncertain" and "Separation between current and roadmap functionality". Classification becomes current functionality, not a simulation.
