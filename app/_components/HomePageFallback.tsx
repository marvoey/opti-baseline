import Link from 'next/link';

const LS   = 'https://www.livingspaces.com/globalassets';
const NAV  = `${LS}/lp_blocks/2026/06/summern-nav-2026`;
const PROD = `${LS}/productassets`;

const VOYAGE_BASE   = `${PROD}/300000-399999/310000-319999/313000-313999/313400-313499/313416/313416_natural_wood_writing_desk`;
const IDRIS_BASE    = `${PROD}/300000-399999/370000-379999/375000-375999/375600-375699/375667/375667_brown_wood_wall_desk`;
const MIKKEL_BASE   = `${PROD}/300000-399999/340000-349999/344000-344999/344100-344199/344109/344109_brown_wood_desk`;
const ABERDEEN_BASE = `${PROD}/200000-299999/270000-279999/277000-277999/277100-277199/277149/277149_white_wood_desk`;
const SOFA_BASE     = `${PROD}/200000-299999/250000-259999/253000-253999/253500-253599/253568/253568_grey_wicker_sofa`;
const CHAISE_BASE   = `${PROD}/400000-499999/400000-409999/402000-402999/402400-402499/402411/402411_grey_fabric_chaise`;

// ─── Data ─────────────────────────────────────────────────────────────────────

const CATEGORIES = [
  { name: 'Living Room', href: '#',                                   img: `${NAV}/d_01_living_room.jpg` },
  { name: 'Bedroom',     href: '#',                                   img: `${NAV}/d_02_bedroom.jpg` },
  { name: 'Dining Room', href: '#',                                   img: `${NAV}/d_04_dining_room.jpg` },
  { name: 'Home Office', href: '/departments/furniture/home-office',  img: `${NAV}/d_05_office.jpg` },
  { name: 'Mattresses',  href: '#',                                   img: `${NAV}/d_03_mattresses.jpg` },
  { name: 'Outdoor',     href: '#',                                   img: `${NAV}/d_07_outdoor.jpg` },
];

const FEATURED_PRODUCTS = [
  {
    name:    'Voyage Natural 60" Writing Desk',
    brand:   'Nate + Jeremiah',
    price:   '$695',
    was:     null,
    rating:  '4.8',
    reviews: 246,
    badge:   'Best Seller',
    href:    '/pdp-voyage-writing-desk',
    img:     `${VOYAGE_BASE}_signature_01.jpg`,
  },
  {
    name:    'Idris L-Shaped Executive Desk',
    brand:   'Living Spaces',
    price:   '$1,095',
    was:     '$1,295',
    rating:  '4.6',
    reviews: 88,
    badge:   'Sale',
    href:    '#',
    img:     `${IDRIS_BASE}_signature_01.jpg`,
  },
  {
    name:    'Mikkel 60" Executive Desk',
    brand:   'Living Spaces',
    price:   '$549',
    was:     null,
    rating:  '4.5',
    reviews: 61,
    badge:   null,
    href:    '#',
    img:     `${MIKKEL_BASE}_signature_01.jpg`,
  },
  {
    name:    'Aberdeen 66" Writing Desk',
    brand:   'Living Spaces',
    price:   '$399',
    was:     null,
    rating:  '4.4',
    reviews: 203,
    badge:   'Get it Fast',
    href:    '#',
    img:     `${ABERDEEN_BASE}_signature_01.jpg`,
  },
];

const COLLECTIONS = [
  {
    eyebrow: 'Exclusive Collaboration',
    title:   'Nate + Jeremiah\nFor Living Spaces',
    desc:    'Sun-drenched oak and clean lines. The Voyage collection brings designer sensibility to every home.',
    cta:     'Shop the Collection',
    href:    '/pdp-voyage-writing-desk',
    img:     `${LS}/homepage/2025/10/2501006_nj_hero_d.jpg`,
    light:   false,
  },
  {
    eyebrow: 'Exclusive Brand',
    title:   'Magnolia Home\nBy Joanna Gaines',
    desc:    'Warm farmhouse sensibility meets modern living. Timeless pieces for every room.',
    cta:     'Explore Magnolia Home',
    href:    '#',
    img:     `${LS}/homepage/2026/05/summer/2606_summer_office.jpg`,
    light:   true,
  },
];

