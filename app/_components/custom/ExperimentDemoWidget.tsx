'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  FlaskConical, BarChart2, ChevronRight, X,
  TrendingUp, TrendingDown, Users, RefreshCw,
} from 'lucide-react';

export type VariantBlock = {
  label: string;
  headline: string;
  subheadline: string;
  ctaLabel: string;
  heroImageUrl?: string | null;
  weight: number;
};

export type ExperimentDemoProps = {
  experimentName: string;
  hypothesis: string;
  control: VariantBlock;
  variantA: VariantBlock;
  variantB: VariantBlock;
};

type VariantKey = 'control' | 'variantA' | 'variantB';
type VariantMetrics = { visitors: number; conversions: number };
type Metrics = Record<VariantKey, VariantMetrics>;

const INITIAL_METRICS: Metrics = {
  control:  { visitors: 423, conversions: 13 },
  variantA: { visitors: 289, conversions: 13 },
  variantB: { visitors: 188, conversions:  5 },
};

const CVR_TARGETS: Record<VariantKey, number> = {
  control:  0.031,
  variantA: 0.045,
  variantB: 0.026,
};

const VARIANT_META: Record<VariantKey, { bg: string; overlay: string; badgeBg: string; ringColor: string; textColor: string; barColor: string }> = {
  control:  { bg: 'bg-[#002855]',   overlay: 'bg-[#002855]/70',   badgeBg: 'bg-blue-600',    ringColor: 'ring-blue-500',    textColor: 'text-blue-600',    barColor: 'bg-blue-600'    },
  variantA: { bg: 'bg-emerald-800', overlay: 'bg-emerald-950/70', badgeBg: 'bg-emerald-600', ringColor: 'ring-emerald-500', textColor: 'text-emerald-600', barColor: 'bg-emerald-500' },
  variantB: { bg: 'bg-orange-800',  overlay: 'bg-orange-950/70',  badgeBg: 'bg-orange-600',  ringColor: 'ring-orange-500',  textColor: 'text-orange-600',  barColor: 'bg-orange-500'  },
};

function cvr(m: VariantMetrics) {
  return m.visitors === 0 ? 0 : (m.conversions / m.visitors) * 100;
}

function lift(base: VariantMetrics, variant: VariantMetrics) {
  const b = cvr(base);
  if (b === 0) return 0;
  return ((cvr(variant) - b) / b) * 100;
}

