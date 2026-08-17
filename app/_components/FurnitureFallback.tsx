import Link from 'next/link';

const LS = 'https://www.livingspaces.com/globalassets';
const NAV = `${LS}/lp_blocks/2026/06/summern-nav-2026`;
const PROD = `${LS}/productassets`;

const CATEGORIES = [
  { label: 'Living Room',         sub: 'Sofas, Sectionals & More',  href: '#',                                   img: `${NAV}/d_01_living_room.jpg` },
  { label: 'Bedroom',             sub: 'Beds, Dressers & More',      href: '#',                                   img: `${NAV}/d_02_bedroom.jpg` },
  { label: 'Dining Room',         sub: 'Tables, Chairs & More',      href: '#',                                   img: `${NAV}/d_04_dining_room.jpg` },
  { label: 'Home Office',         sub: 'Desks, Seating & Storage',   href: '/departments/furniture/home-office',  img: `${NAV}/d_05_office.jpg` },
  { label: 'Kids + Teens',        sub: 'Beds, Study & Nursery',      href: '#',                                   img: `${NAV}/d_06_kids_teens.jpg` },
  { label: 'Entertainment',       sub: 'TV Stands & Media Storage',  href: '#',                                   img: `${NAV}/d_01_living_room.jpg` },
  { label: 'Entryway',            sub: 'Benches, Consoles & More',   href: '#',                                   img: `${NAV}/d_02_bedroom.jpg` },
  { label: 'Reclining Furniture', sub: 'Recliners & Power Sofas',    href: '#',                                   img: `${NAV}/d_01_living_room.jpg` },
];

const STYLE_TILES = [
  { label: 'Modern Sofas',     href: '#',                                             img: `${PROD}/200000-299999/250000-259999/253000-253999/253500-253599/253568/253568_grey_wicker_sofa_signature_01.jpg` },
  { label: 'Mid-Century Beds', href: '#',                                             img: `${PROD}/400000-499999/400000-409999/402000-402999/402400-402499/402411/402411_grey_fabric_chaise_signature_01.jpg` },
  { label: 'Farmhouse Dining', href: '#',                                             img: `${PROD}/200000-299999/270000-279999/277000-277999/277100-277199/277149/277149_white_wood_desk_signature_01.jpg` },
  { label: 'Modern Desks',     href: '/departments/furniture/home-office/office-desks', img: `${PROD}/300000-399999/310000-319999/313000-313999/313400-313499/313416/313416_natural_wood_writing_desk_signature_01.jpg` },
];

const FEATURE_TILES = [
  { label: 'Sofa Beds for Small Spaces', href: '#',                                  img: `${PROD}/200000-299999/250000-259999/253000-253999/253500-253599/253568/253568_grey_wicker_sofa_signature_01.jpg` },
  { label: 'Storage Beds',               href: '#',                                  img: `${PROD}/400000-499999/400000-409999/402000-402999/402400-402499/402411/402411_grey_fabric_chaise_signature_01.jpg` },
  { label: 'Round Dining Tables',        href: '#',                                  img: `${PROD}/200000-299999/270000-279999/277000-277999/277100-277199/277149/277149_white_wood_desk_signature_01.jpg` },
  { label: 'Ergonomic Office Chairs',    href: '/departments/furniture/home-office', img: `${PROD}/300000-399999/310000-319999/313000-313999/313400-313499/313416/313416_natural_wood_writing_desk_signature_01.jpg` },
];

