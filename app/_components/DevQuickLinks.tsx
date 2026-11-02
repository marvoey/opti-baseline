import fs from 'node:fs';
import path from 'node:path';
import DevQuickLinksMenu, { type LinkGroup, type QuickLink } from './DevQuickLinksMenu';

// Route folders (relative to app/) whose pages are listed in the menu.
const ROUTE_ROOTS = ['demo', 'admin'];
const PAGE_FILE = /^page\.(tsx|ts|jsx|js|mdx)$/;
const HTML_FILE = /\.html?$/i;

export const toLabel = (segment: string) =>
  segment
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

// Walks a route folder under app/ and returns a link for every folder that contains a page file.
// Route groups "(x)" don't affect the URL; private "_x" and dynamic "[x]" /
// parallel "@x" folders are skipped since they can't be linked to directly.
export function collectLinks(dir: string, root: string, segments: string[]): QuickLink[] {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const links: QuickLink[] = [];

  if (entries.some((e) => e.isFile() && PAGE_FILE.test(e.name))) {
    links.push({
      label: toLabel(segments.length ? segments[segments.length - 1] : root),
      href: '/' + [root, ...segments].join('/'),
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

// Walks public/ and returns a link for every .html file (including subfolders).
// These are static files served as-is, so they're flagged `external` and rendered
// as plain anchors rather than client-side <Link> navigations.
export function collectPublicHtml(dir: string, segments: string[] = []): QuickLink[] {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  return entries
    .filter((e) => !e.name.startsWith('.'))
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry): QuickLink[] => {
      if (entry.isDirectory()) return collectPublicHtml(path.join(dir, entry.name), [...segments, entry.name]);
      if (!HTML_FILE.test(entry.name)) return [];
      return [
        {
          label: toLabel(entry.name.replace(HTML_FILE, '')),
          href: '/' + [...segments, entry.name].map(encodeURIComponent).join('/'),
          external: true,
        },
      ];
    });
}

export default function DevQuickLinks() {
  const cwd = process.cwd();
  const groups: LinkGroup[] = [
    {
      title: 'Pages',
      links: ROUTE_ROOTS.flatMap((root) => collectLinks(path.join(cwd, 'app', root), root, [])),
    },
    { title: 'Static HTML', links: collectPublicHtml(path.join(cwd, 'public')) },
  ].filter((g) => g.links.length > 0);

  if (groups.length === 0) return null;
  return <DevQuickLinksMenu groups={groups} />;
}
