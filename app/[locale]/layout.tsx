import SiteChrome from '../_components/SiteChrome';

/**
 * Shell for CMS-delivered pages (the `[[...slug]]` catch-all experience route).
 * Wraps the page body with the shared site chrome (header + footer). SiteChrome
 * itself picks which header/footer to render based on the resolved theme
 * (lib/theme.ts); the LanguageSwitcher derives the active locale from the URL,
 * so no locale prop is needed here. The same SiteChrome is used by /preview so
 * the editor matches.
 */
export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <SiteChrome>{children}</SiteChrome>;
}