const BESTSELLERS = [
  {
    name: 'Voyage Natural 60" Writing Desk',
    price: '$695',
    rating: '4.8',
    reviews: 246,
    badge: 'Get it Fast' as string | null,
    href: '/pdp-voyage-writing-desk',
    img: `${PROD}/300000-399999/310000-319999/313000-313999/313400-313499/313416/313416_natural_wood_writing_desk_signature_01.jpg`,
  },
  {
    name: 'Marques Heritage Green 84" Sofa',
    price: '$1,295',
    rating: '4.6',
    reviews: 88,
    badge: null,
    href: '#',
    img: `${PROD}/200000-299999/250000-259999/253000-253999/253500-253599/253568/253568_grey_wicker_sofa_signature_01.jpg`,
  },
  {
    name: 'Dean Sand II Queen Panel Bed',
    price: '$295',
    rating: '4.7',
    reviews: 412,
    badge: 'Get it Fast' as string | null,
    href: '#',
    img: `${PROD}/400000-499999/400000-409999/402000-402999/402400-402499/402411/402411_grey_fabric_chaise_signature_01.jpg`,
  },
  {
    name: 'Mika Natural Oak Dining Table',
    price: '$895',
    rating: '4.5',
    reviews: 134,
    badge: null,
    href: '#',
    img: `${PROD}/200000-299999/270000-279999/277000-277999/277100-277199/277149/277149_white_wood_desk_signature_01.jpg`,
  },
];

const STARS = (r: string) =>
  '★'.repeat(Math.round(parseFloat(r))) + '☆'.repeat(5 - Math.round(parseFloat(r)));

