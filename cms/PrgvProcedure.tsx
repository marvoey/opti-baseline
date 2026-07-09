import { contentType } from '@optimizely/cms-sdk';

export const PrgvProcedureContentType = contentType({
  key: 'PrgvProcedure',
  baseType: '_component',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  displayName: 'Progressive: Procedure',
  description: 'Step-by-step procedure content for claims intake, enrollment flows, and other consultant-guided processes.',
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
    ProcedureType: {
      type: 'string',
      displayName: 'Procedure Type',
      description: 'e.g. "Liability Claim Intake", "Glass Claim Filing", "Snapshot Enrollment".',
      isRequired: true,
      sortOrder: 70,
    },
    Steps: {
      type: 'richText',
      displayName: 'Steps',
      description: 'Numbered steps or process description the consultant follows.',
      isLocalized: true,
      sortOrder: 80,
    },
    RequiredInfo: {
      type: 'richText',
      displayName: 'Required Information',
      description: 'Information the consultant must gather from the customer.',
      isLocalized: true,
      sortOrder: 90,
    },
    RequiredDocuments: {
      type: 'richText',
      displayName: 'Required Documents',
      description: 'Documents the customer must provide.',
      isLocalized: true,
      sortOrder: 100,
    },
    ResponseTimeline: {
      type: 'string',
      displayName: 'Response Timeline',
      description: 'e.g. "Claims contact within 24 hours".',
      sortOrder: 110,
    },
    CtaLabel: {
      type: 'string',
      displayName: 'CTA Label',
      description: 'e.g. "Open Liability Claim".',
      sortOrder: 120,
    },
  },
});


export default function PrgvProcedure() {
  return null;
}
