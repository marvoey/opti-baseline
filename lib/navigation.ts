/**
 * Main navigation data model + safety helpers.
 *
 * Types mirror the spec in dev-notes/main-nav-spec.md (§2–3). MainNav is
 * presentational only: the config is fetched and mapped by lib/chrome.ts (from
 * the CMS CibcSiteSettings singleton, falling back to lib/siteConfig defaults)
 * before it reaches the component. The helpers below enforce the spec's
 * client-side security rules (§5.3, §8) and visibility evaluation (§6.5).
 */

export type ColumnLayout = 'single' | 'cols2' | 'cols3' | 'mega';

export type VisibilityCondition = 'authenticated' | 'role';

export interface VisibilityRule {
  condition: VisibilityCondition;
  roles?: string[];
}

export interface FeaturedNavCard {
  id: string;
  tag?: string | null;
  heading: string;
  description?: string | null;
  imageUrl?: string | null;
  imageAlt?: string;
  url: string;
  ctaLabel: string;
}

export interface NavItem {
  id: string;
  label: string;
  url: string | null;
  openInNewTab?: boolean;
  /** Icon slug from the project's icon library (see app/_components/nav/icons). */
  icon?: string | null;
  description?: string | null;
  columnLayout?: ColumnLayout;
  featuredItem?: FeaturedNavCard | null;
  visibilityRules?: VisibilityRule[] | null;
  children: NavItem[];
}

export interface NavigationConfig {
  id: string;
  label: string;
  locale: string;
  items: NavItem[];
}

/** Authenticated user shape used to evaluate VisibilityRules (spec §5.1). */
export interface NavUser {
  isAuthenticated: boolean;
  roles?: string[];
}

const ALLOWED_PROTOCOLS = ['https:', 'http:'];

/**
 * Guard every CMS-supplied `url` before using it as an `href` (spec §5.3, §8.1).
 * Blocks `javascript:` / `data:` injection from a compromised CMS record while
 * allowing http(s) and root-relative paths. Protocol-relative `//host` URLs are
 * rejected. SSR-safe: falls back to a dummy origin when `window` is absent.
 */
export function isSafeUrl(raw: string | null | undefined): raw is string {
  if (!raw) return false;
  // Root-relative paths are safe; reject protocol-relative `//evil.com`.
  if (raw.startsWith('/')) return !raw.startsWith('//');
  const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
  try {
    const url = new URL(raw, base);
    return ALLOWED_PROTOCOLS.includes(url.protocol);
  } catch {
    return false;
  }
}

/**
 * Allowlist image hosts via NEXT_PUBLIC_ALLOWED_IMAGE_DOMAINS (comma-separated)
 * before rendering a FeaturedNavCard image (spec §8.2). Same-origin / relative
 * images are always allowed; external hosts must be explicitly allowlisted, so
 * an unset env var means no external images render (safe default).
 */
export function isAllowedImageUrl(raw: string | null | undefined): raw is string {
  if (!isSafeUrl(raw)) return false;
  if (raw.startsWith('/')) return true; // same-origin
  const allow = (process.env.NEXT_PUBLIC_ALLOWED_IMAGE_DOMAINS ?? '')
    .split(',')
    .map((d) => d.trim().toLowerCase())
    .filter(Boolean);
  if (allow.length === 0) return false;
  try {
    const base = typeof window !== 'undefined' ? window.location.origin : 'http://localhost';
    const host = new URL(raw, base).hostname.toLowerCase();
    return allow.some((d) => host === d || host.endsWith(`.${d}`));
  } catch {
    return false;
  }
}

/**
 * Evaluate a NavItem's VisibilityRules against the current user (spec §6.5).
 * Items with no rules are always visible. Rules are ANDed together. Visibility
 * is render-only — never a substitute for server-side access control (§8.4).
 */
export function isItemVisible(item: NavItem, currentUser?: NavUser | null): boolean {
  if (!item.visibilityRules || item.visibilityRules.length === 0) return true;

  return item.visibilityRules.every((rule) => {
    if (rule.condition === 'authenticated') {
      return currentUser?.isAuthenticated === true;
    }
    if (rule.condition === 'role') {
      return rule.roles?.some((r) => currentUser?.roles?.includes(r)) ?? false;
    }
    return true;
  });
}
