'use client';

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react';
import { cx } from './utils';
import './liberty.css';

export type StreamTextProps = {
  text: string;
  className?: string;
  /** Milliseconds between words. */
  stepMs?: number;
  /** Stream on mount. Inside a <StagedReveal> it waits for its turn instead. */
  autoPlay?: boolean;
  /** Change this number to replay the stream. */
  playKey?: number;
};

const prefersReducedMotion = () =>
  typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

/**
 * Paragraph whose words fade in one after another (the mockup's streamed lead
 * sentence). Server-rendered fully visible, so it still reads without
 * JavaScript. Inside a <StagedReveal> it is driven by the reveal sequence via
 * the `lib-stream-reset` / `lib-stream-start` events.
 */
export default function StreamText({
  text,
  className,
  stepMs = 32,
  autoPlay = true,
  playKey = 0,
}: StreamTextProps) {
  // Split into words and whitespace; each word remembers its position.
  const tokens = useMemo(() => {
    let n = 0;
    return text.split(/(\s+)/).map((token) => ({ token, word: token.trim() ? n++ : -1 }));
  }, [text]);
  const total = useMemo(() => tokens.filter((t) => t.word >= 0).length, [tokens]);
  const [shown, setShown] = useState(Number.POSITIVE_INFINITY);
  const ref = useRef<HTMLParagraphElement>(null);
  const timer = useRef<number | null>(null);

  const stop = useCallback(() => {
    if (timer.current !== null) {
      window.clearInterval(timer.current);
      timer.current = null;
    }
  }, []);

  const run = useCallback(() => {
    stop();
    if (prefersReducedMotion()) {
      setShown(Number.POSITIVE_INFINITY);
      return;
    }
    let n = 0;
    setShown(0);
    timer.current = window.setInterval(() => {
      n += 1;
      setShown(n);
      if (n >= total) stop();
    }, stepMs);
  }, [stepMs, stop, total]);

  // Initial / replay behaviour. Setting state here is deliberate: it hides the
  // server-rendered text before first paint so the stream can start from zero.
  /* eslint-disable react-hooks/set-state-in-effect */
  useLayoutEffect(() => {
    if (prefersReducedMotion()) return;
    const staged = ref.current?.closest('[data-staged-reveal]');
    if (staged) {
      setShown(0); // hidden until <StagedReveal> dispatches `lib-stream-start`
      return;
    }
    if (autoPlay) run();
    return stop;
  }, [autoPlay, playKey, run, stop]);
  /* eslint-enable react-hooks/set-state-in-effect */

  // Hooks for <StagedReveal>.
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const onReset = () => {
      stop();
      setShown(prefersReducedMotion() ? Number.POSITIVE_INFINITY : 0);
    };
    el.addEventListener('lib-stream-reset', onReset);
    el.addEventListener('lib-stream-start', run);
    return () => {
      el.removeEventListener('lib-stream-reset', onReset);
      el.removeEventListener('lib-stream-start', run);
      stop();
    };
  }, [run, stop]);

  return (
    <p ref={ref} data-reveal="stream" className={className}>
      {tokens.map(({ token, word }, i) =>
        word < 0 ? (
          token
        ) : (
          <span key={i} className={cx('lib-w', word < shown && 'is-in')}>
            {token}
          </span>
        ),
      )}
    </p>
  );
}
