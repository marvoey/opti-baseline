'use client';

import React, { useState } from 'react';
import { Search, Briefcase, Calendar, Award, BookOpen, ChevronRight, LogIn, LogOut, User, Bell, ArrowRight, Settings } from 'lucide-react';

export default function SFAHybridDemo() {
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    return (
        <div className="flex flex-col min-h-screen bg-blue-50 font-sans">
            {/* Top Navigation */}
            <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <a href="/" className="flex items-center">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img src="/logo.svg" alt="Specialty Food Association" className="h-10 w-auto" />
                    </a>
                    <div className="flex items-center gap-4">
                        {isAuthenticated ? (
                            <>
                                <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-full transition-colors relative">
                                    <Bell className="w-5 h-5" />
                                    <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full"></span>
                                </button>
                                <div className="flex items-center gap-3 pl-4 border-l border-gray-200">
                                    <div className="w-8 h-8 bg-gradient-to-tr from-[#2E9791] to-[#89688D] rounded-full flex items-center justify-center text-white font-medium text-sm">
                                        JD
                                    </div>
                                    <button 
                                        onClick={() => setIsAuthenticated(false)}
                                        className="text-sm font-medium text-gray-600 hover:text-gray-900 flex items-center gap-2"
                                    >
                                        Sign Out <LogOut className="w-4 h-4" />
                                    </button>
                                </div>
                            </>
                        ) : (
                            <button 
                                onClick={() => setIsAuthenticated(true)}
                                className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-full text-sm font-medium transition-colors flex items-center gap-2 shadow-sm"
                            >
                                Member Login <LogIn className="w-4 h-4" />
                            </button>
                        )}
                    </div>
                </div>
            </header>

            {/* Main Content Area */}
            <main className="flex-1 overflow-y-auto">
                {isAuthenticated ? <AuthenticatedView /> : <UnauthenticatedView />}
            </main>
        </div>
    );
}

// ---------------------------------------------------------------------------
// UNAUTHENTICATED VIEW: Role-Based + Intent Bento
// ---------------------------------------------------------------------------
function UnauthenticatedView() {
    const [role, setRole] = useState('maker');

    return (
        <div className="max-w-6xl mx-auto px-6 py-16 animate-fade-in">
            {/* Role-Based Hero Section */}
            <div className="text-center mb-16 space-y-6">
                <h1 className="text-5xl font-extrabold text-gray-900 tracking-tight">
                    Shaping the Future of Specialty Food
                </h1>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 text-2xl md:text-4xl font-light text-gray-500 mt-8">
                    <span>I am a</span>
                    <div className="relative inline-block">
                        <select
                            value={role}
                            onChange={(e) => setRole(e.target.value)}
                            className="appearance-none bg-white text-blue-600 font-bold py-2 pl-6 pr-12 rounded-2xl border-2 border-blue-100 hover:border-blue-300 focus:border-blue-600 focus:ring-4 focus:ring-blue-50 outline-none cursor-pointer transition-all shadow-sm"
                        >
                            <option value="maker">Food Artisan / Maker</option>
                            <option value="buyer">Retailer / Buyer</option>
                            <option value="service">Distributor / Service</option>
                        </select>
                        <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center px-4 text-blue-600">
                            <ChevronRight className="w-6 h-6 transform rotate-90" />
                        </div>
                    </div>
                    <span>looking to...</span>
                </div>
            </div>

            {/* Intent Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {/* Primary Action (Large) */}
                <div className="lg:col-span-2 lg:row-span-2 bg-gradient-to-br from-[#0B1014] to-[#1c2e2d] rounded-3xl p-10 text-white shadow-xl hover:-translate-y-1 transition-transform cursor-pointer group relative overflow-hidden">
                    <div className="absolute top-0 right-0 -mt-8 -mr-8 w-64 h-64 bg-blue-500 opacity-20 rounded-full blur-3xl group-hover:scale-110 transition-transform duration-700"></div>
                    <Briefcase className="w-12 h-12 text-blue-400 mb-8" />
                    <h2 className="text-4xl font-bold mb-4">Join the Community</h2>
                    <p className="text-slate-300 text-lg mb-12 max-w-md">
                        {role === 'maker' && "Get the resources, connections, and visibility you need to scale your food brand globally."}
                        {role === 'buyer' && "Connect with thousands of vetted, high-quality specialty food makers and discover trends early."}
                        {role === 'service' && "Offer your services directly to the businesses shaping the specialty food industry."}
                    </p>
                    <div className="flex items-center text-blue-400 font-semibold group-hover:text-blue-300">
                        Become a Member <ArrowRight className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                    </div>
                </div>

                {/* Secondary Actions */}
                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group">
                    <Calendar className="w-10 h-10 text-[#89688D] mb-6 bg-[#ede8ee] p-2 rounded-xl" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">Winter FancyFaire</h3>
                    <p className="text-gray-500 text-sm mb-6">
                        {role === 'maker' ? "Exhibit your products to thousands of buyers." : "Discover the next big specialty items."}
                    </p>
                    <div className="flex items-center text-[#89688D] font-medium text-sm">
                        {role === 'maker' ? "Book a Booth" : "Register to Attend"} <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                </div>

                <div className="bg-white rounded-3xl p-8 border border-gray-100 shadow-sm hover:shadow-md hover:-translate-y-1 transition-all cursor-pointer group">
                    <Award className="w-10 h-10 text-orange-500 mb-6 bg-orange-50 p-2 rounded-xl" />
                    <h3 className="text-xl font-bold text-gray-900 mb-2">sofi™ Awards</h3>
                    <p className="text-gray-500 text-sm mb-6">
                        {role === 'maker' ? "Submit your products for food's most coveted trophy." : "View the 2026 award winners and finalists."}
                    </p>
                    <div className="flex items-center text-orange-500 font-medium text-sm">
                        {role === 'maker' ? "Apply Now" : "View Winners"} <ChevronRight className="w-4 h-4 ml-1" />
                    </div>
                </div>

                <div className="lg:col-span-2 bg-gradient-to-r from-[#1DB693] to-[#28807C] rounded-3xl p-8 text-white shadow-lg hover:-translate-y-1 transition-transform cursor-pointer flex flex-col md:flex-row items-start md:items-center justify-between group overflow-hidden relative">
                    <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,_white_1px,_transparent_1px)] bg-[length:20px_20px]"></div>
                    <div className="relative z-10">
                        <BookOpen className="w-10 h-10 text-white/80 mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Consumer Outlook 2026</h3>
                        <p className="text-white/90">Download our latest trend report and market data.</p>
                    </div>
                    <button className="relative z-10 mt-6 md:mt-0 bg-white text-[#28807C] px-6 py-3 rounded-full font-bold shadow-sm hover:shadow-md transition-shadow flex items-center">
                        Get the Report <ArrowRight className="w-4 h-4 ml-2" />
                    </button>
                </div>
            </div>
        </div>
    );
}

