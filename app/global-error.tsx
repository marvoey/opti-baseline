'use client';

import { useEffect } from 'react';

/**
 * Last-resort boundary for errors thrown in the ROOT layout itself. It replaces
 * the whole document, so it must render its own <html>/<body> and cannot rely
 * on SiteChrome or globals.css being applied. Keep it self-contained.
 */
export default function GlobalError({
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
    <html lang="en">
      <body
        style={{
          // Mirrors the theme in app/globals.css (ink #0c0c0b, 0 radius, 600
          // weight) with a system font stack, since next/font isn't loaded here.
          fontFamily:
            '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
          color: '#0c0c0b',
          background: '#ffffff',
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 600 }}>Something went wrong</h1>
          <p style={{ marginTop: '0.75rem', color: '#262623' }}>
            A critical error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: '2rem',
              borderRadius: 0,
              background: '#0c0c0b',
              color: '#fff',
              fontWeight: 600,
              fontSize: '1rem',
              padding: '0.4375rem 1rem',
              minHeight: '2.5rem',
              border: '1px solid transparent',
              cursor: 'pointer',
            }}
          >
            Try again
          </button>
        </div>
      </body>
    </html>
  );
}
