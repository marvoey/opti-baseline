'use client';

import { useState } from 'react';
import Link from 'next/link';

type Target = 'meta-lob' | 'core-def' | 'deductible' | 'exceptions' | null;

function MapItem({
  target,
  hovered,
  onEnter,
  onLeave,
  className,
  children,
}: {
  target: Target;
  hovered: Target;
  onEnter: (t: Target) => void;
  onLeave: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  const isActive = target !== null && target === hovered;
  return (
    <span
      className={`transition-all duration-200 ease-in-out cursor-pointer ${isActive ? 'highlight-active' : ''} ${className ?? ''}`}
      onMouseEnter={() => onEnter(target)}
      onMouseLeave={onLeave}
    >
      {children}
    </span>
  );
}

function MapBlock({
  target,
  hovered,
  onEnter,
  onLeave,
  className,
  children,
}: {
  target: Target;
  hovered: Target;
  onEnter: (t: Target) => void;
  onLeave: () => void;
  className?: string;
  children: React.ReactNode;
}) {
  const isActive = target !== null && target === hovered;
  return (
    <div
      className={`transition-all duration-200 ease-in-out cursor-pointer border border-gray-200 ${isActive ? 'highlight-active' : ''} ${className ?? ''}`}
      onMouseEnter={() => onEnter(target)}
      onMouseLeave={onLeave}
    >
      {children}
    </div>
  );
}

export default function ContentModelVisualizerPage() {
  const [hovered, setHovered] = useState<Target>(null);

  return (
    <div className="bg-gray-100 text-gray-800 h-screen flex flex-col font-sans overflow-hidden">

      {/* Header */}
      <header className="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 shrink-0 shadow-sm z-10">
        <div className="flex items-center gap-4">
          <div className="text-[#007BC7] font-bold text-xl tracking-tight">ARCHITECTURE VISUALIZER</div>
          <span className="text-gray-400 font-light text-xl">|</span>
          <span className="text-gray-600 font-medium">How the Chat Maps to the Content Model</span>
        </div>
        <div className="flex items-center gap-4">
          <div className="text-sm font-medium text-gray-500 bg-gray-100 px-4 py-1.5 rounded-full border border-gray-200">
            Hover over elements to see the connection
          </div>
          <Link
            href="/demo"
            className="bg-[#007BC7] hover:bg-[#004A8F] text-white text-sm font-semibold py-2 px-4 rounded transition shadow"
          >
            Back to Contact Center
          </Link>
        </div>
      </header>

      {/* Main Workspace */}
      <main className="flex-1 flex overflow-hidden p-6 gap-6 max-w-7xl mx-auto w-full">

        {/* LEFT COLUMN: The Face (Frontend) */}
        <div className="w-1/2 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-50 px-6 py-4 border-b border-gray-200 shrink-0">
            <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
              </svg>
              The Face: Opal Consultant UI
            </h2>
            <p className="text-sm text-gray-500 mt-1">What the Progressive Consultant sees and interacts with.</p>
          </div>

          <div className="p-6 flex-1 overflow-y-auto bg-gray-50">
            <div className="bg-white border border-gray-200 rounded-lg p-5 shadow-sm">
              <div className="flex items-center gap-2 mb-4 border-b border-gray-100 pb-2">
                <div className="w-6 h-6 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
                  <svg className="w-3 h-3 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                  </svg>
                </div>
                <span className="font-bold text-sm text-gray-800">Opal Knowledge Assistant</span>
              </div>

              <div className="space-y-4 text-sm text-gray-700 leading-relaxed">
                <p>
                  <MapItem target="meta-lob" hovered={hovered} onEnter={setHovered} onLeave={() => setHovered(null)} className="px-1 py-0.5 border border-transparent">
                    Coverage Found: Auto Policy.
                  </MapItem>
                </p>
                <p>
                  <MapItem target="core-def" hovered={hovered} onEnter={setHovered} onLeave={() => setHovered(null)} className="px-1 py-0.5 border border-transparent">
                    Hail damage to an insured vehicle is covered under the Comprehensive portion of the auto policy, regardless of where the vehicle is parked (including home driveways).
                  </MapItem>
                  {' '}It is not covered by the Homeowners policy.
                </p>
                <p>
                  <MapItem target="deductible" hovered={hovered} onEnter={setHovered} onLeave={() => setHovered(null)} className="px-1 py-0.5 border border-transparent">
                    Because the customer is in Florida, the statutory deductible for hail damage on comprehensive claims is a $500 minimum.
                  </MapItem>
                </p>
                <p>
                  <MapItem target="exceptions" hovered={hovered} onEnter={setHovered} onLeave={() => setHovered(null)} className="px-1 py-0.5 border border-transparent">
                    However, under Florida Statute 627.7288, deductibles do not apply to windshield damage. If the windshield was shattered, the customer does not pay the $500 deductible for glass repair.
                  </MapItem>
                </p>
              </div>

              {/* CRM Context Note */}
              <div className="mt-6 p-3 bg-blue-50 border border-blue-100 rounded text-xs text-[#004A8F] flex gap-2 items-start">
                <svg className="w-4 h-4 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <div>
                  <strong className="block mb-1">CRM Context Integration (Not in CMS)</strong>
                  Opal knows to apply the Florida rules because it read &ldquo;State: FL&rdquo; directly from the customer&apos;s CRM profile on the active call.
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: The Brain (Backend) */}
        <div className="w-1/2 flex flex-col bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
          <div className="bg-gray-900 px-6 py-4 border-b border-gray-800 shrink-0">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 7v10c0 2.21 3.582 4 8 4s8-1.79 8-4V7M4 7c0 2.21 3.582 4 8 4s8-1.79 8-4M4 7c0-2.21 3.582-4 8-4s8 1.79 8 4m0 5c0 2.21-3.582 4-8 4s-8-1.79-8-4" />
              </svg>
              The Brain: CMS SaaS Content Model
            </h2>
            <p className="text-sm text-gray-400 mt-1">Structured &ldquo;Coverage Component&rdquo; managing the ground truth.</p>
          </div>

          <div className="p-6 flex-1 overflow-y-auto space-y-4">

            {/* Metadata */}
            <MapBlock target="meta-lob" hovered={hovered} onEnter={setHovered} onLeave={() => setHovered(null)} className="bg-white p-3 rounded-lg flex flex-col">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-2">Category / Taxonomy Fields</div>
              <div className="flex gap-2">
                <span className="bg-gray-100 border border-gray-200 text-gray-700 text-xs px-2 py-1 rounded">Line of Business: Auto</span>
                <span className="bg-gray-100 border border-gray-200 text-gray-700 text-xs px-2 py-1 rounded">Peril: Hail</span>
                <span className="bg-blue-50 border border-blue-200 text-[#004A8F] font-medium text-xs px-2 py-1 rounded">Variation: Florida</span>
              </div>
            </MapBlock>

            {/* Core Definition */}
            <MapBlock target="core-def" hovered={hovered} onEnter={setHovered} onLeave={() => setHovered(null)} className="bg-white p-3 rounded-lg">
              <div className="flex justify-between items-center mb-1">
                <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Rich Text Field: Core Definition</div>
                <div className="text-[10px] bg-gray-100 text-gray-500 px-1.5 py-0.5 rounded">Inherited from Master</div>
              </div>
              <p className="text-sm text-gray-800 bg-gray-50 p-2 border border-gray-100 rounded">
                Hail damage to an insured vehicle is covered under the Comprehensive portion of the auto policy, regardless of where the vehicle is parked (including home driveways).
              </p>
            </MapBlock>

            {/* Deductible Rules */}
            <MapBlock target="deductible" hovered={hovered} onEnter={setHovered} onLeave={() => setHovered(null)} className="bg-white p-3 rounded-lg relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#007BC7]" />
              <div className="flex justify-between items-center mb-1 pl-2">
                <div className="text-xs font-bold text-[#007BC7] uppercase tracking-wider">Rich Text Field: Deductible Rules</div>
                <div className="text-[10px] bg-blue-100 text-[#007BC7] font-bold px-1.5 py-0.5 rounded">Florida Override</div>
              </div>
              <p className="text-sm text-gray-800 bg-blue-50/50 p-2 border border-blue-100 rounded ml-2">
                Deductibles for hail claims on comprehensive coverage are fixed at a $500 minimum.
              </p>
            </MapBlock>

            {/* Exceptions */}
            <MapBlock target="exceptions" hovered={hovered} onEnter={setHovered} onLeave={() => setHovered(null)} className="bg-white p-3 rounded-lg relative overflow-hidden">
              <div className="absolute left-0 top-0 bottom-0 w-1 bg-[#007BC7]" />
              <div className="flex justify-between items-center mb-1 pl-2">
                <div className="text-xs font-bold text-[#007BC7] uppercase tracking-wider">Rich Text Field: Exceptions & Caveats</div>
                <div className="text-[10px] bg-blue-100 text-[#007BC7] font-bold px-1.5 py-0.5 rounded">Florida Override</div>
              </div>
              <p className="text-sm text-gray-800 bg-blue-50/50 p-2 border border-blue-100 rounded ml-2">
                Florida Statute 627.7288: Deductibles do not apply to windshield damage.
              </p>
            </MapBlock>

            {/* Active Date (non-interactive) */}
            <div className="border border-gray-200 bg-white p-3 rounded-lg flex items-center justify-between opacity-75">
              <div className="text-xs font-bold text-gray-400 uppercase tracking-wider">Settings: Active Date</div>
              <div className="text-sm font-mono text-gray-600">2026-07-01 00:00:00</div>
            </div>

          </div>
        </div>

      </main>
    </div>
  );
}
