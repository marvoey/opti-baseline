/**
 * Structured data (schema.org JSON-LD) for every CMS page: one @graph with the
 * Organization, the WebSite, this WebPage and its BreadcrumbList, all linked by @id.
 * (The FAQ block adds its own FAQPage when a page has one, see cms/EhFaq.tsx.)
 *
 * Everything is derived from data the site already has: the company name and phone number
 * (CMS Site settings), the page's Meta Title / Description / image / last-modified date, and
 * the breadcrumb trail from the same content tree that builds the header menu. Nothing here
 * is claimed that the site does not already say: no ratings, no addresses, no social profiles.
 *
 * Never throws: structured data is an enhancement and must not take a page down.
 */
import { publicPath } from '@/lib/locales';
import { getNavTree, type NavItem } from '@/lib/nav';
import { siteConfig } from '@/lib/siteConfig';
import { getSiteSettings } from '@/lib/siteSettings';

type Json = Record<string, unknown>;

export type PageJsonLdInput = {
  /** Origin the page is served from, e.g. https://ehealth.optimoey.com */
  origin: string;
  /** Locale key, e.g. "en" or "es". */
  localeKey: string;
  /** The page's public path (see publicPath in lib/locales.ts). */
  path: string;
  title: string;
  description: string | null;
  ogImage: string | null;
  lastModified: string | null;
  /** The CMS name of the page, used as the last breadcrumb when the menu tree doesn't list it. */
  displayName: string | null;
};

const HOME_LABEL: Record<string, string> = { es: 'Inicio' };

type Crumb = { name: string; path: string };

/** Home > section > page, from the header menu tree (two levels). */
function breadcrumbTrail(input: PageJsonLdInput, tree: NavItem[]): Crumb[] {
  const { localeKey, path } = input;
  const home: Crumb = { name: HOME_LABEL[localeKey] ?? 'Home', path: publicPath('/', localeKey) };
  if (path === home.path) return [home];

  const isThis = (href: string) => href !== '#' && publicPath(href, localeKey) === path;
  for (const top of tree) {
    if (isThis(top.href)) return [home, { name: top.label, path }];
    const child = top.children.find((c) => isThis(c.href));
    if (child) {
      const parent: Crumb[] = top.href === '#' ? [] : [{ name: top.label, path: publicPath(top.href, localeKey) }];
      return [home, ...parent, { name: child.label, path }];
    }
  }
  // Not in the menu (or a deeper page): fall back to Home > this page.
  return [home, { name: input.displayName ?? input.title, path }];
}

/** The JSON-LD document for a page, or null if it could not be built. */
export async function buildPageJsonLd(input: PageJsonLdInput): Promise<Json | null> {
  try {
    const { origin, localeKey, path } = input;
    const abs = (p: string) => new URL(p, origin).toString();

    const [settings, tree] = await Promise.all([getSiteSettings(localeKey), getNavTree(localeKey)]);
    const crumbs = breadcrumbTrail(input, tree);

    const orgId = `${abs('/')}#organization`;
    const siteId = `${abs('/')}#website`;
    const pageUrl = abs(path);
    const pageId = `${pageUrl}#webpage`;
    const crumbsId = `${pageUrl}#breadcrumb`;

    const organization: Json = {
      '@type': 'Organization',
      '@id': orgId,
      name: siteConfig.name,
      legalName: siteConfig.legalName,
      url: abs('/'),
      contactPoint: [
        {
          '@type': 'ContactPoint',
          contactType: 'customer service',
          telephone: settings.phone.href.replace(/^tel:/, ''),
          areaServed: 'US',
        },
      ],
    };

    const website: Json = {
      '@type': 'WebSite',
      '@id': siteId,
      url: abs('/'),
      name: siteConfig.name,
      publisher: { '@id': orgId },
      inLanguage: localeKey,
    };

    const webPage: Json = {
      '@type': 'WebPage',
      '@id': pageId,
      url: pageUrl,
      name: input.title,
      isPartOf: { '@id': siteId },
      inLanguage: localeKey,
      breadcrumb: { '@id': crumbsId },
    };
    if (input.description) webPage.description = input.description;
    if (input.lastModified) webPage.dateModified = input.lastModified;
    if (input.ogImage) webPage.primaryImageOfPage = { '@type': 'ImageObject', url: input.ogImage };

    const breadcrumb: Json = {
      '@type': 'BreadcrumbList',
      '@id': crumbsId,
      itemListElement: crumbs.map((crumb, index) => ({
        '@type': 'ListItem',
        position: index + 1,
        name: crumb.name,
        item: abs(crumb.path),
      })),
    };

    return { '@context': 'https://schema.org', '@graph': [organization, website, webPage, breadcrumb] };
  } catch (error) {
    console.error('[json-ld] Could not build the structured data; rendering the page without it.', error);
    return null;
  }
}
