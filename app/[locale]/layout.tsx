import SiteChrome from '../_components/SiteChrome';

/**
 * Shell for CMS-delivered pages (the `[[...slug]]` catch-all experience route).
 * Wraps the page body with the shared static site chrome (header + footer) so
 * published experiences match the static mock without modeling the chrome as
 * CMS content. The same SiteChrome is used by /preview so the editor matches.
 */
export default function LocaleLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
