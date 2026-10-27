import Link from 'next/link';
import { User, Menu } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';

const pill =
  'hidden sm:inline-flex items-center gap-2 min-h-11 px-6 rounded-full border-[1.5px] border-blue-700 text-blue-700 font-medium text-base transition-colors hover:bg-blue-300 hover:border-blue-300';

const MainNav = () => (
  <header className="sticky top-0 z-[100] bg-white border-b border-blue-700/10 backdrop-blur-md">
    <div className="mx-auto w-full max-w-[1200px] px-4 lg:px-10 flex justify-between items-center gap-4 h-16 lg:h-20">
      <div className="navbar-brand flex items-center shrink-0" data-cms-field="brand_logo">
        <Link href="/" title="Go to home page" className="flex items-center hover:opacity-90 transition-opacity">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img src={siteConfig.logoSrc} alt={siteConfig.logoAlt} width={83} height={50} className="h-[50px] w-[83px]" />
        </Link>
      </div>

      <nav className="hidden lg:flex flex-1 ml-12 gap-8 font-medium text-blue-700 text-base">
        {siteConfig.mainNavLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="hover:text-blue-500 transition-colors"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <div className="flex items-center gap-3 shrink-0">
        <Link href={siteConfig.primaryCta.href} className={pill}>
          {siteConfig.primaryCta.label}
        </Link>
        <button className={`${pill} bg-blue-50`}>
          <User size={16} />
          <span>{siteConfig.accountLabel}</span>
        </button>
        <button className="lg:hidden p-2 text-blue-700" aria-label="Open menu">
          <Menu size={22} />
        </button>
      </div>
    </div>
  </header>
);

export default MainNav;
