'use client';

import { useEffect } from 'react';

// When /demo/flow was opened in its own window (press "S" on the site, see
// app/_components/FlowWindowShortcut.tsx), open every external link as a new tab in the window
// that opened it (not a new tab next to the popup). One delegated listener covers all the links on the page, so
// the section components keep their plain target="_blank" anchors.
//
// window.opener only exists when the popup was opened without "noopener". If there is no opener
// (the page was opened directly in a tab) or the opener is gone, or the browser cut it off after
// the opener loaded a page with a Cross-Origin-Opener-Policy header, the link falls through to its
// normal target="_blank" behaviour. Modified clicks (new tab, new window, download) are left alone.

// Opens the URL as a new tab in the opener's browser window. Returns false when the browser refuses:
// the opener has since moved to another origin (calling open() on it throws), or the popup blocker
// stopped it (open() returns null, because the click happened in this window, not the opener).
function openInNewTab(opener: Window, url: string): boolean {
  try {
    const tab = opener.open('', '_blank');
    if (!tab) return false;
    tab.opener = null; // the new tab gets no handle back to the site window
    tab.location.href = url;
    return true;
  } catch {
    return false;
  }
}

export default function OpenerLinks() {
  useEffect(() => {
    function onClick(e: MouseEvent) {
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const anchor = (e.target as Element | null)?.closest?.('a[target="_blank"]');
      if (!(anchor instanceof HTMLAnchorElement) || !anchor.closest('.dfl')) return;

      const opener = window.opener as Window | null;
      if (!opener || opener.closed) return;

      if (!openInNewTab(opener, anchor.href)) {
        // Fallback: load the link in the opener itself. Setting location is allowed even after the
        // opener has moved to another origin (CMS, FX), unlike opening a tab from it.
        try {
          opener.location.href = anchor.href;
        } catch {
          return;
        }
      }
      e.preventDefault();
      try {
        opener.focus();
      } catch {
        // Browsers may refuse to raise the window; the page still navigated.
      }
    }

    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}
