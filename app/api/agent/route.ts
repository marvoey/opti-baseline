import { NextResponse } from 'next/server';
import { demoSwitchEnabled } from '@/lib/agent/getAgent';
import { AGENT_COOKIE, isAgentKey } from '@/lib/agent/personas';

/**
 * POST /api/agent  { "agent": "dana" }
 *
 * The portal's "view as" switch. Stores which of the four demo agents the
 * visitor is looking at. DEMO ONLY: this is a preference, not a login, and it
 * grants nothing; all portal content is public demo content. A real portal
 * would take the agent from the verified SSO identity instead.
 *
 * Only the four fixed agent keys are accepted. Requiring a JSON content type
 * means a form on another site cannot submit this request cross-origin, and the
 * cookie is SameSite=Lax as well.
 */
export async function POST(request: Request) {
  if (!demoSwitchEnabled()) {
    return NextResponse.json({ error: 'Not available' }, { status: 404 });
  }
  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/json')) {
    return NextResponse.json({ error: 'Unsupported media type' }, { status: 415 });
  }

  let agent: unknown;
  try {
    // Reject anything larger than a short key before parsing it.
    const text = await request.text();
    if (text.length > 200) return NextResponse.json({ error: 'Bad request' }, { status: 400 });
    agent = (JSON.parse(text) as { agent?: unknown } | null)?.agent;
  } catch {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }
  if (!isAgentKey(agent)) {
    return NextResponse.json({ error: 'Bad request' }, { status: 400 });
  }

  const response = new NextResponse(null, { status: 204 });
  response.cookies.set(AGENT_COOKIE, agent, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 60 * 60 * 24, // one day
  });
  return response;
}
