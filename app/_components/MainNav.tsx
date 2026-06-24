import Link from 'next/link';
import { Search, User, Menu } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';

const MainNav = () => (
  <header className="sticky top-0 z-50 bg-white shadow-sm border-b border-slate-100">
    <div className="container mx-auto px-4 flex justify-between items-center h-20">
      {/* Brand Logo */}
      <div className="navbar-brand branding flex items-center" data-cms-field="brand_logo">
        <Link href="/" title="Go to home page" className="header-logo flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={siteConfig.logoSrc} alt={siteConfig.logoAlt} className="h-9 w-auto" />
        </Link>
      </div>

      {/* Desktop Links */}
      <nav className="hidden lg:flex gap-8 font-semibold text-slate-700">
        {siteConfig.mainNavLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="hover:text-blue-800 flex items-center gap-1 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      {/* Action Buttons (utility menu) */}
      <div className="utility-container flex items-center gap-3">
        <Link
          href={siteConfig.primaryCta.href}
          className="hidden sm:inline-flex items-center px-5 py-2 bg-blue-800 text-white font-bold rounded-full hover:bg-blue-900 transition-colors"
        >
          {siteConfig.primaryCta.label}
        </Link>
        <button className="hidden md:flex items-center gap-2 px-4 py-2 text-slate-700 font-semibold hover:bg-slate-50 rounded-lg transition-colors">
          <Search size={20} />
        </button>
        <button className="flex items-center gap-2 px-4 py-2 border-2 border-blue-800 text-blue-800 font-bold rounded-full hover:bg-blue-50 transition-all">
          <User size={18} />
          <span className="hidden sm:inline">{siteConfig.accountLabel}</span>
        </button>
        <button className="lg:hidden p-2 text-slate-700">
          <Menu size={24} />
        </button>
      </div>
    </div>
  </header>
);

export default MainNav;
