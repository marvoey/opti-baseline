import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyComponent, getPreviewUtils } from '@optimizely/cms-sdk/react/server';

const LS = 'https://www.livingspaces.com/globalassets';
const PROD = `${LS}/productassets`;
const VOYAGE_BASE = `${PROD}/300000-399999/310000-319999/313000-313999/313400-313499/313416/313416_natural_wood_writing_desk`;

export const PDPViewContentType = contentType({
  key: 'PDPView',
  baseType: '_component',
  displayName: 'Product Details',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Disclaimer: {
      type: 'content',
      displayName: 'Disclaimer',
      isLocalized: true,
      isRequired: false,
      allowedTypes: [],
    },
    Enrichment: {
      type: 'array',
      displayName: 'Enrichment',
      isLocalized: true,
      isRequired: false,
      items: { type: 'content', allowedTypes: [] },
    },
  },
});

type Props = { content: ContentProps<typeof PDPViewContentType> };

export default function PDPView({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  return (
    <div {...pa(block)}>
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

          {content.Disclaimer && (
            <div className="flex items-start gap-3 p-4 bg-amber-50 text-amber-900 border border-amber-200 rounded-lg text-sm my-4">
              <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
              <div>
                <OptimizelyComponent content={content.Disclaimer} displaySettings={{ Disclaimer: true }} />
              </div>
            </div>
          )}

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

      {(content.Enrichment as { __typename: string }[])?.map((e, i) => (
        <OptimizelyComponent key={i} content={e} />
      ))}
    </div>
  );
}
