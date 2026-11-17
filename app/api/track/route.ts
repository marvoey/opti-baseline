import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';
import { trackEvent, flushEvents } from '@/lib/experimentation';
import { clickEvent, hostnameOf, queueOdpEvents, trackingAllowed } from '@/lib/odpTracking';

// The same keys go to Feature Experimentation (metrics) and to ODP (hrblock / <key> events).
const ALLOWED = new Set(['appointment_cta_click', 'diy_start_click', 'office_search']);

// Untrusted client input: only a site-relative path and short visible text are accepted.
const cleanPage = (v: unknown) => (typeof v === 'string' && v.startsWith('/') ? v.slice(0, 200) : '/');
const cleanLabel = (v: unknown) =>
  typeof v === 'string' ? v.replace(/\s+/g, ' ').trim().slice(0, 80) || undefined : undefined;

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

  // Also report the click to ODP (sent after the response, honoring GPC / DNT, no-op when ODP is off).
  if (trackingAllowed(request.headers)) {
    const visit = { visitorId, hostname: hostnameOf(request.headers), page: cleanPage(body?.page) };
    queueOdpEvents([clickEvent(visit, eventKey, cleanLabel(body?.label))]);
  }
  return NextResponse.json({ ok: true });
}