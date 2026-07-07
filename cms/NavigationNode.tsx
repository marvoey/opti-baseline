import { contentType } from '@optimizely/cms-sdk';

export const NavigationNodeContentType = contentType({
  key: 'NavigationNode',
  baseType: '_component',
  displayName: 'v2: Navigation Node',
  description: 'A single labelled link used inside a Wayfinding Block.',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    Label: {
      type: 'string',
      displayName: 'Label',
      isRequired: true,
      isLocalized: true,
      sortOrder: 10,
    },
    Target: {
      type: 'url',
      displayName: 'Target URL',
      isLocalized: true,
      sortOrder: 20,
    },
  },
});
