'use client';

import { useRef, useState } from 'react';
import Link from 'next/link';

export type QuickLink = { label: string; href: string; facilitatorOnly?: boolean };

export default function DevQuickLinksMenu({ links }: { links: QuickLink[] }) {
  const [open, setOpen] = useState(false);
  const [facilitator, setFacilitator] = useState(false);
  const needsFacilitator = links.some((l) => l.facilitatorOnly);

  const asked = useRef(false);

  // Ask once, the first time the menu is opened, whether this visitor is a facilitator. Done in the
  // browser (not on the server) so the root layout stays static: reading the cookie there would
  // make every CMS page dynamic.
  const toggle = () => {
    setOpen((o) => !o);
    if (asked.current || !needsFacilitator) return;
    asked.current = true;
    fetch('/setup-guide/api/me', { cache: 'no-store' })
      .then((r) => (r.ok ? r.json() : { facilitator: false }))
      .then((d: { facilitator?: boolean }) => setFacilitator(d.facilitator === true))
      .catch(() => setFacilitator(false));
  };

  const visible = links.filter((l) => !l.facilitatorOnly || facilitator);

  return (
    <div className="fixed bottom-3 left-16 z-[9998] flex flex-col items-start">
      {open && (
        <div className="mb-2 flex flex-col gap-0.5 rounded-lg border border-gray-200 bg-white shadow-xl p-1.5 min-w-[148px]">
          {visible.map(({ label, href }) => (
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
        onClick={toggle}
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
