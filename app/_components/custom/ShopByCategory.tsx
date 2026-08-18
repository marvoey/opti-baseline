import Link from 'next/link';

type CategoryTile = {
  label: string;
  img: string;
  href: string | null;
};

type Props = {
  tiles: CategoryTile[];
};

export default function ShopByCategory({ tiles }: Props) {
  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <h2 className="font-display font-bold text-lg sm:text-xl text-ls-charcoal mb-4 sm:mb-5">Shop by Category</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6">
        {tiles.map((tile) => {
          const inner = (
            <>
              <img
                src={tile.img}
                alt={tile.label}
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-blue-950/40 group-hover:bg-blue-950/55 transition-colors" />
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="font-display font-bold text-xl sm:text-3xl text-white tracking-widest border-2 border-white px-4 sm:px-6 py-2 sm:py-3 group-hover:bg-white group-hover:text-blue-950 transition-colors rounded">
                  {tile.label.toUpperCase()}
                </span>
              </div>
            </>
          );

          return tile.href ? (
            <Link
              key={tile.label}
              href={tile.href}
              className="group relative h-44 sm:h-56 rounded-xl overflow-hidden block ring-2 ring-blue-400 ring-offset-2"
            >
              {inner}
            </Link>
          ) : (
            <div
              key={tile.label}
              className="group relative h-44 sm:h-56 rounded-xl overflow-hidden cursor-default"
            >
              {inner}
            </div>
          );
        })}
      </div>
    </div>
  );
}
