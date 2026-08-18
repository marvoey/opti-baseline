import Link from 'next/link';
import { Navigation, User, Heart, ShoppingCart, Menu } from 'lucide-react';
import { siteConfig } from '@/lib/siteConfig';

const MainNav = () => (
  <header className="sticky top-0 z-50 bg-white border-b border-[#d5d5d5]">
    {/* Row 1: hamburger/space | logo | icons */}
    <div
      className="container mx-auto px-4 lg:px-[15px] grid items-center gap-2 py-4 lg:py-[1.4rem]"
      style={{ gridTemplateColumns: '1fr auto 1fr' }}
    >
      {/* Left: hamburger on mobile, empty on desktop */}
      <div className="flex items-center">
        <button className="lg:hidden p-2 -ml-2 text-[#333]" aria-label="Open menu">
          <Menu size={22} />
        </button>
      </div>

      {/* Center: logo */}
      <div className="text-center" data-cms-field="brand_logo">
        <Link href="/" aria-label="LivingSpaces.com" className="inline-flex justify-center">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={siteConfig.logoSrc}
            alt={siteConfig.logoAlt}
            className="h-[3rem] w-auto sm:h-[3.6rem] lg:h-[4.2rem]"
            style={{ maxWidth: '50vw' }}
          />
        </Link>
      </div>

      {/* Right: icons — cart always visible, others added at wider breakpoints */}
      <div className="flex items-center justify-end gap-4 sm:gap-6 lg:gap-[3.2rem]">
        <button className="hidden lg:flex items-center gap-1 text-[#333] text-[1.3rem] hover:text-[#00699a] transition-colors" aria-label="Find a store">
          <Navigation size={16} strokeWidth={2} />
          <span className="font-semibold">55425</span>
        </button>
        <button className="hidden sm:flex items-center text-[#333] hover:text-[#00699a] transition-colors" aria-label="Account">
          <User size={20} strokeWidth={1.5} />
        </button>
        <button className="hidden sm:flex items-center text-[#333] hover:text-[#00699a] transition-colors" aria-label="Wishlist">
          <Heart size={20} strokeWidth={1.5} />
        </button>
        <button className="flex items-center text-[#333] hover:text-[#00699a] transition-colors" aria-label="Cart">
          <ShoppingCart size={20} strokeWidth={1.5} />
        </button>
      </div>
    </div>

    {/* Row 2: nav links — desktop only, overflow-x scroll on narrow desktop */}
    <div className="hidden lg:block border-t border-[#e8e8e8]">
      <nav className="container mx-auto px-[15px] flex justify-center gap-6 xl:gap-10 py-[0.9rem] overflow-x-auto">
        {siteConfig.mainNavLinks.map((link) => (
          <Link
            key={link.label}
            href={link.href}
            className="text-[#333] text-[1.35rem] hover:text-[#00699a] transition-colors whitespace-nowrap"
          >
            {link.label}
          </Link>
        ))}
      </nav>
    </div>
  </header>
);

export default MainNav;
