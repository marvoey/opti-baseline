'use client';

import type { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MonitorPlay } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { LAYERS, PRESENTER_PATH, PILOT_EMPLOYER, STEPS } from '../_data/layers';
import { usePresentation } from '../_lib/presentation';
import { PilotToggle } from './PilotToggle';

const STEP_LABELS = ['Overview', ...LAYERS.map((l) => `Layer ${l.n}`)];

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { step, openPresenter } = usePresentation();

  // Presenter window renders bare; it has its own chrome.
  if (pathname.startsWith(PRESENTER_PATH)) {
    return <div className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">{children}</div>;
  }

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans antialiased selection:bg-teal-500 selection:text-white flex flex-col">
      <header className="w-full max-w-6xl mx-auto mb-8 border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Target Milestone: Oct 15 Scoping
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Pilot Scale: 2-3 Employers (100–600 Lives)
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3 flex-wrap">
            <span>Center for Care Optimization (CCO)</span>
            <span className="text-slate-600 font-normal">|</span>
            <Link href={STEPS[0]} className="text-teal-400 text-xl font-medium hover:text-teal-300">
              3-Tier Solution Blueprint
            </Link>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Decoupling Clinical Governance &amp; Multi-Tenant Co-Branding from Agency Frontend Delivery
          </p>
        </div>
        <PilotToggle employer={PILOT_EMPLOYER} />
      </header>

      <main className="w-full max-w-6xl mx-auto flex-1">{children}</main>

      <nav className="w-full max-w-6xl mx-auto mt-8 flex items-center justify-between gap-4 border-t border-slate-800 pt-4 text-xs">
        <Link
          href={STEPS[Math.max(step - 1, 0)]}
          aria-disabled={step === 0}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white ${step === 0 ? 'invisible' : ''}`}
        >
          <ChevronLeft className="w-4 h-4" /> {STEP_LABELS[step - 1]}
        </Link>

        <div className="flex items-center gap-2">
          {STEPS.map((href, i) => (
            <Link
              key={href}
              href={href}
              aria-label={STEP_LABELS[i]}
              aria-current={i === step ? 'page' : undefined}
              className={`h-2 rounded-full transition-all ${i === step ? 'w-8 bg-teal-400' : 'w-2 bg-slate-700 hover:bg-slate-500'}`}
            />
          ))}
          <button
            onClick={openPresenter}
            className="ml-4 flex items-center gap-1.5 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-400 hover:text-white"
            title="Open presenter window (P)"
          >
            <MonitorPlay className="w-4 h-4 text-teal-400" /> Presenter
          </button>
        </div>

        <Link
          href={STEPS[Math.min(step + 1, STEPS.length - 1)]}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-lg border border-slate-800 bg-slate-900 text-slate-300 hover:text-white ${step === STEPS.length - 1 ? 'invisible' : ''}`}
        >
          {STEP_LABELS[step + 1]} <ChevronRight className="w-4 h-4" />
        </Link>
      </nav>
    </div>
  );
}
