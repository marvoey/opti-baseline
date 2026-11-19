import { CalendarCheck } from 'lucide-react';
import { getSiteSettings } from '@/lib/siteSettings';

/**
 * Magenta promo strip rendered directly under the header (see SiteChrome).
 * Kept as TopNav.tsx so existing imports and the `Navigation` CMS group still
 * resolve. The copy comes from the CMS "Site settings" item (lib/siteSettings.ts):
 * a blank message hides the strip, a blank link label drops the link.
 */
const TopNav = async ({ locale }: { locale?: string }) => {
  const { promo } = await getSiteSettings(locale);
  if (!promo) return null;

  return (
    <div className="bg-promo text-white" data-cms-group="Navigation">
      <div className="container mx-auto flex flex-wrap items-center justify-center gap-x-2 gap-y-0.5 px-4 py-1.5 text-center font-display text-xs font-semibold">
        <CalendarCheck size={14} aria-hidden="true" />
        <span>{promo.message}</span>
        {promo.linkLabel && (
          <a href={promo.href} className="font-normal underline underline-offset-2 hover:no-underline">
            {promo.linkLabel}
          </a>
        )}
      </div>
    </div>
  );
};

export default TopNav;
