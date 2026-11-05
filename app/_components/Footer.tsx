import { siteConfig } from '@/lib/siteConfig';

const Footer = () => (
  <footer className="bg-ink text-white pt-14 pb-[60px]" data-cms-group="Footer">
    <div className="page-width grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-14">
      <div>
        {siteConfig.logoSrc ? (
          // brightness-0 + invert turns the logo solid white for the ink background.
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={siteConfig.logoSrc}
            alt={siteConfig.logoAlt}
            width={siteConfig.logoWidth}
            height={siteConfig.logoHeight}
            className="h-9 w-auto mb-6 brightness-0 invert"
          />
        ) : (
          <p className="font-display text-2xl font-semibold text-white mb-6">{siteConfig.name}</p>
        )}
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
