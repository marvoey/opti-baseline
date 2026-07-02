import type { ReactNode } from 'react';

import Hero, { HeroContentType } from '@/cms/Hero';
import RichText, { RichTextContentType } from '@/cms/RichText';
import CibcHero, { CibcHeroContentType, CibcHeroDisplayTemplate } from '@/cms/CibcHero';
import CibcAlertFeed, {
  CibcAlertContentType,
  CibcAlertFeedContentType,
} from '@/cms/CibcAlertFeed';
import CibcAssetGrid, {
  CibcAssetCardContentType,
  CibcAssetGridContentType,
  CibcAssetGridDisplayTemplate,
} from '@/cms/CibcAssetGrid';
import CibcOnboardingJourney, {
  CibcMilestoneContentType,
  CibcOnboardingJourneyContentType,
} from '@/cms/CibcOnboardingJourney';
import CibcRegulatoryDirective, {
  CibcRegulatoryDirectiveContentType,
} from '@/cms/CibcRegulatoryDirective';

/**
 * Single source of truth for the /styleguide route. Both the index page and the
 * per-block detail pages (/styleguide/[slug]) read from SHOWCASE, so a block is
 * described once: its content type, source file, sample content and how to
 * render it.
 *
 * To document a new block: import its component + contentType (and any display
 * template / nested item types), then add a ShowcaseBlock entry below.
 */

/** The `content` prop type of a block component, inferred from its signature. */
export type ContentOf<C> = C extends (props: { content: infer T }) => unknown ? T : never;

/** The `displaySettings` prop type of a block component, inferred from its signature. */
export type DisplayOf<C> = C extends (props: { displaySettings?: infer T }) => unknown
  ? T
  : never;

// --- Lightweight views over the SDK's contentType()/displayTemplate() defs ----
// The SDK returns the options object verbatim, so we just narrow the parts the
// styleguide reads (it never mutates them).

/** One property as declared on a content type. */
export type PropertyDef = {
  type: string;
  displayName?: string;
  description?: string;
  isLocalized?: boolean;
  isRequired?: boolean;
  sortOrder?: number;
  maxLength?: number;
  enum?: { value: string; displayName?: string }[];
  items?: { type: string; contentType?: { key?: string } };
  allowedTypes?: string[];
};

export type ContentTypeDef = {
  key: string;
  displayName: string;
  description?: string;
  baseType?: string;
  compositionBehaviors?: string[];
  properties: Record<string, PropertyDef>;
};

export type DisplayTemplateDef = {
  key: string;
  displayName: string;
  settings: Record<
    string,
    { displayName?: string; editor?: string; choices?: Record<string, { displayName?: string }> }
  >;
};

type Variant = {
  label?: string;
  content: Record<string, unknown>;
  displaySettings?: Record<string, unknown>;
};

export type ShowcaseBlock = {
  /** URL segment under /styleguide and the index anchor. */
  slug: string;
  /** Display name (also used as the page <h1>). */
  name: string;
  /** Short one-liner shown on the index and detail header. */
  summary: string;
  /** The content type definition — drives the properties table. */
  contentType: ContentTypeDef;
  /** Project-relative path to the component source, shown as code. */
  sourceFile: string;
  /** Nested component types held inline (array items), for extra property tables. */
  itemTypes?: ContentTypeDef[];
  /** Display templates whose settings the editor can choose. */
  displayTemplates?: DisplayTemplateDef[];
  /** One or more rendered examples. */
  variants: Variant[];
  /** Render a single variant to a live React tree. */
  render: (variant: Variant) => ReactNode;
};

const ct = (def: unknown) => def as unknown as ContentTypeDef;
const dt = (def: unknown) => def as unknown as DisplayTemplateDef;

// ---------------------------------------------------------------------------
// Sample content — one mock object per block, shaped to its content type. These
// mirror the shape Optimizely Graph returns (links as { text, url: { default } },
// rich text as { json } / { html }, component arrays as nested objects).
// ---------------------------------------------------------------------------

const heroContent = {
  BlockWidth: 'full',
  SuperHeader: 'Digital Banking',
  MainTitle: 'Banking built around you',
  SubTitle:
    'Open an account, apply for a card, or manage your money — all in one place with industry-leading security.',
  PrimaryCTA: { text: 'Get Started', title: null, target: null, url: { default: '#' } },
  SecondaryCTA: { text: 'Compare Cards', title: null, target: null, url: { default: '#' } },
  ContrastMode: false,
};

