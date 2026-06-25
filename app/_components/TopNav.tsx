import { Phone } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { siteConfig } from '@/lib/siteConfig';

const TopNav = () => (
  <div className="bg-blue-950 py-2 hidden md:block" data-cms-group="Navigation">
    <div className="container mx-auto px-4 flex justify-between items-center text-sm text-white/70 font-medium">
      <div className="flex gap-6">
        {siteConfig.topNavLinks.map((link) => (
          <a key={link.label} href={link.href} className="hover:text-white transition-colors">
            {link.label}
          </a>
        ))}
      </div>
      <div className="flex gap-4 items-center">
        <span className="flex items-center gap-1">
          <Phone size={14} className="text-gold" /> {siteConfig.phone}
        </span>
        <LanguageSwitcher />
      </div>
    </div>
  </div>
);

export default TopNav;