const STYLE_TILES = [
  { label: 'Modern',      img: `${VOYAGE_BASE}_room_01.jpg` },
  { label: 'Mid-Century', img: `${IDRIS_BASE}_room_01.jpg` },
  { label: 'Farmhouse',   img: `${ABERDEEN_BASE}_room_01.jpg` },
  { label: 'Coastal',     img: `${SOFA_BASE}_room_01.jpg` },
];

const PROMOS = [
  { icon: '🚚', title: 'Free Next-Day Shipping',  desc: 'On qualifying furniture orders. Select areas.' },
  { icon: '💳', title: '60-Month Financing',       desc: 'No interest if paid in full within 60 months.' },
  { icon: '📐', title: 'Free Design Services',     desc: 'Book an in-store or virtual appointment.' },
  { icon: '🏪', title: '100+ Store Locations',     desc: 'Find a showroom near you.' },
];

// ─── Sub-components ───────────────────────────────────────────────────────────

function StarRating({ rating, reviews }: { rating: string; reviews: number }) {
  const full = Math.round(parseFloat(rating));
  return (
    <p className="flex items-center gap-1 text-xs text-ls-gray">
      <span className="text-amber-400 tracking-tight">
        {'★'.repeat(full)}{'☆'.repeat(5 - full)}
      </span>
      <span>{rating} ({reviews})</span>
    </p>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function HomePageFallback() {
  return (
    <main>
      {/* ── Promo bar ── */}
      <div className="bg-blue-900 text-white text-sm text-center py-2 px-4 tracking-wide">
        60-Month Financing &nbsp;·&nbsp; Free Next-Day Shipping on Furniture &nbsp;·&nbsp; Book a Free Design Appointment
      </div>

      {/* ── Hero ── */}
      <section className="relative h-[540px] overflow-hidden flex items-center">
        <img
          src={`${LS}/homepage/2026/08/labor-day/260811_summer_hero_04_d.jpeg`}
          alt="Labor Day 2026 Collection"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/80 via-blue-950/50 to-transparent" />
        <div className="relative z-10 max-w-7xl mx-auto px-8 w-full">
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-3">
            Labor Day 2026
          </p>
          <h1 className="font-display font-bold text-6xl text-white leading-tight mb-5 max-w-2xl">
            Transform Your Space<br />This Season
          </h1>
          <p className="text-white/75 text-xl mb-9 max-w-lg leading-relaxed">
            Discover the Voyage Collection and elevate every room in your home.
          </p>
          <div className="flex gap-4 flex-wrap">
            <Link
              href="/departments/furniture/home-office"
              className="bg-blue-200 text-blue-950 font-bold px-9 py-3.5 rounded-full hover:bg-blue-100 transition-colors text-base"
            >
              Shop Home Office
            </Link>
            <Link
              href="/departments/furniture"
              className="border-2 border-white text-white font-semibold px-9 py-3.5 rounded-full hover:bg-white/10 transition-colors text-base"
            >
              Shop All Furniture
            </Link>
          </div>
        </div>
      </section>

      {/* ── Shop by Category ── */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <div className="flex justify-between items-baseline mb-6">
          <h2 className="font-display font-bold text-2xl text-ls-charcoal">Shop by Category</h2>
          <Link href="/departments" className="text-blue-700 text-sm font-semibold hover:underline">
            View All Departments
          </Link>
        </div>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.name}
              href={cat.href}
              className={`group block relative aspect-4/5 rounded-xl overflow-hidden bg-ls-light-gray ${
                cat.href !== '#' ? 'ring-2 ring-blue-500 ring-offset-2' : ''
              }`}
            >
              <img
                src={cat.img}
                alt={cat.name}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-blue-950/70 via-blue-950/20 to-transparent group-hover:from-blue-950/80 transition-colors" />
              <div className="absolute inset-0 flex items-end p-3">
                <span className="font-display font-bold text-sm text-white leading-tight">{cat.name}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Designer Collections ── */}
      <section className="max-w-7xl mx-auto px-6 pb-14">
        <h2 className="font-display font-bold text-2xl text-ls-charcoal mb-6">Featured Collections</h2>
        <div className="grid grid-cols-2 gap-6">
          {COLLECTIONS.map((col) => (
            <Link
              key={col.title}
              href={col.href}
              className="group relative aspect-[16/9] rounded-2xl overflow-hidden block"
            >
              <img
                src={col.img}
                alt={col.title}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className={`absolute inset-0 ${col.light ? 'bg-blue-950/50' : 'bg-blue-950/60'} group-hover:bg-blue-950/70 transition-colors`} />
              <div className="absolute inset-0 flex flex-col justify-end p-8">
                <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-2">
                  {col.eyebrow}
                </p>
                <h3 className="font-display font-bold text-2xl text-white mb-2 leading-tight whitespace-pre-line">
                  {col.title}
                </h3>
                <p className="text-white/70 text-sm mb-5 max-w-xs leading-relaxed">{col.desc}</p>
                <span className="self-start bg-blue-200 text-blue-950 font-bold text-sm px-6 py-2.5 rounded-full group-hover:bg-blue-100 transition-colors">
                  {col.cta}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Featured Products ── */}
      <section className="bg-ls-light-gray py-14">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex justify-between items-baseline mb-7">
            <h2 className="font-display font-bold text-2xl text-ls-charcoal">Bestsellers</h2>
            <Link href="/departments/furniture" className="text-blue-700 text-sm font-semibold hover:underline">
              View All
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-5">
            {FEATURED_PRODUCTS.map((p) => (
              <Link
                key={p.name}
                href={p.href}
                className="group flex flex-col bg-white border border-ls-border rounded-xl overflow-hidden hover:shadow-lg transition-shadow"
              >
                <div className="relative aspect-square overflow-hidden bg-ls-light-gray">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {p.badge && (
                    <span className={`absolute top-3 left-3 text-white text-xs font-bold px-2.5 py-1 rounded shadow ${
                      p.badge === 'Sale' ? 'bg-red-600' : p.badge === 'Get it Fast' ? 'bg-green-700' : 'bg-blue-700'
                    }`}>
                      {p.badge}
                    </span>
                  )}
                </div>
                <div className="p-4 flex flex-col gap-1.5 flex-1">
                  <p className="text-ls-gray text-xs">{p.brand}</p>
                  <p className="text-ls-charcoal text-sm font-semibold leading-snug group-hover:text-blue-700 transition-colors">
                    {p.name}
                  </p>
                  <div className="flex items-baseline gap-2 mt-auto pt-2">
                    <span className="font-bold text-ls-charcoal">{p.price}</span>
                    {p.was && <span className="text-ls-gray text-xs line-through">{p.was}</span>}
                  </div>
                  <StarRating rating={p.rating} reviews={p.reviews} />
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Find Your Style ── */}
      <section className="max-w-7xl mx-auto px-6 py-14">
        <h2 className="font-display font-bold text-2xl text-ls-charcoal mb-6">Find Your Style</h2>
        <div className="grid grid-cols-4 gap-4">
          {STYLE_TILES.map((tile) => (
            <Link
              key={tile.label}
              href="#"
              className="group relative aspect-4/3 rounded-xl overflow-hidden bg-ls-light-gray block"
            >
              <img
                src={tile.img}
                alt={tile.label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-blue-950/40 group-hover:bg-blue-950/55 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display font-bold text-xl text-white tracking-wide border-2 border-white/70 px-5 py-2 rounded group-hover:bg-white group-hover:text-blue-950 transition-colors">
                  {tile.label}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Services strip ── */}
      <section className="border-t border-ls-border">
        <div className="max-w-7xl mx-auto px-6 py-10 grid grid-cols-4 gap-6">
          {PROMOS.map((p) => (
            <div key={p.title} className="flex items-start gap-4">
              <span className="text-2xl">{p.icon}</span>
              <div>
                <p className="font-display font-bold text-sm text-ls-charcoal mb-0.5">{p.title}</p>
                <p className="text-ls-gray text-xs leading-relaxed">{p.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </main>
  );
}
