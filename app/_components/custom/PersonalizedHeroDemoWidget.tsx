'use client';

import { useState } from 'react';
import Image from 'next/image';
import {
  LayoutTemplate, Database, Sparkles,
  ChevronRight, Activity, User, Target, MousePointerClick, X,
} from 'lucide-react';

type ContentBlock = {
  headline: string;
  subheadline: string;
  ctaLabel: string;
  heroImageUrl?: string | null;
};

export type PersonalizedHeroBlocks = {
  unknown: ContentBlock;
  mortgage: ContentBlock;
  wealth: ContentBlock;
};

type Intent = 'unknown' | 'mortgage' | 'wealth';

type EventRow = { id: number; time: string; action: string; detail: string };

const INTENT_STYLES: Record<Intent, { bg: string; overlay: string; badge: string }> = {
  unknown:  { bg: 'bg-blue-900',  overlay: 'bg-blue-950/65',  badge: 'bg-white/20' },
  mortgage: { bg: 'bg-green-800', overlay: 'bg-green-950/65', badge: 'bg-white/20' },
  wealth:   { bg: 'bg-slate-900', overlay: 'bg-slate-950/65', badge: 'bg-white/20' },
};

const CMS_BLOCKS: { key: Intent; label: string; activeRing: string; activeBadge: string }[] = [
  { key: 'unknown',  label: 'Fallback (No Intent)',  activeRing: 'border-blue-500 bg-blue-50 ring-1 ring-blue-500',      activeBadge: 'bg-blue-600'   },
  { key: 'mortgage', label: "Intent == 'Mortgage'",  activeRing: 'border-green-500 bg-green-50 ring-1 ring-green-500',    activeBadge: 'bg-green-600'  },
  { key: 'wealth',   label: "Intent == 'Wealth'",    activeRing: 'border-purple-500 bg-purple-50 ring-1 ring-purple-500', activeBadge: 'bg-purple-600' },
];

