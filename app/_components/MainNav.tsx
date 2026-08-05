import Link from 'next/link';
import { User, Menu } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';

const MainNav = () => (
  <header className="sticky top-0 z-50 bg-blue-900 shadow-sm">
    <div className="container mx-auto px-4 flex justify-between items-center h-16">
      <div className="navbar-brand flex items-center" data-cms-field="brand_logo">
        <Link href="/" title="Go to home page" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={siteConfig.logoSrc} alt={siteConfig.logoAlt} className="h-14 w-auto" />
        </Link>
      </div>

      <nav className="hidden lg:flex gap-8 font-medium text-white/80 text-sm">
        {siteConfig.mainNavLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="hover:text-white transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-white/70 font-medium text-sm hover:text-white transition-colors">
          <User size={16} />
          <span>{siteConfig.accountLabel}</span>
        </button>
        <Link
          href={siteConfig.primaryCta.href}
          className="hidden sm:inline-flex items-center px-4 py-2 bg-blue-200 text-blue-950 font-bold text-sm rounded-full hover:bg-blue-400 transition-colors"
        >
          {siteConfig.primaryCta.label}
        </Link>
        <button className="lg:hidden p-2 text-white">
          <Menu size={22} />
        </button>
      </div>
    </div>
  </header>
);

export default MainNav;
