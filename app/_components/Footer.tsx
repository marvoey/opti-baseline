import { siteConfig } from '@/lib/siteConfig';
import LibertyLogo from './LibertyLogo';

/** Liberty Mutual footer — light grey link panel over a navy legal band (as in the mockups). */
const Footer = () => (
  <footer className="mt-16" data-cms-group="Footer">
    <div className="mx-auto max-w-6xl px-6">
      <div className="grid gap-8 rounded-t-3xl bg-[#F5F5F5] px-10 py-10 text-sm md:grid-cols-4">
        <div>
          <div
            className="flex overflow-hidden rounded-xl"
            style={{ height: 76, width: 221, backgroundColor: 'var(--lmig-FloatingHeader-brand-color, #FFD000)' }}
          >
            <div className="flex flex-1 items-center justify-center">
              <LibertyLogo className="lmig-FloatingHeader-brand-logo" />
            </div>
          </div>
        </div>
        {siteConfig.footerColumns.map((col) => (
          <div key={col.heading}>
            <div className="font-medium text-navy">{col.heading}</div>
            <div className="mt-3 space-y-2">
              {col.links.map((link) => (
                <a key={link.label} href={link.href} className="lk block">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-navy text-xs text-white/80">
      <div className="mx-auto max-w-6xl space-y-2 px-6 py-6">
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          {siteConfig.footerLegalLinks.map((link) => (
            <a key={link.label} href={link.href} className="underline">
              {link.label}
            </a>
          ))}
        </div>
        <p>{siteConfig.footerLegal}</p>
        <p>{siteConfig.footerDisclaimer}</p>
      </div>
    </div>
  </footer>
);

export default Footer;
