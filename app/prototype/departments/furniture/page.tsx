import Link from 'next/link';

const LS = 'https://www.livingspaces.com/globalassets';
const NAV = `${LS}/lp_blocks/2026/06/summern-nav-2026`;

const DEPT_TILES = [
  { label: 'Living Room', sub: 'Sofas, Sectionals & More', href: '#', img: `${NAV}/d_01_living_room.jpg` },
  { label: 'Bedroom', sub: 'Beds, Dressers & More', href: '#', img: `${NAV}/d_02_bedroom.jpg` },
  { label: 'Dining', sub: 'Tables, Chairs & More', href: '#', img: `${NAV}/d_04_dining_room.jpg` },
  { label: 'Home Office', sub: 'Desks, Chairs & More', href: '/prototype/departments/furniture/home-office', img: `${NAV}/d_05_office.jpg` },
  { label: 'Outdoor', sub: 'Patio & Garden Furniture', href: '#', img: `${NAV}/d_07_outdoor.jpg` },
  { label: 'Mattresses', sub: 'Every Sleep Style', href: '#', img: `${NAV}/d_03_mattresses.jpg` },
];

export default function FurnitureLandingPage() {
  return (
    <main className="max-w-screen-xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex gap-2 items-center text-sm text-ls-gray mb-6">
        <Link href="/prototype" className="hover:text-blue-700">Home</Link>
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
          <p className="text-white/75">Quality pieces for every room in your home.</p>
        </div>
      </section>

      {/* Department grid */}
      <h2 className="font-display font-bold text-xl text-ls-charcoal mb-5">Shop by Department</h2>
      <div className="grid grid-cols-3 gap-5">
        {DEPT_TILES.map((dept) => (
          <Link
            key={dept.label}
            href={dept.href}
            className="group flex flex-col bg-white border border-ls-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
          >
            <div className="aspect-[16/9] overflow-hidden bg-ls-light-gray">
              <img
                src={dept.img}
                alt={dept.label}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
              />
            </div>
            <div className="p-5">
              <p className="font-display font-bold text-lg text-ls-charcoal group-hover:text-blue-700 transition-colors mb-1">
                {dept.label}
              </p>
              <p className="text-ls-gray text-sm">{dept.sub}</p>
            </div>
          </Link>
        ))}
      </div>
    </main>
  );
}
