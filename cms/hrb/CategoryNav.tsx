import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyComponent, getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { HrbLinkItemContentType } from './LinkItem';
import { tierProperties } from './shared';

export const HrbCategoryNavContentType = contentType({
  key: 'HRB_CategoryNav',
  baseType: '_component',
  displayName: '[HRB] Category Nav',
  description:
    "H&R Block demo: the Tax Center categories (Life Stages, Work, Taxes 101, Tax Breaks and Money, What's New, All topics), each linking out to hrblock.com. Placed as its own section.",
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Links: {
      type: 'array',
      displayName: 'Links',
      isLocalized: true,
      isRequired: false,
      maxItems: 8,
      items: { type: 'content', allowedTypes: [HrbLinkItemContentType] },
    },
    ...tierProperties(),
  },
});

type Props = { content: ContentProps<typeof HrbCategoryNavContentType> };

export default function CategoryNav({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  return (
    <nav {...pa('Links')} aria-label="Tax Center categories" className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
      {(content.Links ?? []).map((item, i) => (
        <OptimizelyComponent key={i} content={item} />
      ))}
    </nav>
  );
}
