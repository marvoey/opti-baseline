import TopNav from './TopNav';
import MainNav from './MainNav';
import SubNav from './SubNav';
import Footer from './Footer';

/**
 * Shared static site chrome - announcement bar (TopNav), header (MainNav),
 * secondary nav (SubNav) and Footer - wrapped around a page body. Used by BOTH
 * the published CMS route (app/[locale]/layout) and the /preview experience
 * shell so the Visual Builder preview matches the published page.
 *
 * The `.rs-site` wrapper scopes the dark brand theme (see app/globals.css) to
 * the public site, leaving /admin on its own light UI. `flex-1` lets the body
 * grow so the footer sits at the bottom (root <body> is `min-h-full flex flex-col`).
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
    <div className="rs-site flex min-h-full flex-1 flex-col">
      <TopNav />
      <MainNav locale={locale} />
      <SubNav />
      <div className="flex-1">{children}</div>
      <Footer />
    </div>
  );
}
