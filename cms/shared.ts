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
