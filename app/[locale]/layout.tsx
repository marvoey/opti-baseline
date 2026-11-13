import SiteChrome from '../_components/SiteChrome';

/**
 * Shell for CMS-delivered pages (the `[[...slug]]` catch-all experience route).
 * Wraps the page body with the shared site chrome (header + footer). The header nav is
 * loaded from the CMS (child pages of the home page) for this route's locale; the
 * LanguageSwitcher derives the active locale from the URL. The same SiteChrome is used
 * by /preview so the editor matches.
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
