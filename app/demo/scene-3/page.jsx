'use client';

import React, { useState } from 'react';
import { Btn, Frame } from './_shared';
import { MarkPanel } from './_mark';

/* =====================================================================
   H&R Block · Scene 3 · Act 1: from request to brief
   Standalone version of the S3 scene from app/demo/prototype, following
   the beats in the demo plan (RFP 4.17-4.19, 08:00-13:00, Maya).
   All content is SYNTHETIC.
   ===================================================================== */

const C = { green: '#005D1F', dark: '#003512', sand: '#F6F4E9', neon: '#00E95C' };

/* C1 · CMP request form (demo plan clipboard) */
const C1 = {
  title: 'Still time to file - expert help (late season)',
  requestedBy: 'Product Marketing, Assisted',
  goal: 'More tax-pro appointments booked in the final 10 days of the season',
  audiences: 'DIY filers who started but did not finish; returning assisted clients without an appointment; late filers',
  channels: 'Web landing page /still-time-to-file (EN + ES)',
  needed: 'Thursday',
  legal: 'Yes - claims about free help, refund timing and deadlines',
  notes: 'Reuse approved disclosure TS27-LATE-01. Spanish version required.',
};
const BLANK = Object.fromEntries(Object.keys(C1).map((k) => [k, '']));
const FIELDS = [
  ['title', 'Request title', 'input'],
  ['requestedBy', 'Requested by', 'input'],
  ['goal', 'Goal', 'input'],
  ['audiences', 'Audiences', 'textarea'],
  ['channels', 'Channels', 'input'],
  ['needed', 'Needed by', 'input'],
  ['legal', 'Legal review needed', 'input'],
];


const TIMELINE = [
  ['req', 'Tue 9:02', 'Request submitted'],
  ['accepted', 'Tue 9:04', 'Accepted by Maya, priority High'],
  ['brief', 'Tue 9:06', 'Brief drafted by Mark'],
];

/* ---------------------------- helpers ---------------------------- */

const Pill = ({ children, cls }) => <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{children}</span>;



/* ---------------------------- CMP request ---------------------------- */
function RequestPanel({ form, setForm, phase, onSubmit, onAccept, onReset }) {
  const valid = FIELDS.every(([k]) => form[k].trim());
  const missing = FIELDS.filter(([k]) => !form[k].trim()).length;

  if (phase === 'form') {
    return (
      <div className="space-y-3 p-4">
        <div className="flex items-center justify-between">
          <div className="font-bold">New request · Seasonal campaign request</div>
          <Btn kind="paste" onClick={() => setForm(C1)}>Paste C1</Btn>
        </div>
        {FIELDS.map(([k, label, kind]) => {
          const props = {
            value: form[k],
            onChange: (e) => setForm({ ...form, [k]: e.target.value }),
            className: `mt-1 w-full rounded-md border px-2 py-1.5 text-sm font-normal text-slate-900 ${form[k].trim() ? 'border-slate-300' : 'border-amber-300 bg-amber-50/40'}`,
          };
          return (
            <label key={k} className="block text-xs font-semibold text-slate-600">
              {label} <span className="text-red-500">*</span>
              {k === 'legal' && <span className="ml-2 rounded bg-red-50 px-1.5 py-0.5 text-[10px] font-bold uppercase text-red-700">Required for Legal</span>}
              {kind === 'textarea' ? <textarea rows={2} {...props} /> : <input {...props} />}
            </label>
          );
        })}
        <label className="block text-xs font-semibold text-slate-600">
          Notes
          <textarea rows={2} value={form.notes ?? ''} onChange={(e) => setForm({ ...form, notes: e.target.value })} className="mt-1 w-full rounded-md border border-slate-300 px-2 py-1.5 text-sm font-normal text-slate-900" />
        </label>
        <div className="flex items-center gap-3">
          <Btn onClick={onSubmit} disabled={!valid}>Submit request</Btn>
          {!valid && <span className="text-xs text-slate-500">{missing} required field{missing === 1 ? '' : 's'} left. Required fields keep requests from arriving half-baked.</span>}
        </div>
      </div>
    );
  }

  const accepted = phase === 'accepted';
  return (
    <div className="space-y-3 p-4">
      <div className="rounded-lg border border-violet-200 bg-violet-50 p-3">
        <div className="text-xs font-semibold text-violet-700">REQUEST #TS27-0418</div>
        <div className="font-bold">{form.title}</div>
        <div className="mt-1 text-sm text-slate-600">{form.goal}</div>
      </div>
      <dl className="grid grid-cols-2 gap-2 text-sm">
        <div><dt className="inline text-slate-500">Routed to: </dt><dd className="inline font-bold">Seasonal Campaigns</dd></div>
        <div><dt className="inline text-slate-500">Owner: </dt><dd className="inline font-bold">Maya</dd></div>
        <div>
          <dt className="inline text-slate-500">Status: </dt>
          <dd className="inline">{accepted ? <Pill cls="bg-green-100 text-green-800">Accepted</Pill> : <Pill cls="bg-amber-100 text-amber-800">New</Pill>}</dd>
        </div>
        <div>
          <dt className="inline text-slate-500">Priority: </dt>
          <dd className="inline">{accepted ? <Pill cls="bg-red-100 text-red-700">High</Pill> : '—'}</dd>
        </div>
        <div className="col-span-2"><dt className="inline text-slate-500">Legal review: </dt><dd className="inline font-semibold text-red-700">{form.legal}</dd></div>
      </dl>
      <div className="flex items-center gap-3">
        {!accepted && <Btn onClick={onAccept}>Accept and set priority High</Btn>}
        {accepted && <span className="text-sm text-green-800">✓ Routed automatically, no inbox forwarding. Timestamped for the audit trail.</span>}
        <button type="button" onClick={onReset} className="ml-auto text-xs text-slate-500 underline hover:text-slate-800">Reset scene</button>
      </div>
    </div>
  );
}

