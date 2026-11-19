import { ArrowRight } from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';
import { siteConfig } from '@/lib/siteConfig';

/**
 * Signature yellow announcement strip (e.g. "Grand Theft Auto VI - Out Now")
 * with the CMS-driven language switcher on the right.
 */
const TopNav = () => {
  const { announcement } = siteConfig;
  return (
    <div className="bg-rs-yellow text-black" data-cms-group="Navigation">
      <div className="container mx-auto flex items-center justify-between gap-4 px-4 py-2 text-sm">
        <a
          href={announcement.href}
          className="group inline-flex items-center gap-2 font-extrabold tracking-tight"
        >
          <span>{announcement.label}</span>
          <span className="rounded-full bg-black px-2.5 py-0.5 text-xs font-bold uppercase tracking-wider text-rs-yellow">
            {announcement.highlight}
          </span>
          <ArrowRight size={14} className="transition-transform group-hover:translate-x-0.5" />
        </a>
        <div className="hidden items-center gap-4 font-semibold md:flex [&_button]:text-black/80 [&_button:hover]:text-black">
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
};

export default TopNav;
