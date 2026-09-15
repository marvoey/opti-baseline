import React, { useState } from 'react';
import { 
  FileText, 
  CreditCard, 
  MousePointerClick, 
  Compass, 
  Image as ImageIcon, 
  Sparkles, 
  Database, 
  Code2, 
  Layers, 
  ArrowRight, 
  CheckCircle2, 
  RefreshCw, 
  Cpu, 
  Terminal 
} from 'lucide-react';

function ctaHref(link) {
  return link?.url?.default ?? '#';
}

// --- Primitive 1: Prose / RichText ---
function RichTextPrimitive({ content }) {
  return (
    <div className="w-full bg-white rounded-xl border border-neutral-200 p-8 shadow-sm">
      <div className="flex items-center gap-2 mb-3">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-50 text-emerald-700 border border-emerald-200">
          <FileText className="w-3 h-3" /> Prose Primitive
        </span>
        <span className="text-xs text-neutral-400 font-mono">key: RichTextBlock</span>
      </div>
      {content.headline && (
        <h2 className="text-2xl font-bold tracking-tight text-neutral-900 mb-4">
          {content.headline}
        </h2>
      )}
      <div 
        className="prose max-w-none text-neutral-700 leading-relaxed space-y-4"
        dangerouslySetInnerHTML={{ __html: content.Body }}
      />
    </div>
  );
}

// --- Primitive 2: Card ---
function CardBlockPrimitive({ content }) {
  return (
    <div className="h-full flex flex-col justify-between rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md hover:border-neutral-300">
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
            <CreditCard className="w-3 h-3" /> Card Primitive
          </span>
          <span className="text-xs text-neutral-400 font-mono">key: CardBlock</span>
        </div>
        {content.Eyebrow && (
          <span className="text-xs font-bold uppercase tracking-wider text-blue-600 block mb-1">
            {content.Eyebrow}
          </span>
        )}
        <h3 className="text-lg font-bold text-neutral-900 leading-snug">
          {content.Title}
        </h3>
        {content.Description && (
          <p className="mt-2 text-sm text-neutral-600 line-clamp-3">
            {content.Description}
          </p>
        )}
        {content.Badges && (
          <div className="mt-4 flex flex-wrap gap-1.5">
            {content.Badges.map((badge, idx) => (
              <span key={idx} className="px-2 py-0.5 text-xs bg-neutral-100 text-neutral-700 rounded-md font-medium">
                {badge}
              </span>
            ))}
          </div>
        )}
      </div>
      {content.Link && (
        <div className="mt-5 pt-4 border-t border-neutral-100">
          <a
            href={ctaHref(content.Link)}
            className="inline-flex items-center text-sm font-semibold text-blue-600 hover:text-blue-700 gap-1.5 group"
          >
            {content.Link.text || 'Explore solution'}
            <ArrowRight className="w-4 h-4 transition-transform group-hover:translate-x-1" />
          </a>
        </div>
      )}
    </div>
  );
}

// --- Primitive 3: Action ---
function ActionBlockPrimitive({ content }) {
  const isSecondary = content.Variant === 'secondary';
  return (
    <div className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm flex flex-col items-start gap-3">
      <div className="flex items-center gap-2 mb-1">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-amber-50 text-amber-700 border border-amber-200">
          <MousePointerClick className="w-3 h-3" /> Action Primitive
        </span>
        <span className="text-xs text-neutral-400 font-mono">key: ActionBlock</span>
      </div>
      <div className="flex flex-col sm:flex-row sm:items-center gap-4 w-full">
        <a
          href={ctaHref(content.Link)}
          className={`inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition shadow-sm ${
            isSecondary
              ? 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200 border border-neutral-300'
              : 'bg-blue-600 text-white hover:bg-blue-700'
          }`}
        >
          {content.Label}
        </a>
        {content.Subtext && (
          <span className="text-xs text-neutral-500 max-w-sm">
            {content.Subtext}
          </span>
        )}
      </div>
    </div>
  );
}

