'use server';

import { redirect } from 'next/navigation';
import { guideConfig } from '@/lib/guide/config';
import { hashPassword, passwordProblem, verifyPassword } from '@/lib/guide/password';
import { endSession, LOGIN_PATH, startSession } from '@/lib/guide/session';
import {
  AccountExistsError,
  AccountInTrashError,
  createUser,
  failedLoginChanges,
  getUserByEmail,
  isLocked,
  LOCK_MINUTES,
  normalizeEmail,
  updateUser,
} from '@/lib/guide/users';
import { FACILITATOR } from './_lib/contact';

/** Sign-up, sign-in and sign-out for /setup-guide. Messages are written for non-technical readers. */

export type AuthState = { error?: string; email?: string; fullName?: string };

const EMAIL_SHAPE = /^[^\s@]{1,64}@[^\s@]{1,190}$/;
const WRONG_LOGIN = 'That email and password don’t match. Check both and try again.';
const CMS_DOWN = 'Something went wrong on our side. Please wait a minute and try again.';

function field(form: FormData, name: string) {
  const v = form.get(name);
  return typeof v === 'string' ? v : '';
}

export async function signup(_prev: AuthState, form: FormData): Promise<AuthState> {
  const fullName = field(form, 'fullName').trim().replace(/\s+/g, ' ');
  const email = normalizeEmail(field(form, 'email'));
  const password = field(form, 'password');
  const confirm = field(form, 'confirm');
  const keep = { email, fullName };
  const { allowedDomain } = guideConfig();

  if (fullName.length < 2 || fullName.length > 100) return { ...keep, error: 'Enter your full name.' };
  if (!EMAIL_SHAPE.test(email) || !email.endsWith(`@${allowedDomain}`)) {
    return { ...keep, error: `Use your @${allowedDomain} work email address.` };
  }
  const problem = passwordProblem(password, email);
  if (problem) return { ...keep, error: `Choose a different password. ${problem}` };
  if (password !== confirm) return { ...keep, error: 'The two passwords don’t match. Type them again.' };

  let session: { key: string; passwordHash: string };
  try {
    const passwordHash = await hashPassword(password);
    const key = await createUser({ email, fullName, passwordHash });
    session = { key, passwordHash };
  } catch (err) {
    if (err instanceof AccountExistsError) {
      return { ...keep, error: 'There’s already an account for this email. Sign in instead.' };
    }
    if (err instanceof AccountInTrashError) {
      console.error('[setup-guide] sign-up blocked: an earlier account for this email is in the CMS trash');
      return { ...keep, error: 'This email can’t be used to sign up right now. Ask ' + FACILITATOR + ' to remove your old account from the CMS trash.' };
    }
    console.error('[setup-guide] sign-up failed:', err instanceof Error ? err.message : err);
    return { ...keep, error: CMS_DOWN };
  }
  await startSession(session);
  redirect('/setup-guide');
}

export async function login(_prev: AuthState, form: FormData): Promise<AuthState> {
  const email = normalizeEmail(field(form, 'email'));
  const password = field(form, 'password');
  const keep = { email };
  if (!EMAIL_SHAPE.test(email) || !password) return { ...keep, error: 'Enter your email and password.' };

  let user;
  try {
    user = await getUserByEmail(email);
    if (!user || user.disabled || !user.passwordHash) {
      await verifyPassword(password, null); // same timing as a real check
      return { ...keep, error: WRONG_LOGIN };
    }
    if (isLocked(user)) {
      return { ...keep, error: `Too many wrong passwords. Wait ${LOCK_MINUTES} minutes, then try again.` };
    }
    if (!(await verifyPassword(password, user.passwordHash))) {
      await updateUser(user, failedLoginChanges(user));
      return { ...keep, error: WRONG_LOGIN };
    }
    if (user.failedLogins || user.lockedUntil) await updateUser(user, { FailedLogins: 0, LockedUntil: '' });
  } catch (err) {
    console.error('[setup-guide] sign-in failed:', err instanceof Error ? err.message : err);
    return { ...keep, error: CMS_DOWN };
  }
  await startSession(user);
  redirect('/setup-guide');
}

export async function logout() {
  await endSession();
  redirect(LOGIN_PATH);
}
