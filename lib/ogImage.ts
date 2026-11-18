/**
 * Open Graph image for a CMS page.
 *
 * Editors choose the image in the `ogimage` property (a content reference to an
 * image) on a BlankExperience. This returns that image's absolute URL, or null
 * when none is set. On null the caller must leave `openGraph.images` and
 * `twitter.images` OUT of the page metadata entirely, so Next.js falls back to
 * the site-wide default file, app/opengraph-image.png (Next lets any page-level
 * `images` value, even [] or undefined, override that file).
 *
 * Why a separate Graph query: the SDK builds its query from the content types
 * registered in cms/registry.ts, and BlankExperience is the SDK's built-in type,
 * which doesn't declare `ogimage`, so getContentByPath() never returns it. The
 * property itself lives only in the CMS.
 *
 * Never throws: a Graph hiccup must not take the page down. It just means the
 * default image is used.
 */
import { graphQuery } from '@/lib/graph';
import { requestOrigin } from '@/lib/siteHost';

type OgImageResult = {
  BlankExperience: {
    items: Array<{ ogimage: { url: { default: string | null } | null } | null }>;
  } | null;
};

/** Same 60s window as the header nav. `revalidateTag('page-meta')` refreshes it on demand. */
const REVALIDATE_SECONDS = 60;

const QUERY = `
  query PageOgImage($key: String!, $locale: String!) {
    BlankExperience(
      where: { _metadata: { key: { eq: $key }, locale: { eq: $locale }, status: { eq: "Published" } } }
      limit: 1
    ) { items { ogimage { url { default } } } }
  }`;

/**
 * Absolute URL of the page's `ogimage`, or null when the editor hasn't set one
 * (or the page isn't a BlankExperience). `key` and `locale` are the page's
 * `_metadata.key` and `_metadata.locale`.
 */
export async function getOgImageUrl(
  key: string | null | undefined,
  locale: string | null | undefined,
): Promise<string | null> {
  if (!key || !locale) return null;

  try {
    const data = await graphQuery<OgImageResult>(
      QUERY,
      { key, locale },
      { revalidate: REVALIDATE_SECONDS, tags: ['page-meta'] },
    );
    // An unset reference still comes back as { url: { default: null } }.
    const raw = data.BlankExperience?.items?.[0]?.ogimage?.url?.default?.trim();
    if (!raw) return null;

    // Graph returns absolute CMS media URLs; resolve defensively in case one is ever relative.
    return new URL(raw, await requestOrigin()).toString();
  } catch (error) {
    console.error('[og-image] Could not read ogimage; using the default image.', error);
    return null;
  }
}
