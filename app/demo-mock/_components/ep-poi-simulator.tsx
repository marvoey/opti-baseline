'use client';

import { useState } from 'react';

// EP Interactive Mockup: Principal Profile & Travel Route — the geofence
// distance simulation and dispatch action are the only client state here.
export function EpPoiSimulator() {
  const [poiDistance, setPoiDistance] = useState('2.4');

  return (
    <div className="lg:col-span-5 bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-2xl">
      <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-white font-bold text-xs">
            CEO
          </div>
          <div>
            <div className="text-xs font-bold text-white">Principal: Executive A</div>
            <div className="text-[10px] text-slate-400">Current Trip: Davos Economic Forum</div>
          </div>
        </div>
        <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-emerald-500/20 text-emerald-400">
          ACTIVE DETAIL
        </span>
      </div>

      <div className="space-y-3 text-xs">
        <div className="p-3 rounded-lg bg-black/40 border border-slate-800">
          <div className="text-slate-400 text-[11px] mb-1">Itinerary Synchronization</div>
          <div className="flex justify-between font-semibold text-slate-200">
            <span>Flight LX 18 to Zurich (ZRH)</span>
            <span className="text-emerald-400">On Time</span>
          </div>
          <div className="text-[11px] text-slate-400 mt-1">Armored Motorcade Lead: Agent R. Miller</div>
        </div>

        <div className="p-3 rounded-lg bg-orange-500/10 border border-orange-500/30">
          <div className="flex justify-between items-center text-[#E96822] font-bold">
            <span>POI Geofence Alert</span>
            <span>{poiDistance} mi away</span>
          </div>
          <p className="text-[11px] text-slate-300 mt-1">
            POI #8919 (Repeated fixation subject) flagged checking into local hotel within hotel buffer zone.
          </p>
          <div className="mt-2 flex gap-2">
            <button
              onClick={() => setPoiDistance((parseFloat(poiDistance) + 0.5).toFixed(1))}
              className="text-[10px] bg-slate-800 px-2 py-1 rounded text-slate-300 hover:text-white"
            >
              Simulate Movement
            </button>
            <button
              onClick={() => alert('EP Notification sent to Mobile Agent Briefing App.')}
              className="text-[10px] bg-[#E96822] px-2 py-1 rounded text-white font-bold"
            >
              Dispatch EP Escort
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
