/**
 * Per-page SEO fields that the SDK doesn't return for BlankExperience.
 *
 * The SDK builds its Graph query from the content types registered in
 * cms/registry.ts, and BlankExperience is the SDK's built-in type: it doesn't
 * declare `MetaTitle`, `MetaDescription` or `ogimage` (the editor-facing fields
 * added to it in the CMS), so getContentByPath() never returns them. This reads
 * all of them (plus Robots Directives, Canonical URL and Keywords) in ONE cached
 * Graph query, used by generateMetadata and the JSON-LD in the catch-all.
 *
 * The query asks for every published language of the page, not just the one being
 * rendered, so the same lookup also yields the hreflang alternates.
 *
 * Never throws: a Graph hiccup must not take the page down. Missing values come
 * back as null and the caller falls back to the site defaults (site name for the
 * title, the site description, and app/opengraph-image.png for the image).
 */
import { cache } from 'react';
import { graphQuery } from '@/lib/graph';
import { publicPath } from '@/lib/locales';
import { requestOrigin } from '@/lib/siteHost';

export type PageMeta = {
  /** Editor's full SEO title (already branded, e.g. "Medicare Plans | eHealth"). */
  title: string | null;
  description: string | null;
  /** Comma-separated Keywords field, or null. */
  keywords: string | null;
  /** Absolute URL of the `ogimage` image. */
  ogImage: string | null;
  /** Parsed Robots Directives (for example "noindex, nofollow"), or null when the page sets none. */
  robots: { index: boolean; follow: boolean } | null;
  /** Editor's Canonical URL override (absolute, or a site path), or null to use the page's own URL. */
  canonical: string | null;
  /** This page's own public path in this language (from its Graph URL), or null. */
  path: string | null;
  /** ISO timestamp of the last publish/edit, or null. */
  lastModified: string | null;
  /** Every indexable published language of the page, this one included. */
  languages: { locale: string; path: string }[];
};

const NONE: PageMeta = {
  title: null,
  description: null,
  keywords: null,
  ogImage: null,
  robots: null,
  canonical: null,
  path: null,
  lastModified: null,
  languages: [],
};

type PageMetaRow = {
  MetaTitle: string | null;
  MetaDescription: string | null;
  Keywords: string | null;
  RobotsDirectives: string | null;
  CanonicalUrl: { default: string | null } | null;
  ogimage: { url: { default: string | null } | null } | null;
  _metadata: {
    locale: string | null;
    lastModified: string | null;
    url: { default: string | null } | null;
  };
};

type PageMetaResult = {
  BlankExperience: { items: PageMetaRow[] } | null;
};

/** Same 60s window as the header nav. `revalidateTag('page-meta')` refreshes it on demand. */
const REVALIDATE_SECONDS = 60;

const QUERY = `
  query PageMeta($key: String!) {
    BlankExperience(
      where: { _metadata: { key: { eq: $key }, status: { eq: "Published" } } }
      limit: 20
    ) {
      items {
        MetaTitle MetaDescription Keywords RobotsDirectives
        CanonicalUrl { default }
        ogimage { url { default } }
        _metadata { locale lastModified url { default } }
      }
    }
  }`;

const clean = (value: string | null | undefined) => value?.trim() || null;

/**
 * "noindex, nofollow" -> { index: false, follow: false }. Null when empty. Other
 * directives (max-snippet and so on) are ignored; "none" means noindex + nofollow.
 */
export function parseRobots(value: string | null | undefined): PageMeta['robots'] {
  const tokens = (value ?? '')
    .toLowerCase()
    .split(',')
    .map((token) => token.trim())
    .filter(Boolean);
  if (tokens.length === 0) return null;
  const none = tokens.includes('none');
  return { index: !(none || tokens.includes('noindex')), follow: !(none || tokens.includes('nofollow')) };
}

/**
 * SEO fields for a page. `key` and `locale` are the page's `_metadata.key` and
 * `_metadata.locale`. Returns all-null for anything that isn't a published
 * BlankExperience (e.g. a `Page (v1)`, whose fields the SDK already returns).
 *
 * React.cache: generateMetadata and the page body share one lookup per request.
 */
export const getPageMeta = cache(async function getPageMeta(
  key: string | null | undefined,
  locale: string | null | undefined,
): Promise<PageMeta> {
  if (!key || !locale) return NONE;

  try {
    const data = await graphQuery<PageMetaResult>(
      QUERY,
      { key },
      { revalidate: REVALIDATE_SECONDS, tags: ['page-meta'] },
    );
    const items = data.BlankExperience?.items ?? [];
    const item = items.find((row) => row._metadata.locale === locale);
    if (!item) return NONE;

    // An unset image reference still comes back as { url: { default: null } }.
    const image = clean(item.ogimage?.url?.default);
    const ownUrl = clean(item._metadata.url?.default);

    const languages = items
      .filter((row) => parseRobots(row.RobotsDirectives)?.index !== false)
      .flatMap((row) => {
        const rowLocale = row._metadata.locale;
        const rowUrl = clean(row._metadata.url?.default);
        return rowLocale && rowUrl ? [{ locale: rowLocale, path: publicPath(rowUrl, rowLocale) }] : [];
      });

    return {
      title: clean(item.MetaTitle),
      description: clean(item.MetaDescription),
      keywords: clean(item.Keywords),
      // Graph returns absolute CMS media URLs; resolve defensively in case one is ever relative.
      ogImage: image ? new URL(image, await requestOrigin()).toString() : null,
      robots: parseRobots(item.RobotsDirectives),
      canonical: clean(item.CanonicalUrl?.default),
      path: ownUrl ? publicPath(ownUrl, locale) : null,
      lastModified: clean(item._metadata.lastModified),
      languages,
    };
  } catch (error) {
    console.error('[page-meta] Could not read the page SEO fields; using site defaults.', error);
    return NONE;
  }
});