export default function ExperimentDemoWidget({
  experimentName, hypothesis, control, variantA, variantB,
}: ExperimentDemoProps) {
  const [activeTab, setActiveTab]         = useState<'config' | 'results'>('config');
  const [isTrayOpen, setIsTrayOpen]       = useState(false);
  const [activeVariant, setActiveVariant] = useState<VariantKey>('control');
  const [metrics, setMetrics]             = useState<Metrics>(INITIAL_METRICS);
  const [totalSims, setTotalSims]         = useState(0);

  const variants: Record<VariantKey, VariantBlock> = { control, variantA, variantB };
  const totalWeight = control.weight + variantA.weight + variantB.weight || 100;
  const weights: Record<VariantKey, number> = {
    control:  (control.weight  / totalWeight) * 100,
    variantA: (variantA.weight / totalWeight) * 100,
    variantB: (variantB.weight / totalWeight) * 100,
  };

  function simulateVisitor() {
    const roll = Math.random() * 100;
    let v: VariantKey;
    if (roll < weights.control) v = 'control';
    else if (roll < weights.control + weights.variantA) v = 'variantA';
    else v = 'variantB';

    setActiveVariant(v);
    setTotalSims(n => n + 1);

    const converted = Math.random() < CVR_TARGETS[v];
    setMetrics(prev => ({
      ...prev,
      [v]: {
        visitors:    prev[v].visitors + 1,
        conversions: prev[v].conversions + (converted ? 1 : 0),
      },
    }));
  }

  const active = variants[activeVariant];
  const meta   = VARIANT_META[activeVariant];

  // Determine winning variant (excluding control) for the results tab
  const winnerKey = (['variantA', 'variantB'] as VariantKey[]).reduce<VariantKey | null>((best, k) => {
    const l = lift(metrics.control, metrics[k]);
    const bestL = best ? lift(metrics.control, metrics[best]) : -Infinity;
    return l > bestL ? k : best;
  }, null);

  return (
    <div className="relative h-[680px] w-full overflow-hidden rounded-xl border border-gray-200 shadow-lg font-sans bg-slate-200">

      {/* ── Slide-out tray ── */}
      <div className={`absolute left-0 top-0 bottom-0 z-20 w-80 bg-slate-50 border-r border-slate-200 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isTrayOpen ? 'translate-x-0' : '-translate-x-full'}`}>

        {/* Tray header */}
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <FlaskConical size={15} className="text-[#0037FF]" />
            <span className="font-semibold tracking-wide text-xs">WEB EXPERIMENTATION</span>
          </div>
          <button onClick={() => setIsTrayOpen(false)} className="text-white/50 hover:text-white transition-colors" aria-label="Close panel">
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-white shrink-0 text-xs">
          {([['config', FlaskConical, 'Experiment'], ['results', BarChart2, 'Results']] as const).map(([id, Icon, label]) => (
            <button
              key={id}
              onClick={() => setActiveTab(id)}
              className={`flex-1 py-2.5 flex items-center justify-center gap-1.5 font-medium transition-colors ${activeTab === id ? 'border-b-2 border-[#0037FF] text-[#0037FF] bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
            >
              <Icon size={13} /> {label}
            </button>
          ))}
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-4">

          {/* Config tab */}
          {activeTab === 'config' && (
            <>
              <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm space-y-3">
                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-semibold mb-0.5">Experiment</p>
                  <p className="text-[12px] font-bold text-slate-800">{experimentName}</p>
                </div>
                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-semibold mb-0.5">Hypothesis</p>
                  <p className="text-[11px] text-slate-600 italic">{hypothesis}</p>
                </div>
              </div>

              <div className="space-y-2">
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Traffic Distribution</p>

                {(['control', 'variantA', 'variantB'] as VariantKey[]).map(k => {
                  const v = variants[k];
                  const vm = VARIANT_META[k];
                  const isActive = activeVariant === k;
                  return (
                    <div key={k} className={`p-3 rounded-lg border transition-all ${isActive ? `bg-white ring-2 ${vm.ringColor} border-transparent` : 'border-slate-200 bg-white'}`}>
                      <div className="flex items-center justify-between mb-1.5">
                        <span className="text-[11px] font-bold text-slate-700">{v.label}</span>
                        <div className="flex items-center gap-1.5">
                          {isActive && <span className={`text-[9px] ${vm.badgeBg} text-white px-2 py-0.5 rounded-full font-bold`}>VIEWING</span>}
                          <span className={`text-[11px] font-bold ${vm.textColor}`}>{Math.round(weights[k])}%</span>
                        </div>
                      </div>
                      <div className="h-2 bg-slate-100 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${vm.barColor}`} style={{ width: `${weights[k]}%` }} />
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex gap-2 text-[11px] text-blue-800">
                <Users className="shrink-0 text-blue-600 mt-0.5" size={15} />
                <p>Visitors are bucketed deterministically on first visit. The <strong>Simulate Visitor</strong> button randomly assigns a variant based on the traffic split above.</p>
              </div>
            </>
          )}

          {/* Results tab */}
          {activeTab === 'results' && (
            <>
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg flex gap-2 text-[11px] text-indigo-800">
                <BarChart2 className="shrink-0 text-indigo-600 mt-0.5" size={15} />
                <p><strong>{totalSims} visitors simulated.</strong> Conversion rates update live as you run the experiment.</p>
              </div>

              <div className="space-y-2">
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Live Results</p>

                {(['control', 'variantA', 'variantB'] as VariantKey[]).map(k => {
                  const v = variants[k];
                  const vm = VARIANT_META[k];
                  const m = metrics[k];
                  const rate = cvr(m);
                  const l = k === 'control' ? null : lift(metrics.control, m);
                  const isWinner = k !== 'control' && k === winnerKey && (l ?? 0) > 0;

                  return (
                    <div key={k} className={`p-3 rounded-lg border bg-white ${activeVariant === k ? `ring-2 ${vm.ringColor} border-transparent` : 'border-slate-200'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-[11px] font-bold text-slate-700">{v.label}</span>
                        {isWinner && (
                          <span className="text-[9px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">WINNING</span>
                        )}
                      </div>
                      <div className="grid grid-cols-3 gap-2 text-center">
                        <div>
                          <p className="text-[9px] text-slate-400 mb-0.5">Visitors</p>
                          <p className="text-[13px] font-bold text-slate-700">{m.visitors.toLocaleString()}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400 mb-0.5">Conv.</p>
                          <p className="text-[13px] font-bold text-slate-700">{m.conversions}</p>
                        </div>
                        <div>
                          <p className="text-[9px] text-slate-400 mb-0.5">CVR</p>
                          <p className={`text-[13px] font-bold ${vm.textColor}`}>{rate.toFixed(1)}%</p>
                        </div>
                      </div>
                      {l !== null && (
                        <div className={`mt-2 flex items-center gap-1 text-[10px] font-semibold ${l >= 0 ? 'text-emerald-600' : 'text-red-500'}`}>
                          {l >= 0 ? <TrendingUp size={11} /> : <TrendingDown size={11} />}
                          {l >= 0 ? '+' : ''}{l.toFixed(1)}% vs Control
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Tray toggle tab ── */}
      <button
        onClick={() => setIsTrayOpen(true)}
        aria-label="Open experiment panel"
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 transition-all duration-300 ${isTrayOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <div className="bg-slate-900 text-white pl-1.5 pr-2 py-5 rounded-r-lg flex flex-col items-center gap-2 shadow-xl hover:bg-slate-800 transition-colors">
          <FlaskConical size={13} className="text-[#0037FF]" />
          <span className="text-[9px] font-bold tracking-widest uppercase text-white/80" style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}>
            EXPERIMENT
          </span>
        </div>
      </button>

      {/* ── Main content: simulated browser ── */}
      <div className="flex flex-col h-full">

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-slate-100 flex flex-col min-h-full relative">

            {/* Simulated ESL nav */}
            <header className="bg-white border-b border-slate-100 py-3 px-5 flex justify-between items-center shadow-sm shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/esl-logo.png" alt="ESL" className="h-7 w-auto" />
              <nav className="flex gap-4 text-[11px] font-semibold text-slate-600">
                {['Home', 'Mortgages', 'Savings', 'Wealth'].map(l => (
                  <span key={l} className={l === 'Home' ? 'text-blue-700' : ''}>{l}</span>
                ))}
              </nav>
            </header>

            <main className="flex-1 flex flex-col">
              {/* Dynamic hero */}
              <div className={`relative py-16 px-8 text-center text-white transition-all duration-500 overflow-hidden ${!active.heroImageUrl ? meta.bg : ''}`}>
                {active.heroImageUrl && (
                  <>
                    <Image src={active.heroImageUrl} alt="" fill className="object-cover" />
                    <div className={`absolute inset-0 ${meta.overlay}`} />
                  </>
                )}
                <div className="relative z-10">
                  <span className={`inline-flex items-center gap-1.5 ${meta.badgeBg} px-3 py-1 rounded-full text-[10px] font-bold mb-4`}>
                    <FlaskConical size={10} /> {active.label}
                  </span>
                  <h2 className="text-2xl font-extrabold leading-tight mb-2 max-w-lg mx-auto">{active.headline}</h2>
                  <p className="text-sm mb-6 opacity-90 max-w-md mx-auto">{active.subheadline}</p>
                  <button className="inline-flex items-center gap-1.5 px-7 py-3 rounded-full font-bold text-sm bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow">
                    {active.ctaLabel} <ChevronRight size={14} />
                  </button>
                </div>
              </div>

              {/* Simulate controls */}
              <div className="p-8 flex-1 bg-slate-50 flex flex-col items-center justify-center gap-5">
                <div className="text-center">
                  <p className="text-xs font-semibold text-slate-500 mb-1">Currently showing</p>
                  <span className={`inline-flex items-center gap-1.5 ${meta.badgeBg} text-white px-4 py-1.5 rounded-full text-sm font-bold`}>
                    {active.label}
                  </span>
                </div>

                <button
                  onClick={simulateVisitor}
                  className="inline-flex items-center gap-2 px-6 py-3 bg-slate-800 text-white rounded-full font-semibold text-sm hover:bg-slate-700 transition-colors shadow-md"
                >
                  <RefreshCw size={14} /> Simulate Next Visitor
                </button>

                <div className="flex gap-4 text-center">
                  {(['control', 'variantA', 'variantB'] as VariantKey[]).map(k => {
                    const vm = VARIANT_META[k];
                    const m = metrics[k];
                    return (
                      <div key={k} className={`px-4 py-3 rounded-xl border bg-white ${activeVariant === k ? `ring-2 ${vm.ringColor} border-transparent shadow-sm` : 'border-slate-200'}`}>
                        <p className={`text-[10px] font-bold ${vm.textColor} mb-0.5`}>{variants[k].label}</p>
                        <p className="text-xs font-semibold text-slate-700">{m.visitors.toLocaleString()} visitors</p>
                        <p className="text-[10px] text-slate-400">{cvr(m).toFixed(1)}% CVR</p>
                      </div>
                    );
                  })}
                </div>

                <p className="text-[10px] text-slate-400">Open the panel to see the full experiment config and live results.</p>
              </div>
            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
