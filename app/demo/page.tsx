'use client';

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';

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

type ClaimPhase = 'idle' | 'typing' | 'drafted' | 'dispatching' | 'dispatched';

export default function ProgressiveInteractiveDemoPage() {
  const [step, setStep] = useState(0);
  const [showToggleBtn, setShowToggleBtn] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [inputDisabled, setInputDisabled] = useState(true);
  const [inputPlaceholder, setInputPlaceholder] = useState('Select a prompt above to start...');
  const [claimPhase, setClaimPhase] = useState<ClaimPhase>('idle');
  const chatRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    if (chatRef.current) chatRef.current.scrollTop = chatRef.current.scrollHeight;
  };

  useEffect(() => { scrollToBottom(); }, [step, claimPhase]);

  useEffect(() => {
    if (step === 0) return;
    const timers: ReturnType<typeof setTimeout>[] = [];
    const intervals: ReturnType<typeof setInterval>[] = [];

    if (step === 1) {
      timers.push(setTimeout(() => setStep(2), 400));
    } else if (step === 2) {
      timers.push(setTimeout(() => setStep(3), 1500));
    } else if (step === 3) {
      timers.push(setTimeout(() => setShowToggleBtn(true), 500));
      timers.push(setTimeout(() => setStep(4), 2500));
    } else if (step === 4) {
      const text = 'What if the windshield was completely shattered?';
      setInputDisabled(false);
      setInputPlaceholder('');
      let i = 0;
      let currentVal = '';
      const interval = setInterval(() => {
        if (i < text.length) {
          currentVal += text.charAt(i);
          setInputValue(currentVal);
          i++;
        } else {
          clearInterval(interval);
          timers.push(setTimeout(() => {
            setInputValue('');
            setInputDisabled(true);
            setInputPlaceholder('Opal is working...');
            setStep(5);
          }, 500));
        }
      }, 35);
      intervals.push(interval);
    } else if (step === 5) {
      timers.push(setTimeout(() => setStep(6), 400));
    } else if (step === 6) {
      timers.push(setTimeout(() => setStep(7), 1800));
    }

    return () => {
      timers.forEach(clearTimeout);
      intervals.forEach(clearInterval);
    };
  }, [step]);

  useEffect(() => {
    if (claimPhase === 'typing') {
      const t = setTimeout(() => setClaimPhase('drafted'), 1200);
      return () => clearTimeout(t);
    }
  }, [claimPhase]);

  const dispatchVendor = () => {
    setClaimPhase('dispatching');
    setTimeout(() => setClaimPhase('dispatched'), 1000);
  };

  return (
    <div className="bg-gray-100 text-gray-800 h-screen flex flex-col overflow-hidden font-sans">

      {/* Top Navigation */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0 z-10 relative shadow-sm">
        <div className="flex items-center gap-4">
          <div className="text-[#007BC7] font-bold text-2xl tracking-tight italic">PROGRESSIVE</div>
          <span className="text-gray-400 font-light text-xl">|</span>
          <span className="text-gray-600 font-medium">Consultant Workspace</span>
        </div>
        <div className="flex items-center gap-4">
          {showToggleBtn && (
            <Link
              href="/demo/cms"
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

      {/* Main Content */}
      <main className="flex-1 flex overflow-hidden relative">

        <div className="flex w-full h-full">

          {/* Customer Context Sidebar */}
          <div className="w-1/3 bg-white border-r border-gray-200 p-6 flex flex-col">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-bold text-gray-800">Active Call</h2>
              <span className="bg-red-100 text-red-700 text-xs font-bold px-2 py-1 rounded animate-pulse">03:42</span>
            </div>

            <div className="bg-gray-100 rounded-lg p-4 mb-6">
              <div className="flex items-center gap-3 mb-2">
                <div className="w-10 h-10 rounded-full bg-gray-300 flex items-center justify-center text-gray-600 font-bold">JD</div>
                <div>
                  <h3 className="font-bold text-gray-900">John Doe</h3>
                  <p className="text-sm text-gray-500">Orlando, Florida</p>
                </div>
              </div>
              <div className="mt-4 space-y-2">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Products</span>
                  <span className="font-semibold text-gray-800">Home & Auto Bundle</span>
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
                <strong>Weather Event:</strong> Recent severe hail storms reported in customer&apos;s zip code. Likely filing a claim or inquiring about coverage.
              </div>
            </div>
          </div>

          {/* Opal Copilot Area */}
          <div className="w-2/3 bg-gray-50 flex flex-col">
            <div className="p-4 border-b border-gray-200 bg-white flex items-center gap-2 shadow-sm z-10">
              <LightningIcon className="w-5 h-5 text-purple-600" />
              <h2 className="font-bold text-gray-800">Opal Knowledge Assistant</h2>
            </div>

            {/* Chat Messages */}
            <div ref={chatRef} className="flex-1 overflow-y-auto p-6 space-y-6 pb-12">

              {/* Welcome message */}
              <div className="flex gap-4">
                <OpalAvatar />
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm max-w-2xl">
                  <p className="text-gray-700">Hi Sarah, I see you&apos;re speaking with John Doe in Florida. How can I assist you with his bundled policy today?</p>
                  {step === 0 && (
                    <div className="mt-4 space-y-2">
                      <button
                        onClick={() => setStep(1)}
                        className="w-full text-left bg-gray-50 hover:bg-[#007BC7] hover:text-white border border-gray-200 transition-colors p-3 rounded text-sm text-gray-700 flex justify-between items-center group shadow-sm"
                      >
                        <span>&ldquo;Does his auto or home policy cover hail damage to his car parked in the driveway, and what is the FL deductible?&rdquo;</span>
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
                    <p>Does his auto or home policy cover hail damage to his car parked in the driveway, and what is the FL deductible?</p>
                  </div>
                </div>
              )}

              {/* Typing indicator 1 */}
              {step === 2 && (
                <div className="flex gap-4 fade-in">
                  <OpalAvatar />
                  <TypingDots />
                </div>
              )}

              {/* Answer 1 */}
              {step >= 3 && (
                <div className="flex gap-4 fade-in">
                  <OpalAvatar />
                  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm max-w-2xl">
                    <h4 className="font-bold text-gray-900 mb-2">Coverage Found: Auto Policy</h4>
                    <p className="text-gray-700 text-sm mb-4">
                      Hail damage to an insured vehicle is covered under the <strong>Comprehensive portion of the auto policy</strong>, regardless of where the vehicle is parked (including home driveways). It is not covered by the Homeowners policy.
                    </p>
                    <h4 className="font-bold text-gray-900 mb-2 mt-4">Florida Deductible</h4>
                    <p className="text-gray-700 text-sm mb-4">
                      Because the customer is in Florida, the statutory deductible for hail damage on comprehensive claims is a <strong>$500 minimum</strong> unless a specific glass-only breakage occurs.
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">Sources</p>
                      <div className="flex gap-2">
                        <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded cursor-pointer hover:bg-gray-200 transition border border-gray-200">
                          <svg className="w-3 h-3 text-[#007BC7]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                          </svg>
                          Auto Comprehensive (FL Override)
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* User Q2 */}
              {step >= 5 && (
                <div className="flex gap-4 flex-row-reverse fade-in">
                  <div className="w-8 h-8 rounded-full bg-gray-800 text-white flex items-center justify-center shrink-0 text-sm font-bold">SO</div>
                  <div className="bg-[#007BC7] text-white rounded-lg p-4 shadow-sm max-w-2xl">
                    <p>What if the windshield was completely shattered?</p>
                  </div>
                </div>
              )}

              {/* Typing indicator 2 */}
              {step === 6 && (
                <div className="flex gap-4 fade-in">
                  <OpalAvatar />
                  <TypingDots />
                </div>
              )}

              {/* Answer 2 */}
              {step >= 7 && (
                <div className="flex gap-4 fade-in">
                  <OpalAvatar />
                  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm max-w-2xl border-l-4 border-l-[#007BC7]">
                    <h4 className="font-bold text-gray-900 mb-2">Florida Windshield Exception Applied</h4>
                    <p className="text-gray-700 text-sm mb-4">
                      Good catch. If the windshield was damaged by the hail, the customer does <strong>not</strong> pay the $500 deductible for the glass repair/replacement.
                    </p>
                    <p className="text-gray-700 text-sm mb-4">
                      Under <strong>Florida Statute 627.7288</strong>, deductibles do not apply to windshield damage for policies providing comprehensive coverage.
                    </p>
                    <div className="mt-4 pt-4 border-t border-gray-100">
                      <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-3">Suggested Next Action</p>
                      <button
                        onClick={() => claimPhase === 'idle' && setClaimPhase('typing')}
                        disabled={claimPhase !== 'idle'}
                        className={`bg-[#007BC7] text-white text-xs font-bold px-4 py-2 rounded hover:bg-[#004A8F] transition shadow-sm flex items-center gap-2 ${
                          claimPhase !== 'idle' ? 'opacity-50 cursor-default' : ''
                        }`}
                      >
                        {claimPhase !== 'idle' ? 'Initiating...' : 'Start Glass Claim Workflow'}
                        <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* Claim typing indicator */}
              {claimPhase === 'typing' && (
                <div className="flex gap-4 fade-in">
                  <OpalAvatar />
                  <TypingDots />
                </div>
              )}

              {/* Claim draft */}
              {(claimPhase === 'drafted' || claimPhase === 'dispatching' || claimPhase === 'dispatched') && (
                <div className="flex gap-4 fade-in">
                  <OpalAvatar />
                  <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm max-w-2xl w-full">
                    <div className="flex items-center justify-between mb-4">
                      <h4 className="font-bold text-gray-900 flex items-center gap-2">
                        <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        Claim Drafted Successfully
                      </h4>
                      <span className="bg-blue-100 text-blue-800 text-xs font-bold px-2 py-1 rounded">FNOL-84729</span>
                    </div>
                    <p className="text-sm text-gray-600 mb-4">
                      I&apos;ve extracted the customer&apos;s policy details and the zero-deductible override. Please confirm before dispatching to our glass network partner.
                    </p>
                    <div className="bg-gray-50 p-4 rounded border border-gray-200 mb-5 text-sm space-y-3">
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">Customer:</span>
                        <span className="font-medium text-gray-900">John Doe (Orlando, FL)</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">Policy:</span>
                        <span className="font-medium text-gray-900">Auto - Platinum Bundle</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">Incident type:</span>
                        <span className="font-medium text-gray-900">Comprehensive (Hail)</span>
                      </div>
                      <div className="flex justify-between border-b border-gray-200 pb-2">
                        <span className="text-gray-500">Damage:</span>
                        <span className="font-medium text-gray-900">Windshield Shattered</span>
                      </div>
                      <div className="flex justify-between pt-1">
                        <span className="text-gray-500 font-medium">Applied Deductible:</span>
                        <span className="font-bold text-green-600 bg-green-100 px-2 py-0.5 rounded">$0.00 (FL Stat 627.7288)</span>
                      </div>
                    </div>
                    <button
                      onClick={() => claimPhase === 'drafted' && dispatchVendor()}
                      disabled={claimPhase !== 'drafted'}
                      className={`w-full font-bold py-2.5 rounded transition flex items-center justify-center gap-2 ${
                        claimPhase === 'dispatched'
                          ? 'bg-green-50 text-green-800 border border-green-200 cursor-default'
                          : claimPhase === 'dispatching'
                          ? 'bg-green-600 text-white opacity-50 cursor-default'
                          : 'bg-green-600 hover:bg-green-700 text-white'
                      }`}
                    >
                      {claimPhase === 'dispatched' ? (
                        '✔ Safelite Dispatched - SMS sent to Customer'
                      ) : claimPhase === 'dispatching' ? (
                        'Dispatching Network Partner...'
                      ) : (
                        <>
                          Confirm & Dispatch Safelite
                          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 5l7 7-7 7M5 5l7 7-7 7" />
                          </svg>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              )}

            </div>

            {/* Chat Input */}
            <div className="p-4 bg-white border-t border-gray-200 shrink-0">
              <div className="relative">
                <input
                  type="text"
                  value={inputValue}
                  onChange={() => {}}
                  placeholder={inputPlaceholder}
                  readOnly
                  className={`w-full pl-4 pr-12 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#007BC7] focus:border-transparent transition-all ${
                    !inputDisabled
                      ? 'bg-white shadow-inner text-[#004A8F] font-medium'
                      : 'bg-gray-50'
                  }`}
                />
                <button disabled className="absolute right-3 top-3 text-gray-400 transition-colors">
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
