# Implementation Prompt for Claude Code / VS Code: Floor & Decor Next.js Demo

## Context & Objectives
You are building upon the repository `marvoey/opti-baseline` on branch `floor-decor`.
This is a Next.js 16 (App Router) demo application built for a formal technical sales demo with **Floor & Decor**.
The stack uses `@optimizely/cms-sdk` (v2), `@optimizely/cms-cli`, Tailwind CSS v4, Lucide React, and Optimizely Graph.

### Core Stakeholder Needs Addressed
1. **Rachel & Dawn (Business Users & Marketers):**
   - Amplience is developer-heavy. Need marketer-friendly visual building.
   - Slot-level & component-level campaign countdown timers with auto-expiration and fallback experiences without dev code deploys.
   - DAM image set management: instant drag-and-drop reordering with zero CDN purge delays.
2. **Allycia (CMS Architect & Content Execution):**
   - 24,000 SKUs need a single standardized PDP shell with CMS slot extensions.
   - Blogs (Amplience) + Videos (TV Page) are currently manually stitched into carousels across thousands of pages. Need automated taxonomy-based distribution via Optimizely Graph.
   - Developer extensibility: "Fast Field" schema pushes in seconds via `npm run cms:push`.
3. **Ben (Optimization & Experimentation Lead):**
   - Dynamic Yield suffers from campaign collisions and broken global holdout groups.
   - Needs native Mutual Exclusion Groups (MEG) and a protected Global 5% Holdout group with Stats Engine.
4. **Trey (Decision Maker & Strategy):**
   - Collection & variant selling: "Complete the Project" bundle recommendations (Tile + Grout + Trim + Spacers).
   - AI product classification: Mark AI analyzing imagery/specs to infer aesthetic styles (Modern vs Classic).

---

## Task 1: Update TypeScript Types (`app/_components/fd/types.ts`)

Add support for new taxonomy, project bundles, content feed items, and AI attributes:

```typescript
/** Product as delivered by Graph (see cms/FdProduct.tsx). */
export type ProductData = {
  Sku?: string | null;
  Name?: string | null;
  Brand?: string | null;
  Size?: string | null;
  SqftPerBox?: number | null;
  PriceSqft?: number | null;
  Rating?: number | null;
  Reviews?: number | null;
  /** One image URL per line; first is the primary image. */
  Images?: string | null;
  Material?: string | null;
  Finish?: string | null;
  PeiRating?: string | null;
  Dcof?: string | null;
  StockCount?: number | null;
  /** One feature per line. */
  Features?: string | null;
  DetailUrl?: string | null;
  // --- New fields for F&D Demo ---
  AestheticStyle?: 'Modern' | 'Classic' | 'Farmhouse' | 'Transitional' | 'Industrial' | null;
  MatchingGroutSku?: string | null;
  RecommendedProfile?: string | null;
  ProTipSubtext?: string | null;
  CommercialWarranty?: string | null;
};

export const lines = (s?: string | null) =>
  (s ?? '').split('\n').map((l) => l.trim()).filter(Boolean);

/** Resolve a URL from a Graph contentReference / url value. */
export function refUrl(v: unknown): string | undefined {
  const u = (v as { url?: { default?: string | null } | string | null } | null)?.url;
  return typeof u === 'string' ? u : (u?.default ?? undefined);
}

/** Content feed item for automated blog & TV Page video distribution. */
export type ContentFeedItem = {
  id: string;
  type: 'Video Guide (TV Page)' | 'DIY Article (Blog)' | 'Installation Guide';
  title: string;
  tag: string;
  durationOrReadTime: string;
  thumbnailUrl: string;
  viewsOrAuthor?: string;
  url?: string;
};

/** Project Bundle kit item for collection selling. */
export type BundleItem = {
  role: 'Primary Tile' | 'Matching Grout' | 'Thinset Mortar' | 'Edge Trim' | 'Leveling System';
  name: string;
  sku: string;
  priceFormatted: string;
  coverageFormula: string;
  image: string;
  requiredQty: number;
};
```

