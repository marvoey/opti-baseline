'use client';

import { useEffect, useState } from 'react';

/** Matches the first numeric run in a metric string, e.g. "-18%" → "-18", "€18M" → "18". */
const NUMERIC_PATTERN = /-?\d[\d,]*\.?\d*/;

/**
 * Renders a metric string (e.g. "-18%", "+14%", "€18M") with its numeric
 * portion counting up from 0 on mount, keeping any prefix/suffix text
 * (currency symbols, %, units) static. Falls back to the raw string when no
 * numeric portion is found — or immediately when `animate` is false, which
 * callers should pass for static contexts (e.g. an email preview) where a
 * count-up animation wouldn't render or wouldn't make sense.
 *
 * Renders nothing at all until the animation actually starts (i.e. until
 * client-side JS has hydrated) rather than showing a static "0%" — that flash
 * of a value that isn't moving yet reads as broken, whereas empty-then-pop-in
 * reads as the animation beginning.
 */
export function AnimatedMetric({
  value,
  animate = true,
  durationMs = 700,
}: {
  value: string;
  animate?: boolean;
  durationMs?: number;
}) {
  const match = value.match(NUMERIC_PATTERN);
  const raw = match?.[0] ?? null;
  const target = raw ? parseFloat(raw.replace(/,/g, '')) : null;
  const decimals = raw?.includes('.') ? raw.split('.')[1].length : 0;
  const shouldAnimate = animate && target !== null;

  const [current, setCurrent] = useState(shouldAnimate ? 0 : (target ?? 0));
  const [started, setStarted] = useState(!shouldAnimate);

  useEffect(() => {
    if (!shouldAnimate) return;
    let frame: number;
    const start = performance.now();

    const tick = (now: number) => {
      setStarted(true);
      const progress = Math.min((now - start) / durationMs, 1);
      const eased = 1 - (1 - progress) ** 3; // quick ease-out
      setCurrent(target! * eased);
      if (progress < 1) frame = requestAnimationFrame(tick);
    };
    frame = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(frame);
  }, [shouldAnimate, target, durationMs]);

  if (raw === null || target === null) return <>{value}</>;
  if (!started) return null;

  const formatted = current.toLocaleString(undefined, {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });
  const [prefix, suffix] = value.split(raw);

  return (
    <>
      {prefix}
      {formatted}
      {suffix}
    </>
  );
}
