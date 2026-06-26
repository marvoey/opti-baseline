import type { ReactNode } from 'react';

export type BadgeColor = 'gold' | 'teal' | 'mint' | 'rust';

const BADGE_COLORS: Record<BadgeColor, string> = {
  gold: 'bg-cibc-gold/10 text-cibc-gold-dark border-cibc-gold/30',
  teal: 'bg-cibc-teal/10 text-cibc-teal border-cibc-teal/20',
  mint: 'bg-cibc-mint/20 text-cibc-teal border-cibc-mint/50',
  rust: 'bg-cibc-rust/10 text-cibc-rust border-cibc-rust/20',
};

/** Brand pill badge. Shared component (usable in Server and Client trees). */
export function Badge({ children, color = 'teal' }: { children: ReactNode; color?: BadgeColor }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide ${BADGE_COLORS[color]}`}>
      {children}
    </span>
  );
}