---

## Task 2: Create New CMS Content Types in `cms/`

Create the following 5 new content type definition files in `cms/`. Each file must export `contentType()` + a default React component:

### 1. `cms/FdScheduledSlot.tsx`
*Solves Rachel's pain point: component/slot countdown timers and fallback experiences.*

```tsx
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils, OptimizelyComponent } from '@optimizely/cms-sdk/react/server';
import { blockNode } from './shared';

export const FdScheduledSlotContentType = contentType({
  key: 'FdScheduledSlot',
  baseType: '_component',
  displayName: 'F&D Scheduled Campaign Slot',
  description: 'Time-boxed promotional slot with automatic start/expiry and fallback content.',
  compositionBehaviors: ['sectionEnabled', 'elementEnabled'],
  properties: {
    SlotName: { type: 'string', format: 'shortString', displayName: 'Slot Identifier', sortOrder: 10 },
    CampaignStart: { type: 'string', displayName: 'Start Date/Time (ISO)', sortOrder: 20 },
    CampaignEnd: { type: 'string', displayName: 'End Date/Time (Auto-Expire)', sortOrder: 30 },
    ActiveContent: {
      type: 'content',
      displayName: 'Active Promotional Block',
      allowedTypes: [],
      sortOrder: 40,
    },
    FallbackContent: {
      type: 'content',
      displayName: 'Fallback Content (Shown when expired)',
      allowedTypes: [],
      sortOrder: 50,
    },
  },
});

export default function FdScheduledSlot({ content }: { content: ContentProps<typeof FdScheduledSlotContentType> }) {
  const { pa } = getPreviewUtils(content);
  const now = new Date();
  const start = content.CampaignStart ? new Date(content.CampaignStart) : null;
  const end = content.CampaignEnd ? new Date(content.CampaignEnd) : null;

  const isLive = (!start || now >= start) && (!end || now <= end);
  const displayContent = isLive ? content.ActiveContent : (content.FallbackContent ?? content.ActiveContent);

  return (
    <div {...pa(blockNode(content))} className="relative">
      {displayContent ? (
        <OptimizelyComponent content={displayContent} />
      ) : (
        <div className="p-4 border-2 border-dashed border-amber-300 bg-amber-50 rounded text-center text-xs text-amber-800">
          Scheduled Slot: Empty ({content.SlotName || 'Unnamed'})
        </div>
      )}
    </div>
  );
}
```

### 2. `cms/FdContentDistributionFeed.tsx`
*Solves Allycia's pain point: eliminating manual Amplience + TV Page carousel stitching across thousands of pages.*

```tsx
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { blockNode } from './shared';
import { Sparkles, Video, FileText, ArrowRight } from 'lucide-react';
import type { ContentFeedItem } from '@/app/_components/fd/types';

export const FdContentDistributionFeedContentType = contentType({
  key: 'FdContentDistributionFeed',
  baseType: '_component',
  displayName: 'F&D Automated Content Feed (Graph)',
  description: 'Dynamic carousel aggregating blogs, TV Page videos, and installation guides by taxonomy.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Heading: { type: 'string', displayName: 'Feed Heading', isLocalized: true, sortOrder: 10 },
    Subheading: { type: 'string', displayName: 'Subheading', isLocalized: true, sortOrder: 20 },
    TargetTaxonomyTag: {
      type: 'string',
      format: 'shortString',
      displayName: 'Filter Tag (e.g., Tile, Hardwood, Luxury Vinyl)',
      sortOrder: 30,
    },
    ItemLimit: { type: 'integer', displayName: 'Max Items to Display', sortOrder: 40 },
  },
});

const MOCK_ITEMS: ContentFeedItem[] = [
  {
    id: 'f1',
    type: 'Video Guide (TV Page)',
    title: 'How to Install 12x24 Large Format Porcelain Like a Pro',
    tag: 'Installation',
    durationOrReadTime: '4:18 min',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    viewsOrAuthor: '18.4k views'
  },
  {
    id: 'f2',
    type: 'DIY Article (Blog)',
    title: 'Zellige vs. Marble Look: Which Backsplash Fits Your Kitchen?',
    tag: 'Design Trends',
    durationOrReadTime: '3 min read',
    thumbnailUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80',
    viewsOrAuthor: 'Floor & Decor Design Studio'
  },
  {
    id: 'f3',
    type: 'Installation Guide',
    title: 'Commercial PEI Rating & Sealing Guide for Polished Tile',
    tag: 'Maintenance',
    durationOrReadTime: '5 min read',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    viewsOrAuthor: 'Technical Services'
  }
];

export default function FdContentDistributionFeed({ content }: { content: ContentProps<typeof FdContentDistributionFeedContentType> }) {
  const { pa } = getPreviewUtils(content);
  const items = MOCK_ITEMS.slice(0, content.ItemLimit || 3);

  return (
    <section {...pa(blockNode(content))} className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-end justify-between mb-6 border-b border-neutral-200 pb-4">
        <div>
          <span className="text-xs font-bold text-[#df4a26] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Optimizely Graph Automated Distribution
          </span>
          <h2 {...pa('Heading')} className="text-2xl font-black text-[#1b2a4a] mt-1">
            {content.Heading || 'Inspiration, Installation Videos & Guides'}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            {content.Subheading || `Auto-queried across blogs and TV Page via tag: "${content.TargetTaxonomyTag || 'Tile'}"`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="h-44 relative overflow-hidden bg-neutral-100">
                <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-[#1b2a4a] text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  {item.type.includes('Video') ? <Video className="w-3 h-3 text-[#df4a26]" /> : <FileText className="w-3 h-3 text-[#df4a26]" />}
                  {item.type}
                </span>
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
                  {item.durationOrReadTime}
                </span>
              </div>
              <div className="p-4">
                <span className="text-[11px] font-bold text-[#df4a26] uppercase">{item.tag}</span>
                <h3 className="font-bold text-sm text-[#1b2a4a] mt-1 hover:text-[#df4a26] cursor-pointer leading-snug">
                  {item.title}
                </h3>
              </div>
            </div>
            <div className="p-4 pt-0 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 mt-2">
              <span>{item.viewsOrAuthor}</span>
              <span className="text-[#df4a26] font-bold flex items-center gap-0.5">Learn more <ArrowRight className="w-3 h-3" /></span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

### 3. `cms/FdProjectBundle.tsx`
*Solves Trey's request: Collection selling and Complete-the-Project bundle kits.*

```tsx
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { FdProductContentType } from './FdProduct';
import { blockNode } from './shared';
import { Check, ShoppingCart, Layers } from 'lucide-react';
import type { ProductData } from '@/app/_components/fd/types';

export const FdProjectBundleContentType = contentType({
  key: 'FdProjectBundle',
  baseType: '_component',
  displayName: 'F&D Project Bundle (Collection Selling)',
  description: 'Pairs flooring with matching grout, thinset mortar, spacers, and trim profiles.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Heading: { type: 'string', displayName: 'Section Heading', sortOrder: 10 },
    PrimaryProduct: {
      type: 'content',
      displayName: 'Primary Flooring Product',
      allowedTypes: [FdProductContentType],
      sortOrder: 20,
    },
    RecommendedGrout: {
      type: 'content',
      displayName: 'Matching Grout (e.g. Mapei #38 Avalanche)',
      allowedTypes: [FdProductContentType],
      sortOrder: 30,
    },
    RecommendedTrim: {
      type: 'content',
      displayName: 'Transition Profile / Edge Trim (Schluter)',
      allowedTypes: [FdProductContentType],
      sortOrder: 40,
    },
  },
});

