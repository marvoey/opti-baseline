/**
 * Main navigation built from the CMS: the direct children of the container page
 * (the home page, `HOME_PAGE_CONTENT_ID`), ordered by their CMS sort order and
 * labelled with each page's display name. Add, rename, reorder or unpublish a
 * child page in the CMS and the header follows.
 *
 * Falls back to the static `siteConfig.mainNavLinks` when the container isn't
 * configured, has no children, or Graph is unreachable — so the header never
 * renders empty.
 */
import { getClient } from '@optimizely/cms-sdk';
import { DEFAULT_LOCALE, findLocale, localizePath } from './locales';
import { siteConfig, type NavLink } from './siteConfig';

type ChildMeta = {
  key: string;
  sortOrder?: number;
  displayName?: string;
  url?: { hierarchical?: string; default?: string };
};

const TTL_MS = 60_000;
const memo = new Map<string, { at: number; links: NavLink[] }>();

/** Graph content keys are GUIDs without dashes; `.env` values often have them. */
const normalizeKey = (id: string) => id.replace(/-/g, '').toLowerCase();

const pathOf = (m: ChildMeta) => m.url?.hierarchical || m.url?.default || null;

const LOCALIZED_QUERY = `
query NavLocalized($keys: [String!], $locale: [Locales]) {
  _Content(where: { _metadata: { key: { in: $keys } } }, locale: $locale) {
    items { _metadata { key displayName } }
  }
}`;

async function fetchLinks(locale: string): Promise<NavLink[]> {
  const containerId = process.env.HOME_PAGE_CONTENT_ID?.trim();
  if (!containerId) return [];

  const client = getClient();
  // The container is read in the default locale: a page that isn't translated yet
  // would otherwise return nothing for the whole nav.
  const children = (await client.getItems({ key: normalizeKey(containerId) })) ?? [];
  const pages: ChildMeta[] = [];
  for (const child of children) {
    const m = child._metadata;
    if (m?.displayName && pathOf(m)) pages.push(m);
  }
  pages.sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0));

  // For other locales, use a child's translated name and localized URL when the
  // page has a version in that locale; otherwise link to the default-locale page.
  const translated = new Map<string, string>();
  if (locale !== DEFAULT_LOCALE && pages.length) {
    const data = await client.request(LOCALIZED_QUERY, {
      keys: pages.map((p) => p.key),
      locale: [locale],
    });
    for (const item of data?._Content?.items ?? []) {
      const m = item?._metadata;
      if (m?.key && m.displayName) translated.set(m.key, m.displayName);
    }
  }

  return pages.map((p) => {
    const name = translated.get(p.key);
    return name
      ? { label: name, href: localizePath(pathOf(p)!, locale) }
      : { label: p.displayName!, href: pathOf(p)! };
  });
}

/** Main-nav links for a CMS locale key (defaults to the default locale). */
export async function getMainNavLinks(requested: string = DEFAULT_LOCALE): Promise<NavLink[]> {
  // Never send an unknown locale to Graph: it rejects values outside its Locales enum.
  const locale = findLocale(requested) ? requested : DEFAULT_LOCALE;
  const hit = memo.get(locale);
  if (hit && Date.now() - hit.at < TTL_MS) return hit.links;

  let links: NavLink[] = [];
  try {
    links = await fetchLinks(locale);
  } catch (err) {
    console.warn('[mainNav] could not load child pages from the CMS, using static links:', err);
  }

  const result = links.length ? links : [...siteConfig.mainNavLinks];
  // Don't pin a fallback for a full minute: retry the CMS on the next request.
  if (links.length) memo.set(locale, { at: Date.now(), links: result });
  return result;
}
