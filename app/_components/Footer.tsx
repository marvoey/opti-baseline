import { siteConfig } from '@/lib/siteConfig';

const Footer = () => (
  <footer className="bg-blue-950 text-white pt-16 pb-8" data-cms-group="Footer">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
      <div>
        <div className="flex items-center gap-3 mb-6">
          <div className="w-9 h-9 bg-white rounded-full flex items-center justify-center text-blue-800 font-bold text-lg">
            {siteConfig.name.charAt(0)}
          </div>
          <span className="text-xl font-bold tracking-tight">{siteConfig.name}</span>
        </div>
        <p className="text-slate-400 text-sm leading-relaxed mb-6">{siteConfig.footerTagline}</p>
      </div>
      {siteConfig.footerColumns.map((col) => (
        <div key={col.heading}>
          <h4 className="font-bold mb-6 text-lg">{col.heading}</h4>
          <ul className="space-y-3 text-slate-400 text-sm">
            {col.links.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="hover:text-white transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>
    <div className="container mx-auto px-4 pt-8 border-t border-white/10 text-slate-500 text-xs flex flex-wrap justify-between gap-4">
      <p>{siteConfig.footerLegal}</p>
      <div className="flex gap-6">
        {siteConfig.footerLegalLinks.map((link) => (
          <a key={link.label} href={link.href} className="hover:text-white">
            {link.label}
          </a>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
