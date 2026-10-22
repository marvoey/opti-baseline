'use client';

import React, { useState } from 'react';
import {
  ShieldCheck,
  Sparkles,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  ArrowRight,
  MapPin,
  Laptop,
  DollarSign,
  Sliders,
  Eye,
  FileText,
  Clock,
  Search,
  Check,
  Zap,
  Layers,
  Info,
  Building2,
  Lock
} from 'lucide-react';

// --- INITIAL MOCK CMS DATA (Simulating Optimizely Graph Payload) ---
const INITIAL_TAX_RULES = [
  {
    id: 'rule-std-deduction',
    ruleTitle: 'Standard Deduction Thresholds',
    category: 'Deductions and Credits',
    cmsPath: '/tax-help/deductions/standard-deduction/',
    taxYear: '2025',
    thresholdAmount: '$14,600 (Single) / $29,200 (Married Joint)',
    previousAmount: '$13,850 (Single) / $27,700 (Married Joint)',
    effectiveDeadline: 'April 15, 2026',
    ruleSummary: 'The standard deduction reduces the amount of your income subject to federal tax. For the 2025 tax year, single filers can claim $14,600 and married couples filing jointly can claim $29,200 without itemizing.',
    irsComplianceDisclaimer: 'Per IRS Rev. Proc. 2024-40. Additional standard deduction applies for taxpayers aged 65 or older or blind.',
    auditStatus: 'Needs 2026 Audit',
    proposed2026: {
      taxYear: '2026',
      thresholdAmount: '$15,000 (Single) / $30,000 (Married Joint)',
      previousAmount: '$14,600 (Single) / $29,200 (Married Joint)',
      effectiveDeadline: 'April 15, 2027',
      ruleSummary: 'The standard deduction reduces the amount of your income subject to federal tax. For the 2026 tax year, single filers can claim $15,000 and married couples filing jointly can claim $30,000 without itemizing.',
      irsComplianceDisclaimer: 'Updated per IRS 2026 Inflation Adjustments (Rev. Proc. 2025-32). Verified against standard deduction tables.'
    }
  },
  {
    id: 'rule-eitc',
    ruleTitle: 'Earned Income Tax Credit (EITC) Max Credit',
    category: 'Refundable Credits',
    cmsPath: '/tax-help/tax-credits/earned-income-tax-credit/',
    taxYear: '2025',
    thresholdAmount: 'Up to $7,830 (3+ Qualifying Children)',
    previousAmount: 'Up to $7,430 (3+ Qualifying Children)',
    effectiveDeadline: 'April 15, 2026',
    ruleSummary: 'Working families with low-to-moderate income may qualify for the 2025 EITC worth up to $7,830. EITC refunds cannot be issued by the IRS before mid-February.',
    irsComplianceDisclaimer: 'Subject to PATH Act holding period. Investment income limit is $11,600 for tax year 2025.',
    auditStatus: 'Needs 2026 Audit',
    proposed2026: {
      taxYear: '2026',
      thresholdAmount: 'Up to $8,046 (3+ Qualifying Children)',
      previousAmount: 'Up to $7,830 (3+ Qualifying Children)',
      effectiveDeadline: 'April 15, 2027',
      ruleSummary: 'Working families with low-to-moderate income may qualify for the 2026 EITC worth up to $8,046. EITC refunds are subject to statutory mid-February release windows.',
      irsComplianceDisclaimer: 'Subject to PATH Act holding period. Investment income limit updated to $11,950 for tax year 2026.'
    }
  },
  {
    id: 'rule-refund-advance',
    ruleTitle: 'Early Tax Refund Advance Loan Window',
    category: 'Financial Products',
    cmsPath: '/file-taxes-options-products/refund-advance/',
    taxYear: '2025',
    thresholdAmount: '$250 to $3,500 (0% APR)',
    previousAmount: '$200 to $3,200',
    effectiveDeadline: 'February 23, 2026',
    ruleSummary: 'Get up to $3,500 the same day you file in-store or at participating Walmart locations during the 2025 filing season with a paystub or W-2.',
    irsComplianceDisclaimer: 'The Refund Advance Loan is a short-term loan issued by Republic Bank and Trust Company, Member FDIC. Subject to underwriting.',
    auditStatus: 'Needs 2026 Audit',
    proposed2026: {
      taxYear: '2026',
      thresholdAmount: '$300 to $4,000 (0% APR)',
      previousAmount: '$250 to $3,500 (0% APR)',
      effectiveDeadline: 'February 21, 2027',
      ruleSummary: 'Get up to $4,000 the same day you file in-store or at participating Walmart kiosks during the 2026 tax season with valid proof of income.',
      irsComplianceDisclaimer: '2026 Refund Advance Loan issued by Republic Bank and Trust Company, Member FDIC. $0 loan fees and 0% APR apply.'
    }
  },
  {
    id: 'rule-gig-1099',
    ruleTitle: 'Self-Employed and 1099-K Reporting Threshold',
    category: 'Self-Employment',
    cmsPath: '/tax-services/self-employment-tax/',
    taxYear: '2025',
    thresholdAmount: '$5,000 Third-Party Network Threshold',
    previousAmount: '$20,000 and 200 Transactions',
    effectiveDeadline: 'January 31, 2026 (Form Receipt)',
    ruleSummary: 'Freelancers, rideshare drivers, and online sellers receiving over $5,000 via payment apps in 2025 will receive Form 1099-K and must report business income on Schedule C.',
    irsComplianceDisclaimer: 'IRS phased implementation threshold for 2025. Standard mileage rate for 2025 is 67 cents per mile.',
    auditStatus: 'Needs 2026 Audit',
    proposed2026: {
      taxYear: '2026',
      thresholdAmount: '$2,500 Phase-In Reporting Threshold',
      previousAmount: '$5,000 Third-Party Network Threshold',
      effectiveDeadline: 'January 31, 2027 (Form Receipt)',
      ruleSummary: 'Freelancers, gig workers, and online sellers receiving over $2,500 via payment apps in 2026 will receive Form 1099-K. Deduct eligible expenses on Schedule C.',
      irsComplianceDisclaimer: 'Updated for 2026 IRS Notice phase-in schedule. Standard business mileage rate updated to 70 cents per mile.'
    }
  }
];

