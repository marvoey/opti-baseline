'use client';

import { useId, useState, useTransition } from 'react';
import { useRouter } from 'next/navigation';
import { safeHref } from '@/app/_components_liberty/utils';
import { isAgentKey, type AgentKey } from '@/lib/agent/personas';

export type SignInAgent = { key: AgentKey; label: string; email: string };

export type SignInLabels = {
  picker: string;
  email: string;
  password: string;
  remember: string;
  forgot: string;
  forgotHref: string;
  button: string;
  newUser: string;
  requestAccess: string;
  requestAccessHref: string;
  demoNote: string;
};

/**
 * The portal's sign-in form. DEMO ONLY: it does not sign anyone in. It lets the
 * presenter choose which of the four demo agents is "signing in", stores that
 * choice through POST /api/agent (the same cookie as the "view as" switch), and
 * goes to the destination.
 *
 * No credentials are collected: the email shows the chosen agent's address and
 * is read-only, the password box is a read-only text box showing bullets (so
 * password managers do not treat it as a login), and neither input has a `name`,
 * so nothing typed or shown is ever submitted. The
 * demo note says so on the page.
 *
 * `destination` is already checked by the server (a path on this site); "{agent}"
 * in it becomes the chosen agent's key. When the demo switch is off (`choose`
 * false) there is no choice: the form goes to the destination as the default agent.
 */
export default function SignInForm({
  agents,
  initial,
  choose,
  destination,
  labels,
  disabled,
}: {
  agents: SignInAgent[];
  initial: AgentKey;
  choose: boolean;
  destination: string;
  labels: SignInLabels;
  disabled?: boolean;
}) {
  const router = useRouter();
  const id = useId();
  const [key, setKey] = useState<AgentKey>(initial);
  const [error, setError] = useState(false);
  const [pending, startTransition] = useTransition();
  const agent = agents.find((a) => a.key === key) ?? agents[0];

  function submit(e: React.FormEvent) {
    e.preventDefault();
    if (pending || disabled || !isAgentKey(key)) return;
    setError(false);
    startTransition(async () => {
      try {
        if (choose) {
          const res = await fetch('/api/agent', {
            method: 'POST',
            headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ agent: key }),
          });
          if (!res.ok) {
            setError(true);
            return;
          }
        }
        router.push(destination.replaceAll('{agent}', key));
      } catch {
        setError(true);
      }
    });
  }

  const input = 'mt-2 w-full rounded-md border border-gray-300 bg-gray-50 px-4 py-3 text-gray-700 outline-none';
  // These two boxes only display demo values. They are plain read-only text boxes
  // (not type=email / type=password) and tell the common password managers to
  // leave them alone. Otherwise an extension such as LastPass injects its icon
  // next to them after the server HTML is sent, and React reports a hydration
  // mismatch. It also means no manager offers to save or fill anything here.
  const noManager = {
    autoComplete: 'off',
    'data-lpignore': 'true', // LastPass
    'data-1p-ignore': true, // 1Password
    'data-bwignore': 'true', // Bitwarden
    'data-form-type': 'other', // Dashlane and others
  } as const;

  return (
    <form onSubmit={submit} className="mt-6 flex flex-col" noValidate>
      {choose && (
        <>
          <label htmlFor={`${id}-who`} className="text-sm font-medium text-navy">
            {labels.picker}
          </label>
          <select
            id={`${id}-who`}
            value={key}
            onChange={(e) => isAgentKey(e.target.value) && setKey(e.target.value)}
            className="mt-2 w-full rounded-md border border-gray-300 bg-white px-4 py-3 text-navy"
          >
            {agents.map((a) => (
              <option key={a.key} value={a.key}>
                {a.label}
              </option>
            ))}
          </select>
        </>
      )}

      <label htmlFor={`${id}-email`} className="mt-5 text-sm font-medium text-navy">
        {labels.email}
      </label>
      <input id={`${id}-email`} type="text" readOnly value={agent.email} {...noManager} className={input} />

      <label htmlFor={`${id}-pw`} className="mt-5 text-sm font-medium text-navy">
        {labels.password}
      </label>
      <input id={`${id}-pw`} type="text" readOnly value="••••••••••" {...noManager} className={input} />

      <div className="mt-4 flex flex-wrap items-center justify-between gap-2 text-sm">
        <label className="flex items-center gap-2">
          <input type="checkbox" defaultChecked className="accent-[#06748C]" /> {labels.remember}
        </label>
        <a href={safeHref(labels.forgotHref)} className="text-lmt underline underline-offset-2">
          {labels.forgot}
        </a>
      </div>

      <button
        type="submit"
        disabled={pending || disabled}
        className="mt-8 w-full rounded-md bg-lmt py-3.5 font-medium text-white hover:bg-lmtd disabled:opacity-60"
      >
        {labels.button}
      </button>
      {error && (
        <p role="alert" className="mt-3 text-sm text-red-700">
          Sign in is not available right now. Please try again.
        </p>
      )}

      <p className="mt-6 text-sm text-gray-600">
        {labels.newUser}{' '}
        <a href={safeHref(labels.requestAccessHref)} className="text-lmt underline underline-offset-2">
          {labels.requestAccess}
        </a>
      </p>
      {labels.demoNote && (
        <p className="mt-4 rounded-lg border border-creamb bg-cream px-4 py-3 text-xs leading-5 text-navy">
          {labels.demoNote}
        </p>
      )}
    </form>
  );
}
