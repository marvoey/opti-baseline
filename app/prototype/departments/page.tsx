import Link from 'next/link';

const LS = 'https://www.livingspaces.com/globalassets';
const NAV = `${LS}/lp_blocks/2026/06/summern-nav-2026`;

const DEPARTMENTS = [
  { label: 'Living Room',  sub: 'Sofas, Sectionals & More',   href: '#',                                                img: `${NAV}/d_01_living_room.jpg` },
  { label: 'Bedroom',      sub: 'Beds, Dressers & More',       href: '#',                                                img: `${NAV}/d_02_bedroom.jpg` },
  { label: 'Mattresses',   sub: 'Every Sleep Style',           href: '#',                                                img: `${NAV}/d_03_mattresses.jpg` },
  { label: 'Dining Room',  sub: 'Tables, Chairs & More',       href: '#',                                                img: `${NAV}/d_04_dining_room.jpg` },
  { label: 'Home Office',  sub: 'Desks, Seating & Storage',    href: '/prototype/departments/furniture/home-office',     img: `${NAV}/d_05_office.jpg` },
  { label: 'Kids + Teens', sub: 'Beds, Study & Nursery',       href: '#',                                                img: `${NAV}/d_06_kids_teens.jpg` },
  { label: 'Outdoor',      sub: 'Patio & Garden Furniture',    href: '#',                                                img: `${NAV}/d_07_outdoor.jpg` },
  { label: 'Rugs',         sub: 'Every Size, Style & Color',   href: '#',                                                img: `${NAV}/d_08_rugs.jpg` },
  { label: 'Decor',        sub: 'Accents, Lighting & More',    href: '#',                                                img: `${NAV}/d_09_decor.jpg` },
  { label: 'Bedding',      sub: 'Sheets, Quilts & Pillows',    href: '#',                                                img: `${NAV}/d_10_bedding.jpg` },
  { label: 'Bathroom',     sub: 'Vanities, Lighting & Decor',  href: '#',                                                img: `${NAV}/d_11_bathroom.jpg` },
  { label: 'Wall Art',     sub: 'Canvas, Framed & Mirrors',    href: '#',                                                img: `${NAV}/d_12_wall_art.jpg` },
];

const COLLECTIONS = [
  {
    label: 'Nate + Jeremiah',
    desc: 'Exclusive designer collaboration — sun-drenched oak, clean lines.',
    href: '/prototype/pdp-voyage-writing-desk',
    img: `${LS}/homepage/2025/10/2501006_nj_hero_d.jpg`,
  },
  {
    label: 'Magnolia Home',
    desc: "Joanna Gaines' signature warmth — farmhouse to modern.",
    href: '#',
    img: `${LS}/homepage/2026/05/summer/2606_summer_office.jpg`,
  },
];

export default function DepartmentsLandingPage() {
  return (
    <main className="max-w-screen-xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex gap-2 items-center text-sm text-ls-gray mb-6">
        <Link href="/prototype" className="hover:text-blue-700">Home</Link>
        <span>/</span>
        <span className="text-ls-charcoal font-medium">All Departments</span>
      </nav>

      {/* Page heading */}
      <div className="mb-10">
        <h1 className="font-display font-bold text-4xl text-ls-charcoal mb-2">All Departments</h1>
        <p className="text-ls-gray text-base">
          Browse every category — furniture, bedding, rugs, decor, and more.
        </p>
      </div>

      {/* Department grid — 4 columns on wide, 2 on narrow */}
      <section className="mb-16">
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-5">
          {DEPARTMENTS.map((dept) => (
            <Link
              key={dept.label}
              href={dept.href}
              className="group flex flex-col bg-white border border-ls-border rounded-lg overflow-hidden hover:shadow-md transition-shadow"
            >
              <div className="aspect-4/3 overflow-hidden bg-ls-light-gray">
                <img
                  src={dept.img}
                  alt={dept.label}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>
              <div className="p-4">
                <p className="font-display font-bold text-base text-ls-charcoal group-hover:text-blue-700 transition-colors mb-0.5">
                  {dept.label}
                </p>
                <p className="text-ls-gray text-xs">{dept.sub}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Featured Collections */}
      <section className="mb-16">
        <h2 className="font-display font-bold text-2xl text-ls-charcoal mb-5">Featured Collections</h2>
        <div className="grid grid-cols-2 gap-6">
          {COLLECTIONS.map((col) => (
            <Link
              key={col.label}
              href={col.href}
              className="group relative aspect-16/7 rounded-xl overflow-hidden block"
            >
              <img
                src={col.img}
                alt={col.label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-blue-950/50 group-hover:bg-blue-950/60 transition-colors" />
              <div className="absolute inset-0 flex flex-col justify-end p-7">
                <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-1">
                  Exclusive Collection
                </p>
                <h3 className="font-display font-bold text-2xl text-white mb-1">{col.label}</h3>
                <p className="text-white/70 text-sm">{col.desc}</p>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* Special programs strip */}
      <section className="bg-ls-light-gray rounded-xl p-8 flex flex-col sm:flex-row items-center justify-between gap-6 mb-10">
        <div>
          <h2 className="font-display font-bold text-xl text-ls-charcoal mb-1">Custom Upholstery</h2>
          <p className="text-ls-gray text-sm">Choose your fabric, finish, and size on hundreds of pieces.</p>
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-ls-charcoal mb-1">Trade Program</h2>
          <p className="text-ls-gray text-sm">Exclusive pricing and perks for design professionals.</p>
        </div>
        <div>
          <h2 className="font-display font-bold text-xl text-ls-charcoal mb-1">60-Month Financing</h2>
          <p className="text-ls-gray text-sm">Flexible payment options on qualifying purchases.</p>
        </div>
        <Link
          href="#"
          className="shrink-0 bg-blue-900 text-white font-semibold text-sm px-6 py-3 rounded-full hover:bg-blue-800 transition-colors"
        >
          Learn More
        </Link>
      </section>
    </main>
  );
}
