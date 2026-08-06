'use client';

import React, { useState } from 'react';
import { Search, MessageSquare, LayoutGrid, UserCircle, Command, ArrowRight, Award, Calendar, BookOpen, Briefcase, ChevronRight, Send, Terminal } from 'lucide-react';

export default function SFAHomepages() {
    const [activeDemo, setActiveDemo] = useState('search');

    const demos = [
        { id: 'search', name: 'Search-First', icon: <Search className="w-4 h-4" /> },
        { id: 'chat', name: 'Conversational', icon: <MessageSquare className="w-4 h-4" /> },
        { id: 'intent', name: 'Intent Bento', icon: <LayoutGrid className="w-4 h-4" /> },
        { id: 'role', name: 'Role-Based', icon: <UserCircle className="w-4 h-4" /> },
        { id: 'cmd', name: 'Command Palette', icon: <Command className="w-4 h-4" /> }
    ];

    return (
        <div className="flex h-screen bg-gray-50 font-sans">
            {/* Sidebar */}
            <div className="w-64 bg-white border-r border-gray-200 p-4 flex flex-col gap-2 shadow-sm z-10">
                <div className="text-xl font-bold text-gray-800 mb-6 px-2">SFA Prototypes</div>
                {demos.map(demo => (
                    <button
                        key={demo.id}
                        onClick={() => setActiveDemo(demo.id)}
                        className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors ${activeDemo === demo.id ? 'bg-blue-600 text-white shadow-md' : 'text-gray-600 hover:bg-gray-100'}`}
                    >
                        {demo.icon}
                        {demo.name}
                    </button>
                ))}
            </div>
            {/* Main Content */}
            <div className="flex-1 overflow-hidden flex items-center justify-center bg-gray-100 p-8">
                <div className="w-full max-w-5xl h-full bg-white rounded-2xl shadow-xl overflow-hidden border border-gray-200 relative">
                    {activeDemo === 'search' && <SearchFirst />}
                    {activeDemo === 'chat' && <Conversational />}
                    {activeDemo === 'intent' && <IntentBento />}
                    {activeDemo === 'role' && <RoleBased />}
                    {activeDemo === 'cmd' && <CommandPalette />}
                </div>
            </div>
        </div>
    )
}

// 1. Search First
function SearchFirst() {
    return (
        <div className="flex flex-col items-center justify-center h-full p-12 bg-white">
            <div className="text-center max-w-2xl w-full">
                <h1 className="text-5xl font-extrabold text-gray-900 mb-4 tracking-tight">Specialty Food Association</h1>
                <p className="text-xl text-gray-500 mb-12">Support, connect, and champion. What are you looking to achieve today?</p>
                <div className="relative group">
                    <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                        <Search className="h-6 w-6 text-gray-400 group-focus-within:text-blue-500" />
                    </div>
                    <input
                        type="text"
                        className="block w-full pl-12 pr-4 py-5 border-2 border-gray-200 rounded-full text-lg focus:ring-0 focus:border-blue-500 shadow-sm transition-all outline-none"
                        placeholder="Try 'exhibit at Winter FancyFaire' or 'apply for sofi awards'..."
                    />
                    <button className="absolute inset-y-2 right-2 bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors">
                        Search
                    </button>
                </div>
                <div className="flex flex-wrap justify-center gap-3 mt-8">
                    <span className="text-sm font-medium text-gray-400 uppercase tracking-wider mr-2 self-center">Popular:</span>
                    {['Join the SFA', 'Winter FancyFaire', 'sofi Awards', 'Market Trends 2026'].map(tag => (
                        <button key={tag} className="bg-gray-100 text-gray-700 px-4 py-1.5 rounded-full text-sm hover:bg-gray-200 transition-colors">{tag}</button>
                    ))}
                </div>
            </div>
        </div>
    )
}

// 2. Conversational
function Conversational() {
    return (
        <div className="flex flex-col h-full bg-gray-50">
            <div className="bg-white border-b p-6 shadow-sm flex items-center gap-4">
                <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-bold">SFA</div>
                <div>
                    <h2 className="font-bold text-lg text-gray-800">SFA Assistant</h2>
                    <p className="text-xs text-green-500 font-medium flex items-center gap-1"><span className="w-2 h-2 bg-green-500 rounded-full inline-block"></span> Online</p>
                </div>
            </div>
            <div className="flex-1 p-8 overflow-y-auto">
                <div className="flex gap-4 mb-6 max-w-2xl">
                    <div className="w-8 h-8 bg-blue-600 rounded-full flex-shrink-0 flex items-center justify-center text-white font-bold text-xs mt-1">SFA</div>
                    <div className="bg-white p-4 rounded-2xl rounded-tl-none shadow-sm border border-gray-100 text-gray-800 text-lg">
                        Hi there! Welcome to the Specialty Food Association. I can help you find exactly what you need. What brings you here today?
                    </div>
                </div>
                <div className="pl-12 flex flex-col gap-3 max-w-xl">
                    <button className="bg-blue-50 border border-blue-200 text-blue-700 p-4 rounded-xl text-left hover:bg-blue-100 transition-colors font-medium flex justify-between items-center group">
                        I want to become a member and access resources
                        <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />
                    </button>
                    <button className="bg-purple-50 border border-purple-200 text-purple-700 p-4 rounded-xl text-left hover:bg-purple-100 transition-colors font-medium flex justify-between items-center group">
                        I want to attend or exhibit at a Fancy Food Show
                        <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />
                    </button>
                    <button className="bg-orange-50 border border-orange-200 text-orange-700 p-4 rounded-xl text-left hover:bg-orange-100 transition-colors font-medium flex justify-between items-center group">
                        I want to apply for a sofi™ or Good Food Award
                        <ArrowRight className="w-5 h-5 opacity-0 group-hover:opacity-100 transform translate-x-[-10px] group-hover:translate-x-0 transition-all" />
                    </button>
                </div>
            </div>
            <div className="p-4 bg-white border-t">
                <div className="relative">
                    <input type="text" className="w-full bg-gray-100 border-none rounded-full py-4 pl-6 pr-12 text-gray-800 focus:ring-2 focus:ring-blue-500 outline-none" placeholder="Or type your question here..." />
                    <button className="absolute right-3 top-3 w-8 h-8 bg-blue-600 rounded-full flex items-center justify-center text-white hover:bg-blue-700"><Send className="w-4 h-4 ml-[-2px] mt-[1px]" /></button>
                </div>
            </div>
        </div>
    )
}

// 3. Intent Bento
function IntentBento() {
    return (
        <div className="h-full bg-gray-900 p-12 overflow-y-auto">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-4xl font-bold text-white mb-2">Specialty Food Association</h1>
                <p className="text-gray-400 text-xl mb-10">How can we support your growth today?</p>
                <div className="grid grid-cols-2 gap-6">
                    <div className="bg-gradient-to-br from-blue-500 to-blue-700 rounded-3xl p-8 cursor-pointer hover:scale-[1.02] transition-transform shadow-lg group relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <Briefcase className="w-12 h-12 text-white mb-6" />
                        <h2 className="text-3xl font-bold text-white mb-2">Join the Community</h2>
                        <p className="text-blue-100">Become a member, unlock benefits, and connect with 4,000+ businesses.</p>
                        <div className="mt-8 flex items-center text-white font-medium">Explore Membership <ChevronRight className="w-5 h-5 ml-1" /></div>
                    </div>
                    <div className="bg-gradient-to-br from-purple-500 to-purple-700 rounded-3xl p-8 cursor-pointer hover:scale-[1.02] transition-transform shadow-lg group relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <Calendar className="w-12 h-12 text-white mb-6" />
                        <h2 className="text-3xl font-bold text-white mb-2">Attend an Event</h2>
                        <p className="text-purple-100">Get tickets or exhibit at the Summer Fancy Food Show &amp; Winter FancyFaire.</p>
                        <div className="mt-8 flex items-center text-white font-medium">View Events <ChevronRight className="w-5 h-5 ml-1" /></div>
                    </div>
                    <div className="bg-gradient-to-br from-orange-500 to-orange-700 rounded-3xl p-8 cursor-pointer hover:scale-[1.02] transition-transform shadow-lg group relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <Award className="w-12 h-12 text-white mb-6" />
                        <h2 className="text-3xl font-bold text-white mb-2">Apply for Awards</h2>
                        <p className="text-orange-100">Submit your products for the sofi™ Awards or Good Food Awards.</p>
                        <div className="mt-8 flex items-center text-white font-medium">Award Submissions <ChevronRight className="w-5 h-5 ml-1" /></div>
                    </div>
                    <div className="bg-gradient-to-br from-emerald-500 to-emerald-700 rounded-3xl p-8 cursor-pointer hover:scale-[1.02] transition-transform shadow-lg group relative overflow-hidden">
                        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-32 h-32 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <BookOpen className="w-12 h-12 text-white mb-6" />
                        <h2 className="text-3xl font-bold text-white mb-2">Learn &amp; Grow</h2>
                        <p className="text-emerald-100">Access market data, trend reports, webinars, and business resources.</p>
                        <div className="mt-8 flex items-center text-white font-medium">Access Resources <ChevronRight className="w-5 h-5 ml-1" /></div>
                    </div>
                </div>
            </div>
        </div>
    )
}

// 4. Role-Based
function RoleBased() {
    const [role, setRole] = useState('maker');

    return (
        <div className="flex flex-col h-full bg-white">
            <div className="p-12 pb-8 border-b border-gray-100">
                <h1 className="text-4xl font-bold text-gray-900 mb-8">Welcome to the SFA.</h1>
                <div className="flex items-center gap-4 text-3xl font-light text-gray-500">
                    <span>I am a</span>
                    <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="bg-gray-100 text-gray-900 font-bold py-2 px-4 rounded-xl border-2 border-transparent focus:border-blue-500 focus:bg-white outline-none cursor-pointer hover:bg-gray-200 transition-colors appearance-none"
                    >
                        <option value="maker">Food Artisan / Maker</option>
                        <option value="buyer">Retailer / Buyer</option>
                        <option value="service">Distributor / Service</option>
                    </select>
                    <span>looking to...</span>
                </div>
            </div>
            <div className="flex-1 p-12 bg-gray-50 flex flex-col justify-center">
                {role === 'maker' && (
                    <div className="grid grid-cols-3 gap-6 animate-fade-in-up">
                        <ActionCard icon={<Briefcase/>} title="Join the SFA" desc="Get the resources to scale your brand." color="blue" />
                        <ActionCard icon={<Award/>} title="Submit to sofi Awards" desc="Gain massive visibility for your product." color="orange" />
                        <ActionCard icon={<Calendar/>} title="Exhibit at FancyFaire" desc="Get your product in front of top buyers." color="purple" />
                    </div>
                )}
                {role === 'buyer' && (
                    <div className="grid grid-cols-3 gap-6 animate-fade-in-up">
                        <ActionCard icon={<Calendar/>} title="Attend Fancy Food Show" desc="Discover the next big specialty items." color="purple" />
                        <ActionCard icon={<BookOpen/>} title="Read Trend Reports" desc="See what consumers want in 2026." color="emerald" />
                        <ActionCard icon={<Briefcase/>} title="Access Member Directory" desc="Find reliable, high-quality vendors." color="blue" />
                    </div>
                )}
                {role === 'service' && (
                    <div className="grid grid-cols-3 gap-6 animate-fade-in-up">
                        <ActionCard icon={<Calendar/>} title="Sponsor an Event" desc="Put your services in front of makers." color="purple" />
                        <ActionCard icon={<Briefcase/>} title="Become a Premier Provider" desc="Offer exclusive discounts to our members." color="blue" />
                        <ActionCard icon={<BookOpen/>} title="Host a Webinar" desc="Share your expertise with our community." color="emerald" />
                    </div>
                )}
            </div>
        </div>
    )
}

function ActionCard({ icon, title, desc, color }) {
    const colorClasses = {
        blue: 'text-blue-600 bg-blue-50 border-blue-200 hover:border-blue-400 hover:bg-blue-100',
        orange: 'text-orange-600 bg-orange-50 border-orange-200 hover:border-orange-400 hover:bg-orange-100',
        purple: 'text-purple-600 bg-purple-50 border-purple-200 hover:border-purple-400 hover:bg-purple-100',
        emerald: 'text-emerald-600 bg-emerald-50 border-emerald-200 hover:border-emerald-400 hover:bg-emerald-100',
    };
    return (
        <div className={`p-8 rounded-2xl border cursor-pointer transition-all ${colorClasses[color]}`}>
            <div className="mb-4 bg-white w-12 h-12 rounded-full flex items-center justify-center shadow-sm">{icon}</div>
            <h3 className="text-xl font-bold mb-2 text-gray-900">{title}</h3>
            <p className="text-gray-600">{desc}</p>
        </div>
    )
}

// 5. Command Palette
function CommandPalette() {
    return (
        <div className="flex items-center justify-center h-full bg-slate-900 p-8">
            <div className="w-full max-w-2xl bg-slate-800 rounded-xl shadow-2xl border border-slate-700 overflow-hidden flex flex-col">
                <div className="p-4 border-b border-slate-700 flex items-center gap-3">
                    <Terminal className="w-5 h-5 text-slate-400" />
                    <input
                        type="text"
                        className="bg-transparent border-none text-white text-lg w-full focus:outline-none placeholder-slate-500 font-mono"
                        placeholder="Search SFA or type a command..."
                        autoFocus
                    />
                    <div className="text-xs text-slate-500 font-mono border border-slate-600 rounded px-2 py-1">⌘K</div>
                </div>
                <div className="p-2 py-4 flex flex-col font-mono text-sm">
                    <div className="px-4 py-2 text-slate-500 text-xs uppercase tracking-wider mb-1">Actions</div>
                    <div className="px-4 py-3 bg-blue-600 text-white flex items-center justify-between rounded-lg cursor-pointer mx-2">
                        <div className="flex items-center gap-3"><Briefcase className="w-4 h-4"/> Join the Specialty Food Association</div>
                        <ArrowRight className="w-4 h-4 opacity-50" />
                    </div>
                    <div className="px-4 py-3 text-slate-300 flex items-center justify-between rounded-lg cursor-pointer hover:bg-slate-700 mx-2 mt-1">
                        <div className="flex items-center gap-3"><Calendar className="w-4 h-4 text-purple-400"/> Register for Winter FancyFaire</div>
                    </div>
                    <div className="px-4 py-3 text-slate-300 flex items-center justify-between rounded-lg cursor-pointer hover:bg-slate-700 mx-2 mt-1">
                        <div className="flex items-center gap-3"><Award className="w-4 h-4 text-orange-400"/> Submit Product for sofi™ Award</div>
                    </div>
                    <div className="px-4 py-3 text-slate-300 flex items-center justify-between rounded-lg cursor-pointer hover:bg-slate-700 mx-2 mt-1">
                        <div className="flex items-center gap-3"><BookOpen className="w-4 h-4 text-emerald-400"/> Read Consumer Outlook 2026</div>
                    </div>
                    
                    <div className="px-4 py-2 text-slate-500 text-xs uppercase tracking-wider mt-4 mb-1">Portals</div>
                    <div className="px-4 py-3 text-slate-300 flex items-center justify-between rounded-lg cursor-pointer hover:bg-slate-700 mx-2">
                        <div className="flex items-center gap-3"><UserCircle className="w-4 h-4"/> Member Dashboard Login</div>
                    </div>
                </div>
            </div>
        </div>
    )
}