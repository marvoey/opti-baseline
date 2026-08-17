import Link from 'next/link';

const LS = 'https://www.livingspaces.com/globalassets';
const PROD = `${LS}/productassets`;
const VOYAGE = `${PROD}/300000-399999/310000-319999/313000-313999/313400-313499/313416/313416_natural_wood_writing_desk`;

const THUMBNAILS = [
  { src: `${VOYAGE}_signature_01.jpg`, alt: 'Front view' },
  { src: `${VOYAGE}_side_18.jpg`,      alt: 'Side view' },
  { src: `${VOYAGE}_side_19.jpg`,      alt: 'Angled view' },
  { src: `${VOYAGE}_detail_44.jpg`,    alt: 'Detail close-up' },
  { src: `${VOYAGE}_detail_45.jpg`,    alt: 'Leg detail' },
];

const SPECS = [
  { label: 'Dimensions', value: '60"W × 26"D × 31"H' },
  { label: 'Weight', value: '134.5 lbs' },
  { label: 'Assembly', value: '~15 min (attach legs to top)' },
  { label: 'Material', value: 'Knotty white oak veneer & solid hardwood' },
  { label: 'Styles', value: 'Modern, Boho' },
  { label: 'Care', value: 'Wipe with soft damp cloth; no harsh chemicals' },
];

const RELATED = [
  {
    name: 'Voyage 70" L-Shaped Desk',
    price: '$895',
    img: `${PROD}/300000-399999/370000-379999/375000-375999/375600-375699/375666/375666_brown_wood_l-shaped_desk_signature_01.jpg`,
  },
  {
    name: 'Voyage Filing Cabinet',
    price: '$245',
    img: `${PROD}/300000-399999/370000-379999/375000-375999/375600-375699/375667/375667_brown_wood_wall_desk_signature_01.jpg`,
  },
  {
    name: 'Nora Natural Desk',
    price: '$499',
    img: `${PROD}/300000-399999/340000-349999/344000-344999/344100-344199/344109/344109_brown_wood_desk_signature_01.jpg`,
  },
  {
    name: 'Mikkel 60" Executive Desk',
    price: '$549',
    img: `${PROD}/200000-299999/270000-279999/277000-277999/277100-277199/277149/277149_white_wood_desk_signature_01.jpg`,
  },
];

