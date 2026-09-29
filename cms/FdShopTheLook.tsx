import { blockNode } from './shared';
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import ShopTheLookView from '@/app/_components/fd/ShopTheLookView';
import type { ProductData } from '@/app/_components/fd/types';
import { FdProductContentType } from './FdProduct';

export const FdHotspotContentType = contentType({
  key: 'FdHotspot',
  baseType: '_component',
  displayName: 'F&D Hotspot',
  properties: {
    PosX: { type: 'float', displayName: 'X position (%)', sortOrder: 10 },
    PosY: { type: 'float', displayName: 'Y position (%)', sortOrder: 20 },
    Label: { type: 'string', format: 'shortString', displayName: 'Label', sortOrder: 30 },
    Product: {
      type: 'content',
      displayName: 'Product',
      allowedTypes: [FdProductContentType],
      restrictedTypes: [],
      sortOrder: 40,
    },
  },
});

/** Room image with product hotspots + "products in this design" list. */
export const FdShopTheLookContentType = contentType({
  key: 'FdShopTheLook',
  baseType: '_component',
  displayName: 'F&D Shop the Look',
  description: 'Room scene with numbered product hotspots.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Eyebrow: { type: 'string', format: 'shortString', displayName: 'Eyebrow', isLocalized: true, sortOrder: 10 },
    Heading: { type: 'string', format: 'shortString', displayName: 'Section heading', isLocalized: true, sortOrder: 20 },
    Intro: { type: 'string', displayName: 'Section intro', isLocalized: true, sortOrder: 30 },
    Title: { type: 'string', format: 'shortString', displayName: 'Look title', isLocalized: true, sortOrder: 40 },
    Designer: { type: 'string', format: 'shortString', displayName: 'Designer', sortOrder: 50 },
    Description: { type: 'string', displayName: 'Look description', isLocalized: true, sortOrder: 60 },
    ImageUrl: { type: 'string', displayName: 'Room image URL', sortOrder: 70 },
    Hotspots: {
      type: 'array',
      displayName: 'Hotspots',
      items: { type: 'component', contentType: FdHotspotContentType },
      sortOrder: 80,
    },
  },
});

export default function FdShopTheLook({ content }: { content: ContentProps<typeof FdShopTheLookContentType> }) {
  const { pa } = getPreviewUtils(content);
  return (
    <section {...pa(blockNode(content))} className="max-w-7xl mx-auto px-4 py-8">
      {content.Heading && (
        <div className="text-center max-w-3xl mx-auto mb-10">
          {content.Eyebrow && <span className="text-xs font-bold text-brand-orange uppercase tracking-widest">{content.Eyebrow}</span>}
          <h1 {...pa('Heading')} className="text-3xl sm:text-4xl font-black text-brand-navy mt-1 mb-3">{content.Heading}</h1>
          <p className="text-neutral-600 text-sm leading-relaxed">{content.Intro}</p>
        </div>
      )}
      <ShopTheLookView
        title={content.Title}
        designer={content.Designer}
        description={content.Description}
        image={content.ImageUrl ?? undefined}
        hotspots={(content.Hotspots ?? []).map((h) => ({
          x: h.PosX ?? 50, y: h.PosY ?? 50, label: h.Label, product: (h.Product ?? null) as unknown as ProductData | null,
        }))}
      />
    </section>
  );
}
