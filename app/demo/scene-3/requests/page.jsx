'use client';

import React, { useEffect, useState } from 'react';
import { C1, CHANNEL, CLIPBOARD_PATH } from './_c1';

/* H&R Block · Scene 3 · CMP "Seasonal campaign request" form.
   Clip C1 is pasted from the separate clipboard window. All content is SYNTHETIC. */

const BLANK = Object.fromEntries(Object.keys(C1).map((k) => [k, '']));
const FIELDS = [
  ['title', 'Request title', 'input', true],
  ['requestedBy', 'Requested by', 'input', true],
  ['goal', 'Goal', 'input', true],
  ['audiences', 'Audiences', 'textarea', true],
  ['channels', 'Channels', 'input', true],
  ['needed', 'Needed by', 'input', true],
  ['legal', 'Legal review needed', 'input', true],
  ['notes', 'Notes', 'textarea', false],
];

export default function RequestForm() {
  const [form, setForm] = useState(BLANK);
  const [submitted, setSubmitted] = useState(false);

  // The clipboard window (./clipboard) posts the C1 clip here; ack so it can confirm.
  useEffect(() => {
    const bc = new BroadcastChannel(CHANNEL);
    bc.onmessage = (e) => {
      if (e.data?.type !== 'paste') return;
      setForm({ ...BLANK, ...e.data.data });
      setSubmitted(false);
      bc.postMessage({ type: 'ack' });
    };
    return () => bc.close();
  }, []);

  // Press S (outside text fields) to open the presenter clipboard window.
  useEffect(() => {
    const onKey = (e) => {
      if (e.key.toLowerCase() !== 's' || e.ctrlKey || e.metaKey || e.altKey || e.repeat) return;
      const t = e.target;
      if (t instanceof HTMLElement && (t.isContentEditable || /^(INPUT|TEXTAREA|SELECT)$/.test(t.tagName))) return;
      window.open(CLIPBOARD_PATH, 'scene3-clipboard', 'popup,width=560,height=900');
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  const missing = FIELDS.filter(([k, , , req]) => req && !form[k].trim()).length;

  const onSubmit = (e) => {
    e.preventDefault();
    if (!missing) setSubmitted(true);
  };

  return (
    <main className="min-h-screen px-4 py-8" style={{ background: '#F6F4E9', fontFamily: 'Graphik, Inter, ui-sans-serif, system-ui, sans-serif', color: '#262626' }}>
      <div className="mx-auto max-w-2xl overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
        <div className="border-b border-slate-200 bg-violet-50 px-4 py-2">
          <span className="text-xs font-semibold text-slate-600">CMP · Requests</span>
        </div>

        {submitted ? (
          <div className="space-y-3 p-6">
            <div className="text-lg font-bold text-green-800">✓ Request submitted</div>
            <div className="text-sm text-slate-600">{form.title}</div>
            <button type="button" onClick={() => { setForm(BLANK); setSubmitted(false); }} className="text-xs text-slate-500 underline hover:text-slate-800">
              New request
            </button>
          </div>
        ) : (
          <form onSubmit={onSubmit} className="space-y-3 p-4">
            <h1 className="font-bold">New request · Seasonal campaign request</h1>
            {FIELDS.map(([k, label, kind, req]) => {
              const props = {
                value: form[k],
                onChange: (e) => setForm({ ...form, [k]: e.target.value }),
                className: `mt-1 w-full rounded-md border px-2 py-1.5 text-sm font-normal text-slate-900 ${!req || form[k].trim() ? 'border-slate-300' : 'border-amber-300 bg-amber-50/40'}`,
              };
              return (
                <label key={k} className="block text-xs font-semibold text-slate-600">
                  {label} {req && <span className="text-red-500">*</span>}
                  {k === 'legal' && <span className="ml-2 rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-red-700">Required for Legal</span>}
                  {kind === 'textarea' ? <textarea rows={2} {...props} /> : <input {...props} />}
                </label>
              );
            })}
            <div className="flex items-center gap-3">
              <button type="submit" disabled={missing > 0} className="rounded-lg bg-green-700 px-3 py-1.5 text-sm font-semibold text-white transition hover:bg-green-800 disabled:cursor-not-allowed disabled:opacity-40">
                Submit request
              </button>
              {missing > 0 && <span className="text-xs text-slate-500">{missing} required field{missing === 1 ? '' : 's'} left. Required fields keep requests from arriving half-baked.</span>}
            </div>
          </form>
        )}
      </div>
    </main>
  );
}
