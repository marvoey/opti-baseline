'use client';

import React, { useState } from 'react';
import { 
  Search, 
  MapPin, 
  ShoppingCart, 
  Heart, 
  User, 
  Menu, 
  X, 
  ChevronRight, 
  ChevronDown, 
  Star, 
  ShieldCheck, 
  Truck, 
  Store, 
  Calendar, 
  Check, 
  ArrowRight, 
  SlidersHorizontal,
  Info,
  Layers,
  Sparkles,
  Phone,
  Compass
} from 'lucide-react';

// --- MOCK DATABASE ---
const CATEGORIES = [
  { id: 'tile', name: 'Tile', badge: 'Popular', image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80' },
  { id: 'wood', name: 'Hardwood', badge: 'Premium', image: 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=600&q=80' },
  { id: 'vinyl', name: 'Laminate & Vinyl', badge: '100% Waterproof', image: 'https://images.unsplash.com/photo-1581858726788-75bc0f6a952d?auto=format&fit=crop&w=600&q=80' },
  { id: 'stone', name: 'Natural Stone', badge: 'Luxury', image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80' },
  { id: 'bath', name: 'Bathroom & Vanities', badge: 'Complete Suites', image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=600&q=80' },
  { id: 'install', name: 'Installation Materials', badge: 'Pro Grade', image: 'https://images.unsplash.com/photo-1504307651254-35680f356dfd?auto=format&fit=crop&w=600&q=80' },
];

const PRODUCTS = [
  {
    id: '100610781',
    slug: 'venato-white-porcelain-tile',
    name: 'Venato White Polished Porcelain Tile',
    brand: 'San Giorgio',
    size: '12 x 24 in.',
    sqftPerBox: 16.0,
    priceSqft: 2.49,
    rating: 4.8,
    reviews: 218,
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80'
    ],
    material: 'Porcelain',
    finish: 'Polished',
    peiRating: 'Class 4 - Heavy Traffic',
    dcof: '>= 0.42 (Indoor Dry & Wet)',
    inStock: true,
    stockCount: 4200,
    features: [
      'Timeless marble veining in durable, non-porous porcelain',
      'Rectified edges allow for slim 1/16 in. grout lines',
      'Completely impervious to water, staining, and bacteria',
      'Ideal for heavy residential and commercial bathroom & kitchen floors'
    ]
  },
  {
    id: '100650472',
    slug: 'andover-white-matte-porcelain',
    name: 'Andover White Matte Marble Look Porcelain',
    brand: 'Castille',
    size: '24 x 24 in.',
    sqftPerBox: 15.5,
    priceSqft: 3.19,
    rating: 4.9,
    reviews: 142,
    image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
    ],
    material: 'Porcelain',
    finish: 'Matte',
    peiRating: 'Class 4 - Commercial & Residential',
    dcof: '>= 0.55 (High Slip Resistance)',
    inStock: true,
    stockCount: 2840,
    features: [
      'Large format reduces visible grout lines for modern expanse',
      'Subtle velvet matte finish resists fingerprints and smudges',
      'Safe for shower pans, bathroom floors, and exterior patios'
    ]
  },
  {
    id: '101068831',
    slug: 'emporio-black-hexagon-tile',
    name: 'Emporio Black Marble Look Hexagon Porcelain',
    brand: 'San Giorgio',
    size: '8 x 9 in.',
    sqftPerBox: 10.8,
    priceSqft: 4.29,
    rating: 4.7,
    reviews: 89,
    image: 'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=800&q=80'
    ],
    material: 'Porcelain',
    finish: 'Satin Matte',
    peiRating: 'Class 3 - Residential Floors',
    dcof: '>= 0.50',
    inStock: true,
    stockCount: 1120,
    features: [
      'Dramatic noir hexagon pattern with realistic white calcite veins',
      'Geometric aesthetic perfect for statement powder rooms or kitchen islands',
      'Pre-assembled interlocking layout for straightforward installation'
    ]
  },
  {
    id: '101142263',
    slug: 'artisan-greige-subway-tile',
    name: 'Artisan Greige Handmade Ceramic Subway Tile',
    brand: 'Villa Artisan',
    size: '3 x 12 in.',
    sqftPerBox: 12.0,
    priceSqft: 3.79,
    rating: 4.9,
    reviews: 310,
    image: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80',
    images: [
      'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=800&q=80'
    ],
    material: 'Ceramic',
    finish: 'Glossy Ripple',
    peiRating: 'Class 1 - Wall Only',
    dcof: 'N/A (Wall Application)',
    inStock: true,
    stockCount: 5400,
    features: [
      'Hand-crafted undulating surface reflects light organically',
      'Rich artisanal glaze with subtle tonal variations piece-to-piece',
      'Perfect for kitchen backsplashes and feature shower surrounds'
    ]
  }
];

export default function FloorAndDecorApp() {
  const [currentPage, setCurrentPage] = useState('home');
  const [selectedProductId, setSelectedProductId] = useState('100610781');
  const [cartCount, setCartCount] = useState(2);
  const [cartAlert, setCartAlert] = useState(false);

  const activeProduct = PRODUCTS.find(p => p.id === selectedProductId) || PRODUCTS[0];

  const navigateTo = (page, productId = null) => {
    if (productId) setSelectedProductId(productId);
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const addToCart = (qty = 1) => {
    setCartCount(prev => prev + qty);
    setCartAlert(true);
    setTimeout(() => setCartAlert(false), 3000);
  };

  return (
    <div className="min-h-screen bg-neutral-100 text-[#1f2937] font-sans antialiased flex flex-col selection:bg-[#df4a26] selection:text-white">
      {/* 1. TOP ANNOUNCEMENT BAR */}
      <div className="bg-[#1b2a4a] text-white text-xs px-4 py-2 border-b border-blue-950">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-center md:text-left">
          <div className="flex items-center space-x-3">
            <span className="bg-[#df4a26] font-bold text-[10px] uppercase tracking-wider px-2 py-0.5 rounded">Special Value</span>
            <span>Over 1,000,000+ sq. ft. in-stock flooring ready for same-day job site pickup.</span>
          </div>
          <div className="flex items-center space-x-6 text-neutral-300">
            <button onClick={() => navigateTo('services')} className="hover:text-white flex items-center gap-1 transition">
              <Calendar className="w-3.5 h-3.5 text-[#df4a26]" /> Free Design Appointments
            </button>
            <span className="hidden sm:inline">|</span>
            <span className="hidden sm:flex items-center gap-1 text-neutral-300">
              <Phone className="w-3.5 h-3.5 text-orange-400" /> Pro Support: 877-675-0002
            </span>
          </div>
        </div>
      </div>

      {/* 2. MAIN HEADER & SEARCH */}
      <header className="bg-white sticky top-0 z-40 shadow-sm border-b border-neutral-200">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between gap-4">
          {/* body > div.l-main.ug-everyone.ug-unregistered > header > div.l-header-container.js-header-wrapper > div.l-header-logo */}
          <div className="flex items-center gap-6">
            <div className="l-header-logo flex items-center">
              <button 
                onClick={() => navigateTo('home')} 
                className="l-header-logo-link flex items-center group focus:outline-none py-1"
                title="Floor and Decor: High Quality Flooring and Tile"
              >
                <FloorAndDecorLogo className="l-header-logo-img h-8 sm:h-9 md:h-10 w-auto" />
              </button>
            </div>

            {/* Store Locator Pill */}
            <div className="hidden lg:flex items-center gap-2 pl-4 border-l border-neutral-200 text-xs">
              <MapPin className="w-4 h-4 text-[#df4a26] shrink-0" />
              <div className="text-left leading-tight">
                <div className="font-bold text-[#1b2a4a] flex items-center gap-1">
                  Duluth Superstore <ChevronDown className="w-3 h-3 text-neutral-500" />
                </div>
                <span className="text-neutral-500 text-[11px]">Open Today: 7AM - 9PM</span>
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div className="flex-1 max-w-xl mx-2 relative">
            <div className="relative flex items-center">
              <input
                type="text"
                placeholder="Search tile, wood, vinyl, grout, or SKU..."
                className="w-full bg-neutral-100 border border-neutral-300 text-sm rounded-full pl-4 pr-11 py-2 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#df4a26] focus:border-transparent transition"
              />
              <button 
                onClick={() => navigateTo('plp')} 
                className="absolute right-1 bg-[#df4a26] hover:bg-[#c63a18] text-white p-1.5 rounded-full transition"
                aria-label="Search"
              >
                <Search className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* User & Cart Actions */}
          <div className="flex items-center gap-4 text-xs font-semibold text-neutral-700">
            <button className="hidden sm:flex flex-col items-center hover:text-[#df4a26] transition">
              <User className="w-5 h-5 text-neutral-600 mb-0.5" />
              <span>Sign In</span>
            </button>
            <button 
              onClick={() => navigateTo('inspiration')} 
              className="hidden sm:flex flex-col items-center hover:text-[#df4a26] transition"
            >
              <Heart className="w-5 h-5 text-neutral-600 mb-0.5" />
              <span>Saved</span>
            </button>
            <button 
              onClick={() => navigateTo('pdp')} 
              className="relative flex flex-col items-center hover:text-[#df4a26] transition"
            >
              <div className="relative">
                <ShoppingCart className="w-5 h-5 text-neutral-800" />
                <span className="absolute -top-1.5 -right-2 bg-[#df4a26] text-white text-[10px] font-bold w-4 h-4 rounded-full flex items-center justify-center">
                  {cartCount}
                </span>
              </div>
              <span className="mt-0.5 font-bold text-[#1b2a4a]">Cart</span>
            </button>
          </div>
        </div>

        {/* 3. MEGA-NAV BAR */}
        <nav className="bg-[#ea1722] border-t border-red-700/40 px-4 text-xs font-bold uppercase tracking-wide text-white shadow-inner">
          <div className="max-w-7xl mx-auto flex items-center justify-between overflow-x-auto scrollbar-none py-2.5 gap-6">
            <button 
              onClick={() => navigateTo('plp')} 
              className={`hover:text-white/80 whitespace-nowrap pb-1 border-b-2 transition ${currentPage === 'plp' ? 'border-white text-white font-extrabold' : 'border-transparent text-white/90'}`}
            >
              Tile &amp; Stone
            </button>
            <button 
              onClick={() => navigateTo('plp')} 
              className="hover:text-white/80 whitespace-nowrap pb-1 border-b-2 border-transparent text-white/90 transition"
            >
              Wood Flooring
            </button>
            <button 
              onClick={() => navigateTo('plp')} 
              className="hover:text-white/80 whitespace-nowrap pb-1 border-b-2 border-transparent text-white/90 transition"
            >
              Laminate &amp; Vinyl
            </button>
            <button 
              onClick={() => navigateTo('pdp')} 
              className={`hover:text-white/80 whitespace-nowrap pb-1 border-b-2 transition ${currentPage === 'pdp' ? 'border-white text-white font-extrabold' : 'border-transparent text-white/90'}`}
            >
              Featured Product (PDP)
            </button>
            <button 
              onClick={() => navigateTo('inspiration')} 
              className={`hover:text-white/80 whitespace-nowrap pb-1 border-b-2 transition ${currentPage === 'inspiration' ? 'border-white text-white font-extrabold' : 'border-transparent text-white/90'}`}
            >
              Inspiration &amp; Rooms
            </button>
            <button 
              onClick={() => navigateTo('services')} 
              className={`hover:text-white/80 whitespace-nowrap pb-1 border-b-2 transition ${currentPage === 'services' ? 'border-white text-white font-extrabold' : 'border-transparent text-white/90'}`}
            >
              Free Design Services
            </button>
            <div className="ml-auto hidden md:flex items-center gap-1.5 text-white bg-black/20 hover:bg-black/30 px-3 py-1 rounded-full text-xs font-semibold cursor-pointer transition">
              <Sparkles className="w-3.5 h-3.5 text-amber-300" /> Room Visualizer Tool
            </div>
          </div>
        </nav>
      </header>

      {/* FLOATING CART ALERT */}
      {cartAlert && (
        <div className="fixed bottom-6 right-6 z-50 bg-[#1b2a4a] text-white px-5 py-3 rounded-lg shadow-2xl flex items-center gap-3 border-2 border-[#df4a26] animate-bounce">
          <Check className="w-5 h-5 text-emerald-400" />
          <div>
            <p className="font-bold text-sm">Product added to cart!</p>
            <p className="text-xs text-neutral-300">Reserved for pickup at Duluth store.</p>
          </div>
        </div>
      )}

      {/* --- PAGE ROUTING --- */}
      <main className="flex-1">
        {currentPage === 'home' && (
          <HomePage 
            onNavigate={navigateTo} 
            categories={CATEGORIES} 
            products={PRODUCTS} 
          />
        )}

        {currentPage === 'plp' && (
          <CategoryPage 
            onNavigate={navigateTo} 
            products={PRODUCTS} 
          />
        )}

        {currentPage === 'pdp' && (
          <ProductDetailPage 
            product={activeProduct} 
            onAddToCart={addToCart} 
            onNavigate={navigateTo} 
          />
        )}

        {currentPage === 'inspiration' && (
          <InspirationPage 
            onNavigate={navigateTo} 
          />
        )}

        {currentPage === 'services' && (
          <DesignServicesPage 
            onNavigate={navigateTo} 
          />
        )}
      </main>

      {/* 4. FOOTER */}
      <footer className="text-neutral-700 text-sm mt-16 border-t border-neutral-300">
        <div className="max-w-7xl mx-auto px-4 py-12 grid grid-cols-1 md:grid-cols-4 gap-8">
          <div>
            <div className="mb-4">
              <FloorAndDecorLogo className="h-8 w-auto" light={false} />
            </div>
            <p className="text-xs text-neutral-600 mb-4 leading-relaxed">
              Leading specialty retailer of hard surface flooring, offering warehouse pricing on porcelain, ceramic, natural stone, luxury vinyl, and solid hardwood.
            </p>
            <div className="text-xs text-neutral-500 space-y-1">
              <p>📍 280+ Superstore Showrooms nationwide</p>
              <p>📦 Job-lot quantities stocked in-store today</p>
            </div>
          </div>

          <div>
            <h4 className="text-[#1b2a4a] font-bold uppercase tracking-wider text-xs mb-3">Customer Support</h4>
            <ul className="text-xs space-y-2 text-neutral-600">
              <li><button onClick={() => navigateTo('services')} className="hover:text-[#df4a26] transition">Book Free Design Appointment</button></li>
              <li><button onClick={() => navigateTo('pdp')} className="hover:text-[#df4a26] transition">Order Product Samples</button></li>
              <li><a href="#track" className="hover:text-[#df4a26] transition">Track Store Pickup Order</a></li>
              <li><a href="#returns" className="hover:text-[#df4a26] transition">90-Day Money Back Guarantee</a></li>
              <li><a href="#pro" className="hover:text-[#df4a26] transition">PRO Premier Loyalty Rewards</a></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#1b2a4a] font-bold uppercase tracking-wider text-xs mb-3">Shop Departments</h4>
            <ul className="text-xs space-y-2 text-neutral-600">
              <li><button onClick={() => navigateTo('plp')} className="hover:text-[#df4a26] transition">Porcelain &amp; Ceramic Tile</button></li>
              <li><button onClick={() => navigateTo('plp')} className="hover:text-[#df4a26] transition">Waterproof Luxury Vinyl Plank</button></li>
              <li><button onClick={() => navigateTo('plp')} className="hover:text-[#df4a26] transition">Solid &amp; Engineered Hardwood</button></li>
              <li><button onClick={() => navigateTo('plp')} className="hover:text-[#df4a26] transition">Marble &amp; Natural Stone</button></li>
              <li><button onClick={() => navigateTo('plp')} className="hover:text-[#df4a26] transition">Mortar, Grout &amp; Leveler</button></li>
            </ul>
          </div>

          <div>
            <h4 className="text-[#1b2a4a] font-bold uppercase tracking-wider text-xs mb-3">Floor &amp; Decor Demo Architecture</h4>
            <div className="bg-white p-3 rounded border border-neutral-200 text-xs shadow-sm">
              <p className="font-semibold text-[#df4a26] mb-1">Built with Optimizely CMS &amp; Next.js</p>
              <p className="text-neutral-500 text-[11px] leading-relaxed">
                Demonstrates Optimizely Universal Component taxonomy (Hero, Media, Facet Filters, Room Pin Hotspots, &amp; Box Calculator).
              </p>
            </div>
          </div>
        </div>

        <div className="py-4 text-center text-xs text-neutral-500 border-t border-neutral-200">
          <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
            <span>© 2026 Floor &amp; Decor Holdings, Inc. All rights reserved.</span>
            <div className="flex gap-4">
              <span>Privacy Policy</span>
              <span>Terms of Sale</span>
              <span>California Supply Chains Act</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}

// ==========================================
// 1. HOMEPAGE VIEW COMPONENT
// ==========================================
function HomePage({ onNavigate, categories, products }) {
  const heroImg = "https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80";
  const consultImg = "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=900&q=80";

  return (
    <div className="space-y-10">
      {/* HERO BANNER SECTION */}
      <section className="relative bg-neutral-900 text-white overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img 
            src={heroImg} 
            alt="Designer Living Room Flooring" 
            className="w-full h-full object-cover opacity-35"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-[#1b2a4a]/95 via-[#1b2a4a]/70 to-transparent" />
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-4 py-16 md:py-24 flex flex-col items-start max-w-2xl">
          <span className="bg-[#df4a26] text-white text-xs font-black tracking-widest uppercase px-3 py-1 rounded mb-4">
            Spring Home Remodel Event
          </span>
          <h1 className="text-3xl sm:text-5xl font-black tracking-tight leading-tight mb-4">
            High Quality Flooring &amp; Tile. Everyday Low Prices.
          </h1>
          <p className="text-neutral-200 text-base sm:text-lg mb-8 leading-relaxed">
            Shop warehouse-direct savings with massive in-stock quantities. Bring your floor plan or meet with our dedicated design experts for free.
          </p>
          <div className="flex flex-wrap gap-4">
            <button 
              onClick={() => onNavigate('plp')} 
              className="bg-[#df4a26] hover:bg-[#c63a18] text-white font-bold px-7 py-3.5 rounded shadow-lg flex items-center gap-2 transition"
            >
              Shop All Tile &amp; Stone <ArrowRight className="w-4 h-4" />
            </button>
            <button 
              onClick={() => onNavigate('services')} 
              className="bg-white hover:bg-neutral-100 text-[#1b2a4a] font-bold px-7 py-3.5 rounded shadow-lg flex items-center gap-2 transition"
            >
              Book Free Design Consult
            </button>
          </div>
        </div>
      </section>

      {/* VALUE PROPOSITION BAR */}
      <section className="max-w-7xl mx-auto px-4 -mt-6 relative z-20">
        <div className="bg-white rounded-lg shadow-md border border-neutral-200 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-neutral-200">
          <div className="p-4 flex items-center gap-3">
            <Store className="w-8 h-8 text-[#df4a26] shrink-0" />
            <div>
              <h4 className="font-bold text-xs uppercase text-[#1b2a4a]">Massive In-Stock</h4>
              <p className="text-[11px] text-neutral-500">Pick up your entire project today</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-3">
            <Calendar className="w-8 h-8 text-[#df4a26] shrink-0" />
            <div>
              <h4 className="font-bold text-xs uppercase text-[#1b2a4a]">Free Design Services</h4>
              <p className="text-[11px] text-neutral-500">1-on-1 expert 3D room planning</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-3">
            <Truck className="w-8 h-8 text-[#df4a26] shrink-0" />
            <div>
              <h4 className="font-bold text-xs uppercase text-[#1b2a4a]">Job-Site Delivery</h4>
              <p className="text-[11px] text-neutral-500">Flat-rate curbside freight options</p>
            </div>
          </div>
          <div className="p-4 flex items-center gap-3">
            <ShieldCheck className="w-8 h-8 text-[#df4a26] shrink-0" />
            <div>
              <h4 className="font-bold text-xs uppercase text-[#1b2a4a]">PRO Preferred</h4>
              <p className="text-[11px] text-neutral-500">Commercial credit &amp; volume tiers</p>
            </div>
          </div>
        </div>
      </section>

      {/* CORE CATEGORIES GRID */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-end justify-between mb-6 border-b border-neutral-200 pb-3">
          <div>
            <h2 className="text-2xl font-black tracking-tight text-[#1b2a4a]">Explore by Category</h2>
            <p className="text-xs text-neutral-500 mt-1">First-quality porcelain, solid hardwood, waterproof vinyl, and stone.</p>
          </div>
          <button onClick={() => onNavigate('plp')} className="text-[#df4a26] font-bold text-xs flex items-center gap-1 hover:underline">
            View All Categories <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {categories.map((cat) => (
            <div 
              key={cat.id} 
              onClick={() => onNavigate('plp')}
              className="group cursor-pointer bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-lg transition flex flex-col"
            >
              <div className="h-32 overflow-hidden relative">
                <img 
                  src={cat.image} 
                  alt={cat.name} 
                  className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
                />
                <span className="absolute top-2 left-2 bg-[#1b2a4a]/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
                  {cat.badge}
                </span>
              </div>
              <div className="p-3 text-center flex-1 flex items-center justify-center">
                <h3 className="font-bold text-xs text-[#1b2a4a] group-hover:text-[#df4a26] transition">
                  {cat.name}
                </h3>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED BESTSELLERS */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between mb-6 border-b border-neutral-200 pb-3">
          <div>
            <span className="text-xs font-bold text-[#df4a26] uppercase">Top Rated Customer Favorites</span>
            <h2 className="text-2xl font-black tracking-tight text-[#1b2a4a]">In-Stock Best Sellers</h2>
          </div>
          <button onClick={() => onNavigate('plp')} className="text-[#df4a26] font-bold text-xs flex items-center gap-1 hover:underline">
            Shop Catalog <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {products.map((prod) => (
            <ProductCard 
              key={prod.id} 
              product={prod} 
              onSelect={() => onNavigate('pdp', prod.id)} 
            />
          ))}
        </div>
      </section>

      {/* EDITORIAL PROMO SPLIT */}
      <section className="max-w-7xl mx-auto px-4">
        <div className="bg-[#1b2a4a] text-white rounded-xl overflow-hidden grid grid-cols-1 lg:grid-cols-2 shadow-xl">
          <div className="p-8 sm:p-12 flex flex-col justify-center">
            <span className="text-[#df4a26] font-bold text-xs uppercase tracking-widest mb-2 flex items-center gap-1">
              <Sparkles className="w-4 h-4" /> Interactive Design Center
            </span>
            <h3 className="text-3xl font-black mb-4">Never Design Alone. Free In-Store &amp; Virtual Services.</h3>
            <p className="text-neutral-300 text-sm mb-6 leading-relaxed">
              Work with our experienced design team to curate palettes, draft 3D project layouts, and accurately estimate materials so you don't overspend.
            </p>
            <div className="space-y-3 mb-8 text-xs text-neutral-200">
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#df4a26]" /> Bring your paint swatches &amp; floorplans
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#df4a26]" /> Walk the warehouse sales floor with your dedicated designer
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-4 h-4 text-[#df4a26]" /> Leave with takeoff estimates and complimentary physical samples
              </div>
            </div>
            <button 
              onClick={() => onNavigate('services')} 
              className="bg-[#df4a26] hover:bg-[#c63a18] text-white font-bold py-3 px-6 rounded text-sm w-fit transition shadow-md"
            >
              Schedule Your Appointment Now
            </button>
          </div>
          <div className="h-72 lg:h-auto relative">
            <img 
              src={consultImg} 
              alt="Design consultation session" 
              className="w-full h-full object-cover"
            />
          </div>
        </div>
      </section>
    </div>
  );
}

// ==========================================
// 2. PRODUCT LISTING (PLP) COMPONENT
// ==========================================
function CategoryPage({ onNavigate, products }) {
  const [selectedMaterial, setSelectedMaterial] = useState('All');
  const [sortOption, setSortOption] = useState('featured');

  const filtered = products.filter(p => {
    if (selectedMaterial === 'All') return true;
    return p.material === selectedMaterial;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="text-xs text-neutral-500 mb-4 flex items-center gap-1">
        <button onClick={() => onNavigate('home')} className="hover:underline">Home</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#1b2a4a] font-bold">Porcelain &amp; Ceramic Tile Flooring</span>
      </div>

      {/* Category Header */}
      <div className="border-b border-neutral-300 pb-6 mb-6">
        <h1 className="text-3xl font-black text-[#1b2a4a] tracking-tight">Tile Flooring &amp; Wall Tile</h1>
        <p className="text-neutral-600 text-xs sm:text-sm mt-2 max-w-4xl leading-relaxed">
          Discover our vast selection of in-stock porcelain, ceramic, natural stone, and glass tile. Whether you're remodeling a luxury primary shower, styling a kitchen backsplash, or installing high-traffic commercial grade tile, we offer warehouse-direct prices backed by huge quantities.
        </p>

        {/* Sub-Category Visual Filters */}
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3 mt-6">
          {['Marble Look', 'Wood Look', 'Subway Tile', 'Hexagon', 'Large Format', 'Outdoor Pavers'].map((sub, idx) => (
            <div 
              key={idx} 
              className="bg-white border border-neutral-200 hover:border-[#df4a26] rounded-md p-2.5 text-center cursor-pointer transition shadow-sm hover:shadow"
            >
              <span className="block text-xs font-bold text-[#1b2a4a]">{sub}</span>
              <span className="block text-[10px] text-neutral-500">In Stock Now</span>
            </div>
          ))}
        </div>
      </div>

      {/* Main Content: Facets & Product Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Facet Sidebar */}
        <aside className="space-y-6">
          <div className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm">
            <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
              <span className="font-bold text-xs uppercase text-[#1b2a4a] flex items-center gap-1.5">
                <SlidersHorizontal className="w-4 h-4 text-[#df4a26]" /> Filter Products
              </span>
              <button 
                onClick={() => setSelectedMaterial('All')} 
                className="text-[11px] text-[#df4a26] hover:underline"
              >
                Reset
              </button>
            </div>

            {/* Material Filter */}
            <div className="mb-5">
              <h4 className="font-bold text-xs text-[#1b2a4a] mb-2 uppercase">Material</h4>
              <div className="space-y-1.5 text-xs">
                {['All', 'Porcelain', 'Ceramic'].map(mat => (
                  <label key={mat} className="flex items-center gap-2 cursor-pointer text-neutral-700 hover:text-black">
                    <input 
                      type="radio" 
                      name="material" 
                      checked={selectedMaterial === mat} 
                      onChange={() => setSelectedMaterial(mat)}
                      className="text-[#df4a26] focus:ring-[#df4a26]"
                    />
                    <span>{mat === 'All' ? 'All Materials' : mat}</span>
                  </label>
                ))}
              </div>
            </div>

            {/* In-Stock Filter */}
            <div className="mb-5">
              <h4 className="font-bold text-xs text-[#1b2a4a] mb-2 uppercase">Availability</h4>
              <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer">
                <input type="checkbox" defaultChecked className="rounded text-[#df4a26] focus:ring-[#df4a26]" />
                <span>In-Stock at Duluth Superstore</span>
              </label>
            </div>

            {/* Look & Style */}
            <div className="mb-5">
              <h4 className="font-bold text-xs text-[#1b2a4a] mb-2 uppercase">Visual Look</h4>
              <div className="space-y-1.5 text-xs text-neutral-700">
                <label className="flex items-center gap-2"><input type="checkbox" defaultChecked /> Marble Look</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> Wood Look</label>
                <label className="flex items-center gap-2"><input type="checkbox" /> Concrete / Industrial</label>
              </div>
            </div>

            {/* Slip Resistance (DCOF) */}
            <div>
              <h4 className="font-bold text-xs text-[#1b2a4a] mb-2 uppercase">Slip Resistance (DCOF)</h4>
              <p className="text-[10px] text-neutral-500 mb-2">Required &gt;= 0.42 for level interior wet walking surfaces.</p>
              <label className="flex items-center gap-2 text-xs text-neutral-700">
                <input type="checkbox" /> High Traction (&gt;= 0.55)
              </label>
            </div>
          </div>
        </aside>

        {/* Product Cards */}
        <div className="lg:col-span-3">
          <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-lg border border-neutral-200">
            <span className="text-xs text-neutral-600 font-semibold">
              Showing <strong className="text-[#1b2a4a]">{filtered.length}</strong> items in Tile
            </span>
            <div className="flex items-center gap-2 text-xs">
              <span className="text-neutral-500">Sort By:</span>
              <select 
                value={sortOption} 
                onChange={(e) => setSortOption(e.target.value)}
                className="bg-neutral-50 border border-neutral-300 rounded px-2 py-1 text-xs font-semibold focus:outline-none focus:ring-1 focus:ring-[#df4a26]"
              >
                <option value="featured">Featured &amp; Best Sellers</option>
                <option value="price-asc">Price: Low to High</option>
                <option value="price-desc">Price: High to Low</option>
                <option value="rating">Highest Customer Rating</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
            {filtered.map(product => (
              <ProductCard 
                key={product.id} 
                product={product} 
                onSelect={() => onNavigate('pdp', product.id)} 
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 3. PRODUCT DETAIL PAGE (PDP) WITH CALCULATOR
// ==========================================
function ProductDetailPage({ product, onAddToCart, onNavigate }) {
  const [selectedImg, setSelectedImg] = useState(0);
  const [roomSqft, setRoomSqft] = useState(120);
  const [addWaste, setAddWaste] = useState(true);

  // Sqft & Box Calculations
  const effectiveSqft = addWaste ? Math.ceil(roomSqft * 1.1) : roomSqft;
  const boxesNeeded = Math.ceil(effectiveSqft / product.sqftPerBox);
  const totalCost = (boxesNeeded * product.sqftPerBox * product.priceSqft).toFixed(2);
  const totalActualSqft = (boxesNeeded * product.sqftPerBox).toFixed(1);

  return (
    <div className="max-w-7xl mx-auto px-4 py-6">
      {/* Breadcrumb */}
      <div className="text-xs text-neutral-500 mb-4 flex items-center gap-1">
        <button onClick={() => onNavigate('home')} className="hover:underline">Home</button>
        <ChevronRight className="w-3 h-3" />
        <button onClick={() => onNavigate('plp')} className="hover:underline">Porcelain Tile</button>
        <ChevronRight className="w-3 h-3" />
        <span className="text-[#1b2a4a] font-bold">{product.name}</span>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
        {/* GALLERY COLUMN (7 COLS) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="h-96 md:h-[480px] rounded-lg overflow-hidden border border-neutral-200 relative bg-neutral-100">
            <img 
              src={product.images[selectedImg] || product.image} 
              alt={product.name} 
              className="w-full h-full object-cover"
            />
            <span className="absolute top-3 left-3 bg-[#1b2a4a] text-white text-xs font-bold px-2.5 py-1 rounded">
              SKU: {product.id}
            </span>
            <button className="absolute bottom-3 right-3 bg-white/90 hover:bg-white text-[#1b2a4a] text-xs font-bold px-3 py-1.5 rounded shadow flex items-center gap-1">
              <Sparkles className="w-4 h-4 text-[#df4a26]" /> View in Your Room
            </button>
          </div>

          {/* Thumbnails */}
          <div className="flex gap-3">
            {product.images.map((img, i) => (
              <button 
                key={i} 
                onClick={() => setSelectedImg(i)}
                className={`w-20 h-20 rounded border-2 overflow-hidden transition ${selectedImg === i ? 'border-[#df4a26] ring-2 ring-[#df4a26]/30' : 'border-neutral-200 opacity-70 hover:opacity-100'}`}
              >
                <img src={img} alt="Thumbnail" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>

          {/* PRO & DIY Features */}
          <div className="mt-8 pt-6 border-t border-neutral-200">
            <h3 className="font-bold text-sm text-[#1b2a4a] uppercase tracking-wide mb-3">Product Overview &amp; Specs</h3>
            <ul className="space-y-2 text-xs text-neutral-700">
              {product.features.map((feat, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-[#df4a26] shrink-0 mt-0.5" />
                  <span>{feat}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* PURCHASE & CALCULATOR COLUMN (5 COLS) */}
        <div className="lg:col-span-5 flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
              <span className="font-bold text-[#df4a26] uppercase tracking-wider">{product.brand}</span>
              <div className="flex items-center gap-1">
                <div className="flex text-amber-400">
                  {[...Array(5)].map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span className="text-neutral-700 font-bold">({product.reviews})</span>
              </div>
            </div>

            <h1 className="text-2xl font-black text-[#1b2a4a] leading-tight mb-2">{product.name}</h1>
            <p className="text-xs text-neutral-500 mb-4">Nominal Size: <strong className="text-neutral-800">{product.size}</strong></p>

            {/* Price Display */}
            <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 mb-6">
              <div className="flex items-baseline gap-2">
                <span className="text-3xl font-black text-[#df4a26]">${product.priceSqft.toFixed(2)}</span>
                <span className="text-xs font-bold text-neutral-600 uppercase">/ sq. ft.</span>
              </div>
              <p className="text-xs text-neutral-500 mt-1">
                ${(product.priceSqft * product.sqftPerBox).toFixed(2)} / Box ({product.sqftPerBox} sq. ft. per box)
              </p>
            </div>

            {/* SQUARE FOOTAGE & BOX CALCULATOR WIDGET */}
            <div className="bg-orange-50/70 border border-orange-200 rounded-lg p-4 mb-6">
              <div className="flex items-center justify-between mb-3">
                <span className="font-bold text-xs uppercase text-[#1b2a4a] flex items-center gap-1">
                  <Layers className="w-4 h-4 text-[#df4a26]" /> Project Square Footage Calculator
                </span>
                <span className="text-[11px] text-neutral-500">Auto-Box Rounding</span>
              </div>

              <div className="grid grid-cols-2 gap-3 mb-3">
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">Room Area (sq. ft.)</label>
                  <input 
                    type="number" 
                    min="1" 
                    value={roomSqft}
                    onChange={(e) => setRoomSqft(Math.max(1, parseInt(e.target.value) || 1))}
                    className="w-full bg-white border border-neutral-300 rounded px-3 py-1.5 text-sm font-bold text-[#1b2a4a] focus:ring-1 focus:ring-[#df4a26]"
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-neutral-700 mb-1">Recommended Boxes</label>
                  <div className="bg-white border border-neutral-200 rounded px-3 py-1.5 text-sm font-extrabold text-[#df4a26]">
                    {boxesNeeded} Boxes
                  </div>
                </div>
              </div>

              {/* 10% Waste Buffer Option */}
              <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer select-none">
                <input 
                  type="checkbox" 
                  checked={addWaste} 
                  onChange={(e) => setAddWaste(e.target.checked)}
                  className="rounded text-[#df4a26] focus:ring-[#df4a26]"
                />
                <span className="font-semibold">Add +10% overage for cuts, pattern waste &amp; attic stock</span>
              </label>

              <div className="mt-3 pt-3 border-t border-orange-200 flex justify-between text-xs">
                <span className="text-neutral-600">Total Material Delivered:</span>
                <span className="font-bold text-[#1b2a4a]">{totalActualSqft} sq. ft.</span>
              </div>
              <div className="flex justify-between text-xs mt-1">
                <span className="text-neutral-600">Estimated Total Cost:</span>
                <span className="font-extrabold text-sm text-[#df4a26]">${totalCost}</span>
              </div>
            </div>

            {/* In Store Availability */}
            <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded mb-6">
              <Store className="w-4 h-4 text-emerald-600 shrink-0" />
              <span>
                <strong>In Stock:</strong> {product.stockCount.toLocaleString()} sq. ft. available for pickup at Duluth Superstore
              </span>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button 
                onClick={() => onAddToCart(boxesNeeded)}
                className="w-full bg-[#df4a26] hover:bg-[#c63a18] text-white font-bold py-3.5 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 transition text-sm"
              >
                <ShoppingCart className="w-4 h-4" /> Add {boxesNeeded} Boxes to Cart (${totalCost})
              </button>
              
              <div className="grid grid-cols-2 gap-3">
                <button 
                  onClick={() => onAddToCart(1)} 
                  className="bg-white hover:bg-neutral-50 text-[#1b2a4a] border border-neutral-300 font-bold py-2.5 rounded text-xs transition"
                >
                  Order $3.00 Sample Piece
                </button>
                <button 
                  onClick={() => onNavigate('services')} 
                  className="bg-[#1b2a4a] hover:bg-[#121c33] text-white font-bold py-2.5 rounded text-xs transition flex items-center justify-center gap-1"
                >
                  <Calendar className="w-3.5 h-3.5" /> Book Free Design Help
                </button>
              </div>
            </div>
          </div>

          {/* Quick Technical Summary Table */}
          <div className="mt-8 pt-4 border-t border-neutral-200 text-xs">
            <h4 className="font-bold text-[#1b2a4a] mb-2 uppercase">Technical Specifications</h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] bg-neutral-50 p-3 rounded">
              <div><span className="text-neutral-500">Material:</span> <strong className="text-neutral-800">{product.material}</strong></div>
              <div><span className="text-neutral-500">Surface Finish:</span> <strong className="text-neutral-800">{product.finish}</strong></div>
              <div><span className="text-neutral-500">PEI Rating:</span> <strong className="text-neutral-800">{product.peiRating}</strong></div>
              <div><span className="text-neutral-500">Slip Resistance:</span> <strong className="text-neutral-800">{product.dcof}</strong></div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// 4. INSPIRATION / SHOP THE LOOK COMPONENT
// ==========================================
function InspirationPage({ onNavigate }) {
  const [activePin, setActivePin] = useState(0);

  const LOOKS = [
    {
      title: 'Modern Organic Primary Bathroom',
      designer: 'Kelly M. - Floor & Decor Designer (Austin Studio)',
      image: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1200&q=80',
      description: 'A serene spa sanctuary combining large format 24x24 Venato White marble-look porcelain with brushed brass plumbing and fluted white oak vanities.',
      items: [
        { id: '100610781', label: 'Main Floor & Shower Wall', name: 'Venato White 12x24 Porcelain', price: '$2.49/sq.ft.' },
        { id: '101142263', label: 'Vanity Backsplash', name: 'Artisan Greige 3x12 Subway', price: '$3.79/sq.ft.' },
        { id: '101068831', label: 'Shower Pan Accent Floor', name: 'Emporio Black Hexagon', price: '$4.29/sq.ft.' },
      ]
    }
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto mb-10">
        <span className="text-xs font-bold text-[#df4a26] uppercase tracking-widest">Floor &amp; Decor Lookbook</span>
        <h1 className="text-3xl sm:text-4xl font-black text-[#1b2a4a] mt-1 mb-3">Shop Curated Real-Home Projects</h1>
        <p className="text-neutral-600 text-sm leading-relaxed">
          See how professional interior designers and DIY homeowners bring entire spaces together. Click any product in the room scene to view tile specifications and calculate required cartons.
        </p>
      </div>

      {LOOKS.map((look, idx) => (
        <div key={idx} className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-12 mb-12">
          {/* Main Visual with Hotspot Callouts */}
          <div className="lg:col-span-8 relative h-96 lg:h-[520px]">
            <img 
              src={look.image} 
              alt={look.title} 
              className="w-full h-full object-cover"
            />
            
            {/* Interactive Pins */}
            <div className="absolute top-1/3 left-1/4">
              <button 
                onClick={() => setActivePin(0)}
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-transform ${activePin === 0 ? 'bg-[#df4a26] text-white scale-125 ring-4 ring-white' : 'bg-white text-[#1b2a4a] hover:scale-110'}`}
              >
                1
              </button>
            </div>

            <div className="absolute top-1/2 right-1/3">
              <button 
                onClick={() => setActivePin(1)}
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-transform ${activePin === 1 ? 'bg-[#df4a26] text-white scale-125 ring-4 ring-white' : 'bg-white text-[#1b2a4a] hover:scale-110'}`}
              >
                2
              </button>
            </div>

            <div className="absolute bottom-1/4 left-1/2">
              <button 
                onClick={() => setActivePin(2)}
                className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-transform ${activePin === 2 ? 'bg-[#df4a26] text-white scale-125 ring-4 ring-white' : 'bg-white text-[#1b2a4a] hover:scale-110'}`}
              >
                3
              </button>
            </div>
          </div>

          {/* Shop The Look Sidebar */}
          <div className="lg:col-span-4 p-6 flex flex-col justify-between bg-neutral-50">
            <div>
              <span className="text-[11px] font-bold text-[#df4a26] uppercase">Curated Room Scheme</span>
              <h3 className="text-xl font-black text-[#1b2a4a] mt-1 mb-2">{look.title}</h3>
              <p className="text-xs text-neutral-500 mb-6 italic">{look.designer}</p>
              
              <h4 className="text-xs font-bold text-[#1b2a4a] uppercase tracking-wide mb-3">Products In This Design:</h4>
              <div className="space-y-3">
                {look.items.map((item, i) => (
                  <div 
                    key={item.id} 
                    onClick={() => setActivePin(i)}
                    className={`p-3 rounded-lg border cursor-pointer transition ${activePin === i ? 'bg-white border-[#df4a26] shadow-sm ring-1 ring-[#df4a26]' : 'bg-white/60 border-neutral-200 hover:bg-white'}`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-bold bg-[#1b2a4a] text-white px-1.5 py-0.5 rounded">Pin #{i + 1}</span>
                      <span className="font-extrabold text-xs text-[#df4a26]">{item.price}</span>
                    </div>
                    <p className="font-bold text-xs text-[#1b2a4a] mt-1">{item.name}</p>
                    <p className="text-[11px] text-neutral-500">{item.label}</p>
                  </div>
                ))}
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-neutral-200">
              <button 
                onClick={() => onNavigate('pdp', look.items[activePin].id)}
                className="w-full bg-[#df4a26] hover:bg-[#c63a18] text-white font-bold py-2.5 px-4 rounded text-xs transition flex items-center justify-center gap-1"
              >
                View Selected Product Details <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

// ==========================================
// 5. FREE DESIGN SERVICES COMPONENT
// ==========================================
function DesignServicesPage({ onNavigate }) {
  const [submitted, setSubmitted] = useState(false);
  const designStudioImg = "https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80";

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Hero Service Banner */}
      <div className="bg-[#1b2a4a] text-white rounded-xl p-8 sm:p-12 mb-10 shadow-xl grid grid-cols-1 md:grid-cols-2 gap-8 items-center">
        <div>
          <span className="bg-[#df4a26] text-white text-[10px] font-black uppercase px-2.5 py-1 rounded">
            100% Free Consultations
          </span>
          <h1 className="text-3xl sm:text-4xl font-black mt-3 mb-4 tracking-tight">
            Bring Your Dream Space to Life with a Floor &amp; Decor Designer
          </h1>
          <p className="text-neutral-200 text-sm leading-relaxed mb-6">
            From coordinating kitchen backsplash tile to laying out an entire home renovation, our certified design professionals provide personalized advice, custom 3D visualization, and complete product material takeoffs—all completely free.
          </p>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-1.5 text-amber-300 font-bold">
              <Star className="w-4 h-4 fill-current" /> 4.9/5 Average Designer Rating
            </div>
            <span>•</span>
            <span className="text-neutral-300">Over 250,000+ rooms completed</span>
          </div>
        </div>

        <div className="h-64 sm:h-80 rounded-lg overflow-hidden border border-blue-900 shadow-inner">
          <img 
            src={designStudioImg} 
            alt="Designer reviewing tile layout" 
            className="w-full h-full object-cover"
          />
        </div>
      </div>

      {/* 3 Step Process */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm text-center">
          <div className="w-10 h-10 bg-[#df4a26]/10 text-[#df4a26] font-black rounded-full flex items-center justify-center mx-auto mb-3">1</div>
          <h3 className="font-bold text-sm text-[#1b2a4a] mb-2">Book Online or Walk In</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Reserve a 45-minute 1-on-1 session at your nearest superstore or choose a virtual consultation from home.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm text-center">
          <div className="w-10 h-10 bg-[#df4a26]/10 text-[#df4a26] font-black rounded-full flex items-center justify-center mx-auto mb-3">2</div>
          <h3 className="font-bold text-sm text-[#1b2a4a] mb-2">Explore the Showroom Together</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Walk the warehouse aisles with your designer to compare full-scale porcelain slabs, hardwoods, and mosaic trims under store lighting.
          </p>
        </div>

        <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm text-center">
          <div className="w-10 h-10 bg-[#df4a26]/10 text-[#df4a26] font-black rounded-full flex items-center justify-center mx-auto mb-3">3</div>
          <h3 className="font-bold text-sm text-[#1b2a4a] mb-2">Receive Your Full Project Takeoff</h3>
          <p className="text-xs text-neutral-600 leading-relaxed">
            Walk away with custom 3D renderings, exact carton quantities, adhesive and grout specs, and take-home physical samples.
          </p>
        </div>
      </div>

      {/* Booking Form Widget */}
      <div className="max-w-2xl mx-auto bg-white p-8 rounded-xl border border-neutral-200 shadow-md">
        <h2 className="text-xl font-black text-[#1b2a4a] mb-2 text-center">Schedule Your Free Design Appointment</h2>
        <p className="text-xs text-neutral-500 mb-6 text-center">Select your local showroom and preferred project focus.</p>

        {submitted ? (
          <div className="bg-emerald-50 border border-emerald-300 p-6 rounded-lg text-center">
            <Check className="w-10 h-10 text-emerald-600 mx-auto mb-2" />
            <h4 className="font-bold text-emerald-900 text-sm">Appointment Requested!</h4>
            <p className="text-xs text-emerald-700 mt-1">
              A designer from the Duluth Superstore will contact you shortly to confirm your consultation time and 3D design brief.
            </p>
            <button 
              onClick={() => onNavigate('home')} 
              className="mt-4 bg-[#1b2a4a] text-white text-xs font-bold py-2 px-4 rounded"
            >
              Return to Catalog
            </button>
          </div>
        ) : (
          <form onSubmit={(e) => { e.preventDefault(); setSubmitted(true); }} className="space-y-4 text-xs">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">First &amp; Last Name</label>
                <input required type="text" placeholder="Jane Doe" className="w-full border border-neutral-300 rounded p-2 focus:ring-1 focus:ring-[#df4a26]" />
              </div>
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Email Address</label>
                <input required type="email" placeholder="jane@example.com" className="w-full border border-neutral-300 rounded p-2 focus:ring-1 focus:ring-[#df4a26]" />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Showroom Location</label>
                <select className="w-full border border-neutral-300 rounded p-2 bg-neutral-50">
                  <option>Duluth Superstore (Atlanta, GA)</option>
                  <option>Kennesaw Superstore (Atlanta, GA)</option>
                  <option>Dallas / Fort Worth Design Studio (TX)</option>
                  <option>Online Virtual Video Session</option>
                </select>
              </div>
              <div>
                <label className="block font-bold text-neutral-700 mb-1">Project Focus</label>
                <select className="w-full border border-neutral-300 rounded p-2 bg-neutral-50">
                  <option>Primary Bathroom &amp; Shower</option>
                  <option>Kitchen Floors &amp; Backsplash</option>
                  <option>Whole House Flooring (Wood/Vinyl)</option>
                  <option>Outdoor Living &amp; Patio Pavers</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block font-bold text-neutral-700 mb-1">Estimated Square Footage</label>
              <input type="text" placeholder="e.g. 250 sq. ft." className="w-full border border-neutral-300 rounded p-2" />
            </div>

            <button 
              type="submit" 
              className="w-full bg-[#df4a26] hover:bg-[#c63a18] text-white font-bold py-3 rounded text-sm transition mt-2 shadow"
            >
              Confirm Consultation Request
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ==========================================
// REUSABLE SUB-COMPONENTS
// ==========================================
function ProductCard({ product, onSelect }) {
  return (
    <div 
      onClick={onSelect}
      className="group cursor-pointer bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-xl hover:border-neutral-300 transition flex flex-col justify-between"
    >
      <div>
        <div className="h-48 overflow-hidden relative bg-neutral-100">
          <img 
            src={product.image} 
            alt={product.name} 
            className="w-full h-full object-cover group-hover:scale-105 transition duration-300"
          />
          <span className="absolute top-2 left-2 bg-white/95 text-[#1b2a4a] text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
            {product.brand}
          </span>
          {product.inStock && (
            <span className="absolute bottom-2 left-2 bg-emerald-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
              In Stock Duluth
            </span>
          )}
        </div>

        <div className="p-4">
          <div className="flex items-center gap-1 text-amber-400 text-xs mb-1">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-neutral-700 font-bold text-[11px]">{product.rating}</span>
            <span className="text-neutral-400 text-[10px]">({product.reviews})</span>
          </div>

          <h3 className="font-bold text-xs text-[#1b2a4a] group-hover:text-[#df4a26] transition line-clamp-2 leading-snug">
            {product.name}
          </h3>
          <p className="text-[11px] text-neutral-500 mt-1">{product.size}</p>
        </div>
      </div>

      <div className="p-4 pt-0">
        <div className="border-t border-neutral-100 pt-3 flex items-baseline justify-between">
          <div>
            <span className="text-lg font-black text-[#df4a26]">${product.priceSqft.toFixed(2)}</span>
            <span className="text-[10px] font-bold text-neutral-500"> / sq. ft.</span>
          </div>
          <span className="text-[10px] text-neutral-400">
            ${(product.priceSqft * product.sqftPerBox).toFixed(2)}/box
          </span>
        </div>
      </div>
    </div>
  );
}

// ==========================================
// OFFICIAL FLOOR & DECOR LOGO COMPONENT
// ==========================================
function FloorAndDecorLogo({ className = "h-8 sm:h-9 w-auto", light = false }) {
  const [imgError, setImgError] = useState(false);

  if (!imgError) {
    return (
      <img
        src="https://www.flooranddecor.com/on/demandware.static/Sites-floor-decor-Site/-/default/dwf11730a5/img/default-logo.svg"
        alt="Floor & Decor: High Quality Flooring and Tile"
        className={`${className} object-contain transition group-hover:opacity-95 ${light ? 'brightness-0 invert' : ''}`}
        onError={() => setImgError(true)}
      />
    );
  }

  return (
    <svg 
      viewBox="0 0 280 48" 
      className={className} 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      aria-label="Floor & Decor"
    >
      <text
        x="0"
        y="36"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        fontWeight="900"
        fontSize="34"
        letterSpacing="-0.5px"
        fill={light ? "#ffffff" : "#1b2a4a"}
      >
        FLOOR
      </text>
      <text
        x="132"
        y="37"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        fontWeight="900"
        fontSize="38"
        fontStyle="italic"
        fill="#df4a26"
      >
        &amp;
      </text>
      <text
        x="170"
        y="36"
        fontFamily="system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif"
        fontWeight="900"
        fontSize="34"
        letterSpacing="-0.5px"
        fill={light ? "#ffffff" : "#1b2a4a"}
      >
        DECOR
      </text>
    </svg>
  );
}
