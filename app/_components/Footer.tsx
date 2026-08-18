import { siteConfig } from '@/lib/siteConfig';

const SOCIAL_PATHS: Record<string, string> = {
  Facebook: 'M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z',
  Instagram: 'M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37zm1.5-4.87h.01M6.5 2h11A4.5 4.5 0 0 1 22 6.5v11A4.5 4.5 0 0 1 17.5 22h-11A4.5 4.5 0 0 1 2 17.5v-11A4.5 4.5 0 0 1 6.5 2z',
  Twitter: 'M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z',
  Youtube: 'M22.54 6.42a2.78 2.78 0 0 0-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 0 0 1.46 6.42 29 29 0 0 0 1 12a29 29 0 0 0 .46 5.58 2.78 2.78 0 0 0 1.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 0 0 1.95-1.96A29 29 0 0 0 23 12a29 29 0 0 0-.46-5.58z M9.75 15.02V8.98L15.5 12l-5.75 3.02z',
  Linkedin: 'M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6zM2 9h4v12H2z M4 6a2 2 0 1 0 0-4 2 2 0 0 0 0 4z',
};

const Footer = () => (
  <footer className="bg-blue-950 text-white pt-16 pb-8" data-cms-group="Footer">
    <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
      {/* Brand column */}
      <div>
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src={siteConfig.logoSrc} alt={siteConfig.logoAlt} className="h-10 w-auto mb-5 brightness-0 invert" />
        <p className="text-white/60 text-sm leading-relaxed mb-4">{siteConfig.footerTagline}</p>
        <p className="text-white/50 text-sm">{siteConfig.footerAddress}</p>
        <p className="text-white/50 text-sm mt-1">{siteConfig.footerPhone}</p>

        {/* Social media */}
        <div className="flex gap-3 mt-6">
          {siteConfig.footerSocialLinks.map((social) => {
            const path = SOCIAL_PATHS[social.icon];
            return (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="p-2 rounded-full bg-white/10 text-white/60 hover:bg-blue-800 hover:text-white transition-colors"
              >
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  {path && <path d={path} />}
                </svg>
              </a>
            );
          })}
        </div>
      </div>

      {/* Link columns */}
      {siteConfig.footerColumns.map((col) => (
        <div key={col.heading}>
          <h4 className="text-orange-400 uppercase tracking-widest text-xs font-bold mb-5">
            {col.heading}
          </h4>
          <ul className="space-y-3 text-sm">
            {col.links.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="text-white/60 hover:text-white transition-colors">
                  {link.label}
                </a>
              </li>
            ))}
          </ul>
        </div>
      ))}
    </div>

    {/* Legal bar */}
    <div className="container mx-auto px-4 pt-8 border-t border-white/10 text-white/40 text-xs flex flex-wrap justify-between gap-4">
      <p>{siteConfig.footerLegal}</p>
      <div className="flex gap-6">
        {siteConfig.footerLegalLinks.map((link) => (
          <a key={link.label} href={link.href} className="hover:text-white transition-colors">
            {link.label}
          </a>
        ))}
      </div>
    </div>
  </footer>
);

export default Footer;
