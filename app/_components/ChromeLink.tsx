import Link from 'next/link';

type ChromeLinkProps = Omit<React.ComponentPropsWithoutRef<'a'>, 'href'> & { href: string };

const EXTERNAL = /^https?:\/\//i;
// Any other URL scheme (javascript:, data:, vbscript:, …) is refused. Only
// http(s), mailto:, tel: and scheme-less (in-app) hrefs are allowed.
const DISALLOWED_SCHEME = /^(?!https?:|mailto:|tel:)[a-z][a-z0-9+.-]*:/i;

/**
 * Link used by the site chrome. Absolute http(s) URLs open in a new tab with
 * `noopener noreferrer`; everything else is an in-app `next/link`. Usable from
 * both server and client components.
 */
export default function ChromeLink({ href, children, ...rest }: ChromeLinkProps) {
  const safeHref = DISALLOWED_SCHEME.test(href.trim()) ? '#' : href;
  if (EXTERNAL.test(safeHref)) {
    // target/rel come last so callers can't weaken them via ...rest.
    return (
      <a {...rest} href={safeHref} target="_blank" rel="noopener noreferrer">
        {children}
      </a>
    );
  }
  return (
    <Link {...rest} href={safeHref}>
      {children}
    </Link>
  );
}
