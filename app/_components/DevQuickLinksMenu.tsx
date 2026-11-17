'use client';

import { useState } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';

export type QuickLink = { label: string; href: string; depth: number };
export type QuickLinkGroup = { title: string; links: QuickLink[] };

export default function DevQuickLinksMenu({ groups }: { groups: QuickLinkGroup[] }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();

  return (
    <div className="fixed bottom-3 left-16 z-[9998] flex flex-col items-start">
      {open && (
        <nav
          aria-label="Quick links"
          className="mb-2 max-h-[70vh] min-w-[168px] overflow-y-auto rounded-lg border border-gray-200 bg-white p-1.5 shadow-xl"
        >
          {groups.map(({ title, links }, i) => (
            <section key={title} className={i > 0 ? 'mt-1.5 border-t border-gray-100 pt-1.5' : ''}>
              <h2 className="px-3 pb-0.5 pt-1 text-[10px] font-semibold uppercase tracking-wider text-gray-400">
                {title}
              </h2>
              {links.map(({ label, href, depth }) => {
                const active = pathname === href;
                return (
                  <Link
                    key={href}
                    href={href}
                    onClick={() => setOpen(false)}
                    aria-current={active ? 'page' : undefined}
                    style={{ paddingLeft: `${0.75 + depth * 0.875}rem` }}
                    className={`block rounded-md py-1.5 pr-3 text-xs font-medium transition-colors ${
                      active ? 'bg-green-50 text-green-800' : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    {depth > 0 && <span className="mr-1 text-gray-300">└</span>}
                    {label}
                  </Link>
                );
              })}
            </section>
          ))}
        </nav>
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
