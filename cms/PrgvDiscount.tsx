import { contentType } from '@optimizely/cms-sdk';

export const PrgvDiscountContentType = contentType({
  key: 'PrgvDiscount',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  displayName: 'Progressive: Discount',
  description: 'Individual discount catalog item with eligibility rules and enrollment guidance.',
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
    DiscountName: {
      type: 'string',
      displayName: 'Discount Name',
      description: 'e.g. "Snapshot® Telematics" or "Good Student".',
      isRequired: true,
      sortOrder: 70,
    },
    EligibilityRules: {
      type: 'richText',
      displayName: 'Eligibility Rules',
      description: 'Who qualifies for this discount.',
      isLocalized: true,
      sortOrder: 80,
    },
    EnrollmentSteps: {
      type: 'richText',
      displayName: 'Enrollment Steps',
      description: 'How the consultant applies the discount during a call.',
      isLocalized: true,
      sortOrder: 90,
    },
    Documentation: {
      type: 'richText',
      displayName: 'Documentation Required',
      description: 'Required documents, e.g. transcripts, GPA letters.',
      isLocalized: true,
      sortOrder: 100,
    },
    TimingNote: {
      type: 'string',
      displayName: 'Timing Note',
      description: 'e.g. "Effective next billing cycle".',
      sortOrder: 110,
    },
    SavingsType: {
      type: 'string',
      displayName: 'Savings Type',
      sortOrder: 120,
      enum: [
        { value: 'Percentage', displayName: 'Percentage' },
        { value: 'DollarAmount', displayName: 'Dollar Amount' },
        { value: 'Both', displayName: 'Both' },
      ],
    },
    SavingsRange: {
      type: 'string',
      displayName: 'Savings Range',
      description: 'e.g. "Up to 30%".',
      sortOrder: 130,
    },
    SavingsAmount: {
      type: 'string',
      displayName: 'Savings Amount',
      description: 'e.g. "$5/month".',
      sortOrder: 140,
    },
    GpaRequirement: {
      type: 'string',
      displayName: 'GPA Requirement',
      description: 'Minimum GPA for Good Student discount, e.g. "3.0 or B average".',
      sortOrder: 150,
    },
  },
});


export default function PrgvDiscount() {
  return null;
}
