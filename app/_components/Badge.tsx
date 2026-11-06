import type { ReactNode } from 'react';

export type BadgeColor = 'gold' | 'teal' | 'mint' | 'rust';

const BADGE_COLORS: Record<BadgeColor, string> = {
  gold: 'bg-cream text-navy border-creamb',
  teal: 'bg-mist text-lmtd border-lmt/20',
  mint: 'bg-green-100 text-green-800 border-green-200',
  rust: 'bg-red-50 text-red-700 border-red-200',
};

/** Brand pill badge. Shared component (usable in Server and Client trees). */
export function Badge({ children, color = 'teal' }: { children: ReactNode; color?: BadgeColor }) {
  return (
    <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border tracking-wide ${BADGE_COLORS[color]}`}>
      {children}
    </span>
  );
}
