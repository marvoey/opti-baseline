import type { ReactNode } from 'react';

import Hero, { HeroContentType } from '@/cms/Hero';
import RichText, { RichTextContentType } from '@/cms/RichText';

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
];

/** Look up a single showcase block by its URL slug. */
export function getBlock(slug: string): ShowcaseBlock | undefined {
  return SHOWCASE.find((b) => b.slug === slug);
}
