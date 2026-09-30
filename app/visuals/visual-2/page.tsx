'use client';

import React, { useState } from 'react';
import { 
  Monitor, 
  Tablet, 
  Smartphone, 
  ChevronDown, 
  MessageSquare, 
  SplitSquareVertical, 
  Eye, 
  Plus, 
  MoreHorizontal, 
  ChevronRight, 
  Layers, 
  Folder, 
  Image as ImageIcon, 
  FileText, 
  BarChart2, 
  Settings, 
  Grid, 
  Code, 
  ArrowRight, 
  Sparkles, 
  Bold, 
  Italic, 
  Link2, 
  Heading1, 
  Heading2, 
  List, 
  ShieldCheck, 
  Heart, 
  Lock, 
  ExternalLink,
  Check,
  Search,
  Bell,
  HelpCircle,
  User,
  Zap
} from 'lucide-react';

export default function VisualBuilderMock() {
  const [activeVariation, setActiveVariation] = useState('Original');
  const [variationDropdownOpen, setVariationDropdownOpen] = useState(false);
  const [deviceView, setDeviceView] = useState('desktop');
  const [isEditing, setIsEditing] = useState(false);
  const [published, setPublished] = useState(false);
  const [showPresenterNotes, setShowPresenterNotes] = useState(true);

  // Editable Content States per Variation
  const [content, setContent] = useState({
    Original: {
      tag: "PILOT EMPLOYER ONBOARDING",
      headline: "Reclaim Your Momentum, on Your Terms.",
      body: "Change rarely happens because someone tells you what to do. It happens when you find your own reasons to begin. Whether you're navigating work stress, improving sleep, or managing a chronic condition, Hygia™ is here to listen—never prescribe.",
      cta: "Begin 3-Minute Reflection with Hygia™",
      hygiaGreeting: "Hello! I'm Hygia. I'm not here to give you a checklist or tell you what to do. What’s on your mind today regarding your health or work stress?",
      themeColor: "#0D9488", // Teal
      targetAudience: "All Eligible Acme Health Employees"
    },
    Variation1: {
      tag: "MALE EMPLOYEE COHORT (OUTREACH VARIANT A)",
      headline: "Burnout Isn't Weakness. It’s Data. Let’s Fix the Engine.",
      body: "High performance takes a toll on physical stamina, cognitive bandwidth, and recovery. In 3 confidential minutes, identify the friction points in your routine and build self-directed micro-habits that actually stick.",
      cta: "Start Confidential Performance Reset",
      hygiaGreeting: "Welcome. Most wellness tools feel like a waste of time. Let's get straight to the point: what's one area of your routine or recovery that feels compromised right now?",
      themeColor: "#0284C7", // Slate Blue
      targetAudience: "Male Demographic • Stress & Recovery Track"
    },
    Variation2: {
      tag: "FEMALE EMPLOYEE COHORT (OUTREACH VARIANT B)",
      headline: "Carrying Everything for Everyone Else? Time to Reset Your Space.",
      body: "Between career demands and personal commitments, self-care is often the first thing sacrificed. Hygia provides a private, zero-judgment sounding board to unpack mental load and establish boundaries that protect your well-being.",
      cta: "Explore Balance with Hygia™",
      hygiaGreeting: "Hi there. Taking time for yourself often feels like another chore on the list. If we carved out just 3 minutes right now, what is one thing that would give you breathing room today?",
      themeColor: "#7C3AED", // Violet
      targetAudience: "Female Demographic • Cognitive Load & Balance"
    }
  });

  const handleTextChange = (field, value) => {
    setContent(prev => ({
      ...prev,
      [activeVariation]: {
        ...prev[activeVariation],
        [field]: value
      }
    }));
  };

  const handlePublish = () => {
    setPublished(true);
    setTimeout(() => setPublished(false), 3000);
  };

  const current = content[activeVariation];

  return (
    <div className="flex flex-col h-screen bg-[#f3f4f6] text-slate-800 font-sans select-none overflow-hidden">
      
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
          <button className="flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-gradient-to-r from-purple-500/10 via-pink-500/10 to-teal-500/10 border border-purple-200 text-purple-700 font-medium text-[11px] hover:shadow-sm">
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
      {/* SECONDARY TOOLBAR: Visual Builder Experience Controls */}
      {/* ========================================================= */}
      <div className="h-12 bg-white border-b border-slate-200 px-4 flex items-center justify-between text-xs shrink-0 z-20">
        
        {/* Left: Page Title & Save Status */}
        <div className="flex items-center gap-2.5">
          <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600" title="Outline Toggle">
            <Layers className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-slate-100 rounded text-slate-600 font-bold" title="Add Section">
            <Plus className="w-4 h-4" />
          </button>
          <div className="h-4 w-px bg-slate-200" />
          <span className="font-bold text-slate-800 text-sm">cco</span>
          <button className="p-1 hover:bg-slate-100 rounded text-slate-400">
            <MoreHorizontal className="w-3.5 h-3.5" />
          </button>
          <span className="px-2 py-0.5 rounded text-[10px] font-bold tracking-wider bg-emerald-50 text-emerald-700 border border-emerald-200 uppercase">
            AUTOSAVED
          </span>
        </div>

        {/* Middle: Device Viewport Switches */}
        <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200">
          <button 
            onClick={() => setDeviceView('desktop')}
            className={`p-1.5 rounded ${deviceView === 'desktop' ? 'bg-white shadow-sm text-teal-700' : 'text-slate-500 hover:text-slate-800'}`}
            title="Desktop Preview"
          >
            <Monitor className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setDeviceView('tablet')}
            className={`p-1.5 rounded ${deviceView === 'tablet' ? 'bg-white shadow-sm text-teal-700' : 'text-slate-500 hover:text-slate-800'}`}
            title="Tablet Preview"
          >
            <Tablet className="w-4 h-4" />
          </button>
          <button 
            onClick={() => setDeviceView('mobile')}
            className={`p-1.5 rounded ${deviceView === 'mobile' ? 'bg-white shadow-sm text-teal-700' : 'text-slate-500 hover:text-slate-800'}`}
            title="Mobile Preview"
          >
            <Smartphone className="w-4 h-4" />
          </button>
        </div>

        {/* Right Controls: Language, VARIATIONS DROPDOWN, Publish */}
        <div className="flex items-center gap-2 relative">
          
          {/* Language Selector */}
          <div className="flex flex-col text-[10px] text-slate-400">
            <span>Language</span>
            <div className="flex items-center gap-1 font-semibold text-slate-700 cursor-pointer">
              <span>English (Master)</span>
              <ChevronDown className="w-3 h-3 text-slate-400" />
            </div>
          </div>

          <div className="h-6 w-px bg-slate-200 mx-1" />

          {/* ========================================================= */}
          {/* THE VARIATIONS DROPDOWN (Matches your uploaded screenshot) */}
          {/* ========================================================= */}
          <div className="relative">
            <div 
              onClick={() => setVariationDropdownOpen(!variationDropdownOpen)}
              className="flex flex-col text-[10px] text-slate-400 cursor-pointer bg-slate-50 hover:bg-slate-100 border border-slate-300 rounded px-2.5 py-1 transition-all"
            >
              <span>Variations</span>
              <div className="flex items-center justify-between gap-2 font-bold text-slate-900">
                <span>{activeVariation}</span>
                <ChevronDown className={`w-3.5 h-3.5 text-slate-500 transition-transform ${variationDropdownOpen ? 'rotate-180' : ''}`} />
              </div>
            </div>

            {/* Dropdown Menu Overlay */}
            {variationDropdownOpen && (
              <div className="absolute right-0 top-12 w-64 bg-white border border-slate-200 rounded-lg shadow-2xl py-1.5 z-50 text-xs animate-in fade-in slide-in-from-top-1 duration-150">
                <div className="px-3 py-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-100">
                  Targeted Cohort Experiences
                </div>
                
                {/* Original Option */}
                <button
                  onClick={() => { setActiveVariation('Original'); setVariationDropdownOpen(false); }}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 ${activeVariation === 'Original' ? 'bg-teal-50/70 text-teal-900 font-bold' : 'text-slate-700'}`}
                >
                  <div>
                    <div className="font-semibold">Original</div>
                    <div className="text-[10px] text-slate-400">Default Baseline Landing Experience</div>
                  </div>
                  {activeVariation === 'Original' && <Check className="w-4 h-4 text-teal-600" />}
                </button>

                {/* Variation 1 Option (Male Cohort) */}
                <button
                  onClick={() => { setActiveVariation('Variation1'); setVariationDropdownOpen(false); }}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 ${activeVariation === 'Variation1' ? 'bg-teal-50/70 text-teal-900 font-bold' : 'text-slate-700'}`}
                >
                  <div>
                    <div className="font-semibold flex items-center gap-1.5">
                      <span>Variation1</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-blue-100 text-blue-700 font-bold">MALE</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Recovery &amp; Performance Messaging</div>
                  </div>
                  {activeVariation === 'Variation1' && <Check className="w-4 h-4 text-teal-600" />}
                </button>

                {/* Variation 2 Option (Female Cohort) */}
                <button
                  onClick={() => { setActiveVariation('Variation2'); setVariationDropdownOpen(false); }}
                  className={`w-full px-3 py-2 text-left flex items-center justify-between hover:bg-slate-50 ${activeVariation === 'Variation2' ? 'bg-teal-50/70 text-teal-900 font-bold' : 'text-slate-700'}`}
                >
                  <div>
                    <div className="font-semibold flex items-center gap-1.5">
                      <span>Variation2</span>
                      <span className="px-1.5 py-0.2 rounded text-[9px] bg-purple-100 text-purple-700 font-bold">FEMALE</span>
                    </div>
                    <div className="text-[10px] text-slate-400">Balance &amp; Mental Load Messaging</div>
                  </div>
                  {activeVariation === 'Variation2' && <Check className="w-4 h-4 text-teal-600" />}
                </button>

                <div className="border-t border-slate-100 my-1" />
                
                <button className="w-full px-3 py-1.5 text-left text-teal-700 font-semibold hover:bg-teal-50 flex items-center gap-1.5">
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add variation (e.g. HealthSignals™ Cohort)</span>
                </button>
              </div>
            )}
          </div>

          <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500" title="Comments">
            <MessageSquare className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500" title="Split Comparison">
            <SplitSquareVertical className="w-4 h-4" />
          </button>
          <button className="p-1.5 hover:bg-slate-100 rounded text-slate-500" title="Public Preview">
            <Eye className="w-4 h-4" />
          </button>

          {/* Green Publish Button */}
          <div className="flex items-center">
            <button 
              onClick={handlePublish}
              className={`px-3 py-1.5 rounded-l font-bold text-xs flex items-center gap-1.5 transition-all ${
                published 
                  ? 'bg-emerald-600 text-white' 
                  : 'bg-[#66CC00] hover:bg-[#5CB800] text-slate-950 font-bold shadow-sm'
              }`}
            >
              {published ? <Check className="w-3.5 h-3.5" /> : null}
              <span>{published ? 'Published!' : 'Publish'}</span>
            </button>
            <button className="bg-[#5CB800] hover:bg-[#52A300] text-slate-950 px-1 py-1.5 rounded-r border-l border-emerald-600">
              <ChevronDown className="w-3.5 h-3.5" />
            </button>
          </div>

        </div>

      </div>

      {/* ========================================================= */}
      {/* MAIN WORKSPACE: LEFT RAIL + OUTLINE PANEL + LIVE CANVAS */}
      {/* ========================================================= */}
      <div className="flex flex-1 overflow-hidden relative">
        
        {/* Leftmost Vertical Icon Rail */}
        <aside className="w-11 bg-white border-r border-slate-200 flex flex-col items-center py-3 gap-4 shrink-0 text-slate-500">
          <button className="p-1.5 hover:bg-slate-100 rounded hover:text-slate-800"><Layers className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-slate-100 rounded hover:text-slate-800"><Folder className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-slate-100 rounded hover:text-slate-800"><ImageIcon className="w-4 h-4" /></button>
          <button className="p-1.5 bg-teal-50 text-teal-700 rounded border border-teal-200"><FileText className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-slate-100 rounded hover:text-slate-800"><BarChart2 className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-slate-100 rounded hover:text-slate-800"><Settings className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-slate-100 rounded hover:text-slate-800"><Grid className="w-4 h-4" /></button>
          <button className="p-1.5 hover:bg-slate-100 rounded hover:text-slate-800"><Code className="w-4 h-4" /></button>
          <div className="mt-auto">
            <button className="p-1.5 hover:bg-slate-100 rounded hover:text-slate-800"><ArrowRight className="w-4 h-4" /></button>
          </div>
        </aside>

        {/* Left Outline Tree Panel */}
        <aside className="w-72 bg-white border-r border-slate-200 flex flex-col shrink-0 text-xs">
          <div className="p-3 border-b border-slate-200 flex items-center justify-between font-bold text-slate-700">
            <span>Outline</span>
            <div className="flex items-center gap-1 text-slate-400">
              <Plus className="w-3.5 h-3.5 hover:text-slate-700 cursor-pointer" />
              <MoreHorizontal className="w-3.5 h-3.5 hover:text-slate-700 cursor-pointer" />
            </div>
          </div>
          
          <div className="p-2 border-b border-slate-100 flex items-center justify-between text-slate-500 font-medium cursor-pointer hover:bg-slate-50">
            <span>Properties</span>
            <ChevronRight className="w-3.5 h-3.5" />
          </div>

          {/* Populated Component Outline Tree */}
          <div className="p-3 space-y-2 overflow-y-auto flex-1 font-mono text-[11px]">
            <div className="text-[10px] uppercase tracking-wider text-slate-400 font-sans font-bold mb-1">Experience Layout Tree</div>
            
            {/* Section 1: Co-Branded Header */}
            <div className="bg-slate-50 p-2 rounded border border-slate-200">
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <ChevronDown className="w-3 h-3 text-slate-400" />
                <span>Section: Co-Brand Header</span>
              </div>
              <div className="ml-4 mt-1 pl-2 border-l border-slate-200 space-y-1 text-slate-600">
                <div className="text-slate-500">↳ Row (1 Column)</div>
                <div className="text-teal-700 font-medium font-sans">↳ AcmeHealthLogoBlock</div>
              </div>
            </div>

            {/* Section 2: Clinical Intake Hero (Targeted by Variation) */}
            <div className="bg-teal-50/60 p-2 rounded border border-teal-200">
              <div className="flex items-center justify-between font-bold text-teal-900">
                <div className="flex items-center gap-1.5">
                  <ChevronDown className="w-3 h-3 text-teal-600" />
                  <span>Section: Clinical Hero</span>
                </div>
                <span className="px-1 py-0.2 rounded text-[9px] bg-teal-200 text-teal-800 font-sans font-bold">
                  {activeVariation}
                </span>
              </div>
              <div className="ml-4 mt-1 pl-2 border-l border-teal-300 space-y-1 text-slate-700">
                <div className="text-slate-500">↳ Row (2 Columns 60/40)</div>
                <div className="text-teal-800 font-medium font-sans">↳ Col 1: ClinicalMotivationalBlock</div>
                <div className="text-slate-600 font-medium font-sans">↳ Col 2: HygiaChatModalPreview</div>
              </div>
            </div>

            {/* Section 3: Trust & Crisis Governance */}
            <div className="bg-slate-50 p-2 rounded border border-slate-200">
              <div className="flex items-center gap-1.5 font-bold text-slate-700">
                <ChevronDown className="w-3 h-3 text-slate-400" />
                <span>Section: Clinical Governance</span>
              </div>
              <div className="ml-4 mt-1 pl-2 border-l border-slate-200 space-y-1 text-slate-600">
                <div className="text-slate-500">↳ Row (1 Column)</div>
                <div className="text-slate-700 font-medium font-sans">↳ HIPAA &amp; Crisis988TrustBlock</div>
              </div>
            </div>
          </div>

          <div className="p-3 border-t border-slate-200 bg-slate-50 text-[11px] text-slate-500">
            <div>Tenant: <strong className="text-slate-700">acme-health</strong></div>
            <div>Cohort: <strong className="text-slate-700">{current.targetAudience}</strong></div>
          </div>
        </aside>

        {/* ========================================================= */}
        {/* CENTER CANVASES: Simulated Live Page Preview */}
        {/* ========================================================= */}
        <main className="flex-1 overflow-y-auto p-6 flex flex-col items-center bg-[#f3f4f6]">
          
          {/* Top Host indicator (Matches screenshot 'Open on localhost:3024') */}
          <div className="w-full max-w-4xl flex items-center justify-between mb-2 text-xs text-slate-400">
            <span className="font-mono text-[11px]">URL Path: /pilot/acme-health/?variant={activeVariation.toLowerCase()}</span>
            <div className="flex items-center gap-1 text-slate-500 hover:text-slate-800 cursor-pointer font-sans">
              <span>Open on localhost:3024</span>
              <ExternalLink className="w-3 h-3" />
            </div>
          </div>

          {/* Device Frame */}
          <div className={`transition-all duration-300 bg-white shadow-2xl rounded-xl border border-slate-300 overflow-hidden ${
            deviceView === 'desktop' ? 'w-full max-w-4xl' : deviceView === 'tablet' ? 'w-[680px]' : 'w-[375px]'
          }`}>
            
            {/* Live Co-Branded Header Bar */}
            <div className="bg-[#003822] text-white px-6 py-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-xl font-bold tracking-tight text-[#A6E22E]">Acme Health</span>
                <span className="text-emerald-400 font-light text-sm">×</span>
                <span className="text-sm font-semibold text-slate-200 tracking-wide">Center for Care Optimization</span>
              </div>
              <div className="hidden sm:flex items-center gap-4 text-xs text-emerald-100">
                <span className="flex items-center gap-1"><Lock className="w-3 h-3 text-emerald-400" /> 100% Confidential</span>
                <span className="px-2.5 py-1 rounded-full bg-emerald-800/60 font-semibold text-[#A6E22E]">Pilot Cohort</span>
              </div>
            </div>

            {/* Floating Rich-Text Editor Toolbar (Appears when editing) */}
            {isEditing && (
              <div className="bg-slate-900 text-white px-3 py-1.5 text-xs flex items-center gap-2 border-b border-slate-700 animate-in fade-in duration-100">
                <span className="text-[10px] text-teal-400 font-bold uppercase tracking-wider">Dr. Kay's Clinical Editor:</span>
                <div className="h-3 w-px bg-slate-700" />
                <button className="p-1 hover:bg-slate-800 rounded font-bold"><Bold className="w-3.5 h-3.5" /></button>
                <button className="p-1 hover:bg-slate-800 rounded italic"><Italic className="w-3.5 h-3.5" /></button>
                <button className="p-1 hover:bg-slate-800 rounded"><Heading1 className="w-3.5 h-3.5" /></button>
                <button className="p-1 hover:bg-slate-800 rounded"><Heading2 className="w-3.5 h-3.5" /></button>
                <button className="p-1 hover:bg-slate-800 rounded"><List className="w-3.5 h-3.5" /></button>
                <button className="p-1 hover:bg-slate-800 rounded"><Link2 className="w-3.5 h-3.5" /></button>
                <div className="ml-auto flex items-center gap-2">
                  <span className="text-[10px] text-emerald-400 font-mono">Motivational Interviewing Guardrails Active</span>
                  <button 
                    onClick={() => setIsEditing(false)}
                    className="px-2 py-0.5 rounded bg-teal-600 text-white font-bold text-[10px] hover:bg-teal-500"
                  >
                    Done
                  </button>
                </div>
              </div>
            )}

            {/* Visual Builder Canvas Main Hero Section */}
            <div className="p-8 md:p-12 relative bg-gradient-to-b from-slate-50 to-white">
              
              {/* Blue Visual Builder Component Hover Boundary */}
              <div 
                onClick={() => setIsEditing(true)}
                className={`p-6 rounded-xl border-2 transition-all cursor-pointer relative ${
                  isEditing 
                    ? 'border-teal-500 bg-white ring-4 ring-teal-500/10 shadow-lg' 
                    : 'border-dashed border-teal-400/80 hover:border-teal-600 hover:bg-white/80'
                }`}
              >
                {/* Visual Builder Component Label Tag */}
                <div className="absolute -top-3 left-4 bg-teal-600 text-white px-2 py-0.5 rounded text-[10px] font-bold tracking-wide uppercase flex items-center gap-1 shadow">
                  <Sparkles className="w-3 h-3" />
                  <span>ClinicalHeroBlock (Variation: {activeVariation})</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-12 gap-8 items-center">
                  
                  {/* Left Column: Motivational Interviewing Copy */}
                  <div className="md:col-span-7 space-y-4">
                    <span className="inline-block text-[11px] font-bold tracking-wider uppercase text-teal-700 bg-teal-50 border border-teal-200 px-2.5 py-0.5 rounded-full">
                      {current.tag}
                    </span>

                    {/* Editable Headline */}
                    {isEditing ? (
                      <input 
                        type="text" 
                        value={current.headline}
                        onChange={(e) => handleTextChange('headline', e.target.value)}
                        className="w-full text-2xl md:text-3xl font-extrabold text-slate-900 border-b-2 border-teal-500 focus:outline-none bg-teal-50/30 p-1 rounded"
                      />
                    ) : (
                      <h1 className="text-2xl md:text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
                        {current.headline}
                      </h1>
                    )}

                    {/* Editable Motivational Body */}
                    {isEditing ? (
                      <textarea 
                        rows={4}
                        value={current.body}
                        onChange={(e) => handleTextChange('body', e.target.value)}
                        className="w-full text-sm text-slate-600 border-2 border-teal-500 focus:outline-none bg-teal-50/30 p-2 rounded leading-relaxed font-sans"
                      />
                    ) : (
                      <p className="text-sm md:text-base text-slate-600 leading-relaxed">
                        {current.body}
                      </p>
                    )}

                    {/* CTA Button */}
                    <div className="pt-2">
                      <button className="px-6 py-3 rounded-lg font-bold text-sm text-white shadow-md hover:shadow-lg transition-all flex items-center gap-2 bg-[#003822] hover:bg-[#004d2e]">
                        <span>{current.cta}</span>
                        <ArrowRight className="w-4 h-4 text-[#A6E22E]" />
                      </button>
                    </div>

                    <div className="text-[11px] text-slate-400 italic">
                      Click text to simulate Dr. Kay's live editorial control.
                    </div>
                  </div>

                  {/* Right Column: Simulated Hygia AI Conversational Modal */}
                  <div className="md:col-span-5">
                    <div className="bg-slate-900 text-white rounded-2xl p-5 shadow-2xl border border-slate-800 relative">
                      <div className="flex items-center justify-between pb-3 border-b border-slate-800">
                        <div className="flex items-center gap-2">
                          <div className="w-3 h-3 rounded-full bg-teal-400 animate-pulse" />
                          <span className="font-bold text-xs tracking-wide text-white">Hygia™ MI Agent</span>
                        </div>
                        <span className="text-[10px] text-slate-400 font-mono">Confidential</span>
                      </div>

                      {/* Chat Bubble */}
                      <div className="mt-4 p-3.5 bg-slate-800/90 rounded-xl rounded-tl-none text-xs leading-relaxed text-slate-200 border border-slate-700/60">
                        "{current.hygiaGreeting}"
                      </div>

                      <div className="mt-4 flex gap-2">
                        <div className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3 py-2 text-[11px] text-slate-500">
                          Type how you're feeling...
                        </div>
                        <div className="w-8 h-8 rounded-lg bg-teal-600 flex items-center justify-center text-white">
                          <ArrowRight className="w-4 h-4" />
                        </div>
                      </div>

                      <div className="mt-3 text-[10px] text-center text-slate-500">
                        Evidence-based Motivational Interviewing • No diagnosis
                      </div>
                    </div>
                  </div>

                </div>
              </div>

              {/* Trust & Clinical Governance Footer Block */}
              <div className="mt-8 pt-6 border-t border-slate-200 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-500">
                <div className="flex items-start gap-2">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-700 block">Clinical Governance</strong>
                    Led by Dr. Kay Jewell, MD. Motivational Interviewing protocol.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Lock className="w-4 h-4 text-teal-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-700 block">Strict Privacy Guarantee</strong>
                    100% HIPAA-compliant. Zero individual data shared with Acme Health.
                  </div>
                </div>
                <div className="flex items-start gap-2">
                  <Heart className="w-4 h-4 text-rose-500 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-700 block">24/7 Crisis Support</strong>
                    Immediate 988 Suicide &amp; Crisis Lifeline integration.
                  </div>
                </div>
              </div>

            </div>

          </div>

          {/* Quick instructions indicator */}
          <div className="mt-4 text-xs text-slate-500 text-center">
            Tip for Marvin: Click the <strong className="text-teal-700">Variations</strong> dropdown at the top right to switch between <strong>Original</strong>, <strong>Variation1 (Male)</strong>, and <strong>Variation2 (Female)</strong>.
          </div>
        </main>

      </div>

      {/* ========================================================= */}
      {/* Marvin's In-Call Presentation Prompter (Collapsible) */}
      {/* ========================================================= */}
      {showPresenterNotes && (
        <div className="bg-slate-900 border-t border-slate-800 p-3 text-xs text-slate-300 flex flex-col md:flex-row items-center justify-between gap-3 shrink-0 z-40">
          <div className="flex items-center gap-2">
            <span className="px-2 py-0.5 rounded bg-teal-500/20 text-teal-400 font-bold text-[10px] uppercase">
              Marvin's Cue
            </span>
            <span>
              {activeVariation === 'Original' && "Showing Baseline Portal: Address Dr. Kay on clinical copy editing live without dev tickets."}
              {activeVariation === 'Variation1' && "Showing Variation1 (Male): Address Dawn on dynamic cohort conversion rules without code duplication."}
              {activeVariation === 'Variation2' && "Showing Variation2 (Female): Highlight how tone shifts from performance to cognitive balance."}
            </span>
          </div>
          <div className="flex items-center gap-3">
            <button 
              onClick={() => setIsEditing(!isEditing)}
              className="text-teal-400 hover:text-teal-300 font-semibold underline text-[11px]"
            >
              {isEditing ? "Close Inline Editor" : "Simulate Live Text Click"}
            </button>
            <button 
              onClick={() => setShowPresenterNotes(false)}
              className="text-slate-500 hover:text-slate-400 text-[11px]"
            >
              Hide Cue Bar
            </button>
          </div>
        </div>
      )}

    </div>
  );
}
