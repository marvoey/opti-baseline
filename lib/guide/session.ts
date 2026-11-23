import 'server-only';
import { createHash, createHmac, timingSafeEqual } from 'node:crypto';
import { cookies } from 'next/headers';
import { redirect } from 'next/navigation';
import { guideConfig } from './config';
import { getUserByKey, type GuideUser } from './users';

/**
 * Signed session cookie for /setup-guide. The cookie holds who you are, not what you can do:
 * every request re-reads the account from the CMS, so disabling it or clearing its password hash
 * in the CMS ends the session straight away.
 *
 * Format: base64url(JSON payload) "." base64url(HMAC-SHA256(GUIDE_SESSION_SECRET, payload))
 */

export const SESSION_COOKIE = 'guide_session';
const SESSION_DAYS = 14;
export const LOGIN_PATH = '/setup-guide/login';

type Payload = { k: string; pv: string; exp: number };

/** Short fingerprint of the stored password hash. A new or cleared hash invalidates old sessions. */
const passwordVersion = (passwordHash: string) => createHash('sha256').update(passwordHash).digest('base64url').slice(0, 16);

function sign(payloadPart: string): string {
  return createHmac('sha256', guideConfig().sessionSecret).update(payloadPart).digest('base64url');
}

function encode(payload: Payload): string {
  const part = Buffer.from(JSON.stringify(payload)).toString('base64url');
  return `${part}.${sign(part)}`;
}

function decode(token: string | undefined): Payload | null {
  if (!token) return null;
  const [part, signature] = token.split('.');
  if (!part || !signature) return null;
  const expected = Buffer.from(sign(part));
  const actual = Buffer.from(signature);
  if (expected.length !== actual.length || !timingSafeEqual(expected, actual)) return null;
  try {
    const payload = JSON.parse(Buffer.from(part, 'base64url').toString('utf8')) as Payload;
    if (typeof payload.k !== 'string' || typeof payload.pv !== 'string' || typeof payload.exp !== 'number') return null;
    return payload.exp > Date.now() ? payload : null;
  } catch {
    return null;
  }
}

/** Only in Server Functions or Route Handlers (cookies cannot be set while rendering). */
export async function startSession(user: Pick<GuideUser, 'key' | 'passwordHash'>) {
  const store = await cookies();
  store.set(SESSION_COOKIE, encode({ k: user.key, pv: passwordVersion(user.passwordHash), exp: Date.now() + SESSION_DAYS * 864e5 }), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/setup-guide',
    maxAge: SESSION_DAYS * 86400,
  });
}

export async function endSession() {
  const store = await cookies();
  store.set(SESSION_COOKIE, '', { httpOnly: true, path: '/setup-guide', maxAge: 0 });
}

/** The signed-in account, or null. Re-checks the CMS record on every call. */
export async function currentUser(): Promise<GuideUser | null> {
  const payload = decode((await cookies()).get(SESSION_COOKIE)?.value);
  if (!payload) return null;
  const user = await getUserByKey(payload.k);
  if (!user || user.disabled || !user.passwordHash || passwordVersion(user.passwordHash) !== payload.pv) return null;
  return user;
}

/** For pages: the signed-in account, or a redirect to the sign-in page. */
export async function requireUser(): Promise<GuideUser> {
  const user = await currentUser();
  if (!user) redirect(LOGIN_PATH);
  return user;
}

export function isFacilitator(user: Pick<GuideUser, 'email'>): boolean {
  return guideConfig().facilitators.has(user.email.toLowerCase());
}
