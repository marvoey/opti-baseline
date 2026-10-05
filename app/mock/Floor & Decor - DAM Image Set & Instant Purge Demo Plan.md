# Floor & Decor: DAM Image Set Management & Instant Purge Demo Plan

## Executive & Stakeholder Rationale

### The Stakeholder & The Pain Point
* **Stakeholder:** Rachel (E-Commerce Operations & Merchandising)
* **Discovery Call Statement:**
  > *"Rachel asks about their current system's limitations regarding live site preview and slot-based timing... Rachel requests a screenshot showing how image ordering within PDP image sets is managed and the flexibility to reorder images when new imagery arrives. She highlights their biggest pain points: image purging/loading and creating image sets."*
* **The Current Amplience Problem:**
  In Amplience / legacy CDNs, when high-resolution photography arrives (e.g., new room scene or close-up veining):
  1. Creating and re-sequencing the image set requires developer / operations tickets.
  2. The CDN caches images heavily; updates require executing manual Akamai/Cloudflare purge scripts or waiting hours for TTL invalidation.
  3. Image sizing across desktop, tablet, and mobile requires manual multi-file exports.
* **The Optimizely DAM Solution:**
  1. **Visual Drag-and-Drop Image Set Sequencing:** Business users reorder hero, texture, and room scenes directly.
  2. **Zero-Purge Edge Distribution:** Image URLs use immutable cryptographic version hashes (`?v=hash` or content addressing). Resequencing renders instantly with **zero CDN purge delay (under 50ms)**.
  3. **Smart Responsive Renditions:** The DAM automatically calculates focal-point smart crops and device breakpoints (AVIF/WebP) on the fly.

---

## Architectural Implementation Plan for `marvoey/opti-baseline`

We will enhance the PDP component (`app/_components/fd/ProductDetailView.tsx`) to provide a toggleable **"Optimizely DAM Asset & Image Set Manager" drawer**.

```
┌──────────────────────────────────────────────────────────────────────────────┐
│  PDP: Venato White Polished Porcelain Tile (SKU: 100610781)                  │
│                                                                              │
│  [ Active Hero Image Display ]           [ Buy Box & Box Calculator ]        │
│                                                                              │
│  ┌────────────────────────────────────────────────────────────────────────┐  │
│  │ ⚡ OPTIMIZELY DAM: IMAGE SET SEQUENCE & PURGE MANAGER (Rachel's View)  │  │
│  │                                                                        │  │
│  │  [#1 Hero] ⇄ [#2 Texture] ⇄ [#3 Lifestyle] ⇄ [#4 Specs]  [+ Add Image] │  │
│  │                                                                        │  │
│  │  • Click arrows or drag to resequence primary & secondary images       │  │
│  │  • Live Edge CDN Status: Zero purge delay (Auto-versioned hash)        │  │
│  │  • Smart Renditions: Mobile (400px), Tablet (800px), Desktop (1400px) │  │
│  └────────────────────────────────────────────────────────────────────────┘  │
└──────────────────────────────────────────────────────────────────────────────┘
```

---

## Step-by-Step Code Changes

### Step 1: Update `app/_components/fd/ProductDetailView.tsx`

Replace or enhance `ProductDetailView.tsx` with interactive image set reordering, live edge CDN cache status feedback, and automatic rendition breakdown:

