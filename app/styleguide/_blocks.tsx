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
  SuperHeader: 'Private Banking',
  MainTitle: 'Intelligence for institutional capital',
  SubTitle:
    'Bring AI-assisted insight to every mandate — from onboarding to regulatory filing — on one secure platform.',
  PrimaryCTA: { text: 'Book a demo', title: null, target: null, url: { default: '#' } },
  SecondaryCTA: { text: 'Talk to sales', title: null, target: null, url: { default: '#' } },
  ContrastMode: false,
};

const richTextContent = {
  BlockWidth: 'medium',
  Body: {
    json: {
      type: 'richText',
      children: [
        { type: 'heading-two', children: [{ text: 'Why institutions choose us' }] },
        {
          type: 'paragraph',
          children: [
            { text: 'Our platform pairs ' },
            { text: 'institutional-grade security', bold: true },
            { text: ' with AI-assisted workflows so your teams move faster with less risk.' },
          ],
        },
        {
          type: 'bulleted-list',
          children: [
            { type: 'list-item', children: [{ text: 'Automated asset tagging and extraction' }] },
            { type: 'list-item', children: [{ text: 'Real-time operational alerting' }] },
            { type: 'list-item', children: [{ text: 'Guided regulatory onboarding' }] },
          ],
        },
      ],
    },
  },
};

const cibcHeroContent = {
  Eyebrow: 'Asset Intelligence',
  Headline: 'See the whole picture of your private markets',
  Subtext:
    'Surface insight across funds, mandates and counterparties — with AI extraction built for the back office.',
  PrimaryCta: { text: 'Explore the platform', title: null, target: null, url: { default: '#' } },
  SecondaryCta: { text: 'Read the brief', title: null, target: null, url: { default: '#' } },
};

const cibcAlertFeedContent = {
  Heading: 'Operational Alerts',
  FeedLabel: 'Live Feed',
  Alerts: [
    {
      Severity: 'URGENT',
      Title: 'Settlement break detected — Fund VII',
      Summary: 'A T+1 settlement mismatch was flagged on a private credit position. Review required.',
      Timestamp: '2 mins ago',
    },
    {
      Severity: 'MARKET',
      Title: 'FX exposure threshold approached',
      Summary: 'CAD/USD exposure is within 3% of the mandate ceiling for the institutional book.',
      Timestamp: '18 mins ago',
    },
    {
      Severity: 'HOLIDAY',
      Title: 'Reduced settlement window Friday',
      Summary: 'A market holiday shortens the settlement window; expect delayed confirmations.',
      Timestamp: '1 hour ago',
    },
  ],
};

const cibcAssetGridContent = {
  Heading: 'Asset Intelligence (AI-Tagged)',
  AllowUpload: true,
  Assets: [
    {
      AssetName: 'Fund_VII_LPA_Executed.pdf',
      AssetClass: 'Private Equity',
      Metadata: ['Vintage 2024', 'Buyout', 'Tier-1 LP'],
      ExtractedBy: 'Opal',
      FileLink: { text: null, title: null, target: null, url: { default: '#' } },
    },
    {
      AssetName: 'Tower_District_Appraisal.xlsx',
      AssetClass: 'Real Estate',
      Metadata: ['Core+', 'Toronto', 'Q2 valuation'],
      ExtractedBy: 'Opal',
      FileLink: { text: null, title: null, target: null, url: { default: '#' } },
    },
    {
      AssetName: 'Infra_Debt_Term_Sheet.pdf',
      AssetClass: 'Private Credit',
      Metadata: ['Senior', 'Floating', 'Investment grade'],
      ExtractedBy: 'Opal',
      FileLink: { text: null, title: null, target: null, url: { default: '#' } },
    },
  ],
};

const cibcOnboardingContent = {
  Title: 'Institutional Onboarding',
  Segment: 'Pension & Sovereign Wealth',
  Milestones: [
    { Step: '01', Title: 'KYC & Entity', Status: 'COMPLETE' },
    { Step: '02', Title: 'Mandate Setup', Status: 'COMPLETE' },
    { Step: '03', Title: 'Funding', Status: 'IN PROGRESS' },
    { Step: '04', Title: 'Go Live', Status: 'PENDING' },
  ],
};

