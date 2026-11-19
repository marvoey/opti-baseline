import SiteChrome from '../_components/SiteChrome';

/**
 * Shell for CMS-delivered pages (the `[[...slug]]` catch-all experience route).
 * Wraps the page body with the shared site chrome (header + footer). The chrome
 * itself is driven by lib/siteConfig, except the main nav, which is built from
 * the CMS content tree for the active locale. The same SiteChrome is used by
 * /preview so the editor matches.
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
