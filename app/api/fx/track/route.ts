import { NextResponse, type NextRequest } from 'next/server';
import { FX_EVENTS, trackFxEvent, type FxEvent } from '@/lib/fx';
import { CAMPAIGN_COOKIE, VID_COOKIE, parseCampaign, parseVid } from '@/lib/visitor';

/**
 * Records a Feature Experimentation conversion event (plan finder submit,
 * agent call click) for the current anonymous visitor. The browser never talks
 * to FX directly: the SDK runs on the server with the same visitor id (httpOnly
 * cookie minted by proxy.ts), so conversions attribute to the same experiment
 * bucket the visitor saw.
 */
export const dynamic = 'force-dynamic';

const EVENTS = new Set<string>(FX_EVENTS);

export async function POST(request: NextRequest) {
  const visitorId = parseVid(request.cookies.get(VID_COOKIE)?.value);
  // No identity yet (cookies blocked, first hit not through the proxy): nothing to attribute.
  if (!visitorId) return new NextResponse(null, { status: 204 });

  let event: unknown;
  try {
    ({ event } = (await request.json()) as { event?: unknown });
  } catch {
    return new NextResponse(null, { status: 400 });
  }
  if (typeof event !== 'string' || !EVENTS.has(event)) {
    return new NextResponse(null, { status: 400 });
  }

  await trackFxEvent(event as FxEvent, {
    id: visitorId,
    campaign: parseCampaign(request.cookies.get(CAMPAIGN_COOKIE)?.value),
  });
  return new NextResponse(null, { status: 204 });
}
