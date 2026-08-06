'use client';

import { useState } from 'react';
import Link from 'next/link';

const LINKS = [
  { href: '/',                label: 'Home'    },
  { href: '/assemble',        label: 'Assemble'},
  { href: '/content-library', label: 'Library' },
  { href: '/cms-admin',       label: 'CMS'     },
];

export function QuickLinks() {
  const [open, setOpen] = useState(true);

  return (
    <nav className="fixed bottom-4 right-4 z-50 flex flex-col items-end gap-1">
      {open && (
        <div className="flex flex-col gap-1 rounded-xl border border-slate-200 bg-white/90 px-2 py-2 shadow-lg backdrop-blur-sm dark:border-slate-700 dark:bg-slate-800/90">
          {LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className="rounded-lg px-3 py-1.5 text-xs font-semibold text-slate-600 hover:bg-slate-100 hover:text-slate-900 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen(o => !o)}
        aria-label={open ? 'Hide quick links' : 'Show quick links'}
        className="rounded-lg border border-slate-200 bg-white/90 px-3 py-1.5 text-xs font-semibold text-slate-500 shadow-lg backdrop-blur-sm hover:bg-slate-100 hover:text-slate-900 dark:border-slate-700 dark:bg-slate-800/90 dark:text-slate-400 dark:hover:bg-slate-700 dark:hover:text-slate-100"
      >
        {open ? '× Links' : '≡ Links'}
      </button>
    </nav>
  );
}
