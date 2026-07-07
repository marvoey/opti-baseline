# Context

The agentic CMS POC at https://marvoey.github.io/opti-agentic-cms/ defines 5 "Universal Primitive" building blocks. The idea: the AI writes semantic JSON payloads (selecting enum values, filling string fields) — it never writes HTML or CSS. The front-end renderer maps those semantics to Tailwind classes. This plan adds all 5 primitives to the app as Optimizely content types + React renderers.

The existing `RichText.tsx` is already the equivalent of **Prose Block** — it just needs a `SemanticVariant` enum property added. The other 4 are new files.

---

## The 5 Blocks

| Block | CMS key | File | Status |
|---|---|---|---|
| Prose Block | `ProseBlock` | `cms/RichText.tsx` (extend) | Extend existing |
| Media Block | `MediaBlock` | `cms/MediaBlock.tsx` | New |
| Action Block | `ActionBlock` | `cms/ActionBlock.tsx` | New |
| Wayfinding Block | `WayfindingBlock` | `cms/WayfindingBlock.tsx` | New |
| Card Block | `CardBlock` | `cms/CardBlock.tsx` | New |
| _(sub-type)_ | `NavigationNode` | `cms/NavigationNode.tsx` | New — used by WayfindingBlock |

---

## Implementation Plan

### 1. Extend `cms/RichText.tsx` → Prose Block

Add a `SemanticVariant` enum property to the existing `RichTextContentType`. Update the key from `RichTextBlock` to `ProseBlock` (and update registry + Page accordingly).

**New property:**
```ts
SemanticVariant: {
  type: 'string',
  displayName: 'Semantic Variant',
  enum: [
    { value: 'standard_body', displayName: 'Standard Body' },
    { value: 'lede_paragraph', displayName: 'Lede Paragraph' },
    { value: 'pull_quote', displayName: 'Pull Quote' },
  ],
  sortOrder: 5,
}
```

**Renderer variant mapping (Tailwind):**
- `standard_body` (default): `prose mx-auto max-w-3xl` — unchanged
- `lede_paragraph`: `prose prose-xl mx-auto max-w-2xl text-gray-600` — larger lead text
- `pull_quote`: `border-l-4 border-blue-600 pl-6 italic text-xl text-blue-950` — styled blockquote, no `prose` wrapper needed

---

### 2. `cms/MediaBlock.tsx` — new

**Content type key:** `MediaBlock`  
**baseType:** `_component`  
**compositionBehaviors:** `['elementEnabled', 'sectionEnabled']`

**Properties:**
```ts
MediaType:      string enum  ['static_image', 'looping_video', 'data_chart']  required
AssetReference: contentReference  allowedTypes: ['_image', '_video', '_media']  isLocalized
AltText:        string  required  isLocalized
AspectRatio:    string enum  ['16_9', '4_3', '1_1', 'auto']  default auto
```

**Renderer:** Switch on `MediaType`. For `static_image`: `<img>` with aspect ratio class. For `looping_video`: `<video autoPlay muted loop playsInline>`. For `data_chart`: placeholder `<div>` (chart rendering is out of scope for the POC).

**Aspect ratio Tailwind classes:** `16_9` → `aspect-video`, `4_3` → `aspect-[4/3]`, `1_1` → `aspect-square`, `auto` → no constraint.

---

### 3. `cms/ActionBlock.tsx` — new

**Content type key:** `ActionBlock`  
**baseType:** `_component`  
**compositionBehaviors:** `['elementEnabled', 'sectionEnabled']`

**Properties:**
```ts
InteractionType:  string enum  ['button', 'text_link', 'email_form']  required
ActionLabel:      string  maxLength: 30  required  isLocalized
DestinationUrl:   url  isLocalized
VisualHierarchy:  string enum  ['primary', 'secondary', 'ghost']  required
```

