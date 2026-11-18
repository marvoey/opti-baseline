'use client';

import { useId, useState, type FormEvent } from 'react';
import type { PlanFinderWidgetProps } from '@/cms/planFinderFields';
import type { PlanTypeKey } from '@/cms/planTypes';

/**
 * Reports a conversion to Optimizely Feature Experimentation through the
 * server route (the SDK runs server-side, keyed to the visitor's cookie).
 * Fire-and-forget: `keepalive` lets it finish while the browser navigates away,
 * and a failure never blocks the visitor.
 */
function trackFx(event: 'plan_finder_submit' | 'agent_call_click') {
  try {
    void fetch('/api/fx/track', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ event }),
      keepalive: true,
    }).catch(() => {});
  } catch {
    // tracking is best-effort
  }
}

/**
 * eHealth plan finder: plan-type tiles, a ZIP code field, an orange "Compare
 * … plans" pill and the licensed-agent phone line. Used by the EhHero and
 * EhPlanFinder CMS blocks; all copy comes from CMS via props.
 *
 * Submitting goes to `{plan.href}?zip=xxxxx&type={plan}`.
 */
export default function PlanFinderWidget({
  heading,
  plans,
  defaultPlan,
  zipPlaceholder,
  ctaLabel,
  agentPrompt,
  phoneLabel,
  phoneHref,
  phoneSuffix,
  editAttrs = {},
}: PlanFinderWidgetProps) {
  const [selected, setSelected] = useState<PlanTypeKey>(defaultPlan);
  const [zip, setZip] = useState('');
  const [error, setError] = useState<string | null>(null);
  const zipId = useId();
  const errorId = useId();

  const plan = plans.find((p) => p.value === selected) ?? plans[0];
  const buttonLabel = ctaLabel ?? `Compare ${plan.ctaNoun} plans`;

  function onSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!/^\d{5}$/.test(zip)) {
      setError('Please enter a valid 5-digit ZIP code.');
      return;
    }
    setError(null);
    trackFx('plan_finder_submit');
    const params = new URLSearchParams({ zip, type: plan.value });
    window.location.href = `${plan.href}?${params.toString()}`;
  }

  return (
    <div className="w-full">
      <p {...editAttrs.FinderHeading} className="text-center text-sm font-medium text-foreground sm:text-base">
        {heading}
      </p>

      <div
        role="radiogroup"
        aria-label={heading}
        className="mx-auto mt-4 grid max-w-3xl grid-cols-2 gap-2 sm:grid-cols-3 md:grid-cols-5 md:gap-3"
      >
        {plans.map((p) => {
          const active = p.value === selected;
          return (
            <button
              key={p.value}
              type="button"
              role="radio"
              aria-checked={active}
              onClick={() => setSelected(p.value)}
              className={[
                'relative flex min-h-[92px] flex-col items-center justify-center gap-2 rounded-lg border bg-white px-2 py-3 text-center text-xs font-semibold leading-tight transition sm:text-sm',
                'focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 focus-visible:ring-offset-2',
                active
                  ? 'border-2 border-blue-800 text-blue-950 shadow-md'
                  : 'border-gray-300 text-blue-950 hover:border-blue-700 hover:shadow-sm',
              ].join(' ')}
            >
              {active && (
                <span className="absolute -top-2 -right-2 flex h-5 w-5 items-center justify-center rounded-full bg-blue-800 text-white" aria-hidden>
                  <svg viewBox="0 0 16 16" className="h-3 w-3" fill="none" stroke="currentColor" strokeWidth="2.5">
                    <path d="M3.5 8.5l3 3 6-7" strokeLinecap="round" strokeLinejoin="round" />
                  </svg>
                </span>
              )}
              <PlanIcon type={p.value} className="h-8 w-8 text-blue-800" />
              <span>{p.label}</span>
            </button>
          );
        })}
      </div>

      <form onSubmit={onSubmit} noValidate className="mx-auto mt-5 flex max-w-xl flex-col items-stretch gap-3 sm:flex-row sm:items-end sm:justify-center">
        <div className="flex flex-col sm:w-44">
          <label htmlFor={zipId} className="mb-1 text-xs font-medium text-gray-600">
            ZIP Code
          </label>
          <input
            id={zipId}
            type="text"
            inputMode="numeric"
            autoComplete="postal-code"
            maxLength={5}
            placeholder={zipPlaceholder}
            value={zip}
            onChange={(e) => {
              setZip(e.target.value.replace(/\D/g, '').slice(0, 5));
              if (error) setError(null);
            }}
            aria-invalid={!!error}
            aria-describedby={error ? errorId : undefined}
            className={[
              'h-12 rounded-md border bg-white px-4 text-base text-foreground placeholder:text-gray-400',
              'focus:outline-none focus:ring-2 focus:ring-blue-400',
              error ? 'border-red-600' : 'border-gray-400',
            ].join(' ')}
          />
        </div>
        <button
          type="submit"
          {...editAttrs.CtaLabel}
          className="h-12 rounded-full bg-cta px-8 text-base font-semibold text-white shadow-sm transition hover:bg-cta-hover focus:outline-none focus-visible:ring-2 focus-visible:ring-cta focus-visible:ring-offset-2"
        >
          {buttonLabel}
        </button>
      </form>
      {error && (
        <p id={errorId} role="alert" className="mt-2 text-center text-sm text-red-700">
          {error}
        </p>
      )}

      <div className="mt-5 text-center">
        <p {...editAttrs.AgentPrompt} className="text-sm text-foreground">
          {agentPrompt}
        </p>
        <a
          href={phoneHref}
          onClick={() => trackFx('agent_call_click')}
          {...editAttrs.PhoneNumber}
          className="mt-1 inline-block font-display text-2xl font-bold text-blue-950 hover:text-blue-800 sm:text-3xl"
        >
          {phoneLabel} <span className="font-normal">{phoneSuffix}</span>
        </a>
      </div>
    </div>
  );
}

/** Simple line icons for each plan tile. */
function PlanIcon({ type, className }: { type: PlanTypeKey; className?: string }) {
  const common = {
    viewBox: '0 0 32 32',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 1.8,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    className,
    'aria-hidden': true,
  };
  switch (type) {
    case 'medicare': // card with heart
      return (
        <svg {...common}>
          <rect x="3" y="7" width="26" height="18" rx="2.5" />
          <path d="M16 21s-5-3-5-6.2A2.8 2.8 0 0 1 16 13a2.8 2.8 0 0 1 5 1.8C21 18 16 21 16 21z" />
        </svg>
      );
    case 'individual': // family
      return (
        <svg {...common}>
          <circle cx="11" cy="9" r="3.5" />
          <circle cx="22" cy="11" r="2.8" />
          <path d="M4 26v-3a7 7 0 0 1 14 0v3" />
          <path d="M18.5 19.5A5.5 5.5 0 0 1 28 23v3" />
        </svg>
      );
    case 'employers': // building
      return (
        <svg {...common}>
          <rect x="6" y="4" width="20" height="24" rx="1.5" />
          <path d="M11 9h2M19 9h2M11 14h2M19 14h2M11 19h2M19 19h2M14 28v-4h4v4" />
        </svg>
      );
    case 'dental': // tooth + eye
      return (
        <svg {...common}>
          <path d="M9 5c-3 0-5 2.5-4.5 6 .4 2.8 1.6 4.4 2 7 .5 3.4 1.2 7 3 7s1.7-5 3.5-5 1.7 5 3.5 5 2.5-3.6 3-7c.4-2.6 1.6-4.2 2-7 .5-3.5-1.5-6-4.5-6-2 0-2.6 1-4 1S11 5 9 5z" transform="translate(1 1) scale(.8)" />
          <path d="M19 22c1.6-2.2 3.6-3.3 6-3.3s4.4 1.1 6 3.3c-1.6 2.2-3.6 3.3-6 3.3S20.6 24.2 19 22z" transform="translate(-2 0)" />
          <circle cx="23" cy="22" r="1.4" />
        </svg>
      );
    case 'shortterm': // calendar
      return (
        <svg {...common}>
          <rect x="4" y="6" width="24" height="22" rx="2" />
          <path d="M4 12h24M10 3v6M22 3v6M10 17h4M18 17h4M10 22h4" />
        </svg>
      );
  }
}
