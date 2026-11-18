/**
 * Dynamic header navigation, built from the CMS content tree.
 *
 * Direct children of `siteConfig.nav.rootKey` become the menu items and their
 * children become the dropdown (two levels, as the header has room for). Order
 * follows the CMS tree (`_metadata.sortOrder`), labels are the page display
 * names and links are each page's URL, so editors manage the menu by creating,
 * renaming, reordering, publishing or unpublishing pages in the tree.
 *
 * Two Graph queries however many items there are: one for the top level, one
 * for every child of those items. Cached for REVALIDATE_SECONDS and tagged
 * `nav`, so `revalidateTag('nav')` (e.g. from a publish webhook) refreshes it.
 *
 * Uses the shared Graph helper (lib/graph.ts) rather than the SDK client: the SDK
 * only exposes typed content lookups, and this is a metadata-only tree query.
 */
import { graphQuery } from '@/lib/graph';
import { DEFAULT_LOCALE, LOCALES } from '@/lib/locales';
import { siteConfig } from '@/lib/siteConfig';

export type NavItem = {
  key: string;
  label: string;
  href: string;
  children: NavItem[];
};

type PageRow = {
  _metadata: {
    key: string | null;
    displayName: string | null;
    sortOrder: number | null;
    container: string | null;
    url: { default: string | null } | null;
  };
};

type PagesResult = { _Page: { items: PageRow[] } };

const REVALIDATE_SECONDS = 60;
/** Graph's maximum page size. */
const GRAPH_MAX_LIMIT = 100;

const FIELDS = `_metadata { key displayName sortOrder container url { default } }`;

// `_Page` covers experiences and pages but not folders, blocks or media, so
// only real pages appear in the menu. `container` is the parent's key.
const TOP_QUERY = `
  query NavTop($parent: String!, $locale: String!, $limit: Int!) {
    _Page(
      where: { _metadata: { container: { eq: $parent }, status: { eq: "Published" }, locale: { eq: $locale } } }
      orderBy: { _metadata: { sortOrder: ASC } }
      limit: $limit
    ) { items { ${FIELDS} } }
  }`;

const SUB_QUERY = `
  query NavSub($parents: [String!]!, $locale: String!, $limit: Int!) {
    _Page(
      where: { _metadata: { container: { in: $parents }, status: { eq: "Published" }, locale: { eq: $locale } } }
      orderBy: { _metadata: { sortOrder: ASC } }
      limit: $limit
    ) { items { ${FIELDS} } }
  }`;

/** Nav queries share one cache policy: 60s, tagged `nav` for on-demand revalidation. */
const graph = <T>(query: string, variables: Record<string, unknown>) =>
  graphQuery<T>(query, variables, { revalidate: REVALIDATE_SECONDS, tags: ['nav'] });

/** Site-relative path without a trailing slash ("/medicare/" -> "/medicare"). */
function toHref(url: string | null | undefined): string {
  const path = url?.trim();
  if (!path) return '#';
  return path.length > 1 ? path.replace(/\/+$/, '') : path;
}

function toItem(row: PageRow): NavItem | null {
  const { key, displayName, url } = row._metadata;
  const label = displayName?.trim();
  if (!key || !label) return null;
  return { key, label, href: toHref(url?.default), children: [] };
}

/** The route param can be a locale key or a route segment; Graph wants the key. */
function resolveLocale(param?: string): string {
  if (!param) return DEFAULT_LOCALE;
  return LOCALES.find((l) => l.key === param || l.routeSegment === param)?.key ?? DEFAULT_LOCALE;
}

/**
 * Menu tree for a locale. Returns [] if the container has no published pages
 * or Graph can't be reached, so callers can fall back to a static menu.
 */
export async function getNavTree(localeParam?: string): Promise<NavItem[]> {
  const { rootKey, maxItems, maxChildren, excludeKeys } = siteConfig.nav;
  const locale = resolveLocale(localeParam);
  const hidden = new Set<string>(excludeKeys);

  try {
    const top = await graph<PagesResult>(TOP_QUERY, {
      parent: rootKey,
      locale,
      limit: Math.min(GRAPH_MAX_LIMIT, maxItems + hidden.size),
    });

    const seen = new Set<string>();
    const items: NavItem[] = [];
    for (const row of top._Page.items) {
      const item = toItem(row);
      if (!item || hidden.has(item.key) || seen.has(item.key)) continue;
      seen.add(item.key);
      items.push(item);
      if (items.length >= maxItems) break;
    }
    if (items.length === 0) return [];

    const sub = await graph<PagesResult>(SUB_QUERY, {
      parents: items.map((i) => i.key),
      locale,
      limit: Math.min(GRAPH_MAX_LIMIT, items.length * (maxChildren + hidden.size)),
    });

    const byKey = new Map(items.map((i) => [i.key, i]));
    for (const row of sub._Page.items) {
      const parent = byKey.get(row._metadata.container ?? '');
      const child = toItem(row);
      if (!parent || !child || hidden.has(child.key)) continue;
      if (parent.children.length >= maxChildren || parent.children.some((c) => c.key === child.key)) continue;
      parent.children.push(child);
    }
    return items;
  } catch (error) {
    console.error('[nav] Could not build the menu from the content tree; using the static fallback.', error);
    return [];
  }
}
