'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import type { ResolvedContent } from '../_lib/twoPassResolve';

const LightningIcon = ({ className }: { className?: string }) => (
  <svg className={className} fill="none" stroke="currentColor" viewBox="0 0 24 24">
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
  </svg>
);

const OpalAvatar = () => (
  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
    <LightningIcon className="w-4 h-4 text-purple-600" />
  </div>
);

const TypingDots = () => (
  <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm flex items-center gap-1">
    <div className="typing-dot" />
    <div className="typing-dot" />
    <div className="typing-dot" />
  </div>
);

export default function KbWorkspaceShell({ resolvedContent }: { resolvedContent: ResolvedContent }) {
  const [step, setStep] = useState(0);
  const [showToggleBtn, setShowToggleBtn] = useState(false);
  const [backstagePhase, setBackstagePhase] = useState(0);
  const chatRef = useRef<HTMLDivElement>(null);

  const lob              = resolvedContent.lob;
  const jurisdiction     = resolvedContent.jurisdiction;
  const jurisdictionName = resolvedContent.jurisdictionName;
  const pass             = resolvedContent.pass;
  const sourceLabel      = resolvedContent.overrideLabel;
  const coreHtml         = resolvedContent.corePrinciple;
  const overrideHtml     = resolvedContent.override;
  const safeguardHtml    = resolvedContent.proceduralSafeguard;
  const disclosureHtml   = resolvedContent.disclosure;

  const scrollToBottom = () => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  };

  useEffect(() => { scrollToBottom(); }, [step]);

  useEffect(() => {
    if (step === 0) return;
    const timers: ReturnType<typeof setTimeout>[] = [];

    if (step === 1) {
      timers.push(setTimeout(() => setStep(2), 400));
    } else if (step === 3) {
      timers.push(setTimeout(() => setShowToggleBtn(true), 500));
    }

    return () => { timers.forEach(clearTimeout); };
  }, [step]);

  useEffect(() => {
    if (backstagePhase === 1) {
      const t = setTimeout(() => setBackstagePhase(2), 900);
      return () => clearTimeout(t);
    }
    if (backstagePhase === 3) {
      const t = setTimeout(() => setBackstagePhase(4), 1000);
      return () => clearTimeout(t);
    }
    if (backstagePhase === 4) {
      const t = setTimeout(() => setBackstagePhase(5), 1200);
      return () => clearTimeout(t);
    }
  }, [backstagePhase]);

  useEffect(() => {
    if (backstagePhase >= 5 && step === 2) {
      const t = setTimeout(() => setStep(3), 2000);
      return () => clearTimeout(t);
    }
  }, [backstagePhase, step]);

  return (
    <div className="bg-gray-100 text-gray-800 h-screen flex flex-col overflow-hidden font-sans">

      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-4 md:px-6 shrink-0 z-10 relative shadow-sm gap-2">
        <div className="flex items-center gap-2 md:gap-4 min-w-0">
          <div className="text-[#007BC7] font-bold text-xl md:text-2xl tracking-tight italic shrink-0">PROGRESSIVE</div>
          <span className="text-gray-400 font-light text-xl hidden sm:inline">|</span>
          <span className="text-gray-600 font-medium text-sm md:text-base hidden sm:inline">Consultant Workspace</span>
        </div>
        <div className="flex items-center gap-2 md:gap-4 shrink-0">
          {showToggleBtn && (
            <Link
              href="/kb-workspace/cms"
              className="fade-in bg-gray-800 hover:bg-gray-700 text-white text-sm font-semibold py-2 px-4 rounded transition shadow"
            >
              Switch to CMS View
            </Link>
          )}
          <div className="w-8 h-8 rounded-full bg-[#007BC7] text-white flex items-center justify-center font-bold text-sm">
            SO
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden relative">
        <div className="flex flex-col md:flex-row w-full h-full">

          {/* Customer Context Sidebar */}
          <div className="hidden md:flex md:w-1/3 bg-white border-r border-gray-200 p-6 flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">Active Call</h2>
              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded animate-pulse">03:42</span>
            </div>
            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">JD</div>
                <div>
                  <h3 className="font-bold text-gray-900">John Doe</h3>
                  <p className="text-sm text-gray-500">Orlando, {jurisdictionName}</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Products</span>
                  <span className="font-semibold text-gray-800">Personal Auto</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Policy Tier</span>
                  <span className="font-semibold text-gray-800">Platinum</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Status</span>
                  <span className="font-semibold text-green-600">Active</span>
                </div>
              </div>
            </div>
            <div>
              <h3 className="text-sm font-bold text-gray-500 uppercase tracking-wider mb-3">Call Intent Prediction</h3>
              <div className="bg-blue-50 border border-blue-100 rounded p-3 text-sm text-[#004A8F]">
                <strong>At-Fault Accident:</strong> Customer recently involved in a reported accident. Likely inquiring about liability coverage and claim next steps.
              </div>
            </div>
          </div>

          {/* Opal Copilot Area */}
          <div className="w-full md:w-2/3 bg-gray-50 flex flex-col">

            {backstagePhase >= 1 && backstagePhase <= 5 && (
              <div className="fixed top-20 left-2 right-2 md:left-4 md:right-auto z-50 slide-in-right" style={{ maxWidth: 340 }}>
                <div className="bg-gray-900 rounded-xl shadow-2xl border border-gray-700 overflow-hidden">
                  <div className="flex items-center justify-between px-4 py-3 bg-gray-800 border-b border-gray-700">
                    <div className="flex items-center gap-2">
                      <svg className="w-4 h-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                      <span className="text-white font-bold text-sm">Behind the Scenes</span>
                    </div>
                    <button
                      onClick={() => setBackstagePhase(6)}
                      className="text-gray-400 hover:text-white text-lg leading-none"
                    >×</button>
                  </div>

                  <div className="p-4 space-y-3 font-mono text-xs">
                    <div className="fade-in flex gap-3">
                      <span className="text-[#007BC7] shrink-0 mt-0.5">→</span>
                      <div>
                        <div className="text-[#7DD3FC] font-bold">POST /api/opal/v1/trigger</div>
                        <div className="text-gray-400 mt-0.5">Question + CRM context (State={jurisdiction}, Policy={lob}-Platinum) sent to Opal Webhook</div>
                      </div>
                    </div>
                    {backstagePhase >= 2 && (
                      <div className="fade-in flex gap-3">
                        <span className="text-purple-400 shrink-0 mt-0.5">→</span>
                        <div>
                          <div className="text-purple-300 font-bold">Opal Workflow Agent: trigger received</div>
                          <div className="text-gray-400 mt-0.5">Webhook listener fires. Agent formulates GraphQL query for {jurisdiction} {resolvedContent.topic} coverage rules in Optimizely Graph</div>
                        </div>
                      </div>
                    )}
                    {backstagePhase >= 3 && (
                      <div className="fade-in flex gap-3">
                        <span className="text-green-400 shrink-0 mt-0.5">→</span>
                        <div>
                          <div className="text-green-300 font-bold">Optimizely Graph: query complete</div>
                          <div className="text-gray-400 mt-0.5">
                            {pass === 1
                              ? `Pass 1: ${jurisdiction} block found`
                              : `Pass 2: No ${jurisdiction} block — using National fallback`}
                            {' '}— content retrieved from policies index
                          </div>
                        </div>
                      </div>
                    )}
                    {backstagePhase >= 4 && (
                      <div className="fade-in flex gap-3">
                        <span className="text-yellow-400 shrink-0 mt-0.5">→</span>
                        <div>
                          <div className="text-yellow-300 font-bold">push_to_crm_ui tool executed</div>
                          <div className="text-gray-400 mt-0.5">Opal invokes the custom tool with the structured answer and citations</div>
                        </div>
                      </div>
                    )}
                    {backstagePhase >= 5 && (
                      <div className="fade-in flex gap-3">
                        <span className="text-[#007BC7] shrink-0 mt-0.5">→</span>
                        <div>
                          <div className="text-[#7DD3FC] font-bold">Response delivered to CRM UI</div>
                          <div className="text-gray-400 mt-0.5">The tool POSTs the answer back to the Next.js API — your interface renders it in real time</div>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="px-4 pb-4 flex items-center justify-between border-t border-gray-800 pt-3">
                    <Link href="/kb-workspace/webhook" className="text-[#007BC7] text-xs hover:underline font-mono">
                      View full architecture →
                    </Link>
                    {backstagePhase === 2 && (
                      <button
                        onClick={() => setBackstagePhase(3)}
                        className="bg-[#007BC7] hover:bg-[#004A8F] text-white text-xs px-3 py-1.5 rounded transition font-semibold"
                      >
                        Continue →
                      </button>
                    )}
                    {backstagePhase === 5 && (
                      <button
                        onClick={() => setBackstagePhase(6)}
                        className="bg-gray-700 hover:bg-gray-600 text-white text-xs px-3 py-1.5 rounded transition"
                      >
                        Got it
                      </button>
                    )}
                  </div>
                </div>
              </div>
            )}

            <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-2 shadow-sm z-10">
              <LightningIcon className="w-5 h-5 text-purple-600" />
              <h2 className="font-bold text-gray-800">Opal Knowledge Assistant</h2>
            </div>

            <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-6 pb-12">

              {/* Welcome */}
              <div className="flex gap-4">
                <OpalAvatar />
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm max-w-2xl">
                  <p className="text-gray-700">Hi Sarah, I see you&apos;re speaking with John Doe in {jurisdictionName}. How can I assist you with his bundled policy today?</p>
                  {step === 0 && (
                    <div className="mt-4 space-y-2">
                      <button
                        onClick={() => { setStep(1); setBackstagePhase(1); }}
                        className="w-full text-left bg-gray-50 hover:bg-[#007BC7] hover:text-white border border-gray-200 transition-colors p-3 rounded text-sm text-gray-700 flex justify-between items-center group shadow-sm"
                      >
                        <span>&ldquo;What does John&apos;s {jurisdictionName} auto policy cover for an at-fault accident, and what are his liability limits?&rdquo;</span>
                        <svg className="w-4 h-4 opacity-0 group-hover:opacity-100 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                        </svg>
                      </button>
                    </div>
                  )}
                </div>
              </div>

              {/* User Q1 */}
              {step >= 1 && (
                <div className="flex gap-4 flex-row-reverse fade-in">
                  <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center shrink-0 text-sm font-bold">SO</div>
                  <div className="bg-[#007BC7] text-white rounded-lg p-4 shadow-sm max-w-2xl">
                    <p>What does John&apos;s {jurisdictionName} auto policy cover for an at-fault accident, and what are his liability limits?</p>
                  </div>
                </div>
              )}

              {/* Typing 1 */}
              {step === 2 && (
                <div className="flex gap-4 fade-in">
                  <OpalAvatar />
                  <TypingDots />
                </div>
              )}

              {/* Answer 1 — four copy types */}
              {step >= 3 && (
                <div className="flex gap-4 fade-in">
                  <OpalAvatar />
                  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm max-w-2xl space-y-4">
                    <h4 className="font-bold text-gray-900">Coverage Found: {lob}</h4>

                    {/* 1 — Core Principle */}
                    <div>
                      <span className="inline-block text-xs font-bold uppercase tracking-wider text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 mb-2">National Policy</span>
                      {coreHtml ? (
                        <div className="text-gray-700 text-sm prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: coreHtml }} />
                      ) : (
                        <p className="text-gray-700 text-sm">Bodily injury and property damage liability coverage applies when the insured is at fault in an accident. Limits are defined by the policy schedule.</p>
                      )}
                    </div>

                    {/* 2 — Jurisdictional Override */}
                    <div className="border-t border-gray-100 pt-4">
                      <div className="flex items-center gap-2 mb-2">
                        <span className="text-xs font-bold uppercase tracking-wider text-[#004A8F] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">{jurisdictionName} Override</span>
                        <span className={`text-xs px-2 py-0.5 rounded font-semibold ${pass === 1 ? 'bg-blue-100 text-blue-700 border border-blue-200' : 'bg-yellow-100 text-yellow-700 border border-yellow-200'}`}>
                          {pass === 1 ? `Pass 1 · ${jurisdiction}` : `Pass 2 · National`}
                        </span>
                      </div>
                      {overrideHtml ? (
                        <div className="text-gray-700 text-sm prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: overrideHtml }} />
                      ) : (
                          <p className="text-gray-700 text-sm">{jurisdictionName} sets minimum liability limits that may differ from the national standard. The state-specific limits apply to this policy.</p>
                      )}
                    </div>

                    {/* 3 — Procedural Safeguard */}
                    <div className="border-t border-gray-100 pt-4">
                      <span className="inline-block text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mb-2">Consultant Action</span>
                      {safeguardHtml ? (
                        <div className="text-gray-700 text-sm prose prose-sm max-w-none" dangerouslySetInnerHTML={{ __html: safeguardHtml }} />
                      ) : (
                        <p className="text-gray-700 text-sm">Advise the insured not to admit fault or discuss the incident with the other party. Do not confirm final liability determination until the claim is reviewed.</p>
                      )}
                    </div>

                    {/* 4 — Statutory Disclosure */}
                    <div className="border-t border-gray-100 pt-4">
                      <span className="inline-block text-xs font-bold uppercase tracking-wider text-red-800 bg-red-50 px-2 py-0.5 rounded border border-red-200 mb-2">Required Disclosure</span>
                      {disclosureHtml ? (
                        <div className="text-gray-700 text-sm prose prose-sm max-w-none bg-red-50 border border-red-100 rounded p-3" dangerouslySetInnerHTML={{ __html: disclosureHtml }} />
                      ) : (
                        <p className="text-gray-700 text-sm bg-red-50 border border-red-100 rounded p-3">State-specific liability disclosure required. Verify compliance requirements with the {jurisdictionName} Department of Insurance before closing the call.</p>
                      )}
                    </div>

                    {/* Sources */}
                    <div className="pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Sources</p>
                      <div className="flex gap-2 flex-wrap">
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded cursor-pointer hover:bg-gray-200 transition border border-gray-200">
                          <svg className="w-3 h-3 text-[#007BC7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          {sourceLabel}
                        </span>
                        <span className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded font-semibold ${pass === 1 ? 'bg-blue-100 text-blue-800 border border-blue-200' : 'bg-yellow-100 text-yellow-800 border border-yellow-200'}`}>
                          {pass === 1 ? `Pass 1 · ${jurisdiction}` : `Pass 2 · National`}
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}


            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white border-t border-gray-200 shrink-0">
              <div className="relative">
                <input
                  type="text"
                  defaultValue=""
                  placeholder="Ask a follow-up question..."
                  readOnly
                  className="w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg bg-gray-50 focus:outline-none"
                />
                <button disabled className="absolute right-3 top-3 text-gray-400">
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
