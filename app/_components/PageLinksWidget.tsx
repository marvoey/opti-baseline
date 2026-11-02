import fs from 'node:fs';
import path from 'node:path';
import { collectLinks, toLabel } from './DevQuickLinks';
import PageLinksWidgetMenu, { type LinkGroup } from './PageLinksWidgetMenu';

// Lists the static .html files in public/ and the pages under app/demo.
// Both are read from disk on render, so new files show up without code changes.
function collectPublicHtml(dir: string, segments: string[] = []): { label: string; href: string }[] {
  let entries: fs.Dirent[];
  try {
    entries = fs.readdirSync(dir, { withFileTypes: true });
  } catch {
    return [];
  }

  return entries
    .sort((a, b) => a.name.localeCompare(b.name))
    .flatMap((entry) => {
      if (entry.isDirectory()) return collectPublicHtml(path.join(dir, entry.name), [...segments, entry.name]);
      if (!/\.html?$/i.test(entry.name)) return [];
      return [{
        label: toLabel(entry.name.replace(/\.html?$/i, '')),
        href: '/' + [...segments, entry.name].join('/'),
      }];
    });
}

export function getLinkGroups(): LinkGroup[] {
  const cwd = process.cwd();
  return [
    { title: 'Demo pages', links: collectLinks(path.join(cwd, 'app', 'demo'), 'demo', []), external: false },
    { title: 'Public HTML', links: collectPublicHtml(path.join(cwd, 'public')), external: true },
  ].filter((g) => g.links.length > 0);
}

export default function PageLinksWidget() {
  const groups = getLinkGroups();
  if (groups.length === 0) return null;
  return <PageLinksWidgetMenu groups={groups} />;
}
