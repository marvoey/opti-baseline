import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import ArticleCard, { ArticleCardContentType } from './ArticleCardBlock';

export const CardContainerContentType = contentType({
  key: 'CardContainerBlock',
  baseType: '_component',
  displayName: 'Card Container Block',
  description: 'Acts as a wrapper/layout element for related article cards.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    SectionHeading: {
      type: 'string',
      displayName: 'Section Heading',
      isLocalized: true,
      sortOrder: 10,
    },
    Cards: {
      type: 'array',
      displayName: 'Cards',
      description: 'Restricted content area that only accepts Article Card Blocks.',
      items: {
        type: 'component',
        contentType: ArticleCardContentType,
      },
      sortOrder: 20,
    },
  },
});

type CardItem = ContentProps<typeof ArticleCardContentType>;

type Props = { content: ContentProps<typeof CardContainerContentType> };

export default function CardContainer({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const cards = (content.Cards as CardItem[] | null | undefined) ?? [];

  return (
    <section {...pa(block)} className="w-full px-6 py-12">
      {content.SectionHeading && (
        <h2
          {...pa('SectionHeading')}
          className="mb-8 text-center text-2xl font-bold text-slate-800 dark:text-slate-100"
        >
          {content.SectionHeading}
        </h2>
      )}
      <div {...pa('Cards')} className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card, i) => (
          <ArticleCard key={(card as { _metadata?: { key?: string } })._metadata?.key ?? i} content={card} />
        ))}
      </div>
    </section>
  );
}
