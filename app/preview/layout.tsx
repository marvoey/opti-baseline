import SiteChrome from '../_components/SiteChrome';

/**
 * Chrome for the CMS preview route. Mirrors app/[locale]/layout: the published
 * catch-all gets SiteChrome from the locale layout, but /preview lives outside
 * [locale] (it's driven by preview searchParams, not a locale path segment, and
 * is excluded from proxy.ts), so it wraps its own children here so the editor
 * preview matches the published page.
 */
export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
