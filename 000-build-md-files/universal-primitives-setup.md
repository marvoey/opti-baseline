# Task: Implement Universal Component Library Primitives for Optimizely CMS SaaS

## Context & Objectives
We are expanding our Optimizely CMS SaaS + Next.js baseline (`opti-baseline`) to support the **Universal Component Library** primitives:
1. **Prose** (already partially in `cms/RichText.tsx`, needs intent taxonomy)
2. **Card** (`CardBlock`)
3. **Action** (`ActionBlock`)
4. **Media** (`MediaBlock`)
5. **Wayfinding** (`WayfindingBlock`)

All primitives must:
- Follow `@optimizely/cms-sdk` patterns (`contentType()`, `baseType: '_component'`).
- Set `compositionBehaviors: ['elementEnabled', 'sectionEnabled']` to be available for Visual Builder compositions.
- Include standardized intent taxonomy properties (`Intent`, `Audience`, `Domain`, `Geo`) for deterministic Optimizely Graph queries.
- Support visual builder preview tags using `getPreviewUtils(content).pa(...)`.
- Be registered in `cms/registry.ts`.
- Be pushed to CMS SaaS using `npm run config:push`.

---

## Step 1: Update `cms/shared.ts`
Append the standardized intent taxonomy properties to `cms/shared.ts`:

```typescript
/** Standardized taxonomy properties for intent-driven assembly via Optimizely Graph */
export const intentTaxonomyProperties = {
  Intent: {
    type: 'string',
    displayName: 'Intent Tag',
    description: 'High-level user intent (e.g., explore, evaluate, transact, compliance).',
    isLocalized: false,
    sortOrder: 100,
  },
  Audience: {
    type: 'string',
    displayName: 'Target Audience',
    description: 'Target audience segment (e.g., enterprise, smb, developer, c-suite).',
    isLocalized: false,
    sortOrder: 110,
  },
  Domain: {
    type: 'string',
    displayName: 'Domain / Vertical',
    description: 'Functional domain (e.g., security, cloud, governance, finance).',
    isLocalized: false,
    sortOrder: 120,
  },
  Geo: {
    type: 'string',
    displayName: 'Geo / Region',
    description: 'Geographic region or "global".',
    isLocalized: false,
    sortOrder: 130,
  },
} as const;
```

---

## Step 2: Update `cms/RichText.tsx` (Prose Primitive)
Update `cms/RichText.tsx` so its content type includes `...intentTaxonomyProperties`:

```tsx
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';
import { intentTaxonomyProperties } from './shared';

export const RichTextContentType = contentType({
  key: 'RichTextBlock',
  baseType: '_component',
  displayName: 'Rich Text (Prose)',
  description: 'Editorial narrative and formatted prose block.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Body: {
      type: 'richText',
      displayName: 'Body',
      description: 'Formatted text content.',
      isLocalized: true,
      sortOrder: 10,
    },
    ...intentTaxonomyProperties,
  },
});

type Props = { content: ContentProps<typeof RichTextContentType> };

export default function RichText({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  return (
    <section {...pa(block)} className="w-full px-6 py-12">
      <div {...pa('Body')} className="prose mx-auto max-w-3xl">
        <RichTextRenderer content={content.Body?.json} />
      </div>
    </section>
  );
}
```

---

## Step 3: Create `cms/CardBlock.tsx` (Card Primitive)
Create `cms/CardBlock.tsx`:

