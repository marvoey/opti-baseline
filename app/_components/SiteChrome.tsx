import Link from 'next/link';
import {
  Calendar,
  ChevronDown,
  Heart,
  MapPin,
  Phone,
  Search,
  ShoppingCart,
  Sparkles,
  User,
} from 'lucide-react';
import LanguageSwitcher from './LanguageSwitcher';

const LOGO_SRC =
  'https://www.flooranddecor.com/on/demandware.static/Sites-floor-decor-Site/-/default/dwf11730a5/img/default-logo.svg';
const LOGO_ALT = 'Floor & Decor: High Quality Flooring and Tile';

const NAV_LINKS = [
  { label: 'Tile & Stone', href: '/tile' },
  { label: 'Wood Flooring', href: '/wood' },
  { label: 'Laminate & Vinyl', href: '/vinyl' },
  { label: 'Featured Product', href: '/featured' },
  { label: 'Inspiration & Rooms', href: '/inspiration' },
  { label: 'Free Design Services', href: '/services' },
];

const FOOTER_COLUMNS = [
  {
    heading: 'Customer Support',
    links: [
      { label: 'Book Free Design Appointment', href: '/services' },
      { label: 'Order Product Samples', href: '/featured' },
      { label: 'Track Store Pickup Order', href: '#track' },
      { label: '90-Day Money Back Guarantee', href: '#returns' },
      { label: 'PRO Premier Loyalty Rewards', href: '#pro' },
    ],
  },
  {
    heading: 'Shop Departments',
    links: [
      { label: 'Porcelain & Ceramic Tile', href: '/tile' },
      { label: 'Waterproof Luxury Vinyl Plank', href: '/vinyl' },
      { label: 'Solid & Engineered Hardwood', href: '/wood' },
      { label: 'Marble & Natural Stone', href: '/stone' },
      { label: 'Mortar, Grout & Leveler', href: '/install' },
    ],
  },
];

const LEGAL_LINKS = ['Privacy Policy', 'Terms of Sale', 'California Supply Chains Act'];

function Logo({ className }: { className: string }) {
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={LOGO_SRC} alt={LOGO_ALT} className={`${className} object-contain`} />;
}

function AnnouncementBar() {
  return (
    <div className="bg-brand-navy text-white text-xs px-4 py-2 border-b border-blue-950">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
        <div className="flex items-center space-x-3">
          <span className="bg-brand-orange font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded">
            Special Value
          </span>
          <span>Over 1,000,000+ sq. ft. in-stock flooring ready for same-day job site pickup.</span>
        </div>
        <div className="flex items-center space-x-6 text-neutral-300">
          <Link href="/services" className="hover:text-white flex items-center gap-1 transition">
            <Calendar className="w-3.5 h-3.5 text-brand-orange" /> Free Design Appointments
          </Link>
          <span className="hidden sm:inline">|</span>
          <span className="hidden sm:flex items-center gap-1">
            <Phone className="w-3.5 h-3.5 text-orange-400" /> Pro Support: 877-675-0002
          </span>
          <LanguageSwitcher />
        </div>
      </div>
    </div>
  );
}

