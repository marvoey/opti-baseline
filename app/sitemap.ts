import type { MetadataRoute } from 'next';
import { DEFAULT_LOCALE } from '@/lib/locales';
import { absoluteUrl, getIndexablePages, type SitePage } from '@/lib/seo';
import { requestOrigin } from '@/lib/siteHost';

/**
 * /sitemap.xml, generated from the CMS content tree (see lib/seo.ts): every published,
 * indexable page in every language, so editors never maintain it by hand.
 *
 * Pages that exist in more than one language list each other as hreflang alternates (plus
 * x-default pointing at the default language), the same signals the page <head> carries.
 */
export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const origin = (await requestOrigin())?.origin;
  if (!origin) return [];

  const pages = await getIndexablePages(origin);

  const byKey = new Map<string, SitePage[]>();
  for (const page of pages) byKey.set(page.key, [...(byKey.get(page.key) ?? []), page]);

  return pages.map((page) => {
    const entry: MetadataRoute.Sitemap[number] = { url: absoluteUrl(page.path, origin) };
    if (page.lastModified) entry.lastModified = page.lastModified;

    const siblings = byKey.get(page.key) ?? [];
    if (siblings.length > 1) {
      const languages: Record<string, string> = Object.fromEntries(
        siblings.map((sibling) => [sibling.locale, absoluteUrl(sibling.path, origin)]),
      );
      const fallback = siblings.find((sibling) => sibling.locale === DEFAULT_LOCALE);
      if (fallback) languages['x-default'] = absoluteUrl(fallback.path, origin);
      entry.alternates = { languages };
    }
    return entry;
  });
}
