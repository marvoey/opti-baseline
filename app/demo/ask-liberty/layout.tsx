import SiteChrome from '@/app/_components/SiteChrome';

/**
 * Wraps the Ask Liberty demo pages in the same site chrome (header + footer) as
 * the CMS routes. /demo sits outside [locale], so it doesn't inherit it from
 * app/[locale]/layout and applies SiteChrome itself, like app/preview/layout.
 */
export default function AskLibertyLayout({ children }: { children: React.ReactNode }) {
  return <SiteChrome>{children}</SiteChrome>;
}
