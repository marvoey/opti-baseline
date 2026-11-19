'use client';

import { useEffect } from 'react';

/**
 * Last-resort boundary for errors thrown in the ROOT layout itself. It replaces
 * the whole document, so it must render its own <html>/<body> and cannot rely
 * on SiteChrome or globals.css being applied. Keep it self-contained (brand
 * colours are inlined: black #000000, yellow #fcaf17).
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
          fontFamily: "'Helvetica Neue', Arial, Helvetica, sans-serif",
          display: 'flex',
          minHeight: '100vh',
          margin: 0,
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '2rem',
          background: '#000000',
          color: '#ffffff',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.875rem', fontWeight: 800, letterSpacing: '-0.02em' }}>
            Something went wrong
          </h1>
          <p style={{ marginTop: '0.75rem', color: '#a3a3a3' }}>
            A critical error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: '2rem',
              borderRadius: '9999px',
              background: '#fcaf17',
              color: '#000000',
              fontWeight: 800,
              padding: '0.75rem 1.75rem',
              border: 'none',
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
