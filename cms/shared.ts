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

/**
 * Resolve a CTA from the translatable split (`label` string + `url`) with the
 * legacy `link` property as fallback. The link is only used when neither half
 * of the split is provided. Returns null when there is nothing to render.
 */
export function resolveCta(
  label: string | null | undefined,
  url: string | null | undefined,
  link: OptiLink | undefined,
  fallbackLabel: string,
): { label: string; href: string } | null {
  const splitUrl = url?.trim() || null;
  if (label || splitUrl) {
    return { label: label || fallbackLabel, href: splitUrl ?? '#' };
  }
  if (link) {
    return { label: ctaLabel(link, fallbackLabel), href: ctaHref(link) };
  }
  return null;
}

/** Resolve a usable href from a `link` property (falls back to '#'). */
export function ctaHref(link: OptiLink): string {
  return link?.url?.default ?? '#';
}

/** Visible text of a `link` property, falling back to a default label. */
export function ctaLabel(link: OptiLink, fallback: string): string {
  return link?.text || fallback;
}
