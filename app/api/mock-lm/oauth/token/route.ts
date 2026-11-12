import { clientIp, createLimiter, readLimitedText } from '@/lib/askMark/requestGuards';
import { NO_STORE, TOKEN_TTL_SECONDS, lmClient, safeEqual, signToken } from '../../_lib';

export const dynamic = 'force-dynamic';

/** A client-credentials request is a few short form fields. */
const MAX_BODY_BYTES = 2 * 1024;

/**
 * Token requests per minute per client address. Best-effort and per server
 * instance, so it only blunts one noisy client; a real limit belongs in the
 * Vercel Firewall. A page load asks for one token, so this leaves plenty of room
 * for rehearsals and recording.
 */
const allowRequest = createLimiter(60, 60_000);

const reply = (status: number, error: string) => Response.json({ error }, { status, headers: NO_STORE });

/**
 * MOCK of LM's OAuth 2.0 token endpoint (client credentials grant). Returns a
 * short-lived bearer token for the renewals mock. Fails closed when no demo
 * client is configured, and never logs credentials or tokens.
 */
export async function POST(request: Request) {
  if (!allowRequest(clientIp(request))) return reply(429, 'too_many_requests');

  const client = lmClient();
  if (!client) return reply(503, 'server_error');

  if (!request.headers.get('content-type')?.toLowerCase().startsWith('application/x-www-form-urlencoded')) {
    return reply(415, 'invalid_request');
  }

  const raw = await readLimitedText(request, MAX_BODY_BYTES);
  if (raw === undefined) return reply(413, 'invalid_request');

  const form = new URLSearchParams(raw);
  if (form.get('grant_type') !== 'client_credentials') return reply(400, 'unsupported_grant_type');

  // Evaluate both checks so timing does not reveal which one was wrong.
  const idOk = safeEqual(form.get('client_id') ?? '', client.id);
  const secretOk = safeEqual(form.get('client_secret') ?? '', client.secret);
  if (!(idOk && secretOk)) {
    console.warn('[mock-lm] token request refused');
    return reply(401, 'invalid_client');
  }

  return Response.json(
    { access_token: signToken(client.secret), token_type: 'Bearer', expires_in: TOKEN_TTL_SECONDS },
    { headers: NO_STORE },
  );
}
