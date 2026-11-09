// Shared helpers for the Liberty CMS blocks. Kept as `.ts` (not `.tsx`) so the
// `./cms/**/*.tsx` push glob skips it — only files that define content types
// should be scanned by `opti-cli config push`.

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
