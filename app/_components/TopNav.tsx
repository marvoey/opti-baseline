import { siteConfig } from '@/lib/siteConfig';
import { localizeHref } from '@/lib/chromeText';

/**
 * Thin dark-green brand strip above the main header. The active brand renders as
 * a white tab that merges into the white main nav below. (The language switcher
 * lives in MainNav so it stays visible on small screens.)
 */
const TopNav = ({ locale }: { locale?: string }) => (
  <div className="bg-blue-950 hidden md:block" data-cms-group="Navigation">
    <div className="container mx-auto px-4 flex justify-end items-stretch h-8 text-xs font-semibold">
      <div className="flex items-stretch">
        {siteConfig.topNavLinks.map((link) =>
          link.active ? (
            <a
              key={link.label}
              href={localizeHref(link.href, locale)}
              aria-current="page"
              className="flex items-center gap-1.5 bg-white px-4 text-blue-800 tracking-wide"
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={siteConfig.logoSrc} alt="" className="h-3.5 w-3.5" />
              {link.label}
            </a>
          ) : (
            <a
              key={link.label}
              href={localizeHref(link.href, locale)}
              className="flex items-center px-5 text-white/80 hover:text-white transition-colors"
            >
              {link.label}
            </a>
          ),
        )}
      </div>
    </div>
  </div>
);

export default TopNav;
