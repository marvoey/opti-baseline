import React, { useState } from 'react';

// --- Icons (Raw SVGs to ensure zero external dependencies) ---
const SearchIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="11" cy="11" r="8"></circle><line x1="21" y1="21" x2="16.65" y2="16.65"></line></svg>
);
const CartIcon = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
);
const ChevronRight = () => (
  <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="9 18 15 12 9 6"></polyline></svg>
);

// --- Reusable UI Components ---
const CMSBlock = ({ id, label, children }) => (
  <div className="relative border-2 border-dashed border-blue-400 p-4 bg-blue-50/50 rounded-md my-4">
    <div className="absolute -top-3 left-4 bg-blue-500 text-white text-xs font-bold px-2 py-1 rounded">
      CMS Block ID: {id} | {label}
    </div>
    <div className="mt-2">
      {children}
    </div>
  </div>
);

const Header = ({ navigate }) => (
  <header className="sticky top-0 z-50 bg-white border-b border-gray-200">
    <div className="bg-gray-900 text-white text-xs text-center py-2 tracking-widest uppercase">
      Free Shipping on Orders Over $150
    </div>
    <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
      <div className="flex items-center gap-6">
        <button onClick={() => navigate('/')} className="text-2xl font-black tracking-tighter uppercase cursor-pointer hover:text-gray-600 transition-colors">
          Living Spaces
        </button>
      </div>
      
      <div className="hidden md:flex flex-1 max-w-2xl mx-8">
        <div className="relative w-full">
          <input 
            type="text" 
            placeholder="Search for furniture, decor, and more..." 
            className="w-full bg-gray-100 border-transparent focus:bg-white focus:border-gray-300 focus:ring-0 rounded-full py-2 pl-4 pr-10 outline-none transition-all"
          />
          <div className="absolute right-3 top-2.5 text-gray-500">
            <SearchIcon />
          </div>
        </div>
      </div>

      <div className="flex items-center gap-4">
        <button className="text-sm font-medium hidden sm:block hover:underline">Sign In</button>
        <button className="p-2 hover:bg-gray-100 rounded-full transition-colors"><CartIcon /></button>
      </div>
    </div>
    
    <nav className="max-w-7xl mx-auto px-4 py-3 flex gap-8 text-sm font-medium border-t border-gray-100 overflow-x-auto">
      <button onClick={() => navigate('/departments/furniture')} className="hover:text-blue-600 whitespace-nowrap">Furniture</button>
      <button className="hover:text-blue-600 whitespace-nowrap">Living Room</button>
      <button className="hover:text-blue-600 whitespace-nowrap">Bedroom</button>
      <button onClick={() => navigate('/departments/furniture/home-office')} className="hover:text-blue-600 whitespace-nowrap">Home Office</button>
      <button className="hover:text-blue-600 whitespace-nowrap text-red-600">Sale</button>
    </nav>
  </header>
);

const Footer = () => (
  <footer className="bg-gray-100 mt-20 py-12">
    <div className="max-w-7xl mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8">
      <div>
        <h3 className="font-bold mb-4 uppercase text-sm">Living Spaces</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>About Us</li>
          <li>Careers</li>
          <li>Store Locator</li>
        </ul>
      </div>
      <div>
        <h3 className="font-bold mb-4 uppercase text-sm">Customer Care</h3>
        <ul className="space-y-2 text-sm text-gray-600">
          <li>Track Order</li>
          <li>Returns</li>
          <li>Contact Us</li>
        </ul>
      </div>
    </div>
  </footer>
);

// --- Page Views ---