function Header() {
  return (
    <header className="bg-white sticky top-0 z-40 shadow-sm border-b border-neutral-200">
      <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
        <div className="flex items-center gap-6">
          <Link href="/" title={LOGO_ALT} className="flex items-center py-1 focus:outline-none">
            <Logo className="h-8 sm:h-9 md:h-10 w-auto" />
          </Link>

          <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-neutral-200 text-xs">
            <MapPin className="w-4 h-4 text-brand-orange shrink-0" />
            <div className="text-left leading-tight">
              <div className="font-bold text-brand-navy flex items-center gap-1">
                Duluth Superstore <ChevronDown className="w-3 h-3 text-neutral-500" />
              </div>
              <span className="text-neutral-500 text-[11px]">Open Today: 7AM - 9PM</span>
            </div>
          </div>
        </div>

        <form action="/search" className="flex-1 max-w-xl mx-2 relative flex items-center">
          <input
            type="text"
            name="q"
            placeholder="Search tile, wood, vinyl, grout, or SKU..."
            className="w-full bg-neutral-100 border border-neutral-300 text-sm rounded-full pl-4 pr-11 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-brand-orange focus:border-transparent transition"
          />
          <button
            type="submit"
            className="absolute right-1 bg-brand-orange hover:bg-brand-orange-dark text-white p-1.5 rounded-full transition"
            aria-label="Search"
          >
            <Search className="w-4 h-4" />
          </button>
        </form>

        <div className="flex items-center gap-4 text-xs font-semibold text-neutral-700">
          <button className="hidden sm:flex flex-col items-center hover:text-brand-orange transition">
            <User className="w-5 h-5 text-neutral-600 mb-0.5" />
            <span>Sign In</span>
          </button>
          <Link
            href="/inspiration"
            className="hidden sm:flex flex-col items-center hover:text-brand-orange transition"
          >
            <Heart className="w-5 h-5 text-neutral-600 mb-0.5" />
            <span>Saved</span>
          </Link>
          <Link href="/cart" className="relative flex flex-col items-center hover:text-brand-orange transition">
            <ShoppingCart className="w-5 h-5 text-neutral-800" />
            <span className="mt-0.5 font-bold text-brand-navy">Cart</span>
          </Link>
        </div>
      </div>

      <nav className="bg-brand-red border-t border-red-700/40 px-4 text-xs font-bold uppercase tracking-wide text-white shadow-inner">
        <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-none py-2.5 gap-6">
          {NAV_LINKS.map((link) => (
            <Link
              key={link.label}
              href={link.href}
              className="hover:text-white/80 whitespace-nowrap pb-1 border-b-2 border-transparent text-white/90 transition"
            >
              {link.label}
            </Link>
          ))}
          <div className="ml-auto hidden md:flex items-center gap-1.5 text-white bg-black/20 hover:bg-black/30 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition">
            <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Room Visualizer Tool
          </div>
        </div>
      </nav>
    </header>
  );
}

function SiteFooter() {
  return (
    <footer className="text-neutral-700 text-sm mt-16 border-t border-neutral-300">
      <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
        <div>
          <div className="mb-4">
            <Logo className="h-8 w-auto" />
          </div>
          <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
            Leading specialty retailer of hard surface flooring, offering warehouse pricing on
            porcelain, ceramic, natural stone, luxury vinyl, and solid hardwood.
          </p>
          <div className="text-xs text-neutral-500 space-y-1">
            <p>📍 280+ Superstore Showrooms nationwide</p>
            <p>📦 Job-lot quantities stocked in-store today</p>
          </div>
        </div>

        {FOOTER_COLUMNS.map((col) => (
          <div key={col.heading}>
            <h4 className="text-brand-navy font-bold uppercase tracking-wider text-xs mb-3">
              {col.heading}
            </h4>
            <ul className="text-xs space-y-2 text-neutral-600">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="hover:text-brand-orange transition">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}

        <div>
          <h4 className="text-brand-navy font-bold uppercase tracking-wider text-xs mb-3">
            Floor &amp; Decor Demo Architecture
          </h4>
          <div className="bg-white p-3 rounded border border-neutral-200 text-xs shadow-sm">
            <p className="font-semibold text-brand-orange mb-1">Built with Optimizely CMS &amp; Next.js</p>
            <p className="text-neutral-500 text-[11px] leading-relaxed">
              Demonstrates Optimizely Universal Component taxonomy (Hero, Media, Facet Filters, Room
              Pin Hotspots, &amp; Box Calculator).
            </p>
          </div>
        </div>
      </div>

      <div className="py-4 text-center text-xs text-neutral-500 border-t border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <span>© 2026 Floor &amp; Decor Holdings, Inc. All rights reserved.</span>
          <div className="flex gap-4">
            {LEGAL_LINKS.map((label) => (
              <span key={label}>{label}</span>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}

/**
 * Shared static site chrome — announcement bar, sticky header (search, account,
 * mega-nav) and footer — wrapped around a page body. Used by BOTH the published
 * CMS route (app/[locale]/layout) and the /preview experience shell so the
 * Visual Builder preview matches the published page. The body is a `<main
 * className="flex-1">` so the footer sits at the bottom (the layout shell is a
 * `min-h-screen flex flex-col`). Visual design follows app/mock/page.jsx.
 */
export default function SiteChrome({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AnnouncementBar />
      <Header />
      <main className="flex-1">{children}</main>
      <SiteFooter />
    </>
  );
}