export default function PersonalizedHeroDemoWidget({ blocks }: { blocks: PersonalizedHeroBlocks }) {
  const [activeTab, setActiveTab]       = useState<'odp' | 'cms'>('odp');
  const [isTrayOpen, setIsTrayOpen]     = useState(false);
  const [userIntent, setUserIntent]     = useState<Intent>('unknown');
  const [currentRoute, setCurrentRoute] = useState('/');
  const [isNavigating, setIsNavigating] = useState(false);
  const [eventStream, setEventStream]   = useState<EventRow[]>([
    { id: 1, time: '', action: 'First Visit', detail: 'Landed on Homepage' },
  ]);

  const activeContent = blocks[userIntent];
  const styles = INTENT_STYLES[userIntent];

  function trackBehavior(action: string, detail: string, newIntent?: Intent) {
    setEventStream(prev =>
      [{ id: Date.now(), time: new Date().toLocaleTimeString(), action, detail }, ...prev].slice(0, 5)
    );
    if (newIntent && newIntent !== userIntent) setUserIntent(newIntent);
  }

  function navigateTo(route: string) {
    setIsNavigating(true);
    setCurrentRoute(route);
    let action = 'Page View';
    let detail = `Navigated to ${route}`;
    let intent: Intent | undefined;

    if (route === '/mortgage-calculator') { action = 'High Intent Signal'; detail = 'Used Mortgage Calculator'; intent = 'mortgage'; }
    else if (route === '/wealth-planning') { action = 'High Intent Signal'; detail = 'Read Wealth Management PDF'; intent = 'wealth'; }
    else if (route === '/') { detail = 'Returned to Homepage'; }

    setTimeout(() => { trackBehavior(action, detail, intent); setIsNavigating(false); }, 400);
  }

  function resetDemo() {
    setUserIntent('unknown');
    setCurrentRoute('/');
    setEventStream([{ id: Date.now(), time: new Date().toLocaleTimeString(), action: 'Session Reset', detail: 'Cleared Cookies / Profile' }]);
  }

  return (
    <div className="relative h-[680px] w-full overflow-hidden rounded-xl border border-gray-200 shadow-lg font-sans bg-slate-200">

      {/* ── Slide-out tray ── */}
      <div
        className={`absolute left-0 top-0 bottom-0 z-20 w-80 bg-slate-50 border-r border-slate-200 shadow-2xl flex flex-col transition-transform duration-300 ease-in-out ${isTrayOpen ? 'translate-x-0' : '-translate-x-full'}`}
      >
        {/* Tray header */}
        <div className="bg-slate-900 text-white px-4 py-3 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2">
            <Sparkles size={16} className="text-[#0037FF]" />
            <span className="font-semibold tracking-wide text-xs">OPTIMIZELY ONE</span>
          </div>
          <button onClick={() => setIsTrayOpen(false)} className="text-white/50 hover:text-white transition-colors" aria-label="Close panel">
            <X size={16} />
          </button>
        </div>

        {/* Tabs */}
        <div className="flex border-b border-slate-200 bg-white shrink-0 text-xs">
          {([['odp', Database, 'ODP (Intent Data)'], ['cms', LayoutTemplate, 'CMS (Blocks)']] as const).map(([id, Icon, label]) => (
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

          {/* ODP Panel */}
          {activeTab === 'odp' && (
            <>
              <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-[11px] font-bold text-slate-800 flex items-center gap-1.5">
                    <User size={13} className="text-[#0037FF]" /> Real-Time User Profile
                  </h3>
                  <button onClick={resetDemo} className="text-[10px] text-slate-400 hover:text-red-500 underline">Reset</button>
                </div>

                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-semibold mb-1.5">Current Primary Intent</p>
                  <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold capitalize transition-colors duration-500 ${
                    userIntent === 'unknown'  ? 'bg-slate-100 text-slate-600' :
                    userIntent === 'mortgage' ? 'bg-green-100 text-green-700' :
                                               'bg-purple-100 text-purple-700'
                  }`}>
                    <Target size={11} />
                    {userIntent === 'unknown' ? 'Browsing (Low Intent)' : `${userIntent} Seeker (High Intent)`}
                  </span>
                </div>

                <div>
                  <p className="text-[9px] text-slate-400 uppercase font-semibold mb-2">Live Event Stream (ODP)</p>
                  <div className="space-y-1.5">
                    {eventStream.map((ev, idx) => (
                      <div key={ev.id} className={`p-2 rounded text-[10px] border ${idx === 0 ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-transparent text-slate-400'}`}>
                        <div className="flex justify-between font-mono mb-0.5">
                          <span className={idx === 0 ? 'text-blue-700 font-bold' : ''}>{ev.action}</span>
                          <span className="text-slate-300">{ev.time}</span>
                        </div>
                        <div className={idx === 0 ? 'text-slate-600' : ''}>{ev.detail}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex gap-2 text-[11px] text-blue-800">
                <Activity className="shrink-0 text-blue-600 mt-0.5" size={15} />
                <p><strong>The ODP Brain:</strong> As the visitor navigates the simulated site, ODP captures behaviour and updates their intent profile instantly.</p>
              </div>
            </>
          )}

          {/* CMS Panel */}
          {activeTab === 'cms' && (
            <>
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-lg flex gap-2 text-[11px] text-indigo-800">
                <LayoutTemplate className="shrink-0 text-indigo-600 mt-0.5" size={15} />
                <p><strong>Intent-Driven CMS:</strong> Marketers map hero content to ODP intent signals. The platform assembles the right version per visitor.</p>
              </div>

              <div className="space-y-2">
                <p className="text-[9px] font-semibold text-slate-400 uppercase tracking-wider">Dynamic Hero Config</p>
                {CMS_BLOCKS.map(({ key, label, activeRing, activeBadge }) => (
                  <div key={key} className={`p-3 rounded-lg border transition-all ${userIntent === key ? activeRing : 'border-slate-200 bg-white'}`}>
                    <div className="flex items-center justify-between mb-1">
                      <span className="text-[11px] font-bold text-slate-700">{label}</span>
                      {userIntent === key && (
                        <span className={`text-[9px] ${activeBadge} text-white px-2 py-0.5 rounded-full font-bold`}>ACTIVE</span>
                      )}
                    </div>
                    <p className="text-[10px] text-slate-500 truncate">{blocks[key].headline}</p>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>

      {/* ── Tray toggle tab (visible when closed) ── */}
      <button
        onClick={() => setIsTrayOpen(true)}
        aria-label="Open Optimizely One panel"
        className={`absolute left-0 top-1/2 -translate-y-1/2 z-10 transition-all duration-300 ${isTrayOpen ? 'opacity-0 pointer-events-none' : 'opacity-100'}`}
      >
        <div className="bg-slate-900 text-white pl-1.5 pr-2 py-5 rounded-r-lg flex flex-col items-center gap-2 shadow-xl hover:bg-slate-800 transition-colors">
          <Sparkles size={13} className="text-[#0037FF]" />
          <span
            className="text-[9px] font-bold tracking-widest uppercase text-white/80"
            style={{ writingMode: 'vertical-rl', textOrientation: 'mixed' }}
          >
            OPTIMIZELY ONE
          </span>
        </div>
      </button>

      {/* ── Simulated Browser (full width) ── */}
      <div className="flex flex-col h-full">

        {/* <div className="bg-slate-800 text-slate-300 px-4 py-2 flex items-center justify-between text-[11px] border-b border-slate-700 shrink-0">
          <span className="font-mono text-white flex items-center gap-2">
            <Monitor size={13} /> localhost:3000{currentRoute}
          </span>
          {isNavigating && (
            <span className="text-[#0037FF] flex items-center gap-1 animate-pulse">
              <Zap size={11} /> Fetching from Graph…
            </span>
          )}
        </div> */}

        <div className="flex-1 p-4 overflow-y-auto">
          <div className="bg-white rounded-lg shadow-xl overflow-hidden border border-slate-100 flex flex-col min-h-full relative">

            {isNavigating && (
              <div className="absolute inset-0 bg-white/70 backdrop-blur-[1px] z-50 flex items-center justify-center">
                <div className="h-7 w-7 rounded-full border-4 border-slate-200 border-t-blue-700 animate-spin" />
              </div>
            )}

            {/* Simulated ESL nav */}
            <header className="bg-white border-b border-slate-100 py-3 px-5 flex justify-between items-center shadow-sm shrink-0">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src="/esl-logo.png" alt="ESL" className="h-7 w-auto cursor-pointer" onClick={() => navigateTo('/')} />
              <nav className="flex gap-4 text-[11px] font-semibold text-slate-600">
                {[['/', 'Home'], ['/mortgage-calculator', 'Mortgages'], ['/wealth-planning', 'Wealth']].map(([route, label]) => (
                  <button key={route} onClick={() => navigateTo(route)} className={`hover:text-blue-700 transition-colors ${currentRoute === route ? 'text-blue-700' : ''}`}>{label}</button>
                ))}
              </nav>
            </header>

            <main className="flex-1 flex flex-col">

              {/* Home route */}
              {currentRoute === '/' && (
                <div className="flex-1 flex flex-col">
                  <div className={`relative py-16 px-8 text-center text-white transition-all duration-700 overflow-hidden ${!activeContent.heroImageUrl ? styles.bg : ''}`}>
                    {activeContent.heroImageUrl && (
                      <>
                        <Image src={activeContent.heroImageUrl} alt="" fill className="object-cover" />
                        <div className={`absolute inset-0 ${styles.overlay}`} />
                      </>
                    )}
                    <div className="relative z-10">
                      {userIntent !== 'unknown' && (
                        <span className={`inline-flex items-center gap-1 ${styles.badge} backdrop-blur-sm px-3 py-1 rounded-full text-[10px] font-bold mb-4 animate-pulse`}>
                          <Sparkles size={10} /> Personalized for you
                        </span>
                      )}
                      <h2 className="text-2xl font-extrabold leading-tight mb-2 max-w-lg mx-auto">
                        {activeContent.headline}
                      </h2>
                      <p className="text-sm mb-6 opacity-90 max-w-md mx-auto">
                        {activeContent.subheadline}
                      </p>
                      <button className="inline-flex items-center gap-1.5 px-7 py-3 rounded-full font-bold text-sm bg-orange-500 text-white hover:bg-orange-600 transition-colors shadow">
                        {activeContent.ctaLabel} <ChevronRight size={14} />
                      </button>
                    </div>
                  </div>

                  <div className="p-8 text-center flex-1">
                    <p className="text-xs text-slate-500 mb-5">Click a section to simulate user behaviour.</p>
                    <div className="flex justify-center gap-4">
                      <button onClick={() => navigateTo('/mortgage-calculator')} className="flex flex-col items-center p-5 border border-slate-200 rounded-xl hover:border-green-400 hover:shadow-md transition-all group">
                        <div className="w-10 h-10 bg-slate-100 group-hover:bg-green-100 rounded-full flex items-center justify-center mb-2.5 transition-colors text-xl">🏠</div>
                        <span className="text-xs font-semibold text-slate-700 group-hover:text-green-700">Explore Mortgages</span>
                      </button>
                      <button onClick={() => navigateTo('/wealth-planning')} className="flex flex-col items-center p-5 border border-slate-200 rounded-xl hover:border-purple-400 hover:shadow-md transition-all group">
                        <div className="w-10 h-10 bg-slate-100 group-hover:bg-purple-100 rounded-full flex items-center justify-center mb-2.5 transition-colors text-xl">📈</div>
                        <span className="text-xs font-semibold text-slate-700 group-hover:text-purple-700">Wealth Planning</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Mortgage route */}
              {currentRoute === '/mortgage-calculator' && (
                <div className="p-10 flex-1 bg-slate-50 flex items-start justify-center">
                  <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-sm border border-slate-200">
                    <div className="inline-block bg-green-100 text-green-700 p-2 rounded-lg mb-3 text-lg">🏠</div>
                    <h2 className="text-base font-bold text-slate-800 mb-1">Mortgage Calculator</h2>
                    <p className="text-xs text-slate-500 mb-4">Estimate your monthly payments.</p>
                    <div className="space-y-3 mb-5">
                      {[['Home Price', '$350,000'], ['Down Payment', '$70,000 (20%)']].map(([label, val]) => (
                        <div key={label}>
                          <p className="text-[10px] font-semibold text-slate-500 mb-1">{label}</p>
                          <input readOnly value={val} className="w-full p-2 bg-slate-100 border border-slate-200 rounded text-xs text-slate-700" />
                        </div>
                      ))}
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex gap-2 text-xs text-blue-800">
                      <MousePointerClick className="shrink-0 text-[#0037FF] mt-0.5" size={13} />
                      <p>Visiting this page fires a <strong>Mortgage Intent</strong> signal to ODP. Click <strong>Home</strong> to see the personalised hero.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* Wealth route */}
              {currentRoute === '/wealth-planning' && (
                <div className="p-10 flex-1 bg-slate-50 flex items-start justify-center">
                  <div className="w-full max-w-sm bg-white p-6 rounded-xl shadow-sm border border-slate-200 text-center">
                    <div className="inline-block bg-purple-100 text-purple-700 p-3 rounded-full mb-3 text-2xl">📈</div>
                    <h2 className="text-base font-bold text-slate-800 mb-1">Wealth Management</h2>
                    <p className="text-xs text-slate-500 mb-4">Read our latest estate planning insights.</p>
                    <div className="h-20 bg-slate-100 border-2 border-dashed border-slate-300 rounded flex items-center justify-center text-slate-400 mb-4 font-mono text-[10px]">
                      [ PDF Viewer Placeholder ]
                    </div>
                    <div className="p-3 bg-blue-50 border border-blue-100 rounded-lg flex gap-2 text-xs text-blue-800 text-left">
                      <MousePointerClick className="shrink-0 text-[#0037FF] mt-0.5" size={13} />
                      <p>This fires a <strong>Wealth Intent</strong> signal to ODP. Click <strong>Home</strong> to see the personalised hero.</p>
                    </div>
                  </div>
                </div>
              )}

            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
