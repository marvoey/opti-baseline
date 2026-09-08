import { contentType } from '@optimizely/cms-sdk';

export const NbcPartnerCardGridBlockContentType = contentType({
  key: 'NbcPartnerCardGridBlock',
  baseType: '_component',
  displayName: 'NBC Partner Card Grid Block',
  description: 'Grid of third-party billing partner portals (NOW UK).',
  properties: {
    sectionTitle: {
      type: 'string',
      displayName: 'Section Title',
      isRequired: true,
      isLocalized: true,
      indexingType: 'searchable',
      sortOrder: 10,
    },
    partnersJson: {
      type: 'json',
      displayName: 'Partner Cards (Structured List)',
      description: 'JSON array of PartnerCardItem objects: [{partnerKey, partnerName, badgeText, guidanceNote, portalUrl}].',
      isRequired: true,
      isLocalized: true,
      sortOrder: 20,
    },
  },
});
