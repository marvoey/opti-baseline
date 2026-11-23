import { siteConfig } from '@/lib/siteConfig';

/** Light footer (Neutral 3 with Dark Fir text and rule), per the brand's text-colour rule. */
const Footer = () => (
  <footer className="border-t-2 border-dark-fir bg-neutral-3 pb-8 pt-14 text-dark-fir" data-cms-group="Footer">
    <div className="container mx-auto mb-12 grid grid-cols-1 gap-10 px-4 md:grid-cols-2 lg:grid-cols-4">
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={siteConfig.logoSrc} alt={siteConfig.logoAlt} width={105} height={36} className="mb-5 h-9 w-auto" />
        <p className="text-sm leading-relaxed">{siteConfig.footerTagline}</p>
      </div>
      {siteConfig.footerColumns.map((col) => (
        <div key={col.heading}>
          <h2 className="mb-4 font-sans text-sm font-bold">{col.heading}</h2>
          <ul className="space-y-2.5 text-sm">
            {col.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  {...(link.external ? { target: '_blank', rel: 'noopener noreferrer' } : {})}
                  className="underline decoration-dark-fir/30 underline-offset-4 hover:decoration-dark-fir"
                >
                  {link.label}
                  {link.external ? <span className="sr-only"> (opens in a new tab)</span> : null}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="container mx-auto flex flex-wrap justify-between gap-4 border-t border-dark-fir/20 px-4 pt-6 text-xs">
      <p>{siteConfig.footerLegal}</p>
      {siteConfig.footerLegalLinks.length > 0 && (
        <div className="flex gap-6">
          {siteConfig.footerLegalLinks.map((link) => (
            <a key={link.label} href={link.href} className="hover:underline">
              {link.label}
            </a>
          ))}
        </div>
      )}
    </div>
  </footer>
);

export default Footer;
