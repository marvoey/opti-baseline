type Subscriber = (payload: unknown) => void;

// Anchor on globalThis so module re-evaluation (Next.js HMR / route isolation)
// doesn't reset the Set — both response/route.ts and tools/[name]/route.ts
// must share the exact same instance.
const g = globalThis as typeof globalThis & { __opalSubscribers?: Set<Subscriber> };
if (!g.__opalSubscribers) g.__opalSubscribers = new Set<Subscriber>();
const subscribers = g.__opalSubscribers;

export function subscribe(fn: Subscriber): () => void {
  subscribers.add(fn);
  return () => subscribers.delete(fn);
}

export function broadcast(payload: unknown): void {
  console.log(`[opal/store] broadcasting to ${subscribers.size} subscriber(s):`, JSON.stringify(payload));
  for (const fn of subscribers) {
    try { fn(payload); } catch (err) {
      console.log('[opal/store] subscriber error (skipping):', err);
    }
  }
}
