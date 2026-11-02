'use client';

import { useState } from 'react';
import Link from 'next/link';

// `external` links point at static files (e.g. public/*.html) and bypass the Next router.
export type QuickLink = { label: string; href: string; external?: boolean };
export type LinkGroup = { title: string; links: QuickLink[] };

const LINK_CLASS =
  'block rounded-md px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors';

export default function DevQuickLinksMenu({ groups }: { groups: LinkGroup[] }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="fixed bottom-3 left-16 z-[9998] flex flex-col items-start">
      {open && (
        <div className="mb-2 flex max-h-[70vh] flex-col gap-0.5 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl p-1.5 min-w-[148px]">
          {groups.map(({ title, links }) => (
            <div key={title} className="flex flex-col gap-0.5">
              {groups.length > 1 && (
                <div className="px-3 pt-1.5 pb-0.5 text-[10px] font-semibold uppercase tracking-wide text-gray-400">
                  {title}
                </div>
              )}
              {links.map(({ label, href, external }) =>
                external ? (
                  <a key={href} href={href} onClick={() => setOpen(false)} className={LINK_CLASS}>
                    {label}
                  </a>
                ) : (
                  <Link key={href} href={href} onClick={() => setOpen(false)} className={LINK_CLASS}>
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
