'use client';

import { useState } from 'react';

type Props = {
  shippingLabel: string;
  trackingLabel: string;
  quoteButtonLabel: string;
  trackButtonLabel: string;
  labels: {
    from: string;
    to: string;
    length: string;
    width: string;
    height: string;
    weight: string;
    residential: string;
    trackingPlaceholder: string;
  };
};

const input =
  'w-full rounded-lg border border-blue-100 bg-white p-2.5 text-sm text-blue-950 focus:border-blue-800 focus:outline-none';

/** Interactive Shipping quote / Tracking tabs for the UPS hero widget. */
export default function QuoteTrackTabs({
  shippingLabel,
  trackingLabel,
  quoteButtonLabel,
  trackButtonLabel,
  labels,
}: Props) {
  const [tab, setTab] = useState<'quote' | 'track'>('quote');

  const tabClass = (active: boolean) =>
    `px-5 py-2.5 text-sm font-bold rounded-t-lg border-b-4 transition-colors ${
      active ? 'border-blue-200 text-blue-950' : 'border-transparent text-blue-950/60 hover:text-blue-950'
    }`;

  return (
    <div>
      <div role="tablist" className="flex gap-2 border-b border-blue-100">
        <button role="tab" aria-selected={tab === 'quote'} className={tabClass(tab === 'quote')} onClick={() => setTab('quote')}>
          {shippingLabel}
        </button>
        <button role="tab" aria-selected={tab === 'track'} className={tabClass(tab === 'track')} onClick={() => setTab('track')}>
          {trackingLabel}
        </button>
      </div>

      {tab === 'quote' ? (
        <form className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-2" onSubmit={(e) => e.preventDefault()}>
          <label className="text-xs font-bold text-blue-950">
            {labels.from} *
            <input type="text" className={`${input} mt-1 font-normal`} required />
          </label>
          <label className="text-xs font-bold text-blue-950">
            {labels.to} *
            <input type="text" className={`${input} mt-1 font-normal`} required />
          </label>
          <div className="grid grid-cols-4 gap-3 md:col-span-2">
            {[labels.length, labels.width, labels.height, labels.weight].map((d) => (
              <label key={d} className="text-xs font-bold text-blue-950">
                {d} *
                <input type="number" min="0" className={`${input} mt-1 font-normal`} required />
              </label>
            ))}
          </div>
          <label className="flex items-center gap-2 text-sm text-blue-950 md:col-span-2">
            <input type="checkbox" /> {labels.residential}
          </label>
          <button type="submit" className="w-fit rounded-full bg-blue-950 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-900">
            {quoteButtonLabel}
          </button>
        </form>
      ) : (
        <form className="mt-4 flex flex-col gap-3 sm:flex-row" onSubmit={(e) => e.preventDefault()}>
          <input type="text" className={input} placeholder={labels.trackingPlaceholder} aria-label={labels.trackingPlaceholder} />
          <button type="submit" className="rounded-full bg-blue-950 px-6 py-2.5 text-sm font-bold text-white hover:bg-blue-900">
            {trackButtonLabel}
          </button>
        </form>
      )}
    </div>
  );
}