export default function FurnitureFallback() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex gap-2 items-center text-sm text-ls-gray mb-6">
        <Link href="/" className="hover:text-blue-700">Home</Link>
        <span>/</span>
        <Link href="/departments" className="hover:text-blue-700">All Departments</Link>
        <span>/</span>
        <span className="text-ls-charcoal font-medium">Furniture</span>
      </nav>

      {/* Hero */}
      <section className="relative h-64 rounded-xl mb-12 flex items-center overflow-hidden">
        <img
          src={`${LS}/homepage/2026/08/labor-day/260811_summer_hero_04_d.jpeg`}
          alt="Shop furniture at Living Spaces"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-950/50 rounded-xl" />
        <div className="relative z-10 px-10">
          <h1 className="font-display font-bold text-4xl text-white mb-2">Shop Furniture</h1>
          <p className="text-white/75 mb-5">Quality pieces for every room in your home.</p>
          <div className="flex gap-3 flex-wrap">
            <Link href="#bestsellers" className="bg-blue-200 text-blue-950 font-bold text-sm px-6 py-2.5 rounded-full hover:bg-blue-300 transition-colors">
              Shop Bestsellers
            </Link>
            <Link href="#" className="border border-white text-white font-semibold text-sm px-6 py-2.5 rounded-full hover:bg-white/10 transition-colors">
              Clearance
            </Link>
          </div>
        </div>
      </section>

      {/* Category grid */}
      <section className="mb-14">
        <h2 className="font-display font-bold text-xl text-ls-charcoal mb-5">Shop by Category</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {CATEGORIES.map((cat) => (
            <Link
              key={cat.label}
              href={cat.href}
              className="group flex flex-col bg-white border border-ls-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-4/3 overflow-hidden bg-ls-light-gray">
                <img
                  src={cat.img}
                  alt={cat.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <p className="font-display font-bold text-sm text-ls-charcoal group-hover:text-blue-700 transition-colors">
                  {cat.label}
                </p>
                <p className="text-ls-gray text-xs mt-0.5">{cat.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Find Your Style */}
      <section className="mb-14">
        <h2 className="font-display font-bold text-xl text-ls-charcoal mb-5">Find Your Style</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {STYLE_TILES.map((tile) => (
            <Link
              key={tile.label}
              href={tile.href}
              className="group relative aspect-4/3 rounded-lg overflow-hidden block bg-ls-light-gray"
            >
              <img
                src={tile.img}
                alt={tile.label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-blue-950/40 group-hover:bg-blue-950/55 transition-colors" />
              <div className="absolute inset-0 flex items-end p-4">
                <span className="font-display font-bold text-base text-white leading-snug">{tile.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Bestsellers */}
      <section id="bestsellers" className="mb-14">
        <div className="flex justify-between items-baseline mb-5">
          <h2 className="font-display font-bold text-xl text-ls-charcoal">Bestsellers</h2>
          <Link href="#" className="text-blue-700 text-sm font-semibold hover:underline">View All</Link>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-5">
          {BESTSELLERS.map((p) => (
            <Link
              key={p.name}
              href={p.href}
              className="group flex flex-col bg-white border border-ls-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="relative aspect-square overflow-hidden bg-ls-light-gray">
                <img
                  src={p.img}
                  alt={p.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                {p.badge && (
                  <span className="absolute top-2 left-2 bg-blue-700 text-white text-xs font-semibold px-2 py-0.5 rounded">
                    {p.badge}
                  </span>
                )}
              </div>
              <div className="p-4 flex flex-col gap-1">
                <p className="text-ls-charcoal text-sm font-semibold leading-snug group-hover:text-blue-700 transition-colors">
                  {p.name}
                </p>
                <p className="font-bold text-ls-charcoal">{p.price}</p>
                <p className="text-amber-500 text-xs tracking-tight">
                  {STARS(p.rating)}
                  <span className="text-ls-gray ml-1">({p.reviews})</span>
                </p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Browse by Feature */}
      <section className="mb-14">
        <h2 className="font-display font-bold text-xl text-ls-charcoal mb-5">Browse by Feature</h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {FEATURE_TILES.map((tile) => (
            <Link
              key={tile.label}
              href={tile.href}
              className="group relative aspect-4/3 rounded-lg overflow-hidden block bg-ls-light-gray"
            >
              <img
                src={tile.img}
                alt={tile.label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-blue-950/40 group-hover:bg-blue-950/55 transition-colors" />
              <div className="absolute inset-0 flex items-end p-4">
                <span className="font-display font-bold text-sm text-white leading-snug">{tile.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Nate + Jeremiah promo banner */}
      <section className="bg-blue-900 text-white rounded-xl overflow-hidden mb-14">
        <div className="grid sm:grid-cols-2 gap-0">
          <div className="flex flex-col justify-center p-10">
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-3">Exclusive Collection</p>
            <h2 className="font-display font-bold text-3xl leading-tight mb-3">
              Nate + Jeremiah<br />For Living Spaces
            </h2>
            <p className="text-white/70 text-sm mb-7 max-w-sm">
              Sun-drenched oak, clean lines, and timeless design. The Voyage collection brings designer sensibility to every home.
            </p>
            <Link
              href="/pdp-voyage-writing-desk"
              className="self-start bg-blue-200 text-blue-950 font-bold text-sm px-7 py-3 rounded-full hover:bg-blue-300 transition-colors"
            >
              Shop Voyage Collection
            </Link>
          </div>
          <div className="aspect-video sm:aspect-auto overflow-hidden">
            <img
              src={`${LS}/homepage/2025/10/2501006_nj_hero_d.jpg`}
              alt="Nate + Jeremiah For Living Spaces"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Build Your Own + Custom Fabrics strip */}
      <section className="grid sm:grid-cols-2 gap-5 mb-10">
        <Link href="#" className="flex items-center gap-5 bg-ls-light-gray rounded-xl p-6 hover:bg-ls-border transition-colors">
          <span className="text-3xl">🛋️</span>
          <div>
            <p className="font-display font-bold text-ls-charcoal mb-0.5">Build Your Own Sectional</p>
            <p className="text-ls-gray text-sm">Mix and match modules to fit your space exactly.</p>
          </div>
        </Link>
        <Link href="#" className="flex items-center gap-5 bg-ls-light-gray rounded-xl p-6 hover:bg-ls-border transition-colors">
          <span className="text-3xl">🎨</span>
          <div>
            <p className="font-display font-bold text-ls-charcoal mb-0.5">Custom Fabrics</p>
            <p className="text-ls-gray text-sm">Choose your color and fabric on hundreds of pieces.</p>
          </div>
        </Link>
      </section>
    </main>
  );
}
