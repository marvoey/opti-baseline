import React, { useState } from 'react';

export default function IndustryHeroWireframes() {
  const [activeIndustry, setActiveIndustry] = useState('banking');

  const industries = [
    { id: 'banking', group: 'Financial Services', name: 'Retail Banking', prompt: 'What are your financial goals today?', placeholder: 'e.g., Open a checking account, Get a mortgage...', pills: ['Open an account', 'Check current rates', 'Find an ATM'] },
    { id: 'insurance', group: 'Financial Services', name: 'Insurance', prompt: 'What do you need to protect?', placeholder: 'e.g., Auto, Home, Life...', pills: ['Get a quote', 'File a claim', 'Manage my policy'] },
    { id: 'asset', group: 'Financial Services', name: 'Asset Mgmt', prompt: 'How can we help grow your wealth?', placeholder: 'e.g., Retirement planning, College fund...', pills: ['Explore our funds', 'Talk to an advisor', 'Market insights'] },
    { id: 'healthcare', group: 'Healthcare', name: 'Healthcare', prompt: 'How can we help you get care today?', placeholder: 'Search for doctors, locations, or symptoms...', pills: ['Book an appointment', 'Patient Portal', 'Find Urgent Care'] },
    { id: 'software', group: 'Software', name: 'Software (SaaS)', prompt: 'What problem are you trying to solve?', placeholder: 'e.g., Team collaboration, Sales tracking...', pills: ['Start free trial', 'Request a demo', 'View pricing'] },
    { id: 'retail', group: 'Retail', name: 'Retail', prompt: 'What are you looking for today?', placeholder: 'Search for products, brands, or categories...', pills: ['Shop the sale', 'Track my order', 'Find a store'] },
    { id: 'airlines', group: 'Airlines', name: 'Airlines', prompt: 'Where would you like to go?', placeholder: 'Enter destination or flight number...', pills: ['Book a flight', 'Check-in online', 'Flight status'] },
    { id: 'media', group: 'Media', name: 'Media', prompt: 'What do you want to read or watch?', placeholder: 'Search topics, shows, or articles...', pills: ['Latest breaking news', 'Watch live', 'Subscribe'] },
    { id: 'mnd', group: 'M&D', name: 'Manufacturing', prompt: 'What parts or materials do you need?', placeholder: 'Search by SKU, product name, or category...', pills: ['Request a quote', 'Track shipment', 'Supplier portal'] },
    { id: 'prof_services', group: 'Professional Services', name: 'Prof. Services', prompt: 'What expertise does your business need?', placeholder: 'e.g., Tax audit, Legal consulting, M&A...', pills: ['Schedule consultation', 'View case studies', 'Our services'] }
  ];

  const currentData = industries.find(i => i.id === activeIndustry);

  return (
    <div className="flex flex-col h-screen bg-[#EFF6E9] font-sans text-[#08251A]">
      {/* App Header */}
      <div className="bg-[#FFFFFF] p-4 border-b-2 border-[#D8E4CB] shadow-sm z-10 flex flex-col sm:flex-row justify-between items-center space-y-4 sm:space-y-0">
        <h1 className="text-xl font-bold text-[#08251A] tracking-tight">Industry Intent Wireframes</h1>
        
        {/* Navigation / Selectors */}
        <div className="flex space-x-2 overflow-x-auto max-w-full pb-2 sm:pb-0">
          <select 
            className="p-3 px-5 border-4 border-[#08251A] rounded-[32px] bg-[#FFFFFF] text-[#08251A] font-bold shadow-[4px_4px_0px_#08251A] focus:outline-none focus:ring-4 focus:ring-[#ABFF44] appearance-none cursor-pointer transition-all hover:translate-y-[2px] hover:shadow-[2px_2px_0px_#08251A]"
            value={activeIndustry}
            onChange={(e) => setActiveIndustry(e.target.value)}
          >
            {industries.map(ind => (
              <option key={ind.id} value={ind.id} className="font-bold">
                {ind.group !== ind.name ? `${ind.group} - ${ind.name}` : ind.name}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Main Preview Area */}
      <div className="flex-1 overflow-auto p-4 md:p-8 flex justify-center items-start">
        <div className="w-full max-w-5xl bg-[#FFFFFF] shadow-[16px_16px_0px_#08251A] rounded-[32px] overflow-hidden flex flex-col transition-all duration-300 border-4 border-[#08251A]">
          
          {/* Wireframe Header */}
          <div className="flex justify-between items-center p-6 border-b-4 border-[#08251A]">
            <div className="flex items-center space-x-3">
              <div className="font-black text-3xl tracking-tighter text-[#08251A]">BrandLogo.</div>
            </div>
            <div className="flex space-x-8 items-center">
              <div className="hidden md:flex space-x-6 font-bold text-[#08251A] text-lg">
                 <div className="hover:text-[#3AB533] cursor-pointer">Products</div>
                 <div className="hover:text-[#3AB533] cursor-pointer">Solutions</div>
              </div>
              <div className="w-14 h-14 bg-[#E4F0DA] rounded-[32px] hover:bg-[#ABFF44] flex flex-col justify-center items-center space-y-1.5 cursor-pointer border-4 border-[#08251A] transition-colors">
                 <div className="w-6 h-1 bg-[#08251A] rounded-full"></div>
                 <div className="w-6 h-1 bg-[#08251A] rounded-full"></div>
                 <div className="w-6 h-1 bg-[#08251A] rounded-full"></div>
              </div>
            </div>
          </div>

          {/* Wireframe Hero Section */}
          <div className="relative px-6 py-28 md:py-40 flex flex-col items-center justify-center border-b-4 border-[#08251A] overflow-hidden bg-[#08251A]">
            {/* Background Abstract Shapes to simulate brand imagery */}
            <div className="absolute -top-24 -right-24 w-96 h-96 bg-[#ABFF44] rounded-full mix-blend-screen filter blur-[100px] opacity-30 z-0"></div>
            <div className="absolute -bottom-24 -left-24 w-72 h-72 bg-[#91DBDA] rounded-full mix-blend-screen filter blur-[100px] opacity-30 z-0"></div>

            <div className="relative z-10 w-full flex flex-col items-center">
              {/* Dynamic Headline (Expressive Type Emulation) */}
              <h2 className="text-5xl md:text-7xl font-black text-[#ABFF44] mb-12 text-center max-w-3xl tracking-tighter leading-[1.1]">
                {currentData.prompt}
              </h2>
              
              {/* Massive Intent Search Bar */}
              <div className="w-full max-w-3xl flex items-center bg-[#FFFFFF] border-4 border-[#08251A] focus-within:border-[#3AB533] transition-all rounded-[32px] shadow-[8px_8px_0px_#08251A] overflow-hidden mb-12 p-2">
                 <div className="pl-6 pr-3 py-4">
                    {/* Search Icon (Rounded Weight 300 emulation) */}
                    <svg className="w-8 h-8 text-[#08251A]" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth="2.5"><path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" /></svg>
                 </div>
                 <input 
                   type="text" 
                   disabled
                   placeholder={currentData.placeholder}
                   className="flex-1 h-16 bg-transparent text-xl font-medium outline-none text-[#08251A] placeholder-[#197050] opacity-80"
                 />
                 <button className="h-16 px-10 bg-[#ABFF44] hover:bg-[#7DDD3D] text-[#08251A] font-black text-xl transition-all border-4 border-[#08251A] cursor-pointer flex items-center justify-center rounded-[24px]">
                    Go
                 </button>
              </div>

              {/* Action Pills */}
              <div className="flex flex-col items-center">
                 <span className="text-sm text-[#E4F0DA] font-black uppercase tracking-widest mb-5">Quick Actions</span>
                 <div className="flex flex-wrap justify-center gap-4 max-w-4xl">
                    {currentData.pills.map((pill, idx) => (
                       <button key={idx} className="px-6 py-4 bg-[#08251A] border-4 border-[#ABFF44] hover:bg-[#ABFF44] hover:text-[#08251A] text-[#ABFF44] rounded-[32px] text-lg font-bold transition-colors flex items-center space-x-2">
                          <span>{pill}</span>
                          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" /></svg>
                       </button>
                    ))}
                 </div>
              </div>
            </div>
          </div>

          {/* Below-the-fold wireframe context */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 p-10 bg-[#E4F0DA]">
             {[1, 2, 3].map((item) => (
                <div key={item} className="flex flex-col space-y-5">
                   {/* Card placeholder */}
                   <div className="w-full aspect-video bg-[#FFFFFF] rounded-[32px] border-4 border-[#08251A] shadow-[8px_8px_0px_#08251A]"></div>
                   
                   {/* Text blocks */}
                   <div className="flex flex-col space-y-3 pt-2">
                      <div className="w-3/4 h-8 bg-[#08251A] rounded-full"></div>
                      <div className="w-full h-4 bg-[#197050] rounded-full opacity-40"></div>
                      <div className="w-5/6 h-4 bg-[#197050] rounded-full opacity-40"></div>
                   </div>
                </div>
             ))}
          </div>

        </div>
      </div>
    </div>
  );
}