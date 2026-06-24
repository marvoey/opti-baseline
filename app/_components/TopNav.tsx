import { Phone } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { siteConfig } from '@/lib/siteConfig';

const TopNav = () => (
  <div className="bg-slate-50 border-b border-slate-200 py-2 hidden md:block" data-cms-group="Navigation">
    <div className="container mx-auto px-4 flex justify-between items-center text-sm text-slate-600 font-medium">
      <div className="flex gap-6">
        {siteConfig.topNavLinks.map((link) => (
          <a key={link.label} href={link.href} className="hover:text-blue-900 transition-colors">
            {link.label}
          </a>
        ))}
      </div>
      <div className="flex gap-4 items-center">
        <span className="flex items-center gap-1">
          <Phone size={14} className="text-blue-800" /> {siteConfig.phone}
        </span>
        <LanguageSwitcher />
      </div>
    </div>
  </div>
);

export default TopNav;
