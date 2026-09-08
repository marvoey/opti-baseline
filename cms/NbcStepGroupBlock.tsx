import { contentType } from '@optimizely/cms-sdk';

export const NbcStepGroupBlockContentType = contentType({
  key: 'NbcStepGroupBlock',
  baseType: '_component',
  displayName: 'NBC Step Group Block',
  description: 'Ordered sequence of numbered instructions.',
  properties: {
    groupHeading: {
      type: 'string',
      displayName: 'Group Heading',
      isRequired: false,
      isLocalized: true,
      indexingType: 'searchable',
      sortOrder: 10,
    },
    layoutStyle: {
      type: 'string',
      displayName: 'Layout Style',
      description: 'numbered_list or tabbed_subviews.',
      isRequired: true,
      isLocalized: false,
      indexingType: 'queryable',
      sortOrder: 20,
    },
    stepsJson: {
      type: 'json',
      displayName: 'Instruction Steps (Structured List)',
      description: 'JSON array of InstructionItem objects: [{stepNumber, stepTitle, stepBody, ctaUrl}].',
      isRequired: true,
      isLocalized: true,
      sortOrder: 30,
    },
  },
});
