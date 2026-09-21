'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Icons } from './icons';

const TABS = [
  { id: 'ep', label: 'Executive Protection', icon: Icons.Users },
  { id: 'im', label: 'Incident Management', icon: Icons.AlertTriangle },
  { id: 'ti', label: 'Threat Intelligence', icon: Icons.Radar },
  { id: 'ci', label: 'Corporate Investigations', icon: Icons.FileText },
  { id: 'gsoc', label: 'GSOC Operations', icon: Icons.Layers },
] as const;

type TabId = (typeof TABS)[number]['id'];

// Interactive Programs Showcase Tabs — the only stateful piece on this
// section of the home page.
export function ProgramsShowcase() {
  const [selectedTab, setSelectedTab] = useState<TabId>('ep');

  return (
    <>
      {/* Solution Tabs */}
      <div className="flex flex-wrap gap-2 mb-8 border-b border-slate-200 pb-3">
        {TABS.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setSelectedTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2.5 rounded-lg text-sm font-semibold transition-all ${
              selectedTab === tab.id
                ? 'bg-[#E96822] text-white shadow-lg shadow-orange-600/30'
                : 'text-slate-500 hover:text-slate-900 hover:bg-slate-100'
            }`}
          >
            <tab.icon />
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Content Display */}
      <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8 grid lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-5 space-y-4">
          {selectedTab === 'ep' && (
            <>
              <span className="text-xs uppercase font-bold text-[#E96822] tracking-wider">Solution Highlight</span>
              <h3 className="text-2xl font-bold text-slate-900">Executive Protection Intelligence</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Safeguard corporate leaders, board members, and high-profile individuals wherever they travel. Integrate flight itineraries, hotel geofences, and person-of-interest monitoring into one real-time dashboard.
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2"><Icons.Check /> Live POI radius alerts along travel routes</li>
                <li className="flex items-center gap-2"><Icons.Check /> Automated threat assessments before executive arrival</li>
                <li className="flex items-center gap-2"><Icons.Check /> Mobile briefing cards for security details on the ground</li>
              </ul>
              <div className="pt-3">
                <Link
                  href="/demo-mock/solutions/executive-protection"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-xs px-4 py-2.5 rounded-lg border border-slate-200 flex items-center gap-2 w-fit"
                >
                  Deep Dive: Executive Protection <Icons.ChevronRight />
                </Link>
              </div>
            </>
          )}

          {selectedTab === 'im' && (
            <>
              <span className="text-xs uppercase font-bold text-[#E96822] tracking-wider">Solution Highlight</span>
              <h3 className="text-2xl font-bold text-slate-900">End-to-End Incident Management</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Transform chaotic security reports into structured, actionable incident resolution. Coordinate guard dispatch, capture evidence, and generate post-incident findings.
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2"><Icons.Check /> 50% average reduction in resolution time</li>
                <li className="flex items-center gap-2"><Icons.Check /> Integrated dispatch directly tied to case records</li>
                <li className="flex items-center gap-2"><Icons.Check /> Standardized audit logs for legal defensibility</li>
              </ul>
              <div className="pt-3">
                <Link
                  href="/demo-mock/solutions/incident-management"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-xs px-4 py-2.5 rounded-lg border border-slate-200 flex items-center gap-2 w-fit"
                >
                  Deep Dive: Incident Response <Icons.ChevronRight />
                </Link>
              </div>
            </>
          )}

          {selectedTab === 'ti' && (
            <>
              <span className="text-xs uppercase font-bold text-[#E96822] tracking-wider">Solution Highlight</span>
              <h3 className="text-2xl font-bold text-slate-900">Continuous Threat Intelligence</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Cut through digital noise across the surface, deep, and dark web. Detect physical threats, doxxing attempts, and facility protests before they escalate.
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2"><Icons.Check /> Automated OSINT parsing and threat ranking</li>
                <li className="flex items-center gap-2"><Icons.Check /> Identity resolution to uncover true actors</li>
                <li className="flex items-center gap-2"><Icons.Check /> Proactive escalation to executive protection teams</li>
              </ul>
              <div className="pt-3">
                <Link
                  href="/demo-mock/solutions"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-xs px-4 py-2.5 rounded-lg border border-slate-200 flex items-center gap-2 w-fit"
                >
                  View Threat Intelligence Suite <Icons.ChevronRight />
                </Link>
              </div>
            </>
          )}

          {selectedTab === 'ci' && (
            <>
              <span className="text-xs uppercase font-bold text-[#E96822] tracking-wider">Solution Highlight</span>
              <h3 className="text-2xl font-bold text-slate-900">Corporate Investigations and Case Management</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Empower corporate investigators with ten tools in a single workspace. Link background records, vehicle registrations, and chain of custody seamlessly.
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2"><Icons.Check /> Centralized evidence locker and digital forensics</li>
                <li className="flex items-center gap-2"><Icons.Check /> Relationship graph to discover hidden associates</li>
                <li className="flex items-center gap-2"><Icons.Check /> One-click executive dossier generation</li>
              </ul>
              <div className="pt-3">
                <Link
                  href="/demo-mock/solutions"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-xs px-4 py-2.5 rounded-lg border border-slate-200 flex items-center gap-2 w-fit"
                >
                  Explore Case Management <Icons.ChevronRight />
                </Link>
              </div>
            </>
          )}

          {selectedTab === 'gsoc' && (
            <>
              <span className="text-xs uppercase font-bold text-[#E96822] tracking-wider">Solution Highlight</span>
              <h3 className="text-2xl font-bold text-slate-900">Unified GSOC Command Center</h3>
              <p className="text-slate-600 text-sm leading-relaxed">
                Turn your Global Security Operations Center into an agile decision hub. Overlay global weather, civil unrest, and facility telemetry on an interactive globe.
              </p>
              <ul className="space-y-2 text-sm text-slate-700">
                <li className="flex items-center gap-2"><Icons.Check /> Multi-screen operator dispatch consoles</li>
                <li className="flex items-center gap-2"><Icons.Check /> Automated mass notifications to affected personnel</li>
                <li className="flex items-center gap-2"><Icons.Check /> Interoperability with VMS and access control</li>
              </ul>
              <div className="pt-3">
                <Link
                  href="/demo-mock/platform"
                  className="bg-slate-100 hover:bg-slate-200 text-slate-900 font-semibold text-xs px-4 py-2.5 rounded-lg border border-slate-200 flex items-center gap-2 w-fit"
                >
                  Explore GSOC Solutions <Icons.ChevronRight />
                </Link>
              </div>
            </>
          )}
        </div>

        {/* Simulated UI Window for the active tab */}
        <div className="lg:col-span-7 bg-[#0A0E1A] p-5 rounded-xl border border-slate-800 shadow-inner">
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800 text-xs">
            <span className="text-slate-400 font-mono">WORKSPACE: {selectedTab.toUpperCase()}_LIVE_CONSOLE</span>
            <span className="text-emerald-400 font-mono flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping"></span> SYNCED
            </span>
          </div>

          <div className="grid grid-cols-2 gap-3 mb-4">
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400 uppercase">Active Monitored Targets</div>
              <div className="text-xl font-bold text-white mt-1">1,482 Items</div>
              <div className="text-[11px] text-emerald-400 mt-0.5">↑ 14% verified threats filtered</div>
            </div>
            <div className="bg-slate-900/80 p-3 rounded-lg border border-slate-800">
              <div className="text-[11px] text-slate-400 uppercase">Mean Time to Mitigate</div>
              <div className="text-xl font-bold text-white mt-1">4.2 min</div>
              <div className="text-[11px] text-orange-400 mt-0.5">↓ 68% vs legacy processes</div>
            </div>
          </div>

          <div className="bg-slate-900/60 p-4 rounded-lg border border-slate-800 space-y-2">
            <div className="text-xs font-semibold text-slate-300">Live Case Event Stream</div>
            <div className="space-y-1.5 text-xs">
              <div className="p-2 rounded bg-black/40 flex justify-between items-center text-slate-300">
                <span>[POI Flag] High-risk individual spotted within 2.1 mi geofence</span>
                <span className="text-[10px] text-orange-400 font-mono">URGENT</span>
              </div>
              <div className="p-2 rounded bg-black/40 flex justify-between items-center text-slate-300">
                <span>[Travel Route] Flight #UA412 landed; driver escort confirmed</span>
                <span className="text-[10px] text-emerald-400 font-mono">CONFIRMED</span>
              </div>
              <div className="p-2 rounded bg-black/40 flex justify-between items-center text-slate-300">
                <span>[Triage] Automated OSINT cross-reference complete (0 false positives)</span>
                <span className="text-[10px] text-slate-400 font-mono">COMPLETE</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
