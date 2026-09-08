import Link from 'next/link';
import type { BrandThemeConfig } from '@/lib/brandThemes';
import { PeacockMark } from './logos/PeacockMark';
import { NowMark } from './logos/NowMark';

function SearchIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" strokeLinecap="round" />
    </svg>
  );
}

/**
 * Single-tier header for the Peacock/NOW themes, ported 1:1 from the
 * <header> markup in app/mock/peacock and app/mock/nowtv. Shared between both
 * brands — only `config` (lib/brandThemes.ts) differs. Colours come from
 * Tailwind's blue-* scale, which app/globals.css already remaps per theme via
 * `[data-theme]`, so no brand-specific className branching is needed here.
 */
export function BrandHeader({ config }: { config: BrandThemeConfig }) {
  const Logo = config.logoComponent === 'PeacockMark' ? PeacockMark : NowMark;

  return (
    <header className="border-b border-white/10 bg-blue-950">
      <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
        <Link href="/" className="flex items-center gap-3">
          <Logo className="h-6 w-auto text-white" />
          {config.headerLabel && (
            <span className="hidden text-sm font-semibold text-white/70 sm:block">{config.headerLabel}</span>
          )}
        </Link>

        <nav className="hidden items-center gap-8 text-sm font-medium text-white/80 md:flex">
          {config.navLinks.map((link) => (
            <Link key={link.label} href={link.href} className="hover:text-white transition-colors">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="flex items-center gap-4">
          <button type="button" aria-label="Search" className="text-white/80 hover:text-white">
            <SearchIcon className="h-5 w-5" />
          </button>
          <Link href="#" className="hidden text-sm font-medium text-white/80 hover:text-white sm:block">
            Sign In
          </Link>
          <Link
            href={config.ctaHref}
            className={`btn-cta rounded-full px-5 py-2 text-sm font-bold ${config.ctaTextClass}`}
          >
            {config.ctaLabel}
          </Link>
        </div>
      </div>
    </header>
  );
}

export default BrandHeader;
