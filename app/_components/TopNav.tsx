import LanguageSwitcher from './LanguageSwitcher';
import { siteConfig } from '@/lib/siteConfig';

/**
 * Slim utility row above the floating header (as in the Independent Agent Portal
 * mockup). Shown at every size — it holds the language switcher, which phones
 * need too — and wraps rather than overflowing on narrow screens.
 */
const TopNav = () => (
  <div data-cms-group="Navigation">
    <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-end gap-x-5 gap-y-1 px-4 pt-2 text-xs text-gray-500 sm:px-6 lg:pt-3">
      {siteConfig.topNavLinks.map((link) => (
        <a key={link.label} href={link.href} className="py-1 hover:text-navy transition-colors">
          {link.label}
        </a>
      ))}
      <LanguageSwitcher />
    </div>
  </div>
);

export default TopNav;
