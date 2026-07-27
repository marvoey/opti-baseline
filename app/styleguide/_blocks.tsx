import type { ReactNode } from 'react';

import Paragraph, {
  ParagraphContentType,
  ParagraphDisplayTemplate,
  ParagraphSimpleDisplayTemplate,
} from '@/cms/BasicBlocks/Paragraph';
import CardBlock, { CardBlockContentType } from '@/cms/BasicBlocks/CardBlock';
import ActionBlock, { ActionBlockContentType } from '@/cms/BasicBlocks/ActionBlock';
import ComplianceBlock, { ComplianceBlockContentType } from '@/cms/BasicBlocks/ComplianceBlock';
import HeroBlock, {
  HeroBlockContentType,
  HeroBlockDisplayTemplate,
} from '@/cms/BasicBlocks/HeroBlock';

/**
 * Single source of truth for the /styleguide route. Both the index page and the
 * per-block detail pages (/styleguide/[slug]) read from SHOWCASE, so a block is
 * described once: its content type, source file, sample content and how to
 * render it.
 *
 * To add a new block: import its component + contentType (and any display
 * template / nested item types), then add a ShowcaseBlock entry below.
 */

/** The `content` prop type of a block component, inferred from its signature. */
export type ContentOf<C> = C extends (props: { content: infer T }) => unknown ? T : never;

/** The `displaySettings` prop type of a block component, inferred from its signature. */
export type DisplayOf<C> = C extends (props: { displaySettings?: infer T }) => unknown
  ? T
  : never;

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
  slug: string;
  name: string;
  summary: string;
  contentType: ContentTypeDef;
  sourceFile: string;
  itemTypes?: ContentTypeDef[];
  displayTemplates?: DisplayTemplateDef[];
  variants: Variant[];
  render: (variant: Variant) => ReactNode;
};

export const ct = (def: unknown) => def as unknown as ContentTypeDef;
export const dt = (def: unknown) => def as unknown as DisplayTemplateDef;

// ---------------------------------------------------------------------------
// Sample content
// ---------------------------------------------------------------------------

const paragraphContent = {
  Text: {
    json: {
      type: 'richText',
      children: [
        { type: 'heading-one', children: [{ text: 'Strategic Expansion Briefing' }] },
        {
          type: 'paragraph',
          children: [
            { text: 'This briefing outlines the regulatory, operational, and product considerations for expanding client exposure to ' },
            { text: 'European equity markets', bold: true },
            { text: '. Review each section before scheduling a strategy session.' },
          ],
        },
        { type: 'heading-two', children: [{ text: 'Regulatory Impact' }] },
        {
          type: 'paragraph',
          children: [{ text: 'MiFID II reporting obligations apply to all transactions in European-listed equities, regardless of client domicile.' }],
        },
        { type: 'heading-two', children: [{ text: 'Custody Requirements' }] },
        {
          type: 'paragraph',
          children: [{ text: 'European equities require settlement across Euroclear, Clearstream, and local CSDs in Nordic and Eastern European markets.' }],
        },
      ],
    },
  },
};

const cardContent = {
  Title: 'Global Custody',
  Body: {
    json: {
      type: 'richText',
      children: [
        {
          type: 'paragraph',
          children: [{ text: 'Multi-market settlement and safekeeping services for European-listed securities across 30+ markets.' }],
        },
      ],
    },
  },
};

const actionContent = {
  Label: 'Schedule Strategy Session',
  Href: { default: '#' },
  Variant: 'primary',
};

const complianceContent = {
  Jurisdiction: 'EU / MiFID II',
  Body: {
    json: {
      type: 'richText',
      children: [
        {
          type: 'paragraph',
          children: [
            { text: 'GLOBAL COMPLIANCE BLOCK (LOCKED)', bold: true },
            { text: ' — This content has been reviewed and approved by the Compliance team. Any changes require a formal review cycle.' },
          ],
        },
      ],
    },
  },
};

