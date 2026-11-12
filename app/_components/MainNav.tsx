import Link from 'next/link';
import { User, Menu } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';

const MainNav = () => (
  <header className="sticky top-0 z-50 bg-white shadow-sm">
    <div className="container mx-auto px-4 flex justify-between items-center h-16">
      <div className="navbar-brand flex items-center" data-cms-field="brand_logo">
        <Link href="/" title="Go to home page" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={siteConfig.logoSrc} alt={siteConfig.logoAlt} className="h-8 w-auto" />
        </Link>
      </div>

      <nav className="hidden lg:flex gap-8 font-medium text-black text-sm">
        {siteConfig.mainNavLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="hover:text-blue-700 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <a
          href={siteConfig.accountHref}
          className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-black font-medium text-sm hover:text-blue-700 transition-colors"
        >
          <User size={16} />
          <span>{siteConfig.accountLabel}</span>
        </a>
        <Link
          href={siteConfig.primaryCta.href}
          className="hidden sm:inline-flex items-center px-4 py-2 bg-blue-700 text-white font-medium text-sm rounded border-2 border-blue-700 hover:bg-blue-800 hover:border-blue-800 transition-colors"
        >
          {siteConfig.primaryCta.label}
        </Link>
        <button className="lg:hidden p-2 text-black" aria-label="Menu">
          <Menu size={22} />
        </button>
      </div>
    </div>
  </header>
);

export default MainNav;
