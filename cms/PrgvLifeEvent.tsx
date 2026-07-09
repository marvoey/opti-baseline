import { contentType } from '@optimizely/cms-sdk';

export const PrgvLifeEventContentType = contentType({
  key: 'PrgvLifeEvent',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  displayName: 'Progressive: Life Event',
  description: 'Life event transition rules with multi-policy impact — student away, new driver, home purchase, marriage, etc.',
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
    LifeEventType: {
      type: 'string',
      displayName: 'Life Event Type',
      isRequired: true,
      sortOrder: 70,
      enum: [
        { value: 'StudentAway', displayName: 'Student Away at School' },
        { value: 'NewDriverAdded', displayName: 'New Driver Added' },
        { value: 'HomePurchase', displayName: 'Home Purchase' },
        { value: 'Marriage', displayName: 'Marriage' },
        { value: 'VehicleGaragedOutOfState', displayName: 'Vehicle Garaged Out-of-State' },
      ],
    },
    AutoChanges: {
      type: 'richText',
      displayName: 'Auto Policy Changes',
      description: 'Required changes to the auto policy for this life event.',
      isLocalized: true,
      sortOrder: 80,
    },
    HomeChanges: {
      type: 'richText',
      displayName: 'Home Policy Changes',
      description: 'Required changes to the homeowners/renters policy, if applicable.',
      isLocalized: true,
      sortOrder: 90,
    },
    EligibilityRequirements: {
      type: 'richText',
      displayName: 'Eligibility Requirements',
      description: 'Conditions that must be met to apply this life-event guidance.',
      isLocalized: true,
      sortOrder: 100,
    },
    JurisdictionNote: {
      type: 'richText',
      displayName: 'Jurisdiction Note',
      description: 'State-specific transition rules or regulatory requirements.',
      isLocalized: true,
      sortOrder: 110,
    },
    RequiredActions: {
      type: 'richText',
      displayName: 'Required Consultant Actions',
      description: 'Specific steps the consultant must take during this call.',
      isLocalized: true,
      sortOrder: 120,
    },
  },
});


export default function PrgvLifeEvent() {
  return null;
}
