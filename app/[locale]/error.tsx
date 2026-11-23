'use client';

import { useEffect } from 'react';

/**
 * Branded error boundary for the CMS routes (for example a Graph fetch failure). The site chrome
 * (header + footer) comes from app/[locale]/layout, which still renders around this boundary; do
 * NOT add SiteChrome here or it renders twice. `retry` re-fetches and re-renders (Next.js 16.3+).
 */
export default function Error({ error, retry }: { error: Error & { digest?: string }; retry: () => void }) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="w-full bg-neutral-3 px-6 py-20 text-dark-fir">
      <div className="mx-auto flex max-w-2xl flex-col items-center rounded-[32px] bg-white px-8 py-14 text-center">
        <h1 className="font-display text-2xl font-extrabold">Something went wrong.</h1>
        <p className="mt-3">We couldn’t load this page just now. Wait a few seconds, then try again.</p>
        <button
          type="button"
          onClick={() => retry()}
          className="mt-8 rounded-full border-2 border-dark-fir bg-lfgreen px-6 py-3 font-semibold hover:bg-grass"
        >
          Try again
        </button>
      </div>
    </main>
  );
}
