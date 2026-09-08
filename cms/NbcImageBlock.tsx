import { contentType } from '@optimizely/cms-sdk';

export const NbcImageBlockContentType = contentType({
  key: 'NbcImageBlock',
  baseType: '_component',
  displayName: 'NBC Image Block',
  description: 'Screenshot or illustrative image with caption, for embedding within article content (e.g. step instructions).',
  properties: {
    image: {
      type: 'contentReference',
      displayName: 'Image',
      description: 'Reference to a media asset.',
      isRequired: true,
      isLocalized: false,
      allowedTypes: ['_image'],
      sortOrder: 10,
    },
    altText: {
      type: 'string',
      displayName: 'Alt Text',
      description: 'Accessible description of the image content.',
      isRequired: true,
      isLocalized: true,
      indexingType: 'searchable',
      sortOrder: 20,
    },
    caption: {
      type: 'string',
      displayName: 'Caption',
      isRequired: false,
      isLocalized: true,
      indexingType: 'searchable',
      sortOrder: 30,
    },
  },
});
