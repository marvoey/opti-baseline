'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Check, Layers, ShoppingCart, Star, Store } from 'lucide-react';
import { getProductImages, lines, padImages, type ProductData } from './types';

/** PDP body: gallery, price, box calculator, stock, specs (client: gallery + calculator state). */
export default function ProductDetailView({
  product: p,
  images: imageOverride,
}: {
  product: ProductData;
  /** Images authored on the detail section; replaces the product's own images when non-empty. */
  images?: string[];
}) {
  const images = imageOverride?.length ? padImages(imageOverride, p) : getProductImages(p);
  const [selected, setSelected] = useState(0);
  const [roomSqft, setRoomSqft] = useState(120);
  const [addWaste, setAddWaste] = useState(true);

  const perBox = p.SqftPerBox || 1;
  const price = p.PriceSqft ?? 0;
  const effective = addWaste ? Math.ceil(roomSqft * 1.1) : roomSqft;
  const boxes = Math.ceil(effective / perBox);
  const total = (boxes * perBox * price).toFixed(2);
  const totalSqft = (boxes * perBox).toFixed(1);
  const features = lines(p.Features);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 bg-white p-6 rounded-xl border border-neutral-200 shadow-sm">
      <div className="lg:col-span-7 space-y-4">
        <div className="h-96 md:h-[480px] rounded-lg overflow-hidden border border-neutral-200 relative bg-neutral-100">
          {images[selected] && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={images[selected]} alt={p.Name ?? ''} className="w-full h-full object-cover" />
          )}
          <span className="absolute top-3 left-3 bg-brand-navy text-white text-xs font-bold px-2.5 py-1 rounded">
            SKU: {p.Sku}
          </span>
        </div>
        <div className="flex gap-3">
          {images.map((img, i) => (
            <button
              key={img}
              onClick={() => setSelected(i)}
              className={`w-20 h-20 rounded border-2 overflow-hidden transition ${selected === i ? 'border-brand-orange ring-2 ring-brand-orange/30' : 'border-neutral-200 opacity-70 hover:opacity-100'}`}
            >
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={img} alt="" className="w-full h-full object-cover" />
            </button>
          ))}
        </div>
        {features.length > 0 && (
          <div className="mt-8 pt-6 border-t border-neutral-200">
            <h3 className="font-bold text-sm text-brand-navy uppercase tracking-wide mb-3">Product Overview &amp; Specs</h3>
            <ul className="space-y-2 text-xs text-neutral-700">
              {features.map((f) => (
                <li key={f} className="flex items-start gap-2">
                  <Check className="w-4 h-4 text-brand-orange shrink-0 mt-0.5" />
                  <span>{f}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>

      <div className="lg:col-span-5">
        <div className="flex items-center justify-between text-xs text-neutral-500 mb-1">
          <span className="font-bold text-brand-orange uppercase tracking-wider">{p.Brand}</span>
          <div className="flex items-center gap-1">
            <div className="flex text-amber-400">
              {[...Array(5)].map((_, i) => <Star key={i} className="w-3.5 h-3.5 fill-current" />)}
            </div>
            <span className="text-neutral-700 font-bold">({p.Reviews})</span>
          </div>
        </div>
        <h1 className="text-2xl font-black text-brand-navy leading-tight mb-2">{p.Name}</h1>
        <p className="text-xs text-neutral-500 mb-4">Nominal Size: <strong className="text-neutral-800">{p.Size}</strong></p>

        <div className="bg-neutral-50 p-4 rounded-lg border border-neutral-200 mb-6">
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-black text-brand-orange">${price.toFixed(2)}</span>
            <span className="text-xs font-bold text-neutral-600 uppercase">/ sq. ft.</span>
          </div>
          <p className="text-xs text-neutral-500 mt-1">${(price * perBox).toFixed(2)} / Box ({perBox} sq. ft. per box)</p>
        </div>

        <div className="bg-orange-50/70 border border-orange-200 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-between mb-3">
            <span className="font-bold text-xs uppercase text-brand-navy flex items-center gap-1">
              <Layers className="w-4 h-4 text-brand-orange" /> Project Square Footage Calculator
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
                className="mt-1 w-full bg-white border border-neutral-300 rounded px-3 py-1.5 text-sm font-bold text-brand-navy"
              />
            </label>
            <div>
              <span className="block text-[11px] font-bold text-neutral-700 mb-1">Recommended Boxes</span>
              <div className="bg-white border border-neutral-200 rounded px-3 py-1.5 text-sm font-extrabold text-brand-orange">{boxes} Boxes</div>
            </div>
          </div>
          <label className="flex items-center gap-2 text-xs text-neutral-700 cursor-pointer select-none">
            <input type="checkbox" checked={addWaste} onChange={(e) => setAddWaste(e.target.checked)} />
            <span className="font-semibold">Add +10% overage for cuts, pattern waste &amp; attic stock</span>
          </label>
          <div className="mt-3 pt-3 border-t border-orange-200 flex justify-between text-xs">
            <span className="text-neutral-600">Total Material Delivered:</span>
            <span className="font-bold text-brand-navy">{totalSqft} sq. ft.</span>
          </div>
          <div className="flex justify-between text-xs mt-1">
            <span className="text-neutral-600">Estimated Total Cost:</span>
            <span className="font-extrabold text-sm text-brand-orange">${total}</span>
          </div>
        </div>

        {(p.StockCount ?? 0) > 0 && (
          <div className="flex items-center gap-2 text-xs text-emerald-800 bg-emerald-50 border border-emerald-200 p-2.5 rounded mb-6">
            <Store className="w-4 h-4 text-emerald-600 shrink-0" />
            <span><strong>In Stock:</strong> {(p.StockCount ?? 0).toLocaleString()} sq. ft. available for pickup at Duluth Superstore</span>
          </div>
        )}

        <div className="space-y-3">
          <button className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-3.5 px-4 rounded-lg shadow-md flex items-center justify-center gap-2 transition text-sm">
            <ShoppingCart className="w-4 h-4" /> Add {boxes} Boxes to Cart (${total})
          </button>
          <div className="grid grid-cols-2 gap-3">
            <button className="bg-white hover:bg-neutral-50 text-brand-navy border border-neutral-300 font-bold py-2.5 rounded text-xs transition">
              Order $3.00 Sample Piece
            </button>
            <Link href="/services" className="bg-brand-navy hover:bg-brand-navy-dark text-white font-bold py-2.5 rounded text-xs transition flex items-center justify-center gap-1">
              <Calendar className="w-3.5 h-3.5" /> Book Free Design Help
            </Link>
          </div>
        </div>

        <div className="mt-8 pt-4 border-t border-neutral-200 text-xs">
          <h4 className="font-bold text-brand-navy mb-2 uppercase">Technical Specifications</h4>
          <div className="grid grid-cols-2 gap-2 text-[11px] bg-neutral-50 p-3 rounded">
            {[['Material', p.Material], ['Surface Finish', p.Finish], ['PEI Rating', p.PeiRating], ['Slip Resistance', p.Dcof]].map(([k, v]) => (
              <div key={k}><span className="text-neutral-500">{k}:</span> <strong className="text-neutral-800">{v}</strong></div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