const HomepageView = ({ navigate }) => (
  <main className="animate-in fade-in duration-500">
    <CMSBlock id="104" label="Hero Banner (Scheduled via Optimizely Projects)">
      <div 
        className="w-full h-[500px] bg-cover bg-center flex items-center justify-center text-center cursor-pointer"
        style={{ backgroundImage: "url('https://images.unsplash.com/photo-1555041469-a586c61ea9bc?auto=format&fit=crop&q=80&w=2000')" }}
        onClick={() => navigate('/departments/furniture')}
      >
        <div className="bg-black/50 p-8 rounded-xl backdrop-blur-sm">
          <h1 className="text-5xl font-black text-white mb-4 drop-shadow-lg">Holiday 2026 Collection</h1>
          <p className="text-xl text-white mb-6 drop-shadow-md">Transform your space for the season.</p>
          <button className="bg-white text-black px-8 py-3 font-bold uppercase tracking-wider hover:bg-gray-200 transition-colors">Shop Furniture</button>
        </div>
      </div>
    </CMSBlock>
    <div className="max-w-7xl mx-auto px-4 py-12">
      <h2 className="text-2xl font-bold mb-6">Shop by Category</h2>
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {[
          { name: 'Living Room', img: "https://images.unsplash.com/photo-1493663284031-b7e3aefcae8e?auto=format&fit=crop&w=500&q=80" },
          { name: 'Bedroom', img: "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&w=500&q=80" },
          { name: 'Dining Room', img: "https://images.unsplash.com/photo-1617806118233-18e1c0d48227?auto=format&fit=crop&w=500&q=80" },
          { name: 'Home Office', img: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=500&q=80", path: '/departments/furniture/home-office' }
        ].map(cat => (
          <div key={cat.name} onClick={() => cat.path && navigate(cat.path)} className={`group cursor-pointer ${cat.path ? 'ring-2 ring-blue-400 ring-offset-2' : ''}`}>
            <div className="aspect-[4/5] bg-gray-200 overflow-hidden relative">
              <img src={cat.img} alt={cat.name} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
            </div>
            <h3 className="mt-3 text-center font-bold">{cat.name}</h3>
          </div>
        ))}
      </div>
    </div>
  </main>
);

const HomeOfficeLandingView = ({ navigate }) => (
  <main className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">
    <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
      <button onClick={() => navigate('/')} className="hover:text-black">Home</button>
      <ChevronRight />
      <button onClick={() => navigate('/departments/furniture')} className="hover:text-black">Furniture</button>
      <ChevronRight />
      <span className="text-black font-medium">Home Office</span>
    </div>

    <h1 className="text-4xl font-bold mb-8">Home Office Furniture</h1>
    
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div 
        className="relative h-64 bg-gray-200 cursor-pointer group overflow-hidden flex items-center justify-center"
        onClick={() => navigate('/departments/furniture/home-office/office-desks')}
      >
        <img src={"https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=800&q=80"} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-black/30" />
        <h2 className="relative z-10 text-3xl font-bold text-white tracking-widest border-2 border-white p-4 group-hover:bg-white group-hover:text-black transition-colors">DESKS</h2>
      </div>
      {/* Fake categories for aesthetics */}
      <div className="relative h-64 bg-gray-200 cursor-pointer group overflow-hidden flex items-center justify-center">
        <img src={"https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=800&q=80"} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-black/30" />
        <h2 className="relative z-10 text-3xl font-bold text-white tracking-widest border-2 border-white p-4">CHAIRS</h2>
      </div>
      <div className="relative h-64 bg-gray-200 cursor-pointer group overflow-hidden flex items-center justify-center">
        <img src={"https://images.unsplash.com/photo-1533682976077-d64ab4400eeb?auto=format&fit=crop&w=800&q=80"} className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        <div className="absolute inset-0 bg-black/30" />
        <h2 className="relative z-10 text-3xl font-bold text-white tracking-widest border-2 border-white p-4">STORAGE</h2>
      </div>
    </div>
  </main>
);

const PLPView = ({ navigate }) => (
  <main className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">
    <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
      <button onClick={() => navigate('/')} className="hover:text-black">Home</button>
      <ChevronRight />
      <span className="truncate">...</span>
      <ChevronRight />
      <button onClick={() => navigate('/departments/furniture/home-office')} className="hover:text-black">Home Office</button>
      <ChevronRight />
      <span className="text-black font-medium">Desks</span>
    </div>

    <CMSBlock id="103" label="PromoBannerBlock (Targeted via Personalization)">
      <div className="w-full h-[250px] bg-indigo-900 rounded-lg overflow-hidden flex items-center relative">
        <div className="absolute right-0 top-0 bottom-0 w-1/2 bg-cover bg-center" style={{ backgroundImage: "url('https://images.unsplash.com/photo-1593642632823-8f785ba67e45?auto=format&fit=crop&w=1000&q=80')" }} />
        <div className="absolute inset-0 bg-gradient-to-r from-indigo-900 via-indigo-900 to-transparent" />
        <div className="relative z-10 p-12 text-white max-w-xl">
          <h2 className="text-4xl font-bold mb-2 text-indigo-200">Work from Home Upgrade</h2>
          <p className="text-xl mb-6">Enjoy 15% off all writing and standing desks this week only.</p>
          <button className="bg-white text-indigo-900 font-bold px-6 py-2 rounded-full">Shop the Sale</button>
        </div>
      </div>
    </CMSBlock>

    <div className="flex gap-8 mt-8">
      <div className="w-64 hidden lg:block shrink-0">
        <h3 className="font-bold mb-4 border-b pb-2">Filter By</h3>
        <div className="space-y-3 text-sm">
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded" /> Writing Desks</label>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded" /> Standing Desks</label>
          <label className="flex items-center gap-2 cursor-pointer"><input type="checkbox" className="rounded" /> Executive Desks</label>
        </div>
      </div>

      <div className="flex-1">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-3xl font-bold">Office Desks</h1>
          <span className="text-sm text-gray-500">Showing 42 Results</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
          {/* Target Product */}
          <div 
            className="group cursor-pointer ring-2 ring-transparent hover:ring-blue-400 p-2 transition-all rounded"
            onClick={() => navigate('/pdp-voyage-desk')}
          >
            <div className="aspect-square bg-gray-100 mb-4 overflow-hidden">
              <img src={"https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=600&q=80"} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
            </div>
            <h3 className="font-bold text-gray-900">Voyage 60" Writing Desk</h3>
            <p className="text-gray-500 text-sm mb-2">By Nate Berkus and Jeremiah Brent</p>
            <p className="font-bold text-xl">$495.00</p>
          </div>
          
          {/* Fake Products */}
          {[1,2,3,4,5].map(i => (
            <div key={i} className="group cursor-pointer">
              <div className="aspect-square bg-gray-100 mb-4 overflow-hidden">
                <img src={"https://images.unsplash.com/photo-1505843490538-5133c6c7d0e1?auto=format&fit=crop&w=600&q=80"} className="w-full h-full object-cover group-hover:scale-105 transition-transform" />
              </div>
              <h3 className="font-bold text-gray-900">Modern Workspace {i}</h3>
              <p className="text-gray-500 text-sm mb-2">Essential Collection</p>
              <p className="font-bold text-xl">${299 + (i*50)}.00</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  </main>
);

const PDPView = ({ navigate }) => (
  <main className="max-w-7xl mx-auto px-4 py-8 animate-in fade-in duration-500">
    <div className="flex items-center gap-2 text-sm text-gray-500 mb-8">
      <button onClick={() => navigate('/')} className="hover:text-black">Home</button>
      <ChevronRight />
      <span className="truncate">...</span>
      <ChevronRight />
      <button onClick={() => navigate('/departments/furniture/home-office/office-desks')} className="hover:text-black">Office Desks</button>
      <ChevronRight />
      <span className="text-black font-medium">Voyage 60" Writing Desk</span>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
      {/* Image Gallery */}
      <div className="space-y-4">
        <div className="aspect-[4/3] bg-gray-100 rounded-lg overflow-hidden">
           <img src={"https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?auto=format&fit=crop&w=1000&q=80"} className="w-full h-full object-cover" />
        </div>
      </div>

      {/* Product Details (Commerce Data) */}
      <div className="flex flex-col">
        <div className="mb-2 text-sm font-bold tracking-wider text-gray-500 uppercase">Nate Berkus and Jeremiah Brent</div>
        <h1 className="text-4xl font-bold mb-4">Voyage 60" Writing Desk</h1>
        
        <div className="flex items-baseline gap-4 mb-6">
          <span className="text-3xl font-black">$495.00</span>
          <span className="text-sm text-green-700 font-medium">In Stock</span>
        </div>

        <p className="text-gray-600 mb-8 leading-relaxed">
          Crafted from solid oak with a light, natural finish, the Voyage writing desk brings warmth and sophisticated geometry to your home office. Features two soft-close drawers for seamless storage.
        </p>

        <button className="w-full bg-gray-900 text-white py-4 text-lg font-bold hover:bg-gray-800 transition-colors rounded-sm mb-4">
          Add to Cart
        </button>

        {/* CMS Area 1: Disclaimer */}
        <CMSBlock id="101" label="RichContentBlock (PDP Disclaimer)">
          <div className="flex items-start gap-3 p-4 bg-orange-50 text-orange-900 border border-orange-200 rounded">
            <svg className="w-5 h-5 shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            <div>
              <strong>Assembly Required.</strong> Ships in two separate boxes. Please allow 1-2 hours for setup.
            </div>
          </div>
        </CMSBlock>

        <div className="border-t border-gray-200 mt-8 pt-8">
          <h3 className="font-bold text-lg mb-4">Product Specifications</h3>
          <ul className="text-sm space-y-2 text-gray-600">
            <li><strong className="text-gray-900">Dimensions:</strong> 60"W x 28"D x 30"H</li>
            <li><strong className="text-gray-900">Material:</strong> Solid Oak, Veneer</li>
            <li><strong className="text-gray-900">Weight:</strong> 95 lbs</li>
          </ul>
        </div>
      </div>
    </div>

    {/* CMS Area 2: Enrichment */}
    <div className="mt-16">
      <CMSBlock id="102" label="RichContentBlock (PDP Enrichment managed by SEO team)">
        <div className="bg-stone-100 p-8 md:p-16 rounded-xl flex flex-col md:flex-row items-center gap-12">
          <div className="flex-1">
            <h2 className="text-3xl font-serif font-bold text-stone-900 mb-4">Designer Tip</h2>
            <p className="text-lg text-stone-700 leading-relaxed italic mb-6">
              "When styling the Voyage desk, we highly recommend keeping the surface minimal. Pair it with a highly textured chair—like boucle or leather—to contrast the sleek wood lines."
            </p>
            <p className="font-bold text-stone-900 uppercase text-sm tracking-widest">— Jeremiah Brent</p>
          </div>
          <div className="flex-1">
            <img src={"https://images.unsplash.com/photo-1616486338812-3dadae4b4ace?auto=format&fit=crop&w=800&q=80"} className="rounded-lg shadow-xl" />
          </div>
        </div>
      </CMSBlock>
    </div>
  </main>
);

// --- Main App / Router ---

export default function LivingSpacesDemo() {
  // Simple state-based router
  const [currentRoute, setCurrentRoute] = useState('/');

  const navigate = (path) => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
    setCurrentRoute(path);
  };

  const renderRoute = () => {
    switch(currentRoute) {
      case '/': 
        return <HomepageView navigate={navigate} />;
      case '/departments/furniture': 
      case '/departments/furniture/home-office':
        // For demo brevity, grouping Landing pages
        return <HomeOfficeLandingView navigate={navigate} />;
      case '/departments/furniture/home-office/office-desks':
        return <PLPView navigate={navigate} />;
      case '/pdp-voyage-desk':
        return <PDPView navigate={navigate} />;
      default:
        return <HomepageView navigate={navigate} />;
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans bg-white text-gray-900">
      {/* Demo helper banner */}
      <div className="bg-blue-600 text-white p-2 text-center text-sm font-medium sticky top-0 z-[60]">
        Interactive Next.js Demo Simulation. Click around to see hardcoded routing and CMS blocks.
      </div>
      
      <Header navigate={navigate} />
      
      <div className="flex-1">
        {renderRoute()}
      </div>

      <Footer />
    </div>
  );
}