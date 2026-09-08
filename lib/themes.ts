import { siteConfig } from './siteConfig';

export type ThemeId = 'optimizely' | 'peacock' | 'nowtv';

export type ThemeMeta = {
  id: ThemeId;
  name: string;
  title: string;
  description: string;
};

/**
 * Metadata (name/title/description) per theme, used by generateMetadata in
 * app/layout.tsx and the CMS catch-all page's title fallback. Chrome (header/
 * footer) is NOT here — Optimizely's stays in lib/siteConfig.ts unchanged;
 * Peacock/NOW's lives in lib/brandThemes.ts, rendered by SiteChrome.
 */
export const themeMeta: Record<ThemeId, ThemeMeta> = {
  optimizely: {
    id: 'optimizely',
    name: siteConfig.name,
    title: siteConfig.title,
    description: siteConfig.description,
  },
  peacock: {
    id: 'peacock',
    name: 'Peacock',
    title: 'Peacock Help Centre',
    description: 'Help and support for your Peacock account, billing, and streaming.',
  },
  nowtv: {
    id: 'nowtv',
    name: 'NOW',
    title: 'NOW Help Centre',
    description: 'Help and support for your NOW account, billing, and streaming.',
  },
};

export const THEME_IDS = Object.keys(themeMeta) as ThemeId[];

export function isThemeId(value: string | undefined | null): value is ThemeId {
  return !!value && value in themeMeta;
}

/** Host → theme id, sourced from .env so real domains never need to be hardcoded. */
function buildHostThemeMap(): Record<string, ThemeId> {
  const map: Record<string, ThemeId> = {};
  const peacockHost = process.env.OPTIMIZELY_THEME_PEACOCK_HOST?.trim();
  const nowtvHost = process.env.OPTIMIZELY_THEME_NOWTV_HOST?.trim();
  if (peacockHost) map[peacockHost.toLowerCase()] = 'peacock';
  if (nowtvHost) map[nowtvHost.toLowerCase()] = 'nowtv';
  return map;
}

const HOST_THEME_MAP = buildHostThemeMap();

/**
 * Theme served when the request's host doesn't match any OPTIMIZELY_THEME_*_HOST,
 * sourced from DEFAULT_THEME in .env (falls back to `optimizely` if unset/invalid).
 */
function resolveDefaultTheme(): ThemeId {
  const envDefault = process.env.DEFAULT_THEME?.trim();
  if (!envDefault) return 'optimizely';
  if (isThemeId(envDefault)) return envDefault;
  console.warn(
    `[lib/themes] DEFAULT_THEME="${envDefault}" is not a valid theme id (${THEME_IDS.join(', ')}). Falling back to "optimizely".`,
  );
  return 'optimizely';
}

export const DEFAULT_THEME: ThemeId = resolveDefaultTheme();

/** Resolves a theme id from a request's `host` header, defaulting to DEFAULT_THEME. */
export function resolveThemeFromHost(host: string | null | undefined): ThemeId {
  if (!host) return DEFAULT_THEME;
  const bareHost = host.toLowerCase().split(':')[0];
  return HOST_THEME_MAP[bareHost] ?? DEFAULT_THEME;
}