```tsx
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { intentTaxonomyProperties, ctaHref, type OptiLink } from './shared';

export const CardBlockContentType = contentType({
  key: 'CardBlock',
  baseType: '_component',
  displayName: 'Card Primitive',
  description: 'Self-contained micro-container for modular aggregation and intent-driven grids.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Title: {
      type: 'string',
      displayName: 'Title',
      isRequired: true,
      sortOrder: 10,
    },
    Eyebrow: {
      type: 'string',
      displayName: 'Eyebrow / Category',
      sortOrder: 20,
    },
    Description: {
      type: 'string',
      displayName: 'Description',
      sortOrder: 30,
    },
    Link: {
      type: 'link',
      displayName: 'Target Link',
      sortOrder: 40,
    },
    ...intentTaxonomyProperties,
  },
});

type Props = { content: ContentProps<typeof CardBlockContentType> };

export default function CardBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  return (
    <div
      {...pa(block)}
      className="rounded-xl border border-neutral-200 bg-white p-6 shadow-sm transition hover:shadow-md"
    >
      {content.Eyebrow && (
        <span {...pa('Eyebrow')} className="text-xs font-semibold uppercase tracking-wider text-blue-600">
          {content.Eyebrow}
        </span>
      )}
      <h3 {...pa('Title')} className="mt-2 text-xl font-bold text-neutral-900">
        {content.Title}
      </h3>
      {content.Description && (
        <p {...pa('Description')} className="mt-2 text-sm text-neutral-600">
          {content.Description}
        </p>
      )}
      {content.Link && (
        <a
          {...pa('Link')}
          href={ctaHref(content.Link as OptiLink)}
          className="mt-4 inline-flex items-center text-sm font-medium text-blue-600 hover:underline"
        >
          Learn more &rarr;
        </a>
      )}
    </div>
  );
}
```

---

## Step 4: Create `cms/ActionBlock.tsx` (Action Primitive)
Create `cms/ActionBlock.tsx`:

```tsx
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { intentTaxonomyProperties, ctaHref, type OptiLink } from './shared';

export const ActionBlockContentType = contentType({
  key: 'ActionBlock',
  baseType: '_component',
  displayName: 'Action Primitive',
  description: 'Call to action and conversion trigger.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Label: {
      type: 'string',
      displayName: 'Label',
      isRequired: true,
      sortOrder: 10,
    },
    Link: {
      type: 'link',
      displayName: 'Action URL',
      isRequired: true,
      sortOrder: 20,
    },
    Variant: {
      type: 'string',
      displayName: 'Button Variant (primary | secondary | outline)',
      sortOrder: 30,
    },
    ...intentTaxonomyProperties,
  },
});

type Props = { content: ContentProps<typeof ActionBlockContentType> };

export default function ActionBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const isSecondary = content.Variant === 'secondary';

  return (
    <div {...pa(block)} className="py-2">
      <a
        {...pa('Link')}
        href={ctaHref(content.Link as OptiLink)}
        className={`inline-flex items-center justify-center rounded-lg px-6 py-3 text-sm font-semibold transition ${
          isSecondary
            ? 'bg-neutral-100 text-neutral-900 hover:bg-neutral-200'
            : 'bg-blue-600 text-white hover:bg-blue-700'
        }`}
      >
        <span {...pa('Label')}>{content.Label ?? 'Click Here'}</span>
      </a>
    </div>
  );
}
```

---

## Step 5: Create `cms/MediaBlock.tsx` (Media Primitive)
Create `cms/MediaBlock.tsx`:

```tsx
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { intentTaxonomyProperties } from './shared';

export const MediaBlockContentType = contentType({
  key: 'MediaBlock',
  baseType: '_component',
  displayName: 'Media Primitive',
  description: 'Visual asset container for diagrams, product visuals, and media assets.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    MediaUrl: {
      type: 'string',
      displayName: 'Media Asset URL',
      isRequired: true,
      sortOrder: 10,
    },
    AltText: {
      type: 'string',
      displayName: 'Alt Text / Description',
      sortOrder: 20,
    },
    Caption: {
      type: 'string',
      displayName: 'Caption',
      sortOrder: 30,
    },
    ...intentTaxonomyProperties,
  },
});

type Props = { content: ContentProps<typeof MediaBlockContentType> };

export default function MediaBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  return (
    <figure {...pa(block)} className="overflow-hidden rounded-xl border border-neutral-100 bg-neutral-50 p-2">
      <img
        {...pa('MediaUrl')}
        src={content.MediaUrl ?? ''}
        alt={content.AltText ?? ''}
        className="h-auto w-full rounded-lg object-cover"
      />
      {content.Caption && (
        <figcaption {...pa('Caption')} className="mt-2 text-center text-xs text-neutral-500">
          {content.Caption}
        </figcaption>
      )}
    </figure>
  );
}
```

