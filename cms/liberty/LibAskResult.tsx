import { contentType } from '@optimizely/cms-sdk';

/**
 * The classification Mark returns for one question, parked in the CMS for a few
 * seconds so the browser's request can pick it up (see
 * docs/ask-liberty-mark-roundtrip-plan.md).
 *
 * - A plain component with no composition behaviors: it is never placed on a page
 *   and has no web address. (A component can only be created inside a folder,
 *   which is why the results live in a dedicated folder.)
 * - Items are drafts that are never published, keyed by the question's random id,
 *   and deleted as soon as they are read (a sweep removes any left behind).
 * - No property is indexed or translated, and the visitor's question text is
 *   never stored.
 */
export const LibAskResultContentType = contentType({
  key: 'LibAskResult',
  baseType: '_component',
  displayName: 'Liberty Ask Result (Mark reply, temporary)',
  description: 'Short-lived store for the classification Mark returns for one question. Never published.',
  properties: {
    Intent: { type: 'string', displayName: 'Intent', indexingType: 'disabled', sortOrder: 10 },
    Product: { type: 'string', displayName: 'Product', indexingType: 'disabled', sortOrder: 20 },
    Topic: { type: 'string', displayName: 'Topic', indexingType: 'disabled', sortOrder: 30 },
    Coverage: { type: 'string', displayName: 'Coverage', indexingType: 'disabled', sortOrder: 40 },
    State: { type: 'string', displayName: 'State', indexingType: 'disabled', sortOrder: 50 },
    Confidence: { type: 'float', displayName: 'Confidence (0 to 1)', indexingType: 'disabled', sortOrder: 60 },
    Reasoning: {
      type: 'string',
      displayName: 'Reasoning',
      description: 'One sentence, at most 200 characters.',
      indexingType: 'disabled',
      sortOrder: 70,
    },
  },
});
