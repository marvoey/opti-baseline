import { getDevQuickLinks } from '@/lib/devQuickLinks';
import DevQuickLinksMenu from './DevQuickLinksMenu';

export default function DevQuickLinks() {
  const links = getDevQuickLinks();
  if (links.length === 0) return null;
  return <DevQuickLinksMenu links={links} />;
}
