import Link from 'next/link';
import { Star } from 'lucide-react';
import { getProductImages, type ProductData } from './types';

export default function ProductCard({ product: p }: { product: ProductData }) {
  const image = getProductImages(p)[0];
  const price = p.PriceSqft ?? 0;
  const card = (
    <div className="group h-full bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-xl hover:border-neutral-300 transition flex flex-col justify-between">
      <div>
        <div className="h-48 overflow-hidden relative bg-neutral-100">
          {image && (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={image} alt={p.Name ?? ''} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
          )}
          {p.Brand && (
            <span className="absolute top-2 left-2 bg-white/95 text-brand-navy text-[10px] font-bold px-2 py-0.5 rounded shadow-sm">
              {p.Brand}
            </span>
          )}
          {(p.StockCount ?? 0) > 0 && (
            <span className="absolute bottom-2 left-2 bg-emerald-700 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">
              In Stock Duluth
            </span>
          )}
        </div>
        <div className="p-4">
          <div className="flex items-center gap-1 text-amber-400 text-xs mb-1">
            <Star className="w-3.5 h-3.5 fill-current" />
            <span className="text-neutral-700 font-bold text-[11px]">{p.Rating}</span>
            <span className="text-neutral-400 text-[10px]">({p.Reviews})</span>
          </div>
          <h3 className="font-bold text-xs text-brand-navy group-hover:text-brand-orange transition line-clamp-2 leading-snug">
            {p.Name}
          </h3>
          <p className="text-[11px] text-neutral-500 mt-1">{p.Size}</p>
        </div>
      </div>
      <div className="p-4 pt-0">
        <div className="border-t border-neutral-100 pt-3 flex items-baseline justify-between">
          <div>
            <span className="text-lg font-black text-brand-orange">${price.toFixed(2)}</span>
            <span className="text-[10px] font-bold text-neutral-500"> / sq. ft.</span>
          </div>
          <span className="text-[10px] text-neutral-400">${(price * (p.SqftPerBox ?? 0)).toFixed(2)}/box</span>
        </div>
      </div>
    </div>
  );
  return p.DetailUrl ? <Link href={p.DetailUrl}>{card}</Link> : card;
}
