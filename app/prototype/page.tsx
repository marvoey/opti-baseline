import Link from 'next/link';

const LS = 'https://www.livingspaces.com/globalassets';
const NAV = `${LS}/lp_blocks/2026/06/summern-nav-2026`;
const PROD = `${LS}/productassets`;

const ROOM_TILES = [
  { label: 'Living Room', href: '#', img: `${NAV}/d_01_living_room.jpg` },
  { label: 'Bedroom',     href: '#', img: `${NAV}/d_02_bedroom.jpg` },
  { label: 'Dining',      href: '#', img: `${NAV}/d_04_dining_room.jpg` },
  { label: 'Home Office', href: '/prototype/departments/furniture/home-office', img: `${NAV}/d_05_office.jpg` },
  { label: 'Outdoor',     href: '#', img: `${NAV}/d_07_outdoor.jpg` },
  { label: 'Kids + Teens',href: '#', img: `${NAV}/d_06_kids_teens.jpg` },
];

const FEATURED_PRODUCTS = [
  {
    name: 'Voyage Natural 60" Writing Desk',
    price: '$695',
    rating: '4.8 (246)',
    href: '/prototype/pdp-voyage-writing-desk',
    img: `${PROD}/300000-399999/310000-319999/313000-313999/313400-313499/313416/313416_natural_wood_writing_desk_signature_01.jpg`,
  },
  {
    name: 'Marques Heritage Green 84" Sofa',
    price: '$1,295',
    rating: '4.6 (88)',
    href: '#',
    img: `${PROD}/200000-299999/250000-259999/253000-253999/253500-253599/253568/253568_grey_wicker_sofa_signature_01.jpg`,
  },
  {
    name: 'Dean Sand II Queen Panel Bed',
    price: '$295',
    rating: '4.7 (412)',
    href: '#',
    img: `${PROD}/400000-499999/400000-409999/402000-402999/402400-402499/402411/402411_grey_fabric_chaise_signature_01.jpg`,
  },
  {
    name: 'Mika Natural Oak Dining Table',
    price: '$895',
    rating: '4.5 (134)',
    href: '#',
    img: `${PROD}/200000-299999/270000-279999/277000-277999/277100-277199/277149/277149_white_wood_desk_signature_01.jpg`,
  },
];

export default function PrototypeHomePage() {
  return (
    <main>
      {/* Promo bar */}
      <div className="bg-blue-900 text-white text-sm text-center py-2 px-4">
        60 Month Financing &nbsp;·&nbsp; Free Next-Day Shipping on Furniture &nbsp;·&nbsp; Book an Appointment
      </div>

      {/* Hero */}
      <section className="relative h-[520px] overflow-hidden flex items-center">
        <img
          src={`${LS}/homepage/2026/05/summer/2606_summer_office.jpg`}
          alt="Living Spaces home office"
          className="absolute inset-0 w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-blue-950/60" />
        <div className="relative z-10 max-w-screen-xl mx-auto px-8 w-full">
          <p className="text-blue-200 text-sm font-semibold uppercase tracking-widest mb-3">
            Summer 2026
          </p>
          <h1 className="font-display font-bold text-5xl text-white leading-tight mb-4 max-w-xl">
            Work From Home,<br />In Style
          </h1>
          <p className="text-white/80 text-lg mb-8 max-w-md">
            Discover the Voyage Collection and transform your home office into a space you love.
          </p>
          <div className="flex gap-4">
            <Link
              href="/prototype/departments/furniture/home-office"
              className="bg-blue-200 text-blue-950 font-bold px-8 py-3 rounded-full hover:bg-blue-300 transition-colors"
            >
              Shop Home Office
            </Link>
            <Link
              href="/prototype/departments/furniture"
              className="border border-white text-white font-semibold px-8 py-3 rounded-full hover:bg-white/10 transition-colors"
            >
              Shop All Furniture
            </Link>
          </div>
        </div>
      </section>

      {/* Shop by Room */}
      <section className="max-w-screen-xl mx-auto px-6 py-14">
        <h2 className="font-display font-bold text-2xl text-ls-charcoal mb-6">Shop by Room</h2>
        <div className="grid grid-cols-3 gap-4">
          {ROOM_TILES.map((tile) => (
            <Link key={tile.label} href={tile.href} className="group block relative aspect-[4/3] rounded-lg overflow-hidden bg-ls-light-gray">
              <img
                src={tile.img}
                alt={tile.label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
              <div className="absolute inset-0 bg-blue-950/40 group-hover:bg-blue-950/55 transition-colors" />
              <div className="absolute inset-0 flex items-end p-5">
                <span className="font-display font-bold text-xl text-white">{tile.label}</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Designer banner — Nate + Jeremiah */}
      <section className="bg-blue-900 text-white">
        <div className="max-w-screen-xl mx-auto px-6 py-14 grid grid-cols-2 gap-12 items-center">
          <div>
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-3">
              Exclusive Collection
            </p>
            <h2 className="font-display font-bold text-4xl leading-tight mb-4">
              Nate + Jeremiah<br />For Living Spaces
            </h2>
            <p className="text-white/70 text-base mb-8 max-w-sm">
              Sun-drenched oak, clean lines, and timeless design. The Voyage collection brings designer sensibility to every home.
            </p>
            <Link
              href="/prototype/pdp-voyage-writing-desk"
              className="inline-flex bg-blue-200 text-blue-950 font-bold px-7 py-3 rounded-full hover:bg-blue-300 transition-colors"
            >
              Shop the Voyage Collection
            </Link>
          </div>
          <div className="aspect-[4/3] rounded-lg overflow-hidden">
            <img
              src={`${LS}/homepage/2025/10/2501006_nj_hero_d.jpg`}
              alt="Nate + Jeremiah For Living Spaces"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="max-w-screen-xl mx-auto px-6 py-14">
        <div className="flex justify-between items-baseline mb-6">
          <h2 className="font-display font-bold text-2xl text-ls-charcoal">Featured Products</h2>
          <Link href="/prototype/departments/furniture" className="text-blue-700 text-sm font-semibold hover:underline">
            View All
          </Link>
        </div>
        <div className="grid grid-cols-4 gap-5">
          {FEATURED_PRODUCTS.map((product) => (
            <Link key={product.name} href={product.href} className="group block bg-white border border-ls-border rounded-lg overflow-hidden hover:shadow-md transition-shadow">
              <div className="aspect-square overflow-hidden bg-ls-light-gray">
                <img
                  src={product.img}
                  alt={product.name}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <p className="text-ls-charcoal text-sm font-semibold leading-snug mb-1 group-hover:text-blue-700 transition-colors">
                  {product.name}
                </p>
                <p className="font-bold text-ls-charcoal mb-1">{product.price}</p>
                <p className="text-ls-gray text-xs">{product.rating} reviews</p>
              </div>
            </Link>
          ))}
        </div>
      </section>
    </main>
  );
}
