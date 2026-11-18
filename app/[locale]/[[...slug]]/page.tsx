import { cache } from 'react';
import type { Metadata } from 'next';
import { getClient } from '@optimizely/cms-sdk';
import { OptimizelyComponent, withAppContext } from '@optimizely/cms-sdk/react/server';
import { notFound } from 'next/navigation';
import { DEFAULT_LOCALE } from '@/lib/locales';
import { siteOrigin } from '@/lib/siteHost';
import { getPageMeta } from '@/lib/pageMeta';
import { siteConfig } from '@/lib/siteConfig';
import HomePageFallback from '@/app/_components/HomePageFallback';

type Props = {
  params: Promise<{ locale: string; slug?: string[] }>;
};

/**
 * Resolve a CMS page for the given locale + slug, scoped to this site's host.
 * Wrapped in React.cache so generateMetadata and the page body share ONE Graph
 * round-trip per request instead of fetching twice.
 *
 * The default-locale URL is indexed clean (no locale prefix) once a hostname is
 * configured, e.g. "/vb-demo/". Non-default locales keep their route segment in
 * `url.default` (e.g. "/fr/vb-demo/"), so we fold it back into the Graph path
 * and fall back across the prefixed/clean forms.
 */
const loadContent = cache(async (locale: string, slug: string[]) => {
  const cleanPath = slug.length ? `/${slug.join('/')}/` : '/';
  const isDefault = locale === DEFAULT_LOCALE;
  const prefixedPath = `/${locale}${cleanPath}`;
  const path = isDefault ? cleanPath : prefixedPath;

  const client = getClient();
  // Scope to this site's hostname so a shared root path ("/") resolves to THIS
  // site's page rather than another site indexed at the same path.
  const host = await siteOrigin();
  let content = await client.getContentByPath(path, { host });

  if (!content?.[0]) {
    // Default locale: content under the site start page is indexed clean
    // ("/vb-demo/"), but content elsewhere keeps the locale prefix
    // ("/en/vb-demo/") — try the prefixed form before giving up.
    // Non-default locale: fall back to the default-locale version when this page
    // hasn't been translated/published yet (so it renders instead of 404ing).
    content = await client.getContentByPath(isDefault ? prefixedPath : cleanPath, { host });
  }
  return content?.[0];
});

/**
 * Per-page <title>, description and og:image, falling back to the site defaults:
 * the site title/description from app/layout.tsx, and app/opengraph-image.png.
 *
 * The fields come from the page's own Meta Title, Meta Description and `ogimage`
 * properties (read in lib/pageMeta.ts, since the SDK doesn't return them for
 * BlankExperience). A `Page (v1)` carries MetaTitle/MetaDescription in the SDK
 * result itself, so those are used when the lookup has nothing.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug = [] } = await params;
  const content = await loadContent(locale, slug);
  const item = content as
    | {
        MetaTitle?: string;
        MetaDescription?: string;
        _metadata?: { key?: string; locale?: string; displayName?: string };
      }
    | undefined;

  const meta = await getPageMeta(item?._metadata?.key, item?._metadata?.locale);

  // Meta Title is the editor's FULL title (it already carries the brand, e.g.
  // "Dental Insurance Plans | eHealth"), so it is used as-is. Without one, the
  // page name gets the site name appended, and with no page at all the site title.
  const displayName = item?._metadata?.displayName;
  const title =
    meta.title ||
    item?.MetaTitle?.trim() ||
    (displayName ? `${displayName} | ${siteConfig.name}` : siteConfig.title);
  const description = meta.description || item?.MetaDescription?.trim() || undefined;

  // The description keys are only added when there is a value: an explicit
  // `description: undefined` could blank the site-wide default from the root
  // layout instead of inheriting it.
  const metadata: Metadata = {
    title,
    openGraph: { type: 'website', siteName: siteConfig.name, title },
    twitter: { card: 'summary_large_image', title },
  };
  if (description) {
    metadata.description = description;
    metadata.openGraph = { ...metadata.openGraph, description };
    metadata.twitter = { ...metadata.twitter, description };
  }

  // With no image, `images` must stay OFF the metadata entirely: Next.js lets any
  // page-level `images` value (even [] or undefined) override the default file,
  // app/opengraph-image.png. Everything else above doesn't affect that fallback.
  if (meta.ogImage) {
    const images = [{ url: meta.ogImage, alt: title }];
    metadata.openGraph = { ...metadata.openGraph, images };
    metadata.twitter = { ...metadata.twitter, images };
  }
  return metadata;
}

/**
 * Catch-all for CMS-managed content. `proxy.ts` rewrites clean URLs (/vb-demo)
 * into the locale-prefixed internal route (/en/vb-demo) so `locale` is populated
 * and the Graph path matches what the CMS indexed.
 */
async function Page({ params }: Props) {
  const { locale, slug = [] } = await params;
  const content = await loadContent(locale, slug);

  if (!content) {
    if (slug.length === 0) return <HomePageFallback />;
    notFound();
  }

  return <OptimizelyComponent content={content} />;
}

export default withAppContext(Page);
