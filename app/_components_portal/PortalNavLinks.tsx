'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { activeNavLabel, type PortalLink } from '@/lib/agent/portalConfig';

/**
 * The portal's header menu. The active item gets the yellow underline (the
 * mockup's `border-b-[3px] border-lmy`): "Sales & marketing" on product pages,
 * "Home" everywhere else. A client component only because it reads the URL.
 */
export default function PortalNavLinks({ links }: { links: PortalLink[] }) {
  const active = activeNavLabel(usePathname() || '/');
  return (
    <>
      {links.map((l) => {
        const on = l.label === active;
        return (
          <Link
            key={l.label}
            href={l.href}
            aria-current={on ? 'page' : undefined}
            className={on ? 'border-b-[3px] border-lmy pb-1 font-medium' : undefined}
          >
            {l.label}
          </Link>
        );
      })}
    </>
  );
}
