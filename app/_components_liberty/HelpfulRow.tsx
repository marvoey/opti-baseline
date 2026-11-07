'use client';

import { useState } from 'react';
import { cx } from './utils';

export type HelpfulRowProps = {
  question?: string;
  yesLabel?: string;
  noLabel?: string;
  /** Right-aligned freshness note. Pass "" to hide it. */
  reviewedLabel?: string;
  /** Spacing classes. Replaces the default `mt-12 mb-14`. */
  className?: string;
};

/**
 * C31 — "Was this answer helpful?" row. The choice is only highlighted on
 * screen (nothing is sent anywhere) — wire it to your own feedback endpoint.
 */
export default function HelpfulRow({
  question = 'Was this answer helpful?',
  yesLabel = 'Yes',
  noLabel = 'No',
  reviewedLabel = 'Last reviewed October 2026',
  className = 'mt-12 mb-14',
}: HelpfulRowProps) {
  const [choice, setChoice] = useState<'yes' | 'no' | null>(null);
  const button = (value: 'yes' | 'no', label: string) => (
    <button
      type="button"
      aria-pressed={choice === value}
      onClick={() => setChoice(value)}
      className={cx(
        'border rounded-full px-4 py-1.5 hover:border-lmt',
        choice === value ? 'border-lmt text-lmt bg-mist' : 'border-gray-300',
      )}
    >
      {label}
    </button>
  );
  return (
    <div
      data-reveal="card"
      className={cx('flex flex-wrap items-center gap-4 text-sm', className)}
    >
      <span className="text-navy font-medium">{question}</span>
      {button('yes', yesLabel)}
      {button('no', noLabel)}
      {reviewedLabel && <span className="ml-auto text-xs text-gray-500">{reviewedLabel}</span>}
    </div>
  );
}
