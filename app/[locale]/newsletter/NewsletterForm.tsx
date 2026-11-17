'use client';

import { useActionState } from 'react';
import { CtaButton } from '@/cms/hrb/ui';
import { subscribe, type SignupState } from './actions';

const INITIAL: SignupState = { status: 'idle' };

export default function NewsletterForm({ pagePath }: { pagePath: string }) {
  const [state, formAction, pending] = useActionState(subscribe, INITIAL);

  if (state.status === 'success') {
    return (
      <div role="status" className="text-center">
        <div
          aria-hidden
          className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-blue-100 text-2xl text-blue-800"
        >
          ✓
        </div>
        <h2 className="mt-4 text-2xl font-semibold">You&rsquo;re on the list.</h2>
        <p className="mt-2 text-sm opacity-80">
          We&rsquo;ve added <strong className="break-all">{state.email}</strong>. Keep an eye on your inbox for
          the next issue of the Tax Letter.
        </p>
        <div className="mt-6 flex flex-wrap justify-center gap-3">
          <CtaButton label="Explore the Tax Center" url={{ default: '/tax-center' }} dark={false} />
          <CtaButton label="Find an office" url={{ default: '/offices' }} variant="secondary" dark={false} />
        </div>
      </div>
    );
  }

  return (
    <form action={formAction} noValidate>
      <h2 className="text-2xl font-semibold">Get the Tax Letter</h2>
      <p className="mt-1 text-sm opacity-80">Join free. Unsubscribe in one click, any time.</p>

      <input type="hidden" name="page" value={pagePath} />
      {/* Honeypot: hidden from people and screen readers, bots tend to fill it. */}
      <div aria-hidden className="absolute -left-[9999px] h-0 w-0 overflow-hidden">
        <label>
          Company
          <input type="text" name="company" tabIndex={-1} autoComplete="off" />
        </label>
      </div>

      <label htmlFor="newsletter-email" className="mt-5 block text-sm font-semibold">
        Email address
      </label>
      <input
        id="newsletter-email"
        name="email"
        type="email"
        inputMode="email"
        autoComplete="email"
        required
        defaultValue={state.email ?? ''}
        placeholder="name@example.com"
        aria-invalid={state.status === 'error'}
        aria-describedby={state.status === 'error' ? 'newsletter-error' : undefined}
        className="mt-1 w-full rounded-full border border-hrb-border bg-white px-5 py-3 text-base text-hrb-ink placeholder:text-hrb-ink/40 focus:border-blue-800 focus:outline-none focus:ring-2 focus:ring-blue-800/30"
      />
      {state.status === 'error' && (
        <p id="newsletter-error" role="alert" className="mt-2 text-sm font-semibold text-red-700">
          {state.message}
        </p>
      )}

      <button
        type="submit"
        disabled={pending}
        className="mt-4 inline-flex w-full items-center justify-center rounded-full bg-blue-800 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-blue-950 disabled:opacity-60"
      >
        {pending ? 'Subscribing…' : 'Subscribe'}
      </button>

      <p className="mt-4 text-xs leading-relaxed opacity-70">
        By subscribing you agree to receive the Tax Letter. To make it more relevant to you, we also connect your
        activity on this site to your email address. We will never ask for your Social Security number by email.
      </p>
    </form>
  );
}