const richTextContent = {
  BlockWidth: 'medium',
  Body: {
    json: {
      type: 'richText',
      children: [
        { type: 'heading-two', children: [{ text: 'Why millions choose Capital One' }] },
        {
          type: 'paragraph',
          children: [
            { text: 'Our platform combines ' },
            { text: 'award-winning security', bold: true },
            { text: ' with an intuitive digital experience so you can bank confidently from anywhere.' },
          ],
        },
        {
          type: 'bulleted-list',
          children: [
            { type: 'list-item', children: [{ text: 'No hidden fees on checking accounts' }] },
            { type: 'list-item', children: [{ text: 'Real-time fraud alerts and card controls' }] },
            { type: 'list-item', children: [{ text: 'AI-powered spending insights' }] },
          ],
        },
      ],
    },
  },
};

const capitalOneHeroContent = {
  Eyebrow: 'Digital Banking',
  Headline: 'Banking that puts you first',
  Subtext:
    'Manage your accounts, track spending, and grow your savings — with AI-powered insights built for real life.',
  PrimaryCta: { text: 'Open an Account', title: null, target: null, url: { default: '#' } },
  SecondaryCta: { text: 'See All Products', title: null, target: null, url: { default: '#' } },
};

const capitalOneAlertFeedContent = {
  Heading: 'Account Alerts',
  FeedLabel: 'Real-time',
  Alerts: [
    {
      Severity: 'URGENT',
      Title: 'Unusual activity detected — Quicksilver Card',
      Summary:
        'A purchase in an unfamiliar location was flagged. We have temporarily paused your card pending your review.',
      Timestamp: '2 mins ago',
    },
    {
      Severity: 'MARKET',
      Title: 'Payment due in 3 days — Venture X',
      Summary: 'Your minimum payment of $45.00 is due Friday. Enable autopay to avoid late fees.',
      Timestamp: '1 hour ago',
    },
    {
      Severity: 'HOLIDAY',
      Title: 'Rate change effective next month',
      Summary:
        'Your Venture X variable APR will update to 19.49% starting August 1, 2026. No action required.',
      Timestamp: '3 hours ago',
    },
  ],
};

const capitalOneDocumentLibraryContent = {
  Heading: 'Document Library (AI-Tagged)',
  AllowUpload: true,
  Assets: [
    {
      AssetName: 'Venture_X_Cardholder_Agreement.pdf',
      AssetClass: 'Credit Card',
      Metadata: ['Rewards', 'Travel', 'No Foreign Fees'],
      ExtractedBy: 'Opal',
      FileLink: { text: null, title: null, target: null, url: { default: '#' } },
    },
    {
      AssetName: 'Capital_One_360_Account_Terms.pdf',
      AssetClass: 'Checking Account',
      Metadata: ['No Monthly Fee', 'FDIC Insured', 'Mobile Deposit'],
      ExtractedBy: 'Opal',
      FileLink: { text: null, title: null, target: null, url: { default: '#' } },
    },
    {
      AssetName: 'Auto_Loan_Pre_Approval_2026.pdf',
      AssetClass: 'Auto Financing',
      Metadata: ['Pre-Qualified', '$35,000', '60 Months'],
      ExtractedBy: 'Opal',
      FileLink: { text: null, title: null, target: null, url: { default: '#' } },
    },
  ],
};

const capitalOneOnboardingContent = {
  Title: 'Account Opening',
  Segment: 'Personal Banking',
  Milestones: [
    { Step: '01', Title: 'Identity Verification', Status: 'COMPLETE' },
    { Step: '02', Title: 'Account Selection', Status: 'COMPLETE' },
    { Step: '03', Title: 'Initial Deposit', Status: 'IN PROGRESS' },
    { Step: '04', Title: 'Card Activation', Status: 'PENDING' },
  ],
};

const capitalOneComplianceContent = {
  Heading: 'CFPB Rule Update — Late Fee Cap',
  Body: {
    html: '<p>New CFPB regulations limit credit card late fees effective Q3 2026. Review updated fee schedules and required customer notification timelines.</p>',
  },
  Severity: 'critical',
  PrimaryCta: { text: 'Download Updated Terms', title: null, target: null, url: { default: '#' } },
  SecondaryCta: { text: 'Contact Compliance', title: null, target: null, url: { default: '#' } },
};

// ---------------------------------------------------------------------------

