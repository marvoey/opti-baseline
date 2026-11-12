import { createHmac, createHash, timingSafeEqual } from 'node:crypto';
import type { AgentKey } from '@/lib/agent/personas';

/**
 * Shared helpers for the MOCK Liberty Mutual API used by the renewals card demo
 * (OP-25). It stands in for LM's OAuth 2.0 proxy and renewals service. Nothing
 * here is real: the data is made up and the credentials are demo values from
 * server-only environment variables.
 */

export const TOKEN_TTL_SECONDS = 300;

/** Responses carry per-caller data and tokens: never cache them. */
export const NO_STORE = { 'Cache-Control': 'no-store' } as const;

const clean = (v: string | undefined): string | undefined => v?.trim() || undefined;

/** The demo client. Undefined means "refuse everything" (fail closed). */
export function lmClient(): { id: string; secret: string } | undefined {
  const id = clean(process.env.LM_OAUTH_CLIENT_ID);
  const secret = clean(process.env.LM_OAUTH_CLIENT_SECRET);
  return id && secret ? { id, secret } : undefined;
}

/** Constant-time string comparison (hashing first so the lengths always match). */
export function safeEqual(a: string, b: string): boolean {
  const ha = createHash('sha256').update(a).digest();
  const hb = createHash('sha256').update(b).digest();
  return timingSafeEqual(ha, hb);
}

const b64 = (s: string | Buffer) => Buffer.from(s).toString('base64url');

/**
 * A stateless, signed, short-lived access token: `<payload>.<signature>`. It is
 * stateless because serverless instances do not share memory, so a token issued
 * by one must be verifiable by another. A real LM proxy would issue opaque or
 * JWT tokens from its own identity provider.
 */
export function signToken(secret: string, now = Date.now()): string {
  const payload = b64(JSON.stringify({ scope: 'renewals:read', exp: Math.floor(now / 1000) + TOKEN_TTL_SECONDS }));
  const sig = createHmac('sha256', secret).update(payload).digest('base64url');
  return `${payload}.${sig}`;
}

export function verifyToken(token: string, secret: string, now = Date.now()): boolean {
  const [payload, sig, extra] = token.split('.');
  if (!payload || !sig || extra !== undefined) return false;
  const expected = createHmac('sha256', secret).update(payload).digest('base64url');
  if (!safeEqual(sig, expected)) return false;
  try {
    const claims = JSON.parse(Buffer.from(payload, 'base64url').toString('utf8')) as { exp?: unknown; scope?: unknown };
    return typeof claims.exp === 'number' && claims.exp * 1000 > now && claims.scope === 'renewals:read';
  } catch {
    return false;
  }
}

/** `Authorization: Bearer <token>` → token, or undefined. */
export function bearerToken(request: Request): string | undefined {
  const m = /^Bearer ([A-Za-z0-9_\-.]{1,2048})$/.exec(request.headers.get('authorization') ?? '');
  return m?.[1];
}

export { modeAllowed, parseMode } from '@/lib/mockLm';

export type Renewal = { client: string; policy: string; date: string };

/** Made-up renewals for each demo agent (a few are due soon, a few later). */
export const RENEWALS: Record<AgentKey, Renewal[]> = {
  dana: [
    { client: 'Maria Alvarez', policy: 'Auto TX-48213', date: 'Nov 28' },
    { client: 'James Whitaker', policy: 'Home TX-90417', date: 'Dec 3' },
    { client: 'Priya Raman', policy: 'Auto TX-51802', date: 'Dec 9' },
    { client: 'Carter Family Trust', policy: 'Home TX-77360', date: 'Dec 14' },
    { client: 'Luis Ortega', policy: 'Auto TX-30986', date: 'Dec 19' },
    { client: 'Hannah Pruitt', policy: 'Home TX-66241', date: 'Dec 27' },
  ],
  tyler: [
    { client: 'Derek Hollis', policy: 'Auto TX-12744', date: 'Nov 30' },
    { client: 'Anita Sharma', policy: 'Home TX-83019', date: 'Dec 6' },
    { client: 'Rhonda Bell', policy: 'Auto TX-27655', date: 'Dec 12' },
  ],
  marcus: [
    { client: 'Coastal Dental Group', policy: 'Commercial FL-40128', date: 'Dec 1' },
    { client: 'Samuel Okafor', policy: 'Home FL-55790', date: 'Dec 8' },
    { client: 'Bayview Marina LLC', policy: 'Commercial FL-61337', date: 'Dec 15' },
    { client: 'Isabel Moreno', policy: 'Auto FL-19482', date: 'Dec 22' },
  ],
  elena: [],
};
