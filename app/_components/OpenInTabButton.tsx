'use client';

import { useEffect, useRef, useState } from 'react';
import { ExternalLink, Eye, LayoutGrid } from 'lucide-react';

/**
 * A small floating action button styled after the Next.js devtools indicator
 * (bottom-left, dark pill), so it sits naturally beside it. Clicking it opens a
 * menu with two shortcuts — both open in a new tab:
 *   • Preview    → the current preview URL (pops the CMS iframe out to its own tab)
 *   • Styleguide → the /styleguide block reference
 */
export function OpenInTabButton() {
  const [open, setOpen] = useState(false);
  // The preview href is only known client-side (it's the current location).
  // Resolved when the menu opens rather than in an effect — it's stable for the
  // page's lifetime, so reading it on toggle is enough.
  const [previewHref, setPreviewHref] = useState('#');
  const ref = useRef<HTMLDivElement>(null);

  const toggle = () => {
    setPreviewHref(window.location.href);
    setOpen((o) => !o);
  };

  // Dismiss on outside click or Escape.
  useEffect(() => {
    if (!open) return;
    const onClick = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onClick);
    document.addEventListener('keydown', onKey);
    return () => {
      document.removeEventListener('mousedown', onClick);
      document.removeEventListener('keydown', onKey);
    };
  }, [open]);

  const itemClass =
    'flex items-center gap-2 whitespace-nowrap px-3 py-2 text-left transition-colors hover:bg-white/10';

  return (
    <div ref={ref} className="fixed bottom-4 left-16 z-[9999] flex flex-col items-start">
      {/* Menu — rendered above the button since it's anchored to the bottom. */}
      {open ? (
        <div
          role="menu"
          className="mb-2 flex flex-col overflow-hidden rounded-lg border border-white/10 bg-neutral-900/95 text-sm font-medium text-white shadow-xl backdrop-blur"
        >
          <a
            href={previewHref}
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            className={itemClass}
            onClick={() => setOpen(false)}
          >
            <Eye size={14} /> Open preview
          </a>
          <a
            href="/styleguide"
            target="_blank"
            rel="noopener noreferrer"
            role="menuitem"
            className={`${itemClass} border-t border-white/10`}
            onClick={() => setOpen(false)}
          >
            <LayoutGrid size={14} /> Open styleguide
          </a>
        </div>
      ) : null}

      {/* The devtools-indicator-style pill. */}
      <button
        type="button"
        onClick={toggle}
        aria-haspopup="menu"
        aria-expanded={open}
        aria-label="Open preview or styleguide in a new tab"
        className="flex h-10 items-center gap-1.5 rounded-full border border-white/10 bg-black px-3.5 text-white shadow-lg transition-colors hover:bg-neutral-800"
      >
        <ExternalLink size={15} />
      </button>
    </div>
  );
}
