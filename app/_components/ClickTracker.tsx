'use client';

import { useEffect } from 'react';

export default function ClickTracker() {
  useEffect(() => {
    const onClick = (e: MouseEvent) => {
      const el = (e.target as HTMLElement | null)?.closest<HTMLElement>('[data-event-key]');
      const eventKey = el?.dataset.eventKey;
      if (!eventKey) return;
      // keepalive lets the request finish even though the click navigates away
      fetch('/api/track', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify({
          eventKey,
          page: location.pathname,
          label: el.textContent?.trim().slice(0, 80),
        }),
        keepalive: true,
      }).catch(() => {});
    };
    document.addEventListener('click', onClick);
    return () => document.removeEventListener('click', onClick);
  }, []);

  return null;
}