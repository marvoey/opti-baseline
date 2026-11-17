import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { tierProperties } from './shared';
import { ExternalLink, hrefOf } from './ui';

export const HrbArticleCardContentType = contentType({
  key: 'HRB_ArticleCard',
  baseType: '_component',
  displayName: '[HRB] Article Card',
  description:
    'H&R Block demo: a Tax Center card with a category label and title, linking out to the live article on hrblock.com. Shared item, referenced by the hub, article lists and category pages.',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    CategoryLabel: {
      type: 'string',
      displayName: 'Category label',
      isLocalized: true,
      isRequired: true,
    },
    Title: { type: 'string', displayName: 'Title', isLocalized: true, isRequired: true },
    ArticleUrl: {
      type: 'url',
      displayName: 'Article URL',
      description: 'Live article on hrblock.com. Opens in a new tab.',
      isRequired: true,
    },
    HasVideo: { type: 'boolean', displayName: 'Has video', isRequired: false },
    ...tierProperties(),
  },
});

type Props = { content: ContentProps<typeof HrbArticleCardContentType> };

export default function ArticleCard({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  return (
    <article {...pa(block)} className="h-full">
      <ExternalLink
        href={hrefOf(content.ArticleUrl)}
        className="flex h-full flex-col gap-2 rounded-2xl border border-hrb-border bg-white p-5 text-hrb-ink transition-shadow hover:shadow-md"
      >
        <span {...pa('CategoryLabel')} className="text-[11px] font-semibold uppercase tracking-[0.12em] text-blue-800">
          {content.CategoryLabel}
        </span>
        <span {...pa('Title')} className="text-lg font-semibold leading-snug">{content.Title}</span>
        <span className="mt-auto pt-2 text-sm font-semibold text-blue-800">
          {content.HasVideo ? 'Watch ↗' : 'Read ↗'}
        </span>
      </ExternalLink>
    </article>
  );
}
