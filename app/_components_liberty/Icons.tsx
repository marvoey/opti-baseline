import type { ReactNode } from 'react';
import { cx } from './utils';

export type IconName =
  | 'auto'
  | 'home'
  | 'condo'
  | 'renters'
  | 'pet'
  | 'moto'
  | 'life'
  | 'biz'
  | 'user'
  | 'search'
  | 'pin'
  | 'chevron-down';

export const ICON_NAMES: IconName[] = [
  'auto',
  'home',
  'condo',
  'renters',
  'pet',
  'moto',
  'life',
  'biz',
  'user',
  'search',
  'pin',
  'chevron-down',
];

/** Line icons (24×24 grid), taken from the Ask Liberty mockup. */
const PATHS: Record<IconName, ReactNode> = {
  auto: (
    <>
      <path d="M3 15l2-6h14l2 6v3H3z" />
      <circle cx="7.5" cy="18" r="1.5" />
      <circle cx="16.5" cy="18" r="1.5" />
      <path d="M5 12h14" />
    </>
  ),
  home: (
    <>
      <path d="M3 11l9-7 9 7" />
      <path d="M5 10v10h14V10" />
      <path d="M10 20v-5h4v5" />
    </>
  ),
  condo: (
    <>
      <rect x="5" y="3" width="10" height="18" />
      <path d="M15 9h4v12h-4M8 7h1M11 7h1M8 11h1M11 11h1M8 15h1M11 15h1" />
    </>
  ),
  renters: (
    <>
      <circle cx="8" cy="12" r="4" />
      <path d="M12 12h9M18 12v3M21 12v2" />
    </>
  ),
  pet: (
    <>
      <circle cx="12" cy="15.5" r="3.5" />
      <circle cx="6" cy="10" r="1.6" />
      <circle cx="10" cy="6.5" r="1.6" />
      <circle cx="14" cy="6.5" r="1.6" />
      <circle cx="18" cy="10" r="1.6" />
    </>
  ),
  moto: (
    <>
      <circle cx="6" cy="17" r="3" />
      <circle cx="18" cy="17" r="3" />
      <path d="M6 17l4-6h5l3 6M13 11l-1-3h3" />
    </>
  ),
  life: <path d="M12 20s-7-4.5-7-10a4 4 0 017-2.6A4 4 0 0119 10c0 5.5-7 10-7 10z" />,
  biz: <path d="M4 9l1-5h14l1 5M4 9v11h16V9M4 9h16M10 20v-6h4v6" />,
  user: (
    <>
      <circle cx="12" cy="8" r="4" />
      <path d="M4 21c0-4 4-6 8-6s8 2 8 6" />
    </>
  ),
  search: (
    <>
      <circle cx="11" cy="11" r="7" />
      <path d="M21 21l-4.3-4.3" />
    </>
  ),
  pin: (
    <>
      <path d="M12 21s-7-6.2-7-11a7 7 0 0114 0c0 4.8-7 11-7 11z" />
      <circle cx="12" cy="10" r="2.5" />
    </>
  ),
  'chevron-down': <path d="M6 9l6 6 6-6" />,
};

type LibertyIconProps = {
  name: IconName;
  className?: string;
  strokeWidth?: number;
};

/** Stroke icon that inherits `currentColor`. Decorative by default. */
export function LibertyIcon({ name, className = 'w-6 h-6', strokeWidth = 1.6 }: LibertyIconProps) {
  return (
    <svg
      className={className}
      fill="none"
      stroke="currentColor"
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      {PATHS[name]}
    </svg>
  );
}

/** Teal check mark used in checklists and table cells. */
export function CheckIcon({ className }: { className?: string }) {
  return (
    <svg
      className={cx('w-5 h-5 shrink-0 text-lmt', className)}
      fill="none"
      stroke="currentColor"
      strokeWidth={2.4}
      viewBox="0 0 24 24"
      aria-hidden="true"
    >
      <path d="M5 12.5l4.5 4.5L19 7.5" />
    </svg>
  );
}