// ---------------------------------------------------------------------------
// AUTHENTICATED VIEW: Search-First + Intent Bento
// ---------------------------------------------------------------------------
function AuthenticatedView() {
    return (
        <div className="animate-fade-in">
            {/* Search-First Hero Banner */}
            <div className="bg-blue-600 text-white py-16 px-6">
                <div className="max-w-4xl mx-auto text-center">
                    <h1 className="text-4xl md:text-5xl font-bold mb-6">Welcome back, Jane.</h1>
                    <p className="text-blue-100 text-xl mb-10">What do you want to accomplish today?</p>
                    
                    <div className="relative max-w-2xl mx-auto group">
                        <div className="absolute inset-y-0 left-0 pl-5 flex items-center pointer-events-none">
                            <Search className="h-6 w-6 text-gray-400 group-focus-within:text-blue-600 transition-colors" />
                        </div>
                        <input
                            type="text"
                            className="block w-full pl-14 pr-4 py-4 md:py-5 border-0 rounded-full text-lg text-gray-900 placeholder-gray-400 focus:ring-4 focus:ring-blue-300 shadow-xl transition-all outline-none"
                            placeholder="Search SFA directory, events, or resources..."
                            autoFocus
                        />
                        <button className="absolute inset-y-2 right-2 bg-blue-600 text-white px-6 py-2 rounded-full font-medium hover:bg-blue-700 transition-colors hidden md:block">
                            Search SFA
                        </button>
                    </div>

                    <div className="flex flex-wrap justify-center gap-3 mt-6 text-sm">
                        <span className="text-blue-200 font-medium py-1">Quick Links:</span>
                        <button className="bg-blue-500/30 hover:bg-blue-500/50 text-white px-4 py-1 rounded-full transition-colors backdrop-blur-sm border border-blue-400/30">My Dashboard</button>
                        <button className="bg-blue-500/30 hover:bg-blue-500/50 text-white px-4 py-1 rounded-full transition-colors backdrop-blur-sm border border-blue-400/30">Winter FancyFaire Info</button>
                        <button className="bg-blue-500/30 hover:bg-blue-500/50 text-white px-4 py-1 rounded-full transition-colors backdrop-blur-sm border border-blue-400/30">Contact Advisor</button>
                    </div>
                </div>
            </div>

            {/* Authenticated Intent Bento */}
            <div className="max-w-6xl mx-auto px-6 py-12">
                <div className="mb-8 flex items-center justify-between">
                    <h2 className="text-2xl font-bold text-gray-900">Your Member Hub</h2>
                    <button className="text-blue-600 font-medium hover:underline flex items-center gap-1">
                        <Settings className="w-4 h-4" /> Manage Account
                    </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    {/* Member Profile/Status */}
                    <div className="md:col-span-2 bg-white rounded-3xl p-8 border border-gray-200 shadow-sm flex flex-col justify-between">
                        <div className="flex items-start justify-between mb-8">
                            <div className="flex items-center gap-4">
                                <div className="w-16 h-16 bg-blue-100 text-blue-600 rounded-full flex items-center justify-center border-4 border-white shadow-sm">
                                    <Briefcase className="w-8 h-8" />
                                </div>
                                <div>
                                    <h3 className="text-2xl font-bold text-gray-900">Artisan Foods Inc.</h3>
                                    <p className="text-gray-500">Member since 2022 • Food Maker</p>
                                </div>
                            </div>
                            <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide">
                                Active Status
                            </span>
                        </div>
                        <div className="grid grid-cols-3 gap-4 border-t border-gray-100 pt-6">
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">Upcoming Events</p>
                                <p className="text-xl font-bold text-gray-900">1 <span className="text-sm font-normal text-gray-400">Registered</span></p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">Active Submissions</p>
                                <p className="text-xl font-bold text-gray-900">2 <span className="text-sm font-normal text-gray-400">sofi™ Awards</span></p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 font-medium mb-1">Team Members</p>
                                <p className="text-xl font-bold text-gray-900">4 <span className="text-sm font-normal text-blue-600 hover:underline cursor-pointer">Manage</span></p>
                            </div>
                        </div>
                    </div>

                    {/* Dedicated CTA Bento */}
                    <div className="bg-gradient-to-br from-[#89688D] to-[#6c5270] rounded-3xl p-8 text-white shadow-md relative overflow-hidden group cursor-pointer">
                        <div className="absolute -right-10 -bottom-10 w-40 h-40 bg-white opacity-10 rounded-full blur-2xl group-hover:scale-150 transition-transform duration-700"></div>
                        <Calendar className="w-10 h-10 text-white/70 mb-4" />
                        <h3 className="text-2xl font-bold mb-2">Winter FancyFaire</h3>
                        <p className="text-white/80 text-sm mb-8">Your exhibitor portal is ready. Finalize your booth details by Oct 15th.</p>
                        <div className="bg-white/20 hover:bg-white/30 transition-colors backdrop-blur-sm py-2 px-4 rounded-xl inline-flex items-center font-medium text-sm border border-white/20">
                            Go to Portal <ArrowRight className="w-4 h-4 ml-2" />
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                        <Award className="w-8 h-8 text-orange-500 mb-4 bg-orange-50 p-1.5 rounded-lg" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">My Award Submissions</h3>
                        <p className="text-sm text-gray-500 mb-4">You have 2 pending sofi™ Award applications in draft.</p>
                        <div className="text-orange-500 font-medium text-sm group-hover:text-orange-600 flex items-center">
                            Continue Application <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                        <BookOpen className="w-8 h-8 text-emerald-500 mb-4 bg-emerald-50 p-1.5 rounded-lg" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Member Resources</h3>
                        <p className="text-sm text-gray-500 mb-4">Access exclusive webinars, trend reports, and regulatory updates.</p>
                        <div className="text-emerald-500 font-medium text-sm group-hover:text-emerald-600 flex items-center">
                            Browse Library <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                    </div>

                    <div className="bg-white rounded-3xl p-8 border border-gray-200 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
                        <User className="w-8 h-8 text-blue-500 mb-4 bg-blue-50 p-1.5 rounded-lg" />
                        <h3 className="text-lg font-bold text-gray-900 mb-2">Member Directory</h3>
                        <p className="text-sm text-gray-500 mb-4">Connect with SFA buyers, makers, and industry service providers.</p>
                        <div className="text-blue-500 font-medium text-sm group-hover:text-blue-600 flex items-center">
                            Search Directory <ChevronRight className="w-4 h-4 ml-1" />
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}