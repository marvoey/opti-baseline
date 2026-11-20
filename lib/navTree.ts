import { cache } from 'react';
import { unstable_cache } from 'next/cache';
import { getClient } from '@optimizely/cms-sdk';
import { DEFAULT_LOCALE, localizePath } from '@/lib/locales';
import { siteOrigin } from '@/lib/siteHost';

/**
 * Main navigation derived from the CMS content tree.
 *
 * Reads every published page of this site (scoped by host, like the catch-all
 * route) from Optimizely Graph and rebuilds the hierarchy from the pages' URLs:
 * `/products/widgets/` is a child of `/products/`. Order follows the
 * CMS sort order (the order pages are arranged in the content tree), then name.
 * Labels are the page display names.
 *
 * Publishing, renaming, moving or reordering a page in the CMS updates the nav
 * (within REVALIDATE_SECONDS, or immediately via revalidateTag('nav-tree')).
 */

export type NavNode = {
  label: string;
  /** Locale-aware href, ready for <Link>. */
  href: string;
  children: NavNode[];
};

export type NavTree = {
  /** The site start page (shown as the first nav item). */
  home: { label: string; href: string } | null;
  /** Top-level pages directly under the start page, with their descendants. */
  items: NavNode[];
};

const REVALIDATE_SECONDS = 60;
/** Graph rejects a limit above 100, so large trees are fetched in pages. */
const PAGE_SIZE = 100;
const MAX_PAGES = 10;

const QUERY = /* GraphQL */ `
  query NavTree($host: String, $locale: [String], $limit: Int, $skip: Int) {
    _Page(
      where: {
        _metadata: {
          status: { eq: "Published" }
          locale: { in: $locale }
          url: { base: { eq: $host } }
        }
      }
      orderBy: { _metadata: { sortOrder: ASC } }
      limit: $limit
      skip: $skip
    ) {
      total
      items {
        _metadata {
          displayName
          sortOrder
          url {
            hierarchical
          }
        }
      }
    }
  }
`;

type GraphPage = {
  _metadata: {
    displayName: string | null;
    sortOrder: number | null;
    url: { hierarchical: string | null } | null;
  };
};

/** "/en/a/b/" or "/a/b/" -> ["a", "b"] (drops the default-locale prefix if present). */
function segmentsOf(path: string, localeSegment: string): string[] {
  const parts = path.split('/').filter(Boolean);
  if (parts[0] && (parts[0] === DEFAULT_LOCALE || parts[0] === localeSegment)) parts.shift();
  return parts;
}

type Flat = { segments: string[]; label: string; sortOrder: number };

function buildTree(pages: GraphPage[], locale: string): NavTree {
  const localeSegment = locale === DEFAULT_LOCALE ? '' : locale;
  const flat: Flat[] = [];
  for (const page of pages) {
    const path = page._metadata.url?.hierarchical;
    if (!path) continue;
    flat.push({
      segments: segmentsOf(path, localeSegment),
      label: page._metadata.displayName?.trim() || path,
      sortOrder: page._metadata.sortOrder ?? 0,
    });
  }

  const hrefOf = (segments: string[]) =>
    localizePath(segments.length ? `/${segments.join('/')}/` : '/', locale);

  const homeEntry = flat.find((f) => f.segments.length === 0);
  const nodes = new Map<string, NavNode & { sortOrder: number }>();
  const key = (segments: string[]) => segments.join('/');

  for (const f of flat) {
    if (f.segments.length === 0) continue;
    nodes.set(key(f.segments), {
      label: f.label,
      href: hrefOf(f.segments),
      children: [],
      sortOrder: f.sortOrder,
    });
  }

  // Attach each page to its nearest published ancestor; orphans (a folder with
  // no page of its own in between) go to the top level.
  const roots: (NavNode & { sortOrder: number })[] = [];
  for (const f of flat) {
    const node = nodes.get(key(f.segments));
    if (!node) continue;
    let parent: (NavNode & { sortOrder: number }) | undefined;
    for (let n = f.segments.length - 1; n > 0 && !parent; n--) {
      parent = nodes.get(key(f.segments.slice(0, n)));
    }
    (parent ? parent.children : roots).push(node);
  }

  const sort = (list: (NavNode & { sortOrder: number })[]): NavNode[] => {
    list.sort((a, b) => a.sortOrder - b.sortOrder || a.label.localeCompare(b.label));
    for (const n of list) sort(n.children as (NavNode & { sortOrder: number })[]);
    return list;
  };

  return {
    home: homeEntry ? { label: homeEntry.label, href: hrefOf([]) } : null,
    items: sort(roots),
  };
}

const fetchNavTree: (host: string | undefined, locale: string) => Promise<NavTree> = unstable_cache(
  async (host: string | undefined, locale: string): Promise<NavTree> => {
    const client = getClient();
    const pages: GraphPage[] = [];
    for (let page = 0; page < MAX_PAGES; page++) {
      const data = (await client.request(QUERY, {
        host,
        locale: [locale],
        limit: PAGE_SIZE,
        skip: page * PAGE_SIZE,
      })) as { _Page?: { total?: number; items?: GraphPage[] } } | undefined;
      pages.push(...(data?._Page?.items ?? []));
      if (pages.length >= (data?._Page?.total ?? 0)) break;
    }
    // Locale not translated yet: show the default-locale tree rather than no nav.
    if (!pages.length && locale !== DEFAULT_LOCALE) return fetchNavTree(host, DEFAULT_LOCALE);
    return buildTree(pages, locale);
  },
  ['nav-tree'],
  { revalidate: REVALIDATE_SECONDS, tags: ['nav-tree'] },
);

/** The nav tree for a locale. Never throws: on a Graph failure the nav is just empty. */
export const getNavTree = cache(async (locale: string = DEFAULT_LOCALE): Promise<NavTree> => {
  try {
    return await fetchNavTree(await siteOrigin(), locale);
  } catch (err) {
    console.error('[navTree] failed to load the content tree', err);
    return { home: null, items: [] };
  }
});
