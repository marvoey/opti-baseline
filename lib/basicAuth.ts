import { createHash, timingSafeEqual } from 'node:crypto';

/**
 * HTTP Basic auth check for the password-protected internal demo pages (see proxy.ts).
 * The username is ignored: only the password is checked.
 */

const sha256 = (value: string) => createHash('sha256').update(value).digest();

/** Constant-time string comparison (hashes first so the lengths always match). */
function safeEqual(a: string, b: string): boolean {
  return timingSafeEqual(sha256(a), sha256(b));
}

/** True when `authorization` is a Basic header whose password equals `password`. Empty passwords never match. */
export function checkBasicAuth(authorization: string | null, password: string): boolean {
  if (!password || !authorization) return false;
  const [scheme, encoded] = authorization.split(' ');
  if (scheme?.toLowerCase() !== 'basic' || !encoded) return false;

  let decoded: string;
  try {
    decoded = Buffer.from(encoded, 'base64').toString('utf8');
  } catch {
    return false;
  }
  const separator = decoded.indexOf(':');
  if (separator === -1) return false;
  return safeEqual(decoded.slice(separator + 1), password);
}
