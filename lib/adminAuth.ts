import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

/**
 * Password gate for /admin, using HTTP Basic auth. Called from proxy.ts, so it
 * covers every /admin request, including the server-action POSTs (which delete
 * content types from the live CMS).
 *
 * The password is ADMIN_PASSWORD. The username is ignored: type anything.
 * Fails closed: with no ADMIN_PASSWORD set, nobody is let in.
 */

const encoder = new TextEncoder();

/** Compares two strings in constant time by comparing their SHA-256 digests. */
async function safeEqual(a: string, b: string): Promise<boolean> {
  const [da, db] = await Promise.all([
    crypto.subtle.digest('SHA-256', encoder.encode(a)),
    crypto.subtle.digest('SHA-256', encoder.encode(b)),
  ]);
  const x = new Uint8Array(da);
  const y = new Uint8Array(db);
  let diff = 0;
  for (let i = 0; i < x.length; i++) diff |= x[i] ^ y[i];
  return diff === 0;
}

/** The password from an `Authorization: Basic …` header, or null. */
function passwordFrom(header: string | null): string | null {
  if (!header) return null;
  const [scheme, encoded] = header.split(' ');
  if (scheme?.toLowerCase() !== 'basic' || !encoded) return null;
  try {
    // atob gives one byte per character; re-decode as UTF-8 so non-ASCII passwords work.
    const bytes = Uint8Array.from(atob(encoded), (c) => c.charCodeAt(0));
    const decoded = new TextDecoder().decode(bytes);
    const colon = decoded.indexOf(':');
    return colon < 0 ? null : decoded.slice(colon + 1);
  } catch {
    return null;
  }
}

const NO_STORE = { 'Cache-Control': 'no-store' };

/**
 * Returns null when the request may proceed, or the response to send instead
 * (401 with a browser password prompt, or 503 when no password is configured).
 */
export async function adminGate(request: NextRequest): Promise<NextResponse | null> {
  const expected = process.env.ADMIN_PASSWORD;
  if (!expected) {
    return new NextResponse('The admin area is disabled: ADMIN_PASSWORD is not set.', {
      status: 503,
      headers: NO_STORE,
    });
  }

  const given = passwordFrom(request.headers.get('authorization'));
  if (given !== null && (await safeEqual(given, expected))) return null;

  return new NextResponse('Authentication required.', {
    status: 401,
    headers: { ...NO_STORE, 'WWW-Authenticate': 'Basic realm="Admin", charset="UTF-8"' },
  });
}