const INTENT_VARIANTS = {
  'refund-advance': {
    id: 'refund-advance',
    badge: '0% APR • $0 LOAN FEES • SAME-DAY ACCESS',
    intentLabel: 'Refund Advance Seeker',
    headline: 'Need Your Tax Refund Money Fast? Get Up to $4,000 Today.',
    subheadline: 'Do not wait weeks for the IRS. File with a Jackson Hewitt Tax Pro and apply for a 0% APR Refund Advance loan with same-day availability on a prepaid card or direct deposit.',
    primaryCta: 'Check Your Advance Eligibility',
    secondaryCta: 'Find Nearest Participating Office',
    trustCallout: 'Backed by our Maximum Refund and 100% Lifetime Accuracy Guarantees.',
    stats: [
      { label: 'Max Advance', value: '$4,000' },
      { label: 'Loan Fee and APR', value: '$0 / 0%' },
      { label: 'Funding Speed', value: 'Minutes' }
    ],
    icon: DollarSign,
    accentTag: 'High-Intent Topic: Refund Loans (Content Recs Signal)'
  },
  'diy-25': {
    id: 'diy-25',
    badge: '$25 FLAT FEE • FEDERAL AND STATE INCLUDED',
    intentLabel: '$25 Digital DIY Filer',
    headline: 'File Your Taxes Online for One Flat $25 Fee. No Surprise Upsells.',
    subheadline: 'Whether you have a simple W-2, unemployment income, itemized deductions, or side-hustle 1099s—pay just $25 total for Federal and State filing.',
    primaryCta: 'Start Your $25 Online Return',
    secondaryCta: 'Compare vs. TurboTax and H&R Block',
    trustCallout: 'Free live chat support included. Switch seamlessly between mobile and desktop.',
    stats: [
      { label: 'Federal + State', value: '$25 Flat' },
      { label: 'Complex Schedules', value: '$0 Extra' },
      { label: 'Hidden Upgrade Fees', value: 'None' }
    ],
    icon: Laptop,
    accentTag: 'High-Intent Topic: Flat-Fee E-Filing (Web Exp Variant B)'
  },
  'walmart-pro': {
    id: 'walmart-pro',
    badge: '5,200+ LOCATIONS • 2,600+ WALMART KIOSKS',
    intentLabel: 'In-Store / Walmart Walk-In',
    headline: 'Expert Tax Prep Right Where You Shop. Walk In or Drop Off Today.',
    subheadline: 'Meet face-to-face with a certified neighborhood Tax Pro at over 5,200 offices or inside your local Walmart—even on evenings and weekends.',
    primaryCta: 'Book a Walmart or Local Appointment',
    secondaryCta: 'Explore Drop-Off File Service',
    trustCallout: 'Over 65 million returns filed across 40+ years of trusted community service.',
    stats: [
      { label: 'Nationwide Offices', value: '5,200+' },
      { label: 'Inside Walmart Stores', value: '2,600+' },
      { label: 'Evening and Weekend', value: 'Available' }
    ],
    icon: MapPin,
    accentTag: 'High-Intent Topic: Local Branch Locator (Geo-Personalized)'
  }
};

type IntentKey = keyof typeof INTENT_VARIANTS;

