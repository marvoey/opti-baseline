'use client';

import React, { useEffect, useRef, useState } from 'react';
import { C1, C1_LABELS, CHANNEL } from '../_c1';
import { Frame } from '../../_shared';
import { MarkPanel } from '../../_mark';

/* Scene 3 · presenter clipboard window. Open it beside the requests form (press S there).
   "Paste C1" sends the clip to that window; Mark below drafts the brief from C2. */

export default function Clipboard() {
  const chan = useRef(null);
  const timer = useRef(null);
  const [status, setStatus] = useState('idle'); // idle | sending | pasted | no-window

  useEffect(() => {
    const bc = new BroadcastChannel(CHANNEL);
    chan.current = bc;
    bc.onmessage = (e) => {
      if (e.data?.type === 'ack') {
        clearTimeout(timer.current);
        setStatus('pasted');
      }
    };
    return () => { clearTimeout(timer.current); bc.close(); };
  }, []);

  const send = () => {
    setStatus('sending');
    chan.current?.postMessage({ type: 'paste', data: C1 });
    clearTimeout(timer.current);
    timer.current = setTimeout(() => setStatus('no-window'), 800); // no ack: form window isn't open
  };

  return (
    <main className="min-h-screen space-y-4 p-4" style={{ background: '#F6F4E9', fontFamily: 'Graphik, Inter, ui-sans-serif, system-ui, sans-serif', color: '#262626' }}>
      <div className="flex items-center justify-between gap-3">
        <h1 className="text-sm font-bold">C1 · Scene 3 · CMP request form</h1>
        <button type="button" onClick={send} className="rounded-lg border border-amber-300 bg-amber-50 px-3 py-1.5 text-sm font-semibold text-amber-800 hover:bg-amber-100">
          Paste C1
        </button>
      </div>

      <p className="text-xs" role="status" aria-live="polite">
        {status === 'idle' && <span className="text-slate-500">Sends the clip to the open requests form.</span>}
        {status === 'sending' && <span className="text-slate-500">Sending…</span>}
        {status === 'pasted' && <span className="font-semibold text-green-800">✓ Pasted into the requests window</span>}
        {status === 'no-window' && <span className="font-semibold text-red-700">No requests window found. Open /demo/scene-3/requests first.</span>}
      </p>

      <dl className="space-y-2 rounded-lg border border-slate-200 bg-white p-3 text-xs">
        {Object.entries(C1).map(([k, v]) => (
          <div key={k}>
            <dt className="font-semibold text-slate-500">{C1_LABELS[k]}</dt>
            <dd className="text-slate-800">{v}</dd>
          </div>
        ))}
      </dl>

      <Frame url="mark.optimizely.com" label="Mark" accent="bg-indigo-50">
        <MarkPanel />
      </Frame>
    </main>
  );
}
