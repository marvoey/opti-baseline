import { cache } from 'react';
import type { Metadata } from 'next';
import { getClient } from '@optimizely/cms-sdk';
import { OptimizelyComponent, withAppContext } from '@optimizely/cms-sdk/react/server';
import { notFound } from 'next/navigation';
import { DEFAULT_LOCALE } from '@/lib/locales';
import { siteOrigin } from '@/lib/siteHost';
import { siteConfig } from '@/lib/siteConfig';

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
  let content;
  try {
    content = await client.getContentByPath(path, { host });

    if (!content?.[0]) {
      // Default locale: content under the site start page is indexed clean
      // ("/vb-demo/"), but content elsewhere keeps the locale prefix
      // ("/en/vb-demo/") — try the prefixed form before giving up.
      // Non-default locale: fall back to the default-locale version when this page
      // hasn't been translated/published yet (so it renders instead of 404ing).
      content = await client.getContentByPath(isDefault ? prefixedPath : cleanPath, { host });
    }
  } catch {
    return undefined;
  }
  return content?.[0];
});

/** Per-page <title> from the CMS, falling back to the site name. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug = [] } = await params;
  const content = await loadContent(locale, slug);
  const item = content as { MetaTitle?: string; _metadata?: { displayName?: string } } | undefined;
  const pageTitle = item?.MetaTitle || item?._metadata?.displayName;
  return {
    title: pageTitle ? `${pageTitle} | ${siteConfig.name}` : siteConfig.title,
  };
}

/**
 * Catch-all for CMS-managed content. `proxy.ts` rewrites clean URLs (/vb-demo)
 * into the locale-prefixed internal route (/en/vb-demo) so `locale` is populated
 * and the Graph path matches what the CMS indexed.
 */
async function Page({ params }: Props) {
  const { locale, slug = [] } = await params;
  const content = await loadContent(locale, slug);
  if (!content) notFound();

  return <OptimizelyComponent content={content} />;
}

export default withAppContext(Page);
