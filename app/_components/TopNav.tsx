import LanguageSwitcher from './LanguageSwitcher';
import { siteConfig } from '@/lib/siteConfig';

const TopNav = () => (
  <div className="bg-jh-purple py-2 hidden md:block" data-cms-group="Navigation">
    <div className="container mx-auto px-4 flex justify-between items-center text-sm text-white/80 font-semibold">
      <div className="flex gap-6">
        {siteConfig.topNavLinks.map((link) => (
          <a key={link.label} href={link.href} className="hover:text-jh-teal-light transition-colors">
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
