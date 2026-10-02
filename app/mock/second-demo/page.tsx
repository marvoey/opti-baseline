'use client';

import React, { useState } from 'react';
import { 
  Search, ShoppingCart, Heart, MapPin, ChevronRight, 
  Layers, Clock, Sliders, Sparkles, Image as ImageIcon, ShieldCheck, 
  Tag, CheckCircle2, AlertCircle, ArrowRight, RefreshCw, 
  Plus, Edit3, Filter, Check, Zap
} from 'lucide-react';

const PRODUCTS_DATA = [
  {
    id: 'prod-1',
    sku: '100779834',
    brand: 'San Giorgio',
    title: 'Cesari Bianca III Polished Porcelain Tile',
    size: '12 x 24 in. • 8.5mm',
    pricePerSqFt: 2.49,
    originalPrice: 3.19,
    boxCoverage: 16.0,
    boxPrice: 39.84,
    badge: 'BESTSELLER',
    badgeColor: 'bg-[#C8102E]',
    samplePrice: 3.0,
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod-2',
    sku: '100776673',
    brand: 'Villa Artisan',
    title: 'Zellige Pearl Opal Polished Ceramic Subway Tile',
    size: '2 1/2 x 8 in. • Handcrafted Look',
    pricePerSqFt: 4.19,
    originalPrice: null,
    boxCoverage: 5.6,
    boxPrice: 23.46,
    badge: 'NEW ARRIVAL',
    badgeColor: 'bg-emerald-700',
    samplePrice: 3.0,
    imageUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod-3',
    sku: '101300929',
    brand: 'DuraLux Performance',
    title: 'Ferentino Noche Checkerboard Rigid Core Luxury Vinyl',
    size: '12 x 24 in. • Attached Foam Pad',
    pricePerSqFt: 2.97,
    originalPrice: 3.49,
    boxCoverage: 20.0,
    boxPrice: 59.40,
    badge: 'WATERPROOF',
    badgeColor: 'bg-neutral-900',
    samplePrice: 3.0,
    imageUrl: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=800&q=80'
  },
  {
    id: 'prod-4',
    sku: '100978535',
    brand: 'Rock Ridge Stone',
    title: 'Carrara Chateau Flower Polished Marble Waterjet Mosaic',
    size: '11 x 11 in. Mesh Mount',
    pricePerSqFt: 9.99,
    isPiece: true,
    originalPrice: null,
    boxCoverage: 0.84,
    boxPrice: 9.99,
    badge: 'NATURAL STONE',
    badgeColor: 'bg-amber-600',
    samplePrice: 5.0,
    imageUrl: 'https://images.unsplash.com/photo-1541123437800-1bb1317badc2?auto=format&fit=crop&w=800&q=80'
  }
];

export default function FloorAndDecorCMSDemo() {
  // Navigation & View Mode State
  const [currentView, setCurrentView] = useState('clp'); // 'clp' | 'pdp' | 'experimentation'
  const [cmsModeActive, setCmsModeActive] = useState(true); // Toggle CMS overlay controls
  const [selectedCategory, setSelectedCategory] = useState('Tile');
  const [selectedSubfilter, setSelectedSubfilter] = useState('All');
  
  // CMS Content State (Editable live in Visual Builder Mode)
  const [promoHero, setPromoHero] = useState({
    eyebrow: "UNMATCHED SELECTION. UNBELIEVABLE PRICES.",
    headline: "Can't-Miss Looks in Porcelain, Marble & Zellige",
    subtext: "Elevate your spaces with commercial-grade durability starting at just $1.19/sqft.",
    badgeText: "LIMITED TIME EVENT",
    timerEnabled: true,
    expiresAt: "Sunday 11:59 PM (Auto-Rollback to Standard Hero)",
    buttonText: "Shop Trending Tile",
    bgGradient: "from-stone-900 to-neutral-800"
  });

  // PDP Image Set Management (Solving Rachel's DAM drag-and-drop & CDN purge pain point)
  const [pdpImages, setPdpImages] = useState([
    { id: 'img-1', url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80', label: 'Primary Hero Room Scene', tag: 'Hero' },
    { id: 'img-2', url: 'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?auto=format&fit=crop&w=800&q=80', label: 'Close-Up Texture & Polished Veining', tag: 'Detail' },
    { id: 'img-3', url: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80', label: 'Bathroom Installation Perspective', tag: 'Lifestyle' },
    { id: 'img-4', url: 'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&q=80', label: 'Edge Profile & Spec Thickness (8.5mm)', tag: 'Technical' }
  ]);
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [damNotification, setDamNotification] = useState('');

  // 24,000 SKU Component Shell Property (Solving Allycia's developer bottleneck)
  const [pdpCustomProperties, setPdpCustomProperties] = useState({
    proTipSubtext: "Recommended Grout Joint: 1/8-in with Mapei Ultracolor Plus FA (Avalanche #38).",
    waterRating: "Impervious (Absorption < 0.5%)",
    shadeVariation: "V3 - Moderate Variation",
    peiRating: "Class 4 - Heavy Traffic"
  });

  // Automated Content Carousel (Solving Amplience + TV Page manual carousel stitching)
  const [smartDistributedContent, setSmartDistributedContent] = useState([
    {
      id: 'cnt-1',
      type: 'Video Guide (TV Page Auto-Sync)',
      title: 'How to Install 12x24 Large Format Porcelain Like a Pro',
      duration: '4:18 min',
      tag: 'Installation',
      category: 'Tile',
      views: '18.4k'
    },
    {
      id: 'cnt-2',
      type: 'Editorial Article (Blog Sync)',
      title: 'Zellige vs. Marble Look: Which Backsplash Fits Your Kitchen?',
      readTime: '3 min read',
      tag: 'Design Trends',
      category: 'Tile',
      author: 'Floor & Decor Design Studio'
    },
    {
      id: 'cnt-3',
      type: 'Warranty & Care Guide',
      title: 'Commercial PEI Rating & Sealing Guide for Polished Tile',
      readTime: '5 min read',
      tag: 'Maintenance',
      category: 'Tile',
      author: 'Technical Services'
    }
  ]);

  // AI Aesthetic Classifier (Solving Trey's request for automated style tagging)
  const [aiAnalysisRunning, setAiAnalysisRunning] = useState(false);
  const [aiProductTags, setAiProductTags] = useState([
    { label: 'Aesthetic Style', value: 'Modern Organic & Transitional', confidence: '98%' },
    { label: 'Color Palette', value: 'Warm Calacatta Gold / Soft Alabaster', confidence: '96%' },
    { label: 'Finish Texture', value: 'High-Gloss Nano Polished', confidence: '99%' },
    { label: 'Recommended Placement', value: 'Master Bath, Fireplace, Foyer', confidence: '94%' }
  ]);

  // Experimentation & Holdout Group State (Solving Ben's Dynamic Yield collision & holdout issue)
  const [selectedVariation, setSelectedVariation] = useState('variantB'); // 'control' | 'variantA' | 'variantB'
  const [experimentState] = useState({
    name: "CLP Conversion Optimization: High-Intent Primary CTA",
    mutualExclusionGroup: "Checkout Funnel Protection Group (ID: #MEG-402)",
    globalHoldoutActive: true,
    holdoutPercentage: 5,
    sampleSize: "142,890 visitors",
    statsSignificance: "98.4% Confidence (Stats Engine)",
    uplift: "+12.7% Add-to-Cart"
  });

  // Square Footage Calculator for PDP
  const [roomSqFt, setRoomSqFt] = useState(150);
  const wasteBuffer = 0.10; // 10% recommended waste
  const sqFtPerBox = 16.0;
  const pricePerSqFt = 2.49;
  const calculatedBoxes = Math.ceil((roomSqFt * (1 + wasteBuffer)) / sqFtPerBox);
  const totalPrice = (calculatedBoxes * sqFtPerBox * pricePerSqFt).toFixed(2);

  // Reorder Images Handler
  const handleMoveImage = (fromIdx: number, toIdx: number) => {
    const updated = [...pdpImages];
    const [movedItem] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, movedItem);
    setPdpImages(updated);
    setActiveImageIndex(toIdx);
    setDamNotification('Image set sequence updated! Optimizely DAM automatically invalidated edge CDN cache in 42ms.');
    setTimeout(() => setDamNotification(''), 4500);
  };

  // Run AI Aesthetic Classification
  const runAiClassification = () => {
    setAiAnalysisRunning(true);
    setTimeout(() => {
      setAiProductTags([
        { label: 'Aesthetic Style', value: 'Mid-Century Modern & Japandi', confidence: '99%' },
        { label: 'Color Palette', value: 'Neutral Veined Dolomite White', confidence: '97%' },
        { label: 'Texture Reflection', value: 'Subtle Specular Sheen (Matte-Satin)', confidence: '95%' },
        { label: 'Target Audience Affinity', value: 'High-End Residential Remodelers', confidence: '93%' }
      ]);
      setAiAnalysisRunning(false);
      setDamNotification('Mark AI completed multi-modal image classification and synchronized taxonomy to Optimizely Graph!');
      setTimeout(() => setDamNotification(''), 4500);
    }, 1200);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F7] text-neutral-900 font-sans antialiased">
      
      {/* ========================================================
          TOP DEMO PERSISTENT TOOLBAR (Marvin's Presentation Bar)
         ======================================================== */}
      <header className="sticky top-0 z-50 bg-[#1E2229] border-b border-neutral-700 text-white shadow-xl">
        <div className="max-w-7xl mx-auto px-4 py-2.5 flex flex-wrap items-center justify-between gap-3 text-xs">
          
          {/* Brand & Demo Pill */}
          <div className="flex items-center gap-2">
            <span className="bg-[#C8102E] text-white font-extrabold tracking-wider px-2 py-0.5 rounded text-[11px]">
              FLOOR {'&'} DECOR
            </span>
            <span className="text-neutral-400 font-mono">×</span>
            <span className="font-semibold text-neutral-200">Optimizely SaaS CMS Demo</span>
            <span className="bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 px-2 py-0.5 rounded-full text-[10px] font-mono">
              Live Preview
            </span>
          </div>

          {/* View Switchers */}
          <div className="flex items-center bg-neutral-900/90 rounded-lg p-1 border border-neutral-700/80">
            <button
              onClick={() => setCurrentView('clp')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                currentView === 'clp'
                  ? 'bg-[#C8102E] text-white shadow'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              1. Category Landing Page (CLP)
            </button>
            <button
              onClick={() => setCurrentView('pdp')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                currentView === 'pdp'
                  ? 'bg-[#C8102E] text-white shadow'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              2. PDP Shell {'&'} DAM Reordering
            </button>
            <button
              onClick={() => setCurrentView('experimentation')}
              className={`px-3 py-1.5 rounded-md font-medium transition-all ${
                currentView === 'experimentation'
                  ? 'bg-[#C8102E] text-white shadow'
                  : 'text-neutral-300 hover:text-white hover:bg-neutral-800'
              }`}
            >
              3. Ben {'&'} Trey: Experimentation {'&'} AI
            </button>
          </div>

          {/* Visual Builder Mode Toggle */}
          <div className="flex items-center gap-3">
            <label className="flex items-center gap-2 cursor-pointer bg-neutral-800/90 px-3 py-1.5 rounded-md border border-neutral-600 hover:border-neutral-500 transition-colors">
              <input
                type="checkbox"
                checked={cmsModeActive}
                onChange={(e) => setCmsModeActive(e.target.checked)}
                className="w-4 h-4 accent-[#C8102E] rounded cursor-pointer"
              />
              <span className="font-medium text-neutral-200 flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-red-400" />
                Visual Builder Controls {cmsModeActive ? '(ON)' : '(OFF)'}
              </span>
            </label>
          </div>
        </div>

        {/* Global Alert / DAM Toast */}
        {damNotification && (
          <div className="bg-emerald-600 text-white text-xs py-1.5 px-4 text-center font-medium flex items-center justify-center gap-2">
            <CheckCircle2 className="w-4 h-4" />
            <span>{damNotification}</span>
          </div>
        )}
      </header>

      {/* ========================================================
          FLOOR & DECOR AUTHENTIC SITE HEADER & UTILITIES
         ======================================================== */}
      <div className="bg-white border-b border-neutral-200">
        
        {/* Top utility micro-bar */}
        <div className="bg-[#212121] text-neutral-300 text-[11px] py-1.5 px-4">
          <div className="max-w-7xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3">
              <span className="font-semibold text-white tracking-wide">Bring It Home™</span>
              <span className="text-neutral-500">|</span>
              <span className="text-neutral-300">Free In-Store Pickup in 2 Hours or Less</span>
              <span className="hidden md:inline text-neutral-500">|</span>
              <span className="hidden md:inline text-amber-300 font-medium">New Cardholders: Save 15% Up to $200</span>
            </div>
            <div className="flex items-center gap-4 text-neutral-300">
              <span className="hover:text-white cursor-pointer flex items-center gap-1">
                <MapPin className="w-3 h-3 text-[#C8102E]" /> My Store: <strong>Omaha #277</strong> (Rose Blumkin Dr)
              </span>
              <span className="hover:text-white cursor-pointer hidden sm:inline">PRO Services</span>
              <span className="hover:text-white cursor-pointer hidden sm:inline">Free Design Services</span>
              <span className="hover:text-white cursor-pointer">Credit Services</span>
            </div>
          </div>
        </div>

        {/* Main Logo & Search Bar */}
        <div className="max-w-7xl mx-auto px-4 py-3.5 flex items-center justify-between gap-4">
          {/* Logo */}
          <div className="flex items-center gap-4 cursor-pointer" onClick={() => setCurrentView('clp')}>
            <div className="text-2xl font-black tracking-tighter text-[#212121] flex items-center">
              <span>FLOOR</span>
              <span className="text-[#C8102E] mx-1">{'&'}</span>
              <span>DECOR</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl relative">
            <input
              type="text"
              placeholder="What can we help you find today? (e.g., Carrara marble, 12x24 porcelain, zellige)"
              className="w-full pl-4 pr-11 py-2 text-sm bg-neutral-100 border border-neutral-300 rounded-md focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#C8102E] focus:border-transparent transition"
            />
            <button aria-label="Submit Search" className="absolute right-2 top-1/2 -translate-y-1/2 p-1.5 text-neutral-500 hover:text-[#C8102E]">
              <Search className="w-4 h-4" />
            </button>
          </div>

          {/* User Quick Actions */}
          <div className="flex items-center gap-5 text-sm font-medium text-neutral-800">
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#C8102E]">
              <Heart className="w-5 h-5 text-neutral-600" />
              <div className="hidden lg:block text-left text-xs leading-tight">
                <div className="text-neutral-500">Saved</div>
                <div className="font-bold">My Projects (3)</div>
              </div>
            </div>
            <div className="flex items-center gap-1.5 cursor-pointer hover:text-[#C8102E]">
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-neutral-800" />
                <span className="absolute -top-1.5 -right-2 bg-[#C8102E] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  2
                </span>
              </div>
              <div className="hidden lg:block text-left text-xs leading-tight">
                <div className="text-neutral-500">Cart</div>
                <div className="font-bold">$373.50</div>
              </div>
            </div>
          </div>
        </div>

        {/* Primary Floor & Decor Category Bar */}
        <nav className="border-t border-neutral-200 bg-white">
          <div className="max-w-7xl mx-auto px-4 flex items-center gap-7 overflow-x-auto text-xs font-bold uppercase tracking-wider py-2.5 text-neutral-800">
            {['Tile', 'Stone', 'Wood', 'Laminate', 'Vinyl', 'Fixtures', 'Installation Materials', 'Shop By Room', 'Clearance'].map((cat) => (
              <button
                key={cat}
                onClick={() => { setSelectedCategory(cat); setCurrentView('clp'); }}
                className={`whitespace-nowrap transition-colors pb-1 border-b-2 ${
                  selectedCategory === cat && currentView === 'clp'
                    ? 'border-[#C8102E] text-[#C8102E]'
                    : 'border-transparent text-neutral-700 hover:text-[#C8102E]'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </nav>
      </div>

      {/* ========================================================
          CMS VISUAL BUILDER METADATA DRAWER (When Mode Active)
         ======================================================== */}
      {cmsModeActive && (
        <aside aria-label="Visual Builder Inspector" className="bg-amber-50/90 border-b border-amber-200 px-4 py-2 text-xs text-amber-900 shadow-inner">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <span className="bg-amber-600 text-white font-bold px-1.5 py-0.5 rounded text-[10px]">
                SAAS VISUAL BUILDER
              </span>
              <span className="font-semibold">Contextual Structure:</span>
              <code className="bg-white/80 px-1.5 py-0.5 rounded text-amber-950 font-mono border border-amber-300">
                Experience &gt; Section: {currentView === 'clp' ? 'CLP_Tile_Promo_Slot' : currentView === 'pdp' ? 'PDP_Modular_24k_Shell' : 'Experimentation_Holdout_Matrix'}
              </code>
            </div>
            <div className="flex items-center gap-4 text-[11px]">
              <span className="flex items-center gap-1 font-medium">
                <Clock className="w-3.5 h-3.5 text-amber-700" /> Slot Timers: <strong>Active (Auto-Expire Sunday)</strong>
              </span>
              <span className="flex items-center gap-1 font-medium">
                <Tag className="w-3.5 h-3.5 text-amber-700" /> Graph Taxonomy Sync: <strong>Enabled</strong>
              </span>
              <span className="flex items-center gap-1 font-medium">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" /> Global Holdout: <strong>5% Guarded</strong>
              </span>
            </div>
          </div>
        </aside>
      )}

      {/* ========================================================
          MAIN VIEW CONTAINER
         ======================================================== */}
      <main className="max-w-7xl mx-auto px-4 py-6">

        {/* ========================================================
            VIEW 1: CATEGORY LANDING PAGE (CLP) - Rachel & Dawn
           ======================================================== */}
        {currentView === 'clp' && (
          <div className="space-y-6">
            
            {/* Breadcrumb */}
            <div className="text-xs text-neutral-500 flex items-center gap-1.5">
              <span>Home</span>
              <ChevronRight className="w-3 h-3" />
              <span className="font-semibold text-neutral-800">{selectedCategory} Flooring {'&'} Walls</span>
            </div>

            {/* CMS Section: Promotional Hero with Slot Timer & Inline Visual Builder Edit */}
            <div className="relative rounded-xl overflow-hidden border border-neutral-300 shadow-md">
              {cmsModeActive && (
                <div className="absolute top-3 right-3 z-20 flex items-center gap-2 bg-black/80 backdrop-blur-sm text-white px-2.5 py-1 rounded text-[11px] font-mono border border-neutral-600">
                  <Edit3 className="w-3 h-3 text-red-400" />
                  <span>Section: PromoBannerSlot</span>
                  <span className="bg-red-500/80 px-1.5 py-0.2 rounded text-[10px]">Timer Active</span>
                </div>
              )}

              <div className={`p-8 md:p-10 bg-gradient-to-r ${promoHero.bgGradient} text-white relative`}>
                <div className="max-w-2xl space-y-3">
                  <div className="inline-flex items-center gap-2 bg-[#C8102E] text-white text-xs font-bold uppercase tracking-widest px-2.5 py-1 rounded">
                    <span>{promoHero.badgeText}</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                  </div>

                  <h1 className="text-3xl md:text-4xl font-black tracking-tight leading-tight">
                    {promoHero.headline}
                  </h1>

                  <p className="text-neutral-300 text-sm leading-relaxed">
                    {promoHero.subtext}
                  </p>

                  <div className="pt-2 flex flex-wrap items-center gap-4">
                    <button className="bg-[#C8102E] hover:bg-[#b00d27] text-white font-bold text-sm px-6 py-3 rounded shadow-lg transition transform hover:-translate-y-0.5">
                      {promoHero.buttonText}
                    </button>
                    <button 
                      onClick={() => setCurrentView('pdp')}
                      className="bg-white/10 hover:bg-white/20 text-white font-semibold text-sm px-5 py-3 rounded border border-white/20 transition flex items-center gap-2"
                    >
                      <span>Explore Featured Cesari Bianca PDP</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Marketer Slot Expiration Visualizer */}
                {cmsModeActive && (
                  <div className="mt-6 pt-4 border-t border-white/20 flex flex-wrap items-center justify-between text-xs text-neutral-300 bg-black/30 p-3 rounded-lg">
                    <div className="flex items-center gap-2">
                      <Clock className="w-4 h-4 text-amber-400" />
                      <span><strong>Slot Countdown Timer:</strong> Component scheduled to expire in <strong>2 days, 9 hours</strong></span>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="text-emerald-400 flex items-center gap-1">
                        <Check className="w-3.5 h-3.5" /> Fallback Experience: Standard Category Banner
                      </span>
                      <button 
                        onClick={() => {
                          setPromoHero(prev => ({
                            ...prev,
                            headline: prev.headline.includes("Flash") ? "Can't-Miss Looks in Porcelain, Marble & Zellige" : "⚡ 48-Hour Weekend Flash Sale: Extra 10% Off All Porcelain Slabs",
                            badgeText: prev.headline.includes("Flash") ? "LIMITED TIME EVENT" : "EXCLUSIVE PROMO"
                          }));
                        }}
                        className="bg-neutral-800 hover:bg-neutral-700 text-neutral-200 px-2.5 py-1 rounded border border-neutral-600 text-[11px] font-medium"
                      >
                        Simulate Marketer Inline Content Edit
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* Sub-filter chips (Authentic F&D Look) */}
            <div className="flex items-center gap-2 overflow-x-auto pb-1 text-xs">
              <span className="font-bold text-neutral-700 mr-2 flex items-center gap-1">
                <Filter className="w-3.5 h-3.5" /> Filter By Look:
              </span>
              {['All', 'Marble Look', 'Wood Look', 'Zellige', 'Subway', 'Checkerboard', 'Large Format Slabs'].map((sub) => (
                <button
                  key={sub}
                  onClick={() => setSelectedSubfilter(sub)}
                  className={`px-3 py-1.5 rounded-full font-medium transition ${
                    selectedSubfilter === sub
                      ? 'bg-[#C8102E] text-white shadow-sm'
                      : 'bg-white text-neutral-700 border border-neutral-300 hover:bg-neutral-100'
                  }`}
                >
                  {sub}
                </button>
              ))}
            </div>

            {/* Product Grid Header */}
            <div className="flex justify-between items-center border-b border-neutral-200 pb-2">
              <div className="text-sm font-semibold text-neutral-700">
                Showing <strong>12 of 1,480 products</strong> in <span className="text-[#C8102E]">{selectedCategory}</span>
              </div>
              <div className="flex items-center gap-3 text-xs text-neutral-600">
                <span>Sort by: <strong>Best Match</strong></span>
                <span className="border-l border-neutral-300 h-4" />
                <span className="text-emerald-700 font-semibold flex items-center gap-1">
                  <CheckCircle2 className="w-3 h-3" /> In Stock at Omaha #277
                </span>
              </div>
            </div>

            {/* Product Card Grid dynamically mapped from authentic data */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {PRODUCTS_DATA.map((prod) => (
                <div 
                  key={prod.id} 
                  className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition group flex flex-col justify-between"
                >
                  <div>
                    <div 
                      className="relative aspect-[4/3] bg-neutral-100 overflow-hidden cursor-pointer" 
                      onClick={() => setCurrentView('pdp')}
                    >
                      <img
                        src={prod.imageUrl}
                        alt={prod.title}
                        className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                      />
                      <span className={`absolute top-2 left-2 text-white font-bold text-[10px] px-2 py-0.5 rounded ${prod.badgeColor}`}>
                        {prod.badge}
                      </span>
                      <button aria-label="Save to favorites" className="absolute top-2 right-2 p-1.5 rounded-full bg-white/90 text-neutral-600 hover:text-red-600 shadow">
                        <Heart className="w-4 h-4" />
                      </button>
                    </div>

                    <div className="p-4 space-y-1.5">
                      <div className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">
                        {prod.brand}
                      </div>
                      <h3 
                        onClick={() => setCurrentView('pdp')}
                        className="text-sm font-bold text-neutral-900 group-hover:text-[#C8102E] cursor-pointer line-clamp-2"
                      >
                        {prod.title}
                      </h3>
                      <div className="text-xs text-neutral-500">{prod.size}</div>

                      <div className="pt-2 flex items-baseline gap-2">
                        <span className="text-xl font-extrabold text-[#C8102E]">${prod.pricePerSqFt}</span>
                        <span className="text-xs text-neutral-500">{prod.isPiece ? '/ piece' : '/ sqft'}</span>
                        {prod.originalPrice && (
                          <span className="text-xs line-through text-neutral-400">${prod.originalPrice}</span>
                        )}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-medium">
                        {prod.isPiece ? 'Sold individually' : `$${prod.boxPrice} / box (${prod.boxCoverage} sqft / box)`}
                      </div>
                    </div>
                  </div>

                  <div className="p-4 pt-0 space-y-2">
                    <button 
                      onClick={() => setCurrentView('pdp')}
                      className="w-full bg-[#212121] hover:bg-[#C8102E] text-white text-xs font-bold py-2.5 rounded transition"
                    >
                      {prod.id === 'prod-1' ? "View Product & Calculate" : "View Product Details"}
                    </button>
                    <button className="w-full bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 text-xs font-semibold py-1.5 rounded">
                      + Order Sample (${prod.samplePrice.toFixed(2)})
                    </button>
                  </div>
                </div>
              ))}
            </div>

            {/* Smart Automated Content Hub (Solving Amplience + TV Page manual carousel stitching) */}
            <div className="mt-12 bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 mb-4 border-b border-neutral-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-red-100 text-[#C8102E] font-bold text-[11px] px-2 py-0.5 rounded">
                      OPTIMIZELY GRAPH AUTOMATION
                    </span>
                    <h2 className="text-lg font-bold text-neutral-900">
                      Inspiration, Guides {'&'} Video Walkthroughs
                    </h2>
                  </div>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    No manual carousel assembly required. Videos (TV Page) and Articles (Blog) populate dynamically based on Graph metadata tags (`Category: Tile`).
                  </p>
                </div>
                <button 
                  onClick={() => {
                    const newGuide = {
                      id: `cnt-${Date.now()}`,
                      type: 'Live Content Ingestion (Instant)',
                      title: '2027 Tile Trends: High-Relief Textures & Warm Earth Tones',
                      duration: '2 min read',
                      tag: 'Editorial',
                      category: 'Tile',
                      views: 'Just now'
                    };
                    setSmartDistributedContent([newGuide, ...smartDistributedContent]);
                    setDamNotification('New article published in CMS: Automatically distributed to Tile CLP, 1,480 PDPs, and Inspiration Hub without manual slot wiring!');
                    setTimeout(() => setDamNotification(''), 4500);
                  }}
                  className="bg-neutral-900 hover:bg-[#C8102E] text-white text-xs font-semibold px-3 py-2 rounded flex items-center gap-1.5 transition"
                >
                  <Plus className="w-3.5 h-3.5" /> Simulate New Article Publish
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {smartDistributedContent.map((item) => (
                  <div key={item.id} className="bg-neutral-50 rounded-lg p-4 border border-neutral-200 hover:border-neutral-300 transition flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-center text-[10px] font-mono text-neutral-500 mb-2">
                        <span className="font-bold text-[#C8102E] uppercase">{item.type}</span>
                        <span>{item.duration || item.readTime}</span>
                      </div>
                      <h4 className="font-bold text-sm text-neutral-900 mb-2 hover:text-[#C8102E] cursor-pointer">
                        {item.title}
                      </h4>
                    </div>
                    <div className="flex items-center justify-between text-xs text-neutral-500 pt-3 border-t border-neutral-200">
                      <span className="inline-flex items-center gap-1 bg-white px-2 py-0.5 rounded border border-neutral-200">
                        <Tag className="w-3 h-3 text-neutral-400" /> {item.tag}
                      </span>
                      <span className="font-medium text-neutral-700">Auto-Queried via GraphQL</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            VIEW 2: PDP SHELL & DAM REORDERING - Allycia & Rachel
           ======================================================== */}
        {currentView === 'pdp' && (
          <div className="space-y-6">
            
            {/* Breadcrumb & Navigation */}
            <div className="flex items-center justify-between text-xs text-neutral-500">
              <div className="flex items-center gap-1.5">
                <span className="cursor-pointer hover:underline" onClick={() => setCurrentView('clp')}>Tile</span>
                <ChevronRight className="w-3 h-3" />
                <span>Porcelain Tile</span>
                <ChevronRight className="w-3 h-3" />
                <span className="font-semibold text-neutral-800">Cesari Bianca III Polished Porcelain Tile (SKU: 100779834)</span>
              </div>
              <button 
                onClick={() => setCurrentView('clp')}
                className="text-[#C8102E] font-semibold flex items-center gap-1 hover:underline"
              >
                &larr; Back to Tile Category
              </button>
            </div>

            {/* Architecture Banner: 24,000 SKUs Modular Shell */}
            {cmsModeActive && (
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 text-xs text-blue-900 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2">
                  <span className="bg-blue-600 text-white font-bold px-1.5 py-0.5 rounded text-[10px]">
                    24,000 SKUs ARCHITECTURE
                  </span>
                  <span><strong>Allycia's Use Case:</strong> Single standardized PDP Component Shell dynamically mapping catalog feeds (SFCC/PIM) with custom CMS slot extensions.</span>
                </div>
                <div className="flex items-center gap-2">
                  <span className="font-mono bg-white px-2 py-1 rounded border border-blue-200 text-blue-800">
                    Template: pdp-flooring-modular
                  </span>
                </div>
              </div>
            )}

            {/* Main PDP Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
              
              {/* LEFT COLUMN: DAM Image Set & Live Drag-and-Drop Reordering (Rachel's Pain Point) */}
              <div className="lg:col-span-7 space-y-4">
                
                {/* Active Hero Image Display */}
                <div className="relative aspect-[4/3] rounded-lg overflow-hidden border border-neutral-200 bg-neutral-100">
                  <img
                    src={pdpImages[activeImageIndex]?.url}
                    alt={pdpImages[activeImageIndex]?.label}
                    className="w-full h-full object-cover transition-all duration-300"
                  />
                  <div className="absolute bottom-3 left-3 bg-black/70 backdrop-blur-sm text-white px-3 py-1.5 rounded-md text-xs font-medium">
                    {pdpImages[activeImageIndex]?.label}
                  </div>
                  <span className="absolute top-3 left-3 bg-[#C8102E] text-white text-xs font-bold px-2 py-0.5 rounded">
                    Position #{activeImageIndex + 1}
                  </span>
                </div>

                {/* DAM Reorder Control Deck (Directly addressing Rachel's request in the call) */}
                <div className="bg-neutral-50 rounded-lg p-3.5 border border-neutral-200 space-y-2">
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-bold text-neutral-800 flex items-center gap-1.5">
                      <ImageIcon className="w-4 h-4 text-[#C8102E]" />
                      Optimizely DAM: Image Set Reorder {'&'} Purge Engine
                    </span>
                    <span className="text-[11px] text-neutral-500 font-mono">
                      Click arrows to resequence • Zero CDN purge delays
                    </span>
                  </div>

                  {/* Thumbnail Strip with Reorder buttons */}
                  <div className="grid grid-cols-4 gap-2.5 pt-1">
                    {pdpImages.map((img, idx) => (
                      <div
                        key={img.id}
                        className={`relative rounded-md overflow-hidden border-2 transition-all p-1 bg-white flex flex-col justify-between ${
                          activeImageIndex === idx ? 'border-[#C8102E] shadow' : 'border-neutral-200 hover:border-neutral-300'
                        }`}
                      >
                        <div 
                          className="aspect-square bg-neutral-100 rounded overflow-hidden cursor-pointer"
                          onClick={() => setActiveImageIndex(idx)}
                        >
                          <img src={img.url} alt={img.label} className="w-full h-full object-cover" />
                        </div>

                        {/* Order & Swap Buttons */}
                        <div className="mt-1.5 flex items-center justify-between text-[10px] text-neutral-600 bg-neutral-100 px-1 py-0.5 rounded">
                          <span className="font-bold">#{idx + 1}</span>
                          <div className="flex items-center gap-1">
                            <button
                              disabled={idx === 0}
                              onClick={() => handleMoveImage(idx, idx - 1)}
                              className="px-1 hover:bg-neutral-200 rounded disabled:opacity-30 font-bold"
                              title="Move Left"
                            >
                              &larr;
                            </button>
                            <button
                              disabled={idx === pdpImages.length - 1}
                              onClick={() => handleMoveImage(idx, idx + 1)}
                              className="px-1 hover:bg-neutral-200 rounded disabled:opacity-30 font-bold"
                              title="Move Right"
                            >
                              &rarr;
                            </button>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <p className="text-[11px] text-neutral-500 italic">
                    Rachel: In Amplience, updating image sequences required developer ticket submissions and manual Akamai/Cloudflare purge commands. Optimizely DAM uses auto-versioned hash URLs to display reordered sets instantaneously.
                  </p>
                </div>

              </div>

              {/* RIGHT COLUMN: PDP Buy Box & Custom Field Demonstration */}
              <div className="lg:col-span-5 space-y-5">
                <div>
                  <div className="text-xs font-bold text-neutral-400 uppercase tracking-wider">
                    San Giorgio • Item #100779834
                  </div>
                  <h1 className="text-2xl font-black text-neutral-900 mt-1">
                    Cesari Bianca III Polished Porcelain Tile
                  </h1>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    12 in. x 24 in. • Polished High-Gloss • Commercial {'&'} Residential
                  </p>
                </div>

                {/* Price Display */}
                <div className="p-3.5 bg-neutral-50 rounded-lg border border-neutral-200 flex items-baseline justify-between">
                  <div>
                    <div className="flex items-baseline gap-2">
                      <span className="text-3xl font-extrabold text-[#C8102E]">${pricePerSqFt}</span>
                      <span className="text-sm font-semibold text-neutral-600">/ sqft</span>
                      <span className="text-xs line-through text-neutral-400">$3.19</span>
                    </div>
                    <div className="text-xs text-neutral-500 mt-0.5">
                      ${(sqFtPerBox * pricePerSqFt).toFixed(2)} / box ({sqFtPerBox} sqft covers 1 box)
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="bg-emerald-100 text-emerald-800 text-[11px] font-bold px-2 py-0.5 rounded">
                      In Stock: 4,820 sqft
                    </span>
                    <div className="text-[10px] text-neutral-500 mt-1">Aisle 14, Bay 08 (Omaha)</div>
                  </div>
                </div>

                {/* Square Footage & Box Calculator */}
                <div className="border border-neutral-200 rounded-lg p-4 space-y-3">
                  <div className="flex justify-between items-center text-xs">
                    <span className="font-bold text-neutral-800">Room Measurement Calculator</span>
                    <span className="text-neutral-500">+10% Waste Added</span>
                  </div>

                  <div className="flex items-center gap-3">
                    <div className="flex-1">
                      <label className="text-[11px] text-neutral-500 block">Total Area Needed (sqft):</label>
                      <input
                        type="number"
                        value={roomSqFt}
                        onChange={(e) => setRoomSqFt(Math.max(1, parseInt(e.target.value) || 0))}
                        className="w-full mt-1 px-3 py-1.5 border border-neutral-300 rounded text-sm font-semibold"
                      />
                    </div>
                    <div className="flex-1 bg-neutral-100 p-2 rounded text-center">
                      <div className="text-[11px] text-neutral-500">Boxes Required:</div>
                      <div className="text-lg font-black text-neutral-900">{calculatedBoxes} Boxes</div>
                      <div className="text-[10px] text-neutral-600">({calculatedBoxes * sqFtPerBox} sqft total)</div>
                    </div>
                  </div>

                  <div className="flex justify-between items-center pt-2 border-t border-neutral-200 text-xs">
                    <span className="text-neutral-600">Estimated Project Total:</span>
                    <span className="text-base font-extrabold text-[#C8102E]">${totalPrice}</span>
                  </div>
                </div>

                {/* Add to Cart Actions */}
                <div className="space-y-2">
                  <button className="w-full bg-[#C8102E] hover:bg-[#b00d27] text-white font-bold py-3 rounded text-sm shadow-md transition">
                    Add {calculatedBoxes} Boxes to Cart (${totalPrice})
                  </button>
                  <button className="w-full bg-white hover:bg-neutral-50 text-neutral-800 border border-neutral-300 font-bold py-2.5 rounded text-xs transition">
                    Order a $3.00 Sample Swatch
                  </button>
                </div>

                {/* Developer Extensibility Demonstration (Dawn & Marvin: Adding properties instantly) */}
                <div className="bg-amber-50/70 border border-amber-200 rounded-lg p-3.5 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-amber-900 flex items-center gap-1.5">
                      <Sliders className="w-3.5 h-3.5 text-amber-700" />
                      CMS Dynamic Component Properties (SaaS Schema)
                    </span>
                    <span className="text-[10px] font-mono text-amber-800 bg-amber-100 px-1.5 py-0.5 rounded">
                      Editable by Marketers
                    </span>
                  </div>

                  <div className="space-y-1.5 text-[11px]">
                    <div className="flex justify-between border-b border-amber-200/60 pb-1">
                      <span className="text-neutral-600">Pro Tip Subtext:</span>
                      <span className="font-semibold text-neutral-900 max-w-[240px] text-right">{pdpCustomProperties.proTipSubtext}</span>
                    </div>
                    <div className="flex justify-between border-b border-amber-200/60 pb-1">
                      <span className="text-neutral-600">PEI Hardness Rating:</span>
                      <span className="font-semibold text-neutral-900">{pdpCustomProperties.peiRating}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-neutral-600">Shade Variation:</span>
                      <span className="font-semibold text-neutral-900">{pdpCustomProperties.shadeVariation}</span>
                    </div>
                  </div>

                  <button 
                    onClick={() => {
                      setPdpCustomProperties(prev => ({
                        ...prev,
                        proTipSubtext: prev.proTipSubtext.includes("Avalanche") ? "Pro Tip: Pair with Schluter DITRA membrane for crack isolation on concrete substrates." : "Recommended Grout Joint: 1/8-in with Mapei Ultracolor Plus FA (Avalanche #38)."
                      }));
                      setDamNotification('CMS Content Model updated: Custom property updated live across all 24,000 SKUs sharing this shell!');
                      setTimeout(() => setDamNotification(''), 4500);
                    }}
                    className="w-full mt-1 bg-amber-200 hover:bg-amber-300 text-amber-950 font-semibold py-1 rounded text-[11px] transition"
                  >
                    Simulate Marketer Updating Custom "Pro Tip" Field
                  </button>
                </div>

              </div>

            </div>

            {/* AI Product Aesthetic Classifier Demo (Directly addressing Trey's question) */}
            <div className="bg-gradient-to-r from-neutral-900 to-neutral-800 text-white rounded-xl p-6 border border-neutral-700 shadow-lg space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <div className="flex items-center gap-2">
                    <Sparkles className="w-5 h-5 text-amber-400" />
                    <span className="bg-amber-400/20 text-amber-300 text-[10px] font-bold px-2 py-0.5 rounded border border-amber-400/30">
                      TREY'S USE CASE: MARK AI CLASSIFIER
                    </span>
                    <h3 className="text-lg font-bold">Automated Product Aesthetic {'&'} Taxonomy Enrichment</h3>
                  </div>
                  <p className="text-xs text-neutral-400 mt-1 max-w-2xl">
                    Floor {'&'} Decor has 24,000 SKUs where "white tile" lacks style taxonomy. Mark AI analyzes the product imagery and technical specs to automatically append rich aesthetic classification for search and 1:1 personalization.
                  </p>
                </div>

                <button
                  onClick={runAiClassification}
                  disabled={aiAnalysisRunning}
                  className="bg-[#C8102E] hover:bg-[#b00d27] disabled:opacity-50 text-white font-bold text-xs px-4 py-2.5 rounded shadow flex items-center gap-2 transition"
                >
                  <RefreshCw className={`w-3.5 h-3.5 ${aiAnalysisRunning ? 'animate-spin' : ''}`} />
                  {aiAnalysisRunning ? 'Analyzing Imagery with Mark...' : 'Re-Run Mark AI Classifier'}
                </button>
              </div>

              {/* Classification Cards */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                {aiProductTags.map((tag, idx) => (
                  <div key={idx} className="bg-neutral-800/90 border border-neutral-700 rounded-lg p-3">
                    <div className="text-[10px] font-mono text-neutral-400 uppercase tracking-wider">{tag.label}</div>
                    <div className="text-sm font-bold text-neutral-100 mt-1">{tag.value}</div>
                    <div className="mt-2 flex items-center justify-between text-[10px]">
                      <span className="text-emerald-400 font-mono">Confidence: {tag.confidence}</span>
                      <span className="text-neutral-500">Synced to Graph</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        )}

        {/* ========================================================
            VIEW 3: EXPERIMENTATION & HOLDOUT MATRIX - Ben & Trey
           ======================================================== */}
        {currentView === 'experimentation' && (
          <div className="space-y-6">
            
            {/* Header / Intro */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm">
              <div className="flex flex-wrap items-center justify-between gap-4 border-b border-neutral-100 pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="bg-[#C8102E] text-white font-bold text-[10px] px-2 py-0.5 rounded">
                      BEN'S USE CASE
                    </span>
                    <h2 className="text-xl font-bold text-neutral-900">
                      Optimizely Experimentation vs. Dynamic Yield Collisions
                    </h2>
                  </div>
                  <p className="text-xs text-neutral-500 mt-1 max-w-3xl">
                    Ben highlighted that in Dynamic Yield, targeting one campaign's audience inadvertently excludes them from other campaigns, breaking global holdouts and polluting funnel attribution. Here is how Optimizely mathematically protects your testing integrity.
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-3 py-1.5 rounded-full border border-emerald-200 flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-emerald-600" />
                    Global 5% Holdout Protected
                  </span>
                </div>
              </div>

              {/* Architectural Comparison Cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
                
                {/* Legacy Problem */}
                <div className="bg-red-50/60 border border-red-200 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-red-900">
                    <AlertCircle className="w-4 h-4 text-red-600" />
                    Floor {'&'} Decor's Current Risk (Dynamic Yield)
                  </div>
                  <ul className="text-xs text-red-800 space-y-1.5 list-disc pl-4">
                    <li>Campaign A (Tile Promo) and Campaign B (Free Design Booking) overlap uncontrollably.</li>
                    <li>Audience targeting on product recommendations inadvertently cannibalizes holdout controls.</li>
                    <li>Statistical degradation: Inability to prove true lift across the complete purchase funnel.</li>
                  </ul>
                </div>

                {/* Optimizely Solution */}
                <div className="bg-emerald-50/60 border border-emerald-200 rounded-lg p-4 space-y-2">
                  <div className="flex items-center gap-2 text-xs font-bold text-emerald-900">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    Optimizely Native Mutual Exclusion Architecture
                  </div>
                  <ul className="text-xs text-emerald-800 space-y-1.5 list-disc pl-4">
                    <li><strong>Mutual Exclusion Groups (MEG):</strong> Users randomly allocated to Test A cannot physically enter Test B.</li>
                    <li><strong>Global Persistent Holdout:</strong> 5% of traffic is systematically shielded from all personalization to prove compounding annual ROI.</li>
                    <li><strong>Stats Engine (FDR Control):</strong> False Positive rate locked below 5% without waiting for arbitrary sample sizes.</li>
                  </ul>
                </div>

              </div>
            </div>

            {/* Live Interactive Experimentation Variation Simulator */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-4">
              <div className="flex flex-wrap items-center justify-between gap-4">
                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    Live Test: Wall {'&'} Ceiling / Tile Add-to-Cart Friction Test
                  </h3>
                  <div className="text-xs text-neutral-500 font-mono mt-0.5">
                    Mutual Exclusion Group: #MEG-402 (Checkout Protection) • Target Audience: High-Intent Homeowners
                  </div>
                </div>

                {/* Variation Switcher Tabs */}
                <div className="flex bg-neutral-100 p-1 rounded-lg border border-neutral-200 text-xs font-medium">
                  <button
                    onClick={() => setSelectedVariation('control')}
                    className={`px-3 py-1.5 rounded transition ${
                      selectedVariation === 'control' ? 'bg-white text-neutral-900 shadow-sm font-bold' : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    Control (Original F{'&'}D UI)
                  </button>
                  <button
                    onClick={() => setSelectedVariation('variantA')}
                    className={`px-3 py-1.5 rounded transition ${
                      selectedVariation === 'variantA' ? 'bg-[#C8102E] text-white shadow-sm font-bold' : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    Variation A: Mark AI Red Action CTA
                  </button>
                  <button
                    onClick={() => setSelectedVariation('variantB')}
                    className={`px-3 py-1.5 rounded transition ${
                      selectedVariation === 'variantB' ? 'bg-[#C8102E] text-white shadow-sm font-bold' : 'text-neutral-600 hover:text-neutral-900'
                    }`}
                  >
                    Variation B: Instant Square Foot Calculator + Sample CTA
                  </button>
                </div>
              </div>

              {/* Rendered Variation Canvas Preview */}
              <div className="border-2 border-dashed border-neutral-300 rounded-lg p-6 bg-neutral-50">
                <div className="max-w-xl mx-auto bg-white p-5 rounded-lg border border-neutral-200 shadow-sm space-y-4">
                  
                  <div className="flex gap-4">
                    <img
                      src={pdpImages[0].url}
                      alt="Thumbnail preview"
                      className="w-24 h-24 object-cover rounded border border-neutral-200"
                    />
                    <div>
                      <span className="text-[10px] font-bold text-neutral-400 uppercase">Wall {'&'} Floor Tile</span>
                      <h4 className="text-sm font-bold text-neutral-900">Cesari Bianca III Polished Porcelain Tile</h4>
                      <div className="text-base font-extrabold text-[#C8102E] mt-1">$2.49 / sqft</div>
                    </div>
                  </div>

                  {/* Dynamic Experience injected based on variation */}
                  {selectedVariation === 'control' && (
                    <div className="space-y-2 pt-2 border-t border-neutral-100">
                      <div className="text-xs text-neutral-500 italic">Control: Standard generic link layout</div>
                      <button className="w-full bg-neutral-800 text-white text-xs font-bold py-2 rounded">
                        Add to Cart
                      </button>
                    </div>
                  )}

                  {selectedVariation === 'variantA' && (
                    <div className="space-y-2 pt-2 border-t border-neutral-100">
                      <div className="text-xs text-emerald-600 font-semibold flex items-center gap-1">
                        <Sparkles className="w-3.5 h-3.5" /> Mark AI Prompted: High-Contrast Visual Urgency
                      </div>
                      <button className="w-full bg-[#C8102E] hover:bg-[#b00d27] text-white text-xs font-extrabold py-3 rounded shadow flex items-center justify-center gap-2">
                        <span>Get Instant In-Store Pickup Today</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  )}

                  {selectedVariation === 'variantB' && (
                    <div className="space-y-2 pt-2 border-t border-neutral-100">
                      <div className="text-xs text-indigo-600 font-semibold flex items-center gap-1">
                        <Zap className="w-3.5 h-3.5" /> Friction Reducer: 1-Click Square Foot Estimator
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          defaultValue="150 sqft"
                          className="w-28 text-xs px-2 py-1.5 border border-neutral-300 rounded font-semibold text-center"
                        />
                        <button className="flex-1 bg-[#C8102E] text-white text-xs font-bold py-1.5 rounded">
                          Add 10 Boxes ($373.50)
                        </button>
                      </div>
                    </div>
                  )}

                </div>
              </div>

              {/* Stats Engine Proof Metrics */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 pt-2 text-center text-xs">
                <div className="bg-neutral-50 p-3 rounded border border-neutral-200">
                  <div className="text-neutral-500">Sample Size</div>
                  <div className="text-sm font-extrabold text-neutral-800 mt-0.5">{experimentState.sampleSize}</div>
                </div>
                <div className="bg-neutral-50 p-3 rounded border border-neutral-200">
                  <div className="text-neutral-500">Statistical Significance</div>
                  <div className="text-sm font-extrabold text-emerald-600 mt-0.5">{experimentState.statsSignificance}</div>
                </div>
                <div className="bg-neutral-50 p-3 rounded border border-neutral-200">
                  <div className="text-neutral-500">Primary Goal Lift</div>
                  <div className="text-sm font-extrabold text-[#C8102E] mt-0.5">{experimentState.uplift}</div>
                </div>
                <div className="bg-neutral-50 p-3 rounded border border-neutral-200">
                  <div className="text-neutral-500">Cross-Campaign Bleed</div>
                  <div className="text-sm font-extrabold text-emerald-600 mt-0.5">0.00% (Isolated)</div>
                </div>
              </div>

            </div>

            {/* Product Recommendations & Collection Selling (Trey's Ask) */}
            <div className="bg-white rounded-xl border border-neutral-200 p-6 shadow-sm space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-base font-bold text-neutral-900">
                    Trey's Request: Collection Selling {'&'} 115 Recommendation Algorithms
                  </h3>
                  <p className="text-xs text-neutral-500 mt-0.5">
                    Replacing Dynamic Yield's basic recs with intelligent "Complete the Project" bundle recommendations (Tile + Mapei Grout + Spacers + Schluter Trim).
                  </p>
                </div>
                <span className="text-xs font-mono text-[#C8102E] bg-red-50 border border-red-200 px-2 py-1 rounded">
                  Algorithm: Co-Occurrence Project Matrix
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2">
                <div className="border border-neutral-200 rounded-lg p-3 bg-neutral-50 flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded border border-neutral-200 flex items-center justify-center font-bold text-xs text-neutral-600">
                    GROUT
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-neutral-800">Mapei Ultracolor Plus FA</div>
                    <div className="text-neutral-500">Avalanche #38 (10 lb)</div>
                    <div className="text-[#C8102E] font-bold mt-0.5">$18.99</div>
                  </div>
                </div>

                <div className="border border-neutral-200 rounded-lg p-3 bg-neutral-50 flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded border border-neutral-200 flex items-center justify-center font-bold text-xs text-neutral-600">
                    TRIM
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-neutral-800">Schluter Schiene Satin Nickel</div>
                    <div className="text-neutral-500">3/8 in. x 8 ft. Profile</div>
                    <div className="text-[#C8102E] font-bold mt-0.5">$14.49</div>
                  </div>
                </div>

                <div className="border border-neutral-200 rounded-lg p-3 bg-neutral-50 flex items-center gap-3">
                  <div className="w-12 h-12 bg-white rounded border border-neutral-200 flex items-center justify-center font-bold text-xs text-neutral-600">
                    SYSTEM
                  </div>
                  <div className="text-xs">
                    <div className="font-bold text-neutral-800">Raimondi Leveling Clips</div>
                    <div className="text-neutral-500">1/16 in. Spacers (250 pack)</div>
                    <div className="text-[#C8102E] font-bold mt-0.5">$24.99</div>
                  </div>
                </div>
              </div>
            </div>

          </div>
        )}

      </main>

      {/* ========================================================
          FLOOR & DECOR AUTHENTIC FOOTER
         ======================================================== */}
      <footer className="mt-16 bg-[#212121] text-neutral-400 text-xs border-t border-neutral-800">
        <div className="max-w-7xl mx-auto px-4 py-10 grid grid-cols-2 md:grid-cols-4 gap-8">
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Customer Service</h4>
            <ul className="space-y-2">
              <li className="hover:text-white cursor-pointer">Order Status</li>
              <li className="hover:text-white cursor-pointer">Returns {'&'} Exchanges</li>
              <li className="hover:text-white cursor-pointer">Store Locator</li>
              <li className="hover:text-white cursor-pointer">Pro Premier Program</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Resources {'&'} Services</h4>
            <ul className="space-y-2">
              <li className="hover:text-white cursor-pointer">Free Design Consultation</li>
              <li className="hover:text-white cursor-pointer">Financing Options</li>
              <li className="hover:text-white cursor-pointer">DIY Classes {'&'} Videos</li>
              <li className="hover:text-white cursor-pointer">Installation Made Easy</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Shop Top Categories</h4>
            <ul className="space-y-2">
              <li className="hover:text-white cursor-pointer">Porcelain {'&'} Ceramic Tile</li>
              <li className="hover:text-white cursor-pointer">Waterproof Luxury Vinyl</li>
              <li className="hover:text-white cursor-pointer">Solid {'&'} Engineered Hardwood</li>
              <li className="hover:text-white cursor-pointer">Installation Materials</li>
            </ul>
          </div>
          <div>
            <h4 className="text-white font-bold mb-3 uppercase tracking-wider text-[11px]">Optimizely SaaS Architecture</h4>
            <p className="text-[11px] text-neutral-400 leading-relaxed mb-3">
              Built on Optimizely CMS (SaaS), Graph GraphQL Engine, DAM with automatic renditions, and Stats Engine Experimentation.
            </p>
            <div className="text-[10px] text-neutral-500 font-mono">
              Instance: F{'&'}D-POC-SAAS-01 • Engine: React 18 Headless
            </div>
          </div>
        </div>
        <div className="border-t border-neutral-800 py-4 text-center text-[11px] text-neutral-500">
          © 2026 Floor and Decor Outlets of America, Inc. Replicated for Technical Evaluation {'&'} Demonstration Purposes.
        </div>
      </footer>

    </div>
  );
}