'use client';

import { useState } from 'react';

type Incident = {
  id: string;
  title: string;
  status: 'In Progress' | 'Assigned' | 'Closed' | 'Resolved';
  priority: 'High' | 'Critical' | 'Low';
  time: string;
};

const INITIAL_INCIDENTS: Incident[] = [
  { id: 'INC-8812', title: 'Suspicious Package - Logistics Center B', status: 'In Progress', priority: 'High', time: '8m ago' },
  { id: 'INC-8811', title: 'Badge Cloning Attempt - Server Room 2', status: 'Assigned', priority: 'Critical', time: '22m ago' },
  { id: 'INC-8810', title: 'Parking Lot Vehicle Break-in', status: 'Closed', priority: 'Low', time: '1h ago' },
];

// Live Incident Dispatch Board — resolving an incident is the only client
// state on this page.
export function IncidentTriageBoard() {
  const [incidents, setIncidents] = useState<Incident[]>(INITIAL_INCIDENTS);

  const handleResolve = (id: string) => {
    setIncidents(incidents.map((inc) => (inc.id === id ? { ...inc, status: 'Resolved' } : inc)));
  };

  return (
    <div className="lg:col-span-5 bg-[#0F172A] border border-slate-800 rounded-2xl p-6 shadow-2xl">
      <div className="flex justify-between items-center pb-3 border-b border-slate-800 mb-4">
        <span className="text-xs font-bold text-white">Live Incident Dispatch Board</span>
        <span className="text-[10px] font-mono bg-orange-500/10 text-[#E96822] px-2 py-0.5 rounded font-bold">
          CONNECTED DISPATCH
        </span>
      </div>

      <div className="space-y-3">
        {incidents.map((inc) => (
          <div key={inc.id} className="p-3 rounded-lg bg-black/40 border border-slate-800 flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400">{inc.id}</span>
                <span
                  className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
                    inc.priority === 'Critical'
                      ? 'bg-rose-500/20 text-rose-400'
                      : inc.priority === 'High'
                      ? 'bg-orange-500/20 text-orange-400'
                      : 'bg-slate-700 text-slate-300'
                  }`}
                >
                  {inc.priority}
                </span>
              </div>
              <div className="text-xs font-semibold text-white mt-1">{inc.title}</div>
              <div className="text-[10px] text-slate-400 mt-0.5">
                Status: <span className="text-slate-200">{inc.status}</span> · {inc.time}
              </div>
            </div>

            {inc.status !== 'Closed' && inc.status !== 'Resolved' && (
              <button
                onClick={() => handleResolve(inc.id)}
                className="text-[10px] bg-slate-800 hover:bg-[#E96822] text-slate-300 hover:text-white px-2.5 py-1.5 rounded transition-all font-semibold"
              >
                Resolve
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
