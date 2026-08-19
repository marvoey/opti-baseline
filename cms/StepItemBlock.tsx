import { contentType } from '@optimizely/cms-sdk';

export const StepItemBlockContentType = contentType({
  key: 'StepItemBlock',
  baseType: '_component',
  displayName: 'Step Item',
  description: 'An individual step in a stepper component.',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    Title: {
      type: 'string',
      displayName: 'Title',
      description: "The short name of the step (e.g., 'Account Details', 'Payment').",
      isRequired: true,
      sortOrder: 10,
    },
    Description: {
      type: 'string',
      displayName: 'Description',
      description: 'Detailed text explaining the step.',
      sortOrder: 20,
    },
    SubtextOrDate: {
      type: 'string',
      displayName: 'Subtext or Date',
      description: "Secondary small text (e.g., 'Oct 24, 2024' or 'In Progress').",
      sortOrder: 30,
    },
  },
});
