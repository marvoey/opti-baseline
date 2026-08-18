'use client';

import React, { useState } from 'react';
import { LayoutTemplate, ShieldCheck, Cpu, Smartphone, Monitor, ChevronRight } from 'lucide-react';

export default function ESLDemo() {
  const [activeTab, setActiveTab] = useState('visualBuilder');
  const [persona, setPersona] = useState('default');

  const [cmsContent, setCmsContent] = useState({
    heroLayout: 'split',
    heroHeadline: 'Turn your home equity into a flexible solution.',
    heroSubheadline: '3.95% Intro APR for 12 months with LTV up to 90% and no closing costs.',
    heroCta: 'Apply Today',
    showCards: true,
  });

  const handleContentChange = (key, value) => {
    setCmsContent(prev => ({ ...prev, [key]: value }));
  };

  const getPersonalizedContent = () => {
    if (persona === 'firstTimeHomebuyer') {
      return {
        ...cmsContent,
        heroHeadline: 'Ready to buy your first home? We are here to help.',
        heroSubheadline: 'Get expert guidance and competitive rates with an ESL Mortgage.',
        heroCta: 'Find a Mortgage Originator',
      };
    }
    return cmsContent;
  };

  const displayContent = getPersonalizedContent();

  return (
    <div className="flex h-screen w-full bg-blue-50 font-sans overflow-hidden">

      {/* LEFT PANEL: OPTIMIZELY CMS SAAS */}
      <div className="w-1/3 bg-white border-r border-blue-100 flex flex-col shadow-xl z-10 overflow-y-auto">

        <div className="bg-blue-800 text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutTemplate size={20} />
            <span className="font-semibold tracking-wide text-sm">OPTIMIZELY CMS SAAS</span>
          </div>
          <span className="text-xs bg-white/20 px-2 py-1 rounded">Visual Builder</span>
        </div>

        <div className="flex border-b border-blue-100 text-sm">
          <button
            className={`flex-1 py-3 font-medium ${activeTab === 'visualBuilder' ? 'border-b-2 border-blue-800 text-blue-800' : 'text-gray-500 hover:bg-blue-50'}`}
            onClick={() => setActiveTab('visualBuilder')}
          >
            Visual Composition
          </button>
          <button
            className={`flex-1 py-3 font-medium ${activeTab === 'personalization' ? 'border-b-2 border-blue-800 text-blue-800' : 'text-gray-500 hover:bg-blue-50'}`}
            onClick={() => setActiveTab('personalization')}
          >
            Audiences
          </button>
        </div>

        <div className="p-5 flex-1 flex flex-col gap-6">

          {activeTab === 'visualBuilder' && (
            <div className="space-y-6">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md flex gap-3 text-sm text-blue-900">
                <ShieldCheck className="shrink-0 text-blue-700" size={20} />
                <p><strong>Brand Governed:</strong> You are editing content. Next.js strictly enforces ESL&apos;s typography, colors, and responsive layouts.</p>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hero Block Component</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded text-sm bg-gray-50 focus:ring-1 focus:ring-blue-800"
                  value={cmsContent.heroLayout}
                  onChange={(e) => handleContentChange('heroLayout', e.target.value)}
                >
                  <option value="split">Split Content (Image Right)</option>
                  <option value="center">Centered Banner</option>
                </select>
              </div>

              <div className="space-y-4 pt-4 border-t border-blue-100">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hero Content (JSON Payload)</label>

                <div className="space-y-1">
                  <label className="text-xs text-gray-600">Headline</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:border-blue-800 focus:outline-none"
                    value={cmsContent.heroHeadline}
                    onChange={(e) => handleContentChange('heroHeadline', e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-600">Subheadline</label>
                  <textarea
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:border-blue-800 focus:outline-none h-20 resize-none"
                    value={cmsContent.heroSubheadline}
                    onChange={(e) => handleContentChange('heroSubheadline', e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-600">Call to Action Text</label>
                  <input
                    type="text"
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:border-blue-800 focus:outline-none"
                    value={cmsContent.heroCta}
                    onChange={(e) => handleContentChange('heroCta', e.target.value)}
                  />
                </div>

                <div className="flex items-center gap-2 pt-2">
                  <input
                    type="checkbox"
                    id="showCards"
                    checked={cmsContent.showCards}
                    onChange={(e) => handleContentChange('showCards', e.target.checked)}
                    className="rounded"
                  />
                  <label htmlFor="showCards" className="text-sm text-gray-700">Display Featured Products Grid</label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'personalization' && (
            <div className="space-y-6">
              <div className="p-3 bg-blue-50 border border-blue-200 rounded-md flex gap-3 text-sm text-blue-900">
                <Cpu className="shrink-0 text-blue-700" size={20} />
                <p><strong>Crawl Phase Personalization:</strong> Simulate how the Next.js app renders different JSON payloads based on the user&apos;s audience segment.</p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Simulate Audience Segment</label>

                <button
                  className={`w-full text-left p-3 rounded border flex items-center justify-between transition-all ${persona === 'default' ? 'border-blue-800 bg-blue-50 ring-1 ring-blue-800' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() => setPersona('default')}
                >
                  <div>
                    <div className="font-medium text-sm text-gray-900">Default (All Visitors)</div>
                    <div className="text-xs text-gray-500">Shows standard Home Equity promo.</div>
                  </div>
                  {persona === 'default' && <div className="h-2 w-2 rounded-full bg-blue-800"></div>}
                </button>

                <button
                  className={`w-full text-left p-3 rounded border flex items-center justify-between transition-all ${persona === 'firstTimeHomebuyer' ? 'border-blue-800 bg-blue-50 ring-1 ring-blue-800' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() => setPersona('firstTimeHomebuyer')}
                >
                  <div>
                    <div className="font-medium text-sm text-gray-900">First-Time Homebuyer</div>
                    <div className="text-xs text-gray-500">Overrides hero to show Mortgage resources.</div>
                  </div>
                  {persona === 'firstTimeHomebuyer' && <div className="h-2 w-2 rounded-full bg-blue-800"></div>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: NEXT.JS FRONTEND (ESL Site Preview) */}
      <div className="w-2/3 bg-blue-50 flex flex-col relative overflow-hidden">

        <div className="bg-blue-950 text-blue-200 p-2 flex items-center justify-between text-xs px-4 border-b border-blue-900">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-mono text-white"><Monitor size={14}/> localhost:3000 (Next.js)</span>
            <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-orange-400"/> Strict Brand System Enforced</span>
          </div>
          <div className="flex gap-2">
            <Smartphone size={14} className="cursor-pointer hover:text-white" />
            <Monitor size={14} className="cursor-pointer text-white" />
          </div>
        </div>

        <div className="flex-1 p-6 overflow-y-auto bg-blue-50/80">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden border border-blue-100 flex flex-col min-h-200 transform transition-all duration-300">

            {/* Simulated ESL Header */}
            <header className="bg-blue-900 py-3 px-6 flex justify-between items-center sticky top-0 z-20">
              <div className="flex items-center gap-2">
                <div className="w-10 h-10 bg-white rounded flex items-center justify-center font-bold text-xl text-blue-900">E</div>
                <div className="font-bold text-white text-base tracking-tight">ESL Federal Credit Union</div>
              </div>
              <nav className="hidden md:flex gap-5 text-sm font-semibold text-white/80">
                <span className="hover:text-white hover:border-b hover:border-orange-400 pb-0.5 cursor-pointer transition-colors">Personal</span>
                <span className="hover:text-white hover:border-b hover:border-orange-400 pb-0.5 cursor-pointer transition-colors">Business</span>
                <span className="hover:text-white hover:border-b hover:border-orange-400 pb-0.5 cursor-pointer transition-colors">Wealth</span>
                <span className="hover:text-white hover:border-b hover:border-orange-400 pb-0.5 cursor-pointer transition-colors">About Us</span>
              </nav>
              <button className="bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded text-sm font-semibold transition-colors">
                Sign In
              </button>
            </header>

            <main className="flex-1 bg-white">

              {/* Dynamic Hero */}
              <div className={`transition-all duration-500 ease-in-out ${displayContent.heroLayout === 'center' ? 'bg-blue-950 text-white py-24 text-center px-6' : 'flex flex-col md:flex-row items-center bg-blue-50'}`}>

                <div className={`p-10 md:p-16 ${displayContent.heroLayout === 'split' ? 'w-full md:w-1/2' : 'w-full max-w-3xl mx-auto'}`}>
                  <h1 className={`text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-4 ${displayContent.heroLayout === 'center' ? 'text-white' : 'text-blue-950'}`}>
                    {displayContent.heroHeadline}
                  </h1>
                  <p className={`text-lg md:text-xl mb-8 ${displayContent.heroLayout === 'center' ? 'text-blue-200' : 'text-gray-600'}`}>
                    {displayContent.heroSubheadline}
                  </p>
                  <button className={`inline-flex items-center gap-2 px-6 py-3 rounded font-bold text-sm transition-transform hover:scale-105 ${displayContent.heroLayout === 'center' ? 'bg-orange-500 hover:bg-orange-600 text-white' : 'bg-orange-500 hover:bg-orange-600 text-white'}`}>
                    {displayContent.heroCta}
                    <ChevronRight size={16} />
                  </button>
                </div>

                {displayContent.heroLayout === 'split' && (
                  <div className="w-full md:w-1/2 h-100 bg-blue-200 flex items-center justify-center text-blue-400 text-sm font-medium">
                    Hero Image (DAM Asset)
                  </div>
                )}
              </div>

              {displayContent.showCards && (
                <div className="py-16 px-6 md:px-12 bg-white">
                  <div className="mb-10">
                    <h2 className="text-2xl font-bold text-blue-950">Featured Solutions</h2>
                    <div className="w-12 h-1 bg-orange-500 mt-2"></div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="border border-blue-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                      <div className="w-12 h-12 bg-blue-50 text-blue-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-800 group-hover:text-white transition-colors">
                        💳
                      </div>
                      <h3 className="font-bold text-lg mb-2 text-gray-900">ESL Rewards Visa Signature®</h3>
                      <p className="text-gray-600 text-sm mb-4">Earn more on everyday purchases. No annual fee.</p>
                      <span className="text-blue-800 font-semibold text-sm flex items-center gap-1 group-hover:underline">Learn More <ChevronRight size={14}/></span>
                    </div>

                    <div className="border border-blue-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                      <div className="w-12 h-12 bg-blue-50 text-blue-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-800 group-hover:text-white transition-colors">
                        📈
                      </div>
                      <h3 className="font-bold text-lg mb-2 text-gray-900">ESL Personal Loans</h3>
                      <p className="text-gray-600 text-sm mb-4">Streamline your finances, consolidate debt, and simplify monthly payments.</p>
                      <span className="text-blue-800 font-semibold text-sm flex items-center gap-1 group-hover:underline">View Rates <ChevronRight size={14}/></span>
                    </div>

                    <div className="border border-blue-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                      <div className="w-12 h-12 bg-blue-50 text-blue-800 rounded-full flex items-center justify-center mb-4 group-hover:bg-blue-800 group-hover:text-white transition-colors">
                        🏛️
                      </div>
                      <h3 className="font-bold text-lg mb-2 text-gray-900">Free Checking</h3>
                      <p className="text-gray-600 text-sm mb-4">No minimum balance requirement and no monthly maintenance fee.</p>
                      <span className="text-blue-800 font-semibold text-sm flex items-center gap-1 group-hover:underline">Open Account <ChevronRight size={14}/></span>
                    </div>
                  </div>
                </div>
              )}

            </main>
          </div>
        </div>
      </div>
    </div>
  );
}
