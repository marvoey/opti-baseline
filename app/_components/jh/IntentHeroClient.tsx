'use client';

import { useState } from 'react';

type EditAttrs = Record<string, string | undefined>;

export type HeroVariant = {
  id: string;
  label: string;
  audience: string;
  hypothesis: string;
  badge: string;
  headline: string;
  subheadline: string;
  cta: string;
  /** `pa()` attributes computed on the server so on-page editing overlays attach. */
  edit: { headline: EditAttrs; subheadline: EditAttrs; cta: EditAttrs; hypothesis: EditAttrs };
};

type Props = { variants: HeroVariant[] };

export default function IntentHeroClient({ variants }: Props) {
  // Demo A/B/n switcher: simulates Optimizely Web Experimentation bucketing on the homepage banner.
  const [activeId, setActiveId] = useState(variants[0]?.id);
  const current = variants.find((v) => v.id === activeId) ?? variants[0];

  return (
    <>
      <div className="max-w-6xl mx-auto mb-8 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 text-xs">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <span className="font-bold text-jh-gold uppercase tracking-wider">
            🎯 Optimizely Web Experimentation: Homepage Banner A/B/n
          </span>
          <div className="flex flex-wrap gap-2">
            {variants.map((v) => (
              <button
                key={v.id}
                type="button"
                onClick={() => setActiveId(v.id)}
                className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                  current.id === v.id
                    ? 'bg-jh-red text-white shadow-md'
                    : 'bg-white/10 text-white/80 hover:bg-white/20'
                }`}
              >
                {v.id === 'control' ? v.label : `${v.label} · ${v.audience.split(' ')[0]}`}
              </button>
            ))}
          </div>
        </div>
        <p className="mt-3 text-slate-200 leading-relaxed">
          <span className="font-bold text-jh-gold">{current.audience} · Hypothesis: </span>
          <span {...current.edit.hypothesis}>{current.hypothesis}</span>
        </p>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 bg-jh-gold/20 border border-jh-gold/40 text-jh-gold text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            {current.badge}
          </div>
          <h1
            {...current.edit.headline}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4 text-white"
          >
            {current.headline}
          </h1>
          <p
            {...current.edit.subheadline}
            className="text-base sm:text-lg text-slate-200 mb-6 leading-relaxed max-w-2xl"
          >
            {current.subheadline}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <a
              href="#cta"
              {...current.edit.cta}
              className="px-8 py-4 bg-jh-red hover:bg-jh-red-hover text-white font-bold rounded-lg text-base shadow-lg transition-transform hover:scale-105"
            >
              {current.cta} →
            </a>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="text-jh-gold text-lg">★</span>
              <span>Maximum Refund &amp; 100% Accuracy Guarantees</span>
            </div>
          </div>
        </div>

        {/* Quick Office Locator Card */}
        <div className="lg:col-span-5 bg-white text-slate-900 p-6 sm:p-8 rounded-2xl shadow-2xl border border-slate-100">
          <h3 className="text-xl font-bold text-jh-navy mb-1">Find a Tax Pro or Walmart Kiosk</h3>
          <p className="text-xs text-slate-500 mb-4">Enter your ZIP code to see nearby offices and available hours.</p>
          <div className="flex gap-2 mb-4">
            <input
              type="text"
              placeholder="Enter ZIP code (e.g. 07302)"
              aria-label="ZIP code"
              className="flex-1 border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-jh-navy"
            />
            <button
              type="button"
              className="bg-jh-navy hover:bg-jh-navy-dark text-white font-bold px-5 py-3 rounded-lg text-sm transition-colors"
            >
              Search
            </button>
          </div>
          <div className="text-[11px] text-slate-500 flex items-center justify-between border-t border-slate-100 pt-3">
            <span>✓ In-Person & Drop-Off</span>
            <span>✓ Bilingual Pros Available</span>
            <span>✓ No Appointment Needed</span>
          </div>
        </div>
      </div>
    </>
  );
}
