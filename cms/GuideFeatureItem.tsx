import { contentType } from '@optimizely/cms-sdk';
import { ICONS } from './guideShared';

/** One card in a [GUIDE] Feature grid. Only used inside GuideFeatureGrid (rendered there). */
export const GuideFeatureItemContentType = contentType({
  key: 'GuideFeatureItem',
  baseType: '_component',
  displayName: '[GUIDE] Feature item',
  description: 'A card with an icon, title and short text. Used inside a Feature grid.',
  properties: {
    Icon: { type: 'string', displayName: 'Icon', enum: ICONS, sortOrder: 10 },
    Title: { type: 'string', displayName: 'Title', isLocalized: true, sortOrder: 20 },
    Body: { type: 'string', displayName: 'Text', isLocalized: true, sortOrder: 30 },
  },
});

/** Rendered by GuideFeatureGrid. */
export default function GuideFeatureItem() {
  return null;
}
