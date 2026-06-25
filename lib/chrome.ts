import { cache } from 'react';
import { getClient } from '@optimizely/cms-sdk';
import { siteConfig, type ChromeLink, type FooterColumn } from './siteConfig';
import type {
  ColumnLayout,
  FeaturedNavCard,
  NavItem,
  NavigationConfig,
  VisibilityRule,
} from './navigation';

/**
 * Site chrome data layer.
 *
 * Reads the CibcSiteSettings singleton (branding + navigation + footer) from
 * Optimizely Graph and maps it into a presentational ChromeData shape consumed
 * by TopNav / MainNav / Footer. Every field falls back to lib/siteConfig when
 * the CMS leaves it empty, so the site always renders. Server-only.
 *
 * Why a hand-written query (not getContentByPath): the chrome is a by-TYPE
 * singleton, not a routable page, so we query the type directly and don't couple
 * the chrome to an editor-editable URL slug. The query mirrors the registered
 * CibcSiteSettings shape (cms/CibcSiteSettings.tsx + cms/navigation.tsx).
 */

export interface ChromeData {
  siteName: string;
  logoSrc: string;
  logoAlt: string;
  phone: string;
  accountLabel: string;
  primaryCta: ChromeLink;
  topNavLinks: ChromeLink[];
  navigation: NavigationConfig;
  footerTagline: string;
  footerColumns: FooterColumn[];
  footerLegal: string;
  footerLegalLinks: ChromeLink[];
}

// ── Graph shapes (only the fields we select) ────────────────────────────────
type GqlUrl = { default?: string | null } | null;
type GqlLink = {
  text?: string | null;
  title?: string | null;
  target?: string | null;
  url?: GqlUrl;
} | null;
type GqlRule = { Condition?: string | null; Roles?: (string | null)[] | null };
type GqlFeatured = {
  Tag?: string | null;
  Heading?: string | null;
  Description?: string | null;
  ImageAlt?: string | null;
  ImageUrl?: GqlUrl;
  Image?: { url?: GqlUrl } | null;
  Cta?: GqlLink;
} | null;
type GqlChild = {
  Label?: string | null;
  Icon?: string | null;
  Description?: string | null;
  Link?: GqlLink;
  VisibilityRules?: GqlRule[] | null;
};
type GqlMenuItem = GqlChild & {
  ColumnLayout?: string | null;
  FeaturedItem?: GqlFeatured;
  Children?: GqlChild[] | null;
};
type GqlSettings = {
  SiteName?: string | null;
  LogoUrl?: GqlUrl;
  LogoImage?: { url?: GqlUrl } | null;
  Phone?: string | null;
  AccountLabel?: string | null;
  PrimaryCta?: GqlLink;
  TopNavLinks?: GqlLink[] | null;
  MainNav?: GqlMenuItem[] | null;
  FooterTagline?: string | null;
  FooterColumns?: { Heading?: string | null; Links?: GqlLink[] | null }[] | null;
  FooterLegal?: string | null;
  FooterLegalLinks?: GqlLink[] | null;
};

const SETTINGS_QUERY = /* GraphQL */ `
  query SiteChrome($locale: [Locales!]) {
    CibcSiteSettings(
      locale: $locale
      limit: 1
      where: { _metadata: { status: { eq: "Published" } } }
      orderBy: { _metadata: { published: DESC } }
    ) {
      items {
        SiteName
        LogoUrl { default }
        LogoImage { url { default } }
        Phone
        AccountLabel
        PrimaryCta { text title target url { default } }
        TopNavLinks { text title target url { default } }
        MainNav {
          Label
          Icon
          Description
          ColumnLayout
          Link { text title target url { default } }
          FeaturedItem {
            Tag Heading Description ImageAlt
            ImageUrl { default }
            Image { url { default } }
            Cta { text title target url { default } }
          }
          VisibilityRules { Condition Roles }
          Children {
            Label
            Icon
            Description
            Link { text title target url { default } }
            VisibilityRules { Condition Roles }
          }
        }
        FooterTagline
        FooterColumns { Heading Links { text title target url { default } } }
        FooterLegal
        FooterLegalLinks { text title target url { default } }
      }
    }
  }
`;

const isNonEmpty = (s: string | null | undefined): s is string => !!s && s.trim().length > 0;
const slug = (s: string) =>
  s.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '') || 'item';

/** Map a CMS link to a ChromeLink, or null when it has no usable destination. */
function toChromeLink(link: GqlLink | undefined): ChromeLink | null {
  const href = link?.url?.default ?? undefined;
  const label = link?.text || link?.title || '';
  if (!isNonEmpty(href)) return null;
  return { label: label || href, href, openInNewTab: link?.target === '_blank' };
}

function toChromeLinks(links: GqlLink[] | null | undefined): ChromeLink[] {
  return (links ?? []).map(toChromeLink).filter((l): l is ChromeLink => l !== null);
}

