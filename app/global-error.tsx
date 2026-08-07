'use client';

import { useEffect, useState } from 'react';

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
  const [expanded, setExpanded] = useState(false);

  useEffect(() => {
    console.error(error);
  }, [error]);

  const details = {
    name: error.name,
    message: error.message,
    digest: error.digest,
    stack: error.stack,
  };

  return (
    <html lang="en">
      <body
        style={{
          fontFamily: 'Arial, Helvetica, sans-serif',
          margin: 0,
          background: '#0B1014',
          color: '#f0eeeb',
          minHeight: '100vh',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '2rem',
        }}
      >
        <div style={{ width: '100%', maxWidth: '720px' }}>
          <p style={{ fontSize: '0.75rem', letterSpacing: '0.1em', color: '#2E9791', marginBottom: '0.5rem', textTransform: 'uppercase' }}>
            Global Error
          </p>
          <h1 style={{ fontSize: '1.5rem', fontWeight: 700, margin: 0 }}>
            {error.name}: {error.message}
          </h1>

          {error.digest && (
            <p style={{ marginTop: '0.5rem', fontSize: '0.8rem', color: '#888', fontFamily: 'monospace' }}>
              digest: {error.digest}
            </p>
          )}

          <div style={{ marginTop: '1.5rem', display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <button
              onClick={reset}
              style={{
                borderRadius: '9999px',
                background: '#2E9791',
                color: '#fff',
                fontWeight: 700,
                padding: '0.6rem 1.25rem',
                border: 'none',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              Try again
            </button>
            <button
              onClick={() => setExpanded((e) => !e)}
              style={{
                borderRadius: '9999px',
                background: 'transparent',
                color: '#2E9791',
                fontWeight: 700,
                padding: '0.6rem 1.25rem',
                border: '1px solid #2E9791',
                cursor: 'pointer',
                fontSize: '0.875rem',
              }}
            >
              {expanded ? 'Hide' : 'Show'} full error
            </button>
          </div>

          {expanded && (
            <pre
              style={{
                marginTop: '1.5rem',
                background: '#111820',
                border: '1px solid #1c2e2d',
                borderRadius: '0.5rem',
                padding: '1rem',
                fontSize: '0.75rem',
                lineHeight: 1.6,
                color: '#a3b3b2',
                overflowX: 'auto',
                whiteSpace: 'pre-wrap',
                wordBreak: 'break-word',
              }}
            >
              {JSON.stringify(details, null, 2)}
              {'\n\n--- stack ---\n'}
              {error.stack ?? '(no stack)'}
            </pre>
          )}
        </div>
      </body>
    </html>
  );
}
