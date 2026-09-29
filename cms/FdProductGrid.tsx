import { blockNode } from './shared';
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import ProductCard from '@/app/_components/fd/ProductCard';
import type { ProductData } from '@/app/_components/fd/types';
import ProductListing from '@/app/_components/fd/ProductListing';
import { FdProductContentType } from './FdProduct';

/** Product grid — home best sellers (compact) or full PLP (`ShowFilters`). */
export const FdProductGridContentType = contentType({
  key: 'FdProductGrid',
  baseType: '_component',
  displayName: 'F&D Product Grid',
  description: 'Heading + grid of products; optionally with a facet sidebar and sort (PLP).',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Eyebrow: { type: 'string', format: 'shortString', displayName: 'Eyebrow', isLocalized: true, sortOrder: 10 },
    Heading: { type: 'string', format: 'shortString', displayName: 'Heading', isLocalized: true, sortOrder: 20 },
    LinkLabel: { type: 'string', format: 'shortString', displayName: 'Link label', isLocalized: true, sortOrder: 30 },
    LinkUrl: { type: 'string', format: 'shortString', displayName: 'Link URL', sortOrder: 40 },
    ShowFilters: { type: 'boolean', displayName: 'Show filters & sort (PLP)', sortOrder: 50 },
    Products: {
      type: 'array',
      displayName: 'Products',
      items: { type: 'content', allowedTypes: [FdProductContentType], restrictedTypes: [] },
      sortOrder: 60,
    },
  },
});

export default function FdProductGrid({ content }: { content: ContentProps<typeof FdProductGridContentType> }) {
  const { pa } = getPreviewUtils(content);
  const products = (content.Products ?? []) as unknown as ProductData[];

  return (
    <section {...pa(blockNode(content))} className="max-w-7xl mx-auto px-4">
      {content.Heading && (
        <div className="flex items-center justify-between mb-6 border-b border-neutral-200 pb-3">
          <div>
            {content.Eyebrow && <span className="text-xs font-bold text-brand-orange uppercase">{content.Eyebrow}</span>}
            <h2 {...pa('Heading')} className="text-2xl font-black tracking-tight text-brand-navy">{content.Heading}</h2>
          </div>
          {content.LinkLabel && (
            <Link href={content.LinkUrl ?? '#'} className="text-brand-orange font-bold text-xs flex items-center gap-1 hover:underline">
              {content.LinkLabel} <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
      <div {...pa('Products')}>
        {content.ShowFilters ? (
          <ProductListing products={products} />
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((p, i) => <ProductCard key={i} product={p} />)}
          </div>
        )}
      </div>
    </section>
  );
}
