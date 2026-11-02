'use client';

import { useState } from 'react';
import Link from 'next/link';

export type LinkGroup = {
  title: string;
  links: { label: string; href: string }[];
  // Static files in public/ aren't Next routes, so they use a plain anchor.
  external: boolean;
};

const itemClass =
  'block rounded-md px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors';

export default function PageLinksWidgetMenu({ groups }: { groups: LinkGroup[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-3 right-3 z-[9998] flex flex-col items-end">
      {open && (
        <div className="mb-2 flex min-w-[180px] flex-col gap-1 rounded-lg border border-gray-200 bg-white p-1.5 shadow-xl">
          {groups.map(({ title, links, external }) => (
            <div key={title} className="flex flex-col gap-0.5">
              <div className="px-3 pt-1 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                {title}
              </div>
              {links.map(({ label, href }) =>
                external ? (
                  <a key={href} href={href} target="_blank" rel="noreferrer" className={itemClass}>
                    {label}
                  </a>
                ) : (
                  <Link key={href} href={href} onClick={() => setOpen(false)} className={itemClass}>
                    {label}
                  </Link>
                ),
              )}
            </div>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-expanded={open}
        title="Pages"
        className="rounded-full bg-gray-900 px-3 py-1.5 text-xs font-semibold text-white shadow-md transition-transform hover:scale-105 focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
      >
        {open ? '× Pages' : '≡ Pages'}
      </button>
    </div>
  );
}