// --- Primitive 4: Media ---
function MediaBlockPrimitive({ content }) {
  return (
    <figure className="w-full rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
      <div className="flex items-center justify-between mb-3 px-1">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-rose-50 text-rose-700 border border-rose-200">
          <ImageIcon className="w-3 h-3" /> Media Primitive
        </span>
        <span className="text-xs text-neutral-400 font-mono">key: MediaBlock</span>
      </div>
      <div className="relative overflow-hidden rounded-lg bg-neutral-900 aspect-video flex items-center justify-center">
        <img
          src={content.MediaUrl}
          alt={content.AltText ?? ''}
          className="h-full w-full object-cover transition duration-300 hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent flex items-end p-4">
          <span className="text-xs text-white/90 font-medium tracking-wide">
            {content.AltText}
          </span>
        </div>
      </div>
      {content.Caption && (
        <figcaption className="mt-3 text-center text-xs text-neutral-500 font-mono">
          {content.Caption}
        </figcaption>
      )}
    </figure>
  );
}

// --- Primitive 5: Wayfinding ---
function WayfindingBlockPrimitive({ content }) {
  const stages = content.Stages || ['Discovery', 'Architecture Review', 'Verification', 'Deployment'];
  const activeIdx = content.currentStageIdx ?? 1;

  return (
    <nav className="w-full rounded-xl border border-neutral-200 bg-white p-5 shadow-sm">
      <div className="flex items-center justify-between mb-4">
        <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-xs font-semibold bg-teal-50 text-teal-700 border border-teal-200">
          <Compass className="w-3 h-3" /> Wayfinding Primitive
        </span>
        <span className="text-xs text-neutral-400 font-mono">key: WayfindingBlock</span>
      </div>

      <div className="flex items-center gap-3 mb-4">
        <span className="font-semibold text-xs uppercase tracking-wider px-2 py-1 rounded bg-blue-50 text-blue-700">
          {content.TotalSteps}
        </span>
        <span className="text-sm font-bold text-neutral-900">
          {content.StepTitle}
        </span>
      </div>

      <div className="grid grid-cols-4 gap-2 pt-2">
        {stages.map((stage, idx) => {
          const isDone = idx < activeIdx;
          const isCurrent = idx === activeIdx;
          return (
            <div key={stage} className="flex flex-col gap-1.5">
              <div 
                className={`h-1.5 rounded-full transition-colors ${
                  isDone 
                    ? 'bg-blue-600' 
                    : isCurrent 
                      ? 'bg-blue-500 animate-pulse' 
                      : 'bg-neutral-200'
                }`} 
              />
              <span className={`text-[11px] truncate font-medium ${isCurrent ? 'text-blue-700 font-semibold' : 'text-neutral-500'}`}>
                {stage}
              </span>
            </div>
          );
        })}
      </div>
    </nav>
  );
}

