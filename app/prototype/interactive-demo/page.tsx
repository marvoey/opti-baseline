'use client';

import { useState } from 'react';

const LS = 'https://www.livingspaces.com/globalassets';
const NAV = `${LS}/lp_blocks/2026/06/summern-nav-2026`;
const PROD = `${LS}/productassets`;

const VOYAGE_BASE = `${PROD}/300000-399999/310000-319999/313000-313999/313400-313499/313416/313416_natural_wood_writing_desk`;
const IDRIS_BASE  = `${PROD}/300000-399999/370000-379999/375000-375999/375600-375699/375667/375667_brown_wood_wall_desk`;
const MIKKEL_BASE = `${PROD}/300000-399999/340000-349999/344000-344999/344100-344199/344109/344109_brown_wood_desk`;
const ABERDEEN_BASE = `${PROD}/200000-299999/270000-279999/277000-277999/277100-277199/277149/277149_white_wood_desk`;

// ─── CMS Block Overlay ────────────────────────────────────────────────────────

function CMSBlock({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="relative border-2 border-dashed border-blue-400 rounded-lg my-5 p-4 bg-blue-50/60">
      <div className="absolute -top-3 left-4 flex items-center gap-2">
        <span className="bg-blue-700 text-white text-xs font-bold px-2.5 py-1 rounded shadow-sm">
          CMS Block {id}
        </span>
        <span className="bg-white border border-blue-300 text-blue-700 text-xs font-semibold px-2 py-1 rounded shadow-sm">
          {label}
        </span>
      </div>
      <div className="mt-2">{children}</div>
    </div>
  );
}

// ─── Breadcrumb ───────────────────────────────────────────────────────────────

type Crumb = { label: string; route?: string };