export default function JacksonHewittTrojanHorsePreview() {
  const [activeIntent, setActiveIntent] = useState<IntentKey>('refund-advance');
  const [taxRules, setTaxRules] = useState(INITIAL_TAX_RULES);
  const [opalDrawerOpen, setOpalDrawerOpen] = useState(true);
  const [auditRunning, setAuditRunning] = useState(false);
  const [auditCompleted, setAuditCompleted] = useState(false);
  const [showDiffPreview, setShowDiffPreview] = useState(true);
  const [visualBuilderOverlay, setVisualBuilderOverlay] = useState(false);
  const [zipCode, setZipCode] = useState('07302');

  const currentHero = INTENT_VARIANTS[activeIntent];
  const HeroIcon = currentHero.icon;

  const handleRunOpalAudit = () => {
    setAuditRunning(true);
    setTimeout(() => {
      setAuditRunning(false);
      setAuditCompleted(true);
      setShowDiffPreview(true);
    }, 800);
  };

  const handleApproveSingleRule = (ruleId: string) => {
    setTaxRules((prev) =>
      prev.map((rule) => {
        if (rule.id === ruleId) {
          return {
            ...rule,
            taxYear: rule.proposed2026.taxYear,
            thresholdAmount: rule.proposed2026.thresholdAmount,
            previousAmount: rule.proposed2026.previousAmount,
            effectiveDeadline: rule.proposed2026.effectiveDeadline,
            ruleSummary: rule.proposed2026.ruleSummary,
            irsComplianceDisclaimer: rule.proposed2026.irsComplianceDisclaimer,
            auditStatus: 'Opal Verified 2026'
          };
        }
        return rule;
      })
    );
  };

  const handleApproveAllRules = () => {
    setTaxRules((prev) =>
      prev.map((rule) => ({
        ...rule,
        taxYear: rule.proposed2026.taxYear,
        thresholdAmount: rule.proposed2026.thresholdAmount,
        previousAmount: rule.proposed2026.previousAmount,
        effectiveDeadline: rule.proposed2026.effectiveDeadline,
        ruleSummary: rule.proposed2026.ruleSummary,
        irsComplianceDisclaimer: rule.proposed2026.irsComplianceDisclaimer,
        auditStatus: 'Opal Verified 2026'
      }))
    );
  };

  const handleResetDemo = () => {
    setTaxRules(INITIAL_TAX_RULES);
    setAuditCompleted(false);
  };

  const outdatedCount = taxRules.filter((r) => r.taxYear === '2025').length;
  const verifiedCount = taxRules.filter((r) => r.taxYear === '2026').length;

  return (
    <div className="min-h-screen bg-[#F4F6F9] text-slate-900 font-sans flex flex-col">
      {/* SA DEMO CONTROL BAR */}
      <div className="bg-slate-900 text-white border-b border-slate-700 px-4 py-2.5 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <span className="inline-flex items-center gap-1.5 bg-indigo-500/20 text-indigo-300 border border-indigo-400/30 px-2.5 py-1 rounded-md text-xs font-semibold tracking-wide">
              <Layers className="w-3.5 h-3.5" />
              <span>marvoey/opti-baseline (jackson-hewitt)</span>
            </span>
            <span className="hidden md:inline-block text-xs text-slate-400">
              <span>Experience: </span>
              <strong className="text-slate-200">Tax Season Hub (CMS SaaS Visual Builder)</strong>
            </span>
          </div>

          <div className="flex flex-wrap items-center gap-2">
            {/* Act 2 Switcher */}
            <div className="flex items-center bg-slate-800 rounded-lg p-1 border border-slate-700">
              <span className="text-[11px] font-medium text-slate-400 px-2 flex items-center gap-1">
                <Sliders className="w-3 h-3 text-amber-400" />
                <span>Act 2 Intent:</span>
              </span>
              {Object.values(INTENT_VARIANTS).map((variant) => (
                <button
                  key={variant.id}
                  onClick={() => setActiveIntent(variant.id as IntentKey)}
                  className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                    activeIntent === variant.id
                      ? 'bg-[#E31837] text-white shadow-sm'
                      : 'text-slate-300 hover:text-white hover:bg-slate-700'
                  }`}
                >
                  {variant.intentLabel}
                </button>
              ))}
            </div>

            {/* Visual Builder Inspector Toggle */}
            <button
              onClick={() => setVisualBuilderOverlay(!visualBuilderOverlay)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all cursor-pointer ${
                visualBuilderOverlay
                  ? 'bg-emerald-500/20 border-emerald-400 text-emerald-300'
                  : 'bg-slate-800 border-slate-700 text-slate-300 hover:bg-slate-700'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>{visualBuilderOverlay ? 'Hide CMS Slots' : 'Show CMS Slots'}</span>
            </button>

            {/* Act 1 Switcher */}
            <button
              onClick={() => setOpalDrawerOpen(!opalDrawerOpen)}
              className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all shadow-sm cursor-pointer ${
                opalDrawerOpen
                  ? 'bg-gradient-to-r from-indigo-600 to-purple-600 text-white'
                  : 'bg-indigo-950 text-indigo-200 border border-indigo-700 hover:bg-indigo-900'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>{opalDrawerOpen ? 'Hide Opal Agent' : 'Open Opal Agent (Act 1)'}</span>
              {outdatedCount > 0 && (
                <span className="ml-1 bg-amber-400 text-slate-950 px-1.5 py-0.5 rounded-full text-[10px] font-extrabold">
                  {outdatedCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* MAIN LAYOUT CONTAINER */}
      <div className="flex-1 flex relative overflow-hidden">
        {/* LEFT/MAIN PANE: Jackson Hewitt Live Experience Page */}
        <div className="flex-1 overflow-y-auto">
          {/* Jackson Hewitt Top Promo Banner */}
          <div className="bg-[#002D62] text-white text-xs py-2 px-4 border-b border-white/10">
            <div className="max-w-6xl mx-auto flex flex-wrap items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="bg-[#E31837] text-white font-bold px-2 py-0.5 rounded uppercase tracking-wider text-[10px]">
                  Tax Season Alert
                </span>
                <span>
                  File in-store at 5,200+ locations, inside 2,600+ Walmart stores, or online for a $25 flat rate.
                </span>
              </div>
              <div className="flex items-center gap-4 text-white/80 font-medium">
                <span className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5 text-[#E31837]" />
                  <span>Nearest Office: </span>
                  <strong>Jersey City, NJ (0.8 mi)</strong>
                </span>
                <span className="hidden sm:inline">|</span>
                <span className="hidden sm:inline">1-800-234-1040</span>
              </div>
            </div>
          </div>

          {/* Jackson Hewitt Main Navigation Header */}
          <header className="bg-white border-b border-slate-200 sticky top-0 z-30 shadow-xs">
            <div className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="flex items-center">
                  <div className="w-9 h-9 rounded-lg bg-[#003A70] flex items-center justify-center text-white font-black text-lg tracking-tighter relative">
                    <span>JH</span>
                    <span className="w-2.5 h-2.5 bg-[#E31837] rounded-full absolute -top-0.5 -right-0.5 border-2 border-white" />
                  </div>
                  <div className="ml-2.5">
                    <div className="text-[#003A70] font-black text-base leading-none tracking-tight">
                      JACKSON HEWITT
                    </div>
                    <div className="text-[#E31837] font-bold text-[10px] tracking-widest uppercase mt-0.5">
                      Tax Service
                    </div>
                  </div>
                </div>

                <nav className="hidden lg:flex items-center gap-6 ml-8 text-sm font-semibold text-slate-700">
                  <span className="text-[#003A70] border-b-2 border-[#E31837] py-5">
                    Filing Options
                  </span>
                  <span className="hover:text-[#003A70] cursor-pointer">Refund Advance</span>
                  <span className="hover:text-[#003A70] cursor-pointer">Tax Calculators and Rules</span>
                  <span className="hover:text-[#003A70] cursor-pointer">Walmart Locations</span>
                  <span className="hover:text-[#003A70] cursor-pointer">Tax Resolution</span>
                </nav>
              </div>

              <div className="flex items-center gap-3">
                <div className="hidden sm:flex items-center bg-slate-100 rounded-lg px-3 py-1.5 border border-slate-200 text-xs">
                  <MapPin className="w-3.5 h-3.5 text-[#003A70] mr-1.5" />
                  <input
                    type="text"
                    value={zipCode}
                    onChange={(e) => setZipCode(e.target.value)}
                    className="w-14 bg-transparent font-bold text-slate-800 focus:outline-none"
                    aria-label="ZIP Code"
                  />
                  <span className="text-[#003A70] font-semibold cursor-pointer hover:underline">
                    Find Office
                  </span>
                </div>
                <button className="bg-[#E31837] hover:bg-[#C4122E] text-white font-bold text-xs sm:text-sm px-4 py-2.5 rounded-lg shadow-xs transition-colors cursor-pointer">
                  Sign In to MyJH
                </button>
              </div>
            </div>
          </header>

          {/* CUSTOM COMPONENT 1: JhTaxIntentHero */}
          <section
            className={`relative bg-gradient-to-br from-[#003A70] via-[#002D62] to-[#001D40] text-white py-12 md:py-16 px-4 sm:px-6 border-b-4 border-[#E31837] transition-all ${
              visualBuilderOverlay ? 'ring-4 ring-emerald-400 ring-inset' : ''
            }`}
          >
            {visualBuilderOverlay && (
              <div className="bg-emerald-500 text-slate-950 font-mono text-xs font-bold px-3 py-1 rounded-b-md absolute top-0 left-6 z-20 shadow-md flex items-center gap-2">
                <span>Component: JhTaxIntentHero</span>
                <span className="bg-slate-900 text-emerald-300 px-1.5 py-0.5 rounded text-[10px]">
                  Personalization + Web Exp Bound
                </span>
              </div>
            )}

            <div className="max-w-6xl mx-auto">
              <div className="flex flex-wrap items-center justify-between gap-2 mb-6 pb-4 border-b border-white/15">
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 bg-white/10 backdrop-blur-xs text-amber-300 border border-amber-400/30 px-3 py-1 rounded-full text-xs font-semibold">
                    <Zap className="w-3.5 h-3.5" />
                    <span>{currentHero.accentTag}</span>
                  </span>
                </div>
                <div className="text-xs text-blue-200 flex flex-wrap items-center gap-1.5">
                  <span>Switch Intent Variant on page:</span>
                  {Object.values(INTENT_VARIANTS).map((v) => (
                    <button
                      key={v.id}
                      onClick={() => setActiveIntent(v.id as IntentKey)}
                      className={`px-2 py-0.5 rounded text-[11px] font-bold transition-all cursor-pointer ${
                        activeIntent === v.id
                          ? 'bg-white text-[#003A70]'
                          : 'bg-white/10 text-white hover:bg-white/20'
                      }`}
                    >
                      {v.intentLabel}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
                <div className="lg:col-span-7 space-y-5">
                  <div className="inline-flex items-center gap-2 bg-[#E31837] text-white text-xs font-extrabold uppercase tracking-wider px-3.5 py-1.5 rounded-full shadow-xs">
                    <HeroIcon className="w-3.5 h-3.5" />
                    <span>{currentHero.badge}</span>
                  </div>

                  <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight leading-tight">
                    {currentHero.headline}
                  </h1>

                  <p className="text-base sm:text-lg text-blue-100 leading-relaxed max-w-2xl">
                    {currentHero.subheadline}
                  </p>

                  <div className="flex flex-wrap gap-3.5 pt-2">
                    <button className="bg-[#E31837] hover:bg-[#C4122E] text-white font-bold px-6 py-3.5 rounded-xl shadow-lg transition-all flex items-center gap-2 text-sm sm:text-base cursor-pointer">
                      <span>{currentHero.primaryCta}</span>
                      <ArrowRight className="w-4 h-4" />
                    </button>
                    <button className="bg-white/10 hover:bg-white/20 text-white border border-white/25 font-semibold px-5 py-3.5 rounded-xl transition-all text-sm sm:text-base cursor-pointer">
                      {currentHero.secondaryCta}
                    </button>
                  </div>

                  <div className="pt-2 flex items-center gap-2 text-xs sm:text-sm text-blue-200">
                    <ShieldCheck className="w-4 h-4 text-emerald-400 shrink-0" />
                    <span>{currentHero.trustCallout}</span>
                  </div>
                </div>

                {/* Right Column: Dynamic Intent Conversion Card */}
                <div className="lg:col-span-5">
                  <div className="bg-white text-slate-900 rounded-2xl p-6 shadow-2xl border border-slate-100">
                    <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-4">
                      <div>
                        <span className="text-[11px] font-bold uppercase tracking-wider text-[#E31837]">
                          Jackson Hewitt Guarantee
                        </span>
                        <h3 className="text-lg font-extrabold text-[#003A70]">
                          {currentHero.intentLabel} Snapshot
                        </h3>
                      </div>
                      <div className="w-10 h-10 rounded-xl bg-blue-50 text-[#003A70] flex items-center justify-center">
                        <HeroIcon className="w-5 h-5" />
                      </div>
                    </div>

                    <div className="grid grid-cols-3 gap-2.5 mb-5">
                      {currentHero.stats.map((st, idx) => (
                        <div
                          key={idx}
                          className="bg-slate-50 border border-slate-200/80 rounded-xl p-3 text-center"
                        >
                          <div className="text-lg font-black text-[#003A70]">{st.value}</div>
                          <div className="text-[11px] font-medium text-slate-500 mt-0.5">
                            {st.label}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="bg-slate-50 rounded-xl p-4 border border-slate-200 space-y-3">
                      <div className="text-xs font-bold text-slate-700 flex items-center justify-between">
                        <span>Fast-Track Filing Check</span>
                        <span className="text-emerald-700 font-semibold flex items-center gap-1">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>
                            Tax Year {verifiedCount === taxRules.length ? '2026' : '2025/2026'} Ready
                          </span>
                        </span>
                      </div>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={zipCode}
                          onChange={(e) => setZipCode(e.target.value)}
                          placeholder="Enter ZIP Code"
                          className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-2 text-sm font-medium focus:outline-none focus:border-[#003A70]"
                        />
                        <button className="bg-[#003A70] hover:bg-[#002D62] text-white text-xs font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer">
                          Check Options
                        </button>
                      </div>
                      <p className="text-[11px] text-slate-500 leading-normal">
                        3 Walmart Supercenter kiosks and 4 Jackson Hewitt offices available within 5 miles of {zipCode}.
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* CUSTOM COMPONENT 2: JhTaxRuleCard Grid */}
          <section
            className={`max-w-6xl mx-auto px-4 sm:px-6 py-12 relative transition-all ${
              visualBuilderOverlay ? 'ring-4 ring-amber-400 ring-inset rounded-xl my-4' : ''
            }`}
          >
            {visualBuilderOverlay && (
              <div className="bg-amber-400 text-slate-950 font-mono text-xs font-bold px-3 py-1 rounded-b-md absolute top-0 left-6 z-20 shadow-md flex items-center gap-2">
                <span>Experience Section: TaxComplianceGrid (4x JhTaxRuleCard Blocks)</span>
                <span className="bg-slate-900 text-amber-300 px-1.5 py-0.5 rounded text-[10px]">
                  Structured Optimizely Graph Properties
                </span>
              </div>
            )}

            <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
              <div>
                <div className="inline-flex items-center gap-2 text-xs font-extrabold uppercase tracking-wider text-[#003A70] bg-blue-100/80 px-3 py-1 rounded-full mb-2">
                  <FileText className="w-3.5 h-3.5" />
                  <span>Official IRS Thresholds and Tax Help Center</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-[#003A70]">
                  Key Tax Deductions, Credits and Filing Thresholds
                </h2>
                <p className="text-sm text-slate-600 mt-1">
                  Structured CMS content blocks powering Jackson Hewitt calculators, landing pages, and FAQ hubs.
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-3 bg-white p-3 rounded-xl border border-slate-200 shadow-xs">
                <div className="flex items-center gap-2 px-2">
                  {outdatedCount > 0 ? (
                    <>
                      <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
                      <span className="text-xs font-bold text-slate-700">
                        <strong className="text-amber-700">{outdatedCount} Blocks</strong>
                        <span> still referencing </span>
                        <span className="underline decoration-amber-500 font-extrabold">2025 Rules</span>
                      </span>
                    </>
                  ) : (
                    <>
                      <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                      <span className="text-xs font-bold text-emerald-800">
                        All {verifiedCount} Blocks Verified for 2026 Tax Season!
                      </span>
                    </>
                  )}
                </div>

                {outdatedCount > 0 ? (
                  <button
                    onClick={() => {
                      setOpalDrawerOpen(true);
                      handleRunOpalAudit();
                    }}
                    className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white text-xs font-bold px-3.5 py-2 rounded-lg shadow-xs flex items-center gap-1.5 transition-all cursor-pointer"
                  >
                    <Sparkles className="w-3.5 h-3.5" />
                    <span>Run Opal 2025 to 2026 Audit</span>
                  </button>
                ) : (
                  <button
                    onClick={handleResetDemo}
                    className="bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-semibold px-3 py-1.5 rounded-lg flex items-center gap-1 transition-all cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Reset to 2025 State</span>
                  </button>
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {taxRules.map((rule) => {
                const isOutdated = rule.taxYear === '2025';
                return (
                  <div
                    key={rule.id}
                    className={`bg-white rounded-2xl border-2 transition-all p-6 flex flex-col justify-between shadow-sm relative overflow-hidden ${
                      isOutdated
                        ? 'border-amber-300/90 hover:border-amber-400'
                        : 'border-emerald-500/80 hover:border-emerald-600'
                    }`}
                  >
                    <div>
                      <div className="flex flex-wrap items-center justify-between gap-2 mb-4">
                        <span className="text-[11px] font-bold uppercase tracking-wider px-2.5 py-0.5 rounded bg-slate-100 text-slate-700">
                          {rule.category}
                        </span>

                        {isOutdated ? (
                          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full bg-amber-100 text-amber-900 border border-amber-300">
                            <AlertTriangle className="w-3.5 h-3.5 text-amber-600" />
                            <span>Tax Year {rule.taxYear} (Outdated Token)</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 text-xs font-extrabold px-3 py-1 rounded-full bg-emerald-100 text-emerald-900 border border-emerald-300">
                            <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                            <span>Tax Year {rule.taxYear} • Opal Verified</span>
                          </span>
                        )}
                      </div>

                      <h3 className="text-xl font-extrabold text-[#003A70] mb-3">
                        {rule.ruleTitle}
                      </h3>

                      <div
                        className={`rounded-xl p-4 mb-4 border ${
                          isOutdated
                            ? 'bg-amber-50/60 border-amber-200'
                            : 'bg-emerald-50/60 border-emerald-200'
                        }`}
                      >
                        <div className="flex items-baseline justify-between">
                          <span className="text-xs uppercase font-bold text-slate-500">
                            Active CMS Property (thresholdAmount):
                          </span>
                          <span className="text-[11px] font-mono text-slate-500">
                            Prior: {rule.previousAmount}
                          </span>
                        </div>
                        <div className="text-2xl font-black text-[#003A70] mt-1">
                          {rule.thresholdAmount}
                        </div>

                        {auditCompleted && showDiffPreview && isOutdated && (
                          <div className="mt-3 pt-3 border-t border-amber-200/80 flex items-center justify-between gap-2 bg-indigo-50/90 -mx-2 px-3 py-2 rounded-lg border border-indigo-200">
                            <div>
                              <div className="text-[10px] font-extrabold uppercase tracking-wider text-indigo-700 flex items-center gap-1">
                                <Sparkles className="w-3 h-3" />
                                <span>Opal Proposed 2026 Update:</span>
                              </div>
                              <div className="text-sm font-black text-indigo-950">
                                {rule.proposed2026.thresholdAmount}
                              </div>
                            </div>
                            <button
                              onClick={() => handleApproveSingleRule(rule.id)}
                              className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-3 py-1.5 rounded-lg shadow-xs flex items-center gap-1 shrink-0 cursor-pointer"
                            >
                              <Check className="w-3.5 h-3.5" />
                              <span>Approve 2026</span>
                            </button>
                          </div>
                        )}
                      </div>

                      <p className="text-sm text-slate-700 leading-relaxed mb-4">
                        {rule.ruleSummary}
                      </p>
                    </div>

                    <div className="pt-4 border-t border-slate-100 space-y-2 text-xs">
                      <div className="flex items-center justify-between text-slate-600 font-medium">
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-[#003A70]" />
                          <span>Filing Deadline: </span>
                          <strong>{rule.effectiveDeadline}</strong>
                        </span>
                        <span className="font-mono text-[11px] text-slate-400">
                          {rule.cmsPath}
                        </span>
                      </div>
                      <div className="bg-slate-50 p-2.5 rounded-lg border border-slate-200/70 text-[11px] text-slate-500 flex items-start gap-2">
                        <Lock className="w-3.5 h-3.5 text-slate-400 shrink-0 mt-0.5" />
                        <span>
                          <strong>Compliance Guardrail:</strong> {rule.irsComplianceDisclaimer}
                        </span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </section>

          {/* ACT 3 ARCHITECTURAL BRIDGE */}
          <section className="max-w-6xl mx-auto px-4 sm:px-6 pb-16">
            <div className="bg-gradient-to-r from-slate-900 via-[#002D62] to-slate-900 text-white rounded-2xl p-6 sm:p-8 shadow-xl border border-slate-700">
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6">
                <div className="space-y-2 max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 text-amber-300 text-xs font-bold uppercase tracking-wider">
                    <Building2 className="w-4 h-4" />
                    <span>Architecture and Upgrade Comparison (CMS 11 to Modern AI-First Stack)</span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-extrabold">
                    Why Structured Components Unlock Instant Agentic Automation
                  </h3>
                  <p className="text-sm text-blue-100 leading-relaxed">
                    In legacy CMS 11, tax numbers like <strong>$14,600</strong> and <strong>2025</strong> are buried inside unstructured HTML blobs—forcing editors to manually hunt through hundreds of pages. By structuring properties in <strong>Optimizely Graph + Next.js</strong>, Opal audits and updates every page in seconds with full human-in-the-loop compliance.
                  </p>
                </div>

                <div className="grid grid-cols-2 gap-3 shrink-0">
                  <div className="bg-white/10 border border-white/15 rounded-xl p-4">
                    <div className="text-xs text-blue-200">Manual CMS 11 Audit</div>
                    <div className="text-2xl font-black text-amber-300 mt-1">3 to 4 Weeks</div>
                    <div className="text-[11px] text-blue-200 mt-1">High risk of missed 2025 tokens</div>
                  </div>
                  <div className="bg-emerald-500/20 border border-emerald-400/40 rounded-xl p-4">
                    <div className="text-xs text-emerald-200">Opal + Structured CMS</div>
                    <div className="text-2xl font-black text-emerald-300 mt-1">Under 5 Mins</div>
                    <div className="text-[11px] text-emerald-200 mt-1">100% IRS disclaimer governance</div>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>

        {/* RIGHT PANE: OPAL AGENT CO-PILOT DRAWER */}
        {opalDrawerOpen && (
          <aside className="w-full sm:w-[420px] xl:w-[460px] bg-white border-l border-slate-200 shadow-2xl flex flex-col z-40 shrink-0">
            <div className="bg-gradient-to-r from-indigo-950 via-indigo-900 to-slate-900 text-white p-4 border-b border-indigo-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-lg bg-indigo-500/30 border border-indigo-400/40 flex items-center justify-center text-indigo-200">
                  <Sparkles className="w-4 h-4" />
                </div>
                <div>
                  <div className="font-extrabold text-sm flex items-center gap-2">
                    <span>Optimizely Opal Agent</span>
                    <span className="text-[10px] bg-indigo-500/40 border border-indigo-400/40 px-1.5 py-0.5 rounded font-semibold">
                      CMS + Exp Co-Pilot
                    </span>
                  </div>
                  <div className="text-[11px] text-indigo-200">
                    Workflow: Annual Tax Rule Audit and Refresh
                  </div>
                </div>
              </div>
              <button
                onClick={() => setOpalDrawerOpen(false)}
                className="text-indigo-200 hover:text-white text-xs font-semibold px-2 py-1 rounded hover:bg-white/10 cursor-pointer"
              >
                Close
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-slate-50">
              <div className="bg-white rounded-xl p-3.5 border border-slate-200 shadow-xs space-y-2.5">
                <div className="flex items-center justify-between">
                  <span className="text-[11px] font-bold uppercase tracking-wider text-indigo-700 flex items-center gap-1">
                    <Search className="w-3 h-3" />
                    <span>Agentic Prompt (Dana Oct 6 Use Case)</span>
                  </span>
                  <span className="text-[10px] font-mono bg-slate-100 px-1.5 py-0.5 rounded text-slate-600">
                    @tax_compliance_auditor
                  </span>
                </div>
                <div className="text-xs text-slate-700 bg-slate-50 p-3 rounded-lg border border-slate-200 font-medium leading-relaxed">
                  Scan all Jackson Hewitt Tax Help and Filing pages in the CMS for references to tax year <strong>2025</strong>, outdated deduction thresholds, or prior filing deadlines. Generate a structured audit table with <strong>2026 IRS inflation adjustments</strong> for human approval.
                </div>
                <div className="flex items-center justify-between pt-1">
                  <button
                    onClick={handleRunOpalAudit}
                    disabled={auditRunning}
                    className="w-full bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-400 text-white font-bold text-xs py-2.5 px-4 rounded-lg shadow-xs flex items-center justify-center gap-2 transition-all cursor-pointer"
                  >
                    {auditRunning ? (
                      <>
                        <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                        <span>Scanning Optimizely Graph Content Items...</span>
                      </>
                    ) : (
                      <>
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>{auditCompleted ? 'Re-Run 2025 to 2026 Tax Audit' : 'Execute 2025 to 2026 CMS Audit'}</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {auditCompleted ? (
                <div className="space-y-4">
                  <div className="bg-indigo-950 text-white rounded-xl p-4 border border-indigo-800 shadow-sm space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-indigo-200 flex items-center gap-1.5">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                        <span>Graph Audit Complete (0.8s)</span>
                      </span>
                      <span className="text-[11px] bg-white/10 px-2 py-0.5 rounded font-mono">
                        4 Content Blocks Matched
                      </span>
                    </div>
                    <p className="text-xs text-indigo-100 leading-relaxed">
                      Found <strong>{outdatedCount} remaining blocks</strong> with taxYear 2025 tokens. Proposed 2026 IRS inflation updates are staged below for 1-click editorial approval.
                    </p>
                    {outdatedCount > 0 ? (
                      <button
                        onClick={handleApproveAllRules}
                        className="w-full bg-emerald-500 hover:bg-emerald-600 text-slate-950 font-extrabold text-xs py-2.5 px-4 rounded-lg shadow-md flex items-center justify-center gap-1.5 transition-all cursor-pointer"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>Approve and Publish All {outdatedCount} Updates to CMS</span>
                      </button>
                    ) : (
                      <div className="bg-emerald-500/20 border border-emerald-400/40 text-emerald-200 text-xs font-bold p-2.5 rounded-lg text-center">
                        All 4 CMS Blocks Published with 2026 Thresholds!
                      </div>
                    )}
                  </div>

                  <div className="space-y-2.5">
                    <div className="flex items-center justify-between px-1">
                      <span className="text-xs font-extrabold text-slate-700 uppercase tracking-wider">
                        Staged Property Diffs
                      </span>
                      <button
                        onClick={() => setShowDiffPreview(!showDiffPreview)}
                        className="text-[11px] text-indigo-600 font-semibold hover:underline cursor-pointer"
                      >
                        {showDiffPreview ? 'Hide On-Page Highlights' : 'Show On-Page Highlights'}
                      </button>
                    </div>

                    {taxRules.map((rule) => {
                      const isUpdated = rule.taxYear === '2026';
                      const initialRule = INITIAL_TAX_RULES.find((r) => r.id === rule.id);
                      return (
                        <div
                          key={rule.id}
                          className={`rounded-xl p-3.5 border text-xs transition-all ${
                            isUpdated
                              ? 'bg-emerald-50/70 border-emerald-200'
                              : 'bg-white border-slate-200 shadow-2xs'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-2 mb-1.5">
                            <span className="font-bold text-slate-900">{rule.ruleTitle}</span>
                            {isUpdated ? (
                              <span className="text-[10px] font-extrabold bg-emerald-200 text-emerald-900 px-2 py-0.5 rounded-full">
                                Published 2026
                              </span>
                            ) : (
                              <button
                                onClick={() => handleApproveSingleRule(rule.id)}
                                className="text-[11px] font-bold bg-indigo-600 hover:bg-indigo-700 text-white px-2.5 py-1 rounded-md cursor-pointer"
                              >
                                Approve Diff
                              </button>
                            )}
                          </div>

                          <div className="text-[11px] font-mono text-slate-400 mb-2">
                            {rule.cmsPath}
                          </div>

                          <div className="grid grid-cols-1 gap-1.5 bg-slate-50 p-2.5 rounded-lg border border-slate-200/80">
                            <div className="flex items-center justify-between text-rose-700 line-through opacity-75">
                              <span>2025:</span>
                              <span className="font-bold">{initialRule ? initialRule.thresholdAmount : ''}</span>
                            </div>
                            <div className="flex items-center justify-between text-emerald-700 font-bold">
                              <span>2026:</span>
                              <span>{rule.proposed2026.thresholdAmount}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              ) : (
                <div className="bg-white rounded-xl p-5 border border-dashed border-slate-300 text-center space-y-2">
                  <Sparkles className="w-7 h-7 text-indigo-500 mx-auto" />
                  <div className="text-xs font-bold text-slate-800">
                    Ready to Audit 4 Live Tax Rule Blocks
                  </div>
                  <p className="text-[11px] text-slate-500 leading-relaxed">
                    Click <strong>Execute 2025 to 2026 CMS Audit</strong> above to demonstrate how Opal scans structured content items and stages compliant 2026 IRS updates.
                  </p>
                </div>
              )}

              <div className="bg-amber-50 border border-amber-200 rounded-xl p-3.5 space-y-2">
                <div className="text-[11px] font-extrabold uppercase tracking-wider text-amber-900 flex items-center gap-1.5">
                  <Info className="w-3.5 h-3.5 text-amber-700" />
                  <span>SA Trojan Horse Discovery Pivot</span>
                </div>
                <p className="text-xs text-amber-950 leading-relaxed font-medium">
                  <strong>Ask Dana right after clicking Approve:</strong>
                  <br />
                  When your team does this 2025-to-2026 audit manually today across your site, how many pages are we talking about—and if we wait until August 2027, does that not mean doing this by hand for two more tax seasons?
                </p>
              </div>
            </div>
          </aside>
        )}
      </div>
    </div>
  );
}
