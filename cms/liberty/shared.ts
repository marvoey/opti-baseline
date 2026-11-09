// Shared helpers for the Liberty CMS blocks. Kept as `.ts` (not `.tsx`) so the
// `./cms/**/*.tsx` push glob skips it — only files that define content types
// should be scanned by `opti-cli config push`.

import type { AnyContentType } from '@optimizely/cms-sdk';
import { safeHref } from '@/app/_components_liberty/utils';
import type { OptiLink } from '../shared';

export type { OptiLink };

/** Vertical gap above a block. Default (unset) is `md`. */
export type BlockSpacingValue = 'none' | 'sm' | 'md' | 'lg';

/**
 * Spread into a content type's `properties` to add the "Spacing above" selector.
 * sortOrder 5 floats it above the content fields (which start at 10).
 */
export function blockSpacing(sortOrder = 5) {
  return {
    BlockSpacing: {
      type: 'string' as const,
      displayName: 'Spacing above',
      description: 'Space between this block and the one above it. Default: Medium.',
      sortOrder,
      enum: [
        { value: 'none', displayName: 'None' },
        { value: 'sm', displayName: 'Small' },
        { value: 'md', displayName: 'Medium' },
        { value: 'lg', displayName: 'Large' },
      ],
    },
  };
}

const SPACING_CLASS: Record<BlockSpacingValue, string> = {
  none: '',
  sm: 'pt-6',
  md: 'pt-10',
  lg: 'pt-16',
};

/** Tailwind top-padding class for the chosen spacing (defaults to Medium). */
export function spacingClass(value: string | null | undefined): string {
  return SPACING_CLASS[value as BlockSpacingValue] ?? SPACING_CLASS.md;
}

/**
 * Resolve an href from a CMS `link` property. Always passes through `safeHref`
 * so a `javascript:` or `data:` URL entered by an editor falls back to `#`.
 */
export function linkHref(link: OptiLink | undefined): string {
  return safeHref(link?.url?.default);
}

/**
 * Resolve an href for a block that offers BOTH a plain-text URL field and a link
 * picker. The plain URL takes precedence when it is not blank; otherwise the
 * picker value is used. The result is always sanitised by `safeHref`, so a
 * `javascript:` or `data:` value in either field falls back to `#`.
 */
export function resolveHref(plainUrl: string | null | undefined, link: OptiLink | undefined): string {
  const plain = plainUrl?.trim();
  return plain ? safeHref(plain) : linkHref(link);
}

/** Link text from a CMS `link` property, or `fallback` when empty. */
export function linkText(link: OptiLink | undefined, fallback = ''): string {
  return link?.text || fallback;
}

// ---------------------------------------------------------------------------
// Property builders. Each returns one CMS property definition, so a block's
// `properties` stays one short line per field. Text is localized by default.
// ---------------------------------------------------------------------------

/** A single-line (or long) text property. */
export const str = (displayName: string, sortOrder: number, description?: string) => ({
  type: 'string' as const,
  displayName,
  description,
  isLocalized: true,
  sortOrder,
});

/** A true/false switch. */
export const flag = (displayName: string, sortOrder: number, description?: string) => ({
  type: 'boolean' as const,
  displayName,
  description,
  sortOrder,
});

/** A dropdown. `options` is a list of [value, label] pairs. */
export const choice = (
  displayName: string,
  sortOrder: number,
  options: ReadonlyArray<readonly [string, string]>,
  description?: string,
) => ({
  type: 'string' as const,
  displayName,
  description,
  sortOrder,
  enum: options.map(([value, label]) => ({ value, displayName: label })),
});

/** A list of text lines (one string per entry). */
export const strList = (displayName: string, sortOrder: number, description?: string, maxItems = 12) => ({
  type: 'array' as const,
  displayName,
  description,
  isLocalized: true,
  sortOrder,
  maxItems,
  items: { type: 'string' as const },
});

/** A list of embedded item blocks of one type. */
export const itemList = <T extends AnyContentType>(
  displayName: string,
  sortOrder: number,
  contentType: T,
  description?: string,
  maxItems = 12,
) => ({
  type: 'array' as const,
  displayName,
  description,
  isLocalized: true,
  sortOrder,
  maxItems,
  items: { type: 'component' as const, contentType },
});

/** Plain-text link field. Pairs with `linkPicker`; this one wins when both are set. */
export const linkUrl = (sortOrder: number, displayName = 'Link URL (text)') =>
  str(
    displayName,
    sortOrder,
    'Type a path such as /rental-car or a full https:// address. If filled, it is used instead of the picker.',
  );

/** Link-picker field. Used only when the plain-text URL is empty. */
export const linkPicker = (sortOrder: number, displayName = 'Link (picker)') => ({
  type: 'link' as const,
  displayName,
  description: 'Choose a page. Used only when the URL (text) is empty.',
  isLocalized: true,
  sortOrder,
});

/** Trim a list of text lines and drop the empty ones. */
export function lines(list: ReadonlyArray<string | null | undefined> | null | undefined): string[] {
  return (list ?? []).map((s) => s?.trim() ?? '').filter(Boolean);
}

/** Split "A | B | C" into trimmed parts (used by single-line list entries). */
export function parts(line: string | null | undefined): string[] {
  return (line ?? '').split('|').map((p) => p.trim());
}
