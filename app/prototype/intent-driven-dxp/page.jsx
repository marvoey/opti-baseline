'use client';

import React, { useState, useEffect } from 'react';
import { 
  LayoutTemplate, Database, Sparkles, Monitor, Smartphone, 
  ChevronRight, Activity, User, Target, MousePointerClick, Zap 
} from 'lucide-react';

export default function IntentDrivenDemo() {
  // Optimizely Platform State (Left Panel)
  const [activeTab, setActiveTab] = useState('odp');
  
  // Simulated User State (Data Layer)
  const [userIntent, setUserIntent] = useState('unknown'); // unknown, mortgage, wealth
  const [eventStream, setEventStream] = useState([
    { id: 1, time: new Date().toLocaleTimeString(), action: 'First Visit', detail: 'Landed on Homepage' }
  ]);

  // Next.js Frontend State (Right Panel)
  const [currentRoute, setCurrentRoute] = useState('/');
  const [isNavigating, setIsNavigating] = useState(false);

  // Content Blocks (Managed in CMS)
  const contentBlocks = {
    unknown: {
      headline: 'Turn your home equity into a flexible solution.',
      subhead: '3.95% Intro APR for 12 months with LTV up to 90% and no closing costs.',
      cta: 'Apply Today',
      bg: 'bg-[#005596]',
      text: 'text-white'
    },
    mortgage: {
      headline: 'Ready to buy your dream home?',
      subhead: 'You’ve been exploring mortgages. Lock in today’s low rates with an ESL Mortgage Expert.',
      cta: 'Start Pre-Approval',
      bg: 'bg-green-700',
      text: 'text-white'
    },
    wealth: {
      headline: 'Secure your financial legacy.',
      subhead: 'Speak with our Wealth Management team to build a comprehensive financial plan.',
      cta: 'Schedule Consultation',
      bg: 'bg-slate-900',
      text: 'text-white'
    }
  };

  // Tracking Function (Simulates ODP pixel on the Next.js site)
  const trackBehavior = (action, detail, newIntent = null) => {
    const newEvent = {
      id: Date.now(),
      time: new Date().toLocaleTimeString(),
      action,
      detail
    };
    setEventStream(prev => [newEvent, ...prev].slice(0, 5)); // Keep last 5 events
    
    if (newIntent && newIntent !== userIntent) {
      setUserIntent(newIntent);
    }
  };

  // Frontend Navigation Simulator
  const navigateTo = (route, intentSignal = null) => {
    setIsNavigating(true);
    setCurrentRoute(route);
    
    let action = 'Page View';
    let detail = `Navigated to ${route}`;
    
    if (route === '/mortgage-calculator') {
      action = 'High Intent Signal';
      detail = 'Used Mortgage Calculator';
      intentSignal = 'mortgage';
    } else if (route === '/wealth-planning') {
      action = 'High Intent Signal';
      detail = 'Read Wealth Management PDF';
      intentSignal = 'wealth';
    } else if (route === '/') {
      detail = 'Returned to Homepage';
    }

    setTimeout(() => {
      trackBehavior(action, detail, intentSignal);
      setIsNavigating(false);
    }, 400);
  };

  const activeContent = contentBlocks[userIntent];

  const resetDemo = () => {
    setUserIntent('unknown');
    setCurrentRoute('/');
    setEventStream([{ id: Date.now(), time: new Date().toLocaleTimeString(), action: 'Session Reset', detail: 'Cleared Cookies/Profile' }]);
  };

  return (
    <div className="flex h-screen w-full bg-gray-100 font-sans overflow-hidden">
      
      {/* LEFT PANEL: OPTIMIZELY DXP (The Brain) */}
      <div className="w-1/3 bg-slate-50 border-r border-slate-200 flex flex-col shadow-xl z-10 overflow-y-auto">
        
        {/* Optimizely Header */}
        <div className="bg-slate-900 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles size={20} className="text-[#0037FF]" />
            <span className="font-semibold tracking-wide text-sm">OPTIMIZELY ONE</span>
          </div>
          <span className="text-xs bg-white/10 px-2 py-1 rounded border border-white/20">Intent-Driven DXP</span>
        </div>

        {/* Platform Tabs */}
        <div className="flex border-b border-slate-200 text-sm bg-white">
          <button 
            className={`flex-1 py-3 flex items-center justify-center gap-2 font-medium transition-colors ${activeTab === 'odp' ? 'border-b-2 border-[#0037FF] text-[#0037FF] bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
            onClick={() => setActiveTab('odp')}
          >
            <Database size={16} /> ODP (Intent Data)
          </button>
          <button 
            className={`flex-1 py-3 flex items-center justify-center gap-2 font-medium transition-colors ${activeTab === 'cms' ? 'border-b-2 border-[#0037FF] text-[#0037FF] bg-blue-50/50' : 'text-slate-500 hover:bg-slate-50'}`}
            onClick={() => setActiveTab('cms')}
          >
            <LayoutTemplate size={16} /> CMS (Intent Blocks)
          </button>
        </div>

        {/* Control Content */}
        <div className="p-5 flex-1 flex flex-col gap-6">
          
          {/* TAB 1: ODP (Intent Data) */}
          {activeTab === 'odp' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-4 bg-white border border-slate-200 rounded-lg shadow-sm">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-sm font-bold text-slate-800 flex items-center gap-2"><User size={16} className="text-[#0037FF]"/> Real-Time User Profile</h3>
                  <button onClick={resetDemo} className="text-xs text-slate-500 hover:text-red-500 underline">Reset User</button>
                </div>
                
                <div className="mb-4">
                  <div className="text-xs text-slate-500 uppercase font-semibold mb-1">Current Primary Intent</div>
                  <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full text-sm font-bold capitalize transition-colors duration-500 ${
                    userIntent === 'unknown' ? 'bg-slate-100 text-slate-600' :
                    userIntent === 'mortgage' ? 'bg-green-100 text-green-700' :
                    'bg-purple-100 text-purple-700'
                  }`}>
                    <Target size={14} /> 
                    {userIntent === 'unknown' ? 'Browsing (Low Intent)' : `${userIntent} Seeker (High Intent)`}
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-500 uppercase font-semibold mb-2">Live Event Stream (ODP)</div>
                  <div className="space-y-2">
                    {eventStream.map((event, idx) => (
                      <div key={event.id} className={`p-2 rounded text-xs border transition-all ${idx === 0 ? 'bg-blue-50 border-blue-100' : 'bg-slate-50 border-transparent text-slate-500'}`}>
                        <div className="flex justify-between font-mono mb-1">
                          <span className={idx === 0 ? 'text-blue-700 font-bold' : ''}>{event.action}</span>
                          <span className="text-slate-400">{event.time}</span>
                        </div>
                        <div className={idx === 0 ? 'text-slate-700' : ''}>{event.detail}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>

              <div className="p-3 bg-blue-50 border border-blue-100 rounded-md flex gap-3 text-sm text-blue-800">
                <Activity className="shrink-0 text-blue-600" size={20} />
                <p><strong>The ODP Brain:</strong> As the user clicks around the site on the right, ODP captures their behavior and updates their intent profile instantly.</p>
              </div>
            </div>
          )}

          {/* TAB 2: CMS (Intent Blocks) */}
          {activeTab === 'cms' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-md flex gap-3 text-sm text-indigo-800">
                <LayoutTemplate className="shrink-0 text-indigo-600" size={20} />
                <p><strong>Intent-Driven CMS:</strong> Marketers don't build static pages anymore. They build components mapped to ODP intents. The system assembles the page.</p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">Dynamic Homepage Hero Config</label>
                
                <div className={`p-3 rounded-lg border transition-all ${userIntent === 'unknown' ? 'border-[#0037FF] bg-blue-50 ring-1 ring-[#0037FF]' : 'border-slate-200 bg-white'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700">Fallback (No Intent)</span>
                    {userIntent === 'unknown' && <span className="text-[10px] bg-[#0037FF] text-white px-2 py-0.5 rounded-full">ACTIVE</span>}
                  </div>
                  <div className="text-xs text-slate-500 truncate">{contentBlocks.unknown.headline}</div>
                </div>

                <div className={`p-3 rounded-lg border transition-all ${userIntent === 'mortgage' ? 'border-green-500 bg-green-50 ring-1 ring-green-500' : 'border-slate-200 bg-white'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700">If Intent == 'Mortgage'</span>
                    {userIntent === 'mortgage' && <span className="text-[10px] bg-green-600 text-white px-2 py-0.5 rounded-full">ACTIVE</span>}
                  </div>
                  <div className="text-xs text-slate-500 truncate">{contentBlocks.mortgage.headline}</div>
                </div>

                <div className={`p-3 rounded-lg border transition-all ${userIntent === 'wealth' ? 'border-purple-500 bg-purple-50 ring-1 ring-purple-500' : 'border-slate-200 bg-white'}`}>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-700">If Intent == 'Wealth'</span>
                    {userIntent === 'wealth' && <span className="text-[10px] bg-purple-600 text-white px-2 py-0.5 rounded-full">ACTIVE</span>}
                  </div>
                  <div className="text-xs text-slate-500 truncate">{contentBlocks.wealth.headline}</div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: NEXT.JS FRONTEND (End User View) */}
      <div className="w-2/3 bg-slate-200 flex flex-col relative overflow-hidden">
        
        {/* Next.js Developer Header */}
        <div className="bg-slate-800 text-slate-300 p-2 flex items-center justify-between text-xs px-4 border-b border-slate-700">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-mono text-white"><Monitor size={14}/> localhost:3000{currentRoute}</span>
            {isNavigating && <span className="text-[#0037FF] flex items-center gap-1 animate-pulse"><Zap size={12}/> Fetching from Graph...</span>}
          </div>
          <div className="flex gap-2">
             <Smartphone size={14} className="cursor-pointer hover:text-white" />
             <Monitor size={14} className="cursor-pointer text-white" />
          </div>
        </div>

        {/* Browser Window Wrapper */}
        <div className="flex-1 p-6 overflow-y-auto bg-slate-200/80">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden border border-slate-100 flex flex-col min-h-[700px] transform transition-all duration-300 relative">
            
            {/* Overlay during navigation */}
            {isNavigating && (
              <div className="absolute inset-0 bg-white/60 backdrop-blur-[1px] z-50 flex items-center justify-center">
                <div className="h-8 w-8 rounded-full border-4 border-slate-200 border-t-[#005596] animate-spin"></div>
              </div>
            )}

            {/* ESL Simulated Header */}
            <header className="bg-white border-b border-slate-100 py-4 px-6 flex justify-between items-center sticky top-0 z-20 shadow-sm">
              <div 
                className="flex items-center gap-2 cursor-pointer hover:opacity-80 transition-opacity"
                onClick={() => navigateTo('/')}
              >
                <div className="w-10 h-10 bg-[#005596] rounded flex items-center justify-center text-white font-bold text-xl shadow-inner">E</div>
                <div className="font-bold text-[#005596] text-xl tracking-tight hidden sm:block">ESL Federal Credit Union</div>
              </div>
              <nav className="flex gap-4 md:gap-8 text-sm font-semibold text-slate-600">
                <button onClick={() => navigateTo('/')} className={`hover:text-[#005596] transition-colors ${currentRoute === '/' ? 'text-[#005596]' : ''}`}>Home</button>
                <button onClick={() => navigateTo('/mortgage-calculator')} className={`hover:text-[#005596] flex items-center gap-1 transition-colors ${currentRoute === '/mortgage-calculator' ? 'text-[#005596]' : ''}`}>
                   Mortgages
                </button>
                <button onClick={() => navigateTo('/wealth-planning')} className={`hover:text-[#005596] transition-colors ${currentRoute === '/wealth-planning' ? 'text-[#005596]' : ''}`}>Wealth</button>
              </nav>
            </header>

            {/* MAIN CONTENT AREA - DYNAMIC ROUTING */}
            <main className="flex-1 bg-white flex flex-col">
              
              {/* ROUTE: HOME PAGE */}
              {currentRoute === '/' && (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                  {/* Dynamic Intent Hero */}
                  <div className={`transition-all duration-700 ease-in-out py-20 px-8 md:px-16 text-center ${activeContent.bg} ${activeContent.text}`}>
                    {userIntent !== 'unknown' && (
                      <div className="inline-flex items-center gap-1 bg-white/20 px-3 py-1 rounded-full text-xs font-bold mb-6 animate-pulse">
                        <Sparkles size={12} /> Personalized for you
                      </div>
                    )}
                    <h1 className="text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-4 max-w-3xl mx-auto">
                      {activeContent.headline}
                    </h1>
                    <p className="text-lg md:text-xl mb-8 max-w-2xl mx-auto opacity-90">
                      {activeContent.subhead}
                    </p>
                    <button className="inline-flex items-center gap-2 px-8 py-4 rounded-full font-bold text-sm bg-[#e21b22] text-white transition-transform hover:scale-105 shadow-lg">
                      {activeContent.cta}
                      <ChevronRight size={16} />
                    </button>
                  </div>

                  <div className="py-16 text-center">
                    <p className="text-slate-500 font-medium mb-6">Click a section below to simulate exploring the site.</p>
                    <div className="flex justify-center gap-4">
                      <button 
                        onClick={() => navigateTo('/mortgage-calculator')}
                        className="flex flex-col items-center p-6 border border-slate-200 rounded-xl hover:border-green-400 hover:shadow-md transition-all group"
                      >
                        <div className="w-12 h-12 bg-slate-100 group-hover:bg-green-100 rounded-full flex items-center justify-center mb-3 transition-colors text-2xl">
                          🏠
                        </div>
                        <span className="font-semibold text-slate-700 group-hover:text-green-700">Explore Mortgages</span>
                      </button>

                      <button 
                        onClick={() => navigateTo('/wealth-planning')}
                        className="flex flex-col items-center p-6 border border-slate-200 rounded-xl hover:border-purple-400 hover:shadow-md transition-all group"
                      >
                        <div className="w-12 h-12 bg-slate-100 group-hover:bg-purple-100 rounded-full flex items-center justify-center mb-3 transition-colors text-2xl">
                          📈
                        </div>
                        <span className="font-semibold text-slate-700 group-hover:text-purple-700">Wealth Planning</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* ROUTE: MORTGAGE CALCULATOR */}
              {currentRoute === '/mortgage-calculator' && (
                <div className="p-12 animate-in fade-in slide-in-from-bottom-4 flex-1 bg-slate-50">
                  <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200">
                    <div className="inline-block bg-green-100 text-green-700 p-2 rounded-lg mb-4">🏠</div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Mortgage Calculator</h2>
                    <p className="text-slate-600 mb-8">Estimate your monthly payments.</p>
                    
                    <div className="space-y-4 mb-8">
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Home Price</label>
                        <input type="text" disabled value="$350,000" className="w-full p-3 bg-slate-100 border border-slate-200 rounded text-slate-700" />
                      </div>
                      <div>
                        <label className="block text-sm font-semibold text-slate-600 mb-1">Down Payment</label>
                        <input type="text" disabled value="$70,000 (20%)" className="w-full p-3 bg-slate-100 border border-slate-200 rounded text-slate-700" />
                      </div>
                    </div>
                    
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3 text-sm text-blue-800 items-start mb-6">
                      <MousePointerClick className="shrink-0 mt-0.5 text-[#0037FF]" size={18} />
                      <p><strong>Demo Note:</strong> Simply by visiting this page, the ODP engine on the left has captured your <strong>Mortgage Intent</strong>. Click 'Home' in the navigation bar to see how the homepage has dynamically changed for you.</p>
                    </div>
                  </div>
                </div>
              )}

              {/* ROUTE: WEALTH PLANNING */}
              {currentRoute === '/wealth-planning' && (
                <div className="p-12 animate-in fade-in slide-in-from-bottom-4 flex-1 bg-slate-50">
                  <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl shadow-sm border border-slate-200 text-center">
                    <div className="inline-block bg-purple-100 text-purple-700 p-4 rounded-full mb-4 text-3xl">📈</div>
                    <h2 className="text-3xl font-bold text-slate-800 mb-2">Wealth Management Report</h2>
                    <p className="text-slate-600 mb-8">Read our latest insights on estate planning.</p>
                    
                    <div className="h-40 bg-slate-100 border-2 border-dashed border-slate-300 rounded flex items-center justify-center text-slate-400 mb-8 font-mono text-sm">
                      [ PDF Viewer Placeholder ]
                    </div>
                    
                    <div className="p-4 bg-blue-50 border border-blue-100 rounded-lg flex gap-3 text-sm text-blue-800 items-start text-left">
                      <MousePointerClick className="shrink-0 mt-0.5 text-[#0037FF]" size={18} />
                      <p><strong>Demo Note:</strong> Visiting this deep content has fired a <strong>Wealth Intent</strong> signal to ODP. Click 'Home' to see the newly personalized experience.</p>
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