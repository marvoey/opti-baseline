import Link from 'next/link';
import type { ComponentProps } from 'react';
import { safeHref } from './utils';

type AnchorProps = Omit<ComponentProps<'a'>, 'href'> & { href?: string };

/**
 * Link used by every Liberty component. The href is sanitised (see `safeHref`),
 * same-site paths use next/link for client navigation, everything else is a
 * plain anchor. Defaults to `#` like the mockup.
 */
export default function Anchor({ href, children, ...rest }: AnchorProps) {
  const safe = safeHref(href);
  if (safe.startsWith('/')) {
    return (
      <Link href={safe} {...rest}>
        {children}
      </Link>
    );
  }
  return (
    <a href={safe} {...rest}>
      {children}
    </a>
  );
}
