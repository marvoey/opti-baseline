import TopNav from './TopNav';
import MainNav from './MainNav';
import Footer from './Footer';

/**
 * Shared site chrome — header (TopNav + MainNav) and Footer — wrapped around a
 * page body. Used by BOTH the published CMS route (app/[locale]/layout) and the
 * /preview experience shell so the Visual Builder preview matches the published
 * page. The main nav is built from the CMS content tree for `locale`. `flex-1`
 * lets the body grow so the footer sits at the bottom (the root <body> is
 * `min-h-full flex flex-col`).
 */
export default function SiteChrome({
  children,
  locale,
}: {
  children: React.ReactNode;
  /** Active locale key, for the CMS-driven nav (default locale when omitted). */
  locale?: string;
}) {
  return (
    <>
      <TopNav />
      <MainNav locale={locale} />
      <div className="flex-1 bg-white text-dark-fir">{children}</div>
      <Footer />
    </>
  );
}
