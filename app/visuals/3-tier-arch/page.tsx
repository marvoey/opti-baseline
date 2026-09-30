'use client';

import React, { useState } from 'react';
import { 
  Layers, 
  Sparkles, 
  Brain, 
  Activity, 
  Layout, 
  Users, 
  ArrowDown, 
  CheckCircle2, 
  ShieldCheck, 
  Zap, 
  Code2, 
  BarChart3, 
  ChevronRight,
  Info,
  Server,
  Lock,
  Globe
} from 'lucide-react';

export default function CCOArchitectureDiagram() {
  const [activeLayer, setActiveLayer] = useState(1);
  const [activePersona, setActivePersona] = useState('female');
  const [activeEmployer, setActiveEmployer] = useState('Acme Health');

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-4 md:p-8 font-sans antialiased selection:bg-teal-500 selection:text-white">
      {/* Top Header */}
      <header className="max-w-6xl mx-auto mb-8 border-b border-slate-800 pb-6 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-500/10 text-teal-400 border border-teal-500/20">
              Target Milestone: Oct 15 Scoping
            </span>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Pilot Scale: 2-3 Employers (100–600 Lives)
            </span>
          </div>
          <h1 className="text-2xl md:text-3xl font-bold tracking-tight text-white flex items-center gap-3">
            <span>Center for Care Optimization (CCO)</span>
            <span className="text-slate-600 font-normal">|</span>
            <span className="text-teal-400 text-xl font-medium">3-Tier Solution Blueprint</span>
          </h1>
          <p className="text-slate-400 text-sm mt-1">
            Decoupling Clinical Governance &amp; Multi-Tenant Co-Branding from Agency Frontend Delivery
          </p>
        </div>

        {/* Interactive Pilot Toggle Preview */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-3 flex items-center gap-3">
          <div className="text-xs">
            <div className="text-slate-400 font-medium">Simulated Pilot Client:</div>
            <div className="font-semibold text-white">{activeEmployer}</div>
          </div>
          <div className="h-6 w-px bg-slate-800" />
          <div className="flex bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
            <button 
              onClick={() => setActivePersona('female')}
              className={`px-2.5 py-1 rounded transition-all font-medium ${
                activePersona === 'female' 
                  ? 'bg-teal-500 text-slate-950 shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Female Cohort
            </button>
            <button 
              onClick={() => setActivePersona('male')}
              className={`px-2.5 py-1 rounded transition-all font-medium ${
                activePersona === 'male' 
                  ? 'bg-teal-500 text-slate-950 shadow-sm' 
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Male Cohort
            </button>
          </div>
        </div>
      </header>

      {/* Main Grid Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Column: Interactive Diagram */}
        <div className="lg:col-span-8 space-y-4">
          
          {/* ========================================================= */}
          {/* LAYER 1: CONTENT & EXPERIENCE LAYER */}
          {/* ========================================================= */}
          <div 
            onClick={() => setActiveLayer(1)}
            className={`cursor-pointer transition-all duration-300 rounded-2xl border p-6 relative overflow-hidden ${
              activeLayer === 1 
                ? 'bg-slate-900/90 border-teal-500 shadow-2xl shadow-teal-500/10 ring-1 ring-teal-500/30' 
                : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-teal-500/5 rounded-full blur-3xl pointer-events-none" />
            
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${
                  activeLayer === 1 
                    ? 'bg-teal-500/20 border-teal-500/40 text-teal-300' 
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  <Layers className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-teal-400">Layer 1</span>
                    <span className="text-slate-500 text-xs">•</span>
                    <span className="text-xs text-slate-400">Optimizely Cloud</span>
                  </div>
                  <h2 className="text-lg font-bold text-white">Content &amp; Experience Governance</h2>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs bg-slate-800/80 border border-slate-700/60 px-3 py-1 rounded-full text-slate-300">
                <Users className="w-3.5 h-3.5 text-teal-400" />
                <span>Dr. Kay (CMAIO) &amp; Dawn (CXO)</span>
              </div>
            </div>

            {/* Architecture Cards Inside Layer 1 */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {/* Box A */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-1.5">
                  <ShieldCheck className="w-4 h-4 text-emerald-400" />
                  <span>Clinical MI Copy &amp; Guardrails</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Owned directly by <strong>Dr. Kay Jewell, MD</strong>. Regulated motivational interviewing prompts, safety guidance, self-care resource libraries, and clinical tone rules.
                </p>
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-teal-400/90 font-mono">
                  <span>Visual Builder</span>
                  <span>•</span>
                  <span>No Dev Tickets</span>
                </div>
              </div>

              {/* Box B */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-1.5">
                  <Layout className="w-4 h-4 text-teal-400" />
                  <span>Multi-Tenant Employer Templates</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Managed by <strong>Dawn Whitelaw</strong>. Spin up {activeEmployer} in minutes with bespoke logo, brand styling, benefit highlights, and targeted male/female variant journeys.
                </p>
                <div className="mt-2.5 flex items-center gap-1.5 text-[11px] text-teal-400/90 font-mono">
                  <span>Audience Rules</span>
                  <span>•</span>
                  <span>M/F Cohort Routing</span>
                </div>
              </div>
            </div>

            {/* Simulated Live Output Preview */}
            <div className="mt-4 pt-3 border-t border-slate-800/70 flex items-center justify-between text-xs text-slate-400">
              <div className="flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Simulated Active Variant:</span>
                <span className="text-white font-medium">
                  {activePersona === 'female' ? 'Holistic Resilience & Stress Coping' : 'Performance Focus & Energy Recovery'}
                </span>
              </div>
              <span className="text-slate-500 font-mono text-[11px]">Slug: /{activeEmployer.toLowerCase().replace(' ', '-')}/?v={activePersona}</span>
            </div>
          </div>

          {/* GraphQL Connector Pipe */}
          <div className="flex flex-col items-center justify-center -my-1 relative z-10">
            <div className="h-4 w-px bg-gradient-to-b from-teal-500 to-blue-500" />
            <div className="bg-slate-900 border border-slate-700/80 px-4 py-1.5 rounded-full text-xs font-mono text-teal-300 flex items-center gap-2 shadow-lg">
              <Zap className="w-3.5 h-3.5 text-teal-400 animate-pulse" />
              <span>Optimizely Graph (High-Speed Headless GraphQL API)</span>
              <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="h-4 w-px bg-gradient-to-b from-teal-500 to-blue-500" />
          </div>

          {/* ========================================================= */}
          {/* LAYER 2: DELIVERY & APPLICATION LAYER */}
          {/* ========================================================= */}
          <div 
            onClick={() => setActiveLayer(2)}
            className={`cursor-pointer transition-all duration-300 rounded-2xl border p-6 relative overflow-hidden ${
              activeLayer === 2 
                ? 'bg-slate-900/90 border-blue-500 shadow-2xl shadow-blue-500/10 ring-1 ring-blue-500/30' 
                : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-blue-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${
                  activeLayer === 2 
                    ? 'bg-blue-500/20 border-blue-500/40 text-blue-300' 
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  <Code2 className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-blue-400">Layer 2</span>
                    <span className="text-slate-500 text-xs">•</span>
                    <span className="text-xs text-slate-400">Agency Frontend</span>
                  </div>
                  <h2 className="text-lg font-bold text-white">Delivery &amp; Client Application Layer</h2>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs bg-slate-800/80 border border-slate-700/60 px-3 py-1 rounded-full text-slate-300">
                <Users className="w-3.5 h-3.5 text-blue-400" />
                <span>External Agency (~5 Heads: PM, Architect, Devs)</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4">
              {/* Box C */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-1.5">
                  <Globe className="w-4 h-4 text-blue-400" />
                  <span>Next.js / React Edge Frontend</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Fast, lightweight client web app deployed on edge infrastructure (Vercel/Cloudflare). Consumes structured CMS schemas via GraphQL. Zero custom CMS backend to maintain.
                </p>
                <div className="mt-2.5 text-[11px] text-blue-400/90 font-mono">
                  Sub-100ms TTFB • Zero Database Overhead
                </div>
              </div>

              {/* Box D */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-1.5">
                  <Zap className="w-4 h-4 text-cyan-400" />
                  <span>Embedded Hygia™ Session Hand-off</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Frictionless transition from the co-branded landing page into the authenticated Hygia coaching modal without jarring redirects or clunky authentication drop-offs.
                </p>
                <div className="mt-2.5 text-[11px] text-blue-400/90 font-mono">
                  Encrypted Session Tokens • Streamed UI
                </div>
              </div>
            </div>
          </div>

          {/* Bi-Directional Event Stream Pipe */}
          <div className="flex flex-col items-center justify-center -my-1 relative z-10">
            <div className="h-4 w-px bg-gradient-to-b from-blue-500 to-indigo-500" />
            <div className="bg-slate-900 border border-slate-700/80 px-4 py-1.5 rounded-full text-xs font-mono text-indigo-300 flex items-center gap-2 shadow-lg">
              <Server className="w-3.5 h-3.5 text-indigo-400 animate-pulse" />
              <span>Event Streaming &amp; Real-Time AI Orchestration API</span>
              <ArrowDown className="w-3.5 h-3.5 text-slate-400" />
            </div>
            <div className="h-4 w-px bg-gradient-to-b from-blue-500 to-indigo-500" />
          </div>

          {/* ========================================================= */}
          {/* LAYER 3: INTELLIGENCE & AI CORE */}
          {/* ========================================================= */}
          <div 
            onClick={() => setActiveLayer(3)}
            className={`cursor-pointer transition-all duration-300 rounded-2xl border p-6 relative overflow-hidden ${
              activeLayer === 3 
                ? 'bg-slate-900/90 border-indigo-500 shadow-2xl shadow-indigo-500/10 ring-1 ring-indigo-500/30' 
                : 'bg-slate-900/40 border-slate-800/80 hover:border-slate-700'
            }`}
          >
            <div className="absolute top-0 right-0 w-48 h-48 bg-indigo-500/5 rounded-full blur-3xl pointer-events-none" />

            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center gap-3">
                <div className={`p-2.5 rounded-xl border ${
                  activeLayer === 3 
                    ? 'bg-indigo-500/20 border-indigo-500/40 text-indigo-300' 
                    : 'bg-slate-800 border-slate-700 text-slate-400'
                }`}>
                  <Brain className="w-5 h-5" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs uppercase font-bold tracking-wider text-indigo-400">Layer 3</span>
                    <span className="text-slate-500 text-xs">•</span>
                    <span className="text-xs text-slate-400">CCO Proprietary IP</span>
                  </div>
                  <h2 className="text-lg font-bold text-white">CCO Intelligence &amp; AI Core</h2>
                </div>
              </div>
              <div className="flex items-center gap-1.5 text-xs bg-slate-800/80 border border-slate-700/60 px-3 py-1 rounded-full text-slate-300">
                <Lock className="w-3.5 h-3.5 text-indigo-400" />
                <span>Protected Enterprise Assets</span>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mt-4">
              {/* Box E: Hygia */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-1.5">
                  <Sparkles className="w-4 h-4 text-teal-400" />
                  <span>Hygia™ MI Agent</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  LLM conversational agent grounded in motivational interviewing. Prompts resolve ambivalence and guide self-care habits without human coach overhead.
                </p>
                <div className="mt-2.5 text-[11px] text-teal-400/90 font-mono">
                  94% UX Comprehension
                </div>
              </div>

              {/* Box F: HealthSignals */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-1.5">
                  <Activity className="w-4 h-4 text-rose-400" />
                  <span>HealthSignals™ Engine</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Predictive comorbidity risk modeling. Specifically isolates the 23% of employees driving &gt;60% of claims costs to trigger proactive interventions.
                </p>
                <div className="mt-2.5 text-[11px] text-rose-400/90 font-mono">
                  Claims Risk Stratification
                </div>
              </div>

              {/* Box G: Employer Dashboard */}
              <div className="bg-slate-950/70 border border-slate-800 rounded-xl p-3.5">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-200 mb-1.5">
                  <BarChart3 className="w-4 h-4 text-amber-400" />
                  <span>Employer Dashboard</span>
                </div>
                <p className="text-xs text-slate-400 leading-relaxed">
                  Aggregated, HIPAA-safe reporting proving 40–60% engagement rates, workforce resilience sentiment, and tangible HEOR healthcare cost reductions.
                </p>
                <div className="mt-2.5 text-[11px] text-amber-400/90 font-mono">
                  Broker Proof-of-Value
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right Column: Strategic Dialogue & Diagnostic Script */}
        <div className="lg:col-span-4 space-y-4">
          
          {/* Active Layer Deep Dive Card */}
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-5 shadow-xl">
            <div className="flex items-center gap-2 text-xs font-bold text-teal-400 uppercase tracking-wider mb-2">
              <Info className="w-4 h-4" />
              <span>Marvin's Architectural Talk Track</span>
            </div>

            {activeLayer === 1 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white">Focus: Protecting Dr. Kay &amp; Dawn's Time</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "If your agency hardcodes these landing pages in React, Dr. Kay has to submit engineering tickets just to adjust a motivational prompt or update clinical resources.
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Layer 1 gives the clinical team visual governance. Dawn creates the Acme Health template; Dr. Kay edits copy; and it’s live across your pilots in seconds."
                </p>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 mt-2">
                  <div className="text-[11px] font-semibold text-teal-400 mb-1">Diagnostic Probe to George &amp; Dawn:</div>
                  <div className="text-xs text-slate-300 italic">
                    "When your broker signs Employer #2 next month, will your agency have to manually clone and maintain a separate codebase, or do you have a centralized model where you launch in 15 minutes?"
                  </div>
                </div>
              </div>
            )}

            {activeLayer === 2 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white">Focus: Agency Velocity &amp; Zero Technical Debt</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "Your agency starts building this week. If they spend 6 weeks building custom content tables, they will blow their budget before even touching Hygia's conversational interface.
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Optimizely Graph gives your agency architect a clean GraphQL schema. They write modern React/Next.js code and never worry about database schemas or content storage."
                </p>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 mt-2">
                  <div className="text-[11px] font-semibold text-blue-400 mb-1">Diagnostic Probe to Agency Architect:</div>
                  <div className="text-xs text-slate-300 italic">
                    "Are you planning to build and host your own content database for client templates, or are you looking for an enterprise headless API that frees your devs to focus on the Hygia frontend?"
                  </div>
                </div>
              </div>
            )}

            {activeLayer === 3 && (
              <div className="space-y-3">
                <h3 className="text-sm font-bold text-white">Focus: The 40–60% Engagement Metric</h3>
                <p className="text-xs text-slate-300 leading-relaxed">
                  "Traditional EAPs die at 3% engagement. To hit 40–60%, the landing page cannot be generic. 
                </p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Layer 1 feeds high-intent, cohort-tailored traffic directly into Hygia, while front-of-funnel drop-off analytics stream straight into your Employer Dashboard to prove ROI to brokers."
                </p>
                <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 mt-2">
                  <div className="text-[11px] font-semibold text-indigo-400 mb-1">Diagnostic Probe to George (CEO/HEOR):</div>
                  <div className="text-xs text-slate-300 italic">
                    "What happens to your broker renewals if you can't prove where employees drop off between the outreach email and completing their first session in Hygia?"
                  </div>
                </div>
              </div>
            )}

            <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-500">Switch focus layer:</span>
              <div className="flex gap-1">
                {[1, 2, 3].map((num) => (
                  <button
                    key={num}
                    onClick={() => setActiveLayer(num)}
                    className={`w-6 h-6 rounded text-xs font-bold transition-all ${
                      activeLayer === num 
                        ? 'bg-teal-500 text-slate-950' 
                        : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {num}
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Value Summary for October 15 Scoping */}
          <div className="bg-slate-900/60 border border-slate-800/80 rounded-2xl p-5">
            <h3 className="text-xs font-bold text-slate-300 uppercase tracking-wider mb-3 flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 text-teal-400" />
              <span>Why This Secures Phase 1 (Oct 15)</span>
            </h3>
            <ul className="space-y-2.5 text-xs text-slate-400">
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                <span><strong>No Agency Re-write:</strong> Code written for the 2–3 pilot employers scales to 50 without technical refactoring.</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                <span><strong>$50k Floor Protection:</strong> Justified against the cost of 2 dedicated agency backend developers ($80k+ burn).</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400 mt-1.5 shrink-0" />
                <span><strong>Founder Independence:</strong> Dr. Kay and Dawn maintain full editorial agility over clinical messaging.</span>
              </li>
            </ul>
          </div>

        </div>

      </div>

      {/* Footer / Hand-off Banner */}
      <div className="max-w-6xl mx-auto mt-8 bg-gradient-to-r from-slate-900 via-slate-900 to-slate-950 border border-slate-800 rounded-xl p-4 flex flex-col md:flex-row items-center justify-between gap-4 text-xs">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-lg bg-teal-500/10 text-teal-400 border border-teal-500/20">
            <ChevronRight className="w-4 h-4" />
          </div>
          <div>
            <div className="font-semibold text-white">Marvin's Hand-off to Halla (AE):</div>
            <div className="text-slate-400 italic">"Halla, knowing this is the architecture required to protect their pilot scale, how does this align with the commercial plan?"</div>
          </div>
        </div>
        <div className="shrink-0 flex items-center gap-2">
          <span className="text-slate-400 font-mono text-[11px]">Next: Step 5 Budget Negative Reverse</span>
        </div>
      </div>
    </div>
  );
}
