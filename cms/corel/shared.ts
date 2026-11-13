// Shared schema helpers + value resolvers for the Corel content types.
// Kept as `.ts` (not `.tsx`) so the `./cms/**/*.tsx` push glob does not scan it —
// only files that define content types should be picked up by `opti-cli`.

import type { OptiLink } from '../shared';

/** Optional HTML id so in-page links (`#id`) can jump to a block. */
export function anchorProp(sortOrder = 1) {
  return {
    AnchorId: {
      type: 'string' as const,
      displayName: 'Anchor ID',
      description: 'Optional HTML id (letters, digits, - and _) so in-page links like #faq can jump to this block.',
      pattern: '^[A-Za-z][A-Za-z0-9_-]*$',
      sortOrder,
    },
  };
}

/**
 * Image slot: a DAM/image reference plus an optional remote URL. The picked image
 * wins; the URL covers remote art (e.g. coreldraw.com assets). When neither
 * resolves the renderer shows the gradient placeholder.
 */
export function imageProps(sortOrder = 40) {
  return {
    Image: {
      type: 'contentReference' as const,
      displayName: 'Image',
      description: 'Pick an image from the CMS.',
      allowedTypes: ['_image'],
      sortOrder,
    },
    ImageUrl: {
      type: 'string' as const,
      displayName: 'Image URL',
      description: 'Used when no image is picked. An https:// address, or a path on coreldraw.com (e.g. /static/…).',
      sortOrder: sortOrder + 1,
    },
  };
}

/** Single-choice dropdown property. */
export function choice(
  displayName: string,
  options: readonly (readonly [value: string, label: string])[],
  sortOrder: number,
  description?: string,
) {
  return {
    type: 'string' as const,
    format: 'selectOne' as const,
    displayName,
    description,
    sortOrder,
    enum: options.map(([value, label]) => ({ value, displayName: label })),
  };
}

export const THEME_OPTIONS = [
  ['light', 'Light'],
  ['dark', 'Dark'],
] as const;

/** Icons available to the icon-style cards (maps to lucide-style paths in the UI). */
export const ICON_OPTIONS = [
  ['cog', 'Settings'],
  ['download', 'Download'],
  ['box', 'Box'],
  ['user', 'User'],
  ['book', 'Book'],
  ['users', 'Users'],
  ['ticket', 'Ticket'],
  ['chat', 'Chat'],
  ['phone', 'Phone'],
  ['star', 'Star'],
  ['globe', 'Globe'],
  ['search', 'Search'],
] as const;

type RawImage =
  | {
      url?: { default?: string | null } | null;
      item?: { Url?: string | null; AltText?: string | null } | null;
    }
  | null
  | undefined;

/** Resolve an image source from the contentReference, falling back to the URL string. */
export function imageSrc(ref: RawImage, fallbackUrl?: string | null): string | undefined {
  return ref?.item?.Url || ref?.url?.default || fallbackUrl || undefined;
}

/** Alt text from the DAM asset when it has one, else the supplied fallback. */
export function imageAlt(ref: RawImage, fallback = ''): string {
  return ref?.item?.AltText || fallback;
}

/** Resolved link: `null` when the editor left it empty (so the UI can omit the button). */
export function resolveLink(link: OptiLink | undefined): { href: string; label: string } | null {
  const href = link?.url?.default;
  if (!href) return null;
  return { href, label: link?.text || link?.title || href };
}

/** Same, for a list of link properties — drops empty entries. */
export function resolveLinks(links: (OptiLink | undefined)[] | null | undefined) {
  return (links ?? []).map(resolveLink).filter((l): l is { href: string; label: string } => l !== null);
}

/** Non-empty strings only (array-of-string properties can contain blanks). */
export function strings(list: (string | null | undefined)[] | null | undefined): string[] {
  return (list ?? []).filter((s): s is string => typeof s === 'string' && s.trim() !== '');
}

/**
 * Group consecutive items that share a key (e.g. release month, spec platform).
 * Items with an empty key stay together in one unnamed group. Order is preserved.
 */
export function groupConsecutive<T>(items: T[], keyOf: (item: T) => string | null | undefined) {
  const groups: { group: string; items: T[] }[] = [];
  for (const item of items) {
    const group = keyOf(item) ?? '';
    const last = groups[groups.length - 1];
    if (last && last.group === group) last.items.push(item);
    else groups.push({ group, items: [item] });
  }
  return groups;
}
