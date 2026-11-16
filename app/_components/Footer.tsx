import { Building2, Headset, Music2, Search } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';

const SUPPORT_ICONS = { headset: Headset, office: Building2, search: Search } as const;

// lucide-react ships no brand icons, so the social glyphs are drawn inline.
function SocialIcon({ label }: { label: string }) {
  const common = {
    width: 14,
    height: 14,
    viewBox: '0 0 24 24',
    fill: 'none',
    stroke: 'currentColor',
    strokeWidth: 2,
    strokeLinecap: 'round' as const,
    strokeLinejoin: 'round' as const,
    'aria-hidden': true,
  };
  switch (label) {
    case 'TikTok':
      return <Music2 size={14} aria-hidden />;
    case 'Instagram':
      return (
        <svg {...common}>
          <rect x="3" y="3" width="18" height="18" rx="5" />
          <circle cx="12" cy="12" r="4" />
          <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" />
        </svg>
      );
    case 'YouTube':
      return (
        <svg {...common}>
          <rect x="2" y="5" width="20" height="14" rx="4" />
          <path d="M10 9l5 3-5 3z" fill="currentColor" />
        </svg>
      );
    case 'Facebook':
      return <span className="text-sm font-bold leading-none">f</span>;
    default:
      return <span className="text-[10px] font-bold leading-none">in</span>;
  }
}

const Footer = () => (
  <footer className="bg-blue-800 text-white pt-12 pb-8" data-cms-group="Footer">
    <div className="container mx-auto px-4">
      {/* Need support? row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6 items-center mb-14 text-lg font-bold">
        <h3 className="font-display">{siteConfig.footerSupportHeading}</h3>
        {siteConfig.footerSupportLinks.map((link) => {
          const Icon = SUPPORT_ICONS[link.icon];
          return (
            <a key={link.label} href={link.href} className="flex items-center gap-3 hover:underline">
              <Icon size={14} aria-hidden />
              <span className="font-display">{link.label}</span>
            </a>
          );
        })}
      </div>

      {/* Link columns */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-10 mb-16">
        {siteConfig.footerColumns.map((sections, i) => (
          <div key={i} className="space-y-10">
            {sections.map((section) => (
              <div key={section.heading}>
                <h4 className="font-display text-sm font-bold mb-5">{section.heading}</h4>
                <ul className="space-y-3 text-xs">
                  {section.links.map((link) => (
                    <li key={link.label}>
                      <a href={link.href} className="text-white/90 hover:text-white hover:underline">
                        {link.label}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        ))}
      </div>

      {/* Bottom bar: legal / social / privacy choices */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-center text-[10px] text-white/80">
        <div className="space-y-3">
          <p>{siteConfig.footerLegal}</p>
          <a href={siteConfig.footerPrivacyChoices.href} className="inline-block underline hover:text-white">
            {siteConfig.footerPrivacyChoices.label}
          </a>
        </div>
        <div className="flex justify-center gap-3">
          {siteConfig.footerSocial.map((s) => (
            <a
              key={s.label}
              href={s.href}
              aria-label={s.label}
              className="flex h-8 w-8 items-center justify-center rounded-full bg-white/15 text-white hover:bg-white/25 transition-colors"
            >
              <SocialIcon label={s.label} />
            </a>
          ))}
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;
