'use client';

import { useState } from 'react';
import type { AuditRisk, AuditRow } from './auditDefaults';

type EditAttrs = Record<string, string | undefined>;

type Props = {
  title: string;
  description: string;
  rows: AuditRow[];
  /** `pa()` attributes computed on the server so on-page editing overlays attach. */
  edit: { title: EditAttrs; description: EditAttrs; rowProposed: EditAttrs[] };
};

const RISK_STYLES: Record<AuditRisk, string> = {
  High: 'bg-rose-100 text-rose-800 border-rose-200',
  Medium: 'bg-amber-100 text-amber-800 border-amber-200',
  Low: 'bg-emerald-100 text-emerald-800 border-emerald-200',
};

export default function TaxRuleAuditClient({ title, description, rows, edit }: Props) {
  // Demo state: scan → report → editor approves each row (Approve & Push to CMS).
  const [phase, setPhase] = useState<'idle' | 'scanning' | 'report'>('idle');
  const [pushed, setPushed] = useState<ReadonlySet<number>>(new Set());

  const approvable = rows.map((r, i) => (r.action === 'Approve Update' ? i : -1)).filter((i) => i >= 0);
  const pending = approvable.filter((i) => !pushed.has(i)).length;
  const needsReview = rows.length - approvable.length;

  const runAudit = () => {
    setPhase('scanning');
    setTimeout(() => setPhase('report'), 800);
  };
  const approve = (i: number) => setPushed((prev) => new Set(prev).add(i));
  const approveAll = () => setPushed(new Set(approvable));
  const reset = () => {
    setPushed(new Set());
    setPhase('idle');
  };

  return (
    <div className="max-w-6xl mx-auto">
      {/* Header & Agent Trigger Demo Bar */}
      <div className="bg-jh-gold-light border-2 border-dashed border-jh-gold p-6 rounded-2xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex flex-wrap items-center gap-2">
            <span className="bg-jh-navy text-white text-xs font-bold px-2.5 py-1 rounded">
              🤖 Opal Content Audit Agent
            </span>
            <span className="text-xs font-bold text-amber-900">
              {phase === 'report'
                ? pending === 0
                  ? 'STATUS: All approved updates pushed to CMS'
                  : `STATUS: ${rows.length} blocks flagged — ${pending} awaiting editor approval`
                : phase === 'scanning'
                  ? 'STATUS: Scanning tax education and promo pages…'
                  : 'STATUS: Ready to audit for outdated 2025 parameters'}
            </span>
          </div>
          <h2 {...edit.title} className="text-xl font-bold text-jh-navy mt-2">
            {title}
          </h2>
          <p {...edit.description} className="text-xs text-slate-600 mt-1 max-w-2xl">
            {description}
          </p>
        </div>

        <div className="flex gap-2">
          {phase === 'report' && pending > 0 && (
            <button
              type="button"
              onClick={approveAll}
              className="px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-wider bg-emerald-500 text-slate-950 hover:bg-emerald-600 shadow-md"
            >
              Approve All ({pending})
            </button>
          )}
          {phase === 'report' ? (
            <button
              type="button"
              onClick={reset}
              className="px-4 py-3 rounded-lg font-bold text-xs uppercase tracking-wider bg-slate-700 text-white hover:bg-slate-800 shadow-md"
            >
              ↺ Reset
            </button>
          ) : (
            <button
              type="button"
              onClick={runAudit}
              disabled={phase === 'scanning'}
              className="px-5 py-3 rounded-lg font-bold text-xs uppercase tracking-wider bg-jh-red text-white hover:bg-jh-red-hover disabled:opacity-60 shadow-md"
            >
              {phase === 'scanning' ? 'Scanning…' : '⚡ Run Opal 2026 Tax Audit'}
            </button>
          )}
        </div>
      </div>

      {phase === 'report' && (
        <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
          <div className="hidden lg:grid grid-cols-12 gap-4 p-4 bg-slate-50 border-b border-slate-200 text-xs text-slate-500 font-medium">
            <span className="col-span-2">Page / Content Block</span>
            <span className="col-span-3">Current 2025 Copy (Outdated)</span>
            <span className="col-span-3">Proposed 2026 Update (IRS Compliant)</span>
            <span className="col-span-1">Risk</span>
            <span className="col-span-3 text-right">Editor Action</span>
          </div>

          <div className="divide-y divide-slate-100">
            {rows.map((row, i) => {
              const isPushed = pushed.has(i);
              const manual = row.action === 'Manual Review Needed';
              return (
                <div key={row.block} className="p-4 grid grid-cols-1 lg:grid-cols-12 gap-3 lg:gap-4 items-start">
                  <div className="lg:col-span-2 text-sm font-bold text-jh-navy">{row.block}</div>
                  <p className="lg:col-span-3 text-xs italic text-rose-700 line-through decoration-rose-300">
                    {row.current}
                  </p>
                  <p
                    {...edit.rowProposed[i]}
                    className={`lg:col-span-3 text-xs italic ${
                      isPushed ? 'text-emerald-800 font-semibold' : 'text-emerald-700'
                    }`}
                  >
                    {row.proposed}
                  </p>
                  <div className="lg:col-span-1">
                    <span className={`text-[11px] font-bold px-2 py-0.5 rounded-full border ${RISK_STYLES[row.risk]}`}>
                      {row.risk}
                    </span>
                  </div>
                  <div className="lg:col-span-3 lg:text-right">
                    {isPushed ? (
                      <span className="inline-block text-[11px] font-extrabold px-3 py-1.5 rounded-lg bg-emerald-100 text-emerald-900">
                        ✓ Published 2026
                      </span>
                    ) : manual ? (
                      <span className="inline-block text-[11px] font-bold px-3 py-1.5 rounded-lg bg-amber-100 text-amber-900">
                        Manual Review Needed
                      </span>
                    ) : (
                      <button
                        type="button"
                        onClick={() => approve(i)}
                        className="text-[11px] font-bold px-3 py-1.5 rounded-lg bg-jh-navy text-white hover:bg-jh-navy-dark"
                      >
                        Approve &amp; Push to CMS
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="p-3 bg-slate-50 border-t border-slate-200 text-[11px] text-slate-500">
            {rows.length} blocks flagged · {pending} pending approval
            {needsReview > 0 ? ` · ${needsReview} need manual review` : ''} · Editors approve every change before it
            publishes.
          </div>
        </div>
      )}
    </div>
  );
}
