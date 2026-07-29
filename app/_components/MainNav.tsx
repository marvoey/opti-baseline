import Link from 'next/link';
import { User, Menu } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';
import { fetchMainNav } from '@/lib/cms/fetchMainNav';
import LanguageSwitcher from './LanguageSwitcher';

const NavBrand = () => (
  <div className="navbar-brand branding flex items-center" data-cms-field="brand_logo">
    <Link href="/" title="Go to home page" className="header-logo flex items-center">
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img src={siteConfig.logoSrc} alt={siteConfig.logoAlt} className="h-9 w-auto" />
    </Link>
  </div>
);

async function DesktopNav() {
  const links = (await fetchMainNav()).map((l) => ({ label: (l.text ?? '').split(' — ')[0].trim(), href: l.url?.default ?? '#' }));

  return (
    <nav className="hidden lg:flex gap-8 font-semibold text-white/80">
      {links.map((link) => (
        <Link
          key={link.label}
          href={link.href}
          className="hover:text-white flex items-center gap-1 transition-colors"
        >
          {link.label}
        </Link>
      ))}
    </nav>
  );
}

const NavActions = () => (
  <div className="utility-container flex items-center gap-3">
    <LanguageSwitcher />
    <button className="flex items-center gap-2 px-4 py-2 border-2 border-white/40 text-white font-bold rounded-full hover:bg-white/10 transition-all">
      <User size={18} />
      <span className="hidden sm:inline">{siteConfig.accountLabel}</span>
    </button>
    <button className="lg:hidden p-2 text-white">
      <Menu size={24} />
    </button>
  </div>
);

const MainNav = () => (
  <header className="sticky top-0 z-50 bg-blue-900 shadow-sm">
    <div className="container mx-auto px-4 flex justify-between items-center h-20">
      <NavBrand />
      <DesktopNav />
      <NavActions />
    </div>
  </header>
);

export default MainNav;
