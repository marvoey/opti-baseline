import { NextResponse } from 'next/server';
import { odpConfigured, sendDemoEvent } from '@/lib/odp';
import { DEMO_EVENT_KEYS, isDemoEmail, type DemoEventKey } from '@/lib/odpDemo';

/* POST /api/demo/odp/event  { email, eventKey }
   Sends ONE real click event to ODP for a synthetic profile. Allow-listed: only @example.com emails and the
   site's two CTA event keys. If ODP is unavailable the response says source: 'mock' (nothing was sent). */
export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const email = typeof body?.email === 'string' ? body.email.toLowerCase() : '';
  const eventKey = body?.eventKey;
  if (!isDemoEmail(email) || typeof eventKey !== 'string' || !DEMO_EVENT_KEYS.includes(eventKey as DemoEventKey)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  if (odpConfigured()) {
    try {
      await sendDemoEvent(email, eventKey as DemoEventKey);
      return NextResponse.json({ ok: true, source: 'live', sentAt: Date.now() });
    } catch (e) {
      console.warn('[demo/odp/event] not sent, falling back to mock:', e instanceof Error ? e.message : e);
    }
  }
  return NextResponse.json({ ok: true, source: 'mock', sentAt: Date.now() });
}
