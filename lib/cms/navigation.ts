/**
 * Main navigation, built from the CMS: the PUBLISHED pages that are direct children of
 * the Corel home page (HOME_PAGE_CONTENT_ID). Adding, renaming or reordering a child page
 * in the CMS tree changes the nav — nothing here hard-codes a page.
 *
 * Server-only (uses the Graph client). Order is the CMS tree order (`sortOrder`); ties
 * are broken by creation time so the result is deterministic.
 */

import { getClient } from '@optimizely/cms-sdk';
import { DEFAULT_LOCALE, localizePath, stripLocale } from '@/lib/locales';
import type { NavLink } from '@/lib/siteConfig';

const QUERY = /* GraphQL */ `
  query MainNavPages($container: String) {
    _Page(
      where: { _metadata: { container: { eq: $container }, status: { eq: "Published" } } }
      orderBy: { _metadata: { sortOrder: ASC } }
      limit: 100
    ) {
      items {
        _metadata {
          key
          displayName
          locale
          sortOrder
          created
          url {
            default
          }
        }
      }
    }
  }
`;

type GraphNavItem = {
  _metadata?: {
    key?: string | null;
    displayName?: string | null;
    locale?: string | null;
    sortOrder?: number | null;
    created?: string | null;
    url?: { default?: string | null } | null;
  } | null;
};

const GUID = /^[0-9a-f]{8}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{4}-?[0-9a-f]{12}$/i;
let warned = false;

/** The home page's content key in the 32-hex form Graph uses for `_metadata.container`. */
function homeContainerId(): string | undefined {
  const raw = process.env.HOME_PAGE_CONTENT_ID?.trim();
  if (raw && GUID.test(raw)) return raw.replace(/-/g, '').toLowerCase();
  if (!warned) {
    warned = true;
    console.warn('[nav] HOME_PAGE_CONTENT_ID is missing or not a content-key GUID — the main nav will be empty.');
  }
  return undefined;
}

/**
 * Child pages of the home page as nav links, in CMS order, for `locale`.
 * Pages not translated into `locale` fall back to the default-locale page (the catch-all
 * route does the same). Never throws: on any failure the nav is simply empty.
 */
export async function getMainNav(locale: string = DEFAULT_LOCALE): Promise<NavLink[]> {
  const container = homeContainerId();
  if (!container) return [];

  try {
    const res = await getClient().request(QUERY, { container });
    const items: GraphNavItem[] = (res?.data ?? res)?._Page?.items ?? [];

    // One entry per page: prefer the requested locale, else the default locale.
    const byKey = new Map<string, NonNullable<GraphNavItem['_metadata']>>();
    for (const { _metadata: m } of items) {
      if (!m?.key || !m.displayName || !m.url?.default) continue;
      if (m.locale !== locale && m.locale !== DEFAULT_LOCALE) continue;
      const have = byKey.get(m.key);
      if (!have || (m.locale === locale && have.locale !== locale)) byKey.set(m.key, m);
    }

    return [...byKey.values()]
      .sort(
        (a, b) =>
          (a.sortOrder ?? 0) - (b.sortOrder ?? 0) ||
          (a.created ?? '').localeCompare(b.created ?? '') ||
          (a.displayName ?? '').localeCompare(b.displayName ?? ''),
      )
      .map((m) => ({
        label: m.displayName!,
        // Same rule as the catch-all + LanguageSwitcher: clean path, re-prefixed for the locale.
        href: localizePath(stripLocale(m.url!.default!).cleanPath, locale),
      }));
  } catch (e) {
    console.error('[nav] could not load the main navigation:', e instanceof Error ? e.message : 'unknown error');
    return [];
  }
}
