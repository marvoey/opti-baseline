import LanguageSwitcher from './LanguageSwitcher';
import { siteConfig } from '@/lib/siteConfig';

const TopNav = () => (
  <div className="bg-cream py-2 hidden md:block" data-cms-group="Navigation">
    <div className="page-width flex justify-between items-center text-fine text-ink font-medium">
      <div className="flex gap-6">
        {siteConfig.topNavLinks.map((link) => (
          <a key={link.label} href={link.href} className="underline-offset-4 hover:underline">
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
