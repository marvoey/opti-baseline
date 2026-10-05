import { blockNode } from './shared';
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import ProductDetailView from '@/app/_components/fd/ProductDetailView';
import { getProductImages, type ProductData } from '@/app/_components/fd/types';
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
    Images: {
      type: 'array',
      displayName: 'Product Image Set (DAM)',
      description: 'Select images from Optimizely DAM or the media library. Drag to reorder; first is the primary hero. Overrides the product\'s own images when set.',
      items: { type: 'contentReference', allowedTypes: ['_image'] },
      sortOrder: 20,
    },
  },
});

export default function FdProductDetail({ content }: { content: ContentProps<typeof FdProductDetailContentType> }) {
  const { pa } = getPreviewUtils(content);
  if (!content.Product) return null;
  // Images on the detail section win; otherwise fall back to the referenced FdProduct's images.
  const detailImages = getProductImages({ Images: content.Images as unknown as ProductData['Images'] }, { pad: false });
  const images = detailImages.length > 0 ? detailImages : undefined;
  return (
    <section {...pa(blockNode(content))} className="max-w-7xl mx-auto px-4 py-6">
      <div {...pa('Product')}>
        <ProductDetailView product={content.Product as unknown as ProductData} images={images} />
      </div>
    </section>
  );
}
