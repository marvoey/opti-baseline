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
          fontFamily: 'Arial, Helvetica, sans-serif',
          display: 'flex',
          minHeight: '100vh',
          alignItems: 'center',
          justifyContent: 'center',
          textAlign: 'center',
          padding: '2rem',
        }}
      >
        <div>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700 }}>Something went wrong</h1>
          <p style={{ marginTop: '0.75rem', color: '#475569' }}>
            A critical error occurred. Please try again.
          </p>
          <button
            onClick={reset}
            style={{
              marginTop: '2rem',
              borderRadius: '9999px',
              background: '#1d5b9c',
              color: '#fff',
              fontWeight: 700,
              padding: '0.75rem 1.5rem',
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
