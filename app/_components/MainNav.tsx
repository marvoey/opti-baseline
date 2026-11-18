import Link from 'next/link';
import { ChevronDown, Phone } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';
import { getNavTree, type NavItem } from '@/lib/nav';
import SiteLogo from './SiteLogo';
import LanguageSwitcher from './LanguageSwitcher';
import NavMenu from './NavMenu';
import MobileMenu from './MobileMenu';

/** Static fallback, used only when the content tree is empty or Graph is unreachable. */
const fallbackItems: NavItem[] = siteConfig.mainNavLinks.map((link) => ({
  key: link.label,
  label: link.label,
  href: link.href,
  children: [],
}));

/**
 * eHealth-style header: white bar with a thin lime top rule, wordmark on the
 * left, small bold dark-green nav + phone + sign-in on the right.
 *
 * The menu is built from the CMS content tree (lib/nav.ts): children of the
 * container are the menu items, their children the dropdown.
 */
const MainNav = async ({ locale }: { locale?: string }) => {
  const tree = await getNavTree(locale);
  const items = tree.length > 0 ? tree : fallbackItems;

  return (
    <header className="sticky top-0 z-50 border-t-[3px] border-blue-400 bg-white shadow-sm">
      <div className="container mx-auto flex h-16 items-center justify-between px-4">
        <div className="navbar-brand flex items-center" data-cms-field="brand_logo">
          <Link href="/" title="Go to home page" className="flex items-center">
            <SiteLogo />
          </Link>
        </div>

        <div className="flex items-center gap-5 font-display text-[13px] font-semibold text-blue-950 lg:gap-7">
          <NavMenu items={items} />

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

          <MobileMenu items={items} phone={siteConfig.phone} />
        </div>
      </div>
    </header>
  );
};

export default MainNav;
