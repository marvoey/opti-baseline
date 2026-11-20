'use client';

import { useEffect, useRef, useState } from 'react';

// Small copy-to-clipboard button shown next to each link pill in section 3 of
// /demo/flow. Relative hrefs (e.g. /demo/rfi) are expanded against the current
// origin at click time, so what lands on the clipboard is always a full URL.

function toAbsolute(href: string): string {
  return new URL(href, window.location.origin).toString();
}

// navigator.clipboard needs a secure context; fall back for plain-http dev hosts.
async function writeClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.setAttribute('readonly', '');
    ta.style.position = 'fixed';
    ta.style.opacity = '0';
    document.body.appendChild(ta);
    ta.select();
    try {
      return document.execCommand('copy');
    } catch {
      return false;
    } finally {
      document.body.removeChild(ta);
    }
  }
}

export default function CopyUrlButton({ href, label }: { href: string; label: string }) {
  const [state, setState] = useState<'idle' | 'copied' | 'failed'>('idle');
  const timer = useRef<ReturnType<typeof setTimeout>>(undefined);

  useEffect(() => () => clearTimeout(timer.current), []);

  async function copy() {
    const ok = await writeClipboard(toAbsolute(href));
    setState(ok ? 'copied' : 'failed');
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setState('idle'), 1500);
  }

  const text = state === 'copied' ? 'Copied' : state === 'failed' ? 'Copy failed' : `Copy URL for ${label}`;

  return (
    <button type="button" className={`copy-btn${state === 'copied' ? ' is-copied' : ''}`} onClick={copy} title={text} aria-label={text}>
      {state === 'copied' ? (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <path d="M20 6 9 17l-5-5" />
        </svg>
      ) : (
        <svg viewBox="0 0 24 24" width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
          <rect x="9" y="9" width="13" height="13" rx="2" />
          <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1" />
        </svg>
      )}
      <span className="sr-only" aria-live="polite">{state === 'copied' ? 'Copied' : ''}</span>
    </button>
  );
}
