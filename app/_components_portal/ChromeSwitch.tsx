'use client';

import type { ReactNode } from 'react';
import { usePathname } from 'next/navigation';
import { chromeFor } from '@/lib/agent/portalConfig';

type Chrome = { header: ReactNode; footer: ReactNode };

/**
 * Picks the header and footer for the URL: the simple header in three forms on the
 * portal pages (sign-in, agent dashboards and product page, priorities page), the
 * full portal header on any other /agent/* page, and the LM.com ones everywhere
 * else (see `chromeFor`). Both versions are rendered on the server and this picks one in the
 * browser from the URL, because a layout is not re-rendered when a visitor
 * moves between pages that share it: a server-side check would leave the wrong
 * header showing after a link from LM.com into the portal (or back).
 *
 * The pattern also matches a locale prefix (/en/agent) in case the pathname is
 * seen after the proxy rewrite. /preview (the CMS editor) is never a portal path.
 */
export default function ChromeSwitch({
  site,
  portal,
  signin,
  agent,
  plain,
  force,
  children,
}: {
  site: Chrome;
  portal: Chrome;
  signin: Chrome;
  agent: Chrome;
  plain: Chrome;
  /** Skip the URL check (the CMS preview route, whose URL says nothing about the page). */
  force?: 'portal' | 'signin' | 'agent' | 'plain';
  children: ReactNode;
}) {
  const pathname = usePathname() || '/';
  const variant = force ?? chromeFor(pathname);
  const chrome = { signin, agent, plain, portal, site }[variant];
  return (
    <>
      {chrome.header}
      <div className="flex-1">{children}</div>
      {chrome.footer}
    </>
  );
}
