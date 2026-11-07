/** Join class names, skipping falsy values. */
export function cx(...parts: Array<string | false | null | undefined>): string {
  return parts.filter(Boolean).join(' ');
}

/**
 * Only allow link targets that are safe to render in an href: same-site paths,
 * fragments, query strings, http(s), mailto and tel. Anything else (for example
 * `javascript:` or `data:` URLs, or protocol-relative `//host` and `/\host`
 * paths) falls back to `fallback`. Component text/links are props, so this keeps
 * a future CMS- or user-supplied value from becoming a script-injection vector.
 */
const SAFE_HREF = /^(?:https?:\/\/|mailto:|tel:|#|\?|\/(?![/\\]))/i;

export function safeHref(href?: string | null, fallback = '#'): string {
  if (!href) return fallback;
  const value = href.trim();
  return SAFE_HREF.test(value) ? value : fallback;
}

/** In-text teal link style (the mockup's `a.lk`). */
export const LINK_CLASS = 'text-lmt underline underline-offset-2';
