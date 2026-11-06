import fs from 'node:fs';
import path from 'node:path';
import DevQuickLinksMenu, { type QuickLink } from './DevQuickLinksMenu';

// Route folders (relative to app/) whose pages are listed in the menu.
const ROUTE_ROOTS = ['demo', 'admin'];
const PAGE_FILE = /^page\.(tsx|ts|jsx|js|mdx)$/;
const STATIC_HTML = /\.html?$/i;

const toLabel = (segment: string) =>
  segment
    .replace(STATIC_HTML, '')
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

// Walks a route folder under app/ and returns a link for every folder that contains a page file.
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
      label: toLabel(segments.length ? segments[segments.length - 1] : root),
      href: '/' + [root, ...segments].join('/'),
      group: 'Pages',
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

// Walks public/ and returns a link for every .html file, so dropping a static
// page into public/ adds it to the menu with no code change. Served as-is by
// Next at /<path>, so these are plain links (not <Link>, which is for routes).
// Dot-files and symlinks are skipped; each path segment is URL-encoded.
function collectStaticHtml(dir: string, segments: string[]): QuickLink[] {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const links: QuickLink[] = [];
  for (const entry of entries.sort((a, b) => a.name.localeCompare(b.name))) {
    if (entry.name.startsWith('.')) continue;
    if (entry.isDirectory()) {
      links.push(...collectStaticHtml(path.join(dir, entry.name), [...segments, entry.name]));
    } else if (entry.isFile() && STATIC_HTML.test(entry.name)) {
      links.push({
        label: toLabel(entry.name),
        href: '/' + [...segments, entry.name].map(encodeURIComponent).join('/'),
        group: 'Static pages',
        isStatic: true,
      });
    }
  }
  return links;
}

export default function DevQuickLinks() {
  const links = [
    ...ROUTE_ROOTS.flatMap((root) =>
      collectLinks(path.join(process.cwd(), 'app', root), root, []),
    ),
    ...collectStaticHtml(path.join(process.cwd(), 'public'), []),
  ];
  if (links.length === 0) return null;
  return <DevQuickLinksMenu links={links} />;
}
