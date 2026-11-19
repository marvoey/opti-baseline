import { headers } from 'next/headers';
import SiteChrome from '../_components/SiteChrome';
import LandingChrome from '../_components/LandingChrome';
import { CHROME_HEADER, LANDING_CHROME } from '@/lib/landing';

/**
 * Shell for CMS-delivered pages (the `[[...slug]]` catch-all experience route).
 * Wraps the page body with the shared site chrome (header + footer). The header
 * menu is built from the CMS content tree for the active locale, so the route's
 * locale param is passed down. The same SiteChrome is used by /preview so the
 * editor matches (preview uses the default locale).
 *
 * Paid landing pages (/lp/...) get the minimal LandingChrome instead. proxy.ts
 * marks those requests, because a layout cannot see the URL path itself.
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  const landing = (await headers()).get(CHROME_HEADER) === LANDING_CHROME;

  if (landing) return <LandingChrome locale={locale}>{children}</LandingChrome>;
  return <SiteChrome locale={locale}>{children}</SiteChrome>;
}
