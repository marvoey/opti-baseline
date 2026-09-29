import { blockNode } from './shared';
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import ProductDetailView from '@/app/_components/fd/ProductDetailView';
import type { ProductData } from '@/app/_components/fd/types';
import { FdProductContentType } from './FdProduct';

/** PDP section bound to a single Product, with the box/sq-ft calculator. */
export const FdProductDetailContentType = contentType({
  key: 'FdProductDetail',
  baseType: '_component',
  displayName: 'F&D Product Detail',
  description: 'Gallery, price, sq. ft. box calculator, stock and specs for one product.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Product: {
      type: 'content',
      displayName: 'Product',
      allowedTypes: [FdProductContentType],
      restrictedTypes: [],
      sortOrder: 10,
    },
  },
});

export default function FdProductDetail({ content }: { content: ContentProps<typeof FdProductDetailContentType> }) {
  const { pa } = getPreviewUtils(content);
  if (!content.Product) return null;
  return (
    <section {...pa(blockNode(content))} className="max-w-7xl mx-auto px-4 py-6">
      <div {...pa('Product')}>
        <ProductDetailView product={content.Product as unknown as ProductData} />
      </div>
    </section>
  );
}
