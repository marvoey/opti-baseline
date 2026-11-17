import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { trackEvent, flushEvents } from '@/lib/experimentation';

const ALLOWED = new Set(['appointment_cta_click', 'diy_start_click', 'office_search']);

export async function POST(request: Request) {
  const body = await request.json().catch(() => ({}));
  const eventKey = body?.eventKey;
  if (typeof eventKey !== 'string' || !ALLOWED.has(eventKey)) {
    return NextResponse.json({ ok: false }, { status: 400 });
  }

  const jar = await cookies();
  const visitorId = jar.get('hrb_vid')?.value;
  if (!visitorId) return NextResponse.json({ ok: false }, { status: 400 });

  await trackEvent({ id: visitorId, segment: jar.get('hrb_segment')?.value || null }, eventKey);
  await flushEvents(); // wait for the event to leave before the function is frozen
  return NextResponse.json({ ok: true });
}