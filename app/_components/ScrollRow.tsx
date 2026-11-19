'use client';

import { useRef, type ReactNode } from 'react';
import { ChevronLeftIcon, ChevronRightIcon } from './RsIcons';

const ROUND_BTN =
  'flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-rs-yellow hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rs-yellow';

/**
 * Horizontally scrolling, snap-aligned row with prev/next buttons next to an
 * optional title. Children should be fixed-width flex items.
 */
export default function ScrollRow({
  title,
  label,
  children,
}: {
  title?: ReactNode;
  /** Accessible name for the scrollable region. */
  label: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const scrollPage = (dir: 1 | -1) => {
    const el = ref.current;
    if (!el) return;
    el.scrollBy({ left: dir * el.clientWidth * 0.85, behavior: 'smooth' });
  };

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div className="min-w-0">{title}</div>
        <div className="flex shrink-0 gap-2">
          <button type="button" onClick={() => scrollPage(-1)} aria-label="Scroll left" className={ROUND_BTN}>
            <ChevronLeftIcon />
          </button>
          <button type="button" onClick={() => scrollPage(1)} aria-label="Scroll right" className={ROUND_BTN}>
            <ChevronRightIcon />
          </button>
        </div>
      </div>
      <div
        ref={ref}
        role="region"
        aria-label={label}
        tabIndex={0}
        className="flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth pb-2 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden"
      >
        {children}
      </div>
    </div>
  );
}
