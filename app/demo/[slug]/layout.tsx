import SiteChrome from '../../_components/SiteChrome';

/**
 * Chrome for the governance-drift live-resolution route. Mirrors
 * app/[locale]/layout.tsx and app/preview/layout.tsx: this route lives outside
 * [locale] (it's driven by Persona/Industry/Tier searchParams, not a locale
 * path segment), so it wraps its own children here to match the published
 * site's header + footer. Scoped to this one route (not app/demo/layout.tsx)
 * so the existing /demo mock page keeps its own full-bleed, chrome-free look.
 */
export default function GovernanceDriftLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