export default function FdProjectBundle({ content }: { content: ContentProps<typeof FdProjectBundleContentType> }) {
  const { pa } = getPreviewUtils(content);
  const primary = content.PrimaryProduct as unknown as ProductData | undefined;
  const grout = content.RecommendedGrout as unknown as ProductData | undefined;
  const trim = content.RecommendedTrim as unknown as ProductData | undefined;

  return (
    <section {...pa(blockNode(content))} className="max-w-7xl mx-auto px-4 py-8">
      <div className="bg-neutral-50 rounded-xl border border-neutral-200 p-6 shadow-sm">
        <div className="flex items-center justify-between mb-4 border-b border-neutral-200 pb-3">
          <div>
            <span className="text-xs font-bold text-[#df4a26] uppercase flex items-center gap-1">
              <Layers className="w-3.5 h-3.5" /> Complete Your Project Bundle
            </span>
            <h2 {...pa('Heading')} className="text-xl font-black text-[#1b2a4a] mt-0.5">
              {content.Heading || 'Everything Needed to Install This Project'}
            </h2>
          </div>
          <span className="bg-emerald-100 text-emerald-800 text-xs font-bold px-2.5 py-1 rounded">
            Save 10% When Bundled
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="bg-white p-4 rounded-lg border border-neutral-200 flex items-center gap-3">
            <div className="w-12 h-12 bg-neutral-100 rounded flex items-center justify-center font-bold text-xs text-neutral-600">
              TILE
            </div>
            <div className="text-xs">
              <div className="font-bold text-[#1b2a4a]">{primary?.Name || 'Selected Flooring Tile'}</div>
              <div className="text-neutral-500">Core Surface Material</div>
              <div className="text-[#df4a26] font-bold mt-0.5">${primary?.PriceSqft?.toFixed(2) || '2.49'} / sq.ft.</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-neutral-200 flex items-center gap-3">
            <div className="w-12 h-12 bg-neutral-100 rounded flex items-center justify-center font-bold text-xs text-neutral-600">
              GROUT
            </div>
            <div className="text-xs">
              <div className="font-bold text-[#1b2a4a]">{grout?.Name || 'Mapei Ultracolor Plus FA (Avalanche #38)'}</div>
              <div className="text-neutral-500">Matches Tile Veining</div>
              <div className="text-[#df4a26] font-bold mt-0.5">$18.99 / 10 lb bag</div>
            </div>
          </div>

          <div className="bg-white p-4 rounded-lg border border-neutral-200 flex items-center gap-3">
            <div className="w-12 h-12 bg-neutral-100 rounded flex items-center justify-center font-bold text-xs text-neutral-600">
              TRIM
            </div>
            <div className="text-xs">
              <div className="font-bold text-[#1b2a4a]">{trim?.Name || 'Schluter Schiene Satin Nickel Profile'}</div>
              <div className="text-neutral-500">Clean Edge Transition</div>
              <div className="text-[#df4a26] font-bold mt-0.5">$14.49 / 8 ft profile</div>
            </div>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-200 flex flex-wrap items-center justify-between gap-4">
          <div className="text-xs text-neutral-600 space-y-1">
            <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> Pro-calibrated formula based on square footage</div>
            <div className="flex items-center gap-1.5"><Check className="w-3.5 h-3.5 text-emerald-600" /> In stock for same-day job site pickup</div>
          </div>
          <button className="bg-[#df4a26] hover:bg-[#c63a18] text-white font-bold text-xs py-3 px-6 rounded-lg shadow transition flex items-center gap-2">
            <ShoppingCart className="w-4 h-4" /> Add Complete Project Kit to Cart
          </button>
        </div>
      </div>
    </section>
  );
}
```

### 4. `cms/FdAiStyleClassifier.tsx`
*Answers Trey's question on automated aesthetic taxonomy enrichment (Modern vs. Classic).*

```tsx
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { FdProductContentType } from './FdProduct';
import { Sparkles, CheckCircle2 } from 'lucide-react';
import type { ProductData } from '@/app/_components/fd/types';

