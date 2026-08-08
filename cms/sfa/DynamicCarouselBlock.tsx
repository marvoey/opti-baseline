import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyComponent, getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { sfaContainerWidthSettings } from './sfaDisplaySettings';

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

export const DynamicCarouselBlockDisplayTemplate = displayTemplate({
  key: 'SFA_DynamicCarouselBlockDefault',
  contentType: 'SFA_DynamicCarouselBlock',
  isDefault: true,
  displayName: 'Dynamic Carousel / Slider',
  settings: sfaContainerWidthSettings,
});

type Props = {
  content: ContentProps<typeof DynamicCarouselBlockContentType>;
  displaySettings?: ContentProps<typeof DynamicCarouselBlockDisplayTemplate>;
};

export default function DynamicCarouselBlock({ content, displaySettings }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const items = content.Items ?? [];
  const constrained = displaySettings?.containerWidth === 'constrained';

  return (
    <div {...pa(block)} className={constrained ? 'mx-auto max-w-3xl' : undefined}>
      <section className="w-full py-8">
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
    </div>
  );
}
