import { contentType } from '@optimizely/cms-sdk';
import { NbcStepGroupBlockContentType } from './NbcStepGroupBlock';
import { NbcPartnerCardGridBlockContentType } from './NbcPartnerCardGridBlock';
import { NbcImageBlockContentType } from './NbcImageBlock';
import { NbcSharedNoticeBlockContentType } from './NbcSharedNoticeBlock';
import { NbcFaqAccordionBlockContentType } from './NbcFaqAccordionBlock';

export const NbcHelpArticleContentType = contentType({
  key: 'NbcHelpArticle',
  baseType: '_page',
  displayName: 'NBC Help Article Page',
  description: 'Root help center article container for Peacock and NOW propositions.',
  properties: {
    articleId: {
      type: 'string',
      displayName: 'Article ID',
      description: 'Immutable UUID for cross-system tracking and Adobe Analytics.',
      isRequired: true,
      isLocalized: false,
      indexingType: 'searchable',
      sortOrder: 10,
    },
    topicFamilyId: {
      type: 'string',
      displayName: 'Topic Family ID',
      description: 'Cross-proposition linking key grouping Peacock and NOW articles (e.g. help-payment-update).',
      isRequired: true,
      isLocalized: false,
      indexingType: 'queryable',
      sortOrder: 20,
    },
    legacySalesforceId: {
      type: 'string',
      displayName: 'Legacy Salesforce ID',
      description: 'Original Salesforce Knowledge ID used for automated 301 redirects.',
      isRequired: false,
      isLocalized: false,
      indexingType: 'queryable',
      sortOrder: 30,
    },
    proposition: {
      type: 'string',
      displayName: 'Proposition Scope',
      description: 'peacock, now_tv, wow, skyshowtime, or shared.',
      isRequired: true,
      isLocalized: false,
      indexingType: 'queryable',
      sortOrder: 40,
    },
    intentCategory: {
      type: 'string',
      displayName: 'Intent Category',
      description: 'Semantic intent classification (e.g. billing.update_payment_method).',
      isRequired: true,
      isLocalized: false,
      indexingType: 'queryable',
      sortOrder: 50,
    },
    title: {
      type: 'string',
      displayName: 'Article Title',
      isRequired: true,
      isLocalized: true,
      indexingType: 'searchable',
      sortOrder: 60,
    },
    summary: {
      type: 'richText',
      displayName: 'Lead Summary',
      isRequired: true,
      isLocalized: true,
      sortOrder: 70,
    },
    mainContent: {
      type: 'array',
      displayName: 'Main Content Blocks',
      description: 'Assembly slot for NbcStepGroupBlock, NbcPartnerCardGridBlock, and NbcImageBlock.',
      isRequired: false,
      isLocalized: true,
      sortOrder: 80,
      items: {
        type: 'content',
        allowedTypes: [
          NbcStepGroupBlockContentType,
          NbcPartnerCardGridBlockContentType,
          NbcImageBlockContentType,
        ],
      },
    },
    sharedNoticeRef: {
      type: 'contentReference',
      displayName: 'Shared Policy Notice Reference',
      description: 'Reference to a centralized NbcSharedNoticeBlock.',
      isRequired: false,
      isLocalized: false,
      allowedTypes: [NbcSharedNoticeBlockContentType],
      sortOrder: 90,
    },
    faqContent: {
      type: 'array',
      displayName: 'FAQ Accordion Area',
      description: 'Assembly slot for NbcFaqAccordionBlock components.',
      isRequired: false,
      isLocalized: true,
      sortOrder: 100,
      items: {
        type: 'content',
        allowedTypes: [NbcFaqAccordionBlockContentType],
      },
    },
  },
});
