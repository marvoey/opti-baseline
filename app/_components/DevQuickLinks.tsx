import fs from 'node:fs';
import path from 'node:path';
import DevQuickLinksMenu, { type QuickLinkGroup, type QuickLink } from './DevQuickLinksMenu';

// Route folders (relative to app/) that get their own section in the menu.
const ROUTE_ROOTS = ['demo', 'admin'];
const PAGE_FILE = /^page\.(tsx|ts|jsx|js|mdx)$/;

const toLabel = (segment: string) =>
  segment
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

// Walks a route folder under app/ and returns a link for every folder that contains a page file,
// in depth-first order so nested routes sit directly under their parent.
// Route groups "(x)" don't affect the URL; private "_x" and dynamic "[x]" /
// parallel "@x" folders are skipped since they can't be linked to directly.
function collectLinks(dir: string, root: string, segments: string[]): QuickLink[] {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const links: QuickLink[] = [];

  if (entries.some((e) => e.isFile() && PAGE_FILE.test(e.name))) {
    links.push({
      // The section's own page is labelled "Overview"; the section title already names the root.
      label: segments.length ? toLabel(segments[segments.length - 1]) : 'Overview',
      href: '/' + [root, ...segments].join('/'),
      // Top-level routes and the section page sit flush; each deeper level is indented once.
      depth: Math.max(segments.length - 1, 0),
    });
  }

  for (const entry of entries.filter((e) => e.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
    const { name } = entry;
    if (/^[_@[]/.test(name)) continue;
    const isGroup = name.startsWith('(') && name.endsWith(')');
    links.push(...collectLinks(path.join(dir, name), root, isGroup ? segments : [...segments, name]));
  }

  return links;
}

export default function DevQuickLinks() {
  const groups: QuickLinkGroup[] = [
    {
      title: 'Site',
      links: [
        { label: 'Home', href: '/', depth: 0 },
        { label: 'Newsletter', href: '/newsletter', depth: 0 },
      ],
    },
    ...ROUTE_ROOTS.map((root) => ({
      title: toLabel(root),
      links: collectLinks(path.join(process.cwd(), 'app', root), root, []),
    })),
  ].filter((g) => g.links.length > 0);

  return <DevQuickLinksMenu groups={groups} />;
}
