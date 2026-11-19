import { Phone } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';
import { getSiteSettings } from '@/lib/siteSettings';
import SiteLogo from './SiteLogo';

/**
 * Minimal chrome for paid landing pages (/lp/...): the logo, the phone number and a
 * one-line legal footer. No site navigation, language switcher, sign-in or promo
 * strip, so the visitor has one job on the page. Counterpart of SiteChrome; the
 * locale layout picks between them (see lib/landing.ts). The phone number and legal
 * line come from the CMS "Site settings" item (lib/siteSettings.ts).
 */
export default async function LandingChrome({
  children,
  locale,
}: {
  children: React.ReactNode;
  locale?: string;
}) {
  const { phone, footerLegal } = await getSiteSettings(locale);

  return (
    <>
      <header className="border-t-[3px] border-blue-400 bg-white shadow-sm">
        <div className="container mx-auto flex h-16 items-center justify-between px-4">
          {/* Deliberately not a link: a paid visitor has one place to go. */}
          <SiteLogo />
          <a
            href={phone.href}
            className="inline-flex items-center gap-1.5 font-display text-sm font-semibold text-blue-950 transition-colors hover:text-blue-700"
          >
            <Phone size={16} aria-hidden="true" />
            <span>{phone.label}</span>
          </a>
        </div>
      </header>
      <div className="flex-1">{children}</div>
      <footer className="bg-blue-950 py-6 text-xs text-white/80">
        <div className="container mx-auto flex flex-wrap justify-between gap-4 px-4">
          <p>{footerLegal}</p>
          <div className="flex gap-6">
            {siteConfig.footerLegalLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                className="transition-colors hover:text-white hover:underline"
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </footer>
    </>
  );
}
