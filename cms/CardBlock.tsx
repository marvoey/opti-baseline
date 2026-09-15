import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { intentTaxonomyProperties, ctaHref, type OptiLink } from './shared';

export const CardBlockContentType = contentType({
  key: 'CardPrimitiveBlock',
  baseType: '_component',
  displayName: 'Card Primitive',
  description: 'Self-contained micro-container for modular aggregation and intent-driven grids.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Title: {
      type: 'string',
      displayName: 'Title',
      isRequired: true,
      isLocalized: true,
      sortOrder: 10,
    },
    Eyebrow: {
      type: 'string',
      displayName: 'Eyebrow / Category',
      isLocalized: true,
      sortOrder: 20,
    },
    Description: {
      type: 'string',
      displayName: 'Description',
      isLocalized: true,
      sortOrder: 30,
    },
    Link: {
      type: 'link',
      displayName: 'Target Link',
      isLocalized: true,
      sortOrder: 40,
    },
    ...intentTaxonomyProperties,
  },
});

type Props = { content: ContentProps<typeof CardBlockContentType> };

export default function CardBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  return (
    <div
      {...pa(block)}
      className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md"
    >
      {content.Eyebrow && (
        <span {...pa('Eyebrow')} className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          {content.Eyebrow}
        </span>
      )}
      <h3 {...pa('Title')} className="mt-2 text-xl font-bold text-neutral-900">
        {content.Title}
      </h3>
      {content.Description && (
        <p {...pa('Description')} className="mt-2 text-sm text-neutral-600">
          {content.Description}
        </p>
      )}
      {content.Link && (
        <a
          {...pa('Link')}
          href={ctaHref(content.Link as OptiLink)}
          className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
        >
          Learn more &rarr;
        </a>
      )}
    </div>
  );
}
