import {
  BarChart3,
  BookOpen,
  Briefcase,
  ChartPie,
  Code,
  FileText,
  FlaskConical,
  Layers,
  LifeBuoy,
  Settings,
  Users,
  Zap,
  type LucideIcon,
} from 'lucide-react';

/**
 * Maps CMS icon slugs (NavItem.icon) to lucide-react components. The slug set
 * here is mirrored as the `enum` choices on the CMS Icon properties (see
 * cms/navigation.tsx) so editors pick from exactly these. Add an icon by
 * extending BOTH places. Unknown slugs render nothing (the row just omits the
 * icon) rather than throwing.
 */
const ICONS: Record<string, LucideIcon> = {
  'chart-bar': BarChart3,
  'chart-pie': ChartPie,
  flask: FlaskConical,
  code: Code,
  layers: Layers,
  book: BookOpen,
  users: Users,
  zap: Zap,
  settings: Settings,
  file: FileText,
  briefcase: Briefcase,
  support: LifeBuoy,
};

/** Sorted slug list — reused to build the CMS enum choices. */
export const ICON_SLUGS = Object.keys(ICONS).sort();

export function NavIcon({
  slug,
  className,
  size = 18,
}: {
  slug?: string | null;
  className?: string;
  size?: number;
}) {
  if (!slug) return null;
  const Icon = ICONS[slug];
  if (!Icon) return null;
  return <Icon size={size} className={className} aria-hidden="true" />;
}