export const FdAiStyleClassifierContentType = contentType({
  key: 'FdAiStyleClassifier',
  baseType: '_component',
  displayName: 'F&D AI Aesthetic Enrichment (Mark)',
  description: 'Inspects and applies Mark AI computer-vision aesthetic tags to product catalog feeds.',
  properties: {
    Product: {
      type: 'content',
      displayName: 'Product to Classify',
      allowedTypes: [FdProductContentType],
      sortOrder: 10,
    },
    InferredStyle: { type: 'string', format: 'shortString', displayName: 'Inferred Aesthetic Style', sortOrder: 20 },
    InferredPalette: { type: 'string', format: 'shortString', displayName: 'Color Palette Analysis', sortOrder: 30 },
    ConfidenceScore: { type: 'float', displayName: 'Mark AI Confidence (0-100)', sortOrder: 40 },
    SyncStatus: { type: 'string', format: 'shortString', displayName: 'Graph Taxonomy Status', sortOrder: 50 },
  },
});

export default function FdAiStyleClassifier({ content }: { content: ContentProps<typeof FdAiStyleClassifierContentType> }) {
  const prod = content.Product as unknown as ProductData | undefined;

  return (
    <div className="bg-neutral-900 text-white rounded-xl p-5 border border-neutral-700 shadow-lg text-xs">
      <div className="flex items-center justify-between mb-3 border-b border-neutral-800 pb-2">
        <span className="font-bold text-amber-400 flex items-center gap-1.5">
          <Sparkles className="w-4 h-4" /> Mark AI Taxonomy Enrichment: {prod?.Name || 'Selected SKU'}
        </span>
        <span className="bg-emerald-500/20 text-emerald-300 px-2 py-0.5 rounded text-[10px] font-mono">
          {content.SyncStatus || 'Synced to Optimizely Graph'}
        </span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-[11px]">
        <div className="bg-neutral-800 p-2.5 rounded">
          <span className="text-neutral-400 block text-[10px]">Aesthetic Classification:</span>
          <span className="font-bold text-neutral-100">{content.InferredStyle || 'Modern Organic / Transitional'}</span>
        </div>
        <div className="bg-neutral-800 p-2.5 rounded">
          <span className="text-neutral-400 block text-[10px]">Palette Vein Tones:</span>
          <span className="font-bold text-neutral-100">{content.InferredPalette || 'Warm Calacatta Gold & Soft White'}</span>
        </div>
        <div className="bg-neutral-800 p-2.5 rounded">
          <span className="text-neutral-400 block text-[10px]">Mark AI Confidence:</span>
          <span className="font-bold text-emerald-400">{content.ConfidenceScore || 98.4}%</span>
        </div>
        <div className="bg-neutral-800 p-2.5 rounded">
          <span className="text-neutral-400 block text-[10px]">Personalization Readiness:</span>
          <span className="font-bold text-amber-300 flex items-center gap-1"><CheckCircle2 className="w-3.5 h-3.5" /> 1:1 Affinity Ready</span>
        </div>
      </div>
    </div>
  );
}
```

### 5. `cms/FdExperimentContainer.tsx`
*Solves Ben's challenge: proving Mutual Exclusion Groups and Global 5% Holdout protection.*

```tsx
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils, OptimizelyComponent } from '@optimizely/cms-sdk/react/server';
import { blockNode } from './shared';
import { ShieldCheck, BarChart3 } from 'lucide-react';

export const FdExperimentContainerContentType = contentType({
  key: 'FdExperimentContainer',
  baseType: '_component',
  displayName: 'F&D Experimentation & Holdout Container',
  description: 'Embeds an A/B test isolated within a Mutual Exclusion Group.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ExperimentKey: { type: 'string', format: 'shortString', displayName: 'Optimizely Experiment Key', sortOrder: 10 },
    MutualExclusionGroupId: { type: 'string', format: 'shortString', displayName: 'Mutual Exclusion Group ID', sortOrder: 20 },
    HoldoutPercentage: { type: 'float', displayName: 'Global Holdout % (e.g. 5.0)', sortOrder: 30 },
    ControlVariation: {
      type: 'content',
      displayName: 'Control Experience',
      allowedTypes: [],
      sortOrder: 40,
    },
    ChallengerVariationA: {
      type: 'content',
      displayName: 'Variation A (Mark AI Prompted)',
      allowedTypes: [],
      sortOrder: 50,
    },
  },
});

