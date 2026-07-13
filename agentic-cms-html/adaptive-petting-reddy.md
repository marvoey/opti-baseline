# Plan: Opal Question Submit → Webhook → SSE Response

## Context
The `/kb-workspace/opal` page has a combobox that lets the user pick or type a question. When submitted, the question needs to:
1. Go to the Opal webhook via a server-side proxy route (to keep the Bearer token off the client)
2. Opal processes it asynchronously and calls back via the `progressive_opal` tool
3. The response must flow back to the browser tab in real-time and render below the question

The `progressive_opal` tool handler currently does nothing with its payload. The page's Submit button has no `onClick`. No SSE or streaming infrastructure exists yet.

---

## Architecture

```
Browser (opal/page.tsx)
  │  POST /api/opal/trigger  { question }
  ▼
app/api/opal/trigger/route.ts
  │  POST webhook.opal.optimizely.com  { question }
  │  Authorization: Bearer <token>
  ▼
Opal processes → calls back via progressive_opal tool
  ▼
app/api/tools/[name]/route.ts  (existing)
  │  calls tool.handler({ payload })
  ▼
app/api/opal/_store.ts  (new — in-memory broadcast)
  │  broadcast(payload) → notifies all SSE subscribers
  ▼
app/api/opal/response/route.ts  (new — SSE stream)
  │  text/event-stream — open BEFORE trigger fires
  ▼
Browser (opal/page.tsx) — EventSource receives event, renders below question
```

---

## Files to create

### `app/api/opal/_store.ts`
Module-level in-memory pub/sub. No external dependencies.

```ts
type Subscriber = (payload: unknown) => void;
const subscribers = new Set<Subscriber>();

export function subscribe(fn: Subscriber): () => void {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

export function broadcast(payload: unknown): void {
  for (const fn of subscribers) fn(payload);
}
```

### `app/api/opal/trigger/route.ts`
Server-side proxy. Keeps the Bearer token out of the browser. No auth token exposed to the client.

- `POST` — reads `{ question }` from body, forwards to Opal webhook with `Authorization: Bearer` header, returns `{ ok: true }`.
- Webhook URL and token come from env vars `OPAL_WEBHOOK_URL` and `OPAL_WEBHOOK_TOKEN` (seed `.env.local` with the values the user provided).

### `app/api/opal/response/route.ts`
SSE stream endpoint. The browser opens this **before** calling trigger.

- `GET` — returns a `text/event-stream` `ReadableStream`.
- On each `broadcast()` call, enqueues `data: <json>\n\n` to the stream.
- Auto-closes after 60 s with a `event: close` sentinel so the client knows to stop.
- Cleans up the subscriber on close.

---

## Files to modify

### `app/api/_tools/registry.ts`
Update `progressive_opal` handler to call `broadcast(payload)` from `_store.ts`.

```ts
async handler({ payload }) {
  console.log('[progressive_opal] payload:', JSON.stringify(payload));
  broadcast(payload);        // ← notify SSE listeners
  return { success: true };
},
```

### `app/[locale]/kb-workspace/opal/page.tsx`
Add state + wiring:

- `submittedQuestion: string | null` — question that was sent (shown above response)
- `response: unknown | null` — data received from SSE
- `loading: boolean` — true from submit until SSE delivers data or 60 s timeout

**Submit flow:**
1. Set `submittedQuestion`, `loading = true`, `response = null`
2. Open `new EventSource('/api/opal/response')` **before** calling trigger
3. On `message` event: set `response`, `loading = false`, close EventSource
4. On `error` or custom `close` event: set `loading = false`, close EventSource
5. `POST /api/opal/trigger` with `{ question }`

**Response area** (below the input card):
- While `loading`: spinner + "Waiting for Opal…"
- When `response` arrives: render a card showing the raw JSON (or formatted if shape is known)

---

## Environment variables (`.env.local`)
```
OPAL_WEBHOOK_URL=https://webhook.opal.optimizely.com/webhooks/61b98dd5a2f74189ae83e20cb9a0c3d0/1ff1bd6d-ecbf-4f0f-a951-25843f3a36a6
OPAL_WEBHOOK_TOKEN=ae51f5659cbe4c06927d64ac74fa4ed2
```

---

## Verification
1. Start dev server — navigate to `/kb-workspace/opal`
2. Select or type a question, click Submit
3. Terminal should show `[progressive_opal] payload: ...` when Opal calls back
4. Browser should show the spinner then the response card
5. Check Network tab: `POST /api/opal/trigger` → 200, `GET /api/opal/response` → open EventSource stream, `POST /api/tools/progressive_opal` (from Opal) → 200
