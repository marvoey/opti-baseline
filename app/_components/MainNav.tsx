import Link from 'next/link';
import { Search, User, Menu } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';

const MainNav = () => (
  <header className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
    <div className="container mx-auto px-4 flex justify-between items-center h-20">
      {/* Brand Logo */}
      <div className="navbar-brand branding flex items-center" data-cms-field="brand_logo">
        <Link href="/" title="Go to home page" className="header-logo flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={siteConfig.logoSrc} alt={siteConfig.logoAlt} className="h-9 w-auto" />
        </Link>
      </div>

      {/* Desktop Links */}
      <nav className="hidden lg:flex gap-8 font-semibold text-blue-900">
        {siteConfig.mainNavLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="hover:text-gold flex items-center gap-1 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Action Buttons (utility menu) */}
      <div className="utility-container flex items-center gap-3">
        <Link
          href={siteConfig.primaryCta.href}
          className="hidden sm:inline-flex items-center px-5 py-2 bg-gold text-white font-bold rounded-full hover:bg-gold-dark transition-colors"
        >
          {siteConfig.primaryCta.label}
        </Link>
        <button className="hidden md:flex items-center gap-2 px-4 py-2 text-blue-900 font-semibold hover:bg-slate-100 rounded-lg transition-colors">
          <Search size={20} />
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border-2 border-blue-800 text-blue-900 font-bold rounded-full hover:bg-blue-50 transition-all">
          <User size={18} />
          <span className="hidden sm:inline">{siteConfig.accountLabel}</span>
        </button>
        <button className="lg:hidden p-2 text-blue-900">
          <Menu size={24} />
        </button>
      </div>
    </div>
  </header>
);

export default MainNav;
