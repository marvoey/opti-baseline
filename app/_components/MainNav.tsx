import Link from 'next/link';
import { Search, User } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';
import LibertyLogo from './LibertyLogo';
import MobileMenu from './MobileMenu';

/**
 * Liberty Mutual floating header — same markup/nesting and styles as
 * libertymutual.com (#FloatingHeader_lmWrapper__Qjvhn); CSS lives in
 * app/globals.css under `.lmig-FloatingHeader*`.
 *
 * Mobile-first: phones get the compact bar with icon-only actions and a hamburger
 * menu (<MobileMenu>); the inline nav and the action labels are added by the
 * breakpoints in globals.css, not hidden with Tailwind utilities.
 */
const MainNav = () => (
  <div className="mx-auto w-full max-w-6xl px-4 sm:px-6">
    <header
      id="FloatingHeader_lmWrapper__Qjvhn"
      className="lmig-FloatingHeader jsx-1677250985 lmig-FloatingHeader--liberty lmig-FloatingHeader--isSticky"
    >
      <div className="lm-Row lm-Row--main lm-Row--start lm-Row--stretch">
        <div className="lm-Col lm-Col--base-12">
          <div className="lmig-FloatingHeader-inner lmig-FloatingHeader-inner--liberty">
            <Link
              href="/"
              title="Go to home page"
              data-cms-field="brand_logo"
              className="lmig-FloatingHeader-brand lmig-FloatingHeader-brand--liberty"
            >
              <LibertyLogo className="lmig-FloatingHeader-brand-logo lmig-FloatingHeader-brand-logo--liberty" />
            </Link>

            <nav className="lmig-FloatingHeader-nav" aria-label="Main Navigation">
              <div className="lmig-FloatingHeader-nav-menu text-[15px]">
                {siteConfig.mainNavLinks.map((link) => (
                  <Link key={link.label} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="lmig-FloatingHeader-actions">
              <button type="button" aria-label={siteConfig.searchLabel}>
                <Search size={16} aria-hidden="true" />
                <span className="lmig-FloatingHeader-label">{siteConfig.searchLabel}</span>
              </button>
              <button type="button" aria-label={siteConfig.accountLabel}>
                <User size={16} aria-hidden="true" />
                <span className="lmig-FloatingHeader-label">{siteConfig.accountLabel}</span>
              </button>
            </div>

            <MobileMenu links={siteConfig.mainNavLinks} />
          </div>
        </div>
      </div>
    </header>
  </div>
);

export default MainNav;
