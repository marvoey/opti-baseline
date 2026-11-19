import { cache } from 'react';
import type { Metadata } from 'next';
import { headers } from 'next/headers';
import { getClient } from '@optimizely/cms-sdk';
import { OptimizelyComponent, withAppContext } from '@optimizely/cms-sdk/react/server';
import { notFound } from 'next/navigation';
import { DEFAULT_LOCALE, publicPath } from '@/lib/locales';
import { requestOrigin, siteOrigin } from '@/lib/siteHost';
import { getPageMeta, type PageMeta } from '@/lib/pageMeta';
import { resolveLocale } from '@/lib/nav';
import { buildPageJsonLd } from '@/lib/jsonLd';
import { siteConfig } from '@/lib/siteConfig';
import { HOME_HERO_FLAG, decideCmsVariation, isLikelyBot } from '@/lib/fx';
import { CAMPAIGN_HEADER, VID_HEADER, parseCampaign, parseVid } from '@/lib/visitor';
import HomePageFallback from '@/app/_components/HomePageFallback';
import JsonLd from '@/app/_components/JsonLd';

type Props = {
  params: Promise<{ locale: string; slug?: string[] }>;
};

/**
 * Which CMS (SaaS) content variation of the home page this visitor should see.
 *
 * Feature Experimentation decides (flag `ehealth_home_hero`): campaign audiences
 * first (?utm_campaign=aca -> AcaOep, =t65 -> Turning65), everyone else is split
 * 50/50 between the original and AepSwitcher. The flag variable
 * `cms-saas-content-variation` carries the CMS variation key. Returns null for
 * "default content": no visitor id, a crawler, FX not configured/ready, or the
 * flag serving "Original". React.cache => one decision (and one impression) per
 * request, shared by generateMetadata and the page body.
 */
const resolveHomeVariation = cache(async (): Promise<string | null> => {
  const h = await headers();
  const visitorId = parseVid(h.get(VID_HEADER));
  if (!visitorId || isLikelyBot(h.get('user-agent'))) return null;
  return decideCmsVariation(HOME_HERO_FLAG, {
    id: visitorId,
    campaign: parseCampaign(h.get(CAMPAIGN_HEADER)),
  });
});

/**
 * Graph returns the original AND the requested variation when
 * `includeOriginal` is set. Pick the variation when it came back, otherwise
 * the original, so a missing/unpublished variation never breaks the page.
 * Without a variation request Graph only returns originals (items[0]).
 */
function pickItem<T extends { _metadata?: { variation?: string | null } }>(
  items: T[] | undefined,
  variation: string | null,
): T | undefined {
  if (!items?.length) return undefined;
  if (!variation) return items[0];
  return (
    items.find((item) => item._metadata?.variation === variation) ??
    items.find((item) => !item._metadata?.variation) ??
    items[0]
  );
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
 *
 * Only the default-locale home page is personalised (see resolveHomeVariation).
 * Graph does NOT return content variations unless asked, so every other page
 * behaves exactly as before.
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
  const variation = slug.length === 0 && isDefault ? await resolveHomeVariation() : null;

  const fetchByPath = async (p: string) =>
    pickItem(
      await client.getContentByPath(p, {
        host,
        ...(variation
          ? { variation: { include: 'SOME' as const, value: [variation], includeOriginal: true } }
          : {}),
      }),
      variation,
    );

  let content = await fetchByPath(path);

  if (!content) {
    // Default locale: content under the site start page is indexed clean
    // ("/vb-demo/"), but content elsewhere keeps the locale prefix
    // ("/en/vb-demo/") — try the prefixed form before giving up.
    // Non-default locale: fall back to the default-locale version when this page
    // hasn't been translated/published yet (so it renders instead of 404ing).
    content = await fetchByPath(isDefault ? prefixedPath : cleanPath);
  }
  return content;
});

/** The slice of a CMS page the head and the JSON-LD need (both read it from the SDK result). */
type PageItem = {
  MetaTitle?: string;
  MetaDescription?: string;
  _metadata?: { key?: string; locale?: string; displayName?: string };
};

/**
 * Meta Title is the editor's FULL title (it already carries the brand, e.g.
 * "Dental Insurance Plans | eHealth"), so it is used as-is. Without one, the
 * page name gets the site name appended, and with no page at all the site title.
 */
