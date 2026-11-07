import { LibertyIcon, type IconName } from './Icons';
import { cx } from './utils';

export type IconBadgeProps = {
  icon?: IconName;
  /** md = 40px (cards), lg = 56px (handoff banner), xl = 48px (account cards). */
  size?: 'md' | 'lg' | 'xl';
  /** white (on cream/mist cards) or mist (on white cards). */
  tone?: 'white' | 'mist';
  /** Accessible name. Leave empty for a purely decorative icon. */
  label?: string;
  className?: string;
};

const SIZE = { md: 'w-10 h-10', lg: 'w-14 h-14', xl: 'w-12 h-12' } as const;
const TONE = { white: 'bg-white', mist: 'bg-mist' } as const;

/** C17 — circle with a teal line icon. */
export default function IconBadge({
  icon = 'auto',
  size = 'md',
  tone = 'white',
  label,
  className,
}: IconBadgeProps) {
  return (
    <div
      role={label ? 'img' : undefined}
      aria-label={label || undefined}
      aria-hidden={label ? undefined : true}
      className={cx(
        'rounded-full flex items-center justify-center text-lmt shrink-0',
        SIZE[size],
        TONE[tone],
        className,
      )}
    >
      <LibertyIcon name={icon} strokeWidth={size === 'xl' ? 1.8 : 1.6} />
    </div>
  );
}
