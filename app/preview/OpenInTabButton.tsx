'use client';

import { useState } from 'react';
import { ExternalLink } from 'lucide-react';

/**
 * Floating tab anchored to the right viewport edge. Collapsed by default so it
 * doesn't obscure content — only a small icon handle is visible. Clicking the
 * handle slides the full panel into view; clicking again collapses it.
 */
export function OpenInTabButton() {
  const [open, setOpen] = useState(false);

  return (
    <div
      className={[
        'fixed top-24 right-0 z-50 flex items-stretch',
        'transition-transform duration-300 ease-in-out',
        open ? 'translate-x-0' : 'translate-x-[calc(100%-0.75rem)]',
      ].join(' ')}
    >
      {/* Handle — the only part visible when collapsed */}
      <button
        onClick={() => setOpen((o) => !o)}
        aria-label={open ? 'Collapse' : 'Open preview in new tab'}
        className="w-3 rounded-l bg-neutral-800/40 transition-colors hover:bg-neutral-800/70"
      />

      {/* Sliding content */}
      <button
        onClick={() => window.open(window.location.href, '_blank', 'noopener,noreferrer')}
        className="flex items-center gap-2 whitespace-nowrap bg-neutral-800/60 px-4 py-2.5 text-sm font-medium text-white backdrop-blur-sm transition-colors hover:bg-neutral-800/80"
      >
        <ExternalLink size={14} />
        Open in new tab
      </button>
    </div>
  );
}
