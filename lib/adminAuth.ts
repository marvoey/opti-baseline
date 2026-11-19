import { createHash, timingSafeEqual } from 'node:crypto';

/**
 * HTTP Basic auth gate for /admin. The password comes from ADMIN_PASSWORD; the
 * username is ignored. Fails closed: with no ADMIN_PASSWORD set, nobody gets in.
 */

const digest = (value: string) => createHash('sha256').update(value).digest();

export function isAdminConfigured(): boolean {
  return Boolean(process.env.ADMIN_PASSWORD?.trim());
}

export function isAdminAuthorized(authorization: string | null): boolean {
  const expected = process.env.ADMIN_PASSWORD?.trim();
  if (!expected || !authorization?.startsWith('Basic ')) return false;

  let decoded: string;
  try {
    decoded = atob(authorization.slice('Basic '.length).trim());
  } catch {
    return false;
  }
  // "user:password" — the password may itself contain ":".
  const password = decoded.slice(decoded.indexOf(':') + 1);
  // Compare fixed-length digests so the check is constant-time.
  return timingSafeEqual(digest(password), digest(expected));
}
