import SiteChrome from '../_components/SiteChrome';
import { LOCALES } from '@/lib/locales';

/**
 * Shell for CMS-delivered pages (the `[[...slug]]` catch-all experience route).
 * Wraps the page body with the shared site chrome (header + footer). The chrome
 * text comes from lib/siteConfig and is translated per route locale
 * (lib/chromeText.ts); the LanguageSwitcher derives the active locale from the
 * URL. The same SiteChrome is used by /preview so the editor matches.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale: segment } = await params;
  // The route param is a URL segment (the default locale is rewritten to
  // "/<default>/…"); translate it back to the CMS locale key.
  const locale = LOCALES.find((l) => l.routeSegment === segment)?.key ?? segment;
  return <SiteChrome locale={locale}>{children}</SiteChrome>;
}
