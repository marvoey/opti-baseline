'use client';

import React, { useEffect, useRef, useState } from 'react';
import { SCENES, TIMELINE, STATUS } from './_scenes';
import { openChannel } from './_sync';
import { C, FONT_CSS, Btn, Pill, Eyebrow } from './_ui';

/* =====================================================================
   Presenter window for the marketing demo (capabilities 5 and 6). Everything the audience
   should not see lives here: scene list and timings, prep / TELL / SHOW / TELL BACK notes,
   the status of each scene, warnings, the story clock, reset and the typed answer to the
   Monday question. The demo window is the source of truth; this window mirrors its state and
   sends commands (see _sync.js). Opened from the demo window with the S key.
   ===================================================================== */

/* Owns its draft so typing never fights the echo from the demo window; remounted (via key) on reset. */
function AnswerBox({ initial, onChange }) {
  const [v, setV] = useState(initial);
  return (
    <textarea
      value={v}
      onChange={(e) => { setV(e.target.value); onChange(e.target.value); }}
      rows={3}
      placeholder="Type their answer word for word…"
      className="f-b mt-2 w-full rounded-[16px] border-2 border-[#08251A] bg-white p-2 text-sm"
    />
  );
}

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
      <div className="f-b flex h-screen items-center justify-center bg-[#EFF6E9] p-6 text-center text-sm text-[#08251A]">
        <style>{FONT_CSS}</style>
        <p>Waiting for the demo window…<br />Open it at /demo/odp-mark/marketing and press S there.</p>
      </div>
    );
  }

  const idx = Math.min(SCENES.length - 1, Math.max(0, st.idx));
  const s = SCENES[idx];
  const status = STATUS[s.status];
  const stamps = st.stamps || {};
  const clock = s.stamp ? TIMELINE.find((t) => t[0] === s.stamp) : null;
  const last = [...TIMELINE].reverse().find(([k]) => stamps[k]);
  const reset = () => { if (window.confirm('Reset the demo window to Scene 1 and clear all progress?')) send({ type: 'reset' }); };

  return (
    <div className="flex h-screen flex-col bg-[#EFF6E9] text-[#08251A]">
      <style>{FONT_CSS}</style>
      <header className="space-y-3 border-b-2 border-[#08251A] bg-white px-4 py-3">
        <div className="flex items-center justify-between gap-2">
          <div>
            <p className="f-m text-[11px] uppercase text-[#08251A]">Presenter · Monday of Week 11</p>
            <p className="f-m text-[11px] text-[#08251A]">⏱ {last ? `${last[1]} · ${last[2]}` : 'Mon 7:30 · not started'}</p>
          </div>
          <Btn kind="ghost" onClick={reset}>Reset demo</Btn>
        </div>
        <div className="h-1.5 overflow-hidden rounded-full border border-[#08251A] bg-[#EFF6E9]"><div className="h-full bg-[#3AB533] transition-all" style={{ width: `${((idx + 1) / SCENES.length) * 100}%` }} /></div>
        <div className="flex items-center gap-2">
          <Btn kind="ghost" onClick={() => send({ type: 'step', delta: -1 })} disabled={idx === 0}>‹</Btn>
          <select value={idx} onChange={(e) => send({ type: 'goto', idx: Number(e.target.value) })} className="f-b min-w-0 flex-1 rounded-full border-2 border-[#08251A] bg-white px-3 py-1.5 text-sm text-[#08251A]">
            {SCENES.map((sc, i) => <option key={sc.n} value={i}>{`${sc.stamp && stamps[sc.stamp] ? '✓' : sc.n} · ${sc.short} · ${sc.time}`}</option>)}
          </select>
          <Btn kind="primary" onClick={() => send({ type: 'step', delta: 1 })} disabled={idx === SCENES.length - 1}>›</Btn>
        </div>
      </header>

      <main className="min-h-0 flex-1 space-y-3 overflow-y-auto p-4">
        <div>
          <p className="f-m text-[11px]">SCENE {s.n} OF {SCENES.length}</p>
          <p className="f-h3 mt-1 text-lg">{s.title}</p>
          <div className="mt-2 flex flex-wrap gap-1.5" title={status.hint}>
            <Pill bg={status.bg}>{status.label}</Pill>
            <Pill bg={C.white}>{s.time}</Pill>
          </div>
          <p className="f-b mt-1 text-xs">{status.hint}</p>
        </div>
        {s.warn && <div className="f-b rounded-[20px] border-2 border-[#08251A] bg-[#91DBDA] p-3 text-sm">{s.warn}</div>}
        <div className="rounded-[20px] border-2 border-[#08251A] bg-white p-3">
          <Eyebrow>Prep</Eyebrow>
          <ul className="f-b mt-1 list-disc space-y-1 pl-4 text-sm">{s.prep.map((p) => <li key={p}>{p}</li>)}</ul>
        </div>
        <div><Pill bg={C.blue}>Tell</Pill><p className="f-b mt-1 text-sm">“{s.tell}”</p></div>
        <div><Pill bg={C.lf}>Show</Pill><ol className="f-b mt-1 list-decimal space-y-1 pl-5 text-sm">{s.show.map((x) => <li key={x}>{x}</li>)}</ol></div>
        <div><Pill bg={C.n3}>Tell back</Pill><p className="f-b mt-1 text-sm">“{s.back}”</p></div>
        {clock && (
          <div className={`f-m rounded-[20px] border-2 border-[#08251A] p-2 text-[11px] ${stamps[s.stamp] ? 'bg-[#ABFF44]' : 'bg-white'}`}>
            ⏱ {clock[1]} · {clock[2]} {stamps[s.stamp] ? '✓' : '(complete the scene to stamp)'}
          </div>
        )}
        {(s.n === 1 || s.n === 10) && (
          <label className="block rounded-[20px] border-2 border-[#08251A] bg-white p-3">
            <Eyebrow>Their answer to the Monday question</Eyebrow>
            <span className="f-b block text-xs">Asked in Scene 1, quoted back on screen in Scene 10.</span>
            <AnswerBox key={st.resetKey} initial={st.answer || ''} onChange={(value) => send({ type: 'answer', value })} />
          </label>
        )}
      </main>

      <footer className="f-b border-t-2 border-[#08251A] bg-white px-4 py-2 text-[11px] leading-snug text-[#08251A]">
        Prototype only: every screen in the demo window is a simulation with synthetic data. Arrow keys move between scenes.
      </footer>
    </div>
  );
}
