'use client';

import { useState } from 'react';
import { Icons } from './icons';

// Interactive Geofence & Threat Visualizer inside the hero — only the alert
// selection is stateful, so it's the only client island on the home hero.
export function HomeHeroPreview() {
  const [activeSimAlert, setActiveSimAlert] = useState<'poi' | 'incident'>('poi');

  return (
    <div className="relative rounded-2xl border border-slate-700/80 bg-[#0F172A]/90 p-4 shadow-2xl backdrop-blur-xl">
      {/* Header bar of simulated UI */}
      <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800 text-xs">
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-rose-500/80"></span>
          <span className="w-3 h-3 rounded-full bg-amber-500/80"></span>
          <span className="w-3 h-3 rounded-full bg-emerald-500/80"></span>
          <span className="ml-2 font-mono text-slate-400 text-[11px]">ontic-ops://realtime-monitor</span>
        </div>
        <div className="flex items-center gap-2 bg-slate-800/80 px-2 py-0.5 rounded text-[11px] text-slate-300">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
          Live Feeds: 28 Active
        </div>
      </div>

      {/* Simulated Geofence & Threat Visualizer */}
      <div className="bg-[#0B1120] rounded-xl p-4 border border-slate-800 mb-4">
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2">
            <div className="p-1.5 rounded bg-orange-500/20 text-[#E96822]">
              <Icons.Radar />
            </div>
            <div>
              <div className="text-xs font-bold text-white">Geofenced Risk Center: Chicago HQ + Exec Travel</div>
              <div className="text-[10px] text-slate-400">Radius: 5.0 mi | 3 Active POI Proximities</div>
            </div>
          </div>
          <span className="text-[10px] font-bold px-2 py-1 bg-amber-500/20 text-amber-300 rounded border border-amber-500/30">
            ELEVATED THREAT LEVEL
          </span>
        </div>

        {/* Interactive Alert Cards inside Hero */}
        <div className="space-y-2 text-xs">
          <div
            onClick={() => setActiveSimAlert('poi')}
            className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
              activeSimAlert === 'poi'
                ? 'border-orange-500 bg-orange-500/10 text-white'
                : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-rose-500"></span>
                POI Threat Signal: Flagged Online Harassment
              </span>
              <span className="text-[10px] text-slate-400">14m ago</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              Cross-referenced POI #4492 matching speech pattern near Executive Itinerary route.
            </p>
          </div>

          <div
            onClick={() => setActiveSimAlert('incident')}
            className={`p-2.5 rounded-lg border transition-all cursor-pointer ${
              activeSimAlert === 'incident'
                ? 'border-orange-500 bg-orange-500/10 text-white'
                : 'border-slate-800 bg-slate-900/60 text-slate-300 hover:border-slate-700'
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-semibold flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500"></span>
                Facility Incident: Unauthorized Door Forced Open
              </span>
              <span className="text-[10px] text-slate-400">28m ago</span>
            </div>
            <p className="text-[11px] text-slate-400 mt-1">
              South Entrance Gate 4. Access badge #7119 deactivated. Dispatch notified.
            </p>
          </div>
        </div>
      </div>

      {/* Ontic AI Copilot Simulation Bar */}
      <div className="p-3 rounded-xl bg-gradient-to-r from-slate-900 to-[#1b1c31] border border-orange-500/30 flex items-start gap-3">
        <div className="w-8 h-8 rounded-lg bg-[#E96822]/20 text-[#E96822] flex items-center justify-center shrink-0">
          <Icons.Sparkles />
        </div>
        <div className="text-xs">
          <div className="font-semibold text-white flex items-center gap-1.5">
            <span>Ontic AI Assistant</span>
            <span className="text-[9px] uppercase tracking-wider bg-orange-500/20 text-[#E96822] px-1.5 py-0.2 rounded font-bold">Autopilot</span>
          </div>
          <p className="text-slate-300 text-[11px] mt-0.5">
            {activeSimAlert === 'poi'
              ? 'Synthesized 12 historical reports for POI #4492. Risk score calculated: 78/100. Automated briefing generated for EP detail.'
              : 'Badge record correlated with contractor roster. No security breach detected; accidental door prop cleared in 3.2 minutes.'}
          </p>
        </div>
      </div>
    </div>
  );
}
