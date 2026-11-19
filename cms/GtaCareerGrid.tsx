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

/** One career card. Embedded inside the Career Grid block, not placed on its own. */
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
      isLocalized: true,
      sortOrder: 40,
      items: {
        type: 'component',
        contentType: GtaCareerCardContentType,
      },
    },
  },
});

type Props = { content: ContentProps<typeof GtaCareerGridContentType> };

export default function GtaCareerGrid({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const source = content.Cards ?? [];

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
            <EmptyBlock title="This grid has no cards yet" hint="Add Career Card items to the Cards property." />
          )}
        </div>
      </div>
    </section>
  );
}
