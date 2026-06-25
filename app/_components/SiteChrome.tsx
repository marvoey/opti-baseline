import Link from 'next/link';
import { Search, User } from 'lucide-react';
import { getChromeData } from '@/lib/chrome';
import { DEFAULT_LOCALE } from '@/lib/locales';
import TopNav from './TopNav';
import MainNav from './MainNav';
import Footer from './Footer';

/**
 * Shared site chrome — header (TopNav + MainNav) and Footer — wrapped around a
 * page body. Used by BOTH the published CMS route (app/[locale]/layout) and the
 * /preview experience shell so the Visual Builder preview matches the published
 * page. `flex-1` lets the body grow so the footer sits at the bottom (the root
 * <body> is `min-h-full flex flex-col`).
 *
 * Branding, navigation and footer all come from the CMS CibcSiteSettings
 * singleton via lib/chrome.ts (falling back to lib/siteConfig). MainNav is
 * presentational — SiteChrome owns data fetching and passes the logo + actions
 * (CTA / search / account) slots, per the spec (§5.2).
 */
export default async function SiteChrome({
  children,
  locale = DEFAULT_LOCALE,
}: {
  children: React.ReactNode;
  locale?: string;
}) {
  const chrome = await getChromeData(locale);

  const logo = (
    <Link href="/" title="Go to home page" className="header-logo flex items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={chrome.logoSrc} alt={chrome.logoAlt} className="h-9 w-auto" />
    </Link>
  );

  const actions = (
    <>
      <Link
        href={chrome.primaryCta.href}
        className="hidden items-center rounded-full bg-blue-800 px-5 py-2 font-bold text-white transition-colors hover:bg-blue-900 sm:inline-flex"
      >
        {chrome.primaryCta.label}
      </Link>
      <button
        type="button"
        aria-label="Search"
        className="hidden items-center gap-2 rounded-lg px-4 py-2 font-semibold text-slate-700 transition-colors hover:bg-slate-50 md:flex"
      >
        <Search size={20} />
      </button>
      <button
        type="button"
        className="flex items-center gap-2 rounded-full border-2 border-blue-800 px-4 py-2 font-bold text-blue-800 transition-all hover:bg-blue-50"
      >
        <User size={18} />
        <span className="hidden sm:inline">{chrome.accountLabel}</span>
      </button>
    </>
  );

  return (
    <>
      <TopNav links={chrome.topNavLinks} phone={chrome.phone} />
      <MainNav config={chrome.navigation} logo={logo} actions={actions} />
      <div className="flex-1">{children}</div>
      <Footer
        siteName={chrome.siteName}
        tagline={chrome.footerTagline}
        columns={chrome.footerColumns}
        legal={chrome.footerLegal}
        legalLinks={chrome.footerLegalLinks}
      />
    </>
  );
}
