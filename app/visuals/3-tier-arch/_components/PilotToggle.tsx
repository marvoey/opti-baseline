'use client';

import { usePresentation } from '../_lib/presentation';

export function PilotToggle({ employer }: { employer: string }) {
  const { persona, setPersona } = usePresentation();
  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
      <div className="text-xs">
        <div className="text-slate-400 font-medium">Simulated Pilot Client:</div>
        <div className="font-semibold text-white">{employer}</div>
      </div>
      <div className="h-6 w-px bg-slate-800" />
      <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
        {(['female', 'male'] as const).map((p) => (
          <button
            key={p}
            onClick={() => setPersona(p)}
            className={`px-2.5 py-1 rounded transition-all font-medium ${
              persona === p ? 'bg-teal-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-white'
            }`}
          >
            {p === 'female' ? 'Female Cohort' : 'Male Cohort'}
          </button>
        ))}
      </div>
    </div>
  );
}
