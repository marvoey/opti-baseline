import fs from 'node:fs';
import path from 'node:path';
import DevQuickLinksMenu, { type QuickLink } from './DevQuickLinksMenu';

// Top-level folders under app/ that are never listed (api, preview) ("[locale]" and other
// dynamic / private / parallel folders are skipped by the walker itself).
const EXCLUDED_ROOTS = new Set(['api', 'preview']);
const HOME_LINK: QuickLink = { label: 'Home', href: '/' };
const PAGE_FILE = /^page\.(tsx|ts|jsx|js|mdx)$/;

const toLabel = (segment: string) =>
  segment
    .replace(/[-_]+/g, ' ')
    .replace(/\b\w/g, (c) => c.toUpperCase());

// Walks a route folder under app/ and returns a link for every folder that contains a page file.
// Route groups "(x)" don't affect the URL; private "_x" and dynamic "[x]" /
// parallel "@x" folders are skipped since they can't be linked to directly.
function collectLinks(dir: string, segments: string[]): QuickLink[] {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  const links: QuickLink[] = [];

  if (segments.length > 0 && entries.some((e) => e.isFile() && PAGE_FILE.test(e.name))) {
    links.push({
      label: toLabel(segments[segments.length - 1]),
      href: '/' + segments.join('/'),
    });
  }

  for (const entry of entries.filter((e) => e.isDirectory()).sort((a, b) => a.name.localeCompare(b.name))) {
    const { name } = entry;
    if (/^[_@[]/.test(name) || (segments.length === 0 && EXCLUDED_ROOTS.has(name))) continue;
    const isGroup = name.startsWith('(') && name.endsWith(')');
    links.push(...collectLinks(path.join(dir, name), isGroup ? segments : [...segments, name]));
  }

  return links;
}

export default function DevQuickLinks() {
  const links = [HOME_LINK, ...collectLinks(path.join(process.cwd(), 'app'), [])];
  return <DevQuickLinksMenu links={links} />;
}
