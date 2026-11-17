import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyComponent, getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { HrbLinkItemContentType } from './LinkItem';
import { tierProperties } from './shared';

export const HrbQuickLinksContentType = contentType({
  key: 'HRB_QuickLinks',
  baseType: '_component',
  displayName: '[HRB] Quick Links',
  description:
    'H&R Block demo: the home page shortcuts: Work with a tax pro, Do your own taxes, Estimate your refund. Placed as its own section.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Links: {
      type: 'array',
      displayName: 'Links',
      isLocalized: true,
      isRequired: false,
      maxItems: 4,
      items: { type: 'content', allowedTypes: [HrbLinkItemContentType] },
    },
    ...tierProperties(),
  },
});

type Props = { content: ContentProps<typeof HrbQuickLinksContentType> };

export default function QuickLinks({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  return (
    <div {...pa('Links')} className="grid gap-3 md:grid-cols-3">
      {(content.Links ?? []).map((item, i) => (
        <OptimizelyComponent key={i} content={item} />
      ))}
    </div>
  );
}
