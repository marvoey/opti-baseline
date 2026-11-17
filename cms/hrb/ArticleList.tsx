import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { expandReferences, previewContextOf } from '../expandRefs';
import ArticleCard, { HrbArticleCardContentType } from './ArticleCard';
import { tierProperties } from './shared';
import { ExternalLink, hrefOf } from './ui';

export const HrbArticleListContentType = contentType({
  key: 'HRB_ArticleList',
  baseType: '_component',
  displayName: '[HRB] Article List',
  description:
    'H&R Block demo: a heading and a grid of referenced article cards, e.g. "Recent articles." Reuses the shared Article Cards.',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    Heading: { type: 'string', displayName: 'Heading', isLocalized: true, isRequired: false },
    Articles: {
      type: 'array',
      displayName: 'Articles',
      isRequired: false,
      maxItems: 6,
      items: { type: 'contentReference', allowedTypes: [HrbArticleCardContentType] },
    },
    MoreLinkLabel: {
      type: 'string',
      displayName: 'More link label',
      isLocalized: true,
      isRequired: false,
    },
    MoreLinkUrl: { type: 'url', displayName: 'More link URL', isRequired: false },
    ...tierProperties(),
  },
});

type Props = { content: ContentProps<typeof HrbArticleListContentType> };

export default async function ArticleList({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  // Article cards are shared items: Graph delivers only their keys, so fetch them.
  const cards = await expandReferences<ContentProps<typeof HrbArticleCardContentType>>(
    content.Articles,
    previewContextOf(content),
  );

  return (
    <div {...pa(block)}>
      {content.Heading && (
        <h2 {...pa('Heading')} className="mb-5 text-2xl font-semibold">{content.Heading}</h2>
      )}
      <div {...pa('Articles')} className="grid gap-4 md:grid-cols-3">
        {cards.map((card, i) => (
          <ArticleCard key={card._id ?? i} content={card} />
        ))}
      </div>
      {content.MoreLinkLabel && (
        <div className="mt-5 text-sm font-semibold text-blue-800 group-data-[dark=true]:text-blue-400">
          <ExternalLink href={hrefOf(content.MoreLinkUrl)} className="hover:underline">
            {content.MoreLinkLabel} ↗
          </ExternalLink>
        </div>
      )}
    </div>
  );
}
