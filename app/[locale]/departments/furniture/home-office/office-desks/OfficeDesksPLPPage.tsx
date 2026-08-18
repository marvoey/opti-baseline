import Link from 'next/link';
import Breadcrumb from '@/app/_components/Breadcrumb';

const LS = 'https://www.livingspaces.com/globalassets';
const PROD = `${LS}/productassets`;

const VOYAGE_BASE = `${PROD}/300000-399999/310000-319999/313000-313999/313400-313499/313416/313416_natural_wood_writing_desk`;
const IDRIS_BASE = `${PROD}/300000-399999/370000-379999/375000-375999/375600-375699/375667/375667_brown_wood_wall_desk`;
const MIKKEL_BASE = `${PROD}/300000-399999/340000-349999/344000-344999/344100-344199/344109/344109_brown_wood_desk`;
const ABERDEEN_BASE = `${PROD}/200000-299999/270000-279999/277000-277999/277100-277199/277149/277149_white_wood_desk`;

const DESK_PRODUCTS = [
  { name: 'Voyage Natural 60" Writing Desk',   brand: 'Nate + Jeremiah', price: '$695',   img: `${VOYAGE_BASE}_signature_01.jpg`,   href: '/voyage-natural-60-writing-desk', featured: true },
  { name: 'Idris L-Shaped Executive Desk',     brand: 'Essential',       price: '$1,095', img: `${IDRIS_BASE}_signature_01.jpg`,    href: null, featured: false },
  { name: 'Mikkel 60" Executive Desk',         brand: 'Essential',       price: '$549',   img: `${MIKKEL_BASE}_signature_01.jpg`,   href: null, featured: false },
  { name: 'Aberdeen 66" Writing Desk',         brand: 'Essential',       price: '$399',   img: `${ABERDEEN_BASE}_signature_01.jpg`, href: null, featured: false },
  { name: 'Modern Workspace 5',                brand: 'Essential',       price: '$349',   img: `${MIKKEL_BASE}_signature_01.jpg`,   href: null, featured: false },
  { name: 'Modern Workspace 6',                brand: 'Essential',       price: '$449',   img: `${IDRIS_BASE}_signature_01.jpg`,    href: null, featured: false },
];

const FILTERS = ['Writing Desks', 'Standing Desks', 'Executive Desks', 'L-Shaped Desks'];

export default function OfficeDesksPLPPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      <Breadcrumb crumbs={[
        { label: 'Home', href: '/' },
        { label: 'Home Office', href: '/departments/furniture/home-office' },
        { label: 'Office Desks' },
      ]} />

      {/* Promo Banner */}
      <div className="relative w-full h-56 rounded-lg overflow-hidden flex items-center mb-8">
        <img
          src={`${LS}/homepage/2026/05/summer/2606_summer_office.jpg`}
          alt="Work from Home Upgrade"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950 via-blue-950/90 to-transparent" />
        <div className="relative z-10 p-10 text-white max-w-xl">
          <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-2">Limited Time</p>
          <h2 className="font-display font-bold text-4xl mb-2">Work From Home Upgrade</h2>
          <p className="text-white/70 text-base mb-6">15% off all writing and standing desks this week only.</p>
          <button className="bg-blue-200 text-blue-950 font-bold px-6 py-2.5 rounded-full hover:bg-blue-300 transition-colors text-sm">
            Shop the Sale
          </button>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Filters */}
        <aside className="w-56 shrink-0">
          <h3 className="font-display font-bold text-ls-charcoal mb-4 pb-2 border-b border-ls-border">Filter By</h3>
          <div className="space-y-2.5 text-sm text-ls-charcoal">
            {FILTERS.map((f) => (
              <label key={f} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-ls-border" />
                {f}
              </label>
            ))}
          </div>
        </aside>

        {/* Product Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-display font-bold text-3xl text-ls-charcoal">Office Desks</h1>
            <span className="text-sm text-ls-gray">Showing 42 results</span>
          </div>
          <div className="grid grid-cols-3 gap-5">
            {DESK_PRODUCTS.map((p) => {
              const card = (
                <>
                  <div className="aspect-square overflow-hidden bg-ls-light-gray relative">
                    <img
                      src={p.img}
                      alt={p.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    {p.featured && (
                      <span className="absolute top-2 left-2 bg-blue-700 text-white text-xs font-bold px-2 py-0.5 rounded">
                        Featured
                      </span>
                    )}
                  </div>
                  <div className="p-4">
                    <p className="text-ls-gray text-xs mb-0.5">{p.brand}</p>
                    <p className="text-ls-charcoal text-sm font-semibold leading-snug mb-1 group-hover:text-blue-700 transition-colors">
                      {p.name}
                    </p>
                    <p className="font-bold text-ls-charcoal">{p.price}</p>
                  </div>
                </>
              );

              return p.href ? (
                <Link
                  key={p.name}
                  href={p.href}
                  className="group flex flex-col bg-white border border-blue-400 ring-1 ring-blue-300 rounded-lg overflow-hidden hover:shadow-md transition-shadow"
                >
                  {card}
                </Link>
              ) : (
                <div
                  key={p.name}
                  className="group flex flex-col bg-white border border-ls-border rounded-lg overflow-hidden"
                >
                  {card}
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </main>
  );
}
