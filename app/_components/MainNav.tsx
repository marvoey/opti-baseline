import Link from 'next/link';
import { Search, User, Menu } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';
import LibertyLogo from './LibertyLogo';

/**
 * Liberty Mutual floating header — same markup/nesting and styles as
 * libertymutual.com (#FloatingHeader_lmWrapper__Qjvhn); CSS lives in
 * app/globals.css under `.lmig-FloatingHeader*`.
 */
const MainNav = () => (
  <div className="mx-auto w-full max-w-6xl px-6">
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

            <nav className="lmig-FloatingHeader-nav hidden md:flex" aria-label="Main Navigation">
              <div className="lmig-FloatingHeader-nav-menu text-[15px]">
                {siteConfig.mainNavLinks.map((link) => (
                  <Link key={link.label} href={link.href}>
                    {link.label}
                  </Link>
                ))}
              </div>
            </nav>

            <div className="lmig-FloatingHeader-actions ml-auto">
              <button type="button" className="hidden sm:flex items-center gap-2">
                <Search size={16} aria-hidden="true" />
                {siteConfig.searchLabel}
              </button>
              <button type="button" className="hidden sm:flex items-center gap-2">
                <User size={16} aria-hidden="true" />
                {siteConfig.accountLabel}
              </button>
              <button type="button" aria-label="Menu" className="flex md:hidden">
                <Menu size={22} aria-hidden="true" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </header>
  </div>
);

export default MainNav;
