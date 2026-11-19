import type { ReactNode } from 'react';

/**
 * Brand pill badges. Color keys are kept from the baseline API for backwards
 * compatibility and mapped onto the dark brand palette:
 *   gold -> signature yellow (featured / new)
 *   teal -> neutral white (default label)
 *   mint -> green (bonus, 2X GTA$ & RP)
 *   rust -> red (limited time / ending soon)
 */
export type BadgeColor = 'gold' | 'teal' | 'mint' | 'rust';

const BADGE_COLORS: Record<BadgeColor, string> = {
  gold: 'bg-rs-yellow text-black border-rs-yellow',
  teal: 'bg-white/10 text-white border-white/15',
  mint: 'bg-rs-green/15 text-rs-green border-rs-green/40',
  rust: 'bg-rs-red/15 text-rs-red border-rs-red/40',
};

/** Brand pill badge. Shared component (usable in Server and Client trees). */
export function Badge({ children, color = 'teal' }: { children: ReactNode; color?: BadgeColor }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold uppercase border tracking-wider ${BADGE_COLORS[color]}`}>
      {children}
    </span>
  );
}
