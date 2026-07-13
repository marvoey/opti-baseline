type Subscriber = (payload: unknown) => void;

// Anchor on globalThis so module re-evaluation (Next.js HMR / route isolation)
// doesn't reset state — both response/route.ts and tools/[name]/route.ts
// must share the exact same instance.
const g = globalThis as typeof globalThis & {
  __opalSubscribers?: Set<Subscriber>;
  __opalBuffer?: { payload: unknown; at: number } | null;
};

if (!g.__opalSubscribers) g.__opalSubscribers = new Set<Subscriber>();
if (g.__opalBuffer === undefined) g.__opalBuffer = null;

const subscribers = g.__opalSubscribers;

// How long (ms) to keep a payload buffered for a late-connecting SSE client.
const BUFFER_TTL_MS = 5 * 60 * 1000; // 5 minutes

export function subscribe(fn: Subscriber): () => void {
  // If a payload arrived while nobody was listening, deliver it immediately.
  const buffered = g.__opalBuffer;
  if (buffered && Date.now() - buffered.at < BUFFER_TTL_MS) {
    console.log('[opal/store] delivering buffered payload to new subscriber');
    g.__opalBuffer = null;
    try { fn(buffered.payload); } catch { /* ignore */ }
    // Return a no-op unsubscribe — fn was called inline, never added to the set.
    return () => {};
  }

  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

export function broadcast(payload: unknown): void {
  console.log(`[opal/store] broadcasting to ${subscribers.size} subscriber(s):`, JSON.stringify(payload));

  if (subscribers.size === 0) {
    // Nobody is listening — buffer the payload so the next SSE gets it.
    console.log('[opal/store] no subscribers — buffering payload');
    g.__opalBuffer = { payload, at: Date.now() };
    return;
  }

  g.__opalBuffer = null;
  for (const fn of subscribers) {
    try { fn(payload); } catch (err) {
      console.log('[opal/store] subscriber error (skipping):', err);
    }
  }
}
