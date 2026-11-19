'use client';

import { useState } from 'react';
import Link from 'next/link';

/** `document`: a route handler, opened with a plain link instead of client-side navigation. */
export type QuickLink = { label: string; href: string; document?: boolean };

export default function DevQuickLinksMenu({ links }: { links: QuickLink[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-3 left-16 z-[9998] flex flex-col items-start">
      {open && (
        <div className="mb-2 flex flex-col gap-0.5 rounded-lg border border-gray-200 bg-white shadow-xl p-1.5 min-w-[148px]">
          {links.map(({ label, href, document }) => {
            const className =
              'block rounded-md px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors';
            return document ? (
              <a key={href} href={href} className={className}>
                {label}
              </a>
            ) : (
              <Link key={href} href={href} onClick={() => setOpen(false)} className={className}>
                {label}
              </Link>
            );
          })}
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
