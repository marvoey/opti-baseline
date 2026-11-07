import Anchor from './Anchor';
import { cx, LINK_CLASS } from './utils';

export type Crumb = string | { label: string; href?: string };

export type BreadcrumbProps = {
  /** First crumb, always a link. */
  rootLabel?: string;
  rootHref?: string;
  /** Crumbs after the root. The last one is the current page and is not a link. */
  items?: Crumb[];
  /** Accessible name for the navigation landmark. */
  ariaLabel?: string;
  /** Spacing classes. Replaces the default `pt-4`. */
  className?: string;
};

const DEFAULT_ITEMS: Crumb[] = ['Car insurance', 'Rental cars'];

/** C02 — "Answers › Section › Topic" trail under the ask bar. */
export default function Breadcrumb({
  rootLabel = 'Answers',
  rootHref = '#',
  items = DEFAULT_ITEMS,
  ariaLabel = 'Breadcrumb',
  className = 'pt-4',
}: BreadcrumbProps) {
  return (
    <nav aria-label={ariaLabel} className={cx('text-xs text-gray-500', className)}>
      <Anchor className={LINK_CLASS} href={rootHref}>
        {rootLabel}
      </Anchor>
      {items.map((item, i) => {
        const { label, href } = typeof item === 'string' ? { label: item, href: undefined } : item;
        const isLast = i === items.length - 1;
        return (
          <span key={`${label}-${i}`}>
            {' '}
            &rsaquo;{' '}
            {isLast ? (
              <span aria-current="page">{label}</span>
            ) : (
              <Anchor className={LINK_CLASS} href={href}>
                {label}
              </Anchor>
            )}
          </span>
        );
      })}
    </nav>
  );
}
