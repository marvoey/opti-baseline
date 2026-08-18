import React, { useState } from 'react';
import { Settings, LayoutTemplate, ShieldCheck, Cpu, Smartphone, Monitor, ChevronRight } from 'lucide-react';

export default function ESLDemo() {
  const [activeTab, setActiveTab] = useState('visualBuilder');
  const [persona, setPersona] = useState('default');
  
  // CMS State (What the Marketer controls)
  const [cmsContent, setCmsContent] = useState({
    heroLayout: 'split', // split, center
    heroHeadline: 'Turn your home equity into a flexible solution.',
    heroSubheadline: '3.95% Intro APR for 12 months with LTV up to 90% and no closing costs.',
    heroCta: 'Apply Today',
    showCards: true,
  });

  // Handle CMS content changes
  const handleContentChange = (key, value) => {
    setCmsContent(prev => ({ ...prev, [key]: value }));
  };

  // Simulate personalization rules (Crawl Phase)
  const getPersonalizedContent = () => {
    if (persona === 'firstTimeHomebuyer') {
      return {
        ...cmsContent,
        heroHeadline: 'Ready to buy your first home? We are here to help.',
        heroSubheadline: 'Get expert guidance and competitive rates with an ESL Mortgage.',
        heroCta: 'Find a Mortgage Originator'
      };
    }
    return cmsContent;
  };

  const displayContent = getPersonalizedContent();

  return (
    <div className="flex h-screen w-full bg-gray-100 font-sans overflow-hidden">
      
      {/* LEFT PANEL: OPTIMIZELY CMS SAAS (Marketer View) */}
      <div className="w-1/3 bg-white border-r border-gray-200 flex flex-col shadow-xl z-10 overflow-y-auto">
        
        {/* Optimizely Header */}
        <div className="bg-[#0037FF] text-white p-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <LayoutTemplate size={20} />
            <span className="font-semibold tracking-wide text-sm">OPTIMIZELY CMS SAAS</span>
          </div>
          <span className="text-xs bg-white/20 px-2 py-1 rounded">Visual Builder</span>
        </div>

        {/* CMS Tabs */}
        <div className="flex border-b border-gray-200 text-sm">
          <button 
            className={`flex-1 py-3 font-medium ${activeTab === 'visualBuilder' ? 'border-b-2 border-[#0037FF] text-[#0037FF]' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('visualBuilder')}
          >
            Visual Composition
          </button>
          <button 
            className={`flex-1 py-3 font-medium ${activeTab === 'personalization' ? 'border-b-2 border-[#0037FF] text-[#0037FF]' : 'text-gray-500 hover:bg-gray-50'}`}
            onClick={() => setActiveTab('personalization')}
          >
            Audiences
          </button>
        </div>

        {/* CMS Controls */}
        <div className="p-5 flex-1 flex flex-col gap-6">
          
          {activeTab === 'visualBuilder' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-3 bg-blue-50 border border-blue-100 rounded-md flex gap-3 text-sm text-blue-800">
                <ShieldCheck className="shrink-0 text-blue-600" size={20} />
                <p><strong>Brand Governed:</strong> You are editing content. Next.js strictly enforces ESL's typography, colors, and responsive layouts.</p>
              </div>

              {/* Layout Control */}
              <div className="space-y-2">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hero Block Component</label>
                <select 
                  className="w-full p-2 border border-gray-300 rounded text-sm bg-gray-50 focus:ring-1 focus:ring-[#0037FF]"
                  value={cmsContent.heroLayout}
                  onChange={(e) => handleContentChange('heroLayout', e.target.value)}
                >
                  <option value="split">Split Content (Image Right)</option>
                  <option value="center">Centered Banner</option>
                </select>
              </div>

              {/* Content Controls */}
              <div className="space-y-4 pt-4 border-t border-gray-100">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Hero Content (JSON Payload)</label>
                
                <div className="space-y-1">
                  <label className="text-xs text-gray-600">Headline</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:border-[#0037FF] focus:outline-none"
                    value={cmsContent.heroHeadline}
                    onChange={(e) => handleContentChange('heroHeadline', e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-600">Subheadline</label>
                  <textarea 
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:border-[#0037FF] focus:outline-none h-20 resize-none"
                    value={cmsContent.heroSubheadline}
                    onChange={(e) => handleContentChange('heroSubheadline', e.target.value)}
                  />
                </div>

                <div className="space-y-1">
                  <label className="text-xs text-gray-600">Call to Action Text</label>
                  <input 
                    type="text" 
                    className="w-full p-2 border border-gray-300 rounded text-sm focus:border-[#0037FF] focus:outline-none"
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
                    className="rounded text-[#0037FF] focus:ring-[#0037FF]"
                  />
                  <label htmlFor="showCards" className="text-sm text-gray-700">Display Featured Products Grid</label>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'personalization' && (
            <div className="space-y-6 animate-in fade-in">
              <div className="p-3 bg-indigo-50 border border-indigo-100 rounded-md flex gap-3 text-sm text-indigo-800">
                <Cpu className="shrink-0 text-indigo-600" size={20} />
                <p><strong>Crawl Phase Personalization:</strong> Simulate how the Next.js app renders different JSON payloads based on the user's audience segment.</p>
              </div>

              <div className="space-y-3">
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-wider">Simulate Audience Segment</label>
                
                <button 
                  className={`w-full text-left p-3 rounded border flex items-center justify-between transition-all ${persona === 'default' ? 'border-[#0037FF] bg-blue-50 ring-1 ring-[#0037FF]' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() => setPersona('default')}
                >
                  <div>
                    <div className="font-medium text-sm text-gray-900">Default (All Visitors)</div>
                    <div className="text-xs text-gray-500">Shows standard Home Equity promo.</div>
                  </div>
                  {persona === 'default' && <div className="h-2 w-2 rounded-full bg-[#0037FF]"></div>}
                </button>

                <button 
                  className={`w-full text-left p-3 rounded border flex items-center justify-between transition-all ${persona === 'firstTimeHomebuyer' ? 'border-[#0037FF] bg-blue-50 ring-1 ring-[#0037FF]' : 'border-gray-200 hover:border-gray-300'}`}
                  onClick={() => setPersona('firstTimeHomebuyer')}
                >
                  <div>
                    <div className="font-medium text-sm text-gray-900">First-Time Homebuyer</div>
                    <div className="text-xs text-gray-500">Overrides hero to show Mortgage resources.</div>
                  </div>
                  {persona === 'firstTimeHomebuyer' && <div className="h-2 w-2 rounded-full bg-[#0037FF]"></div>}
                </button>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* RIGHT PANEL: NEXT.JS FRONTEND (Developer/Governance View) */}
      <div className="w-2/3 bg-gray-200 flex flex-col relative overflow-hidden">
        
        {/* Next.js Developer Header */}
        <div className="bg-slate-900 text-slate-300 p-2 flex items-center justify-between text-xs px-4 border-b border-slate-800">
          <div className="flex items-center gap-4">
            <span className="flex items-center gap-1 font-mono text-white"><Monitor size={14}/> localhost:3000 (Next.js)</span>
            <span className="flex items-center gap-1"><ShieldCheck size={14} className="text-green-400"/> Strict Brand System Enforced</span>
          </div>
          <div className="flex gap-2">
             <Smartphone size={14} className="cursor-pointer hover:text-white" />
             <Monitor size={14} className="cursor-pointer text-white" />
          </div>
        </div>

        {/* Browser Window Wrapper */}
        <div className="flex-1 p-6 overflow-y-auto bg-gray-200/80">
          <div className="max-w-4xl mx-auto bg-white rounded-lg shadow-2xl overflow-hidden border border-gray-100 flex flex-col min-h-[800px] transform transition-all duration-300">
            
            {/* ESL Simulated Header */}
            <header className="bg-white border-b border-gray-100 py-4 px-6 flex justify-between items-center sticky top-0 z-20">
              <div className="flex items-center gap-2">
                {/* Simulated Logo */}
                <div className="w-10 h-10 bg-[#005596] rounded flex items-center justify-center text-white font-bold text-xl">E</div>
                <div className="font-bold text-[#005596] text-xl tracking-tight">ESL Federal Credit Union</div>
              </div>
              <nav className="hidden md:flex gap-6 text-sm font-semibold text-gray-600">
                <span className="hover:text-[#005596] cursor-pointer">Personal</span>
                <span className="hover:text-[#005596] cursor-pointer">Business</span>
                <span className="hover:text-[#005596] cursor-pointer">Wealth</span>
                <span className="hover:text-[#005596] cursor-pointer">About Us</span>
              </nav>
              <button className="bg-[#005596] text-white px-5 py-2 rounded-full text-sm font-semibold hover:bg-[#004275] transition-colors">
                Sign In
              </button>
            </header>

            {/* Simulated Next.js Page Render */}
            <main className="flex-1 bg-white">
              
              {/* Dynamic Hero Component */}
              <div className={`transition-all duration-500 ease-in-out ${displayContent.heroLayout === 'center' ? 'bg-[#005596] text-white py-24 text-center px-6' : 'flex flex-col md:flex-row items-center bg-slate-50'}`}>
                
                <div className={`p-10 md:p-16 ${displayContent.heroLayout === 'split' ? 'w-full md:w-1/2' : 'w-full max-w-3xl mx-auto'}`}>
                  <h1 className={`text-4xl md:text-5xl font-extrabold leading-tight tracking-tight mb-4 ${displayContent.heroLayout === 'center' ? 'text-white' : 'text-[#005596]'}`}>
                    {displayContent.heroHeadline}
                  </h1>
                  <p className={`text-lg md:text-xl mb-8 ${displayContent.heroLayout === 'center' ? 'text-blue-100' : 'text-gray-600'}`}>
                    {displayContent.heroSubheadline}
                  </p>
                  <button className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-sm transition-transform hover:scale-105 ${displayContent.heroLayout === 'center' ? 'bg-white text-[#005596]' : 'bg-[#e21b22] text-white'}`}>
                    {displayContent.heroCta}
                    <ChevronRight size={16} />
                  </button>
                </div>

                {displayContent.heroLayout === 'split' && (
                  <div className="w-full md:w-1/2 h-[400px] bg-cover bg-center bg-gray-300" style={{backgroundImage: `url('https://images.unsplash.com/photo-1560518883-ce09059eeffa?ixlib=rb-4.0.3&auto=format&fit=crop&w=1000&q=80')`}}>
                    {/* Placeholder image from Unsplash to simulate DAM asset */}
                  </div>
                )}
              </div>

              {/* Dynamic Feature Grid (Can be toggled by CMS) */}
              {displayContent.showCards && (
                <div className="py-16 px-6 md:px-12 bg-white">
                  <div className="mb-10">
                    <h2 className="text-2xl font-bold text-[#005596]">Featured Solutions</h2>
                    <div className="w-12 h-1 bg-[#e21b22] mt-2"></div>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Card 1 */}
                    <div className="border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                      <div className="w-12 h-12 bg-blue-50 text-[#005596] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#005596] group-hover:text-white transition-colors">
                        💳
                      </div>
                      <h3 className="font-bold text-lg mb-2 text-gray-900">ESL Rewards Visa Signature®</h3>
                      <p className="text-gray-600 text-sm mb-4">Earn more on everyday purchases. No annual fee.</p>
                      <span className="text-[#005596] font-semibold text-sm flex items-center gap-1 group-hover:underline">Learn More <ChevronRight size={14}/></span>
                    </div>

                    {/* Card 2 */}
                    <div className="border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                      <div className="w-12 h-12 bg-blue-50 text-[#005596] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#005596] group-hover:text-white transition-colors">
                        📈
                      </div>
                      <h3 className="font-bold text-lg mb-2 text-gray-900">ESL Personal Loans</h3>
                      <p className="text-gray-600 text-sm mb-4">Streamline your finances, consolidate debt, and simplify monthly payments.</p>
                      <span className="text-[#005596] font-semibold text-sm flex items-center gap-1 group-hover:underline">View Rates <ChevronRight size={14}/></span>
                    </div>

                    {/* Card 3 */}
                    <div className="border border-gray-100 rounded-xl p-6 shadow-sm hover:shadow-md transition-shadow group">
                      <div className="w-12 h-12 bg-blue-50 text-[#005596] rounded-full flex items-center justify-center mb-4 group-hover:bg-[#005596] group-hover:text-white transition-colors">
                        🏛️
                      </div>
                      <h3 className="font-bold text-lg mb-2 text-gray-900">Free Checking</h3>
                      <p className="text-gray-600 text-sm mb-4">No minimum balance requirement and no monthly maintenance fee.</p>
                      <span className="text-[#005596] font-semibold text-sm flex items-center gap-1 group-hover:underline">Open Account <ChevronRight size={14}/></span>
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