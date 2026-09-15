import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { intentTaxonomyProperties, ctaHref, type OptiLink } from './shared';

export const ActionBlockContentType = contentType({
  key: 'ActionPrimitiveBlock',
  baseType: '_component',
  displayName: 'Action Primitive',
  description: 'Call to action and conversion trigger.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Label: {
      type: 'string',
      displayName: 'Label',
      isRequired: true,
      isLocalized: true,
      sortOrder: 10,
    },
    Link: {
      type: 'link',
      displayName: 'Action URL',
      isRequired: true,
      isLocalized: true,
      sortOrder: 20,
    },
    Variant: {
      type: 'string',
      displayName: 'Variant',
      description: 'Button style: Primary, Secondary or Outline. Default: Primary.',
      isLocalized: true,
      sortOrder: 30,
      enum: [
        { value: 'primary', displayName: 'Primary' },
        { value: 'secondary', displayName: 'Secondary' },
        { value: 'outline', displayName: 'Outline' },
      ],
    },
    ...intentTaxonomyProperties,
  },
});

type Props = { content: ContentProps<typeof ActionBlockContentType> };

export default function ActionBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const isSecondary = content.Variant === 'secondary';

  return (
    <div {...pa(block)} className="py-2">
      <a
        {...pa('Link')}
        href={ctaHref(content.Link as OptiLink)}
        className={`inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition ${
          isSecondary
            ? 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        <span {...pa('Label')}>{content.Label ?? 'Click Here'}</span>
      </a>
    </div>
  );
}
