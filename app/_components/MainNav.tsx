import Link from 'next/link';
import { Search, Menu } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';

const MainNav = () => (
  <header className="sticky top-0 z-50 bg-white border-b border-gray-200 shadow-sm">
    <div className="container mx-auto px-4 flex justify-between items-center h-16">
      {/* Brand Logo */}
      <div className="navbar-brand branding flex items-center" data-cms-field="brand_logo">
        <Link href="/" title="Go to home page" className="header-logo flex items-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={siteConfig.logoSrc} alt={siteConfig.logoAlt} className="h-8 w-auto" />
        </Link>
      </div>

      {/* Desktop Nav Links */}
      <nav className="hidden lg:flex gap-7 font-semibold text-gray-800 text-sm">
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

      {/* Action Buttons */}
      <div className="utility-container flex items-center gap-2">
        <button
          aria-label="Search"
          className="hidden md:flex items-center p-2 text-gray-500 hover:text-blue-700 transition-colors"
        >
          <Search size={18} />
        </button>
        <Link
          href={siteConfig.secondaryCta.href}
          className="hidden md:inline-flex items-center px-4 py-2 border border-blue-800 text-blue-800 text-sm font-semibold rounded hover:bg-blue-50 transition-colors"
        >
          {siteConfig.secondaryCta.label}
        </Link>
        <Link
          href={siteConfig.primaryCta.href}
          className="hidden sm:inline-flex items-center px-4 py-2 bg-blue-800 text-white text-sm font-semibold rounded hover:bg-blue-700 transition-colors"
        >
          {siteConfig.primaryCta.label}
        </Link>
        <button className="lg:hidden p-2 text-gray-700" aria-label="Open menu">
          <Menu size={22} />
        </button>
      </div>
    </div>
  </header>
);

export default MainNav;