export default function FdExperimentContainer({ content }: { content: ContentProps<typeof FdExperimentContainerContentType> }) {
  const { pa } = getPreviewUtils(content);

  return (
    <section {...pa(blockNode(content))} className="max-w-7xl mx-auto px-4 py-4">
      <div className="border border-indigo-200 bg-indigo-50/60 rounded-xl p-4 mb-4 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-indigo-700" />
          <span className="font-bold text-indigo-950">Active Experiment: {content.ExperimentKey || 'exp_clp_conversion'}</span>
          <span className="bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded font-mono text-[10px]">
            MEG: {content.MutualExclusionGroupId || '#MEG-402 (Checkout Protection)'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-indigo-800 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Global Holdout: {content.HoldoutPercentage || 5.0}% Traffic Shielded</span>
        </div>
      </div>

      <div className="relative">
        {content.ChallengerVariationA ? (
          <OptimizelyComponent content={content.ChallengerVariationA} />
        ) : content.ControlVariation ? (
          <OptimizelyComponent content={content.ControlVariation} />
        ) : null}
      </div>
    </section>
  );
}
```

---

## Task 3: Register All Types in `cms/registry.ts`

Update `cms/registry.ts` to import and register the 5 new components:

```typescript
import FdScheduledSlot, { FdScheduledSlotContentType } from './FdScheduledSlot';
import FdContentDistributionFeed, { FdContentDistributionFeedContentType } from './FdContentDistributionFeed';
import FdProjectBundle, { FdProjectBundleContentType } from './FdProjectBundle';
import FdAiStyleClassifier, { FdAiStyleClassifierContentType } from './FdAiStyleClassifier';
import FdExperimentContainer, { FdExperimentContainerContentType } from './FdExperimentContainer';

export const registeredContentTypes = [
  // ... existing types
  BlankExperienceContentType,
  BlankSectionContentType,
  PageContentType,
  RichTextContentType,
  HeroBlockContentType,
  FdPromoSplitContentType,
  FdFeatureItemContentType,
  FdFeatureGridContentType,
  FdProductContentType,
  FdProductGridContentType,
  FdProductDetailContentType,
  FdHotspotContentType,
  FdShopTheLookContentType,
  // New F&D Additions
  FdScheduledSlotContentType,
  FdContentDistributionFeedContentType,
  FdProjectBundleContentType,
  FdAiStyleClassifierContentType,
  FdExperimentContainerContentType,
];

initContentTypeRegistry(registeredContentTypes);

initReactComponentRegistry({
  resolver: {
    BlankExperience,
    BlankSection,
    Page,
    RichTextBlock: RichText,
    HeroBlock,
    FdPromoSplit,
    FdFeatureGrid,
    FdProduct,
    FdProductGrid,
    FdProductDetail,
    FdShopTheLook,
    // New Resolvers
    FdScheduledSlot,
    FdContentDistributionFeed,
    FdProjectBundle,
    FdAiStyleClassifier,
    FdExperimentContainer,
  },
});
```

---

## Task 4: Push to CMS Instance

Run from the repository root:
```bash
npm run cms:push
```
Verify that the output displays all 17 content types created/updated successfully in the Optimizely SaaS instance.

---

## Task 5: 60-Second "Fast Field" Demo Script for Live Call

During the live demo with Dawn and Allycia:
1. Open `cms/FdProduct.tsx` in VS Code and add:
   ```typescript
   CommercialWarranty: { type: 'string', format: 'shortString', displayName: 'Commercial Warranty (Years)', sortOrder: 170 },
   ```
2. Run `npm run cms:push`.
3. Switch to the browser in Optimizely Visual Builder and refresh the Property Inspector to show the new property live in under 5 seconds with zero code deployments.
