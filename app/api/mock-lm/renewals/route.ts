import type { NextRequest } from 'next/server';
import { isAgentKey } from '@/lib/agent/personas';
import { NO_STORE, RENEWALS, bearerToken, lmClient, modeAllowed, parseMode, verifyToken } from '../_lib';

export const dynamic = 'force-dynamic';

/** `?mode=slow` waits longer than the card's 1.5 second timeout. */
const SLOW_MS = 3000;

const reply = (status: number, error: string, extra: Record<string, string> = {}) =>
  Response.json({ error }, { status, headers: { ...NO_STORE, ...extra } });

/**
 * MOCK of LM's renewals API. Needs a valid bearer token from the mock token
 * endpoint, and returns the renewals for one agent key.
 *
 * DEMO ONLY: a real LM API would take the agent from the token itself (token
 * exchange with the agent's own token), not from a query parameter, so one
 * agent could never ask for another's renewals.
 *
 * `?mode=empty|error|slow` makes the failure cases easy to show on camera. It is
 * ignored on Vercel Production.
 */
export async function GET(request: NextRequest) {
  const client = lmClient();
  if (!client) return reply(503, 'server_error');

  const token = bearerToken(request);
  if (!token || !verifyToken(token, client.secret)) {
    return reply(401, 'invalid_token', { 'WWW-Authenticate': 'Bearer error="invalid_token"' });
  }

  const params = request.nextUrl.searchParams;
  const agent = params.get('agent');
  if (!isAgentKey(agent)) return reply(400, 'invalid_request');

  const mode = modeAllowed() ? parseMode(params.get('mode')) : undefined;
  if (mode === 'error') return reply(503, 'unavailable');
  if (mode === 'slow') await new Promise((resolve) => setTimeout(resolve, SLOW_MS));

  return Response.json({ items: mode === 'empty' ? [] : RENEWALS[agent] }, { headers: NO_STORE });
}
