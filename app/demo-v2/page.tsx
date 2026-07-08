'use client';

import React, { useState, useEffect, useRef } from 'react';

type ScenarioId = 'live_discounts' | 'resolve' | 'simulate';

interface ChatMsg {
  id: number;
  role: 'init' | 'user' | 'ai';
  text: string;
}

const TABS: { id: ScenarioId; label: string }[] = [
  { id: 'live_discounts', label: 'Intent 1: Consult (Live Data)' },
  { id: 'resolve',        label: 'Intent 2: Resolve / Support' },
  { id: 'simulate',       label: 'Intent 3: Simulate / Transact' },
];

const DATA = {
  live_discounts: {
    intent: 'Consultation / Upsell',
    layout: 'Dashboard (Side-by-Side)',
    blocks: 'Live Progressive.com Data (Snapshot, Bundle, Vehicle Protection)',
    query: 'What coverage options and discounts can I offer a customer to lower their auto premium?',
    reply: "I've pulled the active auto insurance discounts and coverage options directly from the Progressive.com catalog. I've highlighted the Bundle & Save and Snapshot programs as your best levers to lower their premium.",
  },
  resolve: {
    intent: 'Resolve / Support',
    layout: 'Split Layout (60/40)',
    blocks: 'Prose Extract + Compliance Disclaimer',
    query: 'What roadside assistance applies to an Ohio auto policy transition?',
    reply: "I've assembled the active Ohio transition rules and mandatory disclaimers.",
  },
  simulate: {
    intent: 'Simulate / Transact',
    layout: 'Side-by-Side (Interactive Form)',
    blocks: 'Action Form + Dynamic Context Help',
    query: 'Guide me through filing a Commercial Auto glass claim.',
    reply: "I've generated the Glass Claim workflow. Contextual guidance will automatically update as you fill out the form.",
  },
} as const;

const INIT_MSG: ChatMsg = {
  id: 0,
  role: 'init',
  text: 'I am connected to the live Progressive Auto Insurance knowledge base. Select a scenario tab above to begin a simulated live interaction.',
};

// ── UI panels ──────────────────────────────────────────────────────────────