// --- Master Database of Primitives with Taxonomy ---
const ALL_PRIMITIVES = [
  // Prose
  {
    id: 'p1',
    primitiveType: 'Prose',
    intent: 'compliance',
    audience: 'financial',
    domain: 'security',
    geo: 'global',
    component: RichTextPrimitive,
    data: {
      headline: 'Enterprise Cloud Governance and ISO/SOC2 Compliance Framework',
      Body: '<p>Optimizely CMS SaaS enforces immutable audit logs, multi-tenant physical segregation, and full SOC2 Type II certifications. All layout compositions and content primitives are versioned through GitOps-aligned CLI pushing, assuring that regulated life sciences and banking environments never suffer from undocumented front-end alterations.</p><p><strong>Zero-trust runtime:</strong> Content is queried purely as structured JSON over authenticated GraphQL endpoints without exposing internal database or administrative surfaces.</p>',
      intent: 'compliance',
      audience: 'financial',
      domain: 'security',
      geo: 'global'
    }
  },
  {
    id: 'p2',
    primitiveType: 'Prose',
    intent: 'evaluate',
    audience: 'enterprise',
    domain: 'cloud',
    geo: 'us',
    component: RichTextPrimitive,
    data: {
      headline: 'Next-Gen Architecture: Decoupling Composition from Fixed Page Trees',
      Body: '<p>Traditional enterprise CMS platforms bind authors to static URL trees. In contrast, Visual Builder coupled with Optimizely Graph delivers structured <code>_experience</code> compositions that can be assembled dynamically at request time based on incoming visitor intent telemetry.</p>',
      intent: 'evaluate',
      audience: 'enterprise',
      domain: 'cloud',
      geo: 'us'
    }
  },

  // Cards
  {
    id: 'c1',
    primitiveType: 'Card',
    intent: 'compliance',
    audience: 'financial',
    domain: 'security',
    geo: 'global',
    component: CardBlockPrimitive,
    data: {
      Eyebrow: 'Audit Report',
      Title: 'SOC2 Type II and FedRAMP Readiness',
      Description: 'Comprehensive independent verification of data isolation, transit encryption, and credential management standards.',
      Badges: ['SOC2 Type II', 'ISO 27001', 'HIPAA Ready'],
      Link: {
        text: 'Download Security Spec',
        title: null,
        target: null,
        url: { default: '#download' }
      },
      intent: 'compliance',
      audience: 'financial',
      domain: 'security',
      geo: 'global'
    }
  },
  {
    id: 'c2',
    primitiveType: 'Card',
    intent: 'evaluate',
    audience: 'enterprise',
    domain: 'cloud',
    geo: 'us',
    component: CardBlockPrimitive,
    data: {
      Eyebrow: 'Architecture Brief',
      Title: 'Multi-Tenant Microservices and Ring Rollouts',
      Description: 'Deploy safely with automated Canary, Early Adopter, and Conservative deployment rings without site downtime.',
      Badges: ['99.99% SLA', 'Edge CDN', 'Zero Downtime'],
      Link: {
        text: 'Explore Infrastructure',
        title: null,
        target: null,
        url: { default: '#infra' }
      },
      intent: 'evaluate',
      audience: 'enterprise',
      domain: 'cloud',
      geo: 'us'
    }
  },
  {
    id: 'c3',
    primitiveType: 'Card',
    intent: 'explore',
    audience: 'developer',
    domain: 'security',
    geo: 'global',
    component: CardBlockPrimitive,
    data: {
      Eyebrow: 'Developer SDK',
      Title: '@optimizely/cms-sdk React Integration',
      Description: 'Native App Router server components with automatic preview tags and strict TypeScript content type bindings.',
      Badges: ['Next.js 16', 'TypeScript', 'CLI Push'],
      Link: {
        text: 'View GitHub Base',
        title: null,
        target: null,
        url: { default: 'https://github.com/marvoey/opti-baseline' }
      },
      intent: 'explore',
      audience: 'developer',
      domain: 'security',
      geo: 'global'
    }
  },

  // Media
  {
    id: 'm1',
    primitiveType: 'Media',
    intent: 'compliance',
    audience: 'financial',
    domain: 'security',
    geo: 'global',
    component: MediaBlockPrimitive,
    data: {
      MediaUrl: 'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?auto=format&fit=crop&w=1200&q=80',
      AltText: 'Secure Cloud Infrastructure Diagram and Multi-Region Graph CDN',
      Caption: 'Figure 1.1: Automated encrypted content sync between CMS SaaS and Optimizely Graph.',
      intent: 'compliance',
      audience: 'financial',
      domain: 'security',
      geo: 'global'
    }
  },
  {
    id: 'm2',
    primitiveType: 'Media',
    intent: 'evaluate',
    audience: 'enterprise',
    domain: 'cloud',
    geo: 'us',
    component: MediaBlockPrimitive,
    data: {
      MediaUrl: 'https://images.unsplash.com/photo-1451187580459-43490279c0fa?auto=format&fit=crop&w=1200&q=80',
      AltText: 'Global Edge Network Distribution Map',
      Caption: 'Figure 2.4: Sub-millisecond edge delivery across 120+ PoPs worldwide.',
      intent: 'evaluate',
      audience: 'enterprise',
      domain: 'cloud',
      geo: 'us'
    }
  },

  // Action
  {
    id: 'a1',
    primitiveType: 'Action',
    intent: 'compliance',
    audience: 'financial',
    domain: 'security',
    geo: 'global',
    component: ActionBlockPrimitive,
    data: {
      Label: 'Request Executive Security Briefing',
      Link: {
        text: 'Schedule Call',
        title: null,
        target: null,
        url: { default: '#schedule' }
      },
      Variant: 'primary',
      Subtext: 'Direct 30-min discovery session with an Optimizely Certified Security Architect.',
      intent: 'compliance',
      audience: 'financial',
      domain: 'security',
      geo: 'global'
    }
  },
  {
    id: 'a2',
    primitiveType: 'Action',
    intent: 'evaluate',
    audience: 'enterprise',
    domain: 'cloud',
    geo: 'us',
    component: ActionBlockPrimitive,
    data: {
      Label: 'Provision Sandbox Environment',
      Link: {
        text: 'Deploy Now',
        title: null,
        target: null,
        url: { default: '#deploy' }
      },
      Variant: 'secondary',
      Subtext: 'Includes pre-seeded Universal Primitives and Visual Builder templates.',
      intent: 'evaluate',
      audience: 'enterprise',
      domain: 'cloud',
      geo: 'us'
    }
  },

  // Wayfinding
  {
    id: 'w1',
    primitiveType: 'Wayfinding',
    intent: 'compliance',
    audience: 'financial',
    domain: 'security',
    geo: 'global',
    component: WayfindingBlockPrimitive,
    data: {
      StepTitle: 'Step 2: Formal Compliance Review and Attestation',
      TotalSteps: 'Stage 2 of 4',
      Stages: ['Threat Model', 'Attestation', 'Pen Testing', 'Final Sign-off'],
      currentStageIdx: 1,
      intent: 'compliance',
      audience: 'financial',
      domain: 'security',
      geo: 'global'
    }
  },
  {
    id: 'w2',
    primitiveType: 'Wayfinding',
    intent: 'evaluate',
    audience: 'enterprise',
    domain: 'cloud',
    geo: 'us',
    component: WayfindingBlockPrimitive,
    data: {
      StepTitle: 'Phase 1: Architecture Feasibility and Benchmark',
      TotalSteps: 'Phase 1 of 3',
      Stages: ['Discovery', 'Prototype (GenUI)', 'Production Migration'],
      currentStageIdx: 0,
      intent: 'evaluate',
      audience: 'enterprise',
      domain: 'cloud',
      geo: 'us'
    }
  }
];

