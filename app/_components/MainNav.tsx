import Link from 'next/link';
import { User, Menu } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';

const MainNav = () => (
  <header className="sticky top-0 z-50 bg-white border-b border-slate-200">
    <div className="container mx-auto px-4 flex justify-between items-center h-16">
      <div className="navbar-brand flex items-center" data-cms-field="brand_logo">
        <Link href="/" title="Go to home page" className="flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={siteConfig.logoSrc} alt={siteConfig.logoAlt} className="h-10 w-auto" />
        </Link>
      </div>

      <nav className="hidden lg:flex gap-8 font-medium text-blue-950 text-sm">
        {siteConfig.mainNavLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="hover:text-blue-600 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <button className="hidden sm:flex items-center gap-2 px-3 py-1.5 text-blue-950/70 font-medium text-sm hover:text-blue-950 transition-colors">
          <User size={16} />
          <span>{siteConfig.accountLabel}</span>
        </button>
        <Link
          href={siteConfig.primaryCta.href}
          className="hidden sm:inline-flex items-center px-5 py-2.5 bg-blue-600 text-white font-semibold text-sm rounded-sm hover:bg-blue-700 transition-colors"
        >
          {siteConfig.primaryCta.label}
        </Link>
        <button className="lg:hidden p-2 text-blue-950">
          <Menu size={22} />
        </button>
      </div>
    </div>
  </header>
);

export default MainNav;
