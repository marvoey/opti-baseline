'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { House } from 'lucide-react';

const NAV_LINKS = [
  { href: '/admin', label: 'Content Types', exact: true },
  { href: '/admin/display-templates', label: 'Display Templates', exact: false },
];

export default function AdminNav() {
  const pathname = usePathname();

  function isActive(href: string, exact: boolean) {
    return exact ? pathname === href : pathname.startsWith(href);
  }

  return (
    <nav className="border-b border-slate-200 bg-white">
      <div className="mx-auto flex w-full max-w-5xl items-center gap-1 px-6 py-2">
        <span className="mr-4 text-xs font-semibold uppercase tracking-wider text-slate-400">
          Admin
        </span>
        <Link
          href="/"
          className="mr-3 flex items-center gap-1.5 text-sm text-slate-500 transition-colors hover:text-slate-900"
        >
          <House size={14} />
          Home
        </Link>
        <span className="mr-3 text-slate-200">|</span>
        {NAV_LINKS.map(({ href, label, exact }) => (
          <Link
            key={href}
            href={href}
            className={`rounded-md px-3 py-1.5 text-sm font-medium transition-colors ${
              isActive(href, exact)
                ? 'bg-slate-900 text-white'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            {label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
