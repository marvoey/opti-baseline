import { contentType } from '@optimizely/cms-sdk';

export const PrgvExclusionRuleContentType = contentType({
  key: 'PrgvExclusionRule',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  displayName: 'Progressive: Exclusion Rule',
  description: 'What is NOT covered by a policy, with redirect guidance to the correct coverage.',
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
    ExclusionText: {
      type: 'richText',
      displayName: 'Exclusion Text',
      description: 'What is excluded and the policy basis for the exclusion.',
      isLocalized: true,
      sortOrder: 70,
    },
    RedirectNote: {
      type: 'string',
      displayName: 'Redirect Note',
      description: 'Where coverage may be found instead, e.g. "→ Homeowners off-premises".',
      isLocalized: true,
      sortOrder: 80,
    },
    ReferralProduct: {
      type: 'string',
      displayName: 'Referral Product',
      description: 'Product name to refer the customer to, e.g. "NFIP" or "Umbrella".',
      sortOrder: 90,
    },
  },
});


export default function PrgvExclusionRule() {
  return null;
}
