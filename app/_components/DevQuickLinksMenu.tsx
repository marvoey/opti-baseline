'use client';

import { Fragment, useState } from 'react';
import Link from 'next/link';

export type QuickLink = {
  label: string;
  href: string;
  group?: string;
  /** A file served from public/ (e.g. an .html page): plain link, opens in a new tab. */
  isStatic?: boolean;
};

const ITEM_CLASS =
  'block rounded-md px-3 py-1.5 text-xs font-medium text-gray-700 hover:bg-gray-100 transition-colors';

export default function DevQuickLinksMenu({ links }: { links: QuickLink[] }) {
  const [open, setOpen] = useState(false);
  // Only label the sections when there is more than one to tell apart.
  const showGroups = new Set(links.map((l) => l.group)).size > 1;

  return (
    <div className="fixed bottom-3 left-16 z-[9998] flex flex-col items-start">
      {open && (
        <div className="mb-2 flex max-h-[70vh] flex-col gap-0.5 overflow-y-auto rounded-lg border border-gray-200 bg-white shadow-xl p-1.5 min-w-[148px]">
          {links.map(({ label, href, group, isStatic }, i) => (
            <Fragment key={href}>
              {showGroups && group && group !== links[i - 1]?.group && (
                <div className="px-3 pt-1.5 pb-0.5 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                  {group}
                </div>
              )}
              {isStatic ? (
                <a
                  href={href}
                  target="_blank"
                  rel="noopener noreferrer"
                  onClick={() => setOpen(false)}
                  className={ITEM_CLASS}
                >
                  {label}
                </a>
              ) : (
                <Link href={href} onClick={() => setOpen(false)} className={ITEM_CLASS}>
                  {label}
                </Link>
              )}
            </Fragment>
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
