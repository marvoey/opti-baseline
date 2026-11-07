import { siteConfig } from '@/lib/siteConfig';
import LibertyLogo from './LibertyLogo';

/**
 * Liberty Mutual footer — light grey link panel over a navy legal band (as in the mockups).
 *
 * Mobile-first: one column with the grey panel running edge to edge on phones,
 * two columns from `sm`, four from `md`. Link rows have padding so they are
 * comfortable tap targets.
 */
const Footer = () => (
  <footer className="mt-12 md:mt-16" data-cms-group="Footer">
    <div className="mx-auto max-w-6xl sm:px-6">
      <div className="grid grid-cols-1 gap-6 rounded-t-3xl bg-[#F5F5F5] px-6 py-8 text-sm sm:grid-cols-2 md:grid-cols-4 md:gap-8 md:px-10 md:py-10">
        <div>
          <div
            className="flex h-[76px] w-[221px] max-w-full overflow-hidden rounded-xl"
            style={{ backgroundColor: 'var(--lmig-FloatingHeader-brand-color, #FFD000)' }}
          >
            <div className="flex flex-1 items-center justify-center">
              <LibertyLogo className="w-[157px]" />
            </div>
          </div>
        </div>
        {siteConfig.footerColumns.map((col) => (
          <div key={col.heading}>
            <div className="font-medium text-navy">{col.heading}</div>
            <div className="mt-2">
              {col.links.map((link) => (
                <a key={link.label} href={link.href} className="lk block py-1.5">
                  {link.label}
                </a>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
    <div className="bg-navy text-xs text-white/80">
      <div className="mx-auto max-w-6xl space-y-3 px-6 py-6">
        <div className="flex flex-wrap gap-x-5 gap-y-1">
          {siteConfig.footerLegalLinks.map((link) => (
            <a key={link.label} href={link.href} className="inline-block py-1 underline">
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