function toRules(rules: GqlRule[] | null | undefined): VisibilityRule[] | null {
  const mapped = (rules ?? [])
    .filter((r) => r?.Condition === 'authenticated' || r?.Condition === 'role')
    .map((r) => ({
      condition: r.Condition as VisibilityRule['condition'],
      roles: (r.Roles ?? []).filter(isNonEmpty),
    }));
  return mapped.length ? mapped : null;
}

function toFeatured(f: GqlFeatured | undefined, idBase: string): FeaturedNavCard | null {
  if (!f || !isNonEmpty(f.Heading)) return null;
  const url = f.Cta?.url?.default ?? undefined;
  if (!isNonEmpty(url)) return null;
  const imageUrl = f.ImageUrl?.default || f.Image?.url?.default || null;
  return {
    id: `${idBase}-featured`,
    tag: f.Tag ?? null,
    heading: f.Heading,
    description: f.Description ?? null,
    imageUrl,
    imageAlt: f.ImageAlt ?? undefined,
    url,
    ctaLabel: f.Cta?.text || f.Cta?.title || 'Learn more',
  };
}

function toChildItem(c: GqlChild, id: string): NavItem | null {
  if (!isNonEmpty(c?.Label)) return null;
  return {
    id,
    label: c.Label,
    url: c.Link?.url?.default ?? null,
    openInNewTab: c.Link?.target === '_blank',
    icon: c.Icon ?? null,
    description: c.Description ?? null,
    visibilityRules: toRules(c.VisibilityRules),
    children: [],
  };
}

function toMenuItem(m: GqlMenuItem, index: number): NavItem | null {
  if (!isNonEmpty(m?.Label)) return null;
  const id = `nav-${slug(m.Label)}-${index}`;
  const layout = (['single', 'cols2', 'cols3', 'mega'] as ColumnLayout[]).includes(
    m.ColumnLayout as ColumnLayout,
  )
    ? (m.ColumnLayout as ColumnLayout)
    : 'single';
  const children = (m.Children ?? [])
    .map((c, i) => toChildItem(c, `${id}-child-${i}`))
    .filter((c): c is NavItem => c !== null);
  return {
    id,
    label: m.Label,
    url: m.Link?.url?.default ?? null,
    openInNewTab: m.Link?.target === '_blank',
    icon: m.Icon ?? null,
    description: m.Description ?? null,
    columnLayout: layout,
    featuredItem: toFeatured(m.FeaturedItem, id),
    visibilityRules: toRules(m.VisibilityRules),
    children,
  };
}

/** Build ChromeData from a CMS settings record, falling back per-field to siteConfig. */
function mapSettings(s: GqlSettings | undefined, locale: string): ChromeData {
  const navItems = (s?.MainNav ?? [])
    .map(toMenuItem)
    .filter((i): i is NavItem => i !== null);

  const topNav = toChromeLinks(s?.TopNavLinks);
  const footerColumns = (s?.FooterColumns ?? [])
    .filter((c) => isNonEmpty(c?.Heading))
    .map((c) => ({ heading: c.Heading as string, links: toChromeLinks(c.Links) }));
  const legalLinks = toChromeLinks(s?.FooterLegalLinks);
  const cta = toChromeLink(s?.PrimaryCta);
  const logoSrc = s?.LogoUrl?.default || s?.LogoImage?.url?.default || siteConfig.logoSrc;
  const siteName = s?.SiteName || siteConfig.name;

  return {
    siteName,
    logoSrc,
    logoAlt: siteName,
    phone: s?.Phone || siteConfig.phone,
    accountLabel: s?.AccountLabel || siteConfig.accountLabel,
    primaryCta: cta ?? siteConfig.primaryCta,
    topNavLinks: topNav.length ? topNav : [...siteConfig.topNavLinks],
    navigation: navItems.length
      ? { id: 'main-nav', label: 'Main navigation', locale, items: navItems }
      : { ...siteConfig.navigation, locale },
    footerTagline: s?.FooterTagline || siteConfig.footerTagline,
    footerColumns: footerColumns.length ? footerColumns : siteConfig.footerColumns.map((c) => ({
      heading: c.heading,
      links: [...c.links],
    })),
    footerLegal: s?.FooterLegal || siteConfig.footerLegal,
    footerLegalLinks: legalLinks.length ? legalLinks : [...siteConfig.footerLegalLinks],
  };
}

/** Fallback chrome built entirely from siteConfig (used when the CMS fetch fails). */
function fallbackChrome(locale: string): ChromeData {
  return mapSettings(undefined, locale);
}

/**
 * Fetch + map the site chrome for a locale. Cached per request (React.cache) so
 * the layout and any other caller share one Graph round-trip. Never throws —
 * on any error it returns the siteConfig-derived fallback.
 */
export const getChromeData = cache(async (locale: string): Promise<ChromeData> => {
  try {
    const data = (await getClient().request(SETTINGS_QUERY, { locale: [locale] })) as {
      CibcSiteSettings?: { items?: GqlSettings[] };
    };
    const settings = data?.CibcSiteSettings?.items?.[0];
    return mapSettings(settings, locale);
  } catch (err) {
    console.error('[chrome] failed to load CibcSiteSettings; using siteConfig fallback:', err);
    return fallbackChrome(locale);
  }
});
