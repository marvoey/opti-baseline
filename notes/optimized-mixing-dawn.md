# Plan: SFA Modular Component System — Content Types

## Context
The SFA Modular Component System Blueprint defines a set of reusable blocks and a
landing page type for building Specialty Food Association pages (Homepage, sofi™ Awards,
FancyFaire) in Optimizely CMS. The `content-types.json` provides the authoritative
list of types to push. This plan creates the corresponding `contentType()` definitions
so `opti-cli config push` registers them in the CMS.

## Approach

### 1. Update `cms/RichText.tsx`
Add `BackgroundColor` property (the JSON's `MainBody` maps to the existing `Body`).
Apply a conditional background class in the component renderer.
```
BackgroundColor: { type: 'string', displayName: 'Background Theme Color',
  description: 'e.g. Default, LightGold, DarkBlue', sortOrder: 15 }
```

### 2. Create `cms/sfa/` — 7 new content type files

SDK type mapping used throughout:
| JSON type              | SDK type                                                         |
|------------------------|------------------------------------------------------------------|
| PropertyString         | `type: 'string'`                                                 |
| PropertyXhtmlString    | `type: 'richText'`                                               |
| PropertyUrl            | `type: 'url'`                                                    |
| PropertyBoolean        | `type: 'boolean'`                                                |
| PropertyNumber         | `type: 'integer'`                                                |
| PropertyContentRef     | `type: 'content', allowedTypes: [], restrictedTypes: []`         |
| PropertyContentArea    | `type: 'array', items: { type: 'content', allowedTypes: [], restrictedTypes: [] }` |

All blocks: `baseType: '_component'`, `compositionBehaviors: ['elementEnabled']`.

#### `cms/sfa/EventLandingPage.tsx`
Key: `EventLandingPage`, baseType: `_page`
Properties: `Title` (string), `MainContentArea` (array/content), `SidebarContentArea` (array/content)
Renderer: flex layout — full-width `<main>` with conditional `<aside>` when sidebar has items.

#### `cms/sfa/HeroBannerBlock.tsx`
Key: `HeroBannerBlock`, baseType: `_component`
Properties: `Heading` (string), `Subtext` (richText), `BackgroundImage` (content),
`BackgroundVideoUrl` (url), `PrimaryCtaLink` (url), `PrimaryCtaText` (string)
Renderer: full-bleed section, `<video>` when `BackgroundVideoUrl` set, overlay text + CTA button.

#### `cms/sfa/TwoColumnSplitBlock.tsx`
Key: `TwoColumnSplitBlock`, baseType: `_component`
Properties: `MediaAlignment` (string enum: left/right), `LeftContentArea` (array/content), `RightContentArea` (array/content)
Renderer: CSS grid two-column, reverses column order when `MediaAlignment === 'right'`.

#### `cms/sfa/AlertCalloutBlock.tsx`
Key: `AlertCalloutBlock`, baseType: `_component`
Properties: `CalloutTitle` (string), `Message` (richText), `ThemeStyle` (string)
Renderer: full-width callout banner with theme-driven background/border class.

#### `cms/sfa/MetricCardBlock.tsx`
Key: `MetricCardBlock`, baseType: `_component`
Properties: `MetricNumber` (string), `MetricLabel` (string), `IconAsset` (content)
Renderer: centered card — large bold number, label beneath, icon when provided.

#### `cms/sfa/DynamicCarouselBlock.tsx`
Key: `DynamicCarouselBlock`, baseType: `_component`
Properties: `CarouselTitle` (string), `Items` (array/content), `ShowNavigation` (boolean)
Renderer: horizontal scroll row of `<OptimizelyComponent>` items with optional nav dots indicator.

#### `cms/sfa/IframeEmbedBlock.tsx`
Key: `IframeEmbedBlock`, baseType: `_component`
Properties: `EmbedTitle` (string), `IframeUrl` (url), `Height` (integer)
Renderer: `<iframe>` with `height` style from `Height ?? 400`.

### 3. Update `cms/registry.ts`
Import and register all 7 new content types:
- `initContentTypeRegistry` — append all 7 exports
- `initReactComponentRegistry` — add resolver entries keyed by content type key
- No new display templates needed

## Files changed
| Action | File |
|--------|------|
| Edit   | `cms/RichText.tsx` |
| Edit   | `cms/registry.ts` |
| Create | `cms/sfa/EventLandingPage.tsx` |
| Create | `cms/sfa/HeroBannerBlock.tsx` |
| Create | `cms/sfa/TwoColumnSplitBlock.tsx` |
| Create | `cms/sfa/AlertCalloutBlock.tsx` |
| Create | `cms/sfa/MetricCardBlock.tsx` |
| Create | `cms/sfa/DynamicCarouselBlock.tsx` |
| Create | `cms/sfa/IframeEmbedBlock.tsx` |

## Verification
1. `cd opti-baseline-specialtyfood && npx tsc --noEmit` — zero type errors
2. `npx @optimizely/cms-cli config push optimizely.config.mjs --dry-run` — all 7 new types + updated RichTextBlock listed
3. Confirm `--force` flag is NOT needed (RichTextBlock property addition is non-breaking; existing `Body` field is preserved)
