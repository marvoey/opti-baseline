import Link from 'next/link';
import { ChevronDown, Menu, Phone } from 'lucide-react';
import { siteConfig, type NavLink } from '@/lib/siteConfig';
import SiteLogo from './SiteLogo';
import LanguageSwitcher from './LanguageSwitcher';

// Widen the literal config type so the optional `menu` flag is readable on every link.
const navLinks: readonly NavLink[] = siteConfig.mainNavLinks;

/**
 * eHealth-style header: white bar with a thin lime top rule, wordmark on the
 * left, small bold dark-green nav + phone + sign-in on the right.
 */
const MainNav = () => (
  <header className="sticky top-0 z-50 border-t-[3px] border-blue-400 bg-white shadow-sm">
    <div className="container mx-auto flex h-16 items-center justify-between px-4">
      <div className="navbar-brand flex items-center" data-cms-field="brand_logo">
        <Link href="/" title="Go to home page" className="flex items-center">
          <SiteLogo />
        </Link>
      </div>

      <div className="flex items-center gap-5 font-display text-[13px] font-semibold text-blue-950 lg:gap-7">
        <nav className="hidden items-center gap-7 lg:flex">
          {navLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="inline-flex items-center gap-1 transition-colors hover:text-blue-700"
            >
              {link.label}
              {link.menu && <ChevronDown size={14} aria-hidden="true" />}
            </Link>
          ))}
        </nav>

        <a
          href={siteConfig.phone.href}
          className="hidden items-center gap-1.5 transition-colors hover:text-blue-700 sm:inline-flex"
        >
          <Phone size={14} aria-hidden="true" />
          <span>{siteConfig.phone.label}</span>
        </a>

        <LanguageSwitcher />

        <button
          type="button"
          className="hidden items-center gap-1 transition-colors hover:text-blue-700 sm:inline-flex"
        >
          <span>{siteConfig.accountLabel}</span>
          <ChevronDown size={14} aria-hidden="true" />
        </button>

        <button type="button" aria-label="Open menu" className="p-2 lg:hidden">
          <Menu size={22} />
        </button>
      </div>
    </div>
  </header>
);

export default MainNav;
