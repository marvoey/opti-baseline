'use client';

import React, { useEffect, useState } from 'react';

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

/* C2 · Mark prompt (@campaign_brief_generation) */
const C2 = [
  ['Campaign type', 'Late-season conversion campaign: "Still time to file - get expert help" (H&R Block demo, synthetic)'],
  ['Target Audience', 'DIY filers who started a return but did not finish; returning assisted clients with no appointment yet; late filers worried about the deadline; Spanish-preferred clients'],
  ['Objective of campaign', 'Increase tax-pro appointments booked before the filing deadline; secondary: DIY starts from late filers'],
  ['Assets needed for campaign', 'Landing page hero (EN + ES), three persona hero variations, appointment CTA, office cards, approved compliance disclosure. Flag every claim that needs Legal review.'],
];

const BRIEF = {
  title: 'Campaign brief: "Still time to file – get expert help"',
  sections: [
    ['Objective', ['Increase tax-pro appointments booked before the filing deadline.', 'Secondary: DIY starts from late filers.']],
    ['Audiences', ['DIY filers who started a return but did not finish', 'Returning assisted clients with no appointment yet', 'Late filers worried about the deadline', 'Spanish-preferred clients']],
    ['Key message', ["There's still time, and an expert can help you finish."]],
    ['Deliverables', ['Landing page hero (EN + ES)', '3 persona variations', 'Appointment CTA', 'Office cards', 'Approved disclosure TS27-LATE-01']],
  ],
  legal: [
    ['"Free" help claims', 'Any wording implying free help needs Legal sign-off.'],
    ['Refund timing language', 'Refund speed statements need Legal sign-off.'],
    ['Deadline statements', 'Deadline and extension wording must match approved copy.'],
  ],
};
const MARK_STEPS = ['Reading the request', 'Matching campaign type', 'Drafting sections', 'Flagging claims for Legal'];

const TIMELINE = [
  ['req', 'Tue 9:02', 'Request submitted'],
  ['accepted', 'Tue 9:04', 'Accepted by Maya, priority High'],
  ['brief', 'Tue 9:06', 'Brief drafted by Mark'],
];

/* ---------------------------- helpers ---------------------------- */
const Btn = ({ children, onClick, kind = 'primary', disabled }) => {
  const k = {
    primary: 'bg-green-700 text-white hover:bg-green-800',
    ghost: 'bg-white text-slate-700 border border-slate-300 hover:bg-slate-50',
    paste: 'bg-amber-50 text-amber-800 border border-amber-300 hover:bg-amber-100',
    mark: 'bg-indigo-600 text-white hover:bg-indigo-700',
  }[kind];
  return (
    <button type="button" onClick={onClick} disabled={disabled} className={`rounded-lg px-3 py-1.5 text-sm font-semibold transition disabled:cursor-not-allowed disabled:opacity-40 ${k}`}>
      {children}
    </button>
  );
};

const Pill = ({ children, cls }) => <span className={`inline-block rounded-full px-2.5 py-0.5 text-xs font-semibold ${cls}`}>{children}</span>;

function Frame({ url, label, accent, children }) {
  return (
    <div className="overflow-hidden rounded-xl border border-slate-200 bg-white shadow-sm">
      <div className={`flex items-center gap-2 border-b border-slate-200 px-3 py-2 ${accent}`}>
        <span className="h-2.5 w-2.5 rounded-full bg-red-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-amber-400" />
        <span className="h-2.5 w-2.5 rounded-full bg-green-400" />
        <div className="ml-2 flex-1 truncate rounded bg-white px-2 py-0.5 text-xs text-slate-500">{url}</div>
        <span className="text-xs font-semibold text-slate-600">{label}</span>
      </div>
      {children}
    </div>
  );
}

/* Reveals `count` items one at a time while `run` is true; returns how many are visible. */
function useReveal(count, run, ms = 450) {
  const [n, setN] = useState(0);
  // `run` only goes false -> true per mount (Reset remounts via key), so no reset is needed.
  useEffect(() => {
    if (!run) return undefined;
    const id = setInterval(() => setN((v) => (v >= count ? v : v + 1)), ms);
    return () => clearInterval(id);
  }, [run, count, ms]);
  return run ? n : 0;
}

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
function MarkPanel({ enabled, onDone }) {
  const [run, setRun] = useState(false);
  const [instant, setInstant] = useState(false); // pre-generated brief (A15): skip the animation
  const sectionCount = BRIEF.sections.length + 1;
  const stepRaw = useReveal(MARK_STEPS.length, run && !instant, 600);
  const generating = run && !instant && stepRaw < MARK_STEPS.length;
  const step = stepRaw;
  const shownRaw = useReveal(sectionCount, run && !generating && !instant, 500);
  const shown = instant ? sectionCount : shownRaw;
  const done = run && !generating && shown >= sectionCount;

  useEffect(() => { if (done) onDone(); }, [done, onDone]);

  return (
    <div className="space-y-3 p-4">
      <div className="rounded-lg bg-slate-100 p-3 font-mono text-xs leading-relaxed text-slate-700">
        <div className="font-bold text-indigo-700">@campaign_brief_generation</div>
        {C2.map(([k, v]) => (
          <div key={k}><span className="font-semibold">{k}</span> - {v}</div>
        ))}
      </div>
      <div className="flex flex-wrap items-center gap-3">
        <Btn kind="mark" onClick={() => setRun(true)} disabled={!enabled || run}>Paste C2 &amp; send</Btn>
        {!enabled && <span className="text-xs text-slate-500">Accept the request first.</span>}
        {enabled && !done && <Btn kind="ghost" onClick={() => { setRun(true); setInstant(true); }}>Open pre-generated brief (A15)</Btn>}
      </div>

      {generating && (
        <ul className="space-y-1 text-sm text-slate-600" aria-live="polite">
          {MARK_STEPS.map((s, i) => (
            <li key={s} className={i < step ? 'text-green-700' : i === step ? 'font-semibold text-indigo-700' : 'text-slate-300'}>
              {i < step ? '✓' : i === step ? '…' : '○'} {s}
            </li>
          ))}
        </ul>
      )}

      {run && !generating && (
        <article className="max-h-[32rem] space-y-3 overflow-auto rounded-lg border border-indigo-100 bg-white p-4 text-sm text-slate-800">
          <h2 className="text-base font-bold">{BRIEF.title}</h2>
          {BRIEF.sections.slice(0, shown).map(([h, items]) => (
            <section key={h}>
              <h3 className="text-xs font-bold uppercase tracking-wide text-slate-500">{h}</h3>
              {items.length === 1 ? <p>{items[0]}</p> : <ul className="list-disc pl-5">{items.map((i) => <li key={i}>{i}</li>)}</ul>}
            </section>
          ))}
          {shown >= sectionCount && (
            <section className="rounded-lg border border-red-200 bg-red-50 p-3" id="legal-flags">
              <h3 className="text-xs font-bold uppercase tracking-wide text-red-700">⚠ Needs Legal review</h3>
              <ul className="mt-1 space-y-1">
                {BRIEF.legal.map(([claim, why]) => (
                  <li key={claim}><b className="text-red-800">{claim}</b> <span className="text-slate-600">· {why}</span></li>
                ))}
              </ul>
            </section>
          )}
        </article>
      )}
    </div>
  );
}

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
