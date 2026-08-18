import Link from 'next/link';

const LS = 'https://www.livingspaces.com/globalassets';
const PROD = `${LS}/productassets`;

const VOYAGE_BASE = `${PROD}/300000-399999/310000-319999/313000-313999/313400-313499/313416/313416_natural_wood_writing_desk`;
const IDRIS_BASE = `${PROD}/300000-399999/370000-379999/375000-375999/375600-375699/375667/375667_brown_wood_wall_desk`;
const ABERDEEN_BASE = `${PROD}/200000-299999/270000-279999/277000-277999/277100-277199/277149/277149_white_wood_desk`;

const TILES = [
  { label: 'Desks',   img: `${VOYAGE_BASE}_signature_01.jpg`,  href: '/departments/furniture/home-office/office-desks' },
  { label: 'Chairs',  img: `${IDRIS_BASE}_signature_01.jpg`,   href: null },
  { label: 'Storage', img: `${ABERDEEN_BASE}_signature_01.jpg`, href: null },
];

export default function HomeOfficeLandingPage() {
  return (
    <main className="max-w-7xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-sm text-ls-gray mb-8 flex-wrap">
        <Link href="/" className="hover:text-blue-700 transition-colors">Home</Link>
        <span>/</span>
        <Link href="/departments/furniture" className="hover:text-blue-700 transition-colors">Furniture</Link>
        <span>/</span>
        <span className="text-ls-charcoal font-medium">Home Office</span>
      </nav>

      {/* Hero */}
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
          <Link
            href="/departments/furniture/home-office/office-desks"
            className="inline-flex bg-blue-200 text-blue-950 font-bold px-7 py-3 rounded-full hover:bg-blue-300 transition-colors"
          >
            Shop Office Desks
          </Link>
        </div>
      </section>

      {/* Shop by Category */}
      <h2 className="font-display font-bold text-xl text-ls-charcoal mb-5">Shop by Category</h2>
      <div className="grid grid-cols-3 gap-6">
        {TILES.map((tile) => {
          const inner = (
            <>
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
            </>
          );

          return tile.href ? (
            <Link
              key={tile.label}
              href={tile.href}
              className="group relative h-56 rounded-xl overflow-hidden block"
            >
              {inner}
            </Link>
          ) : (
            <div
              key={tile.label}
              className="group relative h-56 rounded-xl overflow-hidden cursor-default"
            >
              {inner}
            </div>
          );
        })}
      </div>
    </main>
  );
}