function pageTitle(item: PageItem | undefined, meta: PageMeta): string {
  const displayName = item?._metadata?.displayName;
  return (
    meta.title ||
    item?.MetaTitle?.trim() ||
    (displayName ? `${displayName} | ${siteConfig.name}` : siteConfig.title)
  );
}

/**
 * Per-page <title>, description, og:image, robots, canonical link and hreflang alternates,
 * falling back to the site defaults: the site title/description from app/layout.tsx, and
 * app/opengraph-image.png.
 *
 * The fields come from the page's own Meta Title, Meta Description, Robots Directives,
 * Canonical URL, Keywords and `ogimage` properties (read in lib/pageMeta.ts, since the SDK
 * doesn't return them for BlankExperience). A `Page (v1)` carries MetaTitle/MetaDescription
 * in the SDK result itself, so those are used when the lookup has nothing.
 */
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { locale, slug = [] } = await params;
  const content = await loadContent(locale, slug);
  const item = content as PageItem | undefined;

  const meta = await getPageMeta(item?._metadata?.key, item?._metadata?.locale);

  const title = pageTitle(item, meta);
  const description = meta.description || item?.MetaDescription?.trim() || undefined;

  // The description keys are only added when there is a value: an explicit
  // `description: undefined` could blank the site-wide default from the root
  // layout instead of inheriting it.
  const metadata: Metadata = {
    title,
    openGraph: { type: 'website', siteName: siteConfig.name, title },
    twitter: { card: 'summary_large_image', title },
  };

  // Canonical link, hreflang alternates, og:url and the Keywords field. Only for a page that
  // exists, so a 404 never advertises a canonical URL. The canonical is the page's own
  // public path (no query string, no trailing slash) unless the editor set a Canonical URL.
  // Relative values resolve against `metadataBase` from the root layout.
  if (item) {
    const localeKey = resolveLocale(locale);
    const ownPath = meta.path ?? publicPath(slug.length ? `/${slug.join('/')}/` : '/', localeKey);
    const canonical = meta.canonical ?? ownPath;
    const alternates: NonNullable<Metadata['alternates']> = { canonical };
    if (meta.languages.length > 1) {
      const languages: Record<string, string> = Object.fromEntries(
        meta.languages.map((l) => [l.locale, l.path]),
      );
      const fallback = meta.languages.find((l) => l.locale === DEFAULT_LOCALE);
      if (fallback) languages['x-default'] = fallback.path;
      alternates.languages = languages;
    }
    metadata.alternates = alternates;
    metadata.openGraph = { ...metadata.openGraph, url: canonical };
    if (meta.keywords) metadata.keywords = meta.keywords;
  }
  if (description) {
    metadata.description = description;
    metadata.openGraph = { ...metadata.openGraph, description };
    metadata.twitter = { ...metadata.twitter, description };
  }

  // The page's Robots Directives field (for example "noindex, nofollow") is honoured,
  // so paid landing pages stay out of search results. Pages that set none are unchanged.
  if (meta.robots) metadata.robots = meta.robots;

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

  // Structured data for the page (Organization, WebSite, WebPage, breadcrumbs). Skipped for
  // pages set to noindex (the paid landing pages) and when the origin is unknown.
  const item = content as PageItem;
  const meta = await getPageMeta(item._metadata?.key, item._metadata?.locale);
  const origin = await requestOrigin();
  const localeKey = resolveLocale(locale);
  const jsonLd =
    origin && meta.robots?.index !== false
      ? await buildPageJsonLd({
          origin: origin.origin,
          localeKey,
          path: meta.path ?? publicPath(slug.length ? `/${slug.join('/')}/` : '/', localeKey),
          title: pageTitle(item, meta),
          description: meta.description || item.MetaDescription?.trim() || null,
          ogImage: meta.ogImage,
          lastModified: meta.lastModified,
          displayName: item._metadata?.displayName ?? null,
        })
      : null;

  return (
    <>
      {jsonLd && <JsonLd data={jsonLd} />}
      <OptimizelyComponent content={content} />
    </>
  );
}

export default withAppContext(Page);
