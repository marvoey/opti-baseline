import LanguageSwitcher from './LanguageSwitcher';
import { siteConfig } from '@/lib/siteConfig';

const TopNav = () => (
  <div className="bg-blue-950 border-b border-white/10 py-2 hidden md:block" data-cms-group="Navigation">
    <div className="container mx-auto px-4 flex justify-between items-center text-xs text-white/60 font-medium tracking-wide">
      <div className="flex gap-6">
        {siteConfig.topNavLinks.map((link) => (
          <a key={link.label} href={link.href} className="hover:text-white transition-colors uppercase tracking-wider">
            {link.label}
          </a>
        ))}
      </div>
      <div className="flex gap-4 items-center">
        <LanguageSwitcher />
      </div>
    </div>
  </div>
);

export default TopNav;