export default function UniversalPrimitivesApp() {
  const [activeTab, setActiveTab] = useState('assembler');

  // Intent Assembly Filter States
  const [selectedIntent, setSelectedIntent] = useState('compliance');
  const [selectedAudience, setSelectedAudience] = useState('financial');
  const [selectedDomain, setSelectedDomain] = useState('security');

  // Filter items matching intent
  const matchedPrimitives = ALL_PRIMITIVES.filter((item) => {
    const matchIntent = selectedIntent === 'all' || item.intent === selectedIntent;
    const matchAudience = selectedAudience === 'all' || item.audience === selectedAudience;
    const matchDomain = selectedDomain === 'all' || item.domain === selectedDomain;
    return matchIntent && matchAudience && matchDomain;
  });

  return (
    <div className="min-h-screen bg-neutral-100 text-neutral-800 font-sans pb-16">
      {/* Top Banner / Header */}
      <header className="sticky top-0 z-30 border-b border-neutral-200 bg-white/95 backdrop-blur px-6 py-4">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center text-white shadow-sm shadow-blue-500/20">
              <Cpu className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h1 className="text-lg font-bold text-neutral-900 tracking-tight">
                  Universal Component Library Primitives
                </h1>
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-blue-100 text-blue-700">
                  Optimizely CMS SaaS
                </span>
              </div>
              <p className="text-xs text-neutral-500">
                Next.js 16 Baseline (<code className="text-neutral-700">marvoey/opti-baseline</code>) &bull; Intent-Driven Assembly Engine
              </p>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="flex items-center gap-1 bg-neutral-100 p-1 rounded-xl border border-neutral-200 text-xs font-semibold">
            <button
              onClick={() => setActiveTab('assembler')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition ${
                activeTab === 'assembler' 
                  ? 'bg-white text-neutral-900 shadow-sm' 
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-blue-600" />
              Dynamic Assembler (Point 5)
            </button>
            <button
              onClick={() => setActiveTab('catalog')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition ${
                activeTab === 'catalog' 
                  ? 'bg-white text-neutral-900 shadow-sm' 
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Layers className="w-3.5 h-3.5 text-neutral-600" />
              Primitive Catalog (5 Types)
            </button>
            <button
              onClick={() => setActiveTab('code')}
              className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition ${
                activeTab === 'code' 
                  ? 'bg-white text-neutral-900 shadow-sm' 
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              <Code2 className="w-3.5 h-3.5 text-neutral-600" />
              GraphQL Schema and SDK Code
            </button>
          </div>
        </div>
      </header>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-6 mt-8">
        
        {/* VIEW 1: INTENT-DRIVEN ASSEMBLER (Point 5 Demo Sandbox) */}
        {activeTab === 'assembler' && (
          <div className="space-y-6">
            {/* Control Strip / Intent Simulator */}
            <div className="bg-white rounded-2xl border border-neutral-200 p-6 shadow-sm">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-5 border-b border-neutral-100">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
                    <h2 className="text-base font-bold text-neutral-900">
                      Real-Time Intent Assembly Simulator
                    </h2>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1">
                    Simulate how Optimizely Graph dynamically fetches pre-governed components into front-end slots without static URL page routes.
                  </p>
                </div>

                {/* Preset Scenarios */}
                <div className="flex flex-wrap items-center gap-2">
                  <span className="text-xs font-semibold text-neutral-400 uppercase tracking-wider mr-1">
                    Presets:
                  </span>
                  <button
                    onClick={() => {
                      setSelectedIntent('compliance');
                      setSelectedAudience('financial');
                      setSelectedDomain('security');
                    }}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition"
                  >
                    Banking / SOC2 Compliance
                  </button>
                  <button
                    onClick={() => {
                      setSelectedIntent('evaluate');
                      setSelectedAudience('enterprise');
                      setSelectedDomain('cloud');
                    }}
                    className="px-3 py-1 rounded-lg text-xs font-medium bg-neutral-100 hover:bg-neutral-200 text-neutral-800 transition"
                  >
                    Enterprise Cloud Evaluator
                  </button>
                  <button
                    onClick={() => {
                      setSelectedIntent('all');
                      setSelectedAudience('all');
                      setSelectedDomain('all');
                    }}
                    className="px-3 py-1 rounded-lg text-xs font-medium text-blue-600 hover:underline flex items-center gap-1"
                  >
                    <RefreshCw className="w-3 h-3" /> Reset / Show All
                  </button>
                </div>
              </div>

              {/* Param Selectors */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-5">
                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                    1. Visitor Intent Tag
                  </label>
                  <select
                    value={selectedIntent}
                    onChange={(e) => setSelectedIntent(e.target.value)}
                    className="w-full text-xs font-medium bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 text-neutral-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Intents (*)</option>
                    <option value="compliance">compliance (Audit / Legal / Security)</option>
                    <option value="evaluate">evaluate (Architecture / Feasibility)</option>
                    <option value="explore">explore (Developer Docs and SDK)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                    2. Target Audience
                  </label>
                  <select
                    value={selectedAudience}
                    onChange={(e) => setSelectedAudience(e.target.value)}
                    className="w-full text-xs font-medium bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 text-neutral-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Audiences (*)</option>
                    <option value="financial">financial (Regulated / Banking)</option>
                    <option value="enterprise">enterprise (Global Scale / IT)</option>
                    <option value="developer">developer (Engineers / Architects)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-500 uppercase tracking-wider mb-2">
                    3. Domain Vertical
                  </label>
                  <select
                    value={selectedDomain}
                    onChange={(e) => setSelectedDomain(e.target.value)}
                    className="w-full text-xs font-medium bg-neutral-50 border border-neutral-200 rounded-lg p-2.5 text-neutral-800 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="all">All Domains (*)</option>
                    <option value="security">security (Governance, Privacy, Trust)</option>
                    <option value="cloud">cloud (Infrastructure, Edge, CDN)</option>
                  </select>
                </div>
              </div>
            </div>

            {/* Simulated GraphQL Pipeline Bar */}
            <div className="bg-neutral-900 rounded-xl p-4 text-white text-xs font-mono flex flex-col md:flex-row md:items-center justify-between gap-3 shadow-md">
              <div className="flex items-center gap-2 text-neutral-400">
                <Database className="w-4 h-4 text-emerald-400" />
                <span>Optimizely Graph Resolution:</span>
                <span className="text-emerald-400 font-bold">{matchedPrimitives.length} Primitives Matched</span>
              </div>
              <div className="text-neutral-400 truncate max-w-xl">
                <code>
                  query _experience(intent: &quot;{selectedIntent}&quot;, audience: &quot;{selectedAudience}&quot;, domain: &quot;{selectedDomain}&quot;)
                </code>
              </div>
              <div className="flex items-center gap-1.5 text-neutral-400">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                <span>Deterministic (0 Hallucinations)</span>
              </div>
            </div>

            {/* Assembled Experience Preview */}
            <div className="space-y-6 bg-neutral-200/50 p-6 rounded-2xl border border-neutral-300/80">
              <div className="flex items-center justify-between px-2">
                <span className="text-xs font-bold uppercase tracking-wider text-neutral-500">
                  Dynamic Experience Canvas (Assembled on the Fly)
                </span>
                <span className="text-xs text-neutral-500 font-mono">
                  Runtime: Next.js App Router (Server Rendered)
                </span>
              </div>

              {matchedPrimitives.length === 0 ? (
                <div className="bg-white rounded-xl p-12 text-center border border-dashed border-neutral-300">
                  <p className="text-sm font-semibold text-neutral-700">No primitives matched the exact filter criteria.</p>
                  <p className="text-xs text-neutral-500 mt-1">Try switching the preset or select &quot;All&quot; to inspect full inventory.</p>
                </div>
              ) : (
                <div className="flex flex-col gap-6">
                  {matchedPrimitives.map((item) => {
                    const Component = item.component;
                    return (
                      <div key={item.id} className="relative group">
                        {/* Hover Inspector Pill */}
                        <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity bg-neutral-900/90 backdrop-blur text-white text-[10px] font-mono px-2.5 py-1 rounded-md shadow-lg pointer-events-none flex items-center gap-2">
                          <span>id: {item.id}</span>
                          <span>intent: {item.intent}</span>
                          <span>domain: {item.domain}</span>
                        </div>
                        <Component content={item.data} />
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        )}

        {/* VIEW 2: PRIMITIVE CATALOG (The 5 Fundamental Blocks) */}
        {activeTab === 'catalog' && (
          <div className="space-y-8">
            <div className="bg-white p-6 rounded-2xl border border-neutral-200 shadow-sm">
              <h2 className="text-lg font-bold text-neutral-900">
                The 5 Primitives of the Universal Component Library
              </h2>
              <p className="text-xs text-neutral-500 mt-1 max-w-3xl leading-relaxed">
                Rather than building dozens of rigid, one-off templates for every campaign, Optimizely CMS SaaS operates on 5 universal primitives. Each block is registered with <code className="text-neutral-700 bg-neutral-100 px-1 py-0.5 rounded">baseType: &apos;_component&apos;</code> and carries an intent taxonomy contract.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* 1. Prose */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold text-neutral-500 px-1">
                  <span>1. Prose (Rich Text)</span>
                  <span className="font-mono text-[11px] text-emerald-700">RichTextBlock</span>
                </div>
                <RichTextPrimitive content={ALL_PRIMITIVES[0].data} />
              </div>

              {/* 2. Media */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold text-neutral-500 px-1">
                  <span>2. Media</span>
                  <span className="font-mono text-[11px] text-rose-700">MediaBlock</span>
                </div>
                <MediaBlockPrimitive content={ALL_PRIMITIVES[5].data} />
              </div>

              {/* 3. Card */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold text-neutral-500 px-1">
                  <span>3. Card (Micro-Container)</span>
                  <span className="font-mono text-[11px] text-indigo-700">CardBlock</span>
                </div>
                <CardBlockPrimitive content={ALL_PRIMITIVES[2].data} />
              </div>

              {/* 4. Action */}
              <div className="flex flex-col gap-2">
                <div className="flex items-center justify-between text-xs font-bold text-neutral-500 px-1">
                  <span>4. Action (CTA)</span>
                  <span className="font-mono text-[11px] text-amber-700">ActionBlock</span>
                </div>
                <ActionBlockPrimitive content={ALL_PRIMITIVES[7].data} />
              </div>

              {/* 5. Wayfinding (Full width) */}
              <div className="flex flex-col gap-2 md:col-span-2">
                <div className="flex items-center justify-between text-xs font-bold text-neutral-500 px-1">
                  <span>5. Wayfinding (Progression and Orientation)</span>
                  <span className="font-mono text-[11px] text-teal-700">WayfindingBlock</span>
                </div>
                <WayfindingBlockPrimitive content={ALL_PRIMITIVES[9].data} />
              </div>
            </div>
          </div>
        )}

        {/* VIEW 3: GRAPHQL SCHEMA & REGISTRATION CODE */}
        {activeTab === 'code' && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* GraphQL Query Box */}
            <div className="bg-neutral-900 rounded-2xl p-6 text-neutral-200 border border-neutral-800 shadow-md">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-4">
                <div className="flex items-center gap-2">
                  <Terminal className="w-4 h-4 text-blue-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    Optimizely Graph Query
                  </span>
                </div>
                <span className="text-[11px] font-mono text-emerald-400">GraphQL v2</span>
              </div>
              <pre className="text-xs font-mono leading-relaxed overflow-x-auto text-emerald-300">
{`query GetExperienceByIntent(
  $intent: String = "compliance",
  $audience: String = "financial",
  $domain: String = "security"
) {
  # Querying across all 5 Universal Primitives
  CardBlock(
    where: {
      Intent: { eq: $intent }
      Audience: { eq: $audience }
      Domain: { eq: $domain }
    }
  ) {
    items {
      _metadata { key displayName }
      Title
      Eyebrow
      Description
      Link { url { default } text }
      Intent
      Audience
    }
  }

  RichTextBlock(
    where: {
      Intent: { eq: $intent }
      Domain: { eq: $domain }
    }
  ) {
    items {
      _metadata { key }
      Body { json }
      Intent
    }
  }
}`}
              </pre>
            </div>

            {/* Registry.ts Setup Box */}
            <div className="bg-neutral-900 rounded-2xl p-6 text-neutral-200 border border-neutral-800 shadow-md">
              <div className="flex items-center justify-between pb-4 border-b border-neutral-800 mb-4">
                <div className="flex items-center gap-2">
                  <Code2 className="w-4 h-4 text-purple-400" />
                  <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">
                    cms/registry.ts Registration
                  </span>
                </div>
                <span className="text-[11px] font-mono text-purple-400">SDK Wire-up</span>
              </div>
              <pre className="text-xs font-mono leading-relaxed overflow-x-auto text-neutral-300">
{`import { initContentTypeRegistry } from '@optimizely/cms-sdk';
import { initReactComponentRegistry } from '@optimizely/cms-sdk/react/server';

// 1. Export Content Types for CLI push
export const registeredContentTypes = [
  RichTextContentType,      // Prose
  CardBlockContentType,     // Card
  ActionBlockContentType,   // Action
  MediaBlockContentType,    // Media
  WayfindingBlockContentType// Wayfinding
];

initContentTypeRegistry(registeredContentTypes);

// 2. Map CMS Key -> React Component
initReactComponentRegistry({
  resolver: {
    RichTextBlock: RichText,
    CardBlock: CardBlock,
    ActionBlock: ActionBlock,
    MediaBlock: MediaBlock,
    WayfindingBlock: WayfindingBlock,
  },
});`}
              </pre>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
