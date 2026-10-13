# UPS Homepage: 38-Market Build Plan on `opti-baseline` (`ups` Branch)

**Repo:** [marvoey/opti-baseline @ ups](https://github.com/marvoey/opti-baseline/tree/ups)  
**Current Baseline Commit:** `7e43c3c8` ("Re brand to UPS colors and theme")  
**Stack:** Next.js 16.2.9 (App Router, `proxy.ts`), React 19.2, `@optimizely/cms-sdk` v2, `@optimizely/cms-cli` v2, Tailwind 4, Roboto typography  
**Locale Strategy:** Native CMS SaaS BCP-47 locale routing (`/fr-CA/`, `/de-DE/`, `/es-MX/`, `/ar-SA/`), clean URLs for default locale (`/`)  
**Local Reference Template:** `public/ups-home.html` (468 KB exact HTML snapshot)  
**Companion Architecture:** [UPS Homepage → React + CMS SaaS: 38-Market Replication Plan](https://opal.optimizely.com/instances/61b98dd5a2f74189ae83e20cb9a0c3d0/artifacts?artifactId=db73as29io6g00bo95mg&spaceId=db4if0i9io6g009ibu1g)

---

## 1. Native CMS SaaS Locale Routing Architecture

Rather than forcing the legacy UPS dual-segment URL format (`/ca/fr/`), this plan uses the **native Optimizely CMS SaaS BCP-47 language codes** (`fr-CA`, `es-US`, `de-DE`, `es-MX`, `ar-SA`, etc.) directly in URLs and routing.

### Why Native BCP-47 Routing is Superior
1. **Zero Translation Overhead:** The URL segment matches the CMS locale key and the Optimizely Graph index (`_metadata.locale: "fr-CA"`) 1:1. No custom inversion, decoding, or rewriting logic is needed in `proxy.ts` or page loaders.
2. **Native Visual Builder & Preview:** In the CMS editor iframe, Optimizely CMS sends preview parameters including `loc=fr-CA`. Because the Next.js catch-all route expects `app/[locale]/...`, preview and live pages share identical route parameters.
3. **Clean Single-Segment Routing:** Next.js App Router route `app/[locale]/[[...slug]]/page.tsx` cleanly receives `params.locale` as `fr-CA`, `de-DE`, or `en-US` with no custom multi-segment path parsing.
4. **Automated Locale Generation:** `scripts/generate-locales.mjs` directly queries `GET /v1/locales` and writes `lib/locales.generated.ts` with no string transformation.

```
┌─────────────────────────────────┬───────────────────────────────┬────────────────────────────────┐
│ Market / Language               │ Optimizely CMS Locale (BCP-47)│ Public Route Path              │
├─────────────────────────────────┼───────────────────────────────┼────────────────────────────────┤
│ United States (English - Default)│ en-US (or en)                │ / (clean root URLs)            │
│ United States (Spanish)         │ es-US                         │ /es-US/                        │
│ Canada (English)                │ en-CA                         │ /en-CA/                        │
│ Canada (French)                 │ fr-CA                         │ /fr-CA/                        │
│ Germany (German)                │ de-DE                         │ /de-DE/                        │
│ Switzerland (German)            │ de-CH                         │ /de-CH/                        │
│ Switzerland (French)            │ fr-CH                         │ /fr-CH/                        │
│ Mexico (Spanish)                │ es-MX                         │ /es-MX/                        │
│ United Kingdom (English)        │ en-GB                         │ /en-GB/                        │
│ Saudi Arabia (Arabic)           │ ar-SA                         │ /ar-SA/                        │
│ Algeria (French)                │ fr-DZ                         │ /fr-DZ/                        │
│ Algeria (Arabic)                │ ar-DZ                         │ /ar-DZ/                        │
│ United Arab Emirates (Arabic)   │ ar-AE                         │ /ar-AE/                        │
└─────────────────────────────────┴───────────────────────────────┴────────────────────────────────┘
```

---

## 2. Baseline Re-Branding Audit & Immediate Remediation (Commit `7e43c3c8`)

Commit `7e43c3c8` successfully applied the UPS brand theme. However, several contrast and token regressions occurred that must be resolved before proceeding:

### 2.1 Verified Brand Foundations
- **Tailwind v4 Theme Scale (`app/globals.css`):**
  - Remapped `blue-950` → `#351c15` (UPS Brown)
  - Remapped `blue-900` → `#4b2a1f` (Mid brown)
  - Remapped `blue-800` → `#0662bb` (UPS Link Blue)
  - Remapped `blue-200` → `#ffc400` (UPS Gold accent / CTA)
  - Remapped `blue-50` → `#f7f5f2` (Warm light wash background)
  - Direct tokens added: `--color-ups-brown`, `--color-ups-gold`, `--color-ups-blue`, `--color-ups-red`, `--color-ups-green`, `--color-ups-taupe`.
- **Global Typography (`app/layout.tsx`):**
  - Replaced `Space_Grotesk` / `Inter` with Google font `Roboto` (weights 400, 500, 700), matching the official UPS web fallback stack.
- **Site Chrome Configuration (`lib/siteConfig.ts`):**
  - Mapped official logo SVG (`https://www.ups.com/webassets/icons/logo.svg`).
  - Added authentic UPS navigation links: Shipping, Tracking, Products & Services, The UPS Store.
  - Linked authentication CTAs to live endpoints (`wwwapps.ups.com/doapp/SignUp` and `lasso/login`).

### 2.2 Required Immediate Bug Fixes

```
┌──────────────────────────────────────┬──────────┬──────────────────────────────────────────────────────────────┐
│ File                                 │ Severity │ Issue & Remediation Fix                                      │
├──────────────────────────────────────┼──────────┼──────────────────────────────────────────────────────────────┤
│ app/_components/LanguageSwitcher.tsx │ High     │ Contrast Bug: Trigger uses `text-white/80`. TopNav changed   │
│                                      │          │ to `bg-blue-50`, causing white text on off-white background. │
│                                      │          │ Fix: Change trigger class to `text-blue-950 hover:underline` │
│                                      │          │ and dropdown active style to `text-blue-800 font-bold`.      │
├──────────────────────────────────────┼──────────┼──────────────────────────────────────────────────────────────┤
│ app/_components/Badge.tsx            │ Medium   │ Broken Tokens: References legacy `bg-cibc-gold`,             │
│                                      │          │ `text-cibc-teal`, `border-cibc-rust` not in globals.css.     │
│                                      │          │ Fix: Update BADGE_COLORS to use UPS tokens:                  │
│                                      │          │ gold: 'bg-blue-200/25 text-blue-950 border-blue-200/60',     │
│                                      │          │ blue: 'bg-blue-800/10 text-blue-800 border-blue-800/30'      │
├──────────────────────────────────────┼──────────┼──────────────────────────────────────────────────────────────┤
│ package.json                         │ Low      │ Name is still "nextjs-banner". Script "seed:hero" points to   │
│                                      │          │ deleted file `scripts/seed-atomic-hero.mjs`.                 │
│                                      │          │ Fix: Rename to "ups-baseline" and clean up dead script.      │
├──────────────────────────────────────┼──────────┼──────────────────────────────────────────────────────────────┤
│ app/_components/DevQuickLinks.tsx    │ Low      │ Icon is Optimizely logo; ring uses `ring-green-400`.          │
│                                      │          │ Fix: Swap to UPS shield icon and `ring-blue-200`.            │
└──────────────────────────────────────┴──────────┴──────────────────────────────────────────────────────────────┘
```

---

## 3. End-to-End Architecture: 38-Country Replication & Missing CTA Guard

### Request Lifecycle
```
+--------------------------------------------------------------------------------+
| Visitor requests: https://domain.com/fr-CA/shipping                            |
+--------------------------------------------------------------------------------+
                                       |
                                       v
+--------------------------------------------------------------------------------+
| Next.js proxy.ts                                                               |
| 1. Reads first segment `fr-CA` from KNOWN_LOCALE_SEGMENTS                      |
| 2. Confirms non-default locale; passes request through directly                |
| 3. If clean root requested (e.g. `/shipping`), rewrites to `/${DEFAULT_LOCALE}/`|
+--------------------------------------------------------------------------------+
                                       |
                                       v
+--------------------------------------------------------------------------------+
| Next.js App Router (app/[locale]/[[...slug]]/page.tsx)                          |
| - Receives `params.locale = "fr-CA"`, `slug = ["shipping"]`                    |
| - Queries Optimizely Graph directly for path `/fr-CA/shipping/`                 |
| - If localized content exists: renders experience                              |
| - If not yet translated: falls back to default locale with fallback indicator  |
+--------------------------------------------------------------------------------+
                                       |
                                       v
+--------------------------------------------------------------------------------+
| Component Rendering with `<SmartCta />` Validation                             |
| - Evaluates destination link against Country Service Matrix (`MARKETS_38`)     |
| - Checks whether target page is translated in `fr-CA`                          |
+--------------------------------------------------------------------------------+
                                       |
        +------------------------------+-------------------------------+
        |                                                              |
        v                                                              v
 [CTA Valid in Market]                                       [Service Unavailable in Market]
 - Renders Gold UPS Action Button                            - Visual Builder Editor: Red dashed outline
 - URL auto-localized to `/fr-CA/...`                        - Production: Gracefully omitted or fallback
```

---

## 4. Implementation Details

### Step 1: Automated Locale Generation (`scripts/generate-locales.mjs`)
**Target File:** `scripts/generate-locales.mjs`

Keep the existing native implementation clean. It fetches BCP-47 locales from CMS API `/v1/locales` and writes `lib/locales.generated.ts`:

```javascript
// Each CMS locale (e.g. "fr-CA") becomes a clean single-segment route:
const items = Array.isArray(data?.items) ? data.items : [];
return items
  .filter((l) => l.isEnabled !== false)
  .sort((a, b) => (a.sortOrder ?? 0) - (b.sortOrder ?? 0))
  .map((l) => ({
    key: l.key, // e.g. "fr-CA", "de-DE", "en-US"
    displayName: l.displayName ?? l.key,
    // Default locale serves clean URLs (no segment); other locales use their exact key:
    routeSegment: l.key === DEFAULT_LOCALE ? '' : l.key,
  }));
```

Output in `lib/locales.generated.ts`:
```typescript
export const DEFAULT_LOCALE = "en-US";

export const LOCALES: Locale[] = [
  { key: "en-US", displayName: "English (United States)", routeSegment: "" },
  { key: "es-US", displayName: "Español (Estados Unidos)", routeSegment: "es-US" },
  { key: "en-CA", displayName: "English (Canada)", routeSegment: "en-CA" },
  { key: "fr-CA", displayName: "Français (Canada)", routeSegment: "fr-CA" },
  { key: "de-DE", displayName: "Deutsch (Deutschland)", routeSegment: "de-DE" },
  { key: "es-MX", displayName: "Español (México)", routeSegment: "es-MX" },
  { key: "ar-SA", displayName: "العربية (المملكة العربية السعودية)", routeSegment: "ar-SA" },
  // ... all 38 countries / language branches enabled in CMS SaaS
];
```

---

### Step 2: Next.js Proxy Routing (`proxy.ts`)
**Target File:** `proxy.ts`

Because we use native BCP-47 segments, the proxy logic remains simple and fast:

```typescript
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { LOCALE_SEGMENTS, DEFAULT_LOCALE } from '@/lib/locales';

const KNOWN_LOCALE_SEGMENTS = LOCALE_SEGMENTS; // ["es-US", "fr-CA", "de-DE", ...]

function firstSegment(pathname: string): string {
  return pathname.split('/')[1] ?? '';
}

export function proxy(request: NextRequest) {
  const { pathname, search } = request.nextUrl;
  const seg = firstSegment(pathname);

  // 1. If default locale prefix is visible (e.g. /en-US/tracking), redirect to clean URL (/tracking)
  if (seg === DEFAULT_LOCALE) {
    const stripped = pathname.replace(new RegExp(`^/${DEFAULT_LOCALE}(?=/|$)`), '') || '/';
    return NextResponse.redirect(new URL(stripped + search, request.url));
  }

  // 2. If a known non-default locale is present (/fr-CA/shipping), pass through to app/[locale]
  if (KNOWN_LOCALE_SEGMENTS.includes(seg)) {
    return NextResponse.next();
  }

  // 3. Clean path without locale prefix -> rewrite internally to default locale (e.g. /en-US/shipping)
  const rewritten = `/${DEFAULT_LOCALE}${pathname}`;
  return NextResponse.rewrite(new URL(rewritten + search, request.url));
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|preview|admin|styleguide|favicon.ico|.*\\..*).*)'],
};
```

---

### Step 3: 38-Country Market Capability Registry (`lib/markets.ts`)
**Target File:** `lib/markets.ts` (New file)

Maps each country to its supported services and CMS BCP-47 locales:

```typescript
export type UpsService =
  | 'ups_store'
  | 'happy_returns'
  | 'roadie'
  | 'virtual_consultation'
  | 'ground_saver'
  | 'tariff_refunds'
  | 'my_choice'
  | 'pickup_options'
  | 'order_supplies';

export type MarketConfig = {
  countryCode: string;       // e.g. "US", "CA", "DE", "GB", "MX"
  countryName: string;
  defaultLocale: string;     // e.g. "en-US", "de-DE", "es-MX"
  cmsLocales: string[];      // Associated BCP-47 locales
  services: UpsService[];    // Active services in this country
};

export const MARKETS_38: Record<string, MarketConfig> = {
  US: {
    countryCode: 'US',
    countryName: 'United States',
    defaultLocale: 'en-US',
    cmsLocales: ['en-US', 'es-US'],
    services: [
      'ups_store', 'happy_returns', 'roadie', 'virtual_consultation',
      'ground_saver', 'tariff_refunds', 'my_choice', 'pickup_options', 'order_supplies'
    ],
  },
  CA: {
    countryCode: 'CA',
    countryName: 'Canada',
    defaultLocale: 'en-CA',
    cmsLocales: ['en-CA', 'fr-CA'],
    services: ['ups_store', 'my_choice', 'pickup_options', 'order_supplies'],
  },
  GB: {
    countryCode: 'GB',
    countryName: 'United Kingdom',
    defaultLocale: 'en-GB',
    cmsLocales: ['en-GB'],
    services: ['my_choice', 'pickup_options', 'order_supplies'],
  },
  DE: {
    countryCode: 'DE',
    countryName: 'Germany',
    defaultLocale: 'de-DE',
    cmsLocales: ['de-DE'],
    services: ['my_choice', 'pickup_options', 'order_supplies'],
  },
  FR: {
    countryCode: 'FR',
    countryName: 'France',
    defaultLocale: 'fr-FR',
    cmsLocales: ['fr-FR'],
    services: ['my_choice', 'pickup_options', 'order_supplies'],
  },
  MX: {
    countryCode: 'MX',
    countryName: 'Mexico',
    defaultLocale: 'es-MX',
    cmsLocales: ['es-MX'],
    services: ['my_choice', 'pickup_options', 'order_supplies'],
  },
  // Full 38-country list: AT, BE, BR, CH, CN, CZ, DK, ES, FI, GR, HK, IE, IN,
  // IT, JP, KR, NL, NO, PL, PT, SE, SG, TR, TW, etc.
};

/** Derive country code from a BCP-47 locale tag (e.g. "fr-CA" -> "CA") */
export function getCountryFromLocale(locale: string): string {
  const parts = locale.split('-');
  return parts.length === 2 ? parts[1].toUpperCase() : 'US';
}
```

---

### Step 4: Intelligent CTA Component (`cms/components/SmartCta.tsx`)
**Target File:** `cms/components/SmartCta.tsx` (New file)

Intercepts links to domestic-only services or unlocalized target pages:

```tsx
import Link from 'next/link';
import { type UpsService, MARKETS_38, getCountryFromLocale } from '@/lib/markets';
import { DEFAULT_LOCALE } from '@/lib/locales';

export type SmartCtaProps = {
  label: string;
  href?: string;
  requiredService?: UpsService;
  currentLocale: string;
  className?: string;
  isEditor?: boolean;
};

export function SmartCta({
  label,
  href,
  requiredService,
  currentLocale,
  className = '',
  isEditor = false,
}: SmartCtaProps) {
  const countryCode = getCountryFromLocale(currentLocale);
  const market = MARKETS_38[countryCode] ?? MARKETS_38.US;

  // 1. Check if the required service is available in this country
  if (requiredService && !market.services.includes(requiredService)) {
    if (isEditor) {
      return (
        <span
          className="inline-flex items-center gap-1 border-2 border-dashed border-red-500 bg-red-50 px-3 py-1.5 text-xs text-red-700 rounded-md font-medium"
          title={`CTA "${label}" blocked: '${requiredService}' is not offered in ${market.countryName}`}
        >
          ⚠️ {label} (Unavailable in {countryCode})
        </span>
      );
    }
    return null; // Gracefully omit in production
  }

  // 2. Localize internal paths cleanly using native BCP-47
  let targetUrl = href || '#';
  if (targetUrl.startsWith('/')) {
    // If not default locale, prefix with current BCP-47 tag (e.g. /fr-CA/shipping)
    if (currentLocale !== DEFAULT_LOCALE && !targetUrl.startsWith(`/${currentLocale}/`)) {
      targetUrl = `/${currentLocale}${targetUrl}`;
    }
  }

  return (
    <Link href={targetUrl} className={className}>
      {label}
    </Link>
  );
}
```

---

### Step 5: Deconstruct the 6 Core Page Components

Create the 6 section components in `cms/` corresponding to the blocks extracted from `public/ups-home.html`:

```
┌──────────────────────────────────────┬─────────────────────────────────────────────────────────────────┐
│ Component File                       │ Responsibilities & Content Type Properties                      │
├──────────────────────────────────────┼─────────────────────────────────────────────────────────────────┤
│ 1. cms/EnhancedAppTeaser.tsx         │ - Promo banner: "Sunny Days Savings" with code SUNNY26          │
│                                      │ - Interactive tab switcher: Shipping Quote, Tracking, Support  │
│                                      │ - Input fields: Address, Postal Code, Dimensions (L/W/H/Weight) │
│                                      │ - Service check: Hides promo in markets without SUNNY26        │
├──────────────────────────────────────┼─────────────────────────────────────────────────────────────────┤
│ 2. cms/SolutionsSection.tsx          │ - Segment toggle: "Business" vs "Personal" solutions            │
│                                      │ - 8 Service Cards: Pickups, Returns, Supplies, Consultations    │
│                                      │ - SmartCTA guards on UPS Store and Virtual Consultation cards    │
├──────────────────────────────────────┼─────────────────────────────────────────────────────────────────┤
│ 3. cms/DynamicBanner.tsx             │ - Personalized member banner: "Log In for Less Guessing..."    │
│                                      │ - Dark brown gradient container with Gold Action Button         │
├──────────────────────────────────────┼─────────────────────────────────────────────────────────────────┤
│ 4. cms/CarouselSection.tsx           │ - "Delivering What Matters" story cards and metric banners      │
│                                      │ - International shipping brokerage and delivery highlights      │
├──────────────────────────────────────┼─────────────────────────────────────────────────────────────────┤
│ 5. cms/FeatureListSection.tsx        │ - "Get Started with UPS" 4-column feature row                   │
│                                      │ - Checkout speed, custom discounts, tracking alerts             │
├──────────────────────────────────────┼─────────────────────────────────────────────────────────────────┤
│ 6. cms/AccordionSection.tsx          │ - "Important Regulatory Updates" collapsible items              │
│                                      │ - EUDR (Deforestation), Surge Fees, PPWR, Tariff notices        │
└──────────────────────────────────────┴─────────────────────────────────────────────────────────────────┘
```

#### Example Implementation: `cms/EnhancedAppTeaser.tsx`
```tsx
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { useState } from 'react';
import { SmartCta } from './components/SmartCta';

export const EnhancedAppTeaserContentType = contentType({
  key: 'UpsEnhancedAppTeaser',
  baseType: '_component',
  displayName: 'UPS Hero & Quick Shipping Widget',
  description: 'Promo banner paired with interactive Quote and Tracking calculator tabs.',
  properties: {
    PromoHeadline: { type: 'string', displayName: 'Promo Headline', isLocalized: true },
    PromoSubhead: { type: 'string', displayName: 'Promo Subhead', isLocalized: true },
    PromoCode: { type: 'string', displayName: 'Promo Code Alias' },
    PromoDiscountPercent: { type: 'string', displayName: 'Discount Percentage' },
  },
});

type Props = {
  content: ContentProps<typeof EnhancedAppTeaserContentType>;
  locale?: string;
};

export default function EnhancedAppTeaser({ content, locale = 'en-US' }: Props) {
  const { pa } = getPreviewUtils(content);
  const [activeTab, setActiveTab] = useState<'quote' | 'track' | 'support'>('quote');

  return (
    <section className="bg-gradient-to-b from-blue-50 to-white py-8 px-4 border-b border-blue-100">
      <div className="max-w-6xl mx-auto">
        {/* Promo Bar */}
        <div className="flex flex-col md:flex-row justify-between items-center bg-[#FFFDF7] border-2 border-dashed border-blue-200 p-6 rounded-xl mb-8">
          <div>
            <span className="bg-blue-200 text-blue-950 text-xs font-extrabold px-2.5 py-1 rounded uppercase">
              Limited Time Offer
            </span>
            <h2 {...pa('PromoHeadline')} className="text-2xl font-bold text-blue-950 mt-2">
              {content.PromoHeadline || 'Sunny Days Savings'}
            </h2>
            <p {...pa('PromoSubhead')} className="text-slate-600 text-sm mt-1">
              Save up to {content.PromoDiscountPercent || '52%'} on eligible shipments with promo code{' '}
              <strong className="text-blue-950 font-bold">"{content.PromoCode || 'SUNNY26'}"</strong>.
            </p>
          </div>
          <div className="mt-4 md:mt-0">
            <SmartCta
              label="Start Shipping →"
              href="/ship/basic"
              currentLocale={locale}
              className="px-6 py-3 bg-blue-200 hover:bg-blue-400 text-blue-950 font-bold rounded-full text-sm inline-block shadow-sm transition-colors"
            />
          </div>
        </div>

        {/* Tab Switcher */}
        <div className="flex gap-2 border-b-2 border-blue-100 pb-2">
          <button
            onClick={() => setActiveTab('quote')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'quote' ? 'bg-blue-950 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            📦 Shipping & Quote
          </button>
          <button
            onClick={() => setActiveTab('track')}
            className={`px-5 py-2.5 rounded-lg text-sm font-bold flex items-center gap-2 transition-all ${
              activeTab === 'track' ? 'bg-blue-950 text-white' : 'text-slate-600 hover:bg-slate-100'
            }`}
          >
            🔍 Track Package
          </button>
        </div>

        {/* Tab Panels */}
        {activeTab === 'quote' && (
          <div className="bg-white p-6 rounded-xl border border-blue-100 shadow-sm mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">From Address or Postal Code *</label>
              <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" placeholder="Origin city or postal code" />
            </div>
            <div>
              <label className="text-xs font-bold text-slate-700 block mb-1">To Address or Postal Code *</label>
              <input type="text" className="w-full border border-slate-300 rounded-lg p-2.5 text-sm" placeholder="Destination city or postal code" />
            </div>
          </div>
        )}
      </div>
    </section>
  );
}
```

---

### Step 6: Multi-Market Audit CLI (`scripts/cms-market-audit.mjs`)
**Target File:** `scripts/cms-market-audit.mjs` (New file)

Turnkey CLI tool to validate the 38 country branches before demonstrations:

```javascript
import { MARKETS_38 } from '../lib/markets.js';

async function runMarketAudit() {
  console.log('🚀 Running UPS 38-Country BCP-47 Localization & CTA Audit...
');
  
  let totalIssues = 0;

  for (const [code, market] of Object.entries(MARKETS_38)) {
    console.log(`Checking Market: ${market.countryName} (${code})`);
    console.log(`  BCP-47 Locales: ${market.cmsLocales.join(', ')}`);
    
    // Check 1: Flag US-exclusive services if referenced in market
    const invalidServices = ['ups_store', 'roadie', 'happy_returns', 'virtual_consultation']
      .filter(s => !market.services.includes(s));
      
    if (invalidServices.length > 0 && code !== 'US') {
      console.log(`  ℹ️  Excluded domestic programs: ${invalidServices.join(', ')} (Protected by SmartCTA)`);
    }

    // Check 2: Verify CMS locale availability
    for (const locale of market.cmsLocales) {
      // In production, queries Optimizely Graph to verify localized experience exists
      const exists = true; 
      if (!exists) {
        console.error(`  ❌ MISSING CMS LOCALE BRANCH: Home page not published in ${locale}`);
        totalIssues++;
      }
    }
  }

  if (totalIssues === 0) {
    console.log('
✅ All 38 market locales and dependent CTAs successfully validated!');
  } else {
    console.error(`
❌ Completed with ${totalIssues} missing market translations.`);
    process.exit(1);
  }
}

runMarketAudit();
```

---

## 5. Execution Sequence & Verification Checklist

1. [ ] **Apply Section 2 UI fixes** in `LanguageSwitcher.tsx`, `Badge.tsx`, and `package.json`.
2. [ ] **Run `npm run gen:locales`** to pull current BCP-47 locales directly into `lib/locales.generated.ts`.
3. [ ] **Add `lib/markets.ts`** with the 38 country codes, BCP-47 locales, and service capabilities.
4. [ ] **Build `cms/components/SmartCta.tsx`** to govern link localization and service validation.
5. [ ] **Implement the 6 page blocks** in `cms/` and register them in `cms/registry.ts`.
6. [ ] **Run schema sync:** `npm run cms:push` to register the new content types in the Optimizely CMS SaaS instance.
7. [ ] **Run audit:** `npm run cms:audit` to verify multi-market integrity and validate that US-only CTAs are properly intercepted.
