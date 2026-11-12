import ChromeLink from './ChromeLink';
import LanguageSwitcher from './LanguageSwitcher';
import { siteConfig } from '@/lib/siteConfig';
import { LOCALES } from '@/lib/locales';

const Footer = () => (
  <footer className="bg-ink text-gray-300" data-cms-group="Footer">
    <div className="site-container grid gap-10 py-14 lg:grid-cols-12">
      <div className="space-y-6 lg:col-span-3">
        <ChromeLink href="/" title="Go to home page">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={siteConfig.footerLogoSrc} alt={siteConfig.logoAlt} className="h-7 w-auto" />
        </ChromeLink>
        <ul className="flex gap-3">
          {siteConfig.social.map((s) => (
            <li key={s.label}>
              <ChromeLink
                href={s.href}
                aria-label={s.label}
                className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 text-sm font-bold text-white hover:bg-brand"
              >
                {s.glyph}
              </ChromeLink>
            </li>
          ))}
        </ul>
        <p className="text-sm text-gray-500">{siteConfig.footerLegal}</p>
      </div>

      <div className="grid grid-cols-2 gap-8 md:grid-cols-4 lg:col-span-9">
        {siteConfig.footerColumns.map((col) => (
          <div key={col.heading}>
            <div className="mb-4 font-semibold text-white">{col.heading}</div>
            <ul className="space-y-2 text-sm">
              {col.links.map((link) => (
                <li key={link.label}>
                  <ChromeLink href={link.href} className="hover:text-white">
                    {link.label}
                  </ChromeLink>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>

    {/* Language bar — the CMS-driven switcher; hidden when only one locale is enabled. */}
    {LOCALES.length > 1 && (
      <div className="border-t border-white/10">
        <div className="site-container py-5">
          <LanguageSwitcher />
        </div>
      </div>
    )}
  </footer>
);

export default Footer;
