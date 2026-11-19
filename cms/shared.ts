// Small shared helpers for the CMS block components. Kept as `.ts` (not `.tsx`)
// so the `./cms/**/*.tsx` push glob does not scan it — only files that define
// content types should be picked up by `opti-cli config push`.

/** The shape Graph returns for a `link` property. */
export type OptiLink = {
  text: string | null;
  title: string | null;
  target: string | null;
  url: { default: string | null } | null;
} | null;

/** Resolve a usable href from a `link` property (falls back to '#'). */
export function ctaHref(link: OptiLink): string {
  return link?.url?.default ?? '#';
}

/** Resolve an href from a `url` property (string or `{ default }`); '#' when empty. */
export function urlHref(value: unknown): string {
  if (typeof value === 'string') return value || '#';
  const d = (value as { default?: string | null } | null | undefined)?.default;
  return d || '#';
}

/**
 * The Medicare plans hub. A CTA whose URL was left blank lands here instead of on
 * a dead '#', so a half-finished block (or an older variation that never got its
 * link filled in) still goes somewhere sensible.
 */
export const DEFAULT_CTA_HREF = '/medicare';

/** True when a `url` property (string or `{ default }`) holds a real destination. */
export function hasUrl(value: unknown): boolean {
  const v = typeof value === 'string' ? value : (value as { default?: string | null } | null | undefined)?.default;
  return !!v && v !== '#';
}

/** Like `urlHref`, but a blank (or bare '#') URL falls back to `fallback` rather than a dead '#'. */
export function urlHrefOr(value: unknown, fallback: string = DEFAULT_CTA_HREF): string {
  if (!hasUrl(value)) return fallback;
  return typeof value === 'string' ? value : (value as { default: string }).default;
}

/**
 * Rewrite rich-text link targets that are a bare '#' (an unfinished link) to
 * `fallback`. Walks the whole rich-text JSON tree and only touches `url` / `href`
 * values that are exactly '#', so every real link is left alone.
 */
export function fixDeadLinks<T>(node: T, fallback: string = DEFAULT_CTA_HREF): T {
  if (Array.isArray(node)) return node.map((n) => fixDeadLinks(n, fallback)) as unknown as T;
  if (node && typeof node === 'object') {
    const out: Record<string, unknown> = {};
    for (const [k, v] of Object.entries(node as Record<string, unknown>)) {
      out[k] = (k === 'url' || k === 'href') && v === '#' ? fallback : fixDeadLinks(v, fallback);
    }
    return out as T;
  }
  return node;
}

/** Resolve an image URL from a content reference (`{ url: { default } }`). */
export function imageSrc(ref: unknown): string | null {
  return (ref as { url?: { default?: string | null } | null } | null | undefined)?.url?.default ?? null;
}
