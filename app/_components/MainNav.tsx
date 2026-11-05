import Link from 'next/link';
import { Menu } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';

const MainNav = () => (
  <header className="sticky top-0 z-50 border-b border-ink/10 bg-background">
    <div className="page-width flex justify-between items-center h-16">
      <div className="navbar-brand flex items-center" data-cms-field="brand_logo">
        <Link href="/" title="Go to home page" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={siteConfig.logoSrc} alt={siteConfig.logoAlt} className="h-9 w-auto" />
        </Link>
      </div>

      <nav className="hidden lg:flex gap-8 font-semibold text-ink">
        {siteConfig.mainNavLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="underline-offset-4 hover:underline"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <button className="btn btn-outline hidden sm:inline-flex text-ink">
          {siteConfig.accountLabel}
        </button>
        <Link
          href={siteConfig.primaryCta.href}
          className="btn btn-primary hidden sm:inline-flex"
        >
          {siteConfig.primaryCta.label}
        </Link>
        <button className="lg:hidden p-2 text-ink" aria-label="Open menu">
          <Menu size={22} />
        </button>
      </div>
    </div>
  </header>
);

export default MainNav;