```tsx
'use client';

import { useState } from 'react';
import Link from 'next/link';
import { 
  Calendar, Check, Layers, ShoppingCart, Star, Store,
  ImageIcon, MoveLeft, MoveRight, Plus, RefreshCw, CheckCircle2,
  Sliders, ShieldCheck, Sparkles, Eye
} from 'lucide-react';
import { lines, type ProductData } from './types';

interface ImageItem {
  id: string;
  url: string;
  label: string;
  tag: 'Hero' | 'Detail' | 'Lifestyle' | 'Spec';
  renditionWidths: number[];
}

export default function ProductDetailView({ product: p }: { product: ProductData }) {
  // Parse raw newline-separated images from Graph/CMS or fall back to defaults
  const initialImages: ImageItem[] = (lines(p.Images).length > 0 ? lines(p.Images) : [
    'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1615971677499-5467cbab01c0?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=800&q=80',
    'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=800&q=80'
  ]).map((url, i) => ({
    id: `img-${i + 1}`,
    url,
    label: i === 0 ? 'Primary Hero Room Scene' : i === 1 ? 'Surface Texture & Veining' : i === 2 ? 'Installation Perspective' : 'Profile & Edge Thickness',
    tag: i === 0 ? 'Hero' : i === 1 ? 'Detail' : i === 2 ? 'Lifestyle' : 'Spec',
    renditionWidths: [440, 800, 1200, 1600]
  }));

  const [imageSet, setImageSet] = useState<ImageItem[]>(initialImages);
  const [selectedIdx, setSelectedIdx] = useState(0);
  const [damToast, setDamToast] = useState('');
  const [showDamDrawer, setShowDamDrawer] = useState(true);
  const [activeRendition, setActiveRendition] = useState<'desktop' | 'mobile'>('desktop');

  // Calculator State
  const [roomSqft, setRoomSqft] = useState(120);
  const [addWaste, setAddWaste] = useState(true);

  const perBox = p.SqftPerBox || 16;
  const price = p.PriceSqft ?? 2.49;
  const effective = addWaste ? Math.ceil(roomSqft * 1.1) : roomSqft;
  const boxes = Math.ceil(effective / perBox);
  const total = (boxes * perBox * price).toFixed(2);
  const totalSqft = (boxes * perBox).toFixed(1);
  const features = lines(p.Features);

  // Rachel's Core Feature: Reordering Image Set with Zero CDN Purge Delays
  const handleReorder = (fromIdx: number, toIdx: number) => {
    if (toIdx < 0 || toIdx >= imageSet.length) return;
    const updated = [...imageSet];
    const [moved] = updated.splice(fromIdx, 1);
    updated.splice(toIdx, 0, moved);
    setImageSet(updated);
    setSelectedIdx(toIdx);

    setDamToast(`Image set sequence updated! Optimizely DAM edge CDN invalidated cache in 42ms.`);
    setTimeout(() => setDamToast(''), 4000);
  };

  // Simulate Adding a New High-Res Asset
  const handleAddImagery = () => {
    const newAsset: ImageItem = {
      id: `img-${Date.now()}`,
      url: 'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=800&q=80',
      label: 'New Master Bath High-Res Shot',
      tag: 'Lifestyle',
      renditionWidths: [440, 800, 1200, 1600]
    };
    const updated = [newAsset, ...imageSet];
    setImageSet(updated);
    setSelectedIdx(0);
    setDamToast('New high-resolution imagery uploaded: Auto-generated 4 device renditions & published live.');
    setTimeout(() => setDamToast(''), 4500);
  };

  return (
    <div className="space-y-6">
      
      {/* Toast Alert for Instant CDN Purge */}
      {damToast && (
        <div className="bg-emerald-600 text-white text-xs py-2 px-4 rounded-lg shadow-lg flex items-center justify-between animate-fadeIn">
          <span className="flex items-center gap-2 font-medium">
            <CheckCircle2 className="w-4 h-4" /> {damToast}
          </span>
          <span className="text-[10px] bg-emerald-700 px-2 py-0.5 rounded font-mono">Status: 200 OK</span>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
        
        {/* LEFT COLUMN: Gallery & DAM Management */}
        <div className="lg:col-span-7 space-y-4">
          
          {/* Main Hero Viewer */}
          <div className="h-96 md:h-[460px] rounded-lg overflow-hidden border border-neutral-200 relative bg-neutral-100 group">
            <img
              src={imageSet[selectedIdx]?.url}
              alt={p.Name ?? 'Product photo'}
              className="w-full h-full object-cover transition-all duration-300"
            />
            
            <div className="absolute top-3 left-3 flex items-center gap-2">
              <span className="bg-[#1b2a4a] text-white text-xs font-bold px-2.5 py-1 rounded">
                SKU: {p.Sku || '100779834'}
              </span>
              <span className="bg-[#df4a26] text-white text-[11px] font-bold px-2 py-0.5 rounded">
                Position #{selectedIdx + 1} ({imageSet[selectedIdx]?.tag})
              </span>
            </div>

            <div className="absolute bottom-3 left-3 bg-black/75 backdrop-blur-sm text-white px-3 py-1.5 rounded text-xs">
              {imageSet[selectedIdx]?.label}
            </div>

            {/* Smart Rendition Badge */}
            <div className="absolute bottom-3 right-3 bg-white/95 text-neutral-800 px-2.5 py-1 rounded text-[11px] font-mono border border-neutral-300 shadow">
              Rendition: <strong>{activeRendition === 'desktop' ? '1200x800 WebP' : '440x300 Mobile AVIF'}</strong>
            </div>
          </div>

          {/* Standard Thumbnail Strip */}
          <div className="flex gap-3 overflow-x-auto pb-1">
            {imageSet.map((img, i) => (
              <button
                key={img.id}
                onClick={() => setSelectedIdx(i)}
                className={`w-20 h-20 rounded border-2 overflow-hidden shrink-0 transition relative ${
                  selectedIdx === i ? 'border-[#df4a26] ring-2 ring-[#df4a26]/30' : 'border-neutral-200 opacity-70 hover:opacity-100'
                }`}
              >
                <img src={img.url} alt="" className="w-full h-full object-cover" />
                <span className="absolute bottom-0 right-0 bg-black/70 text-white text-[9px] px-1 font-mono">
                  #{i + 1}
                </span>
              </button>
            ))}
          </div>

          {/* RACHEL'S CORE FEATURE: OPTIMIZELY DAM IMAGE SET CONTROLS */}
          {showDamDrawer && (
            <div className="mt-4 bg-neutral-50 rounded-xl border border-neutral-200 p-4 space-y-3">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-neutral-200 pb-2">
                <div className="flex items-center gap-2">
                  <ImageIcon className="w-4 h-4 text-[#df4a26]" />
                  <span className="font-bold text-xs text-[#1b2a4a]">
                    Optimizely DAM: Image Set Sequence &amp; Purge Engine
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <button
                    onClick={handleAddImagery}
                    className="bg-[#1b2a4a] hover:bg-[#121c33] text-white text-[11px] font-bold px-2.5 py-1 rounded flex items-center gap-1 transition"
                  >
                    <Plus className="w-3 h-3 text-[#df4a26]" /> Add New Arrival Photo
                  </button>
                </div>
              </div>

              {/* Reordering Strip */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-1">
                {imageSet.map((item, idx) => (
                  <div key={item.id} className="bg-white p-2 rounded-lg border border-neutral-200 text-xs flex flex-col justify-between space-y-1.5 shadow-sm">
                    <div className="flex items-center justify-between text-[10px] text-neutral-500 font-mono">
                      <span>Order #{idx + 1}</span>
                      <span className="text-[#df4a26] font-bold">{item.tag}</span>
                    </div>

                    <div 
                      onClick={() => setSelectedIdx(idx)}
                      className="aspect-video bg-neutral-100 rounded overflow-hidden cursor-pointer"
                    >
                      <img src={item.url} alt="" className="w-full h-full object-cover" />
                    </div>

                    <div className="text-[10px] text-neutral-700 font-medium truncate" title={item.label}>
                      {item.label}
                    </div>

                    {/* Move Left / Right Buttons */}
                    <div className="flex items-center justify-between pt-1 border-t border-neutral-100">
                      <button
                        disabled={idx === 0}
                        onClick={() => handleReorder(idx, idx - 1)}
                        className="p-1 hover:bg-neutral-100 rounded text-neutral-600 disabled:opacity-30 disabled:hover:bg-transparent"
                        title="Move Left (Higher Priority)"
                      >
                        <MoveLeft className="w-3.5 h-3.5" />
                      </button>
                      <span className="text-[10px] font-mono text-neutral-400">Position</span>
                      <button
                        disabled={idx === imageSet.length - 1}
                        onClick={() => handleReorder(idx, idx + 1)}
                        className="p-1 hover:bg-neutral-100 rounded text-neutral-600 disabled:opacity-30 disabled:hover:bg-transparent"
                        title="Move Right (Lower Priority)"
                      >
                        <MoveRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>

              {/* Technical CDN Purge Callout for Rachel */}
              <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 text-[11px] text-emerald-900 flex items-start gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0 mt-0.5" />
                <div className="leading-snug">
                  <strong>Why this eliminates Rachel's Amplience pain:</strong> In Amplience, reordering images or adding hero swatches requires manual CDN purge commands and developer assistance. Optimizely DAM generates content-hash versioned URLs so edge caches update immediately with <strong>zero manual purge delays</strong>.
                </div>
              </div>
            </div>
          )}

          {/* Product Overview & Specs */}
          {features.length > 0 && (
            <div className="mt-8 pt-6 border-t border-neutral-200">
              <h3 className="font-bold text-sm text-[#1b2a4a] uppercase tracking-wide mb-3">Product Overview &amp; Specs</h3>
              <ul className="space-y-2 text-xs text-neutral-700">
                {features.map((f) => (
                  <li key={f} className="flex items-start gap-2">
                    <Check className="w-4 h-4 text-[#df4a26] shrink-0 mt-0.5" />
                    <span>{f}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
        </div>

        {/* RIGHT COLUMN: Buy Box & Calculator */}
        <div className="lg:col-span-5">
          <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
            <span className="font-bold text-[#df4a26] uppercase tracking-wider">{p.Brand || 'San Giorgio'}</span>
            <div className="flex items-center gap-1">
              <div className="flex text-amber-400">
                {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
              </div>
              <span className="text-neutral-700 font-bold">({p.Reviews || 218})</span>
            </div>
          </div>
          <h1 className="text-2xl font-black text-[#1b2a4a] leading-tight mb-2">{p.Name}</h1>
          <p className="text-xs text-neutral-500 mb-4">Nominal Size: <strong className="text-neutral-800">{p.Size || '12 x 24 in.'}</strong></p>

          <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 mb-6">
            <div className="flex items-baseline gap-2">
              <span className="text-3xl font-black text-[#df4a26]">${price.toFixed(2)}</span>
              <span className="text-xs font-bold text-neutral-600 uppercase">/ sq. ft.</span>
            </div>
            <p className="text-xs text-neutral-500 mt-1">${(price * perBox).toFixed(2)} / Box ({perBox} sq. ft. per box)</p>
          </div>

          <div className="bg-orange-50/70 border border-orange-200 rounded-lg p-4 mb-6">
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-xs uppercase text-[#1b2a4a] flex items-center gap-1">
                <Layers className="w-4 h-4 text-[#df4a26]" /> Project Square Footage Calculator
              </span>
              <span className="text-[11px] text-neutral-500">Auto-Box Rounding</span>
            </div>
            <div className="grid grid-cols-2 gap-3 mb-3">
              <label className="block text-[11px] font-bold text-neutral-700">
                Room Area (sq. ft.)
                <input
                  type="number"
                  min={1}
                  value={roomSqft}
                  onChange={(e) => setRoomSqft(Math.max(1, parseInt(e.target.value) || 1))}
                  className="mt-1 w-full bg-white border border-neutral-300 rounded px-3 py-1.5 text-sm font-bold text-[#1b2a4a]"
                />
              </label>
              <div>
                <span className="block text-[11px] font-bold text-neutral-700 mb-1">Recommended Boxes</span>
                <div className="bg-white border border-neutral-200 rounded px-3 py-1.5 text-sm font-extrabold text-[#df4a26]">{boxes} Boxes</div>
              </div>
            </div>
            <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer select-none">
              <input type="checkbox" checked={addWaste} onChange={(e) => setAddWaste(e.target.checked)} />
              <span className="font-semibold">Add +10% overage for cuts, pattern waste &amp; attic stock</span>
            </label>
            <div className="mt-3 pt-3 border-t border-orange-200 flex justify-between text-xs">
              <span className="text-neutral-600">Total Material Delivered:</span>
              <span className="font-bold text-[#1b2a4a]">{totalSqft} sq. ft.</span>
            </div>
            <div className="flex justify-between text-xs mt-1">
              <span className="text-neutral-600">Estimated Total Cost:</span>
              <span className="font-extrabold text-sm text-[#df4a26]">${total}</span>
            </div>
          </div>

          {(p.StockCount ?? 0) > 0 && (
            <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded mb-6">
              <Store className="w-4 h-4 text-emerald-600 shrink-0" />
              <span><strong>In Stock:</strong> {(p.StockCount ?? 0).toLocaleString()} sq. ft. available for pickup at Omaha Superstore</span>
            </div>
          )}

          <div className="space-y-3">
            <button className="w-full bg-[#df4a26] hover:bg-[#c63a18] text-white font-bold py-3.5 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 transition text-sm">
              <ShoppingCart className="w-4 h-4" /> Add {boxes} Boxes to Cart (${total})
            </button>
            <div className="grid grid-cols-2 gap-3">
              <button className="bg-white hover:bg-neutral-50 text-[#1b2a4a] border border-neutral-300 font-bold py-2.5 rounded text-xs transition">
                Order $3.00 Sample Piece
              </button>
              <Link href="/services" className="bg-[#1b2a4a] hover:bg-[#121c33] text-white font-bold py-2.5 rounded text-xs transition flex items-center justify-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Book Free Design Help
              </Link>
            </div>
          </div>

          <div className="mt-8 pt-4 border-t border-neutral-200 text-xs">
            <h4 className="font-bold text-[#1b2a4a] mb-2 uppercase">Technical Specifications</h4>
            <div className="grid grid-cols-2 gap-2 text-[11px] bg-neutral-50 p-3 rounded">
              {[['Material', p.Material || 'Porcelain'], ['Surface Finish', p.Finish || 'Polished'], ['PEI Rating', p.PeiRating || 'Class 4'], ['Slip Resistance', p.Dcof || '>= 0.42']].map(([k, v]) => (
                <div key={k}><span className="text-neutral-500">{k}:</span> <strong className="text-neutral-800">{v}</strong></div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
```

---

## Live Demo Talk Track: Rachel's 2-Minute Moment

When you navigate to the PDP during the demo:

1. **Highlight the Pain Point:**
   > *"Rachel, in your discovery call you noted that in Amplience, handling image sets—especially re-ordering them when new lifestyle or texture imagery arrives—is a major bottleneck, often requiring developer tickets and waiting on CDN purge cycles."*

2. **Demonstrate the Reordering:**
   > *"Here in Optimizely, your merchandising team can directly re-sequence the image set. Notice how I click to swap Position #2 (close-up veining) into Position #1 (Hero). Watch the live preview update instantly."*

3. **Demonstrate the Zero-Purge CDN:**
   > *"Because Optimizely DAM uses immutable content-versioned hashes at the edge, there is zero Akamai or Cloudflare cache lag. Your customers see the new image ordering within milliseconds across mobile, tablet, and desktop—with automated WebP and AVIF renditions calculated automatically."*
