import SiteChrome from '../_components/SiteChrome';

/**
 * Shell for CMS-delivered pages (the `[[...slug]]` catch-all experience route).
 * Wraps the page body with the shared site chrome (header + footer). The header
 * menu is built from the CMS content tree for the active locale, so the route's
 * locale param is passed down. The same SiteChrome is used by /preview so the
 * editor matches (preview uses the default locale).
 */
export default async function LocaleLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  return <SiteChrome locale={locale}>{children}</SiteChrome>;
}
