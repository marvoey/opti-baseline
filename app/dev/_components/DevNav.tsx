'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [{ label: 'Content Types', href: '/dev/content-types' }];

export default function DevNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-40 border-b border-dark-fir bg-blue-900">
      <div className="mx-auto flex h-12 w-full max-w-5xl items-center gap-6 px-6">
        <span className="text-xs font-semibold uppercase tracking-wider text-blue-300">
          Dev
        </span>
        <nav className="flex items-center gap-5 text-sm">
          {LINKS.map(({ label, href }) => {
            const active = pathname === href || pathname.startsWith(`${href}/`);
            return (
              <Link
                key={href}
                href={href}
                className={
                  active
                    ? 'font-medium text-lfgreen'
                    : 'text-blue-100 transition-colors hover:text-white'
                }
              >
                {label}
              </Link>
            );
          })}
        </nav>
      </div>
    </header>
  );
}