---

## Step 6: Create `cms/WayfindingBlock.tsx` (Wayfinding Primitive)
Create `cms/WayfindingBlock.tsx`:

```tsx
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { intentTaxonomyProperties } from './shared';

export const WayfindingBlockContentType = contentType({
  key: 'WayfindingBlock',
  baseType: '_component',
  displayName: 'Wayfinding Primitive',
  description: 'Step indicators, breadcrumbs, and progressive disclosure navigation.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    StepTitle: {
      type: 'string',
      displayName: 'Current Stage / Step Title',
      isRequired: true,
      sortOrder: 10,
    },
    TotalSteps: {
      type: 'string',
      displayName: 'Total Steps Indicator (e.g. Step 1 of 3)',
      sortOrder: 20,
    },
    ...intentTaxonomyProperties,
  },
});

type Props = { content: ContentProps<typeof WayfindingBlockContentType> };

export default function WayfindingBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  return (
    <nav {...pa(block)} aria-label="Progress" className="my-4">
      <div className="flex items-center space-x-3 text-sm">
        <span {...pa('TotalSteps')} className="font-semibold text-blue-600">
          {content.TotalSteps ?? 'Phase 1'}
        </span>
        <span className="text-neutral-300">/</span>
        <span {...pa('StepTitle')} className="font-medium text-neutral-800">
          {content.StepTitle}
        </span>
      </div>
    </nav>
  );
}
```

---

## Step 7: Update `cms/registry.ts`
Import and register all 5 primitives in `cms/registry.ts`:

```typescript
import {
  config,
  initContentTypeRegistry,
  initDisplayTemplateRegistry,
  BlankExperienceContentType,
  BlankSectionContentType,
} from '@optimizely/cms-sdk';
import { initReactComponentRegistry } from '@optimizely/cms-sdk/react/server';
import { requireEnv } from '@/lib/env';

import BlankExperience from './BlankExperience';
import BlankSection from './BlankSection';
import Page, { PageContentType } from './Page';

// Universal Component Library Primitives
import RichText, { RichTextContentType } from './RichText';
import CardBlock, { CardBlockContentType } from './CardBlock';
import ActionBlock, { ActionBlockContentType } from './ActionBlock';
import MediaBlock, { MediaBlockContentType } from './MediaBlock';
import WayfindingBlock, { WayfindingBlockContentType } from './WayfindingBlock';

const env = requireEnv();

config({
  apiKey: env.OPTIMIZELY_GRAPH_SINGLE_KEY,
  graphUrl: env.OPTIMIZELY_GRAPH_GATEWAY,
});

export const registeredContentTypes = [
  BlankExperienceContentType,
  BlankSectionContentType,
  PageContentType,
  // Universal Component Primitives
  RichTextContentType,
  CardBlockContentType,
  ActionBlockContentType,
  MediaBlockContentType,
  WayfindingBlockContentType,
];

initContentTypeRegistry(registeredContentTypes);

initDisplayTemplateRegistry([]);

initReactComponentRegistry({
  resolver: {
    BlankExperience,
    BlankSection,
    Page,
    // Primitive mappings (resolver key === content-type key)
    RichTextBlock: RichText,
    CardBlock: CardBlock,
    ActionBlock: ActionBlock,
    MediaBlock: MediaBlock,
    WayfindingBlock: WayfindingBlock,
  },
});
```

---

## Step 8: Execution & Validation
Once the files are created and updated, run:

```bash
# 1. Type check
npm run lint # or npx tsc --noEmit

# 2. Push content types and schemas to CMS SaaS
npm run config:push
```

### Verification in CMS SaaS:
1. Open the CMS SaaS Admin UI -> **Content Types**.
2. Confirm `CardBlock`, `ActionBlock`, `MediaBlock`, and `WayfindingBlock` appear with base type `_component`.
3. Confirm **Available for composition in Visual Builder** is active on each.
4. Verify that each component displays the `Intent`, `Audience`, `Domain`, and `Geo` taxonomy properties.
