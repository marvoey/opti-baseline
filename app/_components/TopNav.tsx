import { Phone } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import type { ChromeLink } from '@/lib/siteConfig';

/**
 * Top utility bar — small links + phone + language switcher. Data comes from the
 * CMS site settings (lib/chrome.ts), passed down by SiteChrome.
 */
const TopNav = ({ links, phone }: { links: ChromeLink[]; phone: string }) => (
  <div className="bg-slate-50 border-b border-slate-200 py-2 hidden md:block" data-cms-group="Navigation">
    <div className="container mx-auto px-4 flex justify-between items-center text-sm text-slate-600 font-medium">
      <div className="flex gap-6">
        {links.map((link) => (
          <a
            key={link.label}
            href={link.href}
            target={link.openInNewTab ? '_blank' : undefined}
            rel={link.openInNewTab ? 'noreferrer noopener' : undefined}
            className="hover:text-blue-900 transition-colors"
          >
            {link.label}
          </a>
        ))}
      </div>
      <div className="flex gap-4 items-center">
        {phone ? (
          <span className="flex items-center gap-1">
            <Phone size={14} className="text-blue-800" /> {phone}
          </span>
        ) : null}
        <LanguageSwitcher />
      </div>
    </div>
  </div>
);

export default TopNav;
