'use client';

import React, { useEffect, useRef, useState } from 'react';
import { SCENES, STATUS, STATUS_BY_SCENE, STATUS_NOTE } from './_scenes';
import { openChannel } from './_sync';

/* =====================================================================
   Presenter window for the ODP demo. Everything the audience should not see
   lives here: scene list and timings, prep / TELL / SHOW / TELL BACK notes, the
   status of each scene, warnings, and whether the demo is reading live ODP data.
   The demo window is the source of truth; this window mirrors its state and sends
   commands (see _sync.js). Opened from the demo window with the S key.
   ===================================================================== */

const Pill = ({ children, cls = 'bg-slate-100 text-slate-700' }) => (
  <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{children}</span>
);

const Btn = ({ children, onClick, disabled, kind = 'ghost' }) => (
  <button
    onClick={onClick}
    disabled={disabled}
    className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${kind === 'dark' ? 'bg-emerald-900 text-white hover:bg-emerald-800' : 'border border-slate-300 bg-white text-slate-700 hover:bg-slate-50'}`}
  >
    {children}
  </button>
);

export default function Presenter() {
  const [st, setSt] = useState(null);
  const chan = useRef(null);

  useEffect(() => {
    const ch = openChannel();
    if (!ch) return undefined;
    chan.current = ch;
    ch.onmessage = (e) => {
      const m = e.data || {};
      if (m.type !== 'state' || !m.payload) return;
      try { setSt(JSON.parse(m.payload)); } catch { /* ignore a malformed message */ }
    };
    ch.postMessage({ type: 'hello' });
    return () => { ch.close(); chan.current = null; };
  }, []);

  const send = (m) => chan.current?.postMessage(m);

  useEffect(() => {
    const onKey = (e) => {
      if (e.metaKey || e.ctrlKey || e.altKey) return;
      const tag = (e.target && e.target.tagName) || '';
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(tag)) return;
      if (e.key === 'ArrowRight') chan.current?.postMessage({ type: 'step', delta: 1 });
      if (e.key === 'ArrowLeft') chan.current?.postMessage({ type: 'step', delta: -1 });
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  if (!st) {
    return (
      <div className="flex h-screen items-center justify-center bg-slate-50 p-6 text-center text-sm text-slate-600">
        Waiting for the demo window…<br />Open it at /demo/odp-prototype and press S there.
      </div>
    );
  }

  const idx = Math.min(SCENES.length - 1, Math.max(0, st.idx));
  const s = SCENES[idx];
  const status = STATUS[STATUS_BY_SCENE[s.n]];
  const reset = () => { if (window.confirm('Reset the demo window to Scene 1?')) send({ type: 'reset' }); };
  const live = st.source === 'live';

  return (
    <div className="flex h-screen flex-col bg-slate-50 text-sm text-slate-800">
      <header className="space-y-2 border-b border-slate-200 bg-white px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <div className="text-xs font-bold uppercase tracking-wider text-slate-500">Presenter · ODP demo (RFP capabilities 1 and 2)</div>
            <div className="mt-0.5">
              {st.source ? (
                <Pill cls={live ? 'bg-green-100 text-green-800' : 'bg-amber-100 text-amber-800'}>
                  {live ? 'Reading live ODP data' : 'Showing sample data (ODP not reached)'}
                </Pill>
              ) : <Pill>No data requested yet</Pill>}
            </div>
          </div>
          <Btn onClick={reset}>Reset demo</Btn>
        </div>
        <div className="h-1 rounded bg-slate-200"><div className="h-1 rounded bg-emerald-600 transition-all" style={{ width: `${((idx + 1) / SCENES.length) * 100}%` }} /></div>
        <div className="flex items-center gap-2">
          <Btn onClick={() => send({ type: 'step', delta: -1 })} disabled={idx === 0}>‹ Prev</Btn>
          <select value={idx} onChange={(e) => send({ type: 'goto', idx: Number(e.target.value) })} className="min-w-0 flex-1 rounded-lg border border-slate-300 bg-white px-2 py-1.5 text-sm">
            {SCENES.map((sc, i) => <option key={sc.n} value={i}>{`${sc.n} · ${sc.short} · ${sc.time}`}</option>)}
          </select>
          <Btn kind="dark" onClick={() => send({ type: 'step', delta: 1 })} disabled={idx === SCENES.length - 1}>Next ›</Btn>
        </div>
      </header>

      <main className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        <div>
          <div className="text-xs text-slate-500">Scene {s.n} of {SCENES.length} · {s.act}</div>
          <div className="mt-0.5 text-base font-bold">{s.title}</div>
          <div className="mt-2 flex flex-wrap gap-1">
            <span title={status.hint}><Pill cls={status.cls}>{status.label}{STATUS_NOTE[s.n] ? ` · ${STATUS_NOTE[s.n]}` : ''}</Pill></span>
            <Pill>{s.time}</Pill>
            <Pill cls="bg-blue-50 text-blue-700">RFP capability {s.rfp}</Pill>
          </div>
        </div>

        {s.warn && <div className="rounded-lg border border-amber-300 bg-amber-50 p-3 text-amber-900">{s.warn}</div>}

        <div className="rounded-lg border-l-4 border-slate-400 bg-slate-100 p-3">
          <div className="mb-1 text-xs font-bold uppercase text-slate-600">Prep</div>
          <ul className="list-disc space-y-1 pl-4 text-slate-700">{s.prep.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>
        <div><Pill cls="bg-blue-100 text-blue-800">TELL</Pill><p className="mt-1 text-slate-800">“{s.tell}”</p></div>
        <div><Pill cls="bg-green-100 text-green-800">SHOW</Pill><ol className="mt-1 list-decimal space-y-1 pl-5 text-slate-800">{s.show.map((x) => <li key={x}>{x}</li>)}</ol></div>
        <div><Pill cls="bg-violet-100 text-violet-800">TELL BACK</Pill><p className="mt-1 text-slate-800">“{s.back}”</p></div>
      </main>

      <footer className="border-t border-slate-200 bg-white px-4 py-2 text-[11px] leading-snug text-slate-500">
        LIVE = reads the real ODP tenant · HYBRID = real ODP data with a simulated rule on top · SIMULATED = a pattern only · SLIDES = RFP requirements.
        All profiles are synthetic (@example.com). The 44.5M, 25M and 5,000 events/sec figures are from the RFP and are not demonstrated here. Arrow keys move between scenes.
      </footer>
    </div>
  );
}
