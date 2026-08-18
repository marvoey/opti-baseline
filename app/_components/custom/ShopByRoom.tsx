import Link from 'next/link';

type RoomTile = {
  label: string;
  href: string;
  img: string;
};

type Props = {
  tiles: RoomTile[];
};

export default function ShopByRoom({ tiles }: Props) {
  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14">
      <h2 className="font-display font-bold text-xl sm:text-2xl text-ls-charcoal mb-4 sm:mb-6">Shop by Room</h2>
      <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 sm:gap-4">
        {tiles.map((tile) => (
          <Link key={tile.label} href={tile.href} className="group block relative aspect-4/3 rounded-lg overflow-hidden bg-ls-light-gray">
            <img
              src={tile.img}
              alt={tile.label}
              className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
            />
            <div className="absolute inset-0 bg-blue-950/40 group-hover:bg-blue-950/55 transition-colors" />
            <div className="absolute inset-0 flex items-end p-3 sm:p-5">
              <span className="font-display font-bold text-base sm:text-xl text-white">{tile.label}</span>
            </div>
          </Link>
        ))}
      </div>
    </section>
  );
}
