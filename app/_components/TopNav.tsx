import { CalendarCheck } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';

/**
 * Magenta promo strip rendered directly under the header (see SiteChrome).
 * Kept as TopNav.tsx so existing imports and the `Navigation` CMS group still
 * resolve; copy comes from siteConfig.promoBanner.
 */
const TopNav = () => (
  <div className="bg-promo text-white" data-cms-group="Navigation">
    <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 px-4 py-1.5 text-center font-display text-xs font-semibold">
      <CalendarCheck size={14} aria-hidden="true" />
      <span>{siteConfig.promoBanner.message}</span>
      <a
        href={siteConfig.promoBanner.href}
        className="font-normal underline underline-offset-2 hover:no-underline"
      >
        {siteConfig.promoBanner.linkLabel}
      </a>
    </div>
  </div>
);

export default TopNav;
