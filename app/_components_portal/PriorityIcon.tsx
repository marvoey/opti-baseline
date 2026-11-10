import { LibertyIcon, ICON_NAMES, type IconName } from '@/app/_components_liberty/Icons';

/** Icons an editor can pick for a priority: the Liberty set plus an umbrella. */
export const PRIORITY_ICONS = ['home', 'condo', 'renters', 'umbrella', 'moto', 'auto', 'life', 'pet', 'biz'] as const;
export type PriorityIconName = (typeof PRIORITY_ICONS)[number];

const isLibertyIcon = (name: string): name is IconName => (ICON_NAMES as string[]).includes(name);

/** Line icon (24×24 grid). Unknown or empty names render the home icon. */
export default function PriorityIcon({ name, className = 'w-6 h-6' }: { name?: string | null; className?: string }) {
  if (name === 'umbrella') {
    return (
      <svg
        className={className}
        fill="none"
        stroke="currentColor"
        strokeWidth={1.6}
        strokeLinecap="round"
        strokeLinejoin="round"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <path d="M3 12a9 9 0 0118 0z" />
        <path d="M12 12v6a2 2 0 01-4 0" />
      </svg>
    );
  }
  return <LibertyIcon name={name && isLibertyIcon(name) ? name : 'home'} className={className} />;
}
