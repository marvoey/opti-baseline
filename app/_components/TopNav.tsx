import LanguageSwitcher from './LanguageSwitcher';
import { siteConfig } from '@/lib/siteConfig';

/** Optional utility bar above the header. Hidden when siteConfig.topNavLinks is empty. */
const TopNav = () => {
  if (siteConfig.topNavLinks.length === 0) return null;
  return (
    <div className="hidden border-b border-dark-fir/20 bg-neutral-2 py-2 md:block" data-cms-group="Navigation">
      <div className="container mx-auto flex items-center justify-between px-4 text-sm font-medium text-dark-fir">
        <div className="flex gap-6">
          {siteConfig.topNavLinks.map((link) => (
            <a key={link.label} href={link.href} className="hover:underline">
              {link.label}
            </a>
          ))}
        </div>
        <div className="flex items-center gap-4">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
};

export default TopNav;
