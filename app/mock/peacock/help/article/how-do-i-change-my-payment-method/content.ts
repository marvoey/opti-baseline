import type { ContentProps } from '@optimizely/cms-sdk';
import { NbcHelpArticleContentType } from '@/cms/NbcHelpArticle';
import { NbcStepGroupBlockContentType, type InstructionItem } from '@/cms/NbcStepGroupBlock';
import { NbcSharedNoticeBlockContentType } from '@/cms/NbcSharedNoticeBlock';
import { NbcFaqAccordionBlockContentType } from '@/cms/NbcFaqAccordionBlock';

/**
 * Hand-authored mock content standing in for what Optimizely Graph would
 * return for a real NbcHelpArticle. `mainContent` items are typed as fully
 * expanded content objects (their own `__typename` + properties) since
 * that's how Graph actually delivers array-of-content properties; only
 * `sharedNoticeRef` is a genuine `contentReference` that a real integration
 * would need to expand separately (see cms/expandRefs.ts) — this mock
 * inlines the "expanded" notice directly since there's no live Graph client
 * here. `_id`/`_metadata`/`key` envelope fields are required by
 * `ContentProps<...>` but never read outside edit mode, so they're stubbed
 * via one outer cast rather than fabricated in full.
 */

const mainSteps: InstructionItem[] = [
  { stepNumber: 1, stepBody: 'Sign in to your account at peacocktv.com and go to <strong>Account</strong>.' },
  { stepNumber: 2, stepBody: 'Select the <strong>Plans &amp; Payment</strong> tab.' },
  { stepNumber: 3, stepBody: 'Under <strong>Payment Method</strong>, select <strong>Update Payment Method</strong>.' },
  { stepNumber: 4, stepBody: 'Enter your new card number, expiration date, and billing address, then select <strong>Save</strong>.' },
];

const paypalSteps: InstructionItem[] = [
  {
    stepNumber: 1,
    stepTitle: 'Switching to PayPal',
    stepBody:
      'Under <strong>Payment Method</strong>, select the <strong>PayPal</strong> tab and follow the prompts to link your PayPal account to Peacock.',
  },
];

const stepGroups = [
  {
    __typename: NbcStepGroupBlockContentType.key,
    key: 'mock-step-group-main',
    layoutStyle: 'numbered_list',
    stepsJson: mainSteps,
  },
  {
    __typename: NbcStepGroupBlockContentType.key,
    key: 'mock-step-group-paypal',
    layoutStyle: 'tabbed_subviews',
    stepsJson: paypalSteps,
  },
] as unknown as ContentProps<typeof NbcStepGroupBlockContentType>[];

const goodToKnowNotice = {
  __typename: NbcSharedNoticeBlockContentType.key,
  key: 'mock-notice-payment-method-good-to-know',
  noticeId: 'payment-method-good-to-know',
  noticeType: 'info',
  heading: 'Good to know',
  body: {
    html: '<p>Your new payment details go into effect starting with your next billing cycle.</p>',
    json: {
      type: 'richText',
      children: [
        {
          type: 'paragraph',
          children: [{ text: 'Your new payment details go into effect starting with your next billing cycle.' }],
        },
      ],
    },
  },
} as unknown as ContentProps<typeof NbcSharedNoticeBlockContentType>;

const faqItems = [
  {
    __typename: NbcFaqAccordionBlockContentType.key,
    key: 'mock-faq-payment-methods-accepted',
    question: 'What payment methods do you accept?',
    answer: {
      html: '<p>We accept Mastercard, Visa, American Express, or PayPal.</p>',
      json: {
        type: 'richText',
        children: [
          {
            type: 'paragraph',
            children: [{ text: 'We accept Mastercard, Visa, American Express, or PayPal.' }],
          },
        ],
      },
    },
  },
  {
    __typename: NbcFaqAccordionBlockContentType.key,
    key: 'mock-faq-prepaid-card',
    question: 'Can I use a prepaid card?',
    answer: {
      html: '<p>Unfortunately, there are some Visa and Mastercard prepaid cards we don’t accept at the moment.</p>',
      json: {
        type: 'richText',
        children: [
          {
            type: 'paragraph',
            children: [
              {
                text: 'Unfortunately, there are some Visa and Mastercard prepaid cards we don’t accept at the moment.',
              },
            ],
          },
        ],
      },
    },
  },
] as unknown as ContentProps<typeof NbcFaqAccordionBlockContentType>[];

export const paymentMethodArticleContent = {
  __typename: NbcHelpArticleContentType.key,
  key: 'mock-nbc-help-article-payment-method',
  articleId: 'how-do-i-change-my-payment-method',
  topicFamilyId: 'help-payment-update',
  proposition: 'peacock',
  intentCategory: 'billing.update_payment_method',
  categoryLabel: 'Managing My Account',
  title: 'How do I change my payment method or billing address?',
  summary: {
    html: '<p>Got a new card, or moved to a new billing address? You can update your payment details yourself, right from your account — no need to contact Support.</p>',
    json: {
      type: 'richText',
      children: [
        {
          type: 'paragraph',
          children: [
            {
              text: 'Got a new card, or moved to a new billing address? You can update your payment details yourself, right from your account — no need to contact Support.',
            },
          ],
        },
      ],
    },
  },
  mainContent: stepGroups,
  sharedNoticeRef: goodToKnowNotice,
  faqContent: faqItems,
} as unknown as ContentProps<typeof NbcHelpArticleContentType>;
