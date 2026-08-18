'use client';

const LS = 'https://www.livingspaces.com/globalassets';
const PROD = `${LS}/productassets`;
const VOYAGE_BASE = `${PROD}/300000-399999/310000-319999/313000-313999/313400-313499/313416/313416_natural_wood_writing_desk`;

function CMSBlock({ id, label, children }: { id: string; label: string; children: React.ReactNode }) {
  return (
    <div className="border-2 border-dashed border-blue-400 rounded-lg my-5 bg-blue-50/60">
      <div className="flex items-center gap-2 px-4 pt-3 pb-2 border-b border-dashed border-blue-300">
        <span className="bg-blue-700 text-white text-xs font-bold px-2.5 py-1 rounded shadow-sm">
          CMS Block {id}
        </span>
        <span className="text-blue-700 text-xs font-semibold">{label}</span>
      </div>
      <div className="p-4">{children}</div>
    </div>
  );
}

type Crumb = { label: string; route?: string };

function Breadcrumb({ crumbs, navigate }: { crumbs: Crumb[]; navigate: (r: string) => void }) {
  return (
    <nav className="flex items-center gap-1.5 text-sm text-ls-gray mb-8 flex-wrap">
      {crumbs.map((c, i) => (
        <span key={i} className="flex items-center gap-1.5">
          {i > 0 && <span className="text-ls-gray">/</span>}
          {c.route ? (
            <button onClick={() => navigate(c.route!)} className="hover:text-blue-700 transition-colors">
              {c.label}
            </button>
          ) : (
            <span className="text-ls-charcoal font-medium">{c.label}</span>
          )}
        </span>
      ))}
    </nav>
  );
}

type Props = {
  navigate?: (route: string) => void;
};

export default function PDPView({ navigate = () => {} }: Props) {
  return (
    <div>
      <Breadcrumb
        navigate={navigate}
        crumbs={[
          { label: 'Home', route: '/' },
          { label: 'Home Office', route: '/home-office' },
          { label: 'Office Desks', route: '/office-desks' },
          { label: 'Voyage 60" Writing Desk' },
        ]}
      />

      <div className="grid grid-cols-2 gap-12 mb-16">
        {/* Images */}
        <div className="space-y-3">
          <div className="aspect-4/3 rounded-xl overflow-hidden bg-ls-light-gray">
            <img
              src={`${VOYAGE_BASE}_signature_01.jpg`}
              alt="Voyage Writing Desk"
              className="w-full h-full object-cover"
            />
          </div>
          <div className="grid grid-cols-3 gap-3">
            {['_room_01', '_room_02', '_detail_01'].map((suffix) => (
              <div key={suffix} className="aspect-square rounded-lg overflow-hidden bg-ls-light-gray border border-ls-border">
                <img
                  src={`${VOYAGE_BASE}${suffix}.jpg`}
                  alt="Voyage desk view"
                  className="w-full h-full object-cover"
                />
              </div>
            ))}
          </div>
        </div>

        {/* Details */}
        <div>
          <p className="text-ls-gray text-xs font-semibold uppercase tracking-widest mb-2">Nate + Jeremiah For Living Spaces</p>
          <h1 className="font-display font-bold text-4xl text-ls-charcoal mb-4 leading-tight">
            Voyage Natural 60&quot; Writing Desk
          </h1>

          <div className="flex items-baseline gap-4 mb-2">
            <span className="font-display font-bold text-3xl text-ls-charcoal">$695.00</span>
            <span className="text-sm text-green-700 font-semibold">In Stock</span>
          </div>
          <p className="text-ls-gray text-sm mb-6">★★★★★ 4.8 (246 reviews)</p>

          <p className="text-ls-gray leading-relaxed mb-8">
            Crafted from solid oak with a light, natural finish, the Voyage writing desk brings warmth and
            sophisticated geometry to your home office. Features two soft-close drawers for seamless storage.
          </p>

          <button className="w-full bg-blue-900 text-white font-bold py-4 text-lg rounded-full hover:bg-blue-800 transition-colors mb-4">
            Add to Cart
          </button>

          <CMSBlock id="101" label="RichContentBlock — PDP Disclaimer (managed by Merchandising)">
            <div className="flex items-start gap-3 p-4 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-sm">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <strong>Assembly Required.</strong> Ships in two separate boxes. Please allow 1–2 hours for setup.
              </div>
            </div>
          </CMSBlock>

          <div className="border-t border-ls-border mt-6 pt-6">
            <h3 className="font-display font-bold text-ls-charcoal mb-3">Specifications</h3>
            <ul className="text-sm space-y-2 text-ls-gray">
              <li><span className="text-ls-charcoal font-semibold">Dimensions:</span> 60&quot;W × 28&quot;D × 30&quot;H</li>
              <li><span className="text-ls-charcoal font-semibold">Material:</span> Solid Oak, Veneer</li>
              <li><span className="text-ls-charcoal font-semibold">Weight:</span> 95 lbs</li>
            </ul>
          </div>
        </div>
      </div>

      {/* CMS Enrichment */}
      <CMSBlock id="102" label="RichContentBlock — PDP Enrichment (managed by SEO team)">
        <div className="bg-blue-950 text-white rounded-xl overflow-hidden grid grid-cols-2">
          <div className="p-10 flex flex-col justify-center">
            <p className="text-blue-200 text-xs font-semibold uppercase tracking-widest mb-3">Designer Tip</p>
            <h2 className="font-display font-bold text-3xl mb-4 leading-tight">Styled By<br />Jeremiah Brent</h2>
            <p className="text-white/70 leading-relaxed italic mb-0">
              &ldquo;Keep the surface minimal. Pair it with a highly textured chair — boucle or leather — to
              contrast the sleek oak lines.&rdquo;
            </p>
          </div>
          <div className="aspect-video overflow-hidden">
            <img
              src={`${LS}/homepage/2025/10/2501006_nj_hero_d.jpg`}
              alt="Nate + Jeremiah styling"
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </CMSBlock>
    </div>
  );
}
