/**
 * Layout for the CMS preview route. It adds no chrome itself: the page wraps its
 * content in <SiteChrome>, because only the page knows what it is previewing
 * (portal content needs the Independent Agent Portal header, everything else the
 * LM.com one). /preview lives outside [locale] and is excluded from proxy.ts.
 */
export default function PreviewLayout({ children }: { children: React.ReactNode }) {
  return <>{children}</>;
}
