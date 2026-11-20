'use client';

import { useEffect, useRef } from 'react';
import { usePathname } from 'next/navigation';

// Press "S" anywhere on the site to open /demo/flow in its own window. The window is opened
// without "noopener" on purpose: the flow page uses window.opener to load its links back into
// this window (see app/demo/flow/_sections/OpenerLinks.tsx). If the window is already open,
// pressing "S" just brings it to the front instead of reloading it.

const FLOW_PATH = '/demo/flow';
const WINDOW_NAME = 'demo-flow';

function isTypingTarget(target: EventTarget | null) {
  if (!(target instanceof HTMLElement)) return false;
  return target.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(target.tagName);
}

export default function FlowWindowShortcut() {
  const pathname = usePathname();
  const flowWindow = useRef<Window | null>(null);

  useEffect(() => {
    // The flow page is the popup itself; don't open a second copy from inside it.
    if (pathname.startsWith(FLOW_PATH)) return;

    function onKeyDown(e: KeyboardEvent) {
      if (e.key.toLowerCase() !== 's' || e.repeat || e.metaKey || e.ctrlKey || e.altKey) return;
      if (isTypingTarget(e.target)) return;

      const existing = flowWindow.current;
      if (existing && !existing.closed) {
        existing.focus();
        return;
      }
      flowWindow.current = window.open(FLOW_PATH, WINDOW_NAME, 'popup,width=640,height=900');
    }

    window.addEventListener('keydown', onKeyDown);
    return () => window.removeEventListener('keydown', onKeyDown);
  }, [pathname]);

  return null;
}
