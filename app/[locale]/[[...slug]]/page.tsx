import { cache } from 'react';
import type { Metadata } from 'next';
import { getClient } from '@optimizely/cms-sdk';
import { OptimizelyComponent, withAppContext } from '@optimizely/cms-sdk/react/server';
import { notFound } from 'next/navigation';
import { DEFAULT_LOCALE, findLocale } from '@/lib/locales';
import { siteOrigin } from '@/lib/siteHost';
import { siteConfig } from '@/lib/siteConfig';
import HomePageFallback from '@/app/_components/HomePageFallback';
import { headers } from 'next/headers';
import { decideVariation } from '@/lib/experimentation';

export const dynamic = 'force-dynamic';

type Props = {
  params: Promise<{ locale: string; slug?: string[] }>;
};

/**
 * A variation has its own route segment in the CMS, so Graph serves it at its
 * own URL (e.g. /diy-abandoner/), not at the base page's URL. Look that URL up
 * by content key so the app doesn't depend on how editors name the segment.
 */
async function getVariationPath(
  client: ReturnType<typeof getClient>,
  key: string,
  variation: string,
): Promise<string | undefined> {
  // The value comes from the FX datafile; only allow plain variation names.
  if (!/^[A-Za-z0-9_-]+$/.test(variation)) return undefined;

  const query = /* GraphQL */ `
    query VariationUrl($key: String!) {
      _Content(
        where: { _metadata: { key: { eq: $key }, status: { eq: "Published" } } }
        variation: { include: SOME, value: ["${variation}"], includeOriginal: false }
      ) {
        items { _metadata { url { default } } }
      }
    }
  `;
  const data = await client.request(query, { key });
  return data?._Content?.items?.[0]?._metadata?.url?.default as string | undefined;
}

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
  let path = isDefault ? cleanPath : prefixedPath;

  const client = getClient();
  const host = await siteOrigin();
  let content = await client.getContentByPath(path, { host });

  if (!content?.[0]) {
    path = isDefault ? prefixedPath : cleanPath;
    content = await client.getContentByPath(path, { host });
  }
  const original = content?.[0];
  if (!original) return undefined;

  // Experimentation applies to campaign pages only.
  if ((original as { PageType?: string }).PageType !== 'campaign') return original;

  const h = await headers();
  const visitorId = h.get('x-hrb-visitor');
  if (!visitorId) return original; // for example preview: never personalize

  const decision = await decideVariation({
    id: visitorId,
    segment: h.get('x-hrb-segment') || null,
  });
  console.log('[fx] decision', decision); // remove after testing
  if (decision.variation === 'Original') return original;

  const key = (original as { _metadata?: { key?: string } })._metadata?.key;
  if (!key) return original;

  const variationPath = await getVariationPath(client, key, decision.variation);
  if (!variationPath) return original; // variation isn't published

  const variant = await client.getContentByPath(variationPath, {
    host,
    variation: { include: 'SOME', value: [decision.variation], includeOriginal: false },
  });
  return variant?.[0] ?? original;
});

/** Per-page <title> from the CMS, falling back to the site name. */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug = [] } = await params;
  if (!findLocale(locale)) return { title: siteConfig.title };
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
  // Paths with a dot (e.g. /util/login.aspx) skip the proxy, so `locale` can be any
  // first segment. Only CMS locales are valid.
  if (!findLocale(locale)) notFound();
  const content = await loadContent(locale, slug);

  if (!content) {
    if (slug.length === 0) return <HomePageFallback />;
    notFound();
  }

  return <OptimizelyComponent content={content} />;
}

export default withAppContext(Page);