const heroContent = {
  Body: {
    json: {
      type: 'richText',
      children: [
        { type: 'heading-one', children: [{ text: 'Strategic Expansion Briefing: European Equities' }] },
        {
          type: 'paragraph',
          children: [{ text: 'This briefing outlines the regulatory, operational, and product considerations for expanding client exposure to European equity markets.' }],
        },
      ],
    },
  },
};

// ---------------------------------------------------------------------------

export const SHOWCASE: ShowcaseBlock[] = [
  {
    slug: 'paragraph',
    name: 'Paragraph',
    summary: 'Rich text block with optional table-of-contents sidebar, driven by heading structure.',
    contentType: ct(ParagraphContentType),
    sourceFile: 'cms/BasicBlocks/Paragraph.tsx',
    displayTemplates: [dt(ParagraphDisplayTemplate), dt(ParagraphSimpleDisplayTemplate)],
    variants: [
      {
        label: 'Default (with TOC)',
        content: paragraphContent,
      },
      {
        label: 'Simple (no TOC)',
        content: { ...paragraphContent, __composition: { displayTemplateKey: 'ParagraphSimple' } },
      },
    ],
    render: (v) => <Paragraph content={v.content as ContentOf<typeof Paragraph>} displaySettings={v.displaySettings as DisplayOf<typeof Paragraph>} />,
  },
  {
    slug: 'card-block',
    name: 'Card Block',
    summary: 'Standardised card for a single entity — product, service, or article.',
    contentType: ct(CardBlockContentType),
    sourceFile: 'cms/BasicBlocks/CardBlock.tsx',
    variants: [
      { label: 'With link', content: { ...cardContent, Link: { default: '#' } } },
      { label: 'No link',   content: cardContent },
    ],
    render: (v) => <CardBlock content={v.content as ContentOf<typeof CardBlock>} />,
  },
  {
    slug: 'action-block',
    name: 'Action Block',
    summary: 'Governed CTA button for triggering workflows. Variant controls visual style.',
    contentType: ct(ActionBlockContentType),
    sourceFile: 'cms/BasicBlocks/ActionBlock.tsx',
    variants: [
      { label: 'Primary',   content: { ...actionContent, Variant: 'primary' } },
      { label: 'Secondary', content: { ...actionContent, Variant: 'secondary', Label: 'Learn More' } },
      { label: 'Danger',    content: { ...actionContent, Variant: 'danger',    Label: 'Remove Access' } },
    ],
    render: (v) => <ActionBlock content={v.content as ContentOf<typeof ActionBlock>} />,
  },
  {
    slug: 'compliance-block',
    name: 'Compliance Block',
    summary: 'Governed compliance callout. Content is locked — AI assembly may not modify it.',
    contentType: ct(ComplianceBlockContentType),
    sourceFile: 'cms/BasicBlocks/ComplianceBlock.tsx',
    variants: [
      { content: complianceContent },
      { label: 'No jurisdiction', content: { ...complianceContent, Jurisdiction: null } },
    ],
    render: (v) => <ComplianceBlock content={v.content as ContentOf<typeof ComplianceBlock>} />,
  },
  {
    slug: 'hero-block',
    name: 'Hero Block v2',
    summary: 'Full-width hero with background image fallback and rich text overlay. Theme is a display-template choice.',
    contentType: ct(HeroBlockContentType),
    sourceFile: 'cms/BasicBlocks/HeroBlock.tsx',
    displayTemplates: [dt(HeroBlockDisplayTemplate)],
    variants: [
      { label: 'Default',       content: heroContent, displaySettings: { theme: 'default' } },
      { label: 'Theme: Light',  content: heroContent, displaySettings: { theme: 'light' } },
      { label: 'Theme: Dark',   content: heroContent, displaySettings: { theme: 'dark' } },
    ],
    render: (v) => (
      <HeroBlock
        content={v.content as ContentOf<typeof HeroBlock>}
        displaySettings={v.displaySettings as DisplayOf<typeof HeroBlock>}
      />
    ),
  },
];

/** Look up a single showcase block by its URL slug. */
export function getBlock(slug: string): ShowcaseBlock | undefined {
  return SHOWCASE.find((b) => b.slug === slug);
}
