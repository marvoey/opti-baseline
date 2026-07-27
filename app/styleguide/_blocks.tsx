import type { ReactNode } from 'react';

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

export const ct = (def: unknown) => def as unknown as ContentTypeDef;
export const dt = (def: unknown) => def as unknown as DisplayTemplateDef;

// ---------------------------------------------------------------------------

export const SHOWCASE: ShowcaseBlock[] = [];

/** Look up a single showcase block by its URL slug. */
export function getBlock(slug: string): ShowcaseBlock | undefined {
  return SHOWCASE.find((b) => b.slug === slug);
}