export default function VoyageDeskPdpPage() {
  return (
    <main className="bg-white">
      <div className="max-w-screen-xl mx-auto px-6 py-8">

        {/* Breadcrumb */}
        <nav className="flex gap-2 items-center text-sm text-ls-gray mb-8 flex-wrap">
          <Link href="/" className="hover:text-blue-700">Home</Link>
          <span>/</span>
          <Link href="/departments/furniture" className="hover:text-blue-700">Furniture</Link>
          <span>/</span>
          <Link href="/departments/furniture/home-office" className="hover:text-blue-700">Home Office</Link>
          <span>/</span>
          <Link href="/departments/furniture/home-office/office-desks" className="hover:text-blue-700">Office Desks</Link>
          <span>/</span>
          <span className="text-ls-charcoal font-medium">Voyage Natural 60" Desk</span>
        </nav>

        {/* Main product layout */}
        <div className="grid grid-cols-5 gap-10 mb-16">

          {/* Left: image gallery */}
          <div className="col-span-3 flex gap-3">
            {/* Thumbnail strip */}
            <div className="flex flex-col gap-2 w-[72px] shrink-0">
              {THUMBNAILS.map((thumb, n) => (
                <div
                  key={n}
                  className={`aspect-square rounded overflow-hidden border-2 cursor-pointer bg-ls-light-gray ${n === 0 ? 'border-blue-700' : 'border-transparent hover:border-ls-border'}`}
                >
                  <img src={thumb.src} alt={thumb.alt} className="w-full h-full object-cover" />
                </div>
              ))}
            </div>
            {/* Main image */}
            <div className="flex-1 aspect-[4/3] rounded-xl overflow-hidden bg-ls-light-gray">
              <img
                src={THUMBNAILS[0].src}
                alt='Voyage Natural 60" Writing Desk'
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Right: product info */}
          <div className="col-span-2">
            <p className="text-blue-700 text-xs font-semibold uppercase tracking-widest mb-2">
              Nate + Jeremiah For Living Spaces
            </p>

            <h1 className="font-display font-bold text-2xl text-ls-charcoal leading-snug mb-3">
              Voyage Natural 60" Computer Writing Desk
            </h1>

            <div className="flex items-center gap-2 mb-4">
              <span className="text-blue-700 text-sm">★★★★★</span>
              <Link href="#reviews" className="text-blue-700 text-sm underline hover:text-blue-800">
                246 Reviews
              </Link>
            </div>

            <p className="text-3xl font-bold text-ls-charcoal mb-3">$695.00</p>

            <span className="inline-flex items-center gap-1.5 bg-green-50 text-ls-success text-sm font-medium px-3 py-1.5 rounded-full mb-5">
              <span className="w-2 h-2 rounded-full bg-ls-success" />
              In stock and ready to ship!
            </span>

            <div className="mb-5">
              <p className="text-sm font-semibold text-ls-charcoal mb-2">Color: <span className="font-normal text-ls-gray">Natural Oak</span></p>
              <div className="flex gap-2">
                <button className="w-9 h-9 rounded-full border-2 border-blue-700 bg-amber-100" title="Natural Oak" />
                <button className="w-9 h-9 rounded-full border-2 border-ls-border bg-amber-900 hover:border-ls-charcoal transition-colors" title="Brown" />
              </div>
            </div>

            <div className="flex gap-3 mb-4">
              <div className="flex items-center border border-ls-border rounded-md">
                <button className="px-3 py-2.5 text-ls-charcoal hover:bg-ls-light-gray transition-colors">−</button>
                <span className="px-4 py-2.5 text-sm font-semibold text-ls-charcoal">1</span>
                <button className="px-3 py-2.5 text-ls-charcoal hover:bg-ls-light-gray transition-colors">+</button>
              </div>
              <button className="flex-1 bg-blue-900 text-white font-semibold py-3 rounded-md hover:bg-blue-800 transition-colors">
                Add to Cart
              </button>
            </div>

            <div className="flex gap-4 mb-6">
              <button className="text-blue-700 text-sm hover:underline">♡ Save to Wishlist</button>
              <button className="text-blue-700 text-sm hover:underline">↗ Share</button>
            </div>

            <div className="border border-ls-border rounded-lg p-4">
              <div className="flex items-start gap-3">
                <span className="w-5 h-5 border-2 border-ls-border rounded shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm font-semibold text-ls-charcoal">Add Care Free Protection Plan</p>
                  <p className="text-ls-gray text-xs mt-0.5">5-Year Coverage · $104.25</p>
                </div>
              </div>
            </div>

            <div className="mt-5 space-y-2 text-sm text-ls-gray border-t border-ls-border pt-5">
              <p className="flex items-center gap-2">
                <span className="text-ls-success font-medium">✓</span>
                Free next-day delivery available
              </p>
              <p className="flex items-center gap-2">
                <span className="text-ls-success font-medium">✓</span>
                30-day returns
              </p>
            </div>
          </div>
        </div>

        {/* Product description */}
        <section className="mb-10 max-w-3xl">
          <h2 className="font-display font-bold text-xl text-ls-charcoal mb-4">About This Piece</h2>
          <div className="prose prose-sm text-ls-charcoal">
            <p>
              Introducing the Voyage Natural 60" Computer Writing Desk — a perfect blend of functionality and modern design.
              This beautiful desk in sun-drenched oak features a waterfall edge design, making it an ideal addition to your
              home office, hallway, or entryway.
            </p>
            <p className="mt-3">
              Crafted from knotty white oak veneer and solid hardwood, the Voyage desk brings warmth and character to any
              space. Ample surface area for your monitor, laptop, and workspace essentials — designed by Nate Berkus + Jeremiah Brent exclusively for Living Spaces.
            </p>
          </div>
        </section>

        {/* Specs table */}
        <section className="mb-14">
          <h2 className="font-display font-bold text-xl text-ls-charcoal mb-4">Specifications</h2>
          <div className="border border-ls-border rounded-xl overflow-hidden max-w-2xl">
            {SPECS.map((spec, i) => (
              <div
                key={spec.label}
                className={`flex px-5 py-3.5 text-sm ${i % 2 === 0 ? 'bg-white' : 'bg-ls-light-gray'}`}
              >
                <span className="w-48 shrink-0 font-semibold text-ls-charcoal">{spec.label}</span>
                <span className="text-ls-gray">{spec.value}</span>
              </div>
            ))}
          </div>
        </section>

        {/* Related products */}
        <section className="pb-6">
          <h2 className="font-display font-bold text-xl text-ls-charcoal mb-5">More Like This</h2>
          <div className="grid grid-cols-4 gap-5">
            {RELATED.map((product) => (
              <div key={product.name} className="bg-white border border-ls-border rounded-lg overflow-hidden">
                <div className="aspect-square overflow-hidden bg-ls-light-gray">
                  <img src={product.img} alt={product.name} className="w-full h-full object-cover" />
                </div>
                <div className="p-4">
                  <p className="text-sm font-semibold text-ls-charcoal leading-snug mb-1">{product.name}</p>
                  <p className="font-bold text-ls-charcoal">{product.price}</p>
                </div>
              </div>
            ))}
          </div>
        </section>

      </div>
    </main>
  );
}
