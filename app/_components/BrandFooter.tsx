import type { BrandThemeConfig } from '@/lib/brandThemes';

function SocialGlyph({ label }: { label: string }) {
  return (
    <span className="flex h-8 w-8 items-center justify-center rounded-full border border-white/25 text-[11px] font-semibold text-white/80 hover:border-white/60 hover:text-white">
      {label}
    </span>
  );
}

/**
 * 4-column footer (brand/help/legal/follow-us) for the Peacock/NOW themes,
 * ported 1:1 from the <footer> markup in app/mock/peacock and app/mock/nowtv.
 * Shared between both brands — only `config` (lib/brandThemes.ts) differs.
 */
export function BrandFooter({ config }: { config: BrandThemeConfig }) {
  return (
    <footer className="bg-blue-950 px-6 py-12 text-sm text-white/70">
      <div className="mx-auto grid max-w-6xl grid-cols-2 gap-8 sm:grid-cols-4">
        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-white">
            {config.footerBrandHeading}
          </h4>
          <ul className="space-y-2">
            {config.footerBrandLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="hover:text-white transition-colors">{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-white">Help</h4>
          <ul className="space-y-2">
            {config.footerHelpLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="hover:text-white transition-colors">{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-white">Legal</h4>
          <ul className="space-y-2">
            {config.footerLegalLinks.map((link) => (
              <li key={link.label}>
                <a href={link.href} className="hover:text-white transition-colors">{link.label}</a>
              </li>
            ))}
          </ul>
        </div>
        <div>
          <h4 className="mb-3 text-xs font-bold uppercase tracking-wide text-white">Follow Us</h4>
          <div className="flex gap-2">
            {config.socialLabels.map((label) => (
              <SocialGlyph key={label} label={label} />
            ))}
          </div>
        </div>
      </div>
      <div className="mx-auto mt-10 max-w-6xl border-t border-white/10 pt-6 text-xs text-white/40">
        <p>{config.footerCopyright}</p>
        <p className="mt-1">{config.footerDisclaimer}</p>
      </div>
    </footer>
  );
}

export default BrandFooter;
