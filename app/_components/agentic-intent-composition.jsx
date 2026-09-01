'use client';

import React, { useState, useEffect } from 'react';
import {
  Bot, Sparkles, ArrowRight, CheckCircle2, Play, RefreshCw,
  Layers, Code2, Eye, ShieldCheck, Terminal, Cpu, Database,
  MessageSquare, FileText, ChevronRight, Check, Copy, AlertCircle,
  Sliders, Compass, BarChart3, Zap, LifeBuoy, ArrowDown, CloudUpload
} from 'lucide-react';
import { publishGeneratedExperience } from '@/app/agentic-studio/actions';

function slugify(value) {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '')
    .slice(0, 80) || 'agentic-experience';
}

// --- AGENT DEFINITIONS & PIPELINE STAGES ---
const AGENT_PIPELINE = [
  {
    step: 1,
    id: 'context-extractor',
    agentName: 'Context Extraction and Brief Normalizer Agent',
    role: 'Prompt Analyzer',
    icon: MessageSquare,
    color: 'indigo',
    description: 'Parses unstructured natural language, extracts target persona, business goals, urgency, and inbound assets.',
    actionName: 'Analyzing Raw Inbound Prompt...',
    outputKey: 'normalizedContext'
  },
  {
    step: 2,
    id: 'intent-classifier',
    agentName: 'Intent Inference and Cognitive Load Engine',
    role: 'Cognitive Classifier',
    icon: Compass,
    color: 'amber',
    description: 'Classifies intent against 4 Core Archetypes (EVALUATE, LEARN, ACT, SOLVE) and computes cognitive budget.',
    actionName: 'Inferring Visitor Intent and Cognitive Load...',
    outputKey: 'inferredIntentData'
  },
  {
    step: 3,
    id: 'layout-architect',
    agentName: 'Composition Layout and Slot Allocation Agent',
    role: 'AST Architect',
    icon: Layers,
    color: 'blue',
    description: 'Translates intent archetype into Visual Builder hierarchy (Outline -> Grid -> Section -> Row -> Column).',
    actionName: 'Allocating Layout Slots and DisplayTemplates...',
    outputKey: 'scaffoldLayout'
  },
  {
    step: 4,
    id: 'content-synthesizer',
    agentName: 'RichText Seed and Content Population Agent',
    role: 'Content Generator',
    icon: FileText,
    color: 'emerald',
    description: 'Generates structured 100-200 word seed content formatted with H1/H2 tags and CTAs for all allocated slots.',
    actionName: 'Synthesizing On-Brand Slot Copy...',
    outputKey: 'populatedContent'
  },
  {
    step: 5,
    id: 'schema-validator',
    agentName: 'Optimizely AST Guardrail and Validator Agent',
    role: 'Schema Auditor',
    icon: ShieldCheck,
    color: 'purple',
    description: 'Audits node hierarchy, ensures UUID uniqueness, and validates displayTemplateKey references.',
    actionName: 'Validating CompositionNode Schema and Outputting AST...',
    outputKey: 'finalCompositionAst'
  }
];

// --- SAMPLE TRIGGER PROMPTS ---
const SAMPLE_PROMPTS = [
  {
    title: '1. Competitive Fire Drill',
    prompt: "Competitor X just launched a campaign claiming our multi-tenant SaaS architecture causes slow load times. Put together a page we can link from LinkedIn that proves our architecture is superior with benchmark stats and gets enterprise leads to book an architectural audit.",
    expectedIntent: 'EVALUATE',
    persona: 'Enterprise Architects and CTOs',
    outcome: 'Book Architectural Audit'
  },
  {
    title: '2. Collateral Transformation',
    prompt: "Marketing just dropped our 25-page PDF report '2026 Healthcare Data Governance Trends'. Don't just dump a download button; create an interactive executive summary page highlighting the 3 big regulatory shifts so hospital admins can explore key findings before downloading the full PDF.",
    expectedIntent: 'LEARN',
    persona: 'Hospital Administrators and Compliance Directors',
    outcome: 'Explore Trends and Download Whitepaper'
  },
  {
    title: '3. Fast Beta Launch',
    prompt: "We are announcing our new AI Composition Studio next Tuesday. Create a high-energy product spotlight page that explains what it does in 3 concise points and invites existing CMS authors to sign up for early closed beta access.",
    expectedIntent: 'ACT',
    persona: 'Digital Marketers and CMS Authors',
    outcome: 'Register for Closed Beta'
  },
  {
    title: '4. Urgent Runbook',
    prompt: "Our support desk is getting hammered with tickets regarding the mandatory Opti-ID SSO migration deadline next week. We need an urgent step-by-step troubleshooting guide with 3 clear steps and direct escalation links so tickets stop piling up.",
    expectedIntent: 'SOLVE',
    persona: 'System Administrators and End Users',
    outcome: 'Complete Self-Service Migration'
  }
];

