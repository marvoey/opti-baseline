import { contentType } from '@optimizely/cms-sdk';

export const PrgvRecommendationContentType = contentType({
  key: 'PrgvRecommendation',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  displayName: 'Progressive: Recommendation',
  description: 'Cross-sell / upsell advisory content with gap analysis — triggered when current coverage falls short.',
  properties: {
    LineOfBusiness: {
      type: 'array',
      format: 'selectMany',
      displayName: 'Line of Business',
      isRequired: true,
      sortOrder: 10,
      items: {
        type: 'string',
        enum: [
          { value: 'CommercialAuto', displayName: 'Commercial Auto' },
          { value: 'PersonalAuto', displayName: 'Personal Auto' },
          { value: 'Homeowners', displayName: 'Homeowners' },
          { value: 'Renters', displayName: 'Renters' },
        ],
      },
    },
    Topic: {
      type: 'array',
      format: 'selectMany',
      displayName: 'Topic / Peril',
      isRequired: true,
      sortOrder: 20,
      items: {
        type: 'string',
        enum: [
          { value: 'Hail', displayName: 'Hail' },
          { value: 'Discounts', displayName: 'Discounts' },
          { value: 'CoverageOptions', displayName: 'Coverage Options' },
          { value: 'Upsell', displayName: 'Upsell' },
          { value: 'Tools', displayName: 'Tools' },
          { value: 'RoadsideAssistance', displayName: 'Roadside Assistance' },
          { value: 'TransitionGuidelines', displayName: 'Transition Guidelines' },
          { value: 'GlassClaim', displayName: 'Glass Claim' },
        ],
      },
    },
    Jurisdiction: {
      type: 'array',
      format: 'selectMany',
      displayName: 'Jurisdiction',
      sortOrder: 30,
      items: {
        type: 'string',
        enum: [
          { value: 'National', displayName: 'National' },
          { value: 'FL', displayName: 'Florida' },
          { value: 'CA', displayName: 'California' },
          { value: 'OH', displayName: 'Ohio' },
          { value: 'TX', displayName: 'Texas' },
          { value: 'NY', displayName: 'New York' },
        ],
      },
    },
    VariationLabel: {
      type: 'string',
      displayName: 'Variation Label',
      sortOrder: 40,
    },
    SourceLabel: {
      type: 'string',
      displayName: 'Source Label',
      sortOrder: 50,
    },
    ActiveDate: {
      type: 'dateTime',
      displayName: 'Active Date',
      sortOrder: 60,
    },
    RecommendationType: {
      type: 'string',
      displayName: 'Recommendation Type',
      isRequired: true,
      sortOrder: 70,
      enum: [
        { value: 'Upsell', displayName: 'Upsell' },
        { value: 'CrossSell', displayName: 'Cross-sell' },
        { value: 'Advisory', displayName: 'Advisory' },
        { value: 'GapAlert', displayName: 'Gap Alert' },
      ],
    },
    TriggerCondition: {
      type: 'string',
      displayName: 'Trigger Condition',
      description: 'Logic description that surfaces this recommendation, e.g. "Auto BI limit < $500K threshold".',
      sortOrder: 80,
    },
    GapNarrative: {
      type: 'richText',
      displayName: 'Gap Narrative',
      description: 'Why the current coverage is insufficient.',
      isLocalized: true,
      sortOrder: 90,
    },
    CoverageAdditions: {
      type: 'richText',
      displayName: 'Coverage Additions',
      description: 'What the recommended product adds.',
      isLocalized: true,
      sortOrder: 100,
    },
    UniqueCoverages: {
      type: 'richText',
      displayName: 'Unique Coverages',
      description: 'Coverages not available in existing base policies.',
      isLocalized: true,
      sortOrder: 110,
    },
    ComparisonTable: {
      type: 'richText',
      displayName: 'Comparison Table',
      description: 'Base policy caps vs. recommended product — structured as a table.',
      isLocalized: true,
      sortOrder: 120,
    },
    PricingNote: {
      type: 'string',
      displayName: 'Pricing Note',
      description: 'e.g. "~$19/month for $1M umbrella".',
      sortOrder: 130,
    },
    CtaLabel: {
      type: 'string',
      displayName: 'CTA Label',
      description: 'e.g. "Get Umbrella Quote".',
      sortOrder: 140,
    },
  },
});


export default function PrgvRecommendation() {
  return null;
}
