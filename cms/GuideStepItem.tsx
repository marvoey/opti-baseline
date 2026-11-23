import { contentType } from '@optimizely/cms-sdk';

/** One stage in a [GUIDE] Steps block. Only used inside GuideSteps (rendered there). */
export const GuideStepItemContentType = contentType({
  key: 'GuideStepItem',
  baseType: '_component',
  displayName: '[GUIDE] Step item',
  description: 'One numbered stage: label, title, text and how long it takes. Used inside Steps.',
  properties: {
    Label: { type: 'string', displayName: 'Label', description: 'For example "Before the session".', isLocalized: true, sortOrder: 10 },
    Title: { type: 'string', displayName: 'Title', isLocalized: true, sortOrder: 20 },
    Body: { type: 'string', displayName: 'Text', isLocalized: true, sortOrder: 30 },
    Duration: { type: 'string', displayName: 'How long', description: 'For example "About 45 min".', isLocalized: true, sortOrder: 40 },
  },
});

/** Rendered by GuideSteps. */
export default function GuideStepItem() {
  return null;
}
