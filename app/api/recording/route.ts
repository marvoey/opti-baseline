import { NextResponse } from 'next/server';

export const dynamic = 'force-dynamic';

// Who is currently recording. Held in server memory, so it is shared by everyone
// hitting the same long-running server (`next start`) but not across serverless instances.
type Session = { name: string; clientId: string; since: number; lastBeat: number };

// The holder's browser sends a heartbeat; with none for this long, the slot frees itself.
const STALE_MS = 60_000;

const store = globalThis as typeof globalThis & { __recording?: Session | null };

function current(): Session | null {
  const s = store.__recording ?? null;
  if (s && Date.now() - s.lastBeat > STALE_MS) store.__recording = null;
  return store.__recording ?? null;
}

const view = (s: Session | null) =>
  s ? { recording: true, name: s.name, clientId: s.clientId, since: s.since } : { recording: false };

export async function GET() {
  return NextResponse.json(view(current()));
}

// Start recording, or heartbeat if the caller already holds the slot.
export async function POST(req: Request) {
  const { name, clientId } = await req.json().catch(() => ({}));
  if (typeof clientId !== 'string' || !clientId) {
    return NextResponse.json({ error: 'clientId required' }, { status: 400 });
  }
  const now = Date.now();
  const s = current();
  if (s && s.clientId !== clientId) {
    return NextResponse.json(view(s), { status: 409 });
  }
  store.__recording = {
    name: (typeof name === 'string' && name.trim().slice(0, 40)) || s?.name || 'Someone',
    clientId,
    since: s?.since ?? now,
    lastBeat: now,
  };
  return NextResponse.json(view(store.__recording));
}

// Stop recording. `force` lets anyone clear a slot left behind by someone else.
export async function DELETE(req: Request) {
  const { clientId, force } = await req.json().catch(() => ({}));
  const s = current();
  if (s && (force === true || s.clientId === clientId)) store.__recording = null;
  return NextResponse.json(view(current()));
}
