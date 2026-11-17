import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyComponent, getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { HrbGuaranteeItemContentType } from './GuaranteeItem';
import { tierProperties } from './shared';
import { CtaButton } from './ui';

export const HrbGuaranteesContentType = contentType({
  key: 'HRB_Guarantees',
  baseType: '_component',
  displayName: '[HRB] Guarantees',
  description:
    'H&R Block demo: 100% Accuracy, Maximum Refund and No Surprise in their short form, with the "See all our guarantees" link. Placed as its own section.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Heading: { type: 'string', displayName: 'Heading', isLocalized: true, isRequired: false },
    Items: {
      type: 'array',
      displayName: 'Guarantees',
      isLocalized: true,
      isRequired: false,
      maxItems: 3,
      items: { type: 'content', allowedTypes: [HrbGuaranteeItemContentType] },
    },
    LinkLabel: {
      type: 'string',
      displayName: 'Guarantees link label',
      isLocalized: true,
      isRequired: false,
    },
    LinkUrl: { type: 'url', displayName: 'Guarantees link URL', isRequired: false },
    ...tierProperties(),
  },
});

type Props = { content: ContentProps<typeof HrbGuaranteesContentType> };

export default function Guarantees({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  return (
    <div className="py-2">
      {content.Heading && (
        <h2 {...pa('Heading')} className="mb-6 text-3xl font-semibold">{content.Heading}</h2>
      )}
      <div {...pa('Items')} className="grid gap-6 md:grid-cols-3">
        {(content.Items ?? []).map((item, i) => (
          <OptimizelyComponent key={i} content={item} />
        ))}
      </div>
      <div className="mt-8 text-center">
        <CtaButton
          label={content.LinkLabel}
          url={content.LinkUrl}
          variant="secondary"
          editProps={pa('LinkLabel')}
        />
      </div>
    </div>
  );
}
