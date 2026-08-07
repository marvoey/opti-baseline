import type { ReactNode } from 'react';

export type BadgeColor = 'gold' | 'teal' | 'mint' | 'rust';

const BADGE_COLORS: Record<BadgeColor, string> = {
  gold: 'bg-sfa-amber/10 text-sfa-amber border-sfa-amber/30',
  teal: 'bg-sfa-teal/10 text-sfa-teal border-sfa-teal/20',
  mint: 'bg-sfa-teal-light/20 text-sfa-teal border-sfa-teal-light/50',
  rust: 'bg-sfa-purple/10 text-sfa-purple border-sfa-purple/20',
};

/** Brand pill badge. Shared component (usable in Server and Client trees). */
export function Badge({ children, color = 'teal' }: { children: ReactNode; color?: BadgeColor }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide ${BADGE_COLORS[color]}`}>
      {children}
    </span>
  );
}
