import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import CareerGridClient, { type CareerCard } from '../app/_components/CareerGridClient';
import EmptyBlock from '../app/_components/EmptyBlock';
import { urlOf } from './shared';

const CATEGORIES = [
  { value: 'contact-missions', displayName: 'Contact Missions' },
  { value: 'businesses', displayName: 'Businesses' },
  { value: 'heists', displayName: 'Heists' },
  { value: 'recreation', displayName: 'Recreation' },
  { value: 'series-modes', displayName: 'Series Modes' },
  { value: 'special-interests', displayName: 'Special Interests' },
];

/**
 * One career card. Created as a shared block (in the assets folder) and referenced from the Career Grid,
 * so the same card can be reused and edited in one place. Inline cards are still allowed.
 */
export const GtaCareerCardContentType = contentType({
  key: 'GtaCareerCard',
  baseType: '_component',
  displayName: '[GTA] Career Card',
  description: 'A challenge or activity card in the Career Grid, filed under one category.',
  properties: {
    Title: {
      type: 'string',
      displayName: 'Title',
      isLocalized: true,
      sortOrder: 10,
    },
    Category: {
      type: 'string',
      displayName: 'Category',
      description: 'Which filter tab this card appears under. Every card also appears under All.',
      sortOrder: 20,
      enum: CATEGORIES,
    },
    ImageUrl: {
      type: 'url',
      displayName: 'Image URL',
      description: 'Optional. Without an image the card shows a coloured background for its category.',
      sortOrder: 30,
    },
    Destination: {
      type: 'link',
      displayName: 'Link',
      description: 'Where the card goes. Button text is not shown.',
      isLocalized: true,
      sortOrder: 40,
    },
  },
});

export const GtaCareerGridContentType = contentType({
  key: 'GtaCareerGridBlock',
  baseType: '_component',
  displayName: '[GTA] Career Grid',
  description: 'Grid of career cards with sticky category filter tabs.',
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
    Intro: {
      type: 'string',
      displayName: 'Intro',
      isLocalized: true,
      sortOrder: 20,
    },
    ProgressNote: {
      type: 'string',
      displayName: 'Progress Note',
      description: 'Optional line shown under a progress track on every card, for example Sign in to view progress.',
      isLocalized: true,
      sortOrder: 30,
    },
    Cards: {
      type: 'array',
      displayName: 'Cards',
      description: 'Career Card shared blocks from the assets folder (drag them in), or inline cards.',
      isLocalized: true,
      sortOrder: 40,
      items: {
        // 'content' (not 'component') so items can be shared blocks as well as inline cards.
        // Graph returns referenced shared blocks with their properties, so no extra fetch is needed.
        type: 'content',
        allowedTypes: [GtaCareerCardContentType],
      },
    },
  },
});

type Props = { content: ContentProps<typeof GtaCareerGridContentType> };
/** A card as delivered by Graph. The SDK types 'content' items loosely, so the card shape is stated here. */
type CardData = ContentProps<typeof GtaCareerCardContentType>;

export default function GtaCareerGrid({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  // Shared and inline cards arrive in the same shape; drop anything that isn't a Career Card.
  const source = ((content.Cards ?? []) as unknown as CardData[]).filter(
    (c) => !!c && (!c.__typename || c.__typename === 'GtaCareerCard'),
  );

  const cards: CareerCard[] = source.map((card) => {
    const href = card.Destination?.url?.default || '#';
    return {
      title: card.Title ?? '',
      category: card.Category ?? null,
      imageUrl: urlOf(card.ImageUrl) ?? null,
      href,
      external: /^https?:\/\//i.test(href),
    };
  });

  // Tabs follow the category order above and only list categories that are in use.
  const used = new Set(cards.map((c) => c.category));
  const tabs = CATEGORIES.filter((c) => used.has(c.value)).map((c) => ({
    value: c.value,
    label: c.displayName,
  }));

  return (
    <section {...pa(block)} className="w-full px-6 py-12">
      <div className="mx-auto max-w-7xl">
        {content.Heading || content.Intro ? (
          <header className="mb-8 flex max-w-3xl flex-col gap-3">
            {content.Heading ? (
              <h2 {...pa('Heading')} className="text-3xl font-black tracking-tight md:text-5xl">
                {content.Heading}
              </h2>
            ) : null}
            {content.Intro ? (
              <p {...pa('Intro')} className="text-base leading-relaxed text-rs-muted md:text-lg">
                {content.Intro}
              </p>
            ) : null}
          </header>
        ) : null}

        <div {...pa('Cards')}>
          {cards.length > 0 ? (
            <CareerGridClient tabs={tabs} cards={cards} progressNote={content.ProgressNote} />
          ) : (
            <EmptyBlock title="This grid has no cards yet" hint="Add Career Card shared blocks to the Cards property." />
          )}
        </div>
      </div>
    </section>
  );
}
