import { contentType } from '@optimizely/cms-sdk';

export const NbcSharedNoticeBlockContentType = contentType({
  key: 'NbcSharedNoticeBlock',
  baseType: '_component',
  displayName: 'NBC Shared Policy Notice Block',
  description: 'Centralized compliance disclaimer with cross-article usage tracking.',
  properties: {
    noticeId: {
      type: 'string',
      displayName: 'Notice ID',
      description: 'Unique identifier for cross-reference tracking (e.g. block-bank-updater-01).',
      isRequired: true,
      isLocalized: false,
      indexingType: 'queryable',
      sortOrder: 10,
    },
    noticeType: {
      type: 'string',
      displayName: 'Notice Severity',
      description: 'Visual severity: info, warning, policy.',
      isRequired: true,
      isLocalized: false,
      indexingType: 'queryable',
      sortOrder: 20,
    },
    heading: {
      type: 'string',
      displayName: 'Notice Heading',
      isRequired: true,
      isLocalized: true,
      indexingType: 'searchable',
      sortOrder: 30,
    },
    body: {
      type: 'richText',
      displayName: 'Notice Body',
      isRequired: true,
      isLocalized: true,
      sortOrder: 40,
    },
  },
});
