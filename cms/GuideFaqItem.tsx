import { contentType } from '@optimizely/cms-sdk';

/** One question in a [GUIDE] FAQ block. Only used inside GuideFaq (rendered there). */
export const GuideFaqItemContentType = contentType({
  key: 'GuideFaqItem',
  baseType: '_component',
  displayName: '[GUIDE] FAQ item',
  description: 'A question and its answer. Used inside an FAQ.',
  properties: {
    Question: { type: 'string', displayName: 'Question', isLocalized: true, sortOrder: 10 },
    Answer: { type: 'string', displayName: 'Answer', isLocalized: true, sortOrder: 20 },
  },
});

/** Rendered by GuideFaq. */
export default function GuideFaqItem() {
  return null;
}
