'use client';

import { useState } from 'react';

const INTEGRATIONS = [
  { name: 'Access Control (LenelS2 / CCURE)', category: 'access', desc: 'Real-time badging and door forced open telemetry' },
  { name: 'Bespoke HR Feeds (Workday / SAP)', category: 'hr', desc: 'Sync employee termination and high-risk departures' },
  { name: 'Travel Risk (Concur / Sabre)', category: 'travel', desc: 'Automatic travel itinerary and hotel geofencing' },
  { name: 'OSINT & Social Feeds (Dataminr / LifeRaft)', category: 'intel', desc: 'Early warning signals across public forums' },
  { name: 'VMS & Video Systems (Genetec / Milestone)', category: 'vms', desc: 'Trigger camera bookmarks upon incident dispatch' },
  { name: 'Mass Notification (Everbridge / AlertMedia)', category: 'comms', desc: 'Broadcast emergency alerts directly from case files' },
];

const CATEGORIES = ['all', 'access', 'travel', 'intel'];

// 60+ Ecosystem Integrations Explorer — filtering is the only client state.
export function IntegrationsExplorer() {
  const [filterCategory, setFilterCategory] = useState('all');

  const filteredIntegrations =
    filterCategory === 'all' ? INTEGRATIONS : INTEGRATIONS.filter((i) => i.category === filterCategory);

  return (
    <>
      <div className="flex flex-col md:flex-row md:items-end justify-between mb-8">
        <div>
          <span className="text-[#E96822] font-bold text-xs uppercase tracking-wider">Open Architecture</span>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 mt-1">60+ Connectors {'&'} Native Integrations</h2>
        </div>

        <div className="flex gap-2 mt-4 md:mt-0">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCategory(cat)}
              className={`text-xs px-3 py-1.5 rounded-md font-semibold capitalize transition-colors ${
                filterCategory === cat ? 'bg-[#E96822] text-white' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredIntegrations.map((item) => (
          <div key={item.name} className="p-4 rounded-xl bg-white border border-slate-200 shadow-sm hover:border-slate-300">
            <div className="flex items-center justify-between mb-2">
              <span className="font-semibold text-slate-900 text-sm">{item.name}</span>
              <span className="text-[10px] uppercase font-bold text-[#E96822] bg-orange-500/10 px-2 py-0.5 rounded">
                Connected
              </span>
            </div>
            <p className="text-xs text-slate-500">{item.desc}</p>
          </div>
        ))}
      </div>
    </>
  );
}
