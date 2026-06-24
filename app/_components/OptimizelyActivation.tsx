'use client';

import { useEffect } from 'react';
import { usePathname } from 'next/navigation';

declare global {
  interface Window {
    // The Optimizely Web snippet replaces this array's `push` with its command API;
    // until it loads, `push` just queues commands for the snippet to process.
    optimizely?: unknown[];
  }
}

/**
 * Re-activates Optimizely Web Experimentation on client-side (soft) navigations.
 *
 * The snippet (loaded in app/layout.tsx) only auto-activates on a FULL page load.
 * Next `<Link>` navigations are soft — no reload — so without this the new route
 * keeps the previous page's (un)personalized state. On every pathname change we
 * push `{ type: 'activate' }` to re-run page targeting + experiments for the new
 * route. Skips the initial load (the snippet already activated then).
 *
 * Note: if your experiments are scoped by page rules rather than URL targeting,
 * swap the activate call for the page-event form
 * (`window.optimizely.push({ type: 'page', pageName, isActive: true })`).
 */
export default function OptimizelyActivation() {
  const pathname = usePathname();

  useEffect(() => {
    window.optimizely = window.optimizely || [];
    window.optimizely.push({ type: 'activate' });
  }, [pathname]);

  return null;
}
