'use client';

import Link from 'next/link';
import { useActionState } from 'react';
import s from '../setup-guide.module.css';
import { login, signup, type AuthState } from '../actions';

function FormError({ state }: { state: AuthState }) {
  if (!state.error) return null;
  return (
    <p className={s.formError} role="alert">
      {state.error}
    </p>
  );
}

export function LoginForm() {
  const [state, action, pending] = useActionState(login, {});
  return (
    <form action={action} className={s.form} noValidate>
      <FormError state={state} />
      <label className={s.field}>
        <span>Work email</span>
        <input name="email" type="email" autoComplete="username" required defaultValue={state.email} />
      </label>
      <label className={s.field}>
        <span>Password</span>
        <input name="password" type="password" autoComplete="current-password" required />
      </label>
      <button type="submit" className={s.primaryButton} disabled={pending}>
        {pending ? 'Signing in…' : 'Sign in'}
      </button>
      <p className={s.formFoot}>
        New here? <Link href="/setup-guide/signup">Create your account</Link>
      </p>
    </form>
  );
}

export function SignupForm({ domain }: { domain: string }) {
  const [state, action, pending] = useActionState(signup, {});
  return (
    <form action={action} className={s.form} noValidate>
      <FormError state={state} />
      <label className={s.field}>
        <span>Full name</span>
        <input name="fullName" autoComplete="name" required defaultValue={state.fullName} />
      </label>
      <label className={s.field}>
        <span>Work email</span>
        <input name="email" type="email" autoComplete="username" required placeholder={`you@${domain}`} defaultValue={state.email} />
        <small>Only @{domain} addresses can sign up.</small>
      </label>
      <label className={s.field}>
        <span>Password</span>
        <input name="password" type="password" autoComplete="new-password" required minLength={12} />
        <small>At least 12 characters. A short sentence is easy to remember.</small>
      </label>
      <label className={s.field}>
        <span>Type the password again</span>
        <input name="confirm" type="password" autoComplete="new-password" required minLength={12} />
      </label>
      <button type="submit" className={s.primaryButton} disabled={pending}>
        {pending ? 'Creating your account…' : 'Create account'}
      </button>
      <p className={s.formFoot}>
        Already have an account? <Link href="/setup-guide/login">Sign in</Link>
      </p>
    </form>
  );
}
