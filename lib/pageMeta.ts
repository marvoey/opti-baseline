/**
 * Per-page SEO fields that the SDK doesn't return for BlankExperience.
 *
 * The SDK builds its Graph query from the content types registered in
 * cms/registry.ts, and BlankExperience is the SDK's built-in type: it doesn't
 * declare `MetaTitle`, `MetaDescription` or `ogimage` (the editor-facing fields
 * added to it in the CMS), so getContentByPath() never returns them. This reads
 * all three in ONE cached Graph query, used by generateMetadata in the catch-all.
 *
 * Never throws: a Graph hiccup must not take the page down. Missing values come
 * back as null and the caller falls back to the site defaults (site name for the
 * title, the site description, and app/opengraph-image.png for the image).
 */
import { graphQuery } from '@/lib/graph';
import { requestOrigin } from '@/lib/siteHost';

export type PageMeta = {
  /** Editor's full SEO title (already branded, e.g. "Medicare Plans | eHealth"). */
  title: string | null;
  description: string | null;
  /** Absolute URL of the `ogimage` image. */
  ogImage: string | null;
};

const NONE: PageMeta = { title: null, description: null, ogImage: null };

type PageMetaResult = {
  BlankExperience: {
    items: Array<{
      MetaTitle: string | null;
      MetaDescription: string | null;
      ogimage: { url: { default: string | null } | null } | null;
    }>;
  } | null;
};

/** Same 60s window as the header nav. `revalidateTag('page-meta')` refreshes it on demand. */
const REVALIDATE_SECONDS = 60;

const QUERY = `
  query PageMeta($key: String!, $locale: String!) {
    BlankExperience(
      where: { _metadata: { key: { eq: $key }, locale: { eq: $locale }, status: { eq: "Published" } } }
      limit: 1
    ) { items { MetaTitle MetaDescription ogimage { url { default } } } }
  }`;

const clean = (value: string | null | undefined) => value?.trim() || null;

/**
 * SEO fields for a page. `key` and `locale` are the page's `_metadata.key` and
 * `_metadata.locale`. Returns all-null for anything that isn't a published
 * BlankExperience (e.g. a `Page (v1)`, whose fields the SDK already returns).
 */
export async function getPageMeta(
  key: string | null | undefined,
  locale: string | null | undefined,
): Promise<PageMeta> {
  if (!key || !locale) return NONE;

  try {
    const data = await graphQuery<PageMetaResult>(
      QUERY,
      { key, locale },
      { revalidate: REVALIDATE_SECONDS, tags: ['page-meta'] },
    );
    const item = data.BlankExperience?.items?.[0];
    if (!item) return NONE;

    // An unset image reference still comes back as { url: { default: null } }.
    const image = clean(item.ogimage?.url?.default);
    return {
      title: clean(item.MetaTitle),
      description: clean(item.MetaDescription),
      // Graph returns absolute CMS media URLs; resolve defensively in case one is ever relative.
      ogImage: image ? new URL(image, await requestOrigin()).toString() : null,
    };
  } catch (error) {
    console.error('[page-meta] Could not read the page SEO fields; using site defaults.', error);
    return NONE;
  }
}
