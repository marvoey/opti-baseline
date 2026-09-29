import { siteConfig } from '@/lib/siteConfig';

const Footer = () => (
  <footer className="bg-white text-blue-950 pt-16 pb-8 border-t border-slate-200" data-cms-group="Footer">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={siteConfig.logoSrc} alt={siteConfig.logoAlt} className="h-10 w-auto mb-6" />
        <p className="text-slate-500 text-sm leading-relaxed">{siteConfig.footerTagline}</p>
      </div>
      {siteConfig.footerColumns.map((col) => (
        <div key={col.heading}>
          <h4 className="text-blue-600 uppercase tracking-widest text-xs font-bold mb-5">
            {col.heading}
          </h4>
          <ul className="space-y-3 text-sm">
            {col.links.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-slate-500 hover:text-blue-950 transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="container mx-auto px-4 pt-8 border-t border-slate-200 text-slate-400 text-xs flex flex-wrap justify-between gap-4">
      <p>{siteConfig.footerLegal}</p>
      <div className="flex gap-6">
        {siteConfig.footerLegalLinks.map((link) => (
          <a key={link.label} href={link.href} className="hover:text-blue-950 transition-colors">
            {link.label}
          </a>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
