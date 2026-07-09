import { contentType } from '@optimizely/cms-sdk';

export const PrgvCoverageRuleContentType = contentType({
  key: 'PrgvCoverageRule',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  displayName: 'Progressive: Coverage Rule',
  description: 'Core policy coverage text — what is covered, deductibles, and exceptions. Supports state-level overrides.',
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
      description: 'Human-readable override label shown in the UI, e.g. "FL Override".',
      sortOrder: 50,
    },
    SourceLabel: {
      type: 'string',
      displayName: 'Source Label',
      description: 'Citation label shown in the Sources chip, e.g. "Auto Comprehensive (FL Override)".',
      sortOrder: 60,
    },
    ActiveDate: {
      type: 'dateTime',
      displayName: 'Active Date',
      description: 'Effective date for this content version.',
      sortOrder: 70,
    },
    CoreDefinition: {
      type: 'richText',
      displayName: 'Core Definition',
      description: 'Main coverage description. May be inherited from the National master.',
      isLocalized: true,
      sortOrder: 80,
    },
    DeductibleRules: {
      type: 'richText',
      displayName: 'Deductible Rules',
      description: 'Deductible rules. State override replaces the national default.',
      isLocalized: true,
      sortOrder: 90,
    },
    Exceptions: {
      type: 'richText',
      displayName: 'Exceptions & Caveats',
      description: 'Notable exceptions, statutory carve-outs, or edge cases.',
      isLocalized: true,
      sortOrder: 100,
    },
    StateDisclosure: {
      type: 'richText',
      displayName: 'State Disclosure',
      description: 'State-specific required disclosure text.',
      isLocalized: true,
      sortOrder: 110,
    },
  },
});


export default function PrgvCoverageRule() {
  return null;
}
