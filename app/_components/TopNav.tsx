import LanguageSwitcher from './LanguageSwitcher';
import { siteConfig } from '@/lib/siteConfig';

/**
 * Thin dark-green brand strip above the main header. The active brand renders as
 * a white tab that merges into the white main nav below. The language switcher
 * (CMS-driven) sits on the left.
 */
const TopNav = () => (
  <div className="bg-blue-950 hidden md:block" data-cms-group="Navigation">
    <div className="container mx-auto px-4 flex justify-between items-stretch h-8 text-xs font-semibold">
      <div className="flex items-center text-white/80">
        <LanguageSwitcher />
      </div>
      <div className="flex items-stretch">
        {siteConfig.topNavLinks.map((link) =>
          link.active ? (
            <a
              key={link.label}
              href={link.href}
              aria-current="page"
              className="flex items-center gap-1.5 bg-white px-4 text-blue-800 tracking-wide"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={siteConfig.logoSrc} alt="" className="h-3.5 w-3.5" />
              {link.label}
            </a>
          ) : (
            <a
              key={link.label}
              href={link.href}
              className="flex items-center px-5 text-white/80 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ),
        )}
      </div>
    </div>
  </div>
);

export default TopNav;
