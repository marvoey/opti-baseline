import { createHash, timingSafeEqual } from 'node:crypto';
import { toolToken } from './config';

/** Constant-time check that the request carries `Authorization: Bearer <token>`. */
export function hasBearerToken(request: Request, token: string): boolean {
  const header = request.headers.get('authorization') ?? '';
  const expected = `Bearer ${token}`;
  // Hash both sides so the buffers always have the same length.
  const a = createHash('sha256').update(header).digest();
  const b = createHash('sha256').update(expected).digest();
  return timingSafeEqual(a, b);
}

/**
 * Is this request carrying the tool token Mark was given? Fails closed: with no
 * token configured, nothing is authorized. (A plain `===` against
 * `Bearer ${process.env.X}` would accept the literal text "Bearer undefined"
 * when the variable is unset.)
 */
export function isToolRequestAuthorized(request: Request): boolean {
  const token = toolToken();
  return token ? hasBearerToken(request, token) : false;
}

/**
 * Same-origin check for browser requests. Browsers always send `Origin` on a
 * POST; it must match the host the request was addressed to. Requests without
 * it (scripts, curl) are refused. This is a guard against other sites using the
 * route, not a defence against a determined non-browser client; the Vercel
 * Firewall rate limit covers that.
 */
export function isSameOrigin(request: Request): boolean {
  const origin = request.headers.get('origin');
  if (!origin) return false;
  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host');
  if (!host) return false;
  try {
    if (new URL(origin).host !== host) return false;
  } catch {
    return false;
  }
  const site = request.headers.get('sec-fetch-site');
  return !site || site === 'same-origin';
}

/** Best-effort client address (Vercel sets x-forwarded-for). */
export function clientIp(request: Request): string {
  const fwd = request.headers.get('x-forwarded-for');
  return (fwd?.split(',')[0] ?? request.headers.get('x-real-ip') ?? 'unknown').trim();
}

/** Read a request body as text with a hard size limit. Returns undefined if too large. */
export async function readLimitedText(request: Request, maxBytes: number): Promise<string | undefined> {
  const declared = Number(request.headers.get('content-length'));
  if (Number.isFinite(declared) && declared > maxBytes) return undefined;
  const body = await request.text();
  return Buffer.byteLength(body, 'utf8') > maxBytes ? undefined : body;
}

/**
 * A small best-effort limiter kept in this server instance's memory. It does
 * NOT work across instances, so it only blunts a single noisy client; the real
 * limit is the Vercel Firewall rule.
 */
export function createLimiter(max: number, windowMs: number) {
  const hits = new Map<string, { count: number; start: number }>();
  return function allow(key: string): boolean {
    const now = Date.now();
    const entry = hits.get(key);
    if (!entry || now - entry.start > windowMs) {
      hits.set(key, { count: 1, start: now });
      // Keep the map from growing without bound.
      if (hits.size > 5000) {
        for (const [k, v] of hits) if (now - v.start > windowMs) hits.delete(k);
      }
      return true;
    }
    entry.count += 1;
    return entry.count <= max;
  };
}
