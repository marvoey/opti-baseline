import Link from 'next/link';
import { User, Menu, Search, Building2 } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';

const UTILITY_ICONS = { office: Building2, search: Search, headset: Search } as const;

const MainNav = () => (
  <header className="sticky top-0 z-50 bg-white shadow-sm">
    <div className="container mx-auto px-4 flex justify-between items-center h-14">
      <div className="flex items-center gap-8">
        <div className="navbar-brand flex items-center" data-cms-field="brand_logo">
          <Link href="/" title="Go to home page" className="flex items-center">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={siteConfig.logoSrc} alt={siteConfig.logoAlt} className="h-8 w-auto" />
          </Link>
        </div>

        <nav className="hidden lg:flex gap-7 font-semibold text-blue-800 text-sm">
          {siteConfig.mainNavLinks.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-blue-950 hover:underline underline-offset-4 transition-colors"
            >
              {link.label}
            </Link>
          ))}
        </nav>
      </div>

      <div className="flex items-center gap-5">
        {siteConfig.utilityLinks.map((link) => {
          const Icon = UTILITY_ICONS[link.icon];
          return (
            <Link
              key={link.label}
              href={link.href}
              className="hidden md:flex items-center gap-2 text-blue-800 font-medium text-sm hover:text-blue-950 transition-colors"
            >
              <Icon size={16} />
              <span>{link.label}</span>
            </Link>
          );
        })}
        <Link
          href={siteConfig.accountCta.href}
          className="hidden sm:inline-flex items-center gap-2 pl-3 pr-4 py-1.5 bg-blue-800 text-white rounded-full hover:bg-blue-950 transition-colors"
        >
          <User size={16} />
          <span className="flex flex-col text-left leading-tight">
            <span className="text-[10px] font-medium">{siteConfig.accountCta.prefix}</span>
            <span className="text-sm font-bold">{siteConfig.accountCta.label}</span>
          </span>
        </Link>
        <button className="lg:hidden p-2 text-blue-800" aria-label="Menu">
          <Menu size={22} />
        </button>
      </div>
    </div>
  </header>
);

export default MainNav;
