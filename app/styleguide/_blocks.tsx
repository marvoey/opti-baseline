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

// V1 atomic design system — primitives (atoms) plus the composition shell.
import V1Text, { V1TextContentType, V1TextDefault } from '@/cms/V1Text';
import V1Button, { V1ButtonContentType, V1ButtonDefault } from '@/cms/V1Button';
import V1Image, { V1ImageContentType, V1ImageDefault } from '@/cms/V1Image';
import V1Icon, { V1IconContentType, V1IconDefault } from '@/cms/V1Icon';
import V1Divider, { V1DividerContentType, V1DividerDefault } from '@/cms/V1Divider';
import V1Section, { V1SectionContentType, V1SectionDefault } from '@/cms/V1Section';
import { V1RowDefault, V1ColumnDefault } from '@/cms/flexContainers';

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

// --- V1 atomic design system --------------------------------------------------
// Each atom takes a single content field plus a display template that chooses its
// presentation. The variants below walk every display-template option so the
// styleguide shows the full matrix an editor can pick from.

const v1Link = (text: string) => ({ text, title: null, target: null, url: { default: '#' } });

// A self-contained sample image (data URI) so V1Image previews render offline and
// deterministically — a 16:10 gradient so `cover`/`contain`/ratio crops are visible.
const SAMPLE_IMG =
  'data:image/svg+xml;utf8,' +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="320" height="200">` +
      `<defs><linearGradient id="g" x1="0" y1="0" x2="1" y2="1">` +
      `<stop offset="0" stop-color="#0b3b3c"/><stop offset="1" stop-color="#a68a4e"/>` +
      `</linearGradient></defs><rect width="320" height="200" fill="url(%23g)"/>` +
      `<circle cx="250" cy="55" r="28" fill="%23f4efe6" fill-opacity="0.85"/>` +
      `<text x="20" y="180" font-family="sans-serif" font-size="18" fill="%23ffffff">Sample 16:10</text></svg>`,
  );

// ---------------------------------------------------------------------------
// Composition nodes — the Visual Builder delivers a section's grid as a tree of
// row / column / component nodes. V1Section renders that tree via the SDK's
// OptimizelyGridSection, which resolves component leaves through the React
// component registry (initialised for every route by app/layout.tsx importing
// cms/registry). These helpers build that shape so the Section preview exercises
// the real Section + Row + Column + atom stack, not a hand-rolled mock.
// ---------------------------------------------------------------------------

/** displaySettings arrive from Graph as a [{key,value}] array of strings. */
const settings = (obj: Record<string, string | boolean>) =>
  Object.entries(obj).map(([key, value]) => ({ key, value: String(value) }));

/** A component (leaf) node — resolved to its React component by __typename. */
const comp = (
  key: string,
  typename: string,
  props: Record<string, unknown>,
  displayTemplateKey: string,
  ds: Record<string, string | boolean> = {},
) => ({
  __typename: 'CompositionComponentNode',
  key,
  nodeType: 'component',
  displayTemplateKey,
  displaySettings: settings(ds),
  component: { __typename: typename, ...props },
});

/** A structure (row / column) node — rendered by V1Row / V1Column. */
const struct = (
  key: string,
  nodeType: 'row' | 'column',
  displayTemplateKey: string,
  ds: Record<string, string | boolean>,
  nodes: unknown[],
) => ({
  __typename: 'CompositionStructureNode',
  key,
  nodeType,
  displayTemplateKey,
  displaySettings: settings(ds),
  nodes,
});

/** A hero-like composition: eyebrow + display heading + body + CTAs, next to an
 *  icon column — enough to show the Section shell hosting the atoms via the grid. */
const sectionNodes = (tone: 'onDark' | 'default') => [
  struct(
    'row',
    'row',
    'V1RowDefault',
    { columnLayout: 'wideLeft', columnGap: 'wide', verticalAlignment: 'center', stackOnMobile: true },
    [
      struct('col-copy', 'column', 'V1ColumnDefault', { contentGap: 'normal' }, [
        comp('eyebrow', 'V1Text', { Text: 'Digital Banking' }, 'V1TextDefault', { variant: 'eyebrow' }),
        comp(
          'headline',
          'V1Text',
          { Text: 'Banking that puts you first' },
          'V1TextDefault',
          { variant: 'display', tone },
        ),
        comp(
          'body',
          'V1Text',
          { Text: 'Manage accounts, track spending and grow savings — with AI-powered insights built for real life.' },
          'V1TextDefault',
          { variant: 'body', tone },
        ),
        comp('cta', 'V1Button', { Link: v1Link('Open an Account') }, 'V1ButtonDefault', {
          variant: 'primary',
          size: 'lg',
        }),
      ]),
      struct('col-media', 'column', 'V1ColumnDefault', { contentAlignment: 'center', selfAlignment: 'center' }, [
        comp('icon', 'V1Icon', { Name: 'trending', Label: 'Growth' }, 'V1IconDefault', {
          size: 'xl',
          tone: 'gold',
        }),
      ]),
    ],
  ),
];

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

  // --- V1 atomic design system -------------------------------------------------
  {
    slug: 'v1-text',
    name: 'V1: Text',
    summary:
      'The atomic text primitive. One Text field; the semantic tag, size, weight and colour are a display-template choice (variant / tone / align).',
    contentType: ct(V1TextContentType),
    sourceFile: 'cms/V1Text.tsx',
    displayTemplates: [dt(V1TextDefault)],
    variants: [
      { label: 'Variant: Eyebrow (pill)', content: { Text: 'Digital Banking' }, displaySettings: { variant: 'eyebrow' } },
      { label: 'Variant: Display (H1)', content: { Text: 'Banking that puts you first' }, displaySettings: { variant: 'display' } },
      { label: 'Variant: Heading (H2)', content: { Text: 'Why millions choose us' }, displaySettings: { variant: 'heading' } },
      { label: 'Variant: Title (H3)', content: { Text: 'Real-time fraud alerts' }, displaySettings: { variant: 'title' } },
      { label: 'Variant: Body', content: { Text: 'Open an account, apply for a card, or manage your money — all in one place.' }, displaySettings: { variant: 'body' } },
      { label: 'Variant: Caption', content: { Text: 'FDIC insured. Terms apply.' }, displaySettings: { variant: 'caption' } },
      { label: 'Tone: Muted', content: { Text: 'Supporting, lower-emphasis copy.' }, displaySettings: { variant: 'body', tone: 'muted' } },
      { label: 'Tone: Gold', content: { Text: 'Accent copy in the brand gold.' }, displaySettings: { variant: 'body', tone: 'gold' } },
      { label: 'Align: Center', content: { Text: 'Centered heading' }, displaySettings: { variant: 'heading', align: 'center' } },
    ],
    render: (v) => (
      <V1Text
        content={v.content as ContentOf<typeof V1Text>}
        displaySettings={v.displaySettings as DisplayOf<typeof V1Text>}
      />
    ),
  },
  {
    slug: 'v1-button',
    name: 'V1: Button',
    summary:
      'The atomic call-to-action. A single Link; the look (primary / secondary / ghost) and size are display-template choices.',
    contentType: ct(V1ButtonContentType),
    sourceFile: 'cms/V1Button.tsx',
    displayTemplates: [dt(V1ButtonDefault)],
    variants: [
      { label: 'Primary (gold) · Medium', content: { Link: v1Link('Open an Account') }, displaySettings: { variant: 'primary', size: 'md' } },
      { label: 'Secondary (outline) · Medium', content: { Link: v1Link('Compare Cards') }, displaySettings: { variant: 'secondary', size: 'md' } },
      { label: 'Ghost (text) · Medium', content: { Link: v1Link('Learn more') }, displaySettings: { variant: 'ghost', size: 'md' } },
      { label: 'Primary · Small', content: { Link: v1Link('Get Started') }, displaySettings: { variant: 'primary', size: 'sm' } },
      { label: 'Primary · Large', content: { Link: v1Link('Get Started') }, displaySettings: { variant: 'primary', size: 'lg' } },
    ],
    render: (v) => (
      <V1Button
        content={v.content as ContentOf<typeof V1Button>}
        displaySettings={v.displaySettings as DisplayOf<typeof V1Button>}
      />
    ),
  },
  {
    slug: 'v1-image',
    name: 'V1: Image',
    summary:
      'The atomic image primitive — a DAM reference or URL override. Aspect ratio, corner rounding and object-fit are display-template choices.',
    contentType: ct(V1ImageContentType),
    sourceFile: 'cms/V1Image.tsx',
    displayTemplates: [dt(V1ImageDefault)],
    variants: [
      { label: 'Ratio: Auto (intrinsic)', content: { ImageUrl: { default: SAMPLE_IMG }, Alt: 'Sample' }, displaySettings: { ratio: 'auto' } },
      { label: 'Ratio: Square (1:1) · Cover', content: { ImageUrl: { default: SAMPLE_IMG }, Alt: 'Sample' }, displaySettings: { ratio: 'square', fit: 'cover' } },
      { label: 'Ratio: Wide (16:9) · Rounded', content: { ImageUrl: { default: SAMPLE_IMG }, Alt: 'Sample' }, displaySettings: { ratio: 'wide', rounded: 'lg' } },
      { label: 'Ratio: Portrait (3:4) · Contain', content: { ImageUrl: { default: SAMPLE_IMG }, Alt: 'Sample' }, displaySettings: { ratio: 'portrait', fit: 'contain' } },
      { label: 'Corners: Circle', content: { ImageUrl: { default: SAMPLE_IMG }, Alt: 'Sample' }, displaySettings: { ratio: 'square', rounded: 'full' } },
    ],
    render: (v) => (
      <V1Image
        content={v.content as ContentOf<typeof V1Image>}
        displaySettings={v.displaySettings as DisplayOf<typeof V1Image>}
      />
    ),
  },
  {
    slug: 'v1-icon',
    name: 'V1: Icon',
    summary:
      'The atomic icon primitive — a curated lucide glyph chosen from a whitelist. Size and tone are display-template choices.',
    contentType: ct(V1IconContentType),
    sourceFile: 'cms/V1Icon.tsx',
    displayTemplates: [dt(V1IconDefault)],
    variants: [
      { label: 'Shield · Large · Teal', content: { Name: 'shield', Label: 'Secure' }, displaySettings: { size: 'lg', tone: 'teal' } },
      { label: 'Bar chart · Extra large · Gold', content: { Name: 'barChart', Label: 'Analytics' }, displaySettings: { size: 'xl', tone: 'gold' } },
      { label: 'Bell · Medium · Default', content: { Name: 'bell', Label: 'Alerts' }, displaySettings: { size: 'md' } },
      { label: 'Lock · Small · Muted', content: { Name: 'lock', Label: 'Private' }, displaySettings: { size: 'sm', tone: 'muted' } },
    ],
    render: (v) => (
      <V1Icon
        content={v.content as ContentOf<typeof V1Icon>}
        displaySettings={v.displaySettings as DisplayOf<typeof V1Icon>}
      />
    ),
  },
  {
    slug: 'v1-divider',
    name: 'V1: Divider',
    summary:
      'The atomic horizontal rule. No content fields — every knob (weight, tone, vertical spacing) lives on the display template.',
    contentType: ct(V1DividerContentType),
    sourceFile: 'cms/V1Divider.tsx',
    displayTemplates: [dt(V1DividerDefault)],
    variants: [
      { label: 'Hairline · Muted · Medium', content: {}, displaySettings: { weight: 'hairline', tone: 'muted', spacing: 'md' } },
      { label: 'Thin · Gold · Small', content: {}, displaySettings: { weight: 'thin', tone: 'gold', spacing: 'sm' } },
      { label: 'Thick · Gold · Large', content: {}, displaySettings: { weight: 'thick', tone: 'gold', spacing: 'lg' } },
    ],
    render: (v) => (
      <V1Divider
        content={v.content as ContentOf<typeof V1Divider>}
        displaySettings={v.displaySettings as DisplayOf<typeof V1Divider>}
      />
    ),
  },
  {
    slug: 'v1-section',
    name: 'V1: Section',
    summary:
      'The composition shell that hosts the row/column grid of atoms. Theme, decoration, padding, content width and corners are display-template choices. Row and Column each carry their own display template (below).',
    contentType: ct(V1SectionContentType),
    sourceFile: 'cms/V1Section.tsx',
    // All three composition display templates: the Section shell plus the
    // structural Row and Column that lay out its children.
    displayTemplates: [dt(V1SectionDefault), dt(V1RowDefault), dt(V1ColumnDefault)],
    variants: [
      {
        label: 'Theme: Navy (dark) · Chart motif',
        content: { nodes: sectionNodes('onDark') },
        displaySettings: { theme: 'dark', decoration: 'chart', padding: 'lg', contentWidth: 'lg', rounded: true },
      },
      {
        label: 'Theme: Stone (light)',
        content: { nodes: sectionNodes('default') },
        displaySettings: { theme: 'light', padding: 'lg', contentWidth: 'lg', rounded: true },
      },
      {
        label: 'Theme: Plain (transparent)',
        content: { nodes: sectionNodes('default') },
        displaySettings: { theme: 'plain', padding: 'md', contentWidth: 'md' },
      },
    ],
    render: (v) => (
      <V1Section
        content={v.content as ContentOf<typeof V1Section>}
        displaySettings={v.displaySettings as DisplayOf<typeof V1Section>}
      />
    ),
  },
];

/** Look up a single showcase block by its URL slug. */
export function getBlock(slug: string): ShowcaseBlock | undefined {
  return SHOWCASE.find((b) => b.slug === slug);
}
