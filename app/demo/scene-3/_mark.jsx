'use client';

import React, { useEffect, useState } from 'react';
import { Btn, useReveal } from './_shared';

/* Scene 3 · Mark: the C2 prompt and the generated brief. All content is SYNTHETIC. */

/* C2 · Mark prompt (@campaign_brief_generation) */
const C2 = [
  ['Campaign type', 'Late-season conversion campaign: "Still time to file - get expert help" (H&R Block demo, synthetic)'],
  ['Target Audience', 'DIY filers who started a return but did not finish; returning assisted clients with no appointment yet; late filers worried about the deadline; Spanish-preferred clients'],
  ['Objective of campaign', 'Increase tax-pro appointments booked before the filing deadline; secondary: DIY starts from late filers'],
  ['Assets needed for campaign', 'Landing page hero (EN + ES), three persona hero variations, appointment CTA, office cards, approved compliance disclosure. Flag every claim that needs Legal review.'],
];

/* The prompt as plain text (the demo plan's C2 clip), for the Copy button. */
const C2_TEXT = ['@campaign_brief_generation', ...C2.map(([k, v]) => `${k} - ${v}`)].join('\n');

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    // Clipboard API unavailable (insecure context or denied): fall back to a hidden textarea.
    const ta = document.createElement('textarea');
    ta.value = text;
    ta.style.cssText = 'position:fixed;opacity:0';
    document.body.appendChild(ta);
    ta.select();
    const ok = document.execCommand('copy');
    ta.remove();
    return ok;
  }
}

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

export function MarkPanel({ enabled = true, onDone }) {
  const [run, setRun] = useState(false);
  const [instant, setInstant] = useState(false); // pre-generated brief (A15): skip the animation
  const sectionCount = BRIEF.sections.length + 1;
  const stepRaw = useReveal(MARK_STEPS.length, run && !instant, 600);
  const generating = run && !instant && stepRaw < MARK_STEPS.length;
  const step = stepRaw;
  const shownRaw = useReveal(sectionCount, run && !generating && !instant, 500);
  const shown = instant ? sectionCount : shownRaw;
  const done = run && !generating && shown >= sectionCount;
  const [copied, setCopied] = useState('idle'); // idle | copied | failed

  const copy = async () => {
    setCopied((await copyText(C2_TEXT)) ? 'copied' : 'failed');
    setTimeout(() => setCopied('idle'), 1800);
  };

  useEffect(() => { if (done) onDone?.(); }, [done, onDone]);

  return (
    <div className="space-y-3 p-4">
      <div className="relative rounded-lg bg-slate-100 p-3 pr-20 font-mono text-xs leading-relaxed text-slate-700">
        <button
          type="button"
          onClick={copy}
          className="absolute right-2 top-2 rounded-md border border-slate-300 bg-white px-2 py-1 font-sans text-[11px] font-semibold text-slate-700 hover:bg-slate-50"
        >
          {copied === 'copied' ? '✓ Copied' : copied === 'failed' ? 'Copy failed' : 'Copy prompt'}
        </button>
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
