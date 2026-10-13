import type { ReactNode } from 'react';

export type BadgeColor = 'gold' | 'teal' | 'mint' | 'rust';

const BADGE_COLORS: Record<BadgeColor, string> = {
  gold: 'bg-blue-200/25 text-blue-950 border-blue-200/60',
  teal: 'bg-blue-800/10 text-blue-800 border-blue-800/30',
  mint: 'bg-ups-green/15 text-blue-950 border-ups-green/40',
  rust: 'bg-ups-red/10 text-ups-red border-ups-red/30',
};

/** Brand pill badge. Shared component (usable in Server and Client trees). */
export function Badge({ children, color = 'teal' }: { children: ReactNode; color?: BadgeColor }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide ${BADGE_COLORS[color]}`}>
      {children}
    </span>
  );
}
