'use client';

import { useState } from 'react';
import { ArrowRight, DollarSign, Laptop, MapPin, ShieldCheck, Sparkles, Zap } from 'lucide-react';

export type IntentKey = 'default' | 'walmart' | 'online' | 'advance';

/** Copy resolved from CMS properties on the server (falls back to demo defaults). */
export type IntentCopy = {
  badge: string;
  headline: string;
  subheadline: string;
  cta: string;
};

type EditAttrs = Record<string, string | undefined>;

type Props = {
  copy: Record<IntentKey, IntentCopy>;
  /** `pa()` attributes computed on the server so on-page editing overlays attach. */
  edit: { headline: EditAttrs; subheadline: EditAttrs; badge: EditAttrs; cta: EditAttrs };
};

const INTENTS: Record<
  IntentKey,
  {
    label: string;
    tag: string;
    secondaryCta: string;
    trust: string;
    stats: { label: string; value: string }[];
    Icon: typeof Zap;
  }
> = {
  default: {
    label: 'Default',
    tag: 'Control: all visitors',
    secondaryCta: 'Explore Filing Options',
    trust: 'Over 65 million returns filed across 40+ years of trusted community service.',
    stats: [
      { label: 'Nationwide Offices', value: '5,200+' },
      { label: 'Online Filing', value: '$25' },
      { label: 'Accuracy Guarantee', value: '100%' },
    ],
    Icon: Sparkles,
  },
  walmart: {
    label: 'Walmart Walk-In',
    tag: 'Audience: Walmart shopper (Personalization)',
    secondaryCta: 'Explore Drop-Off File Service',
    trust: 'Over 65 million returns filed across 40+ years of trusted community service.',
    stats: [
      { label: 'Nationwide Offices', value: '5,200+' },
      { label: 'Inside Walmart Stores', value: '2,600+' },
      { label: 'Evening and Weekend', value: 'Available' },
    ],
    Icon: MapPin,
  },
  online: {
    label: '$25 DIY Online',
    tag: 'Audience: flat-fee e-filer (Web Experiment variant B)',
    secondaryCta: 'Compare vs. TurboTax and H&R Block',
    trust: 'Free live chat support included. Switch seamlessly between mobile and desktop.',
    stats: [
      { label: 'Federal + State', value: '$25 Flat' },
      { label: 'Complex Schedules', value: '$0 Extra' },
      { label: 'Hidden Upgrade Fees', value: 'None' },
    ],
    Icon: Laptop,
  },
  advance: {
    label: 'Refund Advance',
    tag: 'Audience: cash-first filer (Web Experiment variant C)',
    secondaryCta: 'Find Nearest Participating Office',
    trust: 'Backed by our Maximum Refund and 100% Lifetime Accuracy Guarantees.',
    stats: [
      { label: 'Max Advance', value: '$4,000' },
      { label: 'Loan Fee and APR', value: '$0 / 0%' },
      { label: 'Funding Speed', value: 'Minutes' },
    ],
    Icon: DollarSign,
  },
};

const ORDER: IntentKey[] = ['default', 'walmart', 'online', 'advance'];

export default function IntentHeroClient({ copy, edit }: Props) {
  const [active, setActive] = useState<IntentKey>('default');
  const [zip, setZip] = useState('07302');

  const meta = INTENTS[active];
  const current = copy[active];
  const Icon = meta.Icon;

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex flex-wrap items-center justify-between gap-2 mb-6 pb-4 border-b border-white/15">
        <span className="inline-flex items-center gap-1.5 bg-white/10 text-jh-gold border border-jh-gold/30 px-3 py-1 rounded-full text-xs font-semibold">
          <Zap className="w-3.5 h-3.5" />
          <span>{meta.tag}</span>
        </span>
        <div className="text-xs text-blue-200 flex flex-wrap items-center gap-1.5">
          <span>Optimizely Experimentation simulator:</span>
          {ORDER.map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                active === key ? 'bg-white text-jh-navy' : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              {INTENTS[key].label}
            </button>
          ))}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7 space-y-5">
          <div
            {...edit.badge}
            className="inline-flex items-center gap-2 bg-jh-red text-white text-xs font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full"
          >
            <Icon className="w-3.5 h-3.5" />
            <span>{current.badge}</span>
          </div>

          <h1
            {...edit.headline}
            className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight"
          >
            {current.headline}
          </h1>

          <p {...edit.subheadline} className="text-base sm:text-lg text-blue-100 leading-relaxed max-w-2xl">
            {current.subheadline}
          </p>

          <div className="flex flex-wrap gap-3.5 pt-2">
            <button
              type="button"
              {...edit.cta}
              className="bg-jh-red hover:bg-jh-red-hover text-white font-bold px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer"
            >
              <span>{current.cta}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
            <button
              type="button"
              className="bg-white/10 hover:bg-white/20 text-white border border-white/25 font-semibold px-5 py-3.5 rounded-xl transition-all text-sm sm:text-base cursor-pointer"
            >
              {meta.secondaryCta}
            </button>
          </div>

          <div className="pt-2 flex items-center gap-2 text-xs sm:text-sm text-blue-200">
            <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{meta.trust}</span>
          </div>
        </div>

        <div className="lg:col-span-5">
          <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-100">
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
              <div>
                <span className="text-[11px] font-bold uppercase tracking-wider text-jh-red">
                  Jackson Hewitt Guarantee
                </span>
                <h3 className="text-lg font-extrabold text-jh-navy">{meta.label} Snapshot</h3>
              </div>
              <div className="w-10 h-10 rounded-xl bg-blue-50 text-jh-navy flex items-center justify-center">
                <Icon className="w-5 h-5" />
              </div>
            </div>

            <div className="grid grid-cols-3 gap-2.5 mb-5">
              {meta.stats.map((stat) => (
                <div key={stat.label} className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center">
                  <div className="text-lg font-black text-jh-navy">{stat.value}</div>
                  <div className="text-[11px] font-medium text-slate-500 mt-0.5">{stat.label}</div>
                </div>
              ))}
            </div>

            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
              <div className="text-xs font-bold text-slate-700">Find an office or Walmart kiosk</div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={zip}
                  onChange={(e) => setZip(e.target.value)}
                  placeholder="Enter ZIP code"
                  aria-label="ZIP code"
                  className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-jh-navy"
                />
                <button
                  type="button"
                  className="bg-jh-navy hover:bg-jh-navy-dark text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer"
                >
                  Check Options
                </button>
              </div>
              <p className="text-[11px] text-slate-500 leading-normal">
                3 Walmart Supercenter kiosks and 4 Jackson Hewitt offices available within 5 miles of {zip || 'your ZIP'}.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
