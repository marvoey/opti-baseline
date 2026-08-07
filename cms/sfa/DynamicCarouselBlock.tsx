import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyComponent, getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const DynamicCarouselBlockContentType = contentType({
  key: 'SFA_DynamicCarouselBlock',
  baseType: '_component',
  displayName: '(_SFA) Dynamic Carousel / Slider',
  description: 'Container for sliders (Testimonials, Profiles, Galleries).',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    CarouselTitle: {
      type: 'string',
      displayName: 'Section Title',
      isLocalized: true,
      sortOrder: 5,
    },
    Items: {
      type: 'array',
      displayName: 'Carousel Items',
      description: 'Accepts Profile Blocks, Image Blocks, or Testimonial Blocks',
      sortOrder: 10,
      items: { type: 'content', restrictedTypes: [] },
    },
    ShowNavigation: {
      type: 'boolean',
      displayName: 'Show Arrows/Dots',
      sortOrder: 15,
    },
  },
});

type Props = { content: ContentProps<typeof DynamicCarouselBlockContentType> };

export default function DynamicCarouselBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const items = content.Items ?? [];

  return (
    <section {...pa(block)} className="w-full py-8">
      {content.CarouselTitle && (
        <h2 {...pa('CarouselTitle')} className="text-2xl font-bold text-center mb-6">
          {content.CarouselTitle}
        </h2>
      )}
      <div
        {...pa('Items')}
        className="flex gap-6 overflow-x-auto snap-x snap-mandatory pb-4 scroll-smooth"
      >
        {items.map((item, i) => (
          <div key={i} className="snap-start shrink-0">
            <OptimizelyComponent content={item} />
          </div>
        ))}
      </div>
      {content.ShowNavigation && items.length > 1 && (
        <div className="flex justify-center gap-2 mt-4" aria-hidden>
          {items.map((_, i) => (
            <span key={i} className="w-2 h-2 rounded-full bg-gray-400" />
          ))}
        </div>
      )}
    </section>
  );
}
