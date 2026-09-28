"use client";

import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Globe, 
  Database, 
  Zap, 
  CheckCircle2, 
  ArrowRight, 
  Send, 
  Layers, 
  ShieldCheck, 
  Eye, 
  EyeOff, 
  Terminal, 
  Clock, 
  Check, 
  ChevronRight, 
  RefreshCw, 
  Sliders, 
  Building2, 
  ShoppingBag, 
  Lock, 
  AlertTriangle,
  Play,
  RotateCcw
} from 'lucide-react';

type ProfileKey = 'anonymous' | 'cpg' | 'retail';
type LangKey = 'en' | 'de' | 'fr' | 'ja';

export default function NIQMicroFulfillmentDemo() {
  // Active Teaser Step in the Sandler Micro-Fulfillment Flow
  const [activeTeaser, setActiveTeaser] = useState(1); // 1 = ODP CRM Recognition, 2 = 10-Market Localization, 3 = Closed-Loop Form & Plugin Relief
  const [presenterMode, setPresenterMode] = useState(true); // Shows SA talk-track & under-the-hood API telemetry
  const [showConsole, setShowConsole] = useState(false);

  // Teaser 1 State (ODP Account Recognition)
  const [visitorProfile, setVisitorProfile] = useState<ProfileKey>('cpg');
  const [isResolvingProfile, setIsResolvingProfile] = useState(false);

  // Teaser 2 State (10-Market Localization)
  const [selectedLang, setSelectedLang] = useState<LangKey>('de');
  const [isLocalizing, setIsLocalizing] = useState(false);

  // Teaser 3 State (Lead Ingestion & Plugin Retirement)
  const [formSubmitted, setFormSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: 'Patrick Kühn',
    email: 'patrick.kuhn@nielseniq.com',
    company: 'Unilever Strategy Unit',
    category: 'FMCG Omnichannel Velocity'
  });
  const [selectedPluginFilter, setSelectedPluginFilter] = useState('all');

  // Simulated Telemetry Log
  const [telemetryLogs, setTelemetryLogs] = useState([
    { ts: '10:24:01', type: 'INIT', msg: 'Optimizely Edge Mesh initialized across 120 global PoPs' },
    { ts: '10:24:02', type: 'ODP', msg: 'Bi-directional MS Dynamics CRM connector handshake verified [OK]' }
  ]);

  const addLog = (type: string, msg: string) => {
    const time = new Date().toLocaleTimeString();
    setTelemetryLogs(prev => [{ ts: time, type, msg }, ...prev.slice(0, 15)]);
  };

  // Handle Persona Change in Teaser 1
  const handlePersonaChange = (profileKey: ProfileKey) => {
    setIsResolvingProfile(true);
    setVisitorProfile(profileKey);
    addLog('ODP_SYNC', `Querying Graph edge for persona: ${profileKey.toUpperCase()}`);
    setTimeout(() => {
      setIsResolvingProfile(false);
      addLog('GRAPH_RESOLVE', `Payload reconstituted in 14ms (Cache: HIT, Dynamics Lead Score: 94)`);
    }, 280);
  };

  // Handle Language Change in Teaser 2
  const handleLangChange = (langKey: LangKey) => {
    setIsLocalizing(true);
    setSelectedLang(langKey);
    addLog('GRAPH_I18N', `Edge query dispatched for locale: ${langKey.toUpperCase()}`);
    setTimeout(() => {
      setIsLocalizing(false);
      addLog('EDGE_RENDER', `Localized AST delivered in 16ms across 10-market CDN`);
    }, 220);
  };

  // Handle Form Submission in Teaser 3
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setFormSubmitted(true);
    addLog('DYNAMICS_POST', `Webhook dispatched: MS Dynamics Marketing API (HTTP 201 Created)`);
    addLog('CAMPAIGN_TRIGGER', `Optimizely Campaign: Automated 1:1 Executive Brief sequence queued`);
  };

  // Data dictionary for Teaser 1 & 2
  const personaData = {
    anonymous: {
      accountName: 'Anonymous Visitor',
      crmStatus: 'No CRM Record Linked',
      intentScore: '0 / 100',
      industry: 'General Visitor',
      heroTag: 'The Full View™ of Consumer Intelligence',
      headline: 'Intelligence. Now even smarter.',
      subhead: 'NIQ\'s ecosystem of data, emerging tech, AI and experts delivers the most complete and clear understanding of consumer buying behavior.',
      cta: 'Explore All Solutions',
      featuredReport: '2026 Global Consumer Trends Overview',
      price: '$1,499'
    },
    cpg: {
      accountName: 'Unilever Global Insights (Tier 1)',
      crmStatus: 'Active Sync &bull; Dynamics Record #UNI-8849',
      intentScore: '94 / 100 (High Buying Intent: Shelf Velocity & Optiq)',
      industry: 'Consumer Packaged Goods (CPG)',
      heroTag: 'ODP Identified: Global FMCG Category Leader',
      headline: 'FMCG Intelligence: Category Share & Pricing Elasticity in an AI World',
      subhead: 'Empowering Unilever category managers with real-time scanner data from 21M+ stores to protect volume velocity against private label expansion.',
      cta: 'Download Unilever Custom Category Brief',
      featuredReport: '2026 Global FMCG Market Share & Brand Equity Benchmark',
      price: '$3,800'
    },
    retail: {
      accountName: 'Walmart Global Merchandising',
      crmStatus: 'Active Sync &bull; Dynamics Record #WMT-1102',
      intentScore: '91 / 100 (Researching Omnichannel Grocery Scanner Feeds)',
      industry: 'Retail & Omnichannel Commerce',
      heroTag: 'ODP Identified: Omnichannel Retail Enterprise',
      headline: 'Retail Intelligence: Omnichannel Basket Velocity & Space Optimization',
      subhead: 'Predictive transaction analytics across 177M SKUs to maximize space productivity, eliminate out-of-stocks, and accelerate supplier joint business planning.',
      cta: 'Explore Retail Scanner Suite',
      featuredReport: '2026 Omnichannel Grocery & Shelf Velocity Index',
      price: '$2,950'
    }
  };

  const localizedStrings = {
    en: {
      flag: '🇺🇸',
      name: 'Global (English)',
      stat1: '$7.4T',
      stat1Lbl: 'Global consumer spend measured',
      stat2: '177M',
      stat2Lbl: 'Products tracked across 21M+ stores',
      articleTitle: 'A Tale of Two Consumers: Polarized Mindsets Reshaping Global Consumption',
      badge: 'CPG & Retail Intelligence'
    },
    de: {
      flag: '🇩🇪',
      name: 'Germany (Deutsch)',
      stat1: '€6,8 Bio.',
      stat1Lbl: 'Gemessene Konsumausgaben weltweit',
      stat2: '177 Mio.',
      stat2Lbl: 'Erfasste Produkte in 21 Mio.+ Filialen',
      articleTitle: 'Konsumententrends 2026: Preisdynamik und Eigenmarken-Wachstum im DACH-Handel',
      badge: 'FMCG & Handelsanalyse DACH'
    },
    fr: {
      flag: '🇫🇷',
      name: 'France (Français)',
      stat1: '7,4 T$',
      stat1Lbl: 'Dépenses de consommation analysées',
      stat2: '177M',
      stat2Lbl: 'Produits suivis dans 21M+ points de vente',
      articleTitle: 'Comportement d\'Achat 2026 : La polarisation des ménages face à l\'arbitrage budgétaire',
      badge: 'Grande Consommation & Retail'
    },
    ja: {
      flag: '🇯🇵',
      name: 'Japan (日本語)',
      stat1: '7.4兆ドル',
      stat1Lbl: '測定された世界全体の消費者支出',
      stat2: '1.77億',
      stat2Lbl: '2,100万店舗以上で追跡される製品数',
      articleTitle: '2026年リテールトレンド：オムニチャネル購買行動の劇的変化と勝機',
      badge: '消費財・リテール分析'
    }
  };

  const currentPersona = personaData[visitorProfile];
  const currentLocale = localizedStrings[selectedLang];

  // 9 Plugins Retirement Ledger for Teaser 3
  const retiredPlugins = [
    { name: 'Advanced Custom Fields (ACF)', role: 'Custom Schema & Field Modeling', replacement: 'Native SaaS CMS Content Types & Blueprints', saving: '$2,400/yr' },
    { name: 'Ninja Forms Enterprise', role: 'Lead Capture & Inquiries', replacement: 'Visual Builder Forms + Direct Dynamics Webhooks', saving: '$4,800/yr' },
    { name: 'WPML Multilingual CMS', role: 'Multilingual Translation Management', replacement: 'Optimizely Graph Auto-Localization & Locale Trees', saving: '$3,600/yr' },
    { name: 'Logic Hop Personalization', role: 'Static Geolocation Rules', replacement: 'Optimizely Data Platform (ODP) Real-Time Audiences', saving: '$7,200/yr' },
    { name: 'Nelio A/B Testing Plugin', role: 'Basic Page Optimization', replacement: 'Optimizely Web Experimentation Engine', saving: '$8,400/yr' },
    { name: 'UserWay Accessibility', role: 'Accessibility Overlay Tool', replacement: 'Compliant Semantic HTML + Design System Tokens', saving: '$1,900/yr' },
    { name: 'Yoast SEO Premium', role: 'On-Page Metadata & XML Sitemaps', replacement: 'Automated Graph Meta Ingestion & Headless SEO', saving: '$2,200/yr' },
    { name: 'MailPoet / WooCommerce Mail', role: 'Shop Transactional Notifications', replacement: 'Optimizely Campaign Unified Outbound Messaging', saving: '$5,500/yr' },
    { name: 'Custom PHP Backend Modules', role: 'Internal Site Administration Fixes', replacement: 'Fully Managed Multi-Tenant SaaS Infrastructure', saving: '$48,000/yr dev time' }
  ];

  return (
    <div className="min-h-screen bg-[#E4F0DA] text-[#102412] font-sans antialiased selection:bg-[#ABFF44] selection:text-[#102412]">
      
      {/* ========================================================================= */}
      {/* PRESENTER / SANDLER CONTROL BAR (Top Dock) */}
      {/* ========================================================================= */}
      <header className="sticky top-0 z-50 bg-[#FFFFFF] border-b-2 border-[#7DDD3D]/40 shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 py-2.5 flex flex-wrap items-center justify-between gap-3">
          
          {/* Left: Teaser Stage Navigator */}
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 bg-[#E4F0DA] px-3 py-1.5 rounded-full border border-[#7DDD3D]/50 text-xs font-bold text-[#102412]">
              <span className="h-2.5 w-2.5 rounded-full bg-[#3AB533] animate-pulse"></span>
              Sandler Micro-Fulfillment
            </div>

            <div className="flex items-center bg-[#F4F9F0] p-1 rounded-xl border border-[#7DDD3D]/30">
              <button
                onClick={() => setActiveTeaser(1)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTeaser === 1 
                    ? 'bg-[#3AB533] text-white shadow-sm' 
                    : 'text-slate-600 hover:text-[#102412]'
                }`}
              >
                <span>Teaser 1: ODP Recognition</span>
              </button>
              <button
                onClick={() => setActiveTeaser(2)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTeaser === 2 
                    ? 'bg-[#3AB533] text-white shadow-sm' 
                    : 'text-slate-600 hover:text-[#102412]'
                }`}
              >
                <span>Teaser 2: 10-Market Scale</span>
              </button>
              <button
                onClick={() => setActiveTeaser(3)}
                className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                  activeTeaser === 3 
                    ? 'bg-[#3AB533] text-white shadow-sm' 
                    : 'text-slate-600 hover:text-[#102412]'
                }`}
              >
                <span>Teaser 3: Zero-CSV Ingestion</span>
              </button>
            </div>
          </div>

          {/* Right: Presenter Tools Toggle */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => setShowConsole(!showConsole)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                showConsole 
                  ? 'bg-[#102412] text-[#ABFF44] border-[#102412]' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-[#E4F0DA]'
              }`}
            >
              <Terminal className="w-3.5 h-3.5" />
              <span>Live API Logs</span>
            </button>

            <button
              onClick={() => setPresenterMode(!presenterMode)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${
                presenterMode 
                  ? 'bg-[#ABFF44] text-[#102412] border-[#7DDD3D] shadow-sm' 
                  : 'bg-white text-slate-700 border-slate-300 hover:bg-[#E4F0DA]'
              }`}
            >
              {presenterMode ? <Eye className="w-3.5 h-3.5 text-[#3AB533]" /> : <EyeOff className="w-3.5 h-3.5" />}
              <span>{presenterMode ? 'Presenter Cues (ON)' : 'Client View (Clean)'}</span>
            </button>
          </div>
        </div>

        {/* Live Under-The-Hood Telemetry Drawer */}
        {showConsole && (
          <div className="bg-[#102412] text-slate-200 border-t border-slate-800 px-4 py-2.5 font-mono text-[11px] animate-fadeIn">
            <div className="max-w-7xl mx-auto flex items-center justify-between">
              <div className="flex items-center gap-3 overflow-x-auto whitespace-nowrap">
                <span className="text-[#ABFF44] font-bold">EDGE TELEMETRY:</span>
                {telemetryLogs.slice(0, 2).map((log, i) => (
                  <span key={i} className="text-slate-300">
                    <span className="text-slate-500">[{log.ts}]</span> <strong className="text-cyan-300">{log.type}:</strong> {log.msg}
                  </span>
                ))}
              </div>
              <span className="text-[10px] text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                20ms Latency
              </span>
            </div>
          </div>
        )}
      </header>

      {/* Main Workspace Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-6">

        {/* ========================================================================= */}
        {/* PRESENTER TALK-TRACK BANNER (Displayed when presenterMode is true) */}
        {/* ========================================================================= */}
        {presenterMode && (
          <div className="rounded-2xl border-2 border-[#3AB533] bg-[#FFFFFF] p-5 shadow-sm space-y-3 animate-fadeIn">
            <div className="flex flex-wrap items-center justify-between gap-2 border-b border-[#E4F0DA] pb-2.5">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-0.5 rounded-full bg-[#ABFF44] text-[#102412] text-[11px] font-extrabold uppercase tracking-wider">
                  Sandler Teaser {activeTeaser} Execution Cue
                </span>
                <span className="text-xs text-slate-500 font-medium">Timing: 3 to 4 Minutes &bull; Goal: Micro-proof without over-pitching</span>
              </div>
              <span className="text-xs font-bold text-[#3AB533]">Role: Marvin Oey (SA)</span>
            </div>

            {activeTeaser === 1 && (
              <div className="space-y-1.5 text-xs text-slate-700">
                <p className="font-bold text-[#102412]">
                  Talk Track Script:
                </p>
                <p className="italic bg-[#E4F0DA]/60 p-3 rounded-xl border border-[#7DDD3D]/30 leading-relaxed text-slate-900">
                  &ldquo;Patrick, you mentioned earlier that the CMS has zero awareness of Microsoft Dynamics CRM data—so every visitor looks like an anonymous stranger. Watch what happens in real time. Today, when Unilever visits NIQ.com, WordPress sees an anonymous IP. But when ODP is connected to your Dynamics CRM, the moment they hit the page, Optimizely Graph dynamically restructures the entire experience to FMCG category intelligence in under 18 milliseconds—with zero manual editor work.&rdquo;
                </p>
                <p className="text-[11px] text-slate-600 pt-1">
                  &rarr; <strong>Action:</strong> Click the persona buttons below to trigger live re-hydration of the hero headline and featured report.
                </p>
              </div>
            )}

            {activeTeaser === 2 && (
              <div className="space-y-1.5 text-xs text-slate-700">
                <p className="font-bold text-[#102412]">
                  Talk Track Script:
                </p>
                <p className="italic bg-[#E4F0DA]/60 p-3 rounded-xl border border-[#7DDD3D]/30 leading-relaxed text-slate-900">
                  &ldquo;You flagged that manual translation across your 10 core markets is creating major release bottlenecks, leaving local sites with dated or substandard analysis. Watch this: instead of waiting three weeks for agencies and WPML plugin syncs, Optimizely Graph serves localized, on-brand analysis to Germany, France, or Japan instantaneously at the edge.&rdquo;
                </p>
                <p className="text-[11px] text-slate-600 pt-1">
                  &rarr; <strong>Action:</strong> Toggle between the German, French, and Japanese flags. Stop talking and let him observe the instantaneous translation.
                </p>
              </div>
            )}

            {activeTeaser === 3 && (
              <div className="space-y-1.5 text-xs text-slate-700">
                <p className="font-bold text-[#102412]">
                  Talk Track Script:
                </p>
                <p className="italic bg-[#E4F0DA]/60 p-3 rounded-xl border border-[#7DDD3D]/30 leading-relaxed text-slate-900">
                  &ldquo;Today, Ninja Forms submissions sit in WordPress until someone manually exports a CSV and uploads it to Microsoft Dynamics. Watch what happens when an enterprise buyer requests a brief here: it streams into Dynamics in real time, creates the lead record, and triggers an automated 1:1 welcome in Optimizely Campaign under one unified domain reputation. And as you can see in the table below, that immediately retires 9 commercial plugins and custom code upkeep.&rdquo;
                </p>
                <p className="text-[11px] text-slate-600 pt-1">
                  &rarr; <strong>Action:</strong> Click &apos;Submit Brief&apos; on the live form, then highlight the 9-plugin retirement ledger.
                </p>
              </div>
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* INTERACTIVE TEASER CONTROL STRIP */}
        {/* ========================================================================= */}
        <div className="rounded-2xl border border-[#7DDD3D]/50 bg-[#FFFFFF] p-4 shadow-sm flex flex-wrap items-center justify-between gap-4">
          
          {/* Dynamic Controls tailored to the Active Teaser */}
          {activeTeaser === 1 && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#3AB533] flex items-center gap-1.5">
                <Database className="w-4 h-4" />
                Simulate Visitor Profile:
              </span>
              <div className="flex items-center gap-1.5 bg-[#E4F0DA] p-1 rounded-xl border border-[#7DDD3D]/40">
                <button
                  onClick={() => handlePersonaChange('anonymous')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    visitorProfile === 'anonymous'
                      ? 'bg-[#FFFFFF] text-[#102412] shadow-sm border border-[#7DDD3D]'
                      : 'text-slate-600 hover:text-[#102412]'
                  }`}
                >
                  Current WPVIP (Anonymous)
                </button>
                <button
                  onClick={() => handlePersonaChange('cpg')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    visitorProfile === 'cpg'
                      ? 'bg-[#3AB533] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#102412]'
                  }`}
                >
                  Enterprise CPG (Unilever)
                </button>
                <button
                  onClick={() => handlePersonaChange('retail')}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                    visitorProfile === 'retail'
                      ? 'bg-[#3AB533] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#102412]'
                  }`}
                >
                  Omnichannel Retail (Walmart)
                </button>
              </div>
            </div>
          )}

          {activeTeaser === 2 && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#3AB533] flex items-center gap-1.5">
                <Globe className="w-4 h-4" />
                Select Regional Market:
              </span>
              <div className="flex items-center gap-1.5 bg-[#E4F0DA] p-1 rounded-xl border border-[#7DDD3D]/40">
                {(
                  [
                    { key: 'en', flag: '🇺🇸', label: 'Global (EN)' },
                    { key: 'de', flag: '🇩🇪', label: 'Germany (DE)' },
                    { key: 'fr', flag: '🇫🇷', label: 'France (FR)' },
                    { key: 'ja', flag: '🇯🇵', label: 'Japan (JA)' }
                  ] as const
                ).map(item => (
                  <button
                    key={item.key}
                    onClick={() => handleLangChange(item.key)}
                    className={`flex items-center gap-1.5 px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      selectedLang === item.key
                        ? 'bg-[#3AB533] text-white shadow-sm'
                        : 'text-slate-600 hover:text-[#102412]'
                    }`}
                  >
                    <span>{item.flag}</span>
                    <span>{item.label}</span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {activeTeaser === 3 && (
            <div className="flex flex-wrap items-center gap-3">
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#3AB533] flex items-center gap-1.5">
                <Layers className="w-4 h-4" />
                Plugin Relief Filter:
              </span>
              <div className="flex items-center gap-1.5 bg-[#E4F0DA] p-1 rounded-xl border border-[#7DDD3D]/40 text-xs font-bold">
                <button
                  onClick={() => setSelectedPluginFilter('all')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    selectedPluginFilter === 'all'
                      ? 'bg-[#3AB533] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#102412]'
                  }`}
                >
                  All 9 Plugins ($84k Saved)
                </button>
                <button
                  onClick={() => setSelectedPluginFilter('forms')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    selectedPluginFilter === 'forms'
                      ? 'bg-[#3AB533] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#102412]'
                  }`}
                >
                  Forms &amp; Lead Ingestion
                </button>
                <button
                  onClick={() => setSelectedPluginFilter('content')}
                  className={`px-3 py-1 rounded-lg transition-all ${
                    selectedPluginFilter === 'content'
                      ? 'bg-[#3AB533] text-white shadow-sm'
                      : 'text-slate-600 hover:text-[#102412]'
                  }`}
                >
                  Content &amp; i18n
                </button>
              </div>
            </div>
          )}

          {/* Right Status Pill */}
          <div className="flex items-center gap-2 text-xs font-medium text-slate-500">
            <span className="h-2 w-2 rounded-full bg-emerald-500"></span>
            <span>Optimizely Graph Edge: <strong className="text-[#102412]">Sub-20ms Response</strong></span>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* LIVE SIMULATED VIEWPORT: NIELSENIQ EXPERIENCE */}
        {/* ========================================================================= */}
        <div className="rounded-3xl border-2 border-[#102412] bg-[#070B14] text-white overflow-hidden shadow-2xl relative">
          
          {/* Simulated Browser Chrome */}
          <div className="bg-[#0B1224] px-4 py-2 border-b border-slate-800 flex items-center justify-between text-xs text-slate-400">
            <div className="flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500/60"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-500/60"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500/60"></span>
              </div>
              <span className="text-[11px] font-mono text-slate-400 pl-2">
                https://nielseniq.com/global/{selectedLang}/
              </span>
            </div>
            <div className="flex items-center gap-2 font-mono text-[10px] text-[#00E5FF]">
              <span>Graph AST: {visitorProfile.toUpperCase()} &bull; {selectedLang.toUpperCase()}</span>
            </div>
          </div>

          {/* Authentic NielsenIQ Header */}
          <div className="border-b border-slate-800/80 bg-[#070B14]/95 px-6 py-4 flex items-center justify-between">
            <div className="flex items-center gap-8">
              <span className="text-2xl font-black tracking-tight text-white flex items-baseline">
                NIQ<span className="w-2 h-2 rounded-full bg-[#00E5FF] ml-0.5 inline-block" />
              </span>
              <div className="hidden md:flex items-center space-x-6 text-xs font-bold text-slate-300">
                <span className="hover:text-white cursor-pointer">Solutions</span>
                <span className="hover:text-white cursor-pointer">Industries</span>
                <span className="hover:text-white cursor-pointer">Insights</span>
                <span className="text-[#00E5FF] cursor-pointer">Optiq AI</span>
                <span className="hover:text-white cursor-pointer">About</span>
              </div>
            </div>
            <div className="flex items-center gap-3 text-xs">
              <span className="px-2.5 py-1 rounded-full bg-slate-800 text-slate-300 font-bold flex items-center gap-1">
                <span>{currentLocale.flag}</span>
                <span className="uppercase">{selectedLang}</span>
              </span>
              <button className="px-4 py-1.5 rounded-full bg-[#2C6CF6] text-white font-bold hover:bg-blue-600 transition-all">
                Contact Us
              </button>
            </div>
          </div>

          {/* Dynamic Hero Section */}
          <div className="p-8 sm:p-12 space-y-6 relative overflow-hidden bg-gradient-to-b from-[#070B14] via-[#0A1224] to-[#040812]">
            <div className="absolute top-0 right-0 w-80 h-80 bg-[#2C6CF6]/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="max-w-3xl space-y-4 relative z-10">
              
              {/* Persona Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/10 border border-blue-400/30 text-xs font-bold text-[#00E5FF]">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{currentPersona.heroTag}</span>
              </div>

              {/* Dynamic Headline */}
              <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight transition-all">
                {currentPersona.headline}
              </h1>

              {/* Subhead */}
              <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
                {currentPersona.subhead}
              </p>

              {/* CTAs */}
              <div className="flex flex-wrap items-center gap-3 pt-2">
                <button className="px-6 py-3 rounded-full bg-[#2C6CF6] hover:bg-blue-600 text-white font-bold text-xs transition-all shadow-lg shadow-blue-600/30 flex items-center gap-2">
                  <span>{currentPersona.cta}</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
                <button className="px-6 py-3 rounded-full bg-transparent border border-slate-700 hover:bg-slate-800 text-slate-300 font-semibold text-xs transition-all">
                  View Market Coverage
                </button>
              </div>
            </div>

            {/* Localized Metrics Strip */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 pt-6 border-t border-slate-800/80 text-xs">
              <div className="border-l-2 border-[#00E5FF] pl-3">
                <p className="text-2xl font-black text-white">{currentLocale.stat1}</p>
                <p className="text-slate-400 text-[11px]">{currentLocale.stat1Lbl}</p>
              </div>
              <div className="border-l-2 border-[#2C6CF6] pl-3">
                <p className="text-2xl font-black text-[#00E5FF]">90+</p>
                <p className="text-slate-400 text-[11px]">Countries with transaction coverage</p>
              </div>
              <div className="border-l-2 border-[#00E5FF] pl-3">
                <p className="text-2xl font-black text-white">{currentLocale.stat2}</p>
                <p className="text-slate-400 text-[11px]">{currentLocale.stat2Lbl}</p>
              </div>
              <div className="border-l-2 border-[#2C6CF6] pl-3">
                <p className="text-2xl font-black text-white">3.1T</p>
                <p className="text-slate-400 text-[11px]">Data records processed weekly</p>
              </div>
            </div>
          </div>

          {/* ========================================================================= */}
          {/* TEASER 3: EMBEDDED CLOSED-LOOP INGESTION & REPORT CARD */}
          {/* ========================================================================= */}
          <div className="bg-[#F8FAFC] text-slate-900 p-8 sm:p-10 border-t border-slate-800 space-y-8">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-200 pb-4">
              <div>
                <span className="text-xs font-extrabold uppercase tracking-widest text-[#3AB533] block">
                  Closed-Loop Dynamics Bridge
                </span>
                <h3 className="text-2xl font-extrabold text-[#102412]">
                  Live Executive Ingestion Form
                </h3>
              </div>
              <div className="text-xs text-slate-500 font-medium">
                Replaces Ninja Forms CSV lag &bull; Instant Dynamics Marketing Routing
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
              
              {/* Left Form */}
              <div className="lg:col-span-7 bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4">
                <div className="space-y-1">
                  <h4 className="text-base font-bold text-[#102412]">Request Category Growth Assessment</h4>
                  <p className="text-xs text-slate-500">
                    Direct integration into Microsoft Dynamics CRM with zero batch delays.
                  </p>
                </div>

                {!formSubmitted ? (
                  <form onSubmit={handleFormSubmit} className="space-y-3.5 text-xs">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Executive Name</label>
                        <input
                          type="text"
                          value={formData.name}
                          onChange={e => setFormData({ ...formData, name: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#3AB533]"
                          required
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Work Email</label>
                        <input
                          type="email"
                          value={formData.email}
                          onChange={e => setFormData({ ...formData, email: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#3AB533]"
                          required
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Target Account / Organization</label>
                        <input
                          type="text"
                          value={formData.company}
                          onChange={e => setFormData({ ...formData, company: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#3AB533]"
                          required
                        />
                      </div>
                      <div>
                        <label className="font-bold text-slate-700 block mb-1">Category Focus</label>
                        <input
                          type="text"
                          value={formData.category}
                          onChange={e => setFormData({ ...formData, category: e.target.value })}
                          className="w-full px-3 py-2 rounded-xl border border-slate-300 focus:outline-none focus:ring-2 focus:ring-[#3AB533]"
                          required
                        />
                      </div>
                    </div>

                    <button
                      type="submit"
                      className="w-full py-3 rounded-xl bg-[#3AB533] hover:bg-[#329e2c] text-white font-extrabold text-xs transition-all flex items-center justify-center gap-2 shadow-md"
                    >
                      <Send className="w-4 h-4" />
                      <span>Submit &amp; Trigger Real-Time Dynamics Ingestion</span>
                    </button>
                  </form>
                ) : (
                  <div className="p-5 rounded-xl bg-[#E4F0DA] border-2 border-[#3AB533] text-[#102412] space-y-2.5 animate-fadeIn">
                    <div className="flex items-center gap-2">
                      <CheckCircle2 className="w-5 h-5 text-[#3AB533]" />
                      <h5 className="font-extrabold text-sm">Lead Successfully Ingested in MS Dynamics!</h5>
                    </div>
                    <p className="text-xs text-slate-700 leading-relaxed">
                      Lead record for <strong>{formData.name}</strong> ({formData.company}) created in <strong>Microsoft Dynamics Marketing</strong>. Automated 1:1 briefing sequence triggered via <strong>Optimizely Campaign</strong> without manual CSV handling.
                    </p>
                    <button
                      onClick={() => setFormSubmitted(false)}
                      className="text-xs text-[#3AB533] font-bold underline hover:text-[#102412] pt-1 block"
                    >
                      Reset Ingestion Simulation
                    </button>
                  </div>
                )}
              </div>

              {/* Right: Connected Report Showcase */}
              <div className="lg:col-span-5 bg-[#FFFFFF] p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm space-y-4 flex flex-col justify-between">
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs">
                    <span className="px-3 py-1 rounded-full bg-[#E4F0DA] text-[#3AB533] font-bold">
                      {currentLocale.badge}
                    </span>
                    <span className="text-sm font-extrabold text-[#102412]">
                      {currentPersona.price}
                    </span>
                  </div>

                  <h4 className="text-lg font-bold text-[#102412] leading-snug">
                    {currentPersona.featuredReport}
                  </h4>

                  <p className="text-xs text-slate-600 leading-relaxed">
                    Syndicated category dataset powered by scanner logs from 21M+ stores with localized regional breakdowns in {currentLocale.name}.
                  </p>
                </div>

                <div className="pt-4 border-t border-slate-100 flex items-center justify-between text-xs text-[#3AB533] font-bold">
                  <span>Included with Optiq Platform Access</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* RETIRED PLUGINS & ARCHITECTURAL RELIEF LEDGER (Teaser 3 Reinforcement) */}
        {/* ========================================================================= */}
        <div className="rounded-3xl border border-[#7DDD3D]/40 bg-[#FFFFFF] p-6 sm:p-8 space-y-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-[#E4F0DA] pb-4">
            <div>
              <span className="text-xs font-extrabold uppercase tracking-wider text-[#3AB533] block">
                WordPress VIP Operational De-Risking
              </span>
              <h3 className="text-xl font-extrabold text-[#102412]">
                9 WordPress Plugins Replaced by Optimizely SaaS CMS
              </h3>
            </div>
            <div className="px-3 py-1.5 rounded-full bg-[#ABFF44] text-[#102412] text-xs font-extrabold border border-[#7DDD3D]">
              Total Hard Savings: $84,000+ / year
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="border-b border-[#E4F0DA] bg-[#E4F0DA] text-[#102412] uppercase tracking-wider font-extrabold">
                  <th className="py-3 px-4">Current WP Plugin / Tool</th>
                  <th className="py-3 px-4">Current Purpose &amp; Friction</th>
                  <th className="py-3 px-4">Optimizely SaaS CMS Replacement</th>
                  <th className="py-3 px-4 text-right">Estimated Annual Savings</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 text-slate-800">
                {retiredPlugins.map((plugin, index) => (
                  <tr key={index} className="hover:bg-[#E4F0DA]/40 transition-colors">
                    <td className="py-3.5 px-4 font-bold text-[#102412] flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-[#3AB533]"></span>
                      {plugin.name}
                    </td>
                    <td className="py-3.5 px-4 text-slate-600">{plugin.role}</td>
                    <td className="py-3.5 px-4 font-semibold text-[#3AB533]">{plugin.replacement}</td>
                    <td className="py-3.5 px-4 font-mono font-bold text-right text-[#102412]">{plugin.saving}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

      </div>
    </div>
  );
}