/* ---------------------------- Mark ---------------------------- */

/* ---------------------------- page ---------------------------- */
export default function Scene3() {
  const [form, setForm] = useState(BLANK);
  const [phase, setPhase] = useState('form'); // form | routed | accepted
  const [stamps, setStamps] = useState({});
  const [markKey, setMarkKey] = useState(0);

  const stamp = (k) => setStamps((s) => (s[k] ? s : { ...s, [k]: true }));
  const reset = () => { setForm(BLANK); setPhase('form'); setStamps({}); setMarkKey((n) => n + 1); };

  return (
    <main className="min-h-screen" style={{ background: C.sand, fontFamily: 'Graphik, Inter, ui-sans-serif, system-ui, sans-serif', color: '#262626' }}>
      <header style={{ background: C.dark }} className="px-6 py-6 text-white">
        <div className="mx-auto max-w-6xl">
          <div className="flex flex-wrap gap-2 text-xs font-semibold">
            {['Scene 3', '08:00–13:00', 'Act 1 · Plan & produce', 'RFP 4.17–4.19', 'Maya'].map((c) => (
              <span key={c} className="rounded-full bg-white/10 px-2.5 py-0.5">{c}</span>
            ))}
          </div>
          <h1 className="mt-3 text-2xl font-bold">Act 1: from request to brief</h1>
          <p className="mt-1 max-w-3xl text-sm text-white/80">
            Structured intake with automatic routing, then Mark drafts the brief, so nothing arrives half-baked and Maya never starts from a blank page.
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-6xl space-y-4 px-6 py-6">
        <ol className="flex flex-wrap items-center gap-2 text-xs font-semibold">
          {[['1 · Request', 'form'], ['2 · Routed', 'routed'], ['3 · Accepted', 'accepted'], ['4 · Brief', 'brief']].map(([label, key], i) => {
            const reached = key === 'brief' ? stamps.brief : ['form', 'routed', 'accepted'].indexOf(phase) >= ['form', 'routed', 'accepted'].indexOf(key);
            return (
              <li key={key} className="flex items-center gap-2">
                {i > 0 && <span className="text-slate-300">→</span>}
                <span className={`rounded-full px-3 py-1 ${reached ? 'bg-green-700 text-white' : 'bg-white text-slate-400'}`}>{label}</span>
              </li>
            );
          })}
        </ol>

        <div className="grid gap-4 xl:grid-cols-2">
          <Frame url="cmp.optimizely.com/requests" label="CMP · Requests" accent="bg-violet-50">
            <RequestPanel
              form={form}
              setForm={setForm}
              phase={phase}
              onSubmit={() => { setPhase('routed'); stamp('req'); }}
              onAccept={() => { setPhase('accepted'); stamp('accepted'); }}
              onReset={reset}
            />
          </Frame>
          <Frame url="mark.optimizely.com" label="Mark" accent="bg-indigo-50">
            <MarkPanel key={markKey} enabled={phase === 'accepted'} onDone={() => stamp('brief')} />
          </Frame>
        </div>

        <section className="rounded-xl border border-slate-200 bg-white p-4">
          <h2 className="text-xs font-bold uppercase tracking-wide text-slate-500">Demo clock</h2>
          <ul className="mt-2 grid gap-2 sm:grid-cols-3">
            {TIMELINE.map(([k, t, label]) => (
              <li key={k} className={`rounded-lg border px-3 py-2 text-sm ${stamps[k] ? 'border-green-300 bg-green-50' : 'border-slate-200 text-slate-400'}`}>
                <div className="font-mono text-xs font-bold">{stamps[k] ? t : '—'}</div>
                {label}
              </li>
            ))}
          </ul>
          {stamps.brief && (
            <p className="mt-3 text-sm text-green-800">
              Request to brief in about four minutes, routed and on the record: intake, routing and governance (4.17 and 4.18).
            </p>
          )}
          <p className="mt-3 text-xs text-slate-500">
            If Mark takes more than about 20 seconds, open the brief you ran this morning with the same prompt. Transition: “Now the step that slows every tax company down in April: compliance.”
          </p>
        </section>
      </div>
    </main>
  );
}
