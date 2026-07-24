import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const ActionBlockContentType = contentType({
  key: 'ActionBlock',
  baseType: '_component',
  displayName: 'Action Block',
  description: 'A governed call-to-action button for triggering workflows. Access controlled by RBAC.',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    Label:   { type: 'string', displayName: 'Label',   isLocalized: true,  indexingType: 'searchable' },
    Href:    { type: 'url',    displayName: 'URL',     isLocalized: false, indexingType: 'disabled' },
    Variant: { type: 'string', displayName: 'Variant', isLocalized: false, indexingType: 'disabled' },
    Intent: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Intent',
      isLocalized: false,
      indexingType: 'queryable',
      group: 'Taxonomy',
      sortOrder: 10,
      enum: [
        { value: 'discover_recommend', displayName: 'Discover / Recommend' },
        { value: 'educate_govern',     displayName: 'Educate / Govern' },
        { value: 'simulate_transact',  displayName: 'Simulate / Transact' },
      ],
    },
    Persona: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Persona',
      isLocalized: false,
      indexingType: 'queryable',
      group: 'Taxonomy',
      sortOrder: 11,
      enum: [
        { value: 'asset_manager',       displayName: 'Asset Manager' },
        { value: 'pension_fund',        displayName: 'Pension Fund' },
        { value: 'corporate_sponsor',   displayName: 'Corporate Sponsor' },
        { value: 'foreign_institution', displayName: 'Foreign Institution' },
        { value: 'insurance_provider',  displayName: 'Insurance Provider' },
      ],
    },
    Service: {
      type: 'array',
      format: 'selectMany',
      displayName: 'Service',
      group: 'Taxonomy',
      sortOrder: 12,
      items: {
        type: 'string',
        enum: [
          { value: 'fund_administration',     displayName: 'Fund Administration' },
          { value: 'foreign_exchange',        displayName: 'Foreign Exchange' },
          { value: 'treasury_services',       displayName: 'Treasury Services' },
          { value: 'etf_services',            displayName: 'ETF Services' },
          { value: 'alternative_investments', displayName: 'Alternative Investments' },
          { value: 'securities_lending',      displayName: 'Securities Lending' },
          { value: 'global_custody',          displayName: 'Global Custody' },
          { value: 'recordkeeping',           displayName: 'Recordkeeping' },
          { value: 'esg',                     displayName: 'ESG' },
          { value: 'regulatory',              displayName: 'Regulatory' },
          { value: 'tax',                     displayName: 'Tax' },
          { value: 'digital_assets',          displayName: 'Digital Assets' },
          { value: 'onboarding',              displayName: 'Onboarding' },
          { value: 'compliance',              displayName: 'Compliance' },
        ],
      },
    },
    Geo: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Geo',
      isLocalized: false,
      indexingType: 'queryable',
      group: 'Taxonomy',
      sortOrder: 13,
      enum: [
        { value: 'canada',        displayName: 'Canada' },
        { value: 'europe',        displayName: 'Europe' },
        { value: 'united_states', displayName: 'United States' },
        { value: 'global',        displayName: 'Global' },
      ],
    },
  },
});

type Props = {
  content: ContentProps<typeof ActionBlockContentType>;
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
