'use client';

import { useState } from 'react';
import Link from 'next/link';

const LINKS = [
  { label: 'Home',            href: '/' },
  { label: 'Assemble',        href: '/assemble' },
  { label: 'Content Library', href: '/content-library' },
  { label: 'Admin',           href: '/admin' },
  { label: 'CMS',             href: '/cms-admin' },
];

export default function DevQuickLinks() {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-3 left-16 z-[9998] flex flex-col items-start">
      {open && (
        <div className="mb-2 flex flex-col gap-0.5 rounded-lg border border-gray-200 bg-white shadow-xl p-1.5 min-w-[148px]">
          {LINKS.map(({ label, href }) => (
            <Link
              key={href}
              href={href}
              onClick={() => setOpen(false)}
              className="block rounded-md px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors"
            >
              {label}
            </Link>
          ))}
        </div>
      )}
      <button
        onClick={() => setOpen((o) => !o)}
        title="Quick links"
        className="w-7 h-7 rounded-full overflow-hidden shadow-md hover:scale-110 transition-transform focus:outline-none focus-visible:ring-2 focus-visible:ring-green-400"
      >
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="https://media.ffycdn.net/eu/episerver/YKPBoHJ87Gba79trvfkP.png?width=28"
          alt="Optimizely quick links"
          width={28}
          height={28}
          className="w-full h-full object-cover"
        />
      </button>
    </div>
  );
}
