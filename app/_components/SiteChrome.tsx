import TopNav from './TopNav';
import MainNav from './MainNav';
import Footer from './Footer';

/**
 * Shared static site chrome — header (TopNav + MainNav) and Footer — wrapped
 * around a page body. Used by BOTH the published CMS route (app/[locale]/layout)
 * and the /preview experience shell so the Visual Builder preview matches the
 * published page. `flex-1` lets the body grow so the footer sits at the bottom
 * (the root <body> is `min-h-full flex flex-col`).
 *
 * `locale` is the CMS locale key (e.g. "es") used to translate the chrome text
 * (lib/chromeText.ts). Omitted = default-locale English.
 */
export default function SiteChrome({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale?: string;
}) {
  return (
    <>
      <TopNav locale={locale} />
      <MainNav locale={locale} />
      <div className="flex-1">{children}</div>
      <Footer locale={locale} />
    </>
  );
}
