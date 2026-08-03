import { siteConfig } from '@/lib/siteConfig';

function SocialIcon({ platform, size = 18 }: { platform: string; size?: number }) {
  if (platform === 'Facebook') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z" />
    </svg>
  );
  if (platform === 'LinkedIn') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-4 0v7h-4V9h4v1.765A5.003 5.003 0 0 1 22 14v7zM2 9h4v12H2zm2-3a2 2 0 1 1 0-4 2 2 0 0 1 0 4z" />
    </svg>
  );
  if (platform === 'X') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
  if (platform === 'YouTube') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M21.543 6.498C22 8.28 22 12 22 12s0 3.72-.457 5.502c-.254.985-.997 1.76-1.938 2.022C17.896 20 12 20 12 20s-5.893 0-7.605-.476c-.945-.266-1.687-1.04-1.938-2.022C2 15.72 2 12 2 12s0-3.72.457-5.502c.254-.985.997-1.76 1.938-2.022C6.107 4 12 4 12 4s5.896 0 7.605.476c.945.266 1.687 1.04 1.938 2.022zM10 15.5l6-3.5-6-3.5v7z" />
    </svg>
  );
  if (platform === 'Instagram') return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M12 2c2.717 0 3.056.01 4.122.06 1.065.05 1.79.217 2.428.465.66.254 1.216.598 1.772 1.153a4.908 4.908 0 0 1 1.153 1.772c.247.637.415 1.363.465 2.428.047 1.066.06 1.405.06 4.122 0 2.717-.01 3.056-.06 4.122-.05 1.065-.218 1.79-.465 2.428a4.883 4.883 0 0 1-1.153 1.772 4.915 4.915 0 0 1-1.772 1.153c-.637.247-1.363.415-2.428.465-1.066.047-1.405.06-4.122.06-2.717 0-3.056-.01-4.122-.06-1.065-.05-1.79-.218-2.428-.465a4.89 4.89 0 0 1-1.772-1.153 4.904 4.904 0 0 1-1.153-1.772c-.248-.637-.415-1.363-.465-2.428C2.013 15.056 2 14.717 2 12c0-2.717.01-3.056.06-4.122.05-1.066.217-1.79.465-2.428a4.88 4.88 0 0 1 1.153-1.772A4.897 4.897 0 0 1 5.45 2.525c.638-.248 1.362-.415 2.428-.465C8.944 2.013 9.283 2 12 2zm0 5a5 5 0 1 0 0 10A5 5 0 0 0 12 7zm6.5-.25a1.25 1.25 0 1 0-2.5 0 1.25 1.25 0 0 0 2.5 0zM12 9a3 3 0 1 1 0 6 3 3 0 0 1 0-6z" />
    </svg>
  );
  return null;
}

const Footer = () => (
  <footer className="bg-blue-950 text-white pt-14 pb-8" data-cms-group="Footer">
    {/* Logo + Tagline */}
    <div className="container mx-auto px-4 mb-12">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        src={siteConfig.logoSrc}
        alt={siteConfig.logoAlt}
        className="h-6 w-auto mb-4 brightness-0 invert"
      />
      <p className="text-slate-400 text-sm leading-relaxed max-w-sm">{siteConfig.footerTagline}</p>
    </div>

    {/* Footer Columns */}
    <div className="container mx-auto px-4 grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-10 mb-12">
      {siteConfig.footerColumns.map((col) => (
        <div key={col.heading}>
          <h4 className="text-white text-xs font-bold mb-5 uppercase tracking-widest">
            {col.heading}
          </h4>
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

    {/* Divider + Social + Legal */}
    <div className="container mx-auto px-4 pt-8 border-t border-white/10">
      {/* Social icons */}
      <div className="flex gap-5 mb-6">
        {siteConfig.footerSocialLinks.map(({ platform, href }) => (
          <a
            key={platform}
            href={href}
            aria-label={platform}
            className="text-slate-400 hover:text-white transition-colors"
          >
            <SocialIcon platform={platform} size={18} />
          </a>
        ))}
      </div>

      {/* Legal row */}
      <div className="flex flex-wrap justify-between gap-4 text-slate-500 text-xs">
        <p>{siteConfig.footerLegal}</p>
        <div className="flex flex-wrap gap-5">
          {siteConfig.footerLegalLinks.map((link) => (
            <a key={link.label} href={link.href} className="hover:text-white transition-colors">
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
