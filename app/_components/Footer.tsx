import Link from 'next/link';
import { siteConfig } from '@/lib/siteConfig';

const Footer = () => (
  <footer className="bg-blue-950 text-white pt-16 pb-8" data-cms-group="Footer">
    <div className="container mx-auto px-4 mb-16">
      <div className="flex flex-col md:flex-row md:items-start gap-10">
        <div className="md:max-w-xs">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={siteConfig.logoSrc} alt={siteConfig.logoAlt} className="h-6 w-auto mb-6" />
          <p className="text-slate-400 text-sm leading-relaxed">{siteConfig.footerTagline}</p>
        </div>
        <nav className="flex flex-wrap gap-x-10 gap-y-3 md:ml-auto md:pt-1">
          {siteConfig.mainNavLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="text-slate-300 text-sm font-semibold hover:text-white transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>
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
