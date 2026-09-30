'use client';

import { useEffect, useState } from 'react';
import { CheckCircle2, ChevronLeft, ChevronRight, Info, Pause, Play, RotateCcw } from 'lucide-react';
import { HANDOFF, LAYERS, OVERVIEW_TALK, STEPS, VALUE_POINTS } from '../_data/layers';
import { usePresentation } from '../_lib/presentation';

const fmt = (s: number) =>
  `${String(Math.floor(s / 60)).padStart(2, '0')}:${String(s % 60).padStart(2, '0')}`;

export default function PresenterPage() {
  const { step, goTo } = usePresentation();
  const [secs, setSecs] = useState(0);
  const [running, setRunning] = useState(false);

  useEffect(() => {
    if (!running) return;
    const id = setInterval(() => setSecs((s) => s + 1), 1000);
    return () => clearInterval(id);
  }, [running]);

  const layer = step > 0 ? LAYERS[step - 1] : null;
  const next = step < STEPS.length - 1 ? (LAYERS[step]?.title ?? '') : null;
  const isLast = step === STEPS.length - 1;

  return (
    <div className="p-5 space-y-4 max-w-xl mx-auto">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider">
          <Info className="w-4 h-4" />
          <span>Marvin&apos;s Architectural Talk Track</span>
        </div>
        <div className="flex items-center gap-2 font-mono text-sm bg-slate-900 border border-slate-800 rounded-lg px-2 py-1">
          <span className="tabular-nums text-white">{fmt(secs)}</span>
          <button onClick={() => setRunning((r) => !r)} aria-label={running ? 'Pause timer' : 'Start timer'} className="text-slate-400 hover:text-white">
            {running ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>
          <button onClick={() => { setSecs(0); setRunning(false); }} aria-label="Reset timer" className="text-slate-400 hover:text-white">
            <RotateCcw className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl space-y-3">
        <div className="text-xs text-slate-500">
          Step {step + 1} of {STEPS.length} · {layer ? `Layer ${layer.n}` : 'Overview'}
        </div>
        <h3 className="text-lg font-bold text-white">{layer ? layer.talk.focus : OVERVIEW_TALK.title}</h3>
        {(layer ? layer.talk.paras : OVERVIEW_TALK.paras).map((p) => (
          <p key={p} className="text-base text-slate-300 leading-relaxed">{p}</p>
        ))}
        {layer && (
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-800 mt-2">
            <div className={`text-xs font-semibold mb-1 ${layer.accent.probe}`}>{layer.talk.probeLabel}</div>
            <div className="text-base text-slate-300 italic">{layer.talk.probe}</div>
          </div>
        )}
      </div>

      <div className="flex items-center justify-between gap-3">
        <button
          onClick={() => goTo(step - 1)}
          disabled={step === 0}
          className="flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-sm text-slate-300 hover:text-white disabled:opacity-30"
        >
          <ChevronLeft className="w-4 h-4" /> Prev
        </button>
        <div className="text-xs text-slate-500 text-center flex-1">
          {next ? <>Next up: <span className="text-slate-300">{next}</span></> : 'Last step'}
        </div>
        <button
          onClick={() => goTo(step + 1)}
          disabled={isLast}
          className="flex items-center gap-1 px-3 py-2 rounded-lg border border-slate-800 bg-slate-900 text-sm text-slate-300 hover:text-white disabled:opacity-30"
        >
          Next <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5">
        <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-teal-400" />
          <span>Why This Secures Phase 1 (Oct 15)</span>
        </h3>
        <ul className="space-y-2.5 text-sm text-slate-400">
          {VALUE_POINTS.map(([head, body]) => (
            <li key={head} className="flex items-start gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-2 shrink-0" />
              <span><strong className="text-slate-200">{head}</strong> {body}</span>
            </li>
          ))}
        </ul>
      </div>

      {isLast && (
        <div className="bg-gradient-to-r from-slate-900 to-slate-950 border border-slate-800 rounded-xl p-4 text-sm">
          <div className="font-semibold text-white">{HANDOFF.title}</div>
          <div className="text-slate-400 italic mt-1">{HANDOFF.quote}</div>
          <div className="text-slate-500 font-mono text-xs mt-2">{HANDOFF.next}</div>
        </div>
      )}
    </div>
  );
}
