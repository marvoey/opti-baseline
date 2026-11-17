import type { ReactNode } from 'react';

/** A Graph `url` property value (only the field we read). */
export type UrlLike = { default?: string | null } | null | undefined;

export const hrefOf = (u: UrlLike) => u?.default || '#';

/** Event keys that mean "send nothing". */
const eventOf = (key?: string | null) => (key && key !== 'none' ? key : undefined);

type CtaProps = {
  label?: string | null;
  url?: UrlLike;
  eventKey?: string | null;
  variant?: 'primary' | 'secondary';
  /**
   * `true`/`false` forces the on-dark / on-light look. Leave undefined to follow
   * the nearest `group` ancestor with `data-dark="true"` (a dark [HRB] Section).
   */
  dark?: boolean;
  /** `pa('Field')` attributes so the label is clickable in on-page editing. */
  editProps?: Record<string, unknown>;
};

const BASE =
  'inline-flex items-center rounded-full px-5 py-2.5 text-sm font-semibold transition-colors';

function ctaClass(variant: 'primary' | 'secondary', dark?: boolean) {
  if (dark === true) {
    return variant === 'primary'
      ? 'bg-blue-400 text-blue-950 hover:bg-blue-300'
      : 'border-2 border-white text-white hover:bg-white/10';
  }
  if (dark === false) {
    return variant === 'primary'
      ? 'bg-blue-800 text-white hover:bg-blue-950'
      : 'border-2 border-blue-800 text-blue-800 hover:bg-blue-100';
  }
  return variant === 'primary'
    ? 'bg-blue-800 text-white hover:bg-blue-950 group-data-[dark=true]:bg-blue-400 group-data-[dark=true]:text-blue-950 group-data-[dark=true]:hover:bg-blue-300'
    : 'border-2 border-blue-800 text-blue-800 hover:bg-blue-100 group-data-[dark=true]:border-white group-data-[dark=true]:text-white group-data-[dark=true]:hover:bg-white/10';
}

/** Pill button. Renders nothing without a label. The event key is exposed as `data-event-key`. */
export function CtaButton({
  label,
  url,
  eventKey,
  variant = 'primary',
  dark,
  editProps,
}: CtaProps) {
  if (!label) return null;
  return (
    <a
      href={hrefOf(url)}
      data-event-key={eventOf(eventKey)}
      className={`${BASE} ${ctaClass(variant, dark)}`}
      {...editProps}
    >
      {label}
    </a>
  );
}

/** Link that opens the live hrblock.com page in a new tab. */
export function ExternalLink({
  href,
  className = '',
  children,
}: {
  href: string;
  className?: string;
  children: ReactNode;
}) {
  return (
    <a href={href} target="_blank" rel="noopener noreferrer" className={className}>
      {children}
    </a>
  );
}