**Renderer — hierarchy Tailwind mapping:**
- `primary`: `rounded-full bg-blue-600 px-7 py-3.5 font-bold text-white hover:bg-blue-500`
- `secondary`: `rounded-full border-2 border-blue-600 px-7 py-3.5 font-bold text-blue-600 hover:bg-blue-600 hover:text-white`
- `ghost`: `font-bold text-blue-600 underline-offset-2 hover:underline`

`email_form` renders a simple `<input type="email">` + submit `<button>` pair (no server action needed for POC — static markup).

---

### 4. `cms/NavigationNode.tsx` — new (sub-type)

A minimal content type used as items inside WayfindingBlock's node array.

**Content type key:** `NavigationNode`  
**baseType:** `_component`  
**compositionBehaviors:** `['elementEnabled']`

**Properties:**
```ts
Label:  string  required  isLocalized
Target: url     isLocalized
```

No standalone renderer needed (rendered inline by WayfindingBlock).

---

### 5. `cms/WayfindingBlock.tsx` — new

**Content type key:** `WayfindingBlock`  
**baseType:** `_component`  
**compositionBehaviors:** `['elementEnabled', 'sectionEnabled']`

**Properties:**
```ts
WayfindingType:   string enum  ['toc', 'breadcrumbs', 'wizard']  required
NavigationNodes:  array  items: { type: 'content', allowedTypes: [NavigationNodeContentType] }  isLocalized
```

**Renderer — type mapping:**
- `toc`: sticky `<nav>` aside with `<ol>` of anchor links. Max 5 items per spec. `sticky top-4` positioning.
- `breadcrumbs`: `<nav aria-label="Breadcrumb">` with `/` separators, `text-sm text-gray-500`.
- `wizard`: horizontal step indicators with numbered circles + labels. Active step gets `bg-blue-600 text-white`.

---

### 6. `cms/CardBlock.tsx` — new

**Content type key:** `CardBlock`  
**baseType:** `_component`  
**compositionBehaviors:** `['elementEnabled', 'sectionEnabled']`

**Properties (inline, not by reference — simpler POC rendering):**
```ts
Title:        string  maxLength: 80  required  isLocalized
SummaryText:  string  isLocalized
MetaTag:      string  isLocalized
// Inline thumbnail rather than contentReference to avoid expand-ref complexity:
ThumbnailUrl: url     isLocalized
ThumbnailAlt: string  isLocalized
// Inline action fields:
ActionLabel:  string  maxLength: 30  isLocalized
ActionUrl:    url     isLocalized
ActionHierarchy: string enum  ['primary', 'secondary', 'ghost']
```

> **Note:** The spec calls for `ThumbnailMedia` → `Reference[MediaBlock]` and `CardAction` → `Reference[ActionBlock]`. For this POC we inline the fields to keep rendering straightforward (no expand-refs logic needed). This is a known simplification vs the reference architecture.

**Renderer:** `<article>` card with `rounded-xl shadow border border-gray-100 overflow-hidden`. Thumbnail on top, then MetaTag badge, Title, SummaryText, and CTA button (reuses the same Tailwind classes as ActionBlock's hierarchy mapping).

---

## Files Changed

| File | Change |
|---|---|
| `cms/RichText.tsx` | Add `SemanticVariant` property + update renderer + rename key to `ProseBlock` |
| `cms/MediaBlock.tsx` | Create |
| `cms/ActionBlock.tsx` | Create |
| `cms/NavigationNode.tsx` | Create |
| `cms/WayfindingBlock.tsx` | Create |
| `cms/CardBlock.tsx` | Create |
| `cms/registry.ts` | Import + register all 6 types in all 3 calls |
| `cms/Page.tsx` | Add all 5 block types to `Content.items.allowedTypes` |

---

## Verification

1. `npx tsc --noEmit` — zero errors
2. `npm run dev` — site loads at `localhost:3000`
3. `npm run config:push` — all 6 new types appear in CMS admin under their base type group
4. Open `/admin` — verify all 6 types appear in the inspector
5. In CMS Visual Builder, confirm each block type can be added to a page and its properties are editable
