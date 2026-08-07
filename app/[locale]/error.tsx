'use client';

import { useEffect } from 'react';

/**
 * Branded error boundary for the CMS routes (e.g. a Graph fetch failure).
 * Client component per the Next.js error-boundary contract. The site chrome
 * (header + footer) comes from app/[locale]/layout, which still renders around
 * this boundary — do NOT add SiteChrome here or it renders twice.
 */
export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="mx-auto flex min-h-[50vh] max-w-2xl flex-col items-center justify-center px-6 py-24 text-center">
      <h1 className="text-2xl font-bold text-foreground">Something went wrong</h1>
      <p className="mt-3 text-foreground/60">
        We hit an unexpected error loading this page. Please try again.
      </p>
      <button
        onClick={reset}
        className="mt-8 rounded-full bg-blue-700 px-6 py-3 font-bold text-white transition-colors hover:bg-blue-800"
      >
        Try again
      </button>
    </main>
  );
}
