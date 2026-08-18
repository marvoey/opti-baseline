'use client';

export type Product = {
  name: string;
  brand: string;
  price: string;
  img: string;
  route: string | null;
};

type Props = {
  products: Product[];
  filters?: string[];
  title?: string;
  resultCount?: number;
  navigate?: (route: string) => void;
};

const DEFAULT_FILTERS = ['Writing Desks', 'Standing Desks', 'Executive Desks', 'L-Shaped Desks'];

export default function ProductGrid({
  products,
  filters = DEFAULT_FILTERS,
  title = 'Office Desks',
  resultCount = 42,
  navigate = () => {},
}: Props) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14 flex gap-8">
      {/* Filters */}
      <aside className="w-56 shrink-0">
        <h3 className="font-display font-bold text-ls-charcoal mb-4 pb-2 border-b border-ls-border">Filter By</h3>
        <div className="space-y-2.5 text-sm text-ls-charcoal">
          {filters.map((f) => (
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
          <h1 className="font-display font-bold text-3xl text-ls-charcoal">{title}</h1>
          <span className="text-sm text-ls-gray">Showing {resultCount} results</span>
        </div>
        <div className="grid grid-cols-3 gap-5">
          {products.map((p) => (
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
  );
}
