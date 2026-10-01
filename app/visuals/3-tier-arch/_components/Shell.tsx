'use client';

import type React from 'react';
import type { ReactNode } from 'react';
import Link from 'next/link';
import { ChevronLeft, ChevronRight, MonitorPlay } from 'lucide-react';
import { usePathname } from 'next/navigation';
import { LAYERS, PRESENTER_PATH, PILOT_EMPLOYER, STEPS } from '../_data/layers';
import { usePresentation } from '../_lib/presentation';
import { PilotToggle } from './PilotToggle';

// Tailwind v4 text-* utilities read these theme vars, so overriding them here scales
// every font size in this section by 1.71875x (default rem values x 1.25 x 1.25 x 1.1).
const FONT_SCALE = {
  '--text-xs': '1.2890625rem',
  '--text-sm': '1.50390625rem',
  '--text-base': '1.71875rem',
  '--text-lg': '1.93359375rem',
  '--text-xl': '2.1484375rem',
  '--text-2xl': '2.578125rem',
  '--text-3xl': '3.22265625rem',
} as React.CSSProperties;

const STEP_LABELS = ['Overview', ...LAYERS.map((l) => `Layer ${l.n}`)];

export function Shell({ children }: { children: ReactNode }) {
  const pathname = usePathname();
  const { step, openPresenter } = usePresentation();

  // Presenter window renders bare; it has its own chrome.
  if (pathname.startsWith(PRESENTER_PATH)) {
    return <div style={FONT_SCALE} className="min-h-screen bg-slate-950 text-slate-100 font-sans antialiased">{children}</div>;
  }

  return (
    <div style={FONT_SCALE} className="h-screen overflow-hidden bg-slate-950 text-slate-100 p-3 md:p-5 font-sans antialiased selection:bg-teal-500 selection:text-white flex flex-col">
      <header className="w-full max-w-[108rem] mx-auto mb-2 border-b border-slate-800 pb-2 shrink-0 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1 flex-wrap">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Target Milestone: Oct 15 Scoping
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Pilot Scale: 2-3 Employers (100–600 Lives)
            </span>
          </div>
          <h1 className="text-xl md:text-2xl font-bold tracking-tight text-white flex items-center gap-3 flex-wrap">
            <span>Center for Care Optimization (CCO)</span>
            <span className="text-slate-600 font-normal">|</span>
            <Link href={STEPS[0]} className="text-teal-400 text-xl font-medium hover:text-teal-300">
              3-Tier Solution Blueprint
            </Link>
          </h1>
          <p className="text-slate-400 text-sm mt-1 [@media(max-height:800px)]:hidden">
            Decoupling Clinical Governance &amp; Multi-Tenant Co-Branding from Agency Frontend Delivery
          </p>
        </div>
        <PilotToggle employer={PILOT_EMPLOYER} />
      </header>

      <main className="w-full max-w-[108rem] mx-auto flex-1 min-h-0 flex flex-col justify-center overflow-hidden">{children}</main>

      <nav className="w-full max-w-[108rem] mx-auto mt-2 shrink-0 flex items-center justify-between gap-4 border-t border-slate-800 pt-2 text-xs">
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
            title="Open presenter window (P) · Full screen (F)"
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
