import Link from 'next/link';

const LS = 'https://www.livingspaces.com/globalassets';
const PROD = `${LS}/productassets`;

const FILTER_GROUPS = [
  { label: 'Features', count: 212 },
  { label: 'Color Family', count: 15 },
  { label: 'Style', count: 8 },
  { label: 'Price Range', count: null },
  { label: 'Dimensions', count: null },
  { label: 'Material', count: 22 },
];

const PRODUCTS = [
  {
    name: 'Voyage Natural 60" Computer Writing Desk',
    price: '$695',
    rating: '4.8',
    reviews: 246,
    badge: 'Best Seller',
    stock: 'In Stock · Ships Tomorrow',
    href: '/prototype/pdp-voyage-writing-desk',
    featured: true,
    img: `${PROD}/300000-399999/310000-319999/313000-313999/313400-313499/313416/313416_natural_wood_writing_desk_signature_01.jpg`,
  },
  {
    name: 'Voyage Natural 70" L-Shaped Desk',
    price: '$895',
    rating: '4.7',
    reviews: 118,
    badge: null,
    stock: 'In Stock',
    href: '#',
    featured: false,
    img: `${PROD}/300000-399999/370000-379999/375000-375999/375600-375699/375666/375666_brown_wood_l-shaped_desk_signature_01.jpg`,
  },
  {
    name: 'Nora Brown Desk with USB',
    price: '$449',
    rating: '4.5',
    reviews: 74,
    badge: null,
    stock: 'In Stock',
    href: '#',
    featured: false,
    img: `${PROD}/300000-399999/340000-349999/344000-344999/344100-344199/344109/344109_brown_wood_desk_signature_01.jpg`,
  },
  {
    name: 'Mikkel 60" Executive Desk',
    price: '$549',
    rating: '4.5',
    reviews: 61,
    badge: null,
    stock: 'In Stock · Ships Tomorrow',
    href: '#',
    featured: false,
    img: `${PROD}/200000-299999/270000-279999/277000-277999/277100-277199/277150/277150_white_wood_desk_signature_01.jpg`,
  },
  {
    name: 'Aberdeen 66" Executive Writing Desk',
    price: '$399',
    rating: '4.4',
    reviews: 203,
    badge: 'Clearance',
    stock: 'Limited Stock',
    href: '#',
    featured: false,
    img: `${PROD}/200000-299999/270000-279999/277000-277999/277100-277199/277149/277149_white_wood_desk_signature_01.jpg`,
  },
  {
    name: 'Voyage 60" Peninsula Writing Desk',
    price: '$795',
    rating: '4.6',
    reviews: 42,
    badge: 'New',
    stock: 'In Stock',
    href: '#',
    featured: false,
    img: `${PROD}/300000-399999/370000-379999/375000-375999/375600-375699/375667/375667_brown_wood_wall_desk_signature_01.jpg`,
  },
];

export default function OfficeDesksPlpPage() {
  return (
    <main className="max-w-screen-xl mx-auto px-6 py-8">
      {/* Breadcrumb */}
      <nav className="flex gap-2 items-center text-sm text-ls-gray mb-6">
        <Link href="/prototype" className="hover:text-blue-700">Home</Link>
        <span>/</span>
        <Link href="/prototype/departments/furniture" className="hover:text-blue-700">Furniture</Link>
        <span>/</span>
        <Link href="/prototype/departments/furniture/home-office" className="hover:text-blue-700">Home Office</Link>
        <span>/</span>
        <span className="text-ls-charcoal font-medium">Office Desks</span>
      </nav>

      {/* Heading + sort bar */}
      <div className="flex items-end justify-between mb-8">
        <div>
          <h1 className="font-display font-bold text-3xl text-ls-charcoal">Office Desks</h1>
          <p className="text-ls-gray text-sm mt-1">312 items starting at $80</p>
        </div>
        <div className="flex items-center gap-3">
          <span className="text-ls-gray text-sm">Showing 1–6 of 312</span>
          <div className="border border-ls-border rounded px-3 py-2 text-sm text-ls-charcoal">
            Sort by: Highest Rating ▾
          </div>
        </div>
      </div>

      <div className="flex gap-8">
        {/* Sidebar filters */}
        <aside className="w-64 shrink-0">
          <p className="font-semibold text-ls-charcoal text-sm mb-4 uppercase tracking-wide">Filter</p>
          <div className="space-y-0">
            {FILTER_GROUPS.map((group, i) => (
              <div key={group.label} className="border-b border-ls-border py-4">
                <button className="w-full flex justify-between items-center text-left">
                  <span className="text-sm font-semibold text-ls-charcoal">{group.label}</span>
                  <div className="flex items-center gap-2">
                    {group.count && (
                      <span className="text-xs text-ls-gray">({group.count})</span>
                    )}
                    <span className="text-ls-gray text-lg leading-none">{i === 0 ? '−' : '+'}</span>
                  </div>
                </button>
                {i === 0 && (
                  <div className="mt-3 space-y-2">
                    {['With Drawers', 'With Hutch', 'With USB Ports', 'L-Shaped', 'Standing / Height Adjustable'].map((feat) => (
                      <label key={feat} className="flex items-center gap-2 text-sm text-ls-charcoal cursor-pointer">
                        <span className="w-4 h-4 border border-ls-border rounded shrink-0" />
                        {feat}
                      </label>
                    ))}
                  </div>
                )}
              </div>
            ))}
          </div>
        </aside>

        {/* Product grid */}
        <div className="flex-1">
          <div className="grid grid-cols-3 gap-5">
            {PRODUCTS.map((product) => (
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
                    <span className={`absolute top-3 left-3 text-white text-xs font-semibold px-2.5 py-1 rounded ${
                      product.badge === 'Best Seller' ? 'bg-blue-700' :
                      product.badge === 'Clearance' ? 'bg-ls-price' :
                      'bg-ls-success'
                    }`}>
                      {product.badge}
                    </span>
                  )}
                </div>
                <div className="p-4">
                  <p className="text-ls-charcoal text-sm font-semibold leading-snug mb-1.5 group-hover:text-blue-700 transition-colors">
                    {product.name}
                  </p>
                  <p className="font-bold text-ls-charcoal text-base mb-1">{product.price}</p>
                  <p className="text-ls-gray text-xs mb-1.5">★ {product.rating} ({product.reviews} reviews)</p>
                  <p className={`text-xs font-medium ${product.stock.startsWith('In Stock') ? 'text-ls-success' : 'text-ls-gray'}`}>
                    {product.stock}
                  </p>
                  {product.featured && (
                    <button className="mt-3 w-full bg-blue-900 text-white text-sm font-semibold py-2 rounded hover:bg-blue-800 transition-colors">
                      Add to Cart
                    </button>
                  )}
                </div>
              </Link>
            ))}
          </div>

          {/* Pagination */}
          <div className="flex justify-center gap-1 mt-10">
            {[1, 2, 3, 4, 5, 6, 7].map((page) => (
              <button
                key={page}
                className={`w-9 h-9 rounded text-sm font-medium ${
                  page === 1
                    ? 'bg-blue-900 text-white'
                    : 'text-ls-charcoal hover:bg-ls-light-gray'
                }`}
              >
                {page}
              </button>
            ))}
            <button className="px-4 h-9 rounded text-sm font-medium text-ls-charcoal hover:bg-ls-light-gray">
              Next →
            </button>
          </div>
        </div>
      </div>
    </main>
  );
}
