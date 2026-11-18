import TopNav from './TopNav';
import MainNav from './MainNav';
import Footer from './Footer';

/**
 * Shared static site chrome - header (MainNav + promo strip) and Footer -
 * wrapped around a page body. Used by BOTH the published CMS route
 * (app/[locale]/layout) and the /preview experience shell so the Visual Builder
 * preview matches the published page. `flex-1` lets the body grow so the footer
 * sits at the bottom (the root <body> is `min-h-full flex flex-col`).
 *
 * Order matches eHealth.com: sticky white header first, then the magenta promo
 * strip (TopNav) scrolls away beneath it.
 */
export default function SiteChrome({
  children,
  locale,
}: {
  children: React.ReactNode;
  /** Active locale (route param); drives the content-tree menu. Defaults to the default locale. */
  locale?: string;
}) {
  return (
    <>
      <MainNav locale={locale} />
      <TopNav />
      <div className="flex-1">{children}</div>
      <Footer />
    </>
  );
}
