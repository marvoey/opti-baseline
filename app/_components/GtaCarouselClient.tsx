'use client';

import { useState, type ReactNode } from 'react';
import RsImage from './RsImage';
import { ChevronLeftIcon, ChevronRightIcon } from './RsIcons';

export type CarouselSlide = {
  badge: string | null;
  title: string;
  imageUrl: string | null;
  /** Rendered on the server (rich text) and passed through as a React node. */
  body: ReactNode;
  /** Rendered on the server (CtaButton) and passed through as a React node. */
  cta: ReactNode;
};

const ROUND_BTN =
  'flex h-11 w-11 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-rs-yellow hover:text-black focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rs-yellow';

/**
 * "New This Week" style carousel: one slide at a time, prev/next buttons and a
 * "1 of 3" counter. Client component only for the slide index.
 */
export default function GtaCarouselClient({
  heading,
  slides,
}: {
  heading?: ReactNode;
  slides: CarouselSlide[];
}) {
  const [index, setIndex] = useState(0);
  const total = slides.length;
  const current = Math.min(index, total - 1);
  const slide = slides[current];
  const go = (dir: 1 | -1) => setIndex((i) => (i + dir + total) % total);

  return (
    <div>
      <div className="mb-6 flex items-end justify-between gap-4">
        <div className="min-w-0">{heading}</div>
        {total > 1 ? (
          <div className="flex shrink-0 items-center gap-3">
            <span aria-live="polite" className="text-sm font-bold tabular-nums text-white/70">
              {current + 1} of {total}
            </span>
            <button type="button" onClick={() => go(-1)} aria-label="Previous slide" className={ROUND_BTN}>
              <ChevronLeftIcon />
            </button>
            <button type="button" onClick={() => go(1)} aria-label="Next slide" className={ROUND_BTN}>
              <ChevronRightIcon />
            </button>
          </div>
        ) : null}
      </div>

      <article
        key={current}
        className="rs-fade-in grid overflow-hidden rounded-3xl bg-rs-card md:grid-cols-2"
      >
        <div className="relative aspect-[16/10] bg-rs-panel md:aspect-auto md:min-h-[380px]">
          <RsImage src={slide.imageUrl} alt="" className="absolute inset-0 h-full w-full object-cover" />
        </div>
        <div className="flex flex-col justify-center gap-4 p-8 md:p-12">
          {slide.badge ? (
            <span className="w-fit rounded-full bg-rs-yellow px-3 py-1 text-xs font-bold uppercase tracking-wider text-black">
              {slide.badge}
            </span>
          ) : null}
          <h3 className="text-2xl font-black tracking-tight md:text-4xl">{slide.title}</h3>
          {slide.body ? (
            <div className="prose prose-invert prose-sm max-w-none prose-a:text-rs-yellow prose-li:my-0.5">
              {slide.body}
            </div>
          ) : null}
          {slide.cta}
        </div>
      </article>
    </div>
  );
}