function LiveDiscountsUI() {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden slide-in-right flex flex-col h-[600px]">
      <div className="bg-[#007bc4] text-white p-5 flex justify-between items-start flex-shrink-0">
        <div>
          <h2 className="text-2xl font-bold">Auto Coverage &amp; Discounts Playbook</h2>
          <p className="text-blue-100 text-sm mt-1">Sourced from Progressive.com / Auto</p>
        </div>
        <span className="bg-blue-800 text-xs px-3 py-1 rounded-full font-semibold">Live Data Mode</span>
      </div>
      <div className="flex flex-1 overflow-hidden">
        <div className="w-1/2 p-6 overflow-y-auto border-r border-gray-100 bg-gray-50">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Savings &amp; Discount Toolkit</h3>
          <div className="space-y-4">
            {[
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />,
                iconColor: 'text-[#00a900]',
                title: 'Bundle & Save',
                body: <>New customers who bundle Home and Auto policies save an average of <strong>$1,086</strong>.</>,
                note: 'Script: "Do you own your home or rent? We can combine those to drop this premium."',
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />,
                iconColor: 'text-[#007bc4]',
                title: 'Snapshot® Program',
                body: <>Customers who drive safe save an average of <strong>$328 annually</strong>.</>,
                note: 'Note: Not available in CA or from all agents.',
              },
              {
                icon: <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />,
                iconColor: 'text-purple-500',
                title: "Name Your Price® Tool",
                body: "Allows you to input the customer's budget to see which coverages fit their price range.",
                note: null,
              },
            ].map(({ icon, iconColor, title, body, note }) => (
              <div key={title} className="bg-white border border-gray-200 rounded p-4 shadow-sm hover:border-[#007bc4] cursor-pointer transition">
                <div className="flex items-center mb-2">
                  <svg className={`w-5 h-5 mr-2 ${iconColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">{icon}</svg>
                  <h4 className="font-bold text-gray-800">{title}</h4>
                </div>
                <p className="text-sm text-gray-600">{body}</p>
                {note && <p className="text-xs text-gray-400 mt-2 italic">{note}</p>}
              </div>
            ))}
          </div>
        </div>

        <div className="w-1/2 p-6 overflow-y-auto bg-white">
          <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-4 border-b border-gray-200 pb-2">Coverage Options to Review</h3>
          <div className="space-y-5">
            <div>
              <h4 className="text-sm font-bold text-gray-800">Comprehensive &amp; Collision</h4>
              <p className="text-sm text-gray-600 mt-1">Recommended for new/high-value vehicles. Ask if they have an active auto loan (required by lenders).</p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-[#007bc4]">Progressive Vehicle Protection (Exclusive)</h4>
              <p className="text-sm text-gray-600 mt-1">Available exclusively for vehicles between 2 and 8 years old. Covers major system repairs after warranty expires.</p>
              <p className="text-xs font-bold text-[#00a900] mt-1">UPSELL OPPORTUNITY</p>
            </div>
            <div>
              <h4 className="text-sm font-bold text-gray-800">Loan/Lease Payoff</h4>
              <p className="text-sm text-gray-600 mt-1">Helps pay the difference between vehicle value and what is owed if totaled. Highly recommended for recently purchased vehicles.</p>
            </div>
            <div className="mt-6 p-4 bg-gray-50 border border-gray-200 rounded text-center">
              <button className="px-6 py-2 bg-[#007bc4] hover:bg-[#005b94] text-white rounded font-bold text-sm transition shadow w-full">Launch AutoQuote Explorer®</button>
              <p className="text-xs text-gray-400 mt-2">Required: ZIP, VIN, Driver&rsquo;s License</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function ResolveUI() {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden slide-in-right">
      <div className="bg-[#007bc4] text-white p-5">
        <h2 className="text-2xl font-bold">Ohio Roadside Assistance</h2>
        <p className="text-blue-100 text-sm mt-1">Out-of-State Transition Guidelines</p>
      </div>
      <div className="flex flex-col md:flex-row p-6 gap-6">
        <div className="flex-1">
          <h3 className="text-lg font-bold text-gray-800 border-b border-gray-200 pb-2 mb-4">Coverage Summary</h3>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start">
              <svg className="w-5 h-5 text-[#00a900] mr-2 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
              <span>Standard Ohio limits apply (up to 15 miles).</span>
            </li>
          </ul>
        </div>
        <div className="w-full md:w-1/3">
          <div className="bg-gray-50 border border-gray-200 rounded p-4">
            <div className="text-xs font-bold uppercase tracking-wider text-gray-500 mb-2">Required Disclaimer</div>
            <p className="text-xs text-gray-600 leading-relaxed italic">&ldquo;Per ORC 3937, roadside assistance limits are subject to local facility availability.&rdquo;</p>
          </div>
        </div>
      </div>
    </div>
  );
}

function SimulateUI() {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-200 overflow-hidden slide-in-right flex h-[500px]">
      <div className="w-1/2 p-8 border-r border-gray-200 flex flex-col">
        <h2 className="text-xl font-bold text-gray-800 mb-6 flex items-center">
          <svg className="w-5 h-5 mr-2 text-[#007bc4]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
          </svg>
          File Commercial Glass Claim
        </h2>
        <div className="space-y-5 flex-1">
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Policy Number</label>
            <input defaultValue="COM-882-91A" className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#007bc4] focus:ring-1 focus:ring-[#007bc4] outline-none" />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-600 uppercase mb-1">Date of Loss</label>
            <input type="date" className="w-full border border-gray-300 rounded p-2 text-sm focus:border-[#007bc4] focus:ring-1 focus:ring-[#007bc4] outline-none" />
          </div>
          <div className="p-3 border-2 border-[#007bc4] rounded bg-blue-50 relative">
            <div className="absolute -left-2 top-3 w-4 h-4 bg-[#007bc4] rounded-full flex items-center justify-center text-white">
              <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </div>
            <label className="block text-xs font-bold text-[#007bc4] uppercase mb-1">Glass Type Damaged</label>
            <select className="w-full border border-[#007bc4] rounded p-2 text-sm focus:outline-none">
              <option>Windshield (Front)</option>
              <option>Side Window</option>
              <option>Rear Glass</option>
            </select>
          </div>
        </div>
        <button className="w-full bg-[#007bc4] hover:bg-[#005b94] text-white font-bold py-3 rounded transition-colors text-sm mt-4">Generate Claim Draft</button>
      </div>
      <div className="w-1/2 bg-gray-50 p-8 flex flex-col">
        <div className="flex items-center gap-2 mb-4 pb-4 border-b border-gray-200">
          <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          <h3 className="text-sm font-bold text-gray-600 uppercase">Contextual Guidance</h3>
        </div>
        <div className="bg-white border border-blue-200 shadow-sm rounded-lg p-5">
          <h4 className="font-bold text-[#007bc4] mb-2">Windshield Claims &amp; ADAS</h4>
          <p className="text-sm text-gray-700 mb-3">Because the user selected &ldquo;Windshield&rdquo;, verify if the commercial vehicle is equipped with Advanced Driver Assistance Systems (ADAS).</p>
          <div className="bg-gray-100 p-3 rounded text-sm text-gray-600 border border-gray-200">
            <strong>Script:</strong> &ldquo;Does your vehicle have lane departure warnings, automatic braking, or rain-sensing wipers?&rdquo;
          </div>
          <p className="text-xs text-red-500 font-bold mt-3 uppercase tracking-wide">If Yes: Recalibration approval required.</p>
        </div>
      </div>
    </div>
  );
}

const UI_PANELS: Record<ScenarioId, React.ReactNode> = {
  live_discounts: <LiveDiscountsUI />,
  resolve:        <ResolveUI />,
  simulate:       <SimulateUI />,
};

// ── Main page ──────────────────────────────────────────────────────────────

export default function DemoV2Page() {
  const [activeTab, setActiveTab]     = useState<ScenarioId | null>(null);
  const [messages, setMessages]       = useState<ChatMsg[]>([INIT_MSG]);
  const [engineVisible, setEngine]    = useState(false);
  const [activeStep, setActiveStep]   = useState(0); // 0=none, 1-3=highlighted
  const [uiVisible, setUiVisible]     = useState(false);
  const timers = useRef<ReturnType<typeof setTimeout>[]>([]);
  const chatRef = useRef<HTMLDivElement>(null);
  let msgId = useRef(1);

  useEffect(() => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  }, [messages]);

  function startScenario(id: ScenarioId) {
    if (id === activeTab) return;

    // clear in-flight timers
    timers.current.forEach(clearTimeout);
    timers.current = [];

    setActiveTab(id);
    setMessages([INIT_MSG]);
    setEngine(false);
    setActiveStep(0);
    setUiVisible(false);

    const push = (fn: () => void, ms: number) =>
      timers.current.push(setTimeout(fn, ms));

    push(() => {
      setMessages(m => [...m, { id: msgId.current++, role: 'user', text: DATA[id].query }]);
      setEngine(true);
    }, 300);

    push(() => setActiveStep(1), 900);
    push(() => setActiveStep(2), 1400);
    push(() => setActiveStep(3), 1900);

    push(() => {
      setUiVisible(true);
      setMessages(m => [...m, { id: msgId.current++, role: 'ai', text: DATA[id].reply }]);
    }, 2500);
  }

  useEffect(() => () => timers.current.forEach(clearTimeout), []);

  const step = activeTab ? DATA[activeTab] : null;

  return (
    <div className="bg-gray-50 flex flex-col h-screen overflow-hidden font-sans text-gray-800">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center shadow-sm z-10 shrink-0">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[#007bc4] rounded flex items-center justify-center text-white font-bold text-xl">P</div>
          <h1 className="text-xl font-bold text-gray-800">Intelligent Enablement Portal</h1>
          <span className="bg-blue-100 text-[#007bc4] text-xs font-semibold px-2 py-1 rounded-full">Live Progressive.com Simulation</span>
        </div>
        <div className="flex items-center gap-4 text-sm">
          <div className="text-right">
            <p className="font-bold text-gray-700">Alex</p>
            <p className="text-gray-500 text-xs">Consultant • Columbus CC</p>
          </div>
          <div className="w-10 h-10 bg-gray-200 rounded-full border-2 border-[#007bc4] overflow-hidden flex items-center justify-center text-gray-400">
            <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
      </header>

      {/* Tab bar */}
      <nav className="bg-white border-b border-gray-200 px-6 flex gap-8 overflow-x-auto shadow-sm z-10 flex-shrink-0">
        {TABS.map(({ id, label }) => (
          <button
            key={id}
            onClick={() => startScenario(id)}
            className={`py-3 text-sm font-bold border-b-2 transition-colors outline-none whitespace-nowrap ${
              activeTab === id
                ? 'text-[#007bc4] border-[#007bc4]'
                : 'text-gray-500 border-transparent hover:text-[#007bc4]'
            }`}
          >
            {label}
          </button>
        ))}
      </nav>

      {/* Workspace */}
      <div className="flex flex-1 overflow-hidden">

        {/* Left: chat */}
        <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col shadow-lg z-10 flex-shrink-0">
          <div className="p-4 border-b border-gray-100 bg-gray-50 flex items-center justify-between">
            <h2 className="text-xs font-bold text-gray-400 uppercase tracking-wider">Assistant Chat</h2>
            <div className="w-2 h-2 bg-[#00a900] rounded-full animate-pulse" />
          </div>
          <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-6">
            {messages.map((msg) => {
              if (msg.role === 'init') return (
                <div key={msg.id} className="flex gap-3">
                  <div className="w-8 h-8 bg-[#007bc4] rounded-full flex-shrink-0 flex items-center justify-center text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <div className="bg-gray-100 rounded-lg p-3 text-sm text-gray-800">{msg.text}</div>
                </div>
              );
              if (msg.role === 'user') return (
                <div key={msg.id} className="flex gap-3 flex-row-reverse fade-in">
                  <div className="w-8 h-8 bg-gray-200 rounded-full border-2 border-[#007bc4] flex-shrink-0" />
                  <div className="max-w-[80%] bg-[#007bc4] text-white rounded-lg p-3 text-sm shadow">{msg.text}</div>
                </div>
              );
              return (
                <div key={msg.id} className="flex gap-3 fade-in">
                  <div className="w-8 h-8 bg-gray-800 rounded-full flex-shrink-0 flex items-center justify-center text-white">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                    </svg>
                  </div>
                  <div className="max-w-[80%] bg-gray-100 border border-gray-200 rounded-lg p-3 text-sm text-gray-800 shadow-sm">{msg.text}</div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Right: assembly engine + generated UI */}
        <div className="w-2/3 bg-gray-100 flex flex-col relative">

          {/* empty state */}
          {!engineVisible && (
            <div className="absolute inset-0 flex flex-col items-center justify-center text-gray-400">
              <svg className="w-16 h-16 mb-4 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 002-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
              </svg>
              <p className="font-medium">Awaiting Scenario Execution…</p>
            </div>
          )}

          {/* assembly engine */}
          {engineVisible && step && (
            <div className="p-6 border-b border-gray-200 bg-white shadow-sm z-10">
              <h3 className="text-xs font-bold text-gray-400 uppercase mb-4 tracking-wider flex items-center gap-1">
                <svg className="w-4 h-4 text-[#007bc4] animate-spin" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Optimizely Content Assembly
              </h3>
              <div className="flex justify-between items-center gap-2">
                {[
                  { n: 1, key: 'intent',  label: '1. Intent',          val: step.intent },
                  { n: 2, key: 'layout',  label: '2. Layout Blueprint', val: step.layout },
                  { n: 3, key: 'blocks',  label: '3. Content Fetch',    val: step.blocks },
                ].map(({ n, label, val }, i, arr) => (
                  <React.Fragment key={n}>
                    <div
                      className={`flex-1 rounded p-2 text-center transition-all ${
                        activeStep >= n ? 'bg-blue-50 border border-blue-200 shadow-sm' : 'bg-gray-100'
                      }`}
                    >
                      <p className="text-[10px] font-bold text-gray-500 uppercase">{label}</p>
                      <p className={`text-xs font-semibold text-gray-800 transition-opacity duration-300 ${activeStep >= n ? 'opacity-100' : 'opacity-0'}`}>{val}</p>
                    </div>
                    {i < arr.length - 1 && (
                      <svg className="w-4 h-4 text-gray-300 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                      </svg>
                    )}
                  </React.Fragment>
                ))}
              </div>
            </div>
          )}

          {/* generated UI */}
          <div className="flex-1 overflow-y-auto p-8 relative z-0">
            {uiVisible && activeTab && UI_PANELS[activeTab]}
          </div>
        </div>
      </div>
    </div>
  );
}