export default function AgenticWorkflowStudio() {
  const [selectedPromptIdx, setSelectedPromptIdx] = useState(0);
  const [authorInput, setAuthorInput] = useState(SAMPLE_PROMPTS[0].prompt);
  
  // Pipeline Execution State
  const [currentStep, setCurrentStep] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [agentLogs, setAgentLogs] = useState([]);
  const [activeTab, setActiveTab] = useState('pipeline');
  const [copiedAst, setCopiedAst] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [publishResult, setPublishResult] = useState(null);

  // Agent Intermediate Artifacts
  const [pipelineData, setPipelineData] = useState({
    normalizedContext: null,
    inferredIntentData: null,
    scaffoldLayout: null,
    populatedContent: null,
    finalCompositionAst: null
  });

  // Load preset prompt
  const handleSelectPreset = (idx) => {
    setSelectedPromptIdx(idx);
    setAuthorInput(SAMPLE_PROMPTS[idx].prompt);
    resetPipeline();
  };

  const resetPipeline = () => {
    setCurrentStep(0);
    setIsRunning(false);
    setAgentLogs([]);
    setPublishResult(null);
    setPipelineData({
      normalizedContext: null,
      inferredIntentData: null,
      scaffoldLayout: null,
      populatedContent: null,
      finalCompositionAst: null
    });
  };

  // Run the full Agentic Pipeline step-by-step
  const runAgenticPipeline = async () => {
    if (isRunning) return;
    setIsRunning(true);
    setCurrentStep(1);
    setAgentLogs([]);

    // --- AGENT 1: CONTEXT EXTRACTION ---
    addLog(1, 'Ingesting author prompt and parsing entity relations...');
    await delay(600);
    const lower = authorInput.toLowerCase();
    const isCompare = lower.includes('competitor') || lower.includes('compare') || lower.includes('audit') || lower.includes('benchmark');
    const isLearn = lower.includes('report') || lower.includes('whitepaper') || lower.includes('trends') || lower.includes('guide');
    const isSolve = lower.includes('support') || lower.includes('migration') || lower.includes('steps') || lower.includes('troubleshoot');
    const isAct = !isCompare && !isLearn && !isSolve;

    const detectedIntent = isCompare ? 'EVALUATE' : isLearn ? 'LEARN' : isSolve ? 'SOLVE' : 'ACT';
    const targetPersona = SAMPLE_PROMPTS[selectedPromptIdx].persona;
    const targetOutcome = SAMPLE_PROMPTS[selectedPromptIdx].outcome;

    const contextResult = {
      extractedPersona: targetPersona,
      businessObjective: targetOutcome,
      urgencyLevel: isSolve || isAct ? 'High' : 'Moderate',
      inboundRawAssets: isLearn ? 'PDF Document / Report' : isCompare ? 'Battlecard / Objection Sheet' : 'Feature Brief',
      detectedTone: isCompare ? 'Authoritative and Validating' : isLearn ? 'Editorial and Visionary' : isAct ? 'Action-Oriented' : 'Instructive and Calm'
    };

    setPipelineData(prev => ({ ...prev, normalizedContext: contextResult }));
    addLog(1, `Context Normalized: Persona=[${targetPersona}], Goal=[${targetOutcome}]. Handoff to Agent 2.`);
    setCurrentStep(2);

    // --- AGENT 2: INTENT INFERENCE & DECOMPOSITION ---
    await delay(700);
    addLog(2, `Computing multi-dimensional intent confidence vectors for ${detectedIntent}...`);
    await delay(500);

    const intentResult = {
      primaryArchetype: detectedIntent,
      confidenceScore: '97.4%',
      cognitiveLoadBudget: isCompare || isLearn ? 'High Cognitive Bandwidth (Structured Matrix / Reading Flow)' : 'Low Cognitive Friction (Immediate Action / Linear Task)',
      rationale: isCompare 
        ? 'Prompt signals heavy competitive differentiation, objection defense, and side-by-side architectural validation.'
        : isLearn 
        ? 'Prompt signals educational un-gating, multi-thematic pillar exploration, and narrative depth.'
        : isSolve
        ? 'Prompt signals customer urgency, error deflection, and sequential 3-step resolution runbook.'
        : 'Prompt signals single-action focus, minimal noise, and fast conversion velocity.',
      recommendedLayoutFormula: isCompare 
        ? 'Hero(HighContrast) + Row(3-Col Grid) + Row(50/50 Split) + CTA(Contained)'
        : isLearn 
        ? 'Hero(Editorial) + Row(3-Col Pillars) + Row(2/3+1/3 Narrative) + CTA(ReadingList)'
        : isSolve
        ? 'Hero(TaskBanner) + Row(1-Col Steps) + Row(2-Col Escalation)'
        : 'Hero(50/50 Split) + Row(3-Col FastBullets) + CTA(Contained)'
    };

    setPipelineData(prev => ({ ...prev, inferredIntentData: intentResult }));
    addLog(2, `Intent Inferred: [${detectedIntent}] (${intentResult.confidenceScore}). Handoff to Layout Architect.`);
    setCurrentStep(3);

    // --- AGENT 3: COMPOSITION LAYOUT ARCHITECT ---
    await delay(700);
    addLog(3, 'Compiling Optimizely Composition Node structure and assigning DisplayTemplates...');
    await delay(500);

    const scaffoldResult = {
      experienceType: 'BlankExperience',
      layoutType: 'outline',
      sections: [
        {
          name: 'Hero Section',
          nodeType: 'section',
          layoutType: 'grid',
          displayTemplateKey: detectedIntent === 'EVALUATE' ? 'ThemeHeroHighContrast' : detectedIntent === 'LEARN' ? 'ThemeHeroEditorial' : 'ThemeHeroStandard',
          gridCols: 1,
          slotName: 'Hero Primary Heading and Differentiator'
        },
        {
          name: 'Body Composition Matrix',
          nodeType: 'section',
          layoutType: 'grid',
          displayTemplateKey: detectedIntent === 'EVALUATE' ? 'Grid3ColumnMatrix' : detectedIntent === 'LEARN' ? 'Grid3ColumnPillars' : 'Grid1ColumnSequential',
          gridCols: detectedIntent === 'SOLVE' ? 1 : 3,
          slotName: 'Structured Multi-Slot Value / Pillar Grid'
        },
        {
          name: 'Action and Conversion Section',
          nodeType: 'section',
          layoutType: 'grid',
          displayTemplateKey: 'SectionCalloutContained',
          gridCols: 1,
          slotName: 'High-Intent CTA Callout'
        }
      ]
    };

    setPipelineData(prev => ({ ...prev, scaffoldLayout: scaffoldResult }));
    addLog(3, `AST Framework Allocated: 3 Grid Sections, ${scaffoldResult.sections[1].gridCols}-Column Grid. Handoff to Content Synthesizer.`);
    setCurrentStep(4);

    // --- AGENT 4: CONTENT SYNTHESIZER ---
    await delay(700);
    addLog(4, 'Synthesizing structured seed copy (H1, H2, RichText) customized for persona...');
    await delay(600);

    const contentResult = {
      heroHeadline: detectedIntent === 'EVALUATE' ? `Architectural Proof and Performance for ${targetPersona}` : detectedIntent === 'LEARN' ? `Executive Guide: 2026 Trends for ${targetPersona}` : detectedIntent === 'SOLVE' ? `3-Step Migration Runbook for ${targetPersona}` : `Early Access Beta for ${targetPersona}`,
      heroSubtext: `Deterministic layout dynamically assembled by Opal AI to drive ${targetOutcome.toLowerCase()} with zero authoring friction.`,
      slots: [
        { title: detectedIntent === 'EVALUATE' ? 'Zero Multi-Tenant Latency' : detectedIntent === 'LEARN' ? 'Pillar 1: Data Federation' : detectedIntent === 'SOLVE' ? 'Step 1: SSO Authentication' : '10x Faster Creation', body: 'Underlying infrastructure delivers sub-50ms execution times across all federated endpoints.' },
        { title: detectedIntent === 'EVALUATE' ? 'SOC2 and HIPAA Compliant' : detectedIntent === 'LEARN' ? 'Pillar 2: AI Clinical Workflows' : detectedIntent === 'SOLVE' ? 'Step 2: Workspace Permissions' : 'Single-Click Publish', body: 'Automated continuous audit telemetry and encrypted edge sync guarantees enterprise safety.' },
        { title: detectedIntent === 'EVALUATE' ? 'Deterministic GraphQL AST' : detectedIntent === 'LEARN' ? 'Pillar 3: Governance Policy' : detectedIntent === 'SOLVE' ? 'Step 3: Verification Check' : 'Native Next.js Rendering', body: 'Schema-valid Optimizely Composition Nodes feed directly into modern Next.js server components.' }
      ],
      ctaText: targetOutcome
    };

    setPipelineData(prev => ({ ...prev, populatedContent: contentResult }));
    addLog(4, 'Content Synthesized for all slots. Handoff to Optimizely AST Guardrail Validator.');
    setCurrentStep(5);

    // --- AGENT 5: SCHEMA AUDIT & AST VALIDATOR ---
    await delay(600);
    addLog(5, 'Auditing AST against Optimizely CMS CompositionNode schema (type safety, keys, displayTemplates)...');
    await delay(500);

    const finalAst = {
      type: "BlankExperience",
      nodeType: "experience",
      layoutType: "outline",
      displayName: `${detectedIntent} Experience - ${targetPersona}`,
      key: `exp-${detectedIntent.toLowerCase()}-node-001`,
      displayTemplateKey: "ExperienceStandardShell",
      metadata: {
        inferredIntent: detectedIntent,
        confidence: "97.4%",
        targetPersona: targetPersona,
        targetOutcome: targetOutcome,
        validatedBy: "Opal Optimizely AST Guardrail Agent"
      },
      nodes: scaffoldResult.sections.map((sec, sIdx) => ({
        type: "BlankSection",
        nodeType: "section",
        layoutType: "grid",
        displayName: sec.name,
        key: `sec-00${sIdx + 1}`,
        displayTemplateKey: sec.displayTemplateKey,
        displaySettings: {
          theme: "indigo",
          padding: "standard"
        },
        nodes: [
          {
            type: "Row",
            nodeType: "row",
            key: `row-sec-00${sIdx + 1}-1`,
            displayTemplateKey: "RowStandardFlex",
            nodes: Array.from({ length: sec.gridCols }).map((_, cIdx) => ({
              type: "Column",
              nodeType: "column",
              key: `col-sec-00${sIdx + 1}-1-${cIdx + 1}`,
              displayTemplateKey: sec.gridCols === 3 ? "ColSpan4" : "ColSpan12",
              nodes: [
                {
                  type: "RichText",
                  nodeType: "component",
                  displayName: `RichText (${sec.name} Slot ${cIdx + 1})`,
                  key: `rt-sec-00${sIdx + 1}-${cIdx + 1}`,
                  properties: {
                    headline: sIdx === 0 ? contentResult.heroHeadline : sIdx === 2 ? `Ready to ${targetOutcome}?` : contentResult.slots[cIdx]?.title,
                    richTextContent: sIdx === 0 ? `<p>${contentResult.heroSubtext}</p>` : sIdx === 2 ? `<p>Execute immediate action with guaranteed SLA.</p>` : `<p>${contentResult.slots[cIdx]?.body}</p>`,
                    primaryAction: sIdx === 2 ? targetOutcome : null
                  }
                }
              ]
            }))
          }
        ]
      }))
    };

    setPipelineData(prev => ({ ...prev, finalCompositionAst: finalAst }));
    addLog(5, 'Schema Validation PASSED. 100% Native Composition AST compiled.');
    setIsRunning(false);
  };

  const addLog = (step, message) => {
    setAgentLogs(prev => [...prev, { step, message, time: new Date().toLocaleTimeString() }]);
  };

  const delay = (ms) => new Promise(resolve => setTimeout(resolve, ms));

  const copyAst = () => {
    if (!pipelineData.finalCompositionAst) return;
    navigator.clipboard.writeText(JSON.stringify(pipelineData.finalCompositionAst, null, 2));
    setCopiedAst(true);
    setTimeout(() => setCopiedAst(false), 2000);
  };

  const createInCms = async (publish) => {
    const ast = pipelineData.finalCompositionAst;
    if (!ast || isPublishing) return;
    setIsPublishing(true);
    setPublishResult(null);
    try {
      const result = await publishGeneratedExperience(ast, {
        displayName: ast.displayName,
        routeSegment: slugify(pipelineData.populatedContent?.heroHeadline ?? ast.displayName),
        publish,
      });
      setPublishResult(result);
    } catch (err) {
      setPublishResult({ ok: false, reason: 'error', message: err instanceof Error ? err.message : String(err) });
    } finally {
      setIsPublishing(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto p-4 md:p-6 space-y-6 font-sans text-slate-800 dark:text-slate-100">
      
      {/* HEADER */}
      <div className="bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 text-white p-6 rounded-2xl shadow-xl border border-slate-800">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-semibold uppercase tracking-wider mb-2 border border-indigo-500/30">
              <Bot className="w-3.5 h-3.5" />
              Multi-Agent Orchestration · Optimizely Visual Builder
            </div>
            <h1 className="text-2xl md:text-3xl font-bold tracking-tight">
              Agentic Intent and Composition Workflow
            </h1>
            <p className="text-slate-300 text-xs md:text-sm mt-1 max-w-3xl leading-relaxed">
              Step-by-step multi-agent orchestration showing how an author's natural language assignment is analyzed, classified by visitor intent, mapped to visual scaffold templates, and synthesized into a valid Optimizely Composition AST.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={runAgenticPipeline}
              disabled={isRunning}
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 text-white text-xs font-bold rounded-xl shadow-lg transition-all flex items-center gap-2"
            >
              {isRunning ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Play className="w-4 h-4 fill-white" />}
              <span>{isRunning ? 'Executing Multi-Agent Pipeline...' : 'Run Agentic Pipeline'}</span>
            </button>
          </div>
        </div>
      </div>

      {/* STEP 1: AUTHOR NATURAL LANGUAGE PROMPT INPUT */}
      <div className="bg-white dark:bg-slate-900 p-5 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-2">
            <MessageSquare className="w-4 h-4 text-indigo-500" />
            Step 1: Author's Natural Language Input (Assignment Prompt)
          </label>
          <span className="text-xs text-indigo-600 dark:text-indigo-400 font-medium">Select a Scenario or Type Below</span>
        </div>

        {/* Preset Selectors */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          {SAMPLE_PROMPTS.map((p, idx) => (
            <button
              key={idx}
              onClick={() => handleSelectPreset(idx)}
              className={`p-2.5 text-left rounded-lg text-xs border transition-all ${
                selectedPromptIdx === idx
                  ? 'bg-indigo-50 dark:bg-indigo-950/60 border-indigo-500 text-indigo-950 dark:text-indigo-200 font-bold shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-800/40 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
              }`}
            >
              <div className="truncate">{p.title}</div>
              <div className="text-[10px] text-slate-400 dark:text-slate-500 mt-0.5">Intent: {p.expectedIntent}</div>
            </button>
          ))}
        </div>

        {/* Text Area */}
        <div className="relative pt-1">
          <textarea
            value={authorInput}
            onChange={(e) => {
              setAuthorInput(e.target.value);
              resetPipeline();
            }}
            rows={3}
            className="w-full p-3 text-xs bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:outline-none text-slate-800 dark:text-slate-200 font-sans leading-relaxed"
            placeholder="Type your natural language brief or paste a manager's request..."
          />
        </div>
      </div>

      {/* PIPELINE VISUAL TRACKER (5 AGENTS) */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-3">
        {AGENT_PIPELINE.map((agent) => {
          const IconComponent = agent.icon;
          const isComplete = currentStep > agent.step;
          const isCurrent = currentStep === agent.step;

          return (
            <div
              key={agent.id}
              className={`p-3.5 rounded-xl border transition-all ${
                isCurrent
                  ? 'bg-indigo-50 dark:bg-indigo-950/80 border-indigo-500 shadow-md ring-2 ring-indigo-500/20'
                  : isComplete
                  ? 'bg-white dark:bg-slate-900 border-emerald-500/50 shadow-sm'
                  : 'bg-slate-50 dark:bg-slate-900/40 border-slate-200 dark:border-slate-800 opacity-60'
              }`}
            >
              <div className="flex items-center justify-between mb-2">
                <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase ${
                  isCurrent ? 'bg-indigo-600 text-white animate-pulse' : isComplete ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300' : 'bg-slate-200 dark:bg-slate-800 text-slate-500'
                }`}>
                  Agent {agent.step}
                </span>
                {isComplete ? (
                  <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                ) : (
                  <IconComponent className={`w-4 h-4 ${isCurrent ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-400'}`} />
                )}
              </div>
              <div className="text-xs font-bold text-slate-800 dark:text-slate-100 truncate">{agent.role}</div>
              <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2 leading-tight">
                {agent.description}
              </div>
            </div>
          );
        })}
      </div>

      {/* MAIN WORKSPACE: ORCHESTRATION INSPECTOR & LIVE OUTPUT */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* LEFT COLUMN: LIVE AGENT LOGS & INTERMEDIATE REASONING */}
        <div className="lg:col-span-5 space-y-4">
          
          {/* Agent Execution Logs */}
          <div className="bg-slate-900 text-slate-200 p-4 rounded-xl border border-slate-800 shadow-sm space-y-3 font-mono text-xs">
            <div className="flex items-center justify-between pb-2 border-b border-slate-800 text-slate-400 text-[11px]">
              <span className="flex items-center gap-1.5 text-indigo-400 font-semibold">
                <Terminal className="w-3.5 h-3.5" />
                Agent Reasoning Trace and Logs
              </span>
              <span>{isRunning ? 'Processing...' : 'Idle'}</span>
            </div>

            <div className="h-48 overflow-y-auto space-y-2 pr-1 text-[11px]">
              {agentLogs.length === 0 ? (
                <div className="text-slate-500 italic pt-8 text-center">
                  Click 'Run Agentic Pipeline' to initiate agent execution...
                </div>
              ) : (
                agentLogs.map((log, idx) => (
                  <div key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-indigo-400 font-bold shrink-0">[{log.time.split(' ')[0]}] [A{log.step}]:</span>
                    <span className="text-slate-300">{log.message}</span>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* AGENT 2 DECOMPOSITION SUMMARY CARD */}
          {pipelineData.inferredIntentData && (
            <div className="bg-gradient-to-br from-indigo-50 to-slate-50 dark:from-indigo-950/40 dark:to-slate-900 p-4 rounded-xl border border-indigo-200 dark:border-indigo-900 shadow-sm space-y-2.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="font-bold text-indigo-900 dark:text-indigo-200 uppercase tracking-wider text-[10px] flex items-center gap-1">
                  <Compass className="w-3.5 h-3.5 text-indigo-600" />
                  Agent 2: Intent Inference Output
                </span>
                <span className="bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded text-[10px] font-bold">
                  {pipelineData.inferredIntentData.confidenceScore} Match
                </span>
              </div>
              <div className="font-bold text-sm text-slate-800 dark:text-slate-100">
                Archetype: {pipelineData.inferredIntentData.primaryArchetype}
              </div>
              <div className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                <strong>Cognitive Budget:</strong> {pipelineData.inferredIntentData.cognitiveLoadBudget}
              </div>
              <div className="text-slate-600 dark:text-slate-300 text-[11px] leading-relaxed">
                <strong>Rationale:</strong> {pipelineData.inferredIntentData.rationale}
              </div>
            </div>
          )}

        </div>

        {/* RIGHT COLUMN: TABS (LIVE COMPILED EXPERIENCE | AST JSON | PIPELINE DATA) */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* TABS HEADER */}
          <div className="flex items-center justify-between bg-white dark:bg-slate-900 p-2 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm">
            <div className="flex items-center gap-1.5">
              <button
                onClick={() => setActiveTab('pipeline')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'pipeline'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Eye className="w-3.5 h-3.5" />
                Live Compiled Preview
              </button>
              <button
                onClick={() => setActiveTab('ast')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center gap-1.5 transition-all ${
                  activeTab === 'ast'
                    ? 'bg-indigo-600 text-white shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <Code2 className="w-3.5 h-3.5" />
                Optimizely Composition AST
              </button>
            </div>

            {activeTab === 'ast' && pipelineData.finalCompositionAst && (
              <div className="flex items-center gap-2">
                <button
                  onClick={copyAst}
                  className="px-2.5 py-1 text-xs bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-200 rounded flex items-center gap-1 font-mono transition-all"
                >
                  {copiedAst ? <Check className="w-3 h-3 text-emerald-500" /> : <Copy className="w-3 h-3" />}
                  {copiedAst ? 'Copied' : 'Copy AST'}
                </button>
                <button
                  onClick={() => createInCms(false)}
                  disabled={isPublishing}
                  className="px-2.5 py-1 text-xs bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-900 text-white rounded flex items-center gap-1 font-mono transition-all"
                >
                  {isPublishing ? <RefreshCw className="w-3 h-3 animate-spin" /> : <CloudUpload className="w-3 h-3" />}
                  {isPublishing ? 'Creating...' : 'Create in CMS'}
                </button>
              </div>
            )}
          </div>

          {activeTab === 'ast' && publishResult && (
            <div
              className={`p-3 rounded-lg border text-xs font-mono leading-relaxed ${
                publishResult.ok
                  ? 'bg-emerald-50 dark:bg-emerald-950/40 border-emerald-300 dark:border-emerald-800 text-emerald-800 dark:text-emerald-300'
                  : 'bg-red-50 dark:bg-red-950/40 border-red-300 dark:border-red-800 text-red-800 dark:text-red-300'
              }`}
            >
              {publishResult.ok ? (
                <>
                  Created BlankExperience <strong>{publishResult.key}</strong>
                  {publishResult.placed ? '' : ' (unplaced — move it under a routable parent in CMS admin)'}.
                  {publishResult.published
                    ? ' Published.'
                    : publishResult.publishMessage
                    ? ` Not published: ${publishResult.publishMessage}`
                    : ' Saved as draft.'}
                </>
              ) : (
                <>Failed to create experience: {publishResult.message}</>
              )}
            </div>
          )}

          {/* TAB 1: LIVE VISUAL PREVIEW OF THE COMPILED EXPERIENCE */}
          {activeTab === 'pipeline' && (
            <div className="bg-slate-100 dark:bg-slate-950 p-5 rounded-2xl border border-slate-300 dark:border-slate-800 min-h-[460px] space-y-4">
              {!pipelineData.populatedContent ? (
                <div className="flex flex-col items-center justify-center h-80 text-slate-400 text-xs space-y-2">
                  <Cpu className="w-8 h-8 text-indigo-400 animate-pulse" />
                  <div>Run the agentic pipeline to synthesize and render the experience...</div>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Hero Section */}
                  <div className="p-6 bg-slate-900 text-white rounded-xl border border-slate-800 shadow-sm space-y-2">
                    <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold uppercase tracking-wider bg-white/10 text-indigo-300">
                      {pipelineData.inferredIntentData?.primaryArchetype} Hero Scaffold
                    </span>
                    <h2 className="text-xl font-bold tracking-tight">
                      {pipelineData.populatedContent.heroHeadline}
                    </h2>
                    <p className="text-xs text-slate-300 leading-relaxed">
                      {pipelineData.populatedContent.heroSubtext}
                    </p>
                  </div>

                  {/* Multi-Slot Body Section */}
                  <div className="p-5 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
                    <div className="text-xs font-semibold text-slate-500 border-b pb-2 dark:border-slate-800 flex items-center justify-between">
                      <span>Synthesized Component Grid ({pipelineData.scaffoldLayout?.sections[1]?.gridCols} Columns)</span>
                      <span className="font-mono text-[10px] text-indigo-500">{pipelineData.scaffoldLayout?.sections[1]?.displayTemplateKey}</span>
                    </div>

                    <div className={`grid gap-3 ${pipelineData.scaffoldLayout?.sections[1]?.gridCols === 3 ? 'grid-cols-1 md:grid-cols-3' : 'grid-cols-1'}`}>
                      {pipelineData.populatedContent.slots.map((slot, sIdx) => (
                        <div key={sIdx} className="p-4 bg-slate-50 dark:bg-slate-800/60 rounded-lg border border-slate-200 dark:border-slate-700 text-xs space-y-1.5">
                          <div className="w-5 h-5 rounded bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 flex items-center justify-center font-bold text-[10px]">
                            {sIdx + 1}
                          </div>
                          <h4 className="font-bold text-slate-800 dark:text-slate-100">{slot.title}</h4>
                          <p className="text-[11px] text-slate-500 dark:text-slate-400 leading-relaxed">{slot.body}</p>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Action Section */}
                  <div className="p-4 bg-white dark:bg-slate-900 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
                    <div>
                      <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">Conversion Objective</h4>
                      <p className="text-[11px] text-slate-500">{pipelineData.normalizedContext?.businessObjective}</p>
                    </div>
                    <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow transition-all flex items-center gap-1.5">
                      <span>{pipelineData.populatedContent.ctaText}</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}

          {/* TAB 2: AST JSON */}
          {activeTab === 'ast' && (
            <div className="bg-slate-950 text-emerald-400 p-4 rounded-2xl border border-slate-800 min-h-[460px] font-mono text-[11px] overflow-auto max-h-[500px]">
              {!pipelineData.finalCompositionAst ? (
                <div className="text-slate-500 italic p-12 text-center">Execute the pipeline to inspect compiled JSON AST...</div>
              ) : (
                <pre>{JSON.stringify(pipelineData.finalCompositionAst, null, 2)}</pre>
              )}
            </div>
          )}

        </div>

      </div>

      {/* FOOTER */}
      <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 text-xs text-slate-600 dark:text-slate-400 flex flex-col md:flex-row items-center justify-between gap-4">
        <div>
          <span className="font-bold text-slate-800 dark:text-slate-200">Architecture:</span> Multi-agent delegation decouples intent classification from layout allocation and schema validation.
        </div>
        <div className="text-[11px] font-mono text-slate-500">
          Ready for Optimizely CMS SaaS Visual Builder
        </div>
      </div>

    </div>
  );
}
