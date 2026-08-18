import Link from 'next/link';
import { Menu } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';
import { SignInMenu } from './SignInMenu';

const MainNav = () => (
  <header className="sticky top-0 z-50 bg-blue-900 shadow-md">
    <div className="container mx-auto px-4 flex justify-between items-center h-16">
      <div className="navbar-brand self-start flex items-start" data-cms-field="brand_logo">
        <Link href="/" title="Go to home page" className="flex items-center bg-white rounded-b px-4 pb-2 pt-0 shadow-lg">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={siteConfig.logoSrc} alt={siteConfig.logoAlt} className="h-20 w-auto" />
        </Link>
      </div>

      <nav className="hidden lg:flex gap-7 font-semibold text-white/85 text-sm">
        {siteConfig.mainNavLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="hover:text-white border-b-2 border-transparent hover:border-orange-400 pb-0.5 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3">
        <Link
          href={siteConfig.primaryCta.href}
          className="hidden sm:inline-flex items-center px-4 py-2 border-2 border-white/60 text-white font-semibold text-sm rounded hover:border-white hover:bg-white/10 transition-colors"
        >
          {siteConfig.primaryCta.label}
        </Link>
        <SignInMenu />
        <button className="lg:hidden p-2 text-white" aria-label="Open menu">
          <Menu size={22} />
        </button>
      </div>
    </div>
  </header>
);

export default MainNav;
