import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { FdProductContentType } from './FdProduct';
import { blockNode } from './shared';
import { Check, ShoppingCart, Layers } from 'lucide-react';
import type { ProductData } from '@/app/_components/fd/types';

export const FdProjectBundleContentType = contentType({
  key: 'FdProjectBundle',
  baseType: '_component',
  displayName: 'Floor & Decor Project Bundle (Collection Selling)',
  description: 'Pairs flooring with matching grout, thinset mortar, spacers, and trim profiles.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Heading: { type: 'string', displayName: 'Section Heading', sortOrder: 10 },
    PrimaryProduct: {
      type: 'content',
      displayName: 'Primary Flooring Product',
      allowedTypes: [FdProductContentType],
      sortOrder: 20,
    },
    RecommendedGrout: {
      type: 'content',
      displayName: 'Matching Grout (e.g. Mapei #38 Avalanche)',
      allowedTypes: [FdProductContentType],
      sortOrder: 30,
    },
    RecommendedTrim: {
      type: 'content',
      displayName: 'Transition Profile / Edge Trim (Schluter)',
      allowedTypes: [FdProductContentType],
      sortOrder: 40,
    },
  },
});

export default function FdProjectBundle({ content }: { content: ContentProps<typeof FdProjectBundleContentType> }) {
  const { pa } = getPreviewUtils(content);
  const primary = content.PrimaryProduct as unknown as ProductData | undefined;
  const grout = content.RecommendedGrout as unknown as ProductData | undefined;
  const trim = content.RecommendedTrim as unknown as ProductData | undefined;

  return (
    <section {...pa(blockNode(content))} className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-neutral-200 pb-3">
          <div>
            <span className="text-xs font-bold text-[#df4a26] uppercase flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Complete Your Project Bundle
            </span>
            <h2 {...pa('Heading')} className="text-xl font-black text-[#1b2a4a] mt-0.5">
              {content.Heading || 'Everything Needed to Install This Project'}
            </h2>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded">
            Save 10% When Bundled
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-neutral-200 flex items-center gap-3">
            <div className="w-12 h-12 bg-neutral-100 rounded flex items-center justify-center font-bold text-xs text-neutral-600">
              TILE
            </div>
            <div className="text-xs">
              <div className="font-bold text-[#1b2a4a]">{primary?.Name || 'Selected Flooring Tile'}</div>
              <div className="text-neutral-500">Core Surface Material</div>
              <div className="text-[#df4a26] font-bold mt-0.5">${primary?.PriceSqft?.toFixed(2) || '2.49'} / sq.ft.</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-neutral-200 flex items-center gap-3">
            <div className="w-12 h-12 bg-neutral-100 rounded flex items-center justify-center font-bold text-xs text-neutral-600">
              GROUT
            </div>
            <div className="text-xs">
              <div className="font-bold text-[#1b2a4a]">{grout?.Name || 'Mapei Ultracolor Plus FA (Avalanche #38)'}</div>
              <div className="text-neutral-500">Matches Tile Veining</div>
              <div className="text-[#df4a26] font-bold mt-0.5">$18.99 / 10 lb bag</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-neutral-200 flex items-center gap-3">
            <div className="w-12 h-12 bg-neutral-100 rounded flex items-center justify-center font-bold text-xs text-neutral-600">
              TRIM
            </div>
            <div className="text-xs">
              <div className="font-bold text-[#1b2a4a]">{trim?.Name || 'Schluter Schiene Satin Nickel Profile'}</div>
              <div className="text-neutral-500">Clean Edge Transition</div>
              <div className="text-[#df4a26] font-bold mt-0.5">$14.49 / 8 ft profile</div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-neutral-600 space-y-1">
            <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Pro-calibrated formula based on square footage</div>
            <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> In stock for same-day job site pickup</div>
          </div>
          <button className="bg-[#df4a26] hover:bg-[#c63a18] text-white font-bold text-xs py-3 px-6 rounded-lg shadow transition flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" /> Add Complete Project Kit to Cart
          </button>
        </div>
      </div>
    </section>
  );
}
