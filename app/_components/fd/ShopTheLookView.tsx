'use client';

import { useState } from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import type { ProductData } from './types';

export type Hotspot = { x: number; y: number; label?: string | null; product?: ProductData | null };

/** Room image with numbered hotspots + linked product list (client: active pin). */
export default function ShopTheLookView({
  title, designer, description, image, hotspots,
}: {
  title?: string | null; designer?: string | null; description?: string | null;
  image?: string; hotspots: Hotspot[];
}) {
  const [active, setActive] = useState(0);
  const current = hotspots[active]?.product;

  return (
    <div className="bg-white rounded-xl border border-neutral-200 overflow-hidden shadow-lg grid grid-cols-1 lg:grid-cols-12">
      <div className="lg:col-span-8 relative h-96 lg:h-[520px]">
        {image && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={image} alt={title ?? ''} className="w-full h-full object-cover" />
        )}
        {hotspots.map((h, i) => (
          <button
            key={i}
            onClick={() => setActive(i)}
            style={{ left: `${h.x}%`, top: `${h.y}%` }}
            className={`absolute w-7 h-7 rounded-full flex items-center justify-center font-bold text-xs shadow-lg transition-transform ${active === i ? 'bg-brand-orange text-white scale-125 ring-4 ring-white' : 'bg-white text-brand-navy hover:scale-110'}`}
          >
            {i + 1}
          </button>
        ))}
      </div>

      <div className="lg:col-span-4 p-6 flex flex-col justify-between bg-neutral-50">
        <div>
          <span className="text-[11px] font-bold text-brand-orange uppercase">Curated Room Scheme</span>
          <h3 className="text-xl font-black text-brand-navy mt-1 mb-2">{title}</h3>
          <p className="text-xs text-neutral-500 mb-2 italic">{designer}</p>
          <p className="text-xs text-neutral-600 mb-6">{description}</p>
          <h4 className="text-xs font-bold text-brand-navy uppercase tracking-wide mb-3">Products In This Design:</h4>
          <div className="space-y-3">
            {hotspots.map((h, i) => (
              <div
                key={i}
                onClick={() => setActive(i)}
                className={`p-3 rounded-lg border cursor-pointer transition ${active === i ? 'bg-white border-brand-orange shadow-sm ring-1 ring-brand-orange' : 'bg-white/60 border-neutral-200 hover:bg-white'}`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold bg-brand-navy text-white px-1.5 py-0.5 rounded">Pin #{i + 1}</span>
                  <span className="font-extrabold text-xs text-brand-orange">
                    {h.product?.PriceSqft != null ? `$${h.product.PriceSqft.toFixed(2)}/sq.ft.` : ''}
                  </span>
                </div>
                <p className="font-bold text-xs text-brand-navy mt-1">{h.product?.Name}</p>
                <p className="text-[11px] text-neutral-500">{h.label}</p>
              </div>
            ))}
          </div>
        </div>
        {current?.DetailUrl && (
          <div className="mt-6 pt-4 border-t border-neutral-200">
            <Link href={current.DetailUrl} className="w-full bg-brand-orange hover:bg-brand-orange-dark text-white font-bold py-2.5 px-4 rounded text-xs transition flex items-center justify-center gap-1">
              View Selected Product Details <ArrowRight className="w-3.5 h-3.5" />
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
