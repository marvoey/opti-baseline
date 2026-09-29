import SiteChrome from '../_components/SiteChrome';

/**
 * Shell for CMS-delivered pages (the `[[...slug]]` catch-all experience route).
 * Provides the Floor & Decor page frame from app/mock/page.jsx (light neutral
 * canvas, brand selection colour, full-height flex column) and wraps the page
 * body with the shared site chrome (announcement bar, header, footer). The chrome
 * is static; the LanguageSwitcher derives the active locale from the URL, so no
 * locale prop is needed here. The same SiteChrome is used by /preview so the
 * editor matches.
 */
export default function LocaleLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex flex-col flex-1 bg-neutral-100 text-[#1f2937] font-sans antialiased selection:bg-brand-orange selection:text-white">
      <SiteChrome>{children}</SiteChrome>
    </div>
  );
}
