# Jackson Hewitt Demo: `opti-baseline` Customization & Build Guide

**Repository:** `marvoey/opti-baseline`  
**Target Branch:** `jackson-hewitt` (or `jh-trojan-horse`)  
**Stack:** Next.js 16+ (App Router), React 19, `@optimizely/cms-sdk` v2, `@optimizely/cms-cli` v2, Tailwind CSS v4, Optimizely Graph  
**Companion Artifacts:**
- [Jackson Hewitt - Staging the Trojan Horse Demo Step-by-Step](https://opal.optimizely.com/instances/61b98dd5a2f74189ae83e20cb9a0c3d0/artifacts?artifactId=dbcts929io6g00avm7rg&spaceId=dav914a9io6g00f1grb0)
- [Jackson Hewitt MarkAI Discovery - Sandler Playbook](https://opal.optimizely.com/instances/61b98dd5a2f74189ae83e20cb9a0c3d0/artifacts?artifactId=dav914i9io6g00f1grc0&spaceId=dav914a9io6g00f1grb0)

---

## 1. Architectural Strategy: The Trojan Horse Live Environment

To prove to Dana Justin (Content Lead) and Matthew Montag (Technical Lead) that **CMS SaaS + Opal** eliminates the painful CMS 11-to-13 upgrade treadmill, your front-end must achieve two objectives:

1. **Visually Mirror Authentic Jackson Hewitt:** Adopt their brand palette (Deep Navy `#0A2540`, High-Impact Red `#D32F2F`, Tax Refund Gold `#FFB81C`) and navigation chrome so they immediately recognize their brand.
2. **Expose the Trojan Horse Capabilities in Clean UI:**
   - **Act 1 (Annual Content Audit):** A side-by-side **2025 vs. 2026 Tax Rule Audit Block** showing how Opal sweeps, detects, and updates outdated thresholds ($14,600 → $15,000 standard deduction).
   - **Act 2 (Experimentation & Intent Variations):** A dynamic **Intent Switcher** showing how one page serves 3 distinct audiences (Walmart Walk-In, $25 DIY Online, and Refund Advance Seeker) using Optimizely Web Experimentation & Personalization.
   - **Act 3 (Headless Next.js Proof):** Demonstrates to Matthew that Next.js React Server Components with `@optimizely/cms-sdk` v2 provide sub-second loads and full Visual Builder on-page editing (`getPreviewUtils`).

---

## 2. Step 1: Branch Setup & Brand Token Configuration

### 2.1 Branch Creation
```bash
git checkout main
git pull origin main
git checkout -b jh-trojan-horse
```

### 2.2 Brand Colors in Tailwind v4 (`app/globals.css`)
Update the theme tokens in `app/globals.css` to match the Jackson Hewitt design system:

```css
@import "tailwindcss";

@theme {
  /* Jackson Hewitt Official Palette */
  --color-jh-navy: #0A2540;       /* Primary Header / Hero Background */
  --color-jh-navy-dark: #06182B;  /* Deep Navy for Footers / Overlays */
  --color-jh-red: #D32F2F;        /* Primary Accent / Call to Action */
  --color-jh-red-hover: #B71C1C;  /* CTA Hover State */
  --color-jh-gold: #FFB81C;       /* Guarantee / Refund Callouts */
  --color-jh-gold-light: #FFF8E7; /* Highlight backgrounds */
  --color-jh-slate: #4A5568;      /* Body typography */
  --color-jh-surface: #F8FAFC;    /* Subtle page background */

  /* Map standard theme tokens to JH colors */
  --color-brand-primary: var(--color-jh-navy);
  --color-brand-accent: var(--color-jh-red);
  --color-brand-highlight: var(--color-jh-gold);
}
```

### 2.3 Site Chrome & Navigation (`lib/siteConfig.ts`)
Configure `lib/siteConfig.ts` with authentic Jackson Hewitt navigation links and locator triggers:

```typescript
export const siteConfig = {
  name: "Jackson Hewitt Tax Services",
  shortName: "Jackson Hewitt",
  tagline: "Tax Preparation & Maximum Refund Guarantee",
  logoUrl: "https://www.jacksonhewitt.com/globalassets/logos/jh-logo.svg", // Or local SVG in /public
  phone: "1-800-234-1040",
  mainNav: [
    { title: "File with a Tax Pro", href: "/file-taxes-options-products/file-in-store" },
    { title: "File Online ($25)", href: "/file-taxes-options-products/file-taxes-online" },
    { title: "Walmart Locations", href: "/file-taxes-options-products/file-taxes-walmart" },
    { title: "Refund Advance", href: "/file-taxes-options-products/refund-advance" },
    { title: "Tax Tools & Calculators", href: "/tax-tools/tax-refund-calculators" },
  ],
  topBanner: {
    text: "TAX SEASON 2026: Get up to $3,500 with a Refund Advance loan in as little as 24 hours.",
    ctaLabel: "Check Eligibility",
    ctaHref: "/file-taxes-options-products/refund-advance",
  },
  locatorCta: {
    label: "Find an Office / Walmart",
    href: "/en/office-locator",
  },
};
```

---

## 3. Step 2: Build the Trojan Horse CMS Components

Create these components inside `cms/` so they are fully registered with `@optimizely/cms-sdk` and discoverable by the CMS SaaS Visual Builder.

### Component A: The Multi-Intent Hero (`cms/JhTaxIntentHero.tsx`)
This component demonstrates Act 2: serving 3 different audience cohorts from a single CMS content model.

```tsx
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { useState } from 'react';

export const JhTaxIntentHeroContentType = contentType({
  key: 'JhTaxIntentHero',
  baseType: '_component',
  displayName: 'JH Tax Intent Hero Banner',
  description: 'Hero section with dynamic intent switching for Walmart In-Store, $25 DIY, and Refund Advance.',
  properties: {
    Headline: { type: 'string', displayName: 'Default Headline', isLocalized: true },
    Subheadline: { type: 'string', displayName: 'Default Subheadline', isLocalized: true },
    WalmartHeadline: { type: 'string', displayName: 'Walmart Audience Headline' },
    OnlineHeadline: { type: 'string', displayName: 'DIY Online Headline' },
    AdvanceHeadline: { type: 'string', displayName: 'Refund Advance Headline' },
    CtaLabel: { type: 'string', displayName: 'CTA Button Text' },
    BadgeText: { type: 'string', displayName: 'Top Badge Text' },
  },
});

type Props = {
  content: ContentProps<typeof JhTaxIntentHeroContentType>;
};

export default function JhTaxIntentHero({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  // Demo Intent Switcher: Simulates Optimizely Web Experimentation / Personalization audience bucketing
  const [activeIntent, setActiveIntent] = useState<'default' | 'walmart' | 'online' | 'advance'>('default');

  const intentContent = {
    default: {
      tag: content.BadgeText || "2026 Tax Season Ready",
      headline: content.Headline || "Maximum Refund Guaranteed. In-Store or Online.",
      subhead: content.Subheadline || "File with over 5,200 local Tax Pros, inside Walmart, or file yourself online for just $25.",
      cta: content.CtaLabel || "Find Your Nearest Location",
      highlight: "Over 65 Million Returns Filed",
    },
    walmart: {
      tag: "🏬 Walmart Shopper Audience (Optimizely Personalization)",
      headline: content.WalmartHeadline || "Your Local Neighborhood Tax Pro — Right Inside Walmart",
      subhead: "No appointment needed. Drop off your documents while you shop or sit with an expert.",
      cta: "Find a Walmart Kiosk Near You",
      highlight: "Available at 3,000+ Walmart Stores",
    },
    online: {
      tag: "💻 DIY Digital Audience (Experiment Variation B)",
      headline: content.OnlineHeadline || "Transparent Pricing: File Federal & State for Just $25",
      subhead: "No price jumps, no hidden fees. All forms included, backed by our 100% Accuracy Guarantee.",
      cta: "Start Filing Online Now ($25)",
      highlight: "Guaranteed Flat Rate, Simple or Complex",
    },
    advance: {
      tag: "⚡ Cash-First Audience (Experiment Variation C)",
      headline: content.AdvanceHeadline || "Need Your Money Now? Get Up to $3,500 in 24 Hours",
      subhead: "Early Refund Advance loan with 0% APR and $0 loan fees. Apply when you file with us.",
      cta: "Check Refund Advance Eligibility",
      highlight: "0% APR • $0 Loan Fees",
    },
  };

  const current = intentContent[activeIntent];

  return (
    <section className="bg-gradient-to-b from-jh-navy via-[#0c2e50] to-[#0A2540] text-white py-14 px-4 sm:px-6 relative overflow-hidden">
      {/* Intent Testing Control Bar (Visible in SA Demo) */}
      <div className="max-w-6xl mx-auto mb-8 bg-white/10 backdrop-blur-md p-3 rounded-xl border border-white/20 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <span className="font-bold text-jh-gold uppercase tracking-wider">🎯 Optimizely Experimentation Simulator:</span>
          <span className="text-slate-300">Switch Audience Persona:</span>
        </div>
        <div className="flex gap-2">
          {(['default', 'walmart', 'online', 'advance'] as const).map((intent) => (
            <button
              key={intent}
              onClick={() => setActiveIntent(intent)}
              className={`px-3 py-1.5 rounded-lg font-bold transition-all ${
                activeIntent === intent
                  ? 'bg-jh-red text-white shadow-md'
                  : 'bg-white/10 text-white/80 hover:bg-white/20'
              }`}
            >
              {intent.toUpperCase()}
            </button>
          ))}
        </div>
      </div>

      <div className="max-w-6xl mx-auto grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        <div className="lg:col-span-7">
          <div className="inline-flex items-center gap-2 bg-jh-gold/20 border border-jh-gold/40 text-jh-gold text-xs font-bold px-3 py-1 rounded-full uppercase tracking-wider mb-4">
            {current.tag}
          </div>
          <h1
            {...pa('Headline')}
            className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight mb-4 text-white"
          >
            {current.headline}
          </h1>
          <p
            {...pa('Subheadline')}
            className="text-base sm:text-lg text-slate-200 mb-6 leading-relaxed max-w-2xl"
          >
            {current.subhead}
          </p>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
            <a
              href="#cta"
              className="px-8 py-4 bg-jh-red hover:bg-jh-red-hover text-white font-bold rounded-lg text-base shadow-lg transition-transform hover:scale-105"
            >
              {current.cta} →
            </a>
            <div className="flex items-center gap-2 text-xs text-slate-300">
              <span className="text-jh-gold text-lg">★</span>
              <span>{current.highlight}</span>
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
              className="flex-1 border border-slate-300 rounded-lg px-4 py-3 text-sm focus:outline-none focus:ring-2 focus:ring-jh-navy"
            />
            <button className="bg-jh-navy hover:bg-jh-navy-dark text-white font-bold px-5 py-3 rounded-lg text-sm transition-colors">
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
    </section>
  );
}
```

---

### Component B: The Tax Rule Audit & Refresh Block (`cms/JhTaxRuleAuditBlock.tsx`)
This component is the centerpiece of **Act 1**. It showcases how outdated 2025 tax data is detected, flagged, and refreshed to 2026 guidelines by Opal.

```tsx
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { useState } from 'react';

export const JhTaxRuleAuditBlockContentType = contentType({
  key: 'JhTaxRuleAuditBlock',
  baseType: '_component',
  displayName: 'JH Tax Rule 2025/2026 Audit Block',
  description: 'Interactive tax threshold comparison table demonstrating Opal AI content audit capabilities.',
  properties: {
    Title: { type: 'string', displayName: 'Section Title', isLocalized: true },
    Description: { type: 'string', displayName: 'Section Description', isLocalized: true },
  },
});

type Props = {
  content: ContentProps<typeof JhTaxRuleAuditBlockContentType>;
};

export default function JhTaxRuleAuditBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  // Toggle between Legacy 2025 Content and Opal-Refreshed 2026 Content
  const [isAudited, setIsAudited] = useState<boolean>(false);

  const rulesData = [
    {
      topic: "Standard Deduction (Single)",
      legacy2025: "$14,600",
      refreshed2026: "$15,000",
      irsRef: "Rev. Proc. 2025-XX / IRS Sec. 63(c)",
      status: "Updated +$400",
    },
    {
      topic: "Standard Deduction (Married Filing Jointly)",
      legacy2025: "$29,200",
      refreshed2026: "$30,000",
      irsRef: "Rev. Proc. 2025-XX / IRS Sec. 63(c)",
      status: "Updated +$800",
    },
    {
      topic: "Standard Deduction (Head of Household)",
      legacy2025: "$21,900",
      refreshed2026: "$22,500",
      irsRef: "Rev. Proc. 2025-XX / IRS Sec. 63(c)",
      status: "Updated +$600",
    },
    {
      topic: "Maximum EITC (3+ Qualifying Children)",
      legacy2025: "$7,830",
      refreshed2026: "$8,046",
      irsRef: "IRS Form 1040 Schedule EIC",
      status: "Updated +$216",
    },
    {
      topic: "General Tax Filing Deadline",
      legacy2025: "April 15, 2025",
      refreshed2026: "April 15, 2026",
      irsRef: "Statutory Filing Calendar",
      status: "Calendar Year Adjusted",
    },
  ];

  return (
    <section className="py-12 px-4 max-w-6xl mx-auto">
      {/* Header & Agent Trigger Demo Bar */}
      <div className="bg-jh-gold-light border-2 border-dashed border-jh-gold p-6 rounded-2xl mb-8 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="bg-jh-navy text-white text-xs font-bold px-2.5 py-1 rounded">
              🤖 Opal Content Audit Agent
            </span>
            <span className="text-xs font-bold text-amber-900">
              {isAudited ? "STATUS: 2026 Tax Rules Applied via Workflow" : "STATUS: Legacy 2025 Rules Detected (Out of Date)"}
            </span>
          </div>
          <h2 {...pa('Title')} className="text-xl font-bold text-jh-navy mt-2">
            {content.Title || "Tax Law & Threshold Integrity Check"}
          </h2>
          <p {...pa('Description')} className="text-xs text-slate-600 mt-1">
            Simulating Dana's requirement: Auditing site taxonomy for outdated 2025 tax rules and bulk-refreshing to 2026.
          </p>
        </div>

        <button
          onClick={() => setIsAudited(!isAudited)}
          className={`px-5 py-3 rounded-lg font-bold text-xs uppercase tracking-wider transition-all shadow-md ${
            isAudited
              ? "bg-slate-700 text-white hover:bg-slate-800"
              : "bg-jh-red text-white hover:bg-jh-red-hover animate-pulse"
          }`}
        >
          {isAudited ? "↺ Revert to 2025 Unaudited State" : "⚡ Run Opal 2026 Tax Audit"}
        </button>
      </div>

      {/* Rules Diff Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="p-4 bg-slate-50 border-b border-slate-200 flex justify-between items-center text-xs text-slate-500 font-medium">
          <span>Threshold Parameter</span>
          <span className="flex gap-4">
            <span className="w-28 text-right">Published Content</span>
            <span className="w-28 text-right">Audit Status</span>
          </span>
        </div>

        <div className="divide-y divide-slate-100">
          {rulesData.map((item, idx) => (
            <div key={idx} className="p-4 flex flex-col sm:flex-row sm:items-center justify-between gap-2 hover:bg-slate-50/50 transition-colors">
              <div>
                <span className="text-sm font-bold text-jh-navy block">{item.topic}</span>
                <span className="text-[11px] text-slate-400 font-mono">{item.irsRef}</span>
              </div>

              <div className="flex items-center gap-4">
                <div className="w-28 text-right">
                  <span
                    className={`font-mono text-sm font-bold px-2 py-1 rounded transition-colors ${
                      isAudited
                        ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                        : "bg-rose-50 text-rose-700 border border-rose-200 line-through"
                    }`}
                  >
                    {isAudited ? item.refreshed2026 : item.legacy2025}
                  </span>
                </div>

                <div className="w-28 text-right">
                  <span
                    className={`text-[11px] font-bold px-2 py-0.5 rounded-full ${
                      isAudited
                        ? "bg-emerald-100 text-emerald-800"
                        : "bg-amber-100 text-amber-800"
                    }`}
                  >
                    {isAudited ? item.status : "Needs Audit"}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

---

## 4. Step 3: Register Components in `cms/registry.ts`

Ensure both components are exported in your component registry so the Next.js catch-all page route `app/[locale]/[[...slug]]/page.tsx` renders them dynamically:

```typescript
// cms/registry.ts
import JhTaxIntentHero, { JhTaxIntentHeroContentType } from './JhTaxIntentHero';
import JhTaxRuleAuditBlock, { JhTaxRuleAuditBlockContentType } from './JhTaxRuleAuditBlock';

export const COMPONENT_MAP = {
  JhTaxIntentHero: {
    Component: JhTaxIntentHero,
    contentType: JhTaxIntentHeroContentType,
  },
  JhTaxRuleAuditBlock: {
    Component: JhTaxRuleAuditBlock,
    contentType: JhTaxRuleAuditBlockContentType,
  },
  // Existing components...
};
```

---

## 5. Step 4: Push Schema & Seed Experience

### 5.1 Push Schema to Optimizely CMS SaaS
Run the schema synchronization tool to create the content type definitions in your CMS SaaS instance:

```bash
npx @optimizely/cms-cli push
```

### 5.2 Seeding the Jackson Hewitt Demo Experience (`scripts/seed-jh-demo.mjs`)
Create a seed script to establish the Jackson Hewitt homepage structure in the CMS:

```javascript
// scripts/seed-jh-demo.mjs
import 'dotenv/config';

const CMS_ENDPOINT = process.env.OPTIMIZELY_CMS_URL || "https://api.cms.optimizely.com";
const CMS_API_KEY = process.env.OPTIMIZELY_CMS_API_KEY;

async function seedJacksonHewitt() {
  console.log("🚀 Creating Jackson Hewitt Trojan Horse Experience in CMS SaaS...");

  const experiencePayload = {
    key: "jh-home-experience",
    displayName: "Jackson Hewitt Tax Home (2026)",
    composition: {
      type: "experience",
      children: [
        {
          key: "hero-section",
          type: "JhTaxIntentHero",
          properties: {
            Headline: "Maximum Refund Guaranteed. In-Store or Online.",
            Subheadline: "File with over 5,200 local Tax Pros, inside Walmart, or file yourself online for just $25.",
            WalmartHeadline: "Your Neighborhood Tax Pro — Right Inside Walmart",
            OnlineHeadline: "Transparent Pricing: Federal & State for Just $25",
            AdvanceHeadline: "Need Your Money Now? Get Up to $3,500 in 24 Hours",
            CtaLabel: "Find a Location Near You",
            BadgeText: "2026 Tax Season Ready",
          },
        },
        {
          key: "tax-audit-section",
          type: "JhTaxRuleAuditBlock",
          properties: {
            Title: "2026 Tax Law & Annual Threshold Integrity Audit",
            Description: "Automated scan of all published tax advice, deduction thresholds, and filing calendars.",
          },
        },
      ],
    },
  };

  // Push experience payload to CMS REST API
  const res = await fetch(`${CMS_ENDPOINT}/v1/experiences`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${CMS_API_KEY}`,
    },
    body: JSON.stringify(experiencePayload),
  });

  if (res.ok) {
    console.log("✅ Successfully seeded Jackson Hewitt Demo Experience!");
  } else {
    console.log("⚠️ Seed response:", res.status, await res.text());
  }
}

seedJacksonHewitt();
```

Execute the seed script:
```bash
node scripts/seed-jh-demo.mjs
```

---

## 6. Step 5: Demo Day Runbook (Connecting Code to the Call)

When running the demo tomorrow, execute this 4-step sequence:

```
[Step 1: The Live Next.js Experience]
  └── Open browser to the running Next.js localhost/Vercel URL.
  └── Show Dana the Jackson Hewitt branding, color tokens, and layout.

[Step 2: Act 1 - The Annual Content Audit (Dana's Pain)]
  └── Scroll to the Tax Law Integrity Block.
  └── Click "⚡ Run Opal 2026 Tax Audit".
  └── Show the $14,600 -> $15,000 threshold change and status switch.
  └── PIVOT TO DANA: "How many pages with 2025 numbers does your team audit by hand today?"

[Step 3: Act 2 - Multi-Intent Experimentation (Cat's Expansion)]
  └── Scroll to the Hero Banner.
  └── Click "WALMART", "ONLINE", and "ADVANCE" tabs.
  └── Show how the headline, subhead, and CTAs morph dynamically for each audience.
  └── PIVOT TO DANA & TEAM: "You already own Web Experimentation. What stops you from running 5 variations today?"

[Step 4: Act 3 - The Architectural Reality (Matthew's World)]
  └── Open the CMS SaaS Visual Builder editor in a side tab.
  └── Demonstrate editing a prop with live instant on-page rendering via Next.js RSC.
  └── PIVOT TO MATTHEW: "Since you're already refactoring custom code from CMS 11, moving straight to this headless Next.js model eliminates upgrade cycles forever. How open is your engineering team to Next.js?"
```

---

## 7. Verification & Launch Checklist

- [ ] `git branch` verified on `jh-trojan-horse`.
- [ ] `app/globals.css` updated with `--color-jh-navy`, `--color-jh-red`, `--color-jh-gold`.
- [ ] `lib/siteConfig.ts` updated with Jackson Hewitt logo, phone, and office locator.
- [ ] `cms/JhTaxIntentHero.tsx` created and exported.
- [ ] `cms/JhTaxRuleAuditBlock.tsx` created and exported.
- [ ] `cms/registry.ts` registers both new components.
- [ ] `npm run dev` executed; verified layout renders cleanly at `http://localhost:3000`.
- [ ] Tested the **"Run Opal 2026 Tax Audit"** button toggle.
- [ ] Tested the **Audience Persona Switcher** tabs.
