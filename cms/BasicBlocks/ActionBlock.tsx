import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { taxonomyEnums, INTENT, PERSONA, SERVICE, GEO } from '@/lib/cms/taxonomy';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const ActionBlockContentType = contentType({
  key: 'ActionBlock',
  baseType: '_component',
  displayName: '[CIBC] Action Block',
  description: 'A governed call-to-action button for triggering workflows. Access controlled by RBAC.',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    Label:   { type: 'string', displayName: 'Label',   isLocalized: true,  indexingType: 'searchable' },
    Href:    { type: 'url',    displayName: 'URL',     isLocalized: false, indexingType: 'disabled' },
    Variant: { type: 'string', displayName: 'Variant', isLocalized: false, indexingType: 'disabled' },
    Intent:  { type: 'string', format: 'selectOne',  displayName: 'Intent',  isLocalized: false, indexingType: 'queryable', group: 'Taxonomy', sortOrder: 10, enum: taxonomyEnums(INTENT) },
    Persona: { type: 'string', format: 'selectOne',  displayName: 'Persona', isLocalized: false, indexingType: 'queryable', group: 'Taxonomy', sortOrder: 11, enum: taxonomyEnums(PERSONA) },
    Service: { type: 'array',  format: 'selectMany', displayName: 'Service',                                                group: 'Taxonomy', sortOrder: 12, items: { type: 'string', enum: taxonomyEnums(SERVICE) } },
    Geo:     { type: 'string', format: 'selectOne',  displayName: 'Geo',     isLocalized: false, indexingType: 'queryable', group: 'Taxonomy', sortOrder: 13, enum: taxonomyEnums(GEO) },
  },
});

type Props = {
  content: ContentProps<typeof ActionBlockContentType> & {
    Variant?: string | null;
    Href?: { default?: string } | null;
  };
};

const VARIANT_CLASSES: Record<string, string> = {
  primary:   'bg-blue-600 text-white hover:bg-blue-700',
  secondary: 'border border-neutral-300 bg-white text-neutral-900 hover:bg-neutral-50 dark:border-neutral-600 dark:bg-neutral-800 dark:text-white',
  danger:    'bg-red-600 text-white hover:bg-red-700',
};

export default function ActionBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const variant = (content.Variant as string | null) ?? 'primary';
  const classes = VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.primary;
  return (
    <div {...pa(content.__composition)} className="py-2">
      <a
        {...pa('Label')}
        href={content.Href?.default ?? '#'}
        className={`inline-flex items-center rounded-md px-4 py-2 text-sm font-medium transition-colors ${classes}`}
      >
        {content.Label ?? 'Action'}
      </a>
    </div>
  );
}
