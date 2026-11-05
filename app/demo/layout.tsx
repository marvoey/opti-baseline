import SiteChrome from '../_components/SiteChrome';

/**
 * Chrome for static demo pages under /demo. These live outside [locale] (and
 * are excluded from proxy.ts), so — like /preview — they wrap themselves in the
 * shared site chrome.
 */
export default function DemoLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
