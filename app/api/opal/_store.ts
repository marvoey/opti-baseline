type Subscriber = (correlationId: string, payload: unknown) => void;

// Anchor on globalThis so module re-evaluation (Next.js HMR / route isolation)
// doesn't reset state — response/route.ts and tools/[name]/route.ts must share
// the exact same instance.
const g = globalThis as typeof globalThis & {
  __opalClients?: Map<string, Subscriber>;
};

if (!g.__opalClients) g.__opalClients = new Map<string, Subscriber>();

const clients = g.__opalClients;

const FILE = 'api/opal/_store.ts';
const HL  = '\x1b[1m\x1b[32m'; // bold green
const DIM = '\x1b[2m\x1b[31m'; // dim red
const RST = '\x1b[0m';

export function subscribe(clientId: string, fn: Subscriber): () => void {
  console.log(`${HL}[${FILE}:17] ● client connected — client-${clientId} (total: ${clients.size + 1})${RST}`);
  clients.set(clientId, fn);
  return () => {
    clients.delete(clientId);
    console.log(`${DIM}[${FILE}:21] ○ client disconnected — client-${clientId} (total: ${clients.size})${RST}`);
  };
}

export function broadcast(clientId: string, correlationId: string, payload: unknown): void {
  const fn = clients.get(clientId);
  console.log(`[${FILE}:27] broadcast — client-${clientId} | correlation-${correlationId} | found: ${!!fn}`);
  if (fn) {
    try { fn(correlationId, payload); } catch (err) {
      console.error(`[${FILE}:30] subscriber error:`, err);
    }
  }
}
