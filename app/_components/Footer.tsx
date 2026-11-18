import { siteConfig } from '@/lib/siteConfig';

/** Dark-green four-column footer (Products / Services / Company / Connect). */
const Footer = () => (
  <footer className="bg-blue-950 pb-8 pt-12 text-white" data-cms-group="Footer">
    <div className="container mx-auto mb-10 grid grid-cols-2 gap-8 px-4 md:grid-cols-4">
      {siteConfig.footerColumns.map((col) => (
        <div key={col.heading}>
          <h4 className="mb-4 font-display text-sm font-semibold">{col.heading}</h4>
          <ul className="space-y-2.5 text-xs">
            {col.links.map((link) => (
              <li key={link.label}>
                <a
                  href={link.href}
                  className="text-white/90 transition-colors hover:text-white hover:underline"
                >
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="container mx-auto flex flex-wrap justify-between gap-4 border-t border-white/20 px-4 pt-6 text-xs text-white/80">
      <p>{siteConfig.footerLegal}</p>
      <div className="flex gap-6">
        {siteConfig.footerLegalLinks.map((link) => (
          <a key={link.label} href={link.href} className="transition-colors hover:text-white hover:underline">
            {link.label}
          </a>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
