// Locale helpers — the single place that turns the CMS-generated locale data
// (lib/locales.generated.ts) into routing logic. Consumed by proxy.ts, the
// catch-all page, and the LanguageSwitcher.

import { LOCALES, DEFAULT_LOCALE, type Locale } from './locales.generated';

export { LOCALES, DEFAULT_LOCALE };
export type { Locale };

/** Route segments of all non-default locales (e.g. ["fr", "sv", "ko", ...]). */
export const LOCALE_SEGMENTS: string[] = LOCALES.map((l) => l.routeSegment).filter(Boolean);

/** Find a locale by its key. */
export function findLocale(key: string): Locale | undefined {
  return LOCALES.find((l) => l.key === key);
}

/**
 * URL segment for a locale key. Empty string for the default locale (clean URLs)
 * or unknown keys.
 */
export function localeSegment(key: string): string {
  return findLocale(key)?.routeSegment ?? '';
}

/**
 * Prefix a clean path with a locale's route segment. The default locale (empty
 * segment) is returned unchanged so it keeps clean URLs.
 *   localizePath('/vb-demo/', 'fr') -> '/fr/vb-demo/'
 *   localizePath('/vb-demo/', 'en') -> '/vb-demo/'
 *   localizePath('/', 'sv')         -> '/sv/'
 */
export function localizePath(path: string, localeKey: string): string {
  const segment = localeSegment(localeKey);
  if (!segment) return path;
  const clean = path.startsWith('/') ? path : `/${path}`;
  return `/${segment}${clean === '/' ? '/' : clean}`;
}

/**
 * Split a pathname into its locale and the clean (locale-less) path. If the
 * first segment isn't a known non-default locale, the path belongs to the
 * default locale.
 *   stripLocale('/fr/vb-demo/') -> { localeKey: 'fr', cleanPath: '/vb-demo/' }
 *   stripLocale('/vb-demo/')    -> { localeKey: 'en', cleanPath: '/vb-demo/' }
 */
export function stripLocale(pathname: string): { localeKey: string; cleanPath: string } {
  const first = pathname.split('/')[1] ?? '';
  const match = LOCALES.find((l) => l.routeSegment && l.routeSegment === first);
  if (!match) return { localeKey: DEFAULT_LOCALE, cleanPath: pathname };
  const cleanPath = pathname.slice(`/${first}`.length) || '/';
  return { localeKey: match.key, cleanPath };
}
