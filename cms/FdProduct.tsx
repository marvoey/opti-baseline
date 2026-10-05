import { blockNode } from './shared';
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import ProductCard from '@/app/_components/fd/ProductCard';
import type { ProductData } from '@/app/_components/fd/types';

/**
 * Product — data block (not a section). Embedded/shared, then referenced by
 * FdProductGrid, FdProductDetail and FdShopTheLook. Images is a DAM-backed
 * list of image references; Features is newline-separated text.
 */
export const FdProductContentType = contentType({
  key: 'FdProduct',
  baseType: '_component',
  displayName: 'F&D Product',
  description: 'A flooring/tile product (SKU, price per sq. ft., specs).',
  properties: {
    Sku: { type: 'string', format: 'shortString', displayName: 'SKU', sortOrder: 10 },
    Name: { type: 'string', displayName: 'Name', isRequired: true, sortOrder: 20 },
    Brand: { type: 'string', format: 'shortString', displayName: 'Brand', sortOrder: 30 },
    Size: { type: 'string', format: 'shortString', displayName: 'Nominal Size', sortOrder: 40 },
    SqftPerBox: { type: 'float', displayName: 'Sq. ft. per box', sortOrder: 50 },
    PriceSqft: { type: 'float', displayName: 'Price per sq. ft.', sortOrder: 60 },
    Rating: { type: 'float', displayName: 'Rating', sortOrder: 70 },
    Reviews: { type: 'integer', displayName: 'Review count', sortOrder: 80 },
    Images: {
      type: 'array',
      displayName: 'Product Image Set (DAM)',
      description: 'Select images from Optimizely DAM or the media library. Drag to reorder; first is the primary hero.',
      items: { type: 'contentReference', allowedTypes: ['_image'] },
      sortOrder: 90,
    },
    Material: { type: 'string', format: 'shortString', displayName: 'Material', sortOrder: 100 },
    Finish: { type: 'string', format: 'shortString', displayName: 'Finish', sortOrder: 110 },
    PeiRating: { type: 'string', format: 'shortString', displayName: 'PEI rating', sortOrder: 120 },
    Dcof: { type: 'string', format: 'shortString', displayName: 'Slip resistance (DCOF)', sortOrder: 130 },
    StockCount: { type: 'integer', displayName: 'In-stock sq. ft.', sortOrder: 140 },
    Features: { type: 'string', displayName: 'Features', description: 'One feature per line.', sortOrder: 150 },
    DetailUrl: { type: 'string', format: 'shortString', displayName: 'Detail page URL', sortOrder: 160 },
  },
});

export default function FdProduct({ content }: { content: ContentProps<typeof FdProductContentType> }) {
  const { pa } = getPreviewUtils(content);
  return (
    <div {...pa(blockNode(content))} className="max-w-xs">
      <ProductCard product={content as unknown as ProductData} />
    </div>
  );
}
