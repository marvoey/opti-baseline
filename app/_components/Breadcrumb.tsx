'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

type Crumb = { label: string; href?: string };

function formatLabel(segment: string) {
  return segment.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
}

function crumbsFromPath(pathname: string): Crumb[] {
  const segments = pathname.split('/').filter(Boolean);
  const isLocale = segments[0]?.length === 2;
  const pathSegments = isLocale ? segments.slice(1) : segments;

  const crumbs: Crumb[] = [{ label: 'Home', href: '/' }];
  pathSegments.forEach((seg, i) => {
    const isLast = i === pathSegments.length - 1;
    crumbs.push({
      label: formatLabel(seg),
      href: isLast ? undefined : '/' + pathSegments.slice(0, i + 1).join('/'),
    });
  });
  return crumbs;
}

export default function Breadcrumb({ crumbs }: { crumbs?: Crumb[] }) {
  const pathname = usePathname();
  const resolved = crumbs ?? crumbsFromPath(pathname);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6">
      <nav className="flex items-center gap-1.5 text-sm text-ls-gray mb-8 flex-wrap">
        {resolved.map((c, i) => (
          <span key={i} className="flex items-center gap-1.5">
            {i > 0 && <span>/</span>}
            {c.href ? (
              <Link href={c.href} className="hover:text-blue-700 transition-colors">{c.label}</Link>
            ) : (
              <span className="text-ls-charcoal font-medium">{c.label}</span>
            )}
          </span>
        ))}
      </nav>
    </div>
  );
}
