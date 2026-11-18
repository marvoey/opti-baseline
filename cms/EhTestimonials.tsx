import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import CardScroller from '@/app/_components/CardScroller';
import { expandReferences, previewContextOf } from './expandRefs';
import { TestimonialCard } from './EhTestimonial';

/**
 * "Real experiences. Real confidence." carousel. Pulls its cards from shared
 * EhTestimonial blocks, so editors pick and order stories by reference.
 */
export const EhTestimonialsContentType = contentType({
  key: 'EhTestimonials',
  baseType: '_component',
  displayName: '[eHealth] Testimonials Carousel',
  description: '[EH] Heading plus a scrolling row of customer testimonials, picked from shared [eHealth] Testimonial blocks.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Heading: {
      type: 'string',
      displayName: 'Heading',
      description: 'e.g. "Real experiences. Real confidence.". Leave blank to hide.',
      isLocalized: true,
      sortOrder: 10,
    },
    Items: {
      type: 'array',
      displayName: 'Testimonials',
      description: 'Shared testimonial blocks, shown in this order.',
      sortOrder: 20,
      items: { type: 'contentReference', allowedTypes: ['EhTestimonial'] },
    },
  },
});

type Props = { content: ContentProps<typeof EhTestimonialsContentType> };

export default async function EhTestimonials({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  const items = await expandReferences<Record<string, unknown>>(
    content.Items as Array<{ key?: string | null }> | null,
    previewContextOf(content),
  );

  return (
    <div {...pa(block)} className="w-full px-6 py-10 md:py-14">
      <div className="mx-auto max-w-6xl">
        {content.Heading && (
          <h2
            {...pa('Heading')}
            className="mb-8 text-center font-display text-2xl font-bold text-blue-950 sm:text-3xl"
          >
            {content.Heading}
          </h2>
        )}
        <div {...pa('Items')}>
          {items.length > 0 ? (
            <CardScroller label={content.Heading ?? 'Customer testimonials'}>
              {items.map((item, i) => (
                <TestimonialCard key={i} content={item} />
              ))}
            </CardScroller>
          ) : (
            <p className="rounded border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
              Add testimonials to this carousel.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
