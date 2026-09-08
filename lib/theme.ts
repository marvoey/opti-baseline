import { cache } from 'react';
import { headers } from 'next/headers';
import { isThemeId, resolveThemeFromHost, type ThemeId } from './themes';

/** Request header proxy.ts forwards a `?theme=` query param on (see proxy.ts). */
export const THEME_HEADER = 'x-theme-override';

/**
 * Resolves which theme the current request should render. Checked in order:
 *   1. `?theme=` in the URL — proxy.ts forwards it as the x-theme-override
 *      header, so this works with no .env edit or dev-server restart.
 *   2. The request's `host` header, matched against OPTIMIZELY_THEME_*_HOST.
 *   3. Falls back to DEFAULT_THEME (from .env, itself defaulting to `optimizely`).
 *
 * Wrapped in React's `cache()` so TopNav/MainNav/Footer/RootLayout can each
 * call this independently without re-reading headers per call.
 */
export const resolveTheme = cache(async (): Promise<ThemeId> => {
  const h = await headers();

  const override = h.get(THEME_HEADER);
  if (isThemeId(override)) return override;

  return resolveThemeFromHost(h.get('host'));
});
