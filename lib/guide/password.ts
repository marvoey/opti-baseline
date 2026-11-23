import 'server-only';
import { randomBytes, scrypt, timingSafeEqual, type ScryptOptions } from 'node:crypto';

/**
 * Password hashing with scrypt (memory-hard, built into Node). Stored format:
 *   scrypt$<N>$<r>$<p>$<salt base64url>$<hash base64url>
 * One-way: the password cannot be recovered from the hash, only checked against it.
 */

const N = 2 ** 15;
const R = 8;
const P = 1;
const KEY_LENGTH = 32;
// scrypt needs about 128 * N * r bytes; give it headroom over Node's 32 MB default.
const MAX_MEMORY = 96 * 1024 * 1024;

function derive(password: string, salt: Buffer, n: number, r: number, p: number): Promise<Buffer> {
  const options: ScryptOptions = { N: n, r, p, maxmem: MAX_MEMORY };
  return new Promise((resolve, reject) =>
    scrypt(password.normalize('NFKC'), salt, KEY_LENGTH, options, (err, key) => (err ? reject(err) : resolve(key))),
  );
}

export async function hashPassword(password: string): Promise<string> {
  const salt = randomBytes(16);
  const hash = await derive(password, salt, N, R, P);
  return ['scrypt', N, R, P, salt.toString('base64url'), hash.toString('base64url')].join('$');
}

export async function verifyPassword(password: string, stored: string | undefined | null): Promise<boolean> {
  const parts = (stored ?? '').split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') {
    // Same work as a real check, so a missing account takes as long as a wrong password.
    await derive(password, randomBytes(16), N, R, P);
    return false;
  }
  const [, n, r, p, saltText, hashText] = parts;
  const params = [Number(n), Number(r), Number(p)];
  // Refuse edited records that would make the server do huge amounts of work.
  if (params.some((v) => !Number.isInteger(v) || v < 1) || params[0] > 2 ** 17 || params[1] > 16 || params[2] > 4) {
    return false;
  }
  const expected = Buffer.from(hashText, 'base64url');
  if (expected.length !== KEY_LENGTH) return false;
  const actual = await derive(password, Buffer.from(saltText, 'base64url'), params[0], params[1], params[2]);
  return timingSafeEqual(actual, expected);
}

/** Problems with a new password, in plain English. Empty when it is acceptable. */
export function passwordProblem(password: string, email: string): string | null {
  if (password.length < 12) return 'Use at least 12 characters.';
  if (password.length > 200) return 'Use at most 200 characters.';
  if (password.trim().toLowerCase() === email.trim().toLowerCase()) return 'Don’t use your email address as your password.';
  if (/^(.)\1+$/.test(password)) return 'Don’t repeat one character.';
  return null;
}
