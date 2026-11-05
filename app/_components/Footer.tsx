import { siteConfig } from '@/lib/siteConfig';

const Footer = () => (
  <footer className="bg-ink text-white pt-14 pb-[60px]" data-cms-group="Footer">
    <div className="page-width grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={siteConfig.logoSrc} alt={siteConfig.logoAlt} className="h-10 w-auto mb-6" />
        <p className="text-white/70 text-fine">{siteConfig.footerTagline}</p>
      </div>
      {siteConfig.footerColumns.map((col) => (
        <div key={col.heading}>
          <h4 className="eyebrow text-white mb-5">{col.heading}</h4>
          <ul className="space-y-3 text-fine">
            {col.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-white/70 underline-offset-4 hover:text-white hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="page-width">
      <div className="pt-8 border-t border-white/20 text-white/70 text-xs flex flex-wrap justify-between gap-4">
        <p>{siteConfig.footerLegal}</p>
        <div className="flex gap-6">
          {siteConfig.footerLegalLinks.map((link) => (
            <a key={link.label} href={link.href} className="underline-offset-4 hover:text-white hover:underline">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
