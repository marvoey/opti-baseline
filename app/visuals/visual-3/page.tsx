'use client';

import React, { useState } from 'react';
import { 
  Play, 
  Sparkles, 
  Copy, 
  Check, 
  ChevronDown, 
  Code2, 
  Layers, 
  Folder, 
  Image as ImageIcon, 
  FileText, 
  BarChart2, 
  Settings, 
  Grid, 
  Code, 
  Search, 
  Bell, 
  HelpCircle, 
  RefreshCw, 
  Sliders, 
  ArrowRight,
  Zap,
  Star,
  Maximize2,
  Terminal,
  ExternalLink
} from 'lucide-react';

export default function GraphiQLVisualMock() {
  const [activeTab, setActiveTab] = useState('employerQuery');
  const [isRunning, setIsRunning] = useState(false);
  const [hasExecuted, setHasExecuted] = useState(true);
  const [selectedEmployer, setSelectedEmployer] = useState('acme-health');
  const [selectedCohort, setSelectedCohort] = useState('Variation1_Male');
  const [bottomTab, setBottomTab] = useState('Variables');
  const [copied, setCopied] = useState(false);
  const [showNotes, setShowNotes] = useState(true);

  // Queries pre-loaded
  const sampleQuery = `query GetEmployerWellnessPortal($clientSlug: String!, $cohortVariant: String!) {
  EmployerLandingPage(
    where: { 
      clientSlug: { eq: $clientSlug }
    }
  ) {
    items {
      clientSlug
      companyName
      brandThemeColor
      
      # Co-Branded Header
      header {
        partnerLogoUrl
        coBrandLabel
        confidentialityBadge
      }
      
      # Dynamic Cohort Intervention (Resolved via Personalization)
      clinicalHero(variation: $cohortVariant) {
        cohortTag
        headline
        motivationalBodyCopy
        hygiaIntakeCtaText
        hygiaSessionEndpoint
      }
      
      # Clinical Safety & Regulatory Guardrails
      clinicalGovernance {
        oversightLead
        hipaaProtected
        crisisSupportContact
      }
    }
  }
}`;

  const queryVariables = {
    clientSlug: selectedEmployer,
    cohortVariant: selectedCohort
  };

  const getJsonResponse = () => {
    const isMale = selectedCohort.includes('Male');
    const isFemale = selectedCohort.includes('Female');

    return {
      data: {
        EmployerLandingPage: {
          items: [
            {
              clientSlug: selectedEmployer,
              companyName: selectedEmployer === 'acme-health' ? "Acme Health" : "Beacon Logistics",
              brandThemeColor: isMale ? "#0284C7" : isFemale ? "#7C3AED" : "#0D9488",
              header: {
                partnerLogoUrl: `https://cdn.cco.health/assets/${selectedEmployer}-logo.svg`,
                coBrandLabel: `${selectedEmployer === 'acme-health' ? 'Acme Health' : 'Beacon Logistics'} × Center for Care Optimization`,
                confidentialityBadge: "100% Confidential • HIPAA-Protected"
              },
              clinicalHero: {
                cohortTag: isMale 
                  ? "MALE EMPLOYEE COHORT (OUTREACH VARIANT A)" 
                  : isFemale 
                  ? "FEMALE EMPLOYEE COHORT (OUTREACH VARIANT B)" 
                  : "PILOT EMPLOYER ONBOARDING",
                headline: isMale
                  ? "Burnout Isn't Weakness. It’s Data. Let’s Fix the Engine."
                  : isFemale
                  ? "Carrying Everything for Everyone Else? Time to Reset Your Space."
                  : "Reclaim Your Momentum, on Your Terms.",
                motivationalBodyCopy: isMale
                  ? "High performance takes a toll on physical stamina, cognitive bandwidth, and recovery. In 3 confidential minutes, identify friction points in your routine and build self-directed micro-habits that actually stick."
                  : isFemale
                  ? "Between career demands and personal commitments, self-care is often the first thing sacrificed. Hygia provides a private, zero-judgment sounding board to unpack mental load and establish sustainable boundaries."
                  : "Change rarely happens because someone tells you what to do. It happens when you find your own reasons to begin. Hygia™ is here to listen—never prescribe.",
                hygiaIntakeCtaText: isMale
                  ? "Start Confidential Performance Reset"
                  : isFemale
                  ? "Explore Balance with Hygia™"
                  : "Begin 3-Minute Reflection with Hygia™",
                hygiaSessionEndpoint: `wss://hygia-agent.cco.internal/v1/stream?client=${selectedEmployer}&cohort=${selectedCohort}`
              },
              clinicalGovernance: {
                oversightLead: "Dr. Kay Jewell, MD (Chief Medical & AI Officer)",
                hipaaProtected: true,
                crisisSupportContact: "988 Suicide & Crisis Lifeline (24/7 Toll-Free)"
              }
            }
          ]
        }
      },
      extensions: {
        serverExecutionMs: 18,
        cacheStatus: "HIT (Edge CDN)",
        optimizelyGraphVersion: "3.33.0"
      }
    };
  };

  const handleRun = () => {
    setIsRunning(true);
    setTimeout(() => {
      setIsRunning(false);
      setHasExecuted(true);
    }, 280);
  };

  const handleCopy = () => {
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="flex flex-col h-screen bg-[#f8fafc] text-slate-800 font-sans select-none overflow-hidden">
      
      {/* ========================================================= */}
      {/* TOP CMS SAAS SUITE HEADER (Authentic Optimizely SaaS Chrome) */}
      {/* ========================================================= */}
      <header className="h-11 bg-white border-b border-slate-200 px-3 flex items-center justify-between text-xs shrink-0 z-30">
        <div className="flex items-center gap-2">
          {/* Optimizely Logo Icon */}
          <div className="w-5 h-5 bg-[#003822] rounded flex items-center justify-center font-bold text-[10px] text-[#A6E22E] tracking-tighter">
            OPT
          </div>
          <div className="flex items-center gap-1.5 text-slate-600 font-medium">
            <span className="hover:text-slate-900 cursor-pointer">Optimizely Solution Architects</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
            <span className="text-slate-300">/</span>
            <span className="hover:text-slate-900 cursor-pointer">Content Management System (epsamoey001: Production1)</span>
            <ChevronDown className="w-3 h-3 text-slate-400" />
            <span className="text-slate-300">/</span>
            <span className="text-slate-900 font-semibold">CMS</span>
          </div>
        </div>

        <div className="flex items-center gap-2.5">
          <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-teal-500/10 border border-purple-200 text-purple-700 font-medium text-[11px]">
            <Sparkles className="w-3 h-3 text-purple-600" />
            <span>Ask Opal</span>
          </button>
          <Search className="w-3.5 h-3.5 text-slate-500 hover:text-slate-700 cursor-pointer" />
          <Bell className="w-3.5 h-3.5 text-slate-500 hover:text-slate-700 cursor-pointer" />
          <HelpCircle className="w-3.5 h-3.5 text-slate-500 hover:text-slate-700 cursor-pointer" />
          <div className="w-6 h-6 rounded-full bg-teal-600 text-white flex items-center justify-center text-[10px] font-bold">
            MO
          </div>
        </div>
      </header>

      {/* ========================================================= */}
      {/* SECONDARY SUITE TABS & STATUS BAR */}
      {/* ========================================================= */}
      <div className="h-10 bg-white border-b border-slate-200 px-4 flex items-center justify-between text-xs shrink-0 z-20">
        <div className="flex items-center gap-2">
          {/* GraphiQL Query Tab Pill */}
          <div className="flex items-center bg-slate-100 rounded-md border border-slate-200 px-3 py-1 font-mono text-[11px] text-slate-700 font-semibold">
            <span>&lt;CCO_Employer_Portal_Query&gt;</span>
          </div>
          <button className="p-1 hover:bg-slate-100 rounded text-slate-400" title="New Tab">
            +
          </button>
        </div>

        {/* Optimizely Graph Branded Indicator */}
        <div className="flex items-center gap-2">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-700">
            <span className="text-[#003822] font-black tracking-tight">Optimizely</span>
            <span className="text-slate-300">|</span>
            <span className="text-indigo-600 font-bold flex items-center gap-1">
              <Zap className="w-3 h-3 text-indigo-500 fill-indigo-500" />
              Graph
            </span>
          </div>
          <span className="text-[10px] bg-indigo-50 border border-indigo-200 text-indigo-700 px-2 py-0.5 rounded font-mono font-medium">
            Production GraphQL Endpoint
          </span>
        </div>
      </div>

      {/* ========================================================= */}
      {/* MAIN GRAPHIQL WORKSPACE */}
      {/* ========================================================= */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Leftmost Vertical Icon Rail (Replicating Screenshot Left Rail) */}
        <aside className="w-11 bg-white border-r border-slate-200 flex flex-col items-center py-3 gap-4 shrink-0 text-slate-500">
          <button className="p-1.5 hover:bg-slate-100 rounded hover:text-slate-800"><Layers className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-slate-100 rounded hover:text-slate-800"><RefreshCw className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-slate-100 rounded hover:text-slate-800"><Folder className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-slate-100 rounded hover:text-slate-800"><ImageIcon className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-slate-100 rounded hover:text-slate-800"><FileText className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-slate-100 rounded hover:text-slate-800"><Sliders className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-slate-100 rounded hover:text-slate-800"><BarChart2 className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-slate-100 rounded hover:text-slate-800"><Settings className="w-4 h-4" /></button>
          <button className="p-1.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-200" title="GraphQL IDE active">
            <Code2 className="w-4 h-4" />
          </button>
          
          <div className="mt-auto space-y-3">
            <button className="p-1.5 hover:bg-slate-100 rounded hover:text-slate-800"><RefreshCw className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-slate-100 rounded hover:text-slate-800"><Settings className="w-4 h-4" /></button>
            <button className="p-1.5 hover:bg-slate-100 rounded hover:text-slate-800"><ArrowRight className="w-4 h-4" /></button>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* LEFT COLUMN: QUERY EDITOR (Lines 1 to 31+) */}
        {/* ========================================================= */}
        <section className="w-1/2 flex flex-col bg-white border-r border-slate-200 relative">
          
          {/* Query Editor Header & Action Bar */}
          <div className="h-8 bg-slate-50 border-b border-slate-200 px-3 flex items-center justify-between text-[11px] text-slate-500">
            <span className="font-mono text-slate-700 font-medium">Operation: query GetEmployerWellnessPortal</span>
            <div className="flex items-center gap-3">
              <span className="text-[10px] text-slate-400">Shortcuts: Ctrl+Enter (Run)</span>
            </div>
          </div>

          {/* Code Text Area with Line Numbers & Play Button */}
          <div className="flex-1 flex overflow-hidden relative">
            
            {/* Line Numbers */}
            <div className="w-10 bg-slate-50 border-r border-slate-100 py-3 text-right pr-2 font-mono text-xs text-slate-300 select-none leading-relaxed">
              {Array.from({ length: 30 }, (_, i) => (
                <div key={i + 1}>{i + 1}</div>
              ))}
            </div>

            {/* Query Content */}
            <div className="flex-1 p-3 overflow-y-auto font-mono text-xs text-slate-800 leading-relaxed bg-white">
              <pre className="text-slate-800">
                <span className="text-pink-600 font-bold">query</span> <span className="text-purple-700 font-bold">GetEmployerWellnessPortal</span>(
                <span className="text-amber-700">$clientSlug</span>: <span className="text-teal-700">String!</span>, 
                <span className="text-amber-700">$cohortVariant</span>: <span className="text-teal-700">String!</span>
                ) &#123;{'\n'}
                {'  '}<span className="text-blue-600 font-semibold">EmployerLandingPage</span>(
                {'\n    '}where: &#123; 
                {'\n      '}<span className="text-slate-600">clientSlug</span>: &#123; <span className="text-indigo-600">eq</span>: <span className="text-amber-700">$clientSlug</span> &#125;
                {'\n    '}&#125;
                {'\n  '}) &#123;
                {'\n    '}<span className="text-slate-700 font-medium">items</span> &#123;
                {'\n      '}<span className="text-slate-700">clientSlug</span>
                {'\n      '}<span className="text-slate-700">companyName</span>
                {'\n      '}<span className="text-slate-700">brandThemeColor</span>
                {'\n'}
                {'\n      '}<span className="text-slate-400 italic"># Co-Branded Header Configured by Dawn</span>
                {'\n      '}<span className="text-slate-700">header</span> &#123;
                {'\n        '}<span className="text-slate-700">partnerLogoUrl</span>
                {'\n        '}<span className="text-slate-700">coBrandLabel</span>
                {'\n        '}<span className="text-slate-700">confidentialityBadge</span>
                {'\n      '}&#125;
                {'\n'}
                {'\n      '}<span className="text-slate-400 italic"># Dynamic Cohort Resolution (M/F Outreach)</span>
                {'\n      '}<span className="text-blue-600 font-semibold">clinicalHero</span>(<span className="text-slate-600">variation</span>: <span className="text-amber-700">$cohortVariant</span>) &#123;
                {'\n        '}<span className="text-slate-700">cohortTag</span>
                {'\n        '}<span className="text-slate-700 font-bold text-teal-800">headline</span>
                {'\n        '}<span className="text-slate-700 font-bold text-teal-800">motivationalBodyCopy</span>
                {'\n        '}<span className="text-slate-700">hygiaIntakeCtaText</span>
                {'\n        '}<span className="text-purple-700 font-bold">hygiaSessionEndpoint</span>
                {'\n      '}&#125;
                {'\n'}
                {'\n      '}<span className="text-slate-400 italic"># Governed by Dr. Kay Jewell, MD</span>
                {'\n      '}<span className="text-slate-700">clinicalGovernance</span> &#123;
                {'\n        '}<span className="text-slate-700">oversightLead</span>
                {'\n        '}<span className="text-slate-700">hipaaProtected</span>
                {'\n        '}<span className="text-slate-700">crisisSupportContact</span>
                {'\n      '}&#125;
                {'\n    '}&#125;
                {'\n  '}&#125;
                {'\n'}&#125;
              </pre>
            </div>

            {/* Vertical Action Tool Ribbon (Matches Magenta Play Button in your Screenshot) */}
            <div className="w-10 bg-white border-l border-slate-100 flex flex-col items-center py-2 gap-3 text-slate-400 shrink-0">
              {/* Magenta Play Button (Exact match from screenshot) */}
              <button 
                onClick={handleRun}
                className="w-8 h-8 rounded-full bg-[#E6007A] hover:bg-[#D0006E] text-white flex items-center justify-center shadow-md hover:scale-105 transition-all"
                title="Execute Query (Ctrl-Enter)"
              >
                <Play className={`w-4 h-4 ml-0.5 fill-white ${isRunning ? 'animate-spin' : ''}`} />
              </button>

              <button className="p-1 hover:text-slate-700" title="Prettify Query"><Sparkles className="w-4 h-4" /></button>
              <button className="p-1 hover:text-slate-700" title="History"><Copy className="w-4 h-4" /></button>
              <button className="p-1 hover:text-slate-700" title="Documentation Explorer"><Maximize2 className="w-4 h-4" /></button>
              <button className="p-1 hover:text-slate-700" title="Star Query"><Star className="w-4 h-4" /></button>
              <span className="text-[10px] font-mono text-slate-400 hover:text-slate-600 cursor-pointer mt-1">Old</span>
            </div>

          </div>

          {/* Bottom Drawer: Variables / Headers */}
          <div className="h-44 border-t border-slate-200 bg-white flex flex-col shrink-0">
            <div className="flex items-center justify-between px-3 h-8 bg-slate-50 border-b border-slate-200 text-xs">
              <div className="flex gap-4">
                <button 
                  onClick={() => setBottomTab('Variables')}
                  className={`font-semibold pb-1 border-b-2 transition-all ${bottomTab === 'Variables' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  Query Variables
                </button>
                <button 
                  onClick={() => setBottomTab('Headers')}
                  className={`font-semibold pb-1 border-b-2 transition-all ${bottomTab === 'Headers' ? 'border-indigo-600 text-indigo-700' : 'border-transparent text-slate-500 hover:text-slate-800'}`}
                >
                  Request Headers
                </button>
              </div>

              {/* Quick Interactive Variable Selectors for Live Demo */}
              <div className="flex items-center gap-2">
                <span className="text-[10px] text-slate-500">Test Client:</span>
                <select 
                  value={selectedEmployer}
                  onChange={(e) => setSelectedEmployer(e.target.value)}
                  className="text-[11px] bg-white border border-slate-300 rounded px-1.5 py-0.5 font-mono text-slate-700"
                >
                  <option value="acme-health">acme-health</option>
                  <option value="beacon-logistics">beacon-logistics</option>
                </select>

                <span className="text-[10px] text-slate-500 ml-1">Cohort:</span>
                <select 
                  value={selectedCohort}
                  onChange={(e) => setSelectedCohort(e.target.value)}
                  className="text-[11px] bg-white border border-slate-300 rounded px-1.5 py-0.5 font-mono text-slate-700"
                >
                  <option value="Variation1_Male">Variation1_Male</option>
                  <option value="Variation2_Female">Variation2_Female</option>
                  <option value="Original_Default">Original_Default</option>
                </select>
              </div>
            </div>

            <div className="p-2.5 flex-1 font-mono text-xs overflow-y-auto bg-slate-50/50">
              {bottomTab === 'Variables' ? (
                <pre className="text-slate-700">
                  {JSON.stringify(queryVariables, null, 2)}
                </pre>
              ) : (
                <pre className="text-slate-500">
                  &#123;{'\n'}
                  {'  '}"Authorization": "Bearer opti-token-live-cco-pilot",{"\n"}
                  {'  '}"X-Delivery-Channel": "Nextjs-Edge-Client"{"\n"}
                  &#125;
                </pre>
              )}
            </div>
          </div>

        </section>

        {/* ========================================================= */}
        {/* RIGHT COLUMN: JSON RESPONSE VIEWER */}
        {/* ========================================================= */}
        <section className="w-1/2 flex flex-col bg-[#fcfdfe] relative">
          
          {/* Response Viewer Header */}
          <div className="h-8 bg-slate-50 border-b border-slate-200 px-3 flex items-center justify-between text-[11px] text-slate-500">
            <div className="flex items-center gap-2">
              <span className="font-mono text-slate-700 font-semibold">Response: 200 OK</span>
              <span className="px-1.5 py-0.2 rounded text-[10px] bg-emerald-100 text-emerald-800 font-bold font-mono">
                18 ms (Edge CDN)
              </span>
            </div>

            <div className="flex items-center gap-2">
              <button 
                onClick={handleCopy}
                className="flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-800"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy JSON'}</span>
              </button>
            </div>
          </div>

          {/* JSON Tree Display */}
          <div className="flex-1 p-4 font-mono text-xs overflow-y-auto bg-[#fafbfc] leading-relaxed">
            {isRunning ? (
              <div className="h-full flex flex-col items-center justify-center text-slate-400 gap-2">
                <RefreshCw className="w-5 h-5 animate-spin text-indigo-500" />
                <span>Executing GraphQL Query against Graph CDN...</span>
              </div>
            ) : hasExecuted ? (
              <pre className="text-slate-800">
                <span className="text-slate-500">&#123;</span>{'\n'}
                {'  '}<span className="text-purple-600">"data"</span>: &#123;{'\n'}
                {'    '}<span className="text-purple-600">"EmployerLandingPage"</span>: &#123;{'\n'}
                {'      '}<span className="text-purple-600">"items"</span>: [{'\n'}
                {'        '}&#123;{'\n'}
                {'          '}<span className="text-blue-600">"clientSlug"</span>: <span className="text-emerald-700">"{selectedEmployer}"</span>,{'\n'}
                {'          '}<span className="text-blue-600">"companyName"</span>: <span className="text-emerald-700">"{selectedEmployer === 'acme-health' ? 'Acme Health' : 'Beacon Logistics'}"</span>,{'\n'}
                {'          '}<span className="text-blue-600">"brandThemeColor"</span>: <span className="text-emerald-700">"{selectedCohort.includes('Male') ? '#0284C7' : selectedCohort.includes('Female') ? '#7C3AED' : '#0D9488'}"</span>,{'\n'}
                {'\n'}
                {'          '}<span className="text-slate-400 italic">// Consumed directly by Agency React Header</span>{'\n'}
                {'          '}<span className="text-blue-600">"header"</span>: &#123;{'\n'}
                {'            '}<span className="text-blue-600">"partnerLogoUrl"</span>: <span className="text-emerald-700">"https://cdn.cco.health/assets/{selectedEmployer}-logo.svg"</span>,{'\n'}
                {'            '}<span className="text-blue-600">"coBrandLabel"</span>: <span className="text-emerald-700">"{selectedEmployer === 'acme-health' ? 'Acme Health' : 'Beacon Logistics'} × Center for Care Optimization"</span>,{'\n'}
                {'            '}<span className="text-blue-600">"confidentialityBadge"</span>: <span className="text-emerald-700">"100% Confidential • HIPAA-Protected"</span>{'\n'}
                {'          '}&#125;,{'\n'}
                {'\n'}
                {'          '}<span className="text-slate-400 italic">// Dynamic Cohort Content (Resolved by Dr. Kay &amp; Dawn)</span>{'\n'}
                {'          '}<span className="text-blue-600">"clinicalHero"</span>: &#123;{'\n'}
                {'            '}<span className="text-blue-600">"cohortTag"</span>: <span className="text-emerald-700">"{selectedCohort.includes('Male') ? 'MALE EMPLOYEE COHORT (OUTREACH VARIANT A)' : selectedCohort.includes('Female') ? 'FEMALE EMPLOYEE COHORT (OUTREACH VARIANT B)' : 'PILOT EMPLOYER ONBOARDING'}"</span>,{'\n'}
                {'            '}<span className="text-blue-600 font-bold">"headline"</span>: <span className="text-teal-900 font-bold bg-teal-50">"{selectedCohort.includes('Male') ? "Burnout Isn't Weakness. It’s Data. Let’s Fix the Engine." : selectedCohort.includes('Female') ? "Carrying Everything for Everyone Else? Time to Reset Your Space." : "Reclaim Your Momentum, on Your Terms."}"</span>,{'\n'}
                {'            '}<span className="text-blue-600">"motivationalBodyCopy"</span>: <span className="text-slate-700">"{selectedCohort.includes('Male') ? "High performance takes a toll on physical stamina, cognitive bandwidth, and recovery. In 3 confidential minutes, identify friction points in your routine..." : selectedCohort.includes('Female') ? "Between career demands and personal commitments, self-care is often the first thing sacrificed. Hygia provides a private, zero-judgment sounding board..." : "Change rarely happens because someone tells you what to do. It happens when you find your own reasons to begin..."}"</span>,{'\n'}
                {'            '}<span className="text-blue-600">"hygiaIntakeCtaText"</span>: <span className="text-emerald-700">"{selectedCohort.includes('Male') ? 'Start Confidential Performance Reset' : selectedCohort.includes('Female') ? 'Explore Balance with Hygia™' : 'Begin 3-Minute Reflection with Hygia™'}"</span>,{'\n'}
                {'            '}<span className="text-blue-600 font-bold">"hygiaSessionEndpoint"</span>: <span className="text-purple-700 font-mono font-bold bg-purple-50">"wss://hygia-agent.cco.internal/v1/stream?client={selectedEmployer}&amp;cohort={selectedCohort}"</span>{'\n'}
                {'          '}&#125;,{'\n'}
                {'\n'}
                {'          '}<span className="text-slate-400 italic">// Clinical Compliance Guardrails</span>{'\n'}
                {'          '}<span className="text-blue-600">"clinicalGovernance"</span>: &#123;{'\n'}
                {'            '}<span className="text-blue-600">"oversightLead"</span>: <span className="text-emerald-700">"Dr. Kay Jewell, MD (Chief Medical &amp; AI Officer)"</span>,{'\n'}
                {'            '}<span className="text-blue-600">"hipaaProtected"</span>: <span className="text-amber-600 font-bold">true</span>,{'\n'}
                {'            '}<span className="text-blue-600">"crisisSupportContact"</span>: <span className="text-emerald-700">"988 Suicide &amp; Crisis Lifeline (24/7 Toll-Free)"</span>{'\n'}
                {'          '}&#125;{'\n'}
                {'        '}&#125;{'\n'}
                {'      '}]{'\n'}
                {'    '}&#125;{'\n'}
                {'  '}&#125;,{'\n'}
                {'  '}<span className="text-purple-600">"extensions"</span>: &#123;{'\n'}
                {'    '}<span className="text-blue-600">"serverExecutionMs"</span>: <span className="text-indigo-600 font-bold">18</span>,{'\n'}
                {'    '}<span className="text-blue-600">"cacheStatus"</span>: <span className="text-emerald-600 font-bold">"HIT (Edge CDN)"</span>,{'\n'}
                {'    '}<span className="text-blue-600">"optimizelyGraphVersion"</span>: <span className="text-slate-600">"3.33.0"</span>{'\n'}
                {'  '}&#125;{'\n'}
                <span className="text-slate-500">&#125;</span>
              </pre>
            ) : null}
          </div>

          {/* Bottom Footer Info (Matches screenshot footer with commit/version info) */}
          <div className="h-6 bg-slate-50 border-t border-slate-200 px-3 flex items-center justify-between text-[10px] text-slate-400 font-mono">
            <span>Elapsed time: 18 ms</span>
            <span>env: prod | name: optiq-prod | commit: f16840 | version: 3.33.0 | versionTS: 2026-09-30T18:13:29Z</span>
          </div>

        </section>

      </div>

      {/* ========================================================= */}
      {/* MARVIN'S IN-CALL TALK TRACK PROMPTER (Collapsible) */}
      {/* ========================================================= */}
      {showNotes && (
        <footer className="bg-slate-900 border-t border-slate-800 p-3 text-xs text-slate-300 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0 z-40">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-indigo-500/20 text-indigo-300 font-bold text-[10px] uppercase">
              Marvin's Agency Architect Talk Track
            </span>
            <span className="text-slate-200">
              "Here is why your incoming agency architect will love this: <strong>zero custom databases</strong>. Everything Dr. Kay and Dawn publish in Visual Builder is instantly delivered as high-speed GraphQL JSON at the edge."
            </span>
          </div>
          <div className="flex items-center gap-3 shrink-0">
            <button 
              onClick={handleRun}
              className="text-indigo-400 hover:text-indigo-300 font-semibold underline text-[11px] flex items-center gap-1"
            >
              <Play className="w-3 h-3 fill-indigo-400" />
              Re-Execute Query
            </button>
            <button 
              onClick={() => setShowNotes(false)}
              className="text-slate-500 hover:text-slate-400 text-[11px]"
            >
              Hide Cue Bar
            </button>
          </div>
        </footer>
      )}

    </div>
  );
}
