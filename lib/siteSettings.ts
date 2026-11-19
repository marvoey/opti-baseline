/**
 * Site-wide copy that editors manage in the CMS: the "Site settings" item (content
 * type EhSiteSettings, see cms/EhSiteSettings.tsx). Covers the promo banner, the
 * header phone number and the footer legal line. Footer link columns and legal links
 * still come from lib/siteConfig.ts.
 *
 * Read straight from Optimizely Graph with the shared helper (lib/graph.ts): the item
 * is never part of a page composition, so the SDK has nothing to render. Cached for
 * REVALIDATE_SECONDS and tagged `site-settings`, so `revalidateTag('site-settings')`
 * (for example from a publish webhook) refreshes it on demand.
 *
 * Never throws. With no published item, or if Graph can't be reached, the values in
 * siteConfig are used so the header and footer can't go blank. Once an item exists,
 * a blank banner message hides the banner (the editor's way of switching it off); a
 * blank phone or legal line falls back to siteConfig.
 */
import { cache } from 'react';
import { graphQuery } from '@/lib/graph';
import { DEFAULT_LOCALE } from '@/lib/locales';
import { resolveLocale } from '@/lib/nav';
import { siteConfig } from '@/lib/siteConfig';

export type SiteSettings = {
  /** The magenta strip under the header. Null when it should not be shown. */
  promo: { message: string; linkLabel: string; href: string } | null;
  phone: { label: string; href: string };
  footerLegal: string;
};

type Row = {
  PromoMessage: string | null;
  PromoLinkLabel: string | null;
  PromoLinkUrl: { default: string | null } | null;
  PhoneNumber: string | null;
  FooterLegal: string | null;
  _metadata: { locale: string | null };
};

type SettingsResult = { EhSiteSettings: { items: Row[] } | null };

const REVALIDATE_SECONDS = 60;

// Newest edit first, so if an editor ever publishes a second item the latest one wins.
// The default locale is requested alongside a translated one as the fallback.
const QUERY = `
  query SiteSettings($locales: [String!]) {
    EhSiteSettings(
      where: { _metadata: { status: { eq: "Published" }, locale: { in: $locales } } }
      orderBy: { _metadata: { lastModified: DESC } }
      limit: 5
    ) {
      items {
        PromoMessage
        PromoLinkLabel
        PromoLinkUrl { default }
        PhoneNumber
        FooterLegal
        _metadata { locale }
      }
    }
  }`;

const clean = (value: string | null | undefined) => value?.trim() || null;

/** "(877) 378-1318" -> "tel:+18773781318". US numbers get +1; anything else keeps its digits. */
export function telHref(phone: string): string | null {
  const digits = phone.replace(/\D/g, '');
  if (!digits) return null;
  if (digits.length === 10) return `tel:+1${digits}`;
  if (digits.length === 11 && digits.startsWith('1')) return `tel:+${digits}`;
  return `tel:${digits}`;
}

const FALLBACK: SiteSettings = {
  promo: siteConfig.promoBanner.message
    ? {
        message: siteConfig.promoBanner.message,
        linkLabel: siteConfig.promoBanner.linkLabel,
        href: siteConfig.promoBanner.href,
      }
    : null,
  phone: { label: siteConfig.phone.label, href: siteConfig.phone.href },
  footerLegal: siteConfig.footerLegal,
};

function fromRow(row: Row): SiteSettings {
  const message = clean(row.PromoMessage);
  const phoneLabel = clean(row.PhoneNumber);
  const phoneHref = phoneLabel ? telHref(phoneLabel) : null;

  return {
    promo: message
      ? {
          message,
          linkLabel: clean(row.PromoLinkLabel) ?? '',
          href: clean(row.PromoLinkUrl?.default) ?? siteConfig.promoBanner.href,
        }
      : null,
    phone: phoneLabel && phoneHref ? { label: phoneLabel, href: phoneHref } : FALLBACK.phone,
    footerLegal: clean(row.FooterLegal) ?? FALLBACK.footerLegal,
  };
}

/** React.cache: the header, banner and footer share one lookup per request. */
const load = cache(async (locale: string): Promise<SiteSettings> => {
  try {
    const locales = locale === DEFAULT_LOCALE ? [locale] : [locale, DEFAULT_LOCALE];
    const data = await graphQuery<SettingsResult>(
      QUERY,
      { locales },
      { revalidate: REVALIDATE_SECONDS, tags: ['site-settings'] },
    );
    const items = data.EhSiteSettings?.items ?? [];
    const row =
      items.find((item) => item._metadata.locale === locale) ??
      items.find((item) => item._metadata.locale === DEFAULT_LOCALE) ??
      items[0];
    return row ? fromRow(row) : FALLBACK;
  } catch (error) {
    console.error('[site-settings] Could not read the site settings; using the siteConfig defaults.', error);
    return FALLBACK;
  }
});

/** Site settings for a locale (route param or key). Falls back to siteConfig; never throws. */
export function getSiteSettings(localeParam?: string): Promise<SiteSettings> {
  return load(resolveLocale(localeParam));
}
