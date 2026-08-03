import { Phone } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { siteConfig } from '@/lib/siteConfig';

const TopNav = () => (
  <div className="bg-white border-b border-gray-100 py-1.5 hidden md:block" data-cms-group="Navigation">
    <div className="container mx-auto px-4 flex justify-between items-center text-xs text-gray-500 font-medium">
      <div className="flex gap-6">
        {siteConfig.topNavLinks.map((link) => (
          <a key={link.label} href={link.href} className="hover:text-gray-900 transition-colors">
            {link.label}
          </a>
        ))}
      </div>
      <div className="flex gap-5 items-center">
        <a
          href={`tel:${siteConfig.phone}`}
          className="flex items-center gap-1.5 hover:text-gray-900 transition-colors"
        >
          <Phone size={13} className="text-blue-700" />
          {siteConfig.phone}
        </a>
        <a href="#" className="font-semibold text-blue-800 hover:text-blue-600 transition-colors">
          {siteConfig.accountLabel}
        </a>
        <LanguageSwitcher />
      </div>
    </div>
  </div>
);

export default TopNav;
