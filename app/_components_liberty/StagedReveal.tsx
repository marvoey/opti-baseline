'use client';

import { useLayoutEffect, useRef, type ReactNode } from 'react';
import { cx } from './utils';
import './liberty.css';

export type StagedRevealProps = {
  children?: ReactNode;
  /** Reveal on mount. When false nothing is hidden. */
  autoPlay?: boolean;
  /** Change this number to replay the reveal. */
  playKey?: number;
  /** 1 = the mockup's pace; 2 = twice as fast. */
  speed?: number;
  className?: string;
};

/** Pause (ms) after each type of element, from the mockup's `build()`. */
const PAUSE: Record<string, number> = { illo: 320, li: 95, row: 95, accent: 60 };
const DEFAULT_PAUSE = 130;
const STREAM_STEP_MS = 32;

const sleep = (ms: number) => new Promise<void>((r) => setTimeout(r, ms));

/**
 * C33 — staged reveal. Wrap a composed answer page and its pieces appear one
 * after another in reading order (headings and cards fade up, table rows and
 * list items slide in, illustrations scale in, accent bars grow, and the lead
 * sentence streams word by word).
 *
 * It finds elements by their `data-reveal` attribute, which every Liberty
 * component already sets (`card`, `row`, `li`, `illo`, `accent`, `stream`).
 * Add `data-reveal="card"` to your own markup to include it. If a page has no
 * `data-reveal` elements, the direct children are revealed instead.
 */
export default function StagedReveal({
  children,
  autoPlay = true,
  playKey = 0,
  speed = 1,
  className,
}: StagedRevealProps) {
  const ref = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const root = ref.current;
    if (!root || !autoPlay) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const marked = Array.from(root.querySelectorAll<HTMLElement>('[data-reveal]'));
    const targets = marked.length ? marked : (Array.from(root.children) as HTMLElement[]);
    const typeOf = (el: HTMLElement) => el.dataset.reveal ?? 'card';
    const hideable = targets.filter((el) => typeOf(el) !== 'stream');

    // Hide everything (before first paint) and reset streamed text.
    hideable.forEach((el) => el.classList.add('lib-bld', `lib-bld--${typeOf(el)}`));
    targets
      .filter((el) => typeOf(el) === 'stream')
      .forEach((el) => el.dispatchEvent(new CustomEvent('lib-stream-reset')));

    let cancelled = false;
    const scale = (ms: number) => ms / Math.max(speed, 0.1);

    (async () => {
      await sleep(0); // let the hidden state paint first
      for (const el of targets) {
        if (cancelled) return;
        const type = typeOf(el);
        if (type === 'stream') {
          el.dispatchEvent(new CustomEvent('lib-stream-start'));
          const words = (el.textContent ?? '').trim().split(/\s+/).filter(Boolean).length;
          await sleep(scale(words * STREAM_STEP_MS + 120));
          continue;
        }
        el.classList.add('is-in');
        await sleep(scale(PAUSE[type] ?? DEFAULT_PAUSE));
      }
    })();

    return () => {
      cancelled = true;
      hideable.forEach((el) => {
        el.classList.remove('lib-bld', `lib-bld--${typeOf(el)}`, 'is-in');
      });
    };
  }, [autoPlay, playKey, speed]);

  return (
    <div ref={ref} data-staged-reveal="" className={cx(className)}>
      {children}
    </div>
  );
}
