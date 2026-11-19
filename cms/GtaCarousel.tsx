import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';
import CtaButton from '../app/_components/CtaButton';
import EmptyBlock from '../app/_components/EmptyBlock';
import GtaCarouselClient from '../app/_components/GtaCarouselClient';
import { urlOf } from './shared';

/** One slide. Embedded inside the Feature Carousel block, not placed on its own. */
export const GtaCarouselSlideContentType = contentType({
  key: 'GtaCarouselSlide',
  baseType: '_component',
  displayName: '[GTA] Carousel Slide',
  description: 'A single slide in a Feature Carousel: image, badge, title, rich text and a button.',
  properties: {
    Badge: {
      type: 'string',
      displayName: 'Badge',
      description: 'Small yellow label, for example 2X GTA$ or Limited Time.',
      isLocalized: true,
      sortOrder: 10,
    },
    Title: {
      type: 'string',
      displayName: 'Title',
      isLocalized: true,
      sortOrder: 20,
    },
    Body: {
      type: 'richText',
      displayName: 'Body',
      description: 'Event details. Bullet lists work well here.',
      isLocalized: true,
      sortOrder: 30,
    },
    ImageUrl: {
      type: 'url',
      displayName: 'Image URL',
      sortOrder: 40,
    },
    Cta: {
      type: 'link',
      displayName: 'Button',
      isLocalized: true,
      sortOrder: 50,
    },
  },
});

export const GtaCarouselContentType = contentType({
  key: 'GtaCarouselBlock',
  baseType: '_component',
  displayName: '[GTA] Feature Carousel',
  description: 'One-slide-at-a-time carousel with a counter and previous and next buttons, for example New This Week.',
  // Section-level only: this block holds lists of inline items (array of components), and the CMS does not
  // allow element-enabled blocks to have component properties. It still works in the experience outline
  // and in Page > Content, just not inside a section column.
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Heading: {
      type: 'string',
      displayName: 'Heading',
      isLocalized: true,
      sortOrder: 10,
    },
    Slides: {
      type: 'array',
      displayName: 'Slides',
      isLocalized: true,
      sortOrder: 20,
      items: {
        type: 'component',
        contentType: GtaCarouselSlideContentType,
      },
    },
  },
});

type Props = { content: ContentProps<typeof GtaCarouselContentType> };

export default function GtaCarousel({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  const slides = (content.Slides ?? []).map((slide) => ({
    badge: slide.Badge ?? null,
    title: slide.Title ?? '',
    imageUrl: urlOf(slide.ImageUrl) ?? null,
    body: slide.Body?.json ? <RichTextRenderer content={slide.Body.json} /> : null,
    cta: <CtaButton link={slide.Cta} variant="yellow" className="w-fit" />,
  }));

  const heading = content.Heading ? (
    <h2 {...pa('Heading')} className="text-3xl font-black tracking-tight md:text-5xl">
      {content.Heading}
    </h2>
  ) : null;

  return (
    <section {...pa(block)} className="w-full px-6 py-12">
      <div {...pa('Slides')} className="mx-auto max-w-6xl">
        {slides.length > 0 ? (
          <GtaCarouselClient heading={heading} slides={slides} />
        ) : (
          <>
            {heading}
            <EmptyBlock title="This carousel has no slides yet" hint="Add Carousel Slide items to the Slides property." />
          </>
        )}
      </div>
    </section>
  );
}
