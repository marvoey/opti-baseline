import { contentType } from '@optimizely/cms-sdk';

export const NbcFaqAccordionBlockContentType = contentType({
  key: 'NbcFaqAccordionBlock',
  baseType: '_component',
  displayName: 'NBC FAQ Accordion Block',
  description: 'Collapsible question-and-answer item.',
  properties: {
    question: {
      type: 'string',
      displayName: 'Question',
      isRequired: true,
      isLocalized: true,
      indexingType: 'searchable',
      sortOrder: 10,
    },
    answer: {
      type: 'richText',
      displayName: 'Answer Text',
      isRequired: true,
      isLocalized: true,
      sortOrder: 20,
    },
  },
});