const cibcRegulatoryContent = {
  Heading: 'Regulatory Directive — OSFI B-20 Update',
  Body: {
    html: '<p>New stress-testing guidance takes effect next quarter. Affected mandates must refile risk attestations through the compliance desk before the deadline.</p>',
  },
  Severity: 'critical',
  PrimaryCta: { text: 'Download Guidance PDF', title: null, target: null, url: { default: '#' } },
  SecondaryCta: { text: 'Contact Compliance Desk', title: null, target: null, url: { default: '#' } },
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
    slug: 'cibc-hero',
    name: 'CIBC: Hero',
    summary:
      'Branded hero with eyebrow, serif headline, subtext and up to two CTAs. Theme is a display-template choice.',
    contentType: ct(CibcHeroContentType),
    sourceFile: 'cms/CibcHero.tsx',
    displayTemplates: [dt(CibcHeroDisplayTemplate)],
    variants: [
      { label: 'Theme: Teal (dark)', content: cibcHeroContent, displaySettings: { theme: 'dark' } },
      { label: 'Theme: Stone (light)', content: cibcHeroContent, displaySettings: { theme: 'light' } },
    ],
    render: (v) => (
      <CibcHero
        content={v.content as ContentOf<typeof CibcHero>}
        displaySettings={v.displaySettings as DisplayOf<typeof CibcHero>}
      />
    ),
  },
  {
    slug: 'cibc-alert-feed',
    name: 'CIBC: Operational Alert Feed',
    summary:
      'A heading plus an ordered list of operational alert rows (severity, title, summary, timestamp).',
    contentType: ct(CibcAlertFeedContentType),
    sourceFile: 'cms/CibcAlertFeed.tsx',
    itemTypes: [ct(CibcAlertContentType)],
    variants: [{ content: cibcAlertFeedContent }],
    render: (v) => <CibcAlertFeed content={v.content as ContentOf<typeof CibcAlertFeed>} />,
  },
  {
    slug: 'cibc-asset-grid',
    name: 'CIBC: Asset Intelligence Grid',
    summary:
      'A heading plus a grid of AI-tagged asset cards. Column count is a display-template choice.',
    contentType: ct(CibcAssetGridContentType),
    sourceFile: 'cms/CibcAssetGrid.tsx',
    itemTypes: [ct(CibcAssetCardContentType)],
    displayTemplates: [dt(CibcAssetGridDisplayTemplate)],
    variants: [
      { label: 'Columns: Two', content: cibcAssetGridContent, displaySettings: { columns: 'two' } },
      {
        label: 'Columns: Three',
        content: cibcAssetGridContent,
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
    slug: 'cibc-onboarding-journey',
    name: 'CIBC: Onboarding Journey',
    summary:
      'An onboarding dashboard: title, segment and an ordered set of milestone cards with status-driven progress bars.',
    contentType: ct(CibcOnboardingJourneyContentType),
    sourceFile: 'cms/CibcOnboardingJourney.tsx',
    itemTypes: [ct(CibcMilestoneContentType)],
    variants: [{ content: cibcOnboardingContent }],
    render: (v) => (
      <CibcOnboardingJourney content={v.content as ContentOf<typeof CibcOnboardingJourney>} />
    ),
  },
  {
    slug: 'cibc-regulatory-directive',
    name: 'CIBC: Regulatory Directive',
    summary: 'A left-accent callout with heading, rich-text body and up to two CTAs.',
    contentType: ct(CibcRegulatoryDirectiveContentType),
    sourceFile: 'cms/CibcRegulatoryDirective.tsx',
    variants: [{ content: cibcRegulatoryContent }],
    render: (v) => (
      <CibcRegulatoryDirective content={v.content as ContentOf<typeof CibcRegulatoryDirective>} />
    ),
  },
];

/** Look up a single showcase block by its URL slug. */
export function getBlock(slug: string): ShowcaseBlock | undefined {
  return SHOWCASE.find((b) => b.slug === slug);
}
