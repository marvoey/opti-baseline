import { contentType } from '@optimizely/cms-sdk';

export const PrgvBenefitContentType = contentType({
  key: 'PrgvBenefit',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  displayName: 'Progressive: Benefit',
  description: 'Quantified service benefit with tier-based limits — rental reimbursement, roadside, and similar included services.',
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
    PolicyTier: {
      type: 'string',
      displayName: 'Policy Tier',
      sortOrder: 40,
      enum: [
        { value: 'AllTiers', displayName: 'All Tiers' },
        { value: 'Standard', displayName: 'Standard' },
        { value: 'Gold', displayName: 'Gold' },
        { value: 'Platinum', displayName: 'Platinum' },
      ],
    },
    VariationLabel: {
      type: 'string',
      displayName: 'Variation Label',
      sortOrder: 50,
    },
    SourceLabel: {
      type: 'string',
      displayName: 'Source Label',
      sortOrder: 60,
    },
    ActiveDate: {
      type: 'dateTime',
      displayName: 'Active Date',
      sortOrder: 70,
    },
    BenefitDescription: {
      type: 'richText',
      displayName: 'Benefit Description',
      description: 'What the benefit provides.',
      isLocalized: true,
      sortOrder: 80,
    },
    Procedure: {
      type: 'richText',
      displayName: 'Procedure',
      description: 'How to initiate or use the benefit.',
      isLocalized: true,
      sortOrder: 90,
    },
    Vendors: {
      type: 'string',
      displayName: 'Vendors',
      description: 'Comma-separated approved vendor list, e.g. "Enterprise, Hertz, National".',
      sortOrder: 100,
    },
    PrimaryLimit: {
      type: 'string',
      displayName: 'Primary Limit (Tier)',
      description: 'Tier-specific limit, e.g. "$50/day".',
      sortOrder: 110,
    },
    MasterPrimaryLimit: {
      type: 'string',
      displayName: 'Primary Limit (Standard)',
      description: 'Standard/master tier limit, e.g. "$30/day".',
      sortOrder: 120,
    },
    SecondaryLimit: {
      type: 'string',
      displayName: 'Secondary Limit (Tier)',
      description: 'Tier-specific secondary limit, e.g. "30 days".',
      sortOrder: 130,
    },
    MasterSecondaryLimit: {
      type: 'string',
      displayName: 'Secondary Limit (Standard)',
      description: 'Standard/master secondary limit, e.g. "21 days".',
      sortOrder: 140,
    },
    ReimbursementWindow: {
      type: 'string',
      displayName: 'Reimbursement Window',
      description: 'e.g. "72 hours".',
      sortOrder: 150,
    },
    EnrollmentAction: {
      type: 'string',
      displayName: 'Enrollment Action CTA',
      description: 'CTA label for consultant to initiate, e.g. "Authorize Rental".',
      sortOrder: 160,
    },
  },
});


export default function PrgvBenefit() {
  return null;
}
