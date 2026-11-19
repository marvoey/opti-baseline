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

/** The shape Graph returns for a url property ({ default, ... }). */
export type OptiUrl = { default?: string | null } | null | undefined;

/** Resolve a plain string from a url property (undefined when empty). */
export function urlOf(value: OptiUrl): string | undefined {
  return value?.default || undefined;
}

/** Loose link shape accepted by CtaButton (matches what Graph returns for link). */
export type LinkLike = {
  text?: string | null;
  title?: string | null;
  target?: string | null;
  url?: { default?: string | null } | null;
} | null | undefined;