export const SHOWCASE: ShowcaseBlock[] = [
  {
    slug: 'hero',
    name: 'Hero',
    summary:
      'High-impact hero with kicker, title, subtitle, media background and up to two CTAs.',
    contentType: ct(HeroContentType),
    sourceFile: 'cms/Hero.tsx',
    variants: [
      { label: 'Default (dark)', content: heroContent },
      { label: 'Contrast mode', content: { ...heroContent, ContrastMode: true } },
    ],
    render: (v) => <Hero content={v.content as ContentOf<typeof Hero>} />,
  },
  {
    slug: 'rich-text',
    name: 'Rich Text',
    summary: 'A block of formatted prose authored in the CMS TinyMCE editor.',
    contentType: ct(RichTextContentType),
    sourceFile: 'cms/RichText.tsx',
    variants: [{ content: richTextContent }],
    render: (v) => <RichText content={v.content as ContentOf<typeof RichText>} />,
  },
  {
    slug: 'capital-one-hero',
    name: 'Capital One: Hero',
    summary:
      'Branded hero with eyebrow, serif headline, subtext and up to two CTAs. Theme is a display-template choice.',
    contentType: ct(CibcHeroContentType),
    sourceFile: 'cms/CibcHero.tsx',
    displayTemplates: [dt(CibcHeroDisplayTemplate)],
    variants: [
      { label: 'Theme: Navy (dark)', content: capitalOneHeroContent, displaySettings: { theme: 'dark' } },
      { label: 'Theme: Stone (light)', content: capitalOneHeroContent, displaySettings: { theme: 'light' } },
    ],
    render: (v) => (
      <CibcHero
        content={v.content as ContentOf<typeof CibcHero>}
        displaySettings={v.displaySettings as DisplayOf<typeof CibcHero>}
      />
    ),
  },
  {
    slug: 'capital-one-alert-feed',
    name: 'Capital One: Account Alert Feed',
    summary:
      'A heading plus an ordered list of account alert rows (severity, title, summary, timestamp).',
    contentType: ct(CibcAlertFeedContentType),
    sourceFile: 'cms/CibcAlertFeed.tsx',
    itemTypes: [ct(CibcAlertContentType)],
    variants: [{ content: capitalOneAlertFeedContent }],
    render: (v) => <CibcAlertFeed content={v.content as ContentOf<typeof CibcAlertFeed>} />,
  },
  {
    slug: 'capital-one-document-library',
    name: 'Capital One: Document Library',
    summary:
      'A heading plus a grid of AI-tagged document cards. Column count is a display-template choice.',
    contentType: ct(CibcAssetGridContentType),
    sourceFile: 'cms/CibcAssetGrid.tsx',
    itemTypes: [ct(CibcAssetCardContentType)],
    displayTemplates: [dt(CibcAssetGridDisplayTemplate)],
    variants: [
      { label: 'Columns: Two', content: capitalOneDocumentLibraryContent, displaySettings: { columns: 'two' } },
      {
        label: 'Columns: Three',
        content: capitalOneDocumentLibraryContent,
        displaySettings: { columns: 'three' },
      },
    ],
    render: (v) => (
      <CibcAssetGrid
        content={v.content as ContentOf<typeof CibcAssetGrid>}
        displaySettings={v.displaySettings as DisplayOf<typeof CibcAssetGrid>}
      />
    ),
  },
  {
    slug: 'capital-one-onboarding-journey',
    name: 'Capital One: Onboarding Journey',
    summary:
      'An account opening dashboard: title, segment and an ordered set of milestone cards with status-driven progress bars.',
    contentType: ct(CibcOnboardingJourneyContentType),
    sourceFile: 'cms/CibcOnboardingJourney.tsx',
    itemTypes: [ct(CibcMilestoneContentType)],
    variants: [{ content: capitalOneOnboardingContent }],
    render: (v) => (
      <CibcOnboardingJourney content={v.content as ContentOf<typeof CibcOnboardingJourney>} />
    ),
  },
  {
    slug: 'capital-one-compliance-notice',
    name: 'Capital One: Compliance Notice',
    summary: 'A left-accent callout with heading, rich-text body and up to two CTAs.',
    contentType: ct(CibcRegulatoryDirectiveContentType),
    sourceFile: 'cms/CibcRegulatoryDirective.tsx',
    variants: [{ content: capitalOneComplianceContent }],
    render: (v) => (
      <CibcRegulatoryDirective content={v.content as ContentOf<typeof CibcRegulatoryDirective>} />
    ),
  },
];

/** Look up a single showcase block by its URL slug. */
export function getBlock(slug: string): ShowcaseBlock | undefined {
  return SHOWCASE.find((b) => b.slug === slug);
}
