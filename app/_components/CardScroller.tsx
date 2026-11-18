'use client';

import { useRef, type ReactNode } from 'react';

/**
 * Horizontal scroll-snap strip with previous / next arrows. Used by the
 * eHealth testimonials carousel. Cards are rendered on the server and passed
 * in as children, so this only owns the scrolling behaviour.
 */
export default function CardScroller({ children, label }: { children: ReactNode; label: string }) {
  const ref = useRef<HTMLDivElement>(null);

  function scrollByCard(dir: 1 | -1) {
    const el = ref.current;
    if (!el) return;
    const card = el.firstElementChild as HTMLElement | null;
    const step = (card?.offsetWidth ?? 320) + 24;
    el.scrollBy({ left: dir * step, behavior: 'smooth' });
  }

  return (
    <div>
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-6 overflow-x-auto scroll-smooth pb-4 [scrollbar-width:none] focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400 [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
      <div className="mt-2 flex justify-center gap-4">
        <ArrowButton dir={-1} onClick={() => scrollByCard(-1)} />
        <ArrowButton dir={1} onClick={() => scrollByCard(1)} />
      </div>
    </div>
  );
}

function ArrowButton({ dir, onClick }: { dir: 1 | -1; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={dir === 1 ? 'Next' : 'Previous'}
      className="flex h-10 w-10 items-center justify-center rounded-full border border-blue-800 bg-white text-blue-800 transition hover:bg-blue-800 hover:text-white focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-400"
    >
      <svg viewBox="0 0 16 16" className="h-4 w-4" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
        <path d={dir === 1 ? 'M6 3l5 5-5 5' : 'M10 3L5 8l5 5'} strokeLinecap="round" strokeLinejoin="round" />
      </svg>
    </button>
  );
}
