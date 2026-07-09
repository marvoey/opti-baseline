import { contentType } from '@optimizely/cms-sdk';

export const PrgvProgramContentType = contentType({
  key: 'PrgvProgram',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  displayName: 'Progressive: Program',
  description: 'Enrollable program with scoring or discount logic — e.g. Snapshot® telematics.',
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
    ProgramName: {
      type: 'string',
      displayName: 'Program Name',
      description: 'e.g. "Snapshot®".',
      isRequired: true,
      sortOrder: 70,
    },
    ProgramDescription: {
      type: 'richText',
      displayName: 'Program Description',
      description: 'How the program works.',
      isLocalized: true,
      sortOrder: 80,
    },
    MeasurementPeriod: {
      type: 'string',
      displayName: 'Measurement Period',
      description: 'e.g. "6 months".',
      sortOrder: 90,
    },
    ScoringFactors: {
      type: 'richText',
      displayName: 'Scoring Factors',
      description: 'What is measured and how it affects the discount.',
      isLocalized: true,
      sortOrder: 100,
    },
    ParticipationDiscount: {
      type: 'string',
      displayName: 'Participation Discount',
      description: 'Immediate discount for enrolling, e.g. "Up to 10%".',
      sortOrder: 110,
    },
    RenewalDiscount: {
      type: 'string',
      displayName: 'Renewal Discount',
      description: 'Behavior-based discount at renewal, e.g. "Up to 30%".',
      sortOrder: 120,
    },
    ProfileEstimate: {
      type: 'string',
      displayName: 'Profile Estimate',
      description: 'Estimated savings for a typical profile, e.g. "~$150/year for a 35-year-old in FL".',
      sortOrder: 130,
    },
    EnrollmentAction: {
      type: 'string',
      displayName: 'Enrollment Action CTA',
      description: 'CTA label for consultant to initiate enrollment.',
      sortOrder: 140,
    },
  },
});


export default function PrgvProgram() {
  return null;
}
