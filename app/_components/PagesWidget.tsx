'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { usePathname } from 'next/navigation';

type StaticPage = { path: string; title: string };
type Status = 'idle' | 'loading' | 'ready' | 'error';

const HOME: StaticPage = { path: '/', title: 'Home' };

// "Pages" button that lists the standalone HTML pages in /public (via
// /api/public-pages). The list is fetched the first time it opens.
export default function PagesWidget() {
  const [open, setOpen] = useState(false);
  const [status, setStatus] = useState<Status>('idle');
  const [pages, setPages] = useState<StaticPage[]>([]);
  const rootRef = useRef<HTMLDivElement>(null);
  const pathname = usePathname();
  const panelId = useId();

  const loadPages = () => {
    setStatus('loading');
    fetch('/api/public-pages')
      .then((res) => {
        if (!res.ok) throw new Error(String(res.status));
        return res.json() as Promise<{ pages: StaticPage[] }>;
      })
      .then((data) => {
        setPages(data.pages);
        setStatus('ready');
      })
      .catch(() => setStatus('error'));
  };

  const toggle = () => {
    // A failed fetch is retried on the next open.
    if (!open && (status === 'idle' || status === 'error')) loadPages();
    setOpen(!open);
  };

  useEffect(() => {
    if (!open) return;
    const onKeyDown = (e: KeyboardEvent) => e.key === 'Escape' && setOpen(false);
    const onPointerDown = (e: PointerEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('pointerdown', onPointerDown);
    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('pointerdown', onPointerDown);
    };
  }, [open]);

  return (
    <div ref={rootRef} className="relative">
      {open && (
        <div
          id={panelId}
          className="absolute bottom-full left-0 z-[9998] mb-2 max-h-[60vh] w-80 max-w-[calc(100vw-2rem)] overflow-auto rounded-2xl border-[1.5px] border-blue-700 bg-white p-2 shadow-xl"
        >
          {status === 'error' && <p className="px-3 py-2 text-sm text-blue-700">Could not load pages.</p>}
          {status === 'loading' && <p className="px-3 py-2 text-sm text-blue-700">Loading…</p>}
          <ul>
            {[HOME, ...pages].map((page) => (
              <li key={page.path}>
                {/* Plain anchor: these are static files, not App Router routes. */}
                <a
                  href={page.path}
                  aria-current={page.path === pathname ? 'page' : undefined}
                  className="block rounded-xl px-3 py-2.5 text-sm font-medium leading-tight text-blue-700 hover:bg-blue-50 aria-[current=page]:bg-blue-300 aria-[current=page]:font-bold"
                >
                  {page.title}
                  <span className="mt-0.5 block font-mono text-[11px] font-normal opacity-60">{page.path}</span>
                </a>
              </li>
            ))}
          </ul>
        </div>
      )}
      <button
        type="button"
        aria-expanded={open}
        aria-controls={open ? panelId : undefined}
        onClick={toggle}
        className="flex items-center gap-2 rounded-full border-[1.5px] border-blue-700 bg-blue-50 px-3 py-1 text-xs font-bold text-blue-700 transition-colors hover:bg-blue-300"
      >
        <span aria-hidden>☰</span> Pages
      </button>
    </div>
  );
}