function Breadcrumb({ crumbs, navigate }: { crumbs: Crumb[]; navigate: (r: string) => void }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-ls-gray mb-8 flex-wrap">
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-ls-gray">/</span>}
          {c.route ? (
            <button
              onClick={() => navigate(c.route!)}
              className="hover:text-blue-700 transition-colors"
            >
              {c.label}
            </button>
          ) : (
            <span className="text-ls-charcoal font-medium">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

// ─── Homepage View ────────────────────────────────────────────────────────────

function HomepageView({ navigate }: { navigate: (r: string) => void }) {
  const categories = [
    { name: 'Living Room', img: `${NAV}/d_01_living_room.jpg`, route: null },
    { name: 'Bedroom',     img: `${NAV}/d_02_bedroom.jpg`,     route: null },
    { name: 'Dining Room', img: `${NAV}/d_04_dining_room.jpg`, route: null },
    { name: 'Home Office', img: `${NAV}/d_05_office.jpg`,      route: '/home-office' },
  ];

  return (
    <div>
      <CMSBlock id="104" label="Hero Banner — scheduled via Optimizely Projects">
        <div
          className="relative w-full h-[420px] rounded-lg overflow-hidden flex items-center cursor-pointer"
          onClick={() => navigate('/home-office')}
        >
          <img
            src={`${LS}/homepage/2026/08/labor-day/260811_summer_hero_04_d.jpeg`}
            alt="Holiday 2026 Collection"
            className="absolute inset-0 w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-blue-950/55" />
          <div className="relative z-10 px-12">
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-3">Labor Day 2026</p>
            <h1 className="font-display font-bold text-5xl text-white leading-tight mb-4 max-w-xl">
              Transform Your Space<br />This Season
            </h1>
            <p className="text-white/80 text-lg mb-8 max-w-md">
              Discover the Voyage Collection and elevate every room in your home.
            </p>
            <button className="bg-blue-200 text-blue-950 font-bold px-8 py-3 rounded-full hover:bg-blue-300 transition-colors">
              Shop Furniture
            </button>
          </div>
        </div>
      </CMSBlock>

      <div className="mt-10">
        <h2 className="font-display font-bold text-2xl text-ls-charcoal mb-6">Shop by Category</h2>
        <div className="grid grid-cols-4 gap-5">
          {categories.map((cat) => (
            <div
              key={cat.name}
              onClick={() => cat.route && navigate(cat.route)}
              className={`group ${cat.route ? 'cursor-pointer ring-2 ring-blue-400 ring-offset-2 rounded-lg' : 'cursor-default'}`}
            >
              <div className="aspect-4/3 rounded-lg overflow-hidden bg-ls-light-gray relative">
                <img
                  src={cat.img}
                  alt={cat.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute inset-0 bg-blue-950/30 group-hover:bg-blue-950/45 transition-colors" />
                <div className="absolute inset-0 flex items-end p-4">
                  <span className="font-display font-bold text-lg text-white">{cat.name}</span>
                </div>
              </div>
              {cat.route && (
                <p className="text-xs text-blue-600 font-semibold text-center mt-2">Click to explore →</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ─── Home Office Landing View ─────────────────────────────────────────────────

function HomeOfficeLandingView({ navigate }: { navigate: (r: string) => void }) {
  const tiles = [
    { label: 'Desks',   img: `${VOYAGE_BASE}_signature_01.jpg`,  route: '/office-desks' },
    { label: 'Chairs',  img: `${IDRIS_BASE}_signature_01.jpg`,   route: null },
    { label: 'Storage', img: `${ABERDEEN_BASE}_signature_01.jpg`, route: null },
  ];

  return (
    <div>
      <Breadcrumb
        navigate={navigate}
        crumbs={[
          { label: 'Home', route: '/' },
          { label: 'Furniture', route: '/' },
          { label: 'Home Office' },
        ]}
      />

      <section className="relative h-72 rounded-xl overflow-hidden flex items-center mb-10">
        <img
          src={`${LS}/images/lp/2025/12/home-office/00_hero_d_1209.jpeg`}
          alt="Home Office Furniture"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-950/55" />
        <div className="relative z-10 px-10">
          <h1 className="font-display font-bold text-5xl text-white mb-3">Work It Out</h1>
          <p className="text-white/80 text-xl mb-7">Explore office designs built for how you work.</p>
          <button
            onClick={() => navigate('/office-desks')}
            className="bg-blue-200 text-blue-950 font-bold px-7 py-3 rounded-full hover:bg-blue-300 transition-colors"
          >
            Shop Office Desks
          </button>
        </div>
      </section>

      <h2 className="font-display font-bold text-xl text-ls-charcoal mb-5">Shop by Category</h2>
      <div className="grid grid-cols-3 gap-6">
        {tiles.map((tile) => (
          <div
            key={tile.label}
            onClick={() => tile.route && navigate(tile.route)}
            className={`group relative h-56 rounded-xl overflow-hidden ${tile.route ? 'cursor-pointer ring-2 ring-blue-400 ring-offset-2' : 'cursor-default'}`}
          >
            <img
              src={tile.img}
              alt={tile.label}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
            />
            <div className="absolute inset-0 bg-blue-950/40 group-hover:bg-blue-950/55 transition-colors" />
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-display font-bold text-3xl text-white tracking-widest border-2 border-white px-6 py-3 group-hover:bg-white group-hover:text-blue-950 transition-colors rounded">
                {tile.label.toUpperCase()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── PLP View (Office Desks) ──────────────────────────────────────────────────

const DESK_PRODUCTS = [
  { name: 'Voyage Natural 60" Writing Desk', brand: 'Nate + Jeremiah', price: '$695', img: `${VOYAGE_BASE}_signature_01.jpg`,   route: '/pdp' },
  { name: 'Idris L-Shaped Executive Desk',   brand: 'Essential',       price: '$1,095', img: `${IDRIS_BASE}_signature_01.jpg`,  route: null },
  { name: 'Mikkel 60" Executive Desk',       brand: 'Essential',       price: '$549', img: `${MIKKEL_BASE}_signature_01.jpg`,   route: null },
  { name: 'Aberdeen 66" Writing Desk',       brand: 'Essential',       price: '$399', img: `${ABERDEEN_BASE}_signature_01.jpg`, route: null },
  { name: 'Modern Workspace 5',              brand: 'Essential',       price: '$349', img: `${MIKKEL_BASE}_signature_01.jpg`,   route: null },
  { name: 'Modern Workspace 6',              brand: 'Essential',       price: '$449', img: `${IDRIS_BASE}_signature_01.jpg`,    route: null },
];

function PLPView({ navigate }: { navigate: (r: string) => void }) {
  return (
    <div>
      <Breadcrumb
        navigate={navigate}
        crumbs={[
          { label: 'Home', route: '/' },
          { label: 'Home Office', route: '/home-office' },
          { label: 'Office Desks' },
        ]}
      />

      <CMSBlock id="103" label="PromoBannerBlock — targeted via Personalization">
        <div className="relative w-full h-56 rounded-lg overflow-hidden flex items-center">
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
      </CMSBlock>

      <div className="flex gap-8 mt-8">
        {/* Filters */}
        <aside className="w-56 shrink-0">
          <h3 className="font-display font-bold text-ls-charcoal mb-4 pb-2 border-b border-ls-border">Filter By</h3>
          <div className="space-y-2.5 text-sm text-ls-charcoal">
            {['Writing Desks', 'Standing Desks', 'Executive Desks', 'L-Shaped Desks'].map((f) => (
              <label key={f} className="flex items-center gap-2 cursor-pointer">
                <input type="checkbox" className="rounded border-ls-border" />
                {f}
              </label>
            ))}
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          <div className="flex justify-between items-center mb-6">
            <h1 className="font-display font-bold text-3xl text-ls-charcoal">Office Desks</h1>
            <span className="text-sm text-ls-gray">Showing 42 results</span>
          </div>
          <div className="grid grid-cols-3 gap-5">
            {DESK_PRODUCTS.map((p) => (
              <div
                key={p.name}
                onClick={() => p.route && navigate(p.route)}
                className={`group flex flex-col bg-white border rounded-lg overflow-hidden transition-shadow ${
                  p.route
                    ? 'border-blue-400 ring-1 ring-blue-300 cursor-pointer hover:shadow-md'
                    : 'border-ls-border cursor-default'
                }`}
              >
                <div className="aspect-square overflow-hidden bg-ls-light-gray relative">
                  <img
                    src={p.img}
                    alt={p.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {p.route && (
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
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ─── PDP View (Voyage Writing Desk) ──────────────────────────────────────────

function PDPView({ navigate }: { navigate: (r: string) => void }) {
  return (
    <div>
      <Breadcrumb
        navigate={navigate}
        crumbs={[
          { label: 'Home', route: '/' },
          { label: 'Home Office', route: '/home-office' },
          { label: 'Office Desks', route: '/office-desks' },
          { label: 'Voyage 60" Writing Desk' },
        ]}
      />

      <div className="grid grid-cols-2 gap-12 mb-16">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-4/3 rounded-xl overflow-hidden bg-ls-light-gray">
            <img
              src={`${VOYAGE_BASE}_signature_01.jpg`}
              alt="Voyage Writing Desk"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['_room_01', '_room_02', '_detail_01'].map((suffix) => (
              <div key={suffix} className="aspect-square rounded-lg overflow-hidden bg-ls-light-gray border border-ls-border">
                <img
                  src={`${VOYAGE_BASE}${suffix}.jpg`}
                  alt="Voyage desk view"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <p className="text-ls-gray text-xs font-semibold uppercase tracking-widest mb-2">Nate + Jeremiah For Living Spaces</p>
          <h1 className="font-display font-bold text-4xl text-ls-charcoal mb-4 leading-tight">
            Voyage Natural 60&quot; Writing Desk
          </h1>

          <div className="flex items-baseline gap-4 mb-2">
            <span className="font-display font-bold text-3xl text-ls-charcoal">$695.00</span>
            <span className="text-sm text-green-700 font-semibold">In Stock</span>
          </div>
          <p className="text-ls-gray text-sm mb-6">★★★★★ 4.8 (246 reviews)</p>

          <p className="text-ls-gray leading-relaxed mb-8">
            Crafted from solid oak with a light, natural finish, the Voyage writing desk brings warmth and
            sophisticated geometry to your home office. Features two soft-close drawers for seamless storage.
          </p>

          <button className="w-full bg-blue-900 text-white font-bold py-4 text-lg rounded-full hover:bg-blue-800 transition-colors mb-4">
            Add to Cart
          </button>

          <CMSBlock id="101" label="RichContentBlock — PDP Disclaimer (managed by Merchandising)">
            <div className="flex items-start gap-3 p-4 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-sm">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <strong>Assembly Required.</strong> Ships in two separate boxes. Please allow 1–2 hours for setup.
              </div>
            </div>
          </CMSBlock>

          <div className="border-t border-ls-border mt-6 pt-6">
            <h3 className="font-display font-bold text-ls-charcoal mb-3">Specifications</h3>
            <ul className="text-sm space-y-2 text-ls-gray">
              <li><span className="text-ls-charcoal font-semibold">Dimensions:</span> 60&quot;W × 28&quot;D × 30&quot;H</li>
              <li><span className="text-ls-charcoal font-semibold">Material:</span> Solid Oak, Veneer</li>
              <li><span className="text-ls-charcoal font-semibold">Weight:</span> 95 lbs</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CMS Enrichment */}
      <CMSBlock id="102" label="RichContentBlock — PDP Enrichment (managed by SEO team)">
        <div className="bg-blue-950 text-white rounded-xl overflow-hidden grid grid-cols-2">
          <div className="p-10 flex flex-col justify-center">
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-3">Designer Tip</p>
            <h2 className="font-display font-bold text-3xl mb-4 leading-tight">Styled By<br />Jeremiah Brent</h2>
            <p className="text-white/70 leading-relaxed italic mb-0">
              &ldquo;Keep the surface minimal. Pair it with a highly textured chair — boucle or leather — to
              contrast the sleek oak lines.&rdquo;
            </p>
          </div>
          <div className="aspect-video overflow-hidden">
            <img
              src={`${LS}/homepage/2025/10/2501006_nj_hero_d.jpg`}
              alt="Nate + Jeremiah styling"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </CMSBlock>
    </div>
  );
}

// ─── Demo Navigation Bar ──────────────────────────────────────────────────────

const DEMO_ROUTES = [
  { label: 'Homepage', route: '/' },
  { label: 'Home Office', route: '/home-office' },
  { label: 'Office Desks (PLP)', route: '/office-desks' },
  { label: 'Voyage Desk (PDP)', route: '/pdp' },
];

// ─── Main App ─────────────────────────────────────────────────────────────────

export default function InteractiveDemo() {
  const [route, setRoute] = useState('/');

  const navigate = (path: string) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setRoute(path);
  };

  const renderView = () => {
    switch (route) {
      case '/':            return <HomepageView navigate={navigate} />;
      case '/home-office': return <HomeOfficeLandingView navigate={navigate} />;
      case '/office-desks': return <PLPView navigate={navigate} />;
      case '/pdp':         return <PDPView navigate={navigate} />;
      default:             return <HomepageView navigate={navigate} />;
    }
  };

  return (
    <div>
      {/* Demo Banner */}
      <div className="bg-blue-900 text-white py-3 px-6 flex items-center justify-between flex-wrap gap-3">
        <div>
          <span className="font-bold text-sm">Interactive CMS Demo</span>
          <span className="text-white/60 text-sm ml-2">— Blue dashed boxes show Optimizely CMS content blocks</span>
        </div>
        <div className="flex items-center gap-1 flex-wrap">
          {DEMO_ROUTES.map((r) => (
            <button
              key={r.route}
              onClick={() => navigate(r.route)}
              className={`text-xs px-3 py-1.5 rounded-full font-semibold transition-colors ${
                route === r.route
                  ? 'bg-white text-blue-900'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {r.label}
            </button>
          ))}
        </div>
      </div>

      {/* Page Content */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {renderView()}
      </main>
    </div>
  );
}
