import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyComponent, getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { sfaContainerWidthSettings, containerWidthClass, sfaContentAlignmentSettings, contentAlignmentClass } from './sfaDisplaySettings';
import { CarouselShell } from './CarouselShell';

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
  settings: { ...sfaContainerWidthSettings, ...sfaContentAlignmentSettings },
});

type Props = {
  content: ContentProps<typeof DynamicCarouselBlockContentType>;
  displaySettings?: ContentProps<typeof DynamicCarouselBlockDisplayTemplate>;
};

export default function DynamicCarouselBlock({ content, displaySettings }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const items = content.Items ?? [];
  const widthClass = containerWidthClass(displaySettings?.containerWidth);
  const alignClass = contentAlignmentClass(displaySettings?.contentAlignment);

  return (
    <div {...pa(block)} className={widthClass}>
      <section className="w-full py-8">
        {content.CarouselTitle && (
          <div className={`flex flex-col ${alignClass}`}>
            <h2 {...pa('CarouselTitle')} className="text-2xl font-bold mb-6">
              {content.CarouselTitle}
            </h2>
          </div>
        )}
        <CarouselShell
          itemCount={items.length}
          showNavigation={content.ShowNavigation}
          trackAttrs={pa('Items')}
        >
          {items.map((item, i) => (
            <div key={i} className="snap-start shrink-0 w-full">
              <OptimizelyComponent content={item} />
            </div>
          ))}
        </CarouselShell>
      </section>
    </div>
  );
}
