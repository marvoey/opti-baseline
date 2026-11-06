import LanguageSwitcher from './LanguageSwitcher';
import { siteConfig } from '@/lib/siteConfig';

/** Slim utility row above the floating header (as in the Independent Agent Portal mockup). */
const TopNav = () => (
  <div className="hidden md:block" data-cms-group="Navigation">
    <div className="mx-auto flex max-w-6xl items-center justify-end gap-5 px-6 pt-3 text-xs text-gray-500">
      {siteConfig.topNavLinks.map((link) => (
        <a key={link.label} href={link.href} className="hover:text-navy transition-colors">
          {link.label}
        </a>
      ))}
      <LanguageSwitcher />
    </div>
  </div>
);

export default TopNav;
