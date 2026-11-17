import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyComponent, getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { HrbStatItemContentType } from './StatItem';
import { tierProperties } from './shared';

export const HrbTrustBarContentType = contentType({
  key: 'HRB_TrustBar',
  baseType: '_component',
  displayName: '[HRB] Trust Bar',
  description:
    'H&R Block demo: the three published trust figures (icon, bold figure, short line). Replaces the dropped testimonial block; only claims that appear on hrblock.com. Placed as its own section.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Heading: { type: 'string', displayName: 'Heading', isLocalized: true, isRequired: false },
    Items: {
      type: 'array',
      displayName: 'Items',
      isLocalized: true,
      isRequired: true,
      maxItems: 3,
      items: { type: 'content', allowedTypes: [HrbStatItemContentType] },
    },
    ...tierProperties(),
  },
});

type Props = { content: ContentProps<typeof HrbTrustBarContentType> };

export default function TrustBar({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  return (
    <div className="py-2">
      {content.Heading && (
        <h2 {...pa('Heading')} className="mb-6 text-center text-2xl font-semibold">{content.Heading}</h2>
      )}
      <div {...pa('Items')} className="grid gap-8 md:grid-cols-3">
        {(content.Items ?? []).map((item, i) => (
          <OptimizelyComponent key={i} content={item} />
        ))}
      </div>
    </div>
  );
}
