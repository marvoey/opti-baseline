import Link from 'next/link';

const LS = 'https://www.livingspaces.com/globalassets';
const PROD = `${LS}/productassets`;

const SUBCATEGORY_CHIPS = [
  { label: 'Office Chairs', href: '#' },
  { label: 'Office Desks', href: '/departments/furniture/home-office/office-desks' },
  { label: 'Office Sets', href: '#' },
  { label: 'Bookcases', href: '#' },
  { label: 'Filing Cabinets', href: '#' },
  { label: 'Standing Desks', href: '#' },
  { label: 'Gaming Furniture', href: '#' },
];

const VOYAGE_BASE = `${PROD}/300000-399999/310000-319999/313000-313999/313400-313499/313416/313416_natural_wood_writing_desk`;
const IDRIS_BASE = `${PROD}/300000-399999/370000-379999/375000-375999/375600-375699/375667/375667_brown_wood_wall_desk`;
const MIKKEL_BASE = `${PROD}/300000-399999/340000-349999/344000-344999/344100-344199/344109/344109_brown_wood_desk`;
const ABERDEEN_BASE = `${PROD}/200000-299999/270000-279999/277000-277999/277100-277199/277149/277149_white_wood_desk`;

const BESTSELLERS = [
  {
    name: 'Voyage Natural 60" Computer Writing Desk',
    price: '$695',
    rating: '4.8',
    reviews: 246,
    badge: 'Best Seller',
    href: '/pdp-voyage-writing-desk',
    img: `${VOYAGE_BASE}_signature_01.jpg`,
  },
  {
    name: 'Idris 2-Piece L-Shaped Executive Desk',
    price: '$1,095',
    rating: '4.6',
    reviews: 88,
    badge: null,
    href: '#',
    img: `${IDRIS_BASE}_signature_01.jpg`,
  },
  {
    name: 'Mikkel 60" Executive Desk',
    price: '$549',
    rating: '4.5',
    reviews: 61,
    badge: null,
    href: '#',
    img: `${MIKKEL_BASE}_signature_01.jpg`,
  },
  {
    name: 'Aberdeen 66" Writing Desk',
    price: '$399',
    rating: '4.4',
    reviews: 203,
    badge: null,
    href: '#',
    img: `${ABERDEEN_BASE}_signature_01.jpg`,
  },
];

export default function HomeOfficeLandingPage() {
  return (
    <main>
      {/* Breadcrumb */}
      <div className="max-w-screen-xl mx-auto px-6 pt-6">
        <nav className="flex gap-2 items-center text-sm text-ls-gray">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <span>/</span>
          <Link href="/departments/furniture" className="hover:text-blue-700">Furniture</Link>
          <span>/</span>
          <span className="text-ls-charcoal font-medium">Home Office</span>
        </nav>
      </div>

      {/* Hero */}
      <section className="relative h-80 mt-4 flex items-center overflow-hidden">
        <img
          src={`${LS}/images/lp/2025/12/home-office/00_hero_d_1209.jpeg`}
          alt="Home office furniture"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-950/55" />
        <div className="relative z-10 max-w-screen-xl mx-auto px-8 w-full">
          <h1 className="font-display font-bold text-5xl text-white mb-3">Work It Out</h1>
          <p className="text-white/80 text-xl mb-7">Explore office designs built for how you work.</p>
          <Link
            href="/departments/furniture/home-office/office-desks"
            className="inline-flex bg-blue-200 text-blue-950 font-bold px-7 py-3 rounded-full hover:bg-blue-300 transition-colors"
          >
            Shop Office Desks
          </Link>
        </div>
      </section>

      <div className="max-w-screen-xl mx-auto px-6">
        {/* Sub-category chips */}
        <section className="py-8 border-b border-ls-border">
          <h2 className="text-xs font-semibold uppercase tracking-widest text-ls-gray mb-4">Shop by Category</h2>
          <div className="flex flex-wrap gap-3">
            {SUBCATEGORY_CHIPS.map((chip) => (
              <Link
                key={chip.label}
                href={chip.href}
                className="border border-ls-border rounded-full px-5 py-2 text-sm text-ls-charcoal hover:border-blue-700 hover:text-blue-700 transition-colors"
              >
                {chip.label}
              </Link>
            ))}
          </div>
        </section>

        {/* Promo strip */}
        <section className="my-8 bg-blue-800 text-white rounded-xl px-8 py-5 flex items-center justify-between">
          <div>
            <p className="font-display font-bold text-lg">Free Next-Day Shipping on Office Furniture</p>
            <p className="text-white/70 text-sm mt-0.5">On orders $499+. Select items only.</p>
          </div>
          <Link
            href="/departments/furniture/home-office/office-desks"
            className="shrink-0 border border-white text-white text-sm font-semibold px-5 py-2 rounded-full hover:bg-white/10 transition-colors"
          >
            Shop Now
          </Link>
        </section>

        {/* Bestsellers grid */}
        <section className="pb-14">
          <div className="flex justify-between items-baseline mb-6">
            <h2 className="font-display font-bold text-2xl text-ls-charcoal">Bestsellers</h2>
            <Link href="/departments/furniture/home-office/office-desks" className="text-blue-700 text-sm font-semibold hover:underline">
              View All Office Desks
            </Link>
          </div>
          <div className="grid grid-cols-4 gap-5">
            {BESTSELLERS.map((product) => (
              <Link
                key={product.name}
                href={product.href}
                className="group block bg-white border border-ls-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-square overflow-hidden bg-ls-light-gray">
                  <img
                    src={product.img}
                    alt={product.name}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  {product.badge && (
                    <span className="absolute top-3 left-3 bg-blue-700 text-white text-xs font-semibold px-2.5 py-1 rounded">
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-ls-charcoal text-sm font-semibold leading-snug mb-1.5 group-hover:text-blue-700 transition-colors">
                    {product.name}
                  </p>
                  <p className="font-bold text-ls-charcoal mb-1">{product.price}</p>
                  <p className="text-ls-gray text-xs">★ {product.rating} ({product.reviews} reviews)</p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </main>
  );
}
