/**
 * Paid landing pages live under /lp (for example /lp/aca-2027). They get a minimal
 * header and footer, with no site navigation, so a paid visitor stays on the page.
 *
 * proxy.ts tags the request with CHROME_HEADER when the path is a landing path, and
 * app/[locale]/layout.tsx reads it, because a layout cannot see the URL path itself.
 * The proxy always overwrites the header, so a client cannot spoof it.
 */

export const CHROME_HEADER = 'x-eh-chrome';
export const LANDING_CHROME = 'landing';

/** First path segment of the landing-page section of the CMS tree. */
export const LANDING_SEGMENT = 'lp';

/**
 * True for /lp and /lp/..., also when a non-default locale segment comes first
 * (/fr/lp/...). `localeSegments` are the non-default locale route segments.
 */
export function isLandingPath(pathname: string, localeSegments: readonly string[]): boolean {
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length > 0 && localeSegments.includes(segments[0])) segments.shift();
  return segments[0] === LANDING_SEGMENT;
}
