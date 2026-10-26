'use client';

import { useEffect, useState } from 'react';

const OPEN_KEY = 'utility-tray-open';

// Fixed bottom tray that slides down out of view. The handle stays visible and
// rides along with the bar (the bar is h-12, hence translate-y-12 on the handle).
export default function UtilityTray({ children }: { children: React.ReactNode }) {
  const [open, setOpen] = useState(true);

  useEffect(() => {
    try {
      setOpen(localStorage.getItem(OPEN_KEY) !== '0');
    } catch {}
  }, []);

  const toggle = () => {
    setOpen((o) => {
      try {
        localStorage.setItem(OPEN_KEY, o ? '0' : '1');
      } catch {}
      return !o;
    });
  };

  return (
    <div className="pointer-events-none fixed inset-x-0 bottom-0 z-50">
      <button
        onClick={toggle}
        aria-expanded={open}
        aria-label={open ? 'Hide utility tray' : 'Show utility tray'}
        title={open ? 'Hide' : 'Show'}
        className={`pointer-events-auto absolute bottom-full right-4 rounded-t-md border border-b-0 border-gray-200 bg-white px-3 py-0.5 text-xs text-gray-600 shadow-sm transition-transform duration-300 ${open ? '' : 'translate-y-12'}`}
      >
        <span aria-hidden>{open ? '▾' : '▴'}</span>
      </button>
      <div
        className={`pointer-events-auto flex h-12 items-center justify-between gap-4 border-t border-gray-200 bg-white py-2 pr-4 pl-16 shadow-[0_-2px_8px_rgba(0,0,0,0.06)] transition-transform duration-300 ${open ? '' : 'translate-y-full'}`}
        inert={!open}
      >
        {children}
      </div>
    </div>
  );
}
