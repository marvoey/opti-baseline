'use client';

import { useState } from 'react';
import { SlidersHorizontal } from 'lucide-react';
import ProductCard from './ProductCard';
import type { ProductData } from './types';

/** Client-side facet sidebar + sort for FdProductGrid (PLP). */
export default function ProductListing({ products }: { products: ProductData[] }) {
  const [material, setMaterial] = useState('All');
  const [sort, setSort] = useState('featured');
  const materials = ['All', ...Array.from(new Set(products.map((p) => p.Material).filter(Boolean) as string[]))];

  const shown = products
    .filter((p) => material === 'All' || p.Material === material)
    .sort((a, b) =>
      sort === 'price-asc' ? (a.PriceSqft ?? 0) - (b.PriceSqft ?? 0)
      : sort === 'price-desc' ? (b.PriceSqft ?? 0) - (a.PriceSqft ?? 0)
      : sort === 'rating' ? (b.Rating ?? 0) - (a.Rating ?? 0)
      : 0,
    );

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
      <aside className="bg-white p-4 rounded-lg border border-neutral-200 shadow-sm h-fit">
        <div className="flex items-center justify-between pb-3 border-b border-neutral-200 mb-4">
          <span className="font-bold text-xs uppercase text-brand-navy flex items-center gap-1.5">
            <SlidersHorizontal className="w-4 h-4 text-brand-orange" /> Filter Products
          </span>
          <button onClick={() => setMaterial('All')} className="text-[11px] text-brand-orange hover:underline">
            Reset
          </button>
        </div>
        <h4 className="font-bold text-xs text-brand-navy mb-2 uppercase">Material</h4>
        <div className="space-y-1.5 text-xs">
          {materials.map((m) => (
            <label key={m} className="flex items-center gap-2 cursor-pointer text-neutral-700 hover:text-black">
              <input type="radio" name="material" checked={material === m} onChange={() => setMaterial(m)} />
              <span>{m === 'All' ? 'All Materials' : m}</span>
            </label>
          ))}
        </div>
      </aside>

      <div className="lg:col-span-3">
        <div className="flex items-center justify-between mb-4 bg-white p-3 rounded-lg border border-neutral-200">
          <span className="text-xs text-neutral-600 font-semibold">
            Showing <strong className="text-brand-navy">{shown.length}</strong> items
          </span>
          <label className="flex items-center gap-2 text-xs text-neutral-500">
            Sort By:
            <select
              value={sort}
              onChange={(e) => setSort(e.target.value)}
              className="bg-neutral-50 border border-neutral-300 rounded px-2 py-1 text-xs font-semibold"
            >
              <option value="featured">Featured &amp; Best Sellers</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
              <option value="rating">Highest Customer Rating</option>
            </select>
          </label>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-5">
          {shown.map((p) => (
            <ProductCard key={p.Sku ?? p.Name} product={p} />
          ))}
        </div>
      </div>
    </div>
  );
}
