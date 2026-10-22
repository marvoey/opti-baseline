'use client';

import { useState } from 'react';
import { AlertTriangle, Check, CheckCircle2, Clock, Lock, RefreshCw, Sparkles } from 'lucide-react';
import { INITIAL_TAX_RULES, type TaxRule } from './demoData';

type EditAttrs = Record<string, string | undefined>;

type Props = {
  title: string;
  description: string;
  edit: { title: EditAttrs; description: EditAttrs };
};

const applyProposal = (rule: TaxRule): TaxRule => ({
  ...rule,
  ...rule.proposed2026,
  auditStatus: 'Opal Verified 2026',
});

export default function TaxRuleAuditClient({ title, description, edit }: Props) {
  const [rules, setRules] = useState<TaxRule[]>(INITIAL_TAX_RULES);
  const [running, setRunning] = useState(false);
  const [audited, setAudited] = useState(false);

  const outdated = rules.filter((r) => r.taxYear === '2025').length;

  const runAudit = () => {
    setRunning(true);
    setTimeout(() => {
      setRunning(false);
      setAudited(true);
    }, 800);
  };

  const approveOne = (id: string) =>
    setRules((prev) => prev.map((r) => (r.id === id ? applyProposal(r) : r)));
  const approveAll = () => setRules((prev) => prev.map(applyProposal));
  const reset = () => {
    setRules(INITIAL_TAX_RULES);
    setAudited(false);
  };

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
        <div>
          <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-jh-navy bg-blue-100/80 px-3 py-1 rounded-full mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Opal Content Audit Agent</span>
          </div>
          <h2 {...edit.title} className="text-2xl sm:text-3xl font-extrabold text-jh-navy">
            {title}
          </h2>
          <p {...edit.description} className="text-sm text-slate-600 mt-1">
            {description}
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
          <div className="flex items-center gap-2 px-2 text-xs font-bold">
            {outdated > 0 ? (
              <>
                <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                <span className="text-slate-700">
                  <strong className="text-amber-700">{outdated} blocks</strong> still referencing{' '}
                  <span className="underline decoration-amber-500">2025 rules</span>
                </span>
              </>
            ) : (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span className="text-emerald-800">All {rules.length} blocks verified for 2026</span>
              </>
            )}
          </div>

          {outdated === 0 ? (
            <button
              type="button"
              onClick={reset}
              className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 cursor-pointer"
            >
              <RefreshCw className="w-3 h-3" />
              <span>Reset to 2025 State</span>
            </button>
          ) : audited ? (
            <button
              type="button"
              onClick={approveAll}
              className="bg-emerald-500 hover:bg-emerald-600 text-slate-950 text-xs font-extrabold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Approve and Publish All {outdated}</span>
            </button>
          ) : (
            <button
              type="button"
              onClick={runAudit}
              disabled={running}
              className="bg-jh-red hover:bg-jh-red-hover disabled:opacity-60 text-white text-xs font-bold px-3.5 py-2 rounded-lg flex items-center gap-1.5 cursor-pointer"
            >
              <Sparkles className={`w-3.5 h-3.5 ${running ? 'animate-spin' : ''}`} />
              <span>{running ? 'Scanning Optimizely Graph…' : 'Run Opal 2025 to 2026 Audit'}</span>
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {rules.map((rule) => {
          const isOutdated = rule.taxYear === '2025';
          return (
            <div
              key={rule.id}
              className={`bg-white rounded-2xl border-2 p-6 flex flex-col justify-between shadow-sm transition-all ${
                isOutdated ? 'border-amber-300/90' : 'border-emerald-500/80'
              }`}
            >
              <div>
                <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                  <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
                    {rule.category}
                  </span>
                  {isOutdated ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                      <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                      <span>Tax Year {rule.taxYear} (Outdated)</span>
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Tax Year {rule.taxYear} • Opal Verified</span>
                    </span>
                  )}
                </div>

                <h3 className="text-xl font-extrabold text-jh-navy mb-3">{rule.ruleTitle}</h3>

                <div
                  className={`rounded-xl p-4 mb-4 border ${
                    isOutdated ? 'bg-amber-50/60 border-amber-200' : 'bg-emerald-50/60 border-emerald-200'
                  }`}
                >
                  <div className="flex items-baseline justify-between">
                    <span className="text-xs uppercase font-bold text-slate-500">thresholdAmount</span>
                    <span className="text-[11px] font-mono text-slate-500">Prior: {rule.previousAmount}</span>
                  </div>
                  <div className="text-2xl font-black text-jh-navy mt-1">{rule.thresholdAmount}</div>

                  {audited && isOutdated && (
                    <div className="mt-3 pt-3 border-t border-amber-200/80 flex items-center justify-between gap-2 bg-indigo-50/90 px-3 py-2 rounded-lg border border-indigo-200">
                      <div>
                        <div className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 flex items-center gap-1">
                          <Sparkles className="w-3 h-3" />
                          <span>Opal proposed 2026 update</span>
                        </div>
                        <div className="text-sm font-black text-indigo-950">
                          {rule.proposed2026.thresholdAmount}
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() => approveOne(rule.id)}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg flex items-center gap-1 shrink-0 cursor-pointer"
                      >
                        <Check className="w-3.5 h-3.5" />
                        <span>Approve 2026</span>
                      </button>
                    </div>
                  )}
                </div>

                <p className="text-sm text-slate-700 leading-relaxed mb-4">{rule.ruleSummary}</p>
              </div>

              <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                <div className="flex items-center justify-between text-slate-600 font-medium">
                  <span className="flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5 text-jh-navy" />
                    <span>Filing deadline: </span>
                    <strong>{rule.effectiveDeadline}</strong>
                  </span>
                  <span className="font-mono text-[11px] text-slate-400">{rule.cmsPath}</span>
                </div>
                <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 text-[11px] text-slate-500 flex items-start gap-2">
                  <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                  <span>
                    <strong>Compliance guardrail:</strong> {rule.irsComplianceDisclaimer}
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
