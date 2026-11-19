import Link from 'next/link';
import { User, Menu, Search, ChevronDown, ArrowUpRight } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';

/**
 * Sticky black header: wordmark, primary nav (with dropdown chevrons for menu
 * items), yellow "Buy Now" pill and round icon buttons for search / player
 * menu. The mobile menu uses a native <details> disclosure so this stays a
 * Server Component with no client JS.
 */
const MainNav = () => (
  <header className="sticky top-0 z-50 border-b border-rs-line bg-rs-ink/95 backdrop-blur">
    <div className="container mx-auto flex h-16 items-center justify-between gap-6 px-4">
      <div className="navbar-brand flex items-center gap-4" data-cms-field="brand_logo">
        <a href={siteConfig.starHref} title={siteConfig.starAlt} className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={siteConfig.starSrc} alt={siteConfig.starAlt} className="h-8 w-8" />
        </a>
        <span aria-hidden className="h-6 w-px bg-white/25" />
        <Link href="/" title="Go to home page" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={siteConfig.logoSrc} alt={siteConfig.logoAlt} className="h-7 w-auto" />
        </Link>
      </div>

      <nav className="hidden flex-1 items-center gap-7 text-sm font-bold text-white/80 lg:flex">
        {siteConfig.mainNavLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="inline-flex items-center gap-1 transition-colors hover:text-white"
          >
            {link.label}
            {'hasMenu' in link && link.hasMenu ? <ChevronDown size={14} className="opacity-70" /> : null}
            {'external' in link && link.external ? <ArrowUpRight size={14} className="opacity-70" /> : null}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-2">
        <Link
          href={siteConfig.primaryCta.href}
          className="hidden items-center rounded-full bg-rs-yellow px-5 py-2 text-sm font-extrabold text-black transition-colors hover:bg-rs-yellow-soft sm:inline-flex"
        >
          {siteConfig.primaryCta.label}
        </Link>
        <button
          type="button"
          aria-label={siteConfig.searchLabel}
          className="flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
        >
          <Search size={18} />
        </button>
        <button
          type="button"
          aria-label={siteConfig.accountLabel}
          className="hidden h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20 sm:flex"
        >
          <User size={18} />
        </button>

        {/* Mobile menu */}
        <details className="relative lg:hidden">
          <summary className="flex h-10 w-10 cursor-pointer list-none items-center justify-center rounded-full text-white hover:bg-white/10">
            <Menu size={22} />
            <span className="sr-only">Open menu</span>
          </summary>
          <div className="absolute right-0 mt-3 w-64 rounded-2xl border border-rs-line bg-rs-panel p-2 shadow-2xl">
            {siteConfig.mainNavLinks.map((link) => (
              <Link
                key={link.label}
                href={link.href}
                className="block rounded-xl px-4 py-3 text-sm font-bold text-white/85 hover:bg-white/10 hover:text-white"
              >
                {link.label}
              </Link>
            ))}
            <Link
              href={siteConfig.primaryCta.href}
              className="mt-2 block rounded-full bg-rs-yellow px-4 py-3 text-center text-sm font-extrabold text-black"
            >
              {siteConfig.primaryCta.label}
            </Link>
          </div>
        </details>
      </div>
    </div>
  </header>
);

export default MainNav;
