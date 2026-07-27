# Content Model

## Overview

The content model is Visual Builder–first. Every page is a `BlankExperience`
composed of sections. Sections hold columns. Columns hold blocks.

```
BlankExperience (_experience)
  └── Section (HeroSection | SidebarSection | SplitSection | FeedSection)
        └── Column
              └── Block (Paragraph | CardBlock | ActionBlock | ComplianceBlock | HeroBlockv2 | Image)
```

## Content types

### BlankExperience

| Key | Base | File |
|---|---|---|
| `BlankExperience` | `_experience` | `cms/BlankExperience.tsx` |

The Visual Builder root. Accepts any section type. Renders as a plain `<div>`
wrapper — the SDK assembles sections from composition metadata.

### Section layouts

All section types extend `_section` and carry the `sectionEnabled` composition
behaviour. They define the slot layout (column widths) that the Visual Builder
editor uses.

| Key | Layout | File |
|---|---|---|
| `HeroSection` | Single full-width slot | `cms/HeroSection.tsx` |
| `SidebarSection` | 25 / 75 sidebar + main | `cms/SidebarSection.tsx` |
| `SplitSection` | 60 / 40 split | `cms/SplitSection.tsx` |
| `FeedSection` | Single column feed | `cms/FeedSection.tsx` |

`BlankSection` is a system type (no `contentType()` call) used internally by the
SDK for the default grid.

### Blocks

All blocks extend `_component` and carry `elementEnabled`.

#### Paragraph

Key: `Paragraph` · File: `cms/BasicBlocks/Paragraph.tsx`

| Property | Type | Notes |
|---|---|---|
| `Text` | richText | Localised, searchable |
| `Intent` | enum | Taxonomy — see below |
| `Persona` | enum | Taxonomy |
| `Service` | string[] | Taxonomy, required |
| `Geo` | enum | Taxonomy |

Display template: `DefaultParagraph`. Template setting `hideToc` (Yes/No)
controls whether `ParagraphTocNav` (sticky IntersectionObserver TOC) renders.

#### HeroBlockv2

Key: `HeroBlockv2` · File: `cms/BasicBlocks/HeroBlock.tsx`

| Property | Type | Notes |
|---|---|---|
| `BackgroundImage` | contentRef | Optimizely DAM reference |
| `AltText` | string | |
| `Body` | richText | |
| `Intent / Persona / Service / Geo` | taxonomy | |

Display template: `HeroBlockv2Default`. Template setting `theme`
(`default` / `light` / `dark`) controls text colour overlay.

#### CardBlock

Key: `CardBlock` · File: `cms/BasicBlocks/CardBlock.tsx`

| Property | Type | Notes |
|---|---|---|
| `Title` | string | |
| `Body` | richText | |
| `Link` | url | |
| `Intent / Persona / Service / Geo` | taxonomy | `Service` required |

#### ActionBlock

Key: `ActionBlock` · File: `cms/BasicBlocks/ActionBlock.tsx`

| Property | Type | Notes |
|---|---|---|
| `Label` | string | Button text |
| `Href` | url | |
| `Variant` | enum | `primary` / `secondary` / `danger` |
| `Intent / Persona / Service / Geo` | taxonomy | |

#### ComplianceBlock

Key: `ComplianceBlock` · File: `cms/BasicBlocks/ComplianceBlock.tsx`

| Property | Type | Notes |
|---|---|---|
| `Jurisdiction` | string | |
| `Body` | richText | Legally mandated text |
| `Intent / Persona / Service / Geo` | taxonomy | |

#### Image

Key: `Image` · File: `cms/Image.tsx`

| Property | Type | Notes |
|---|---|---|
| `Src` | contentRef | DAM reference |
| `Alt` | string | |

Display template: `DefaultImage`. Template settings:

- `displayAs`: `inline` (renders `<img>`) / `background` (CSS background)
- `overlay`: `none` / `light` / `dark`

## Taxonomy

All block types share four taxonomy fields. Values are tightly coupled to the
CIBC Mellon demo context — update the enum arrays in each content type file when
porting to a different prospect.

### Intent

Controls which "journey stage" a block belongs to.

| Value | Label |
|---|---|
| `discover_recommend` | Discover & Recommend |
| `educate_govern` | Educate & Govern |
| `simulate_transact` | Simulate & Transact |

### Persona

Target audience for the block.

| Value |
|---|
| `asset_manager` |
| `pension_fund` |
| `corporate_sponsor` |
| `foreign_institution` |
| `insurance_provider` |

### Service

The CIBC Mellon product or service line the block relates to.

| Value |
|---|
| `fund_administration` |
| `foreign_exchange` |
| `treasury_services` |
| `etf_services` |
| `alternative_investments` |
| `securities_lending` |
| `global_custody` |
| `recordkeeping` |
| `esg` |
| `regulatory` |
| `tax` |
| `digital_assets` |
| `onboarding` |
| `compliance` |

### Geo

Jurisdictional coverage.

| Value |
|---|
| `canada` |
| `europe` |
| `united_states` |
| `global` |

## Display templates

| Template key | Applies to | Settings |
|---|---|---|
| `DefaultParagraph` | `Paragraph` | `hideToc` (checkbox) |
| `DefaultImage` | `Image` | `displayAs` (inline/background), `overlay` (none/light/dark) |
| `ColumnDefault` | column nodes | `position` (default/relative) |
| `HeroBlockv2Default` | `HeroBlockv2` | `theme` (default/light/dark) |

## Registration

`cms/registry.ts` is the single source of truth. Every content type, display
template, and key→component mapping must be registered there. The file also
configures the SDK Graph client using credentials from `lib/env.ts`.

To add a new content type:

1. Create `cms/<Name>.tsx` — export `contentType()`, a default component, and any
   `displayTemplate()`.
2. Add all three to `cms/registry.ts`.
3. `npm run cms:push` — syncs the definitions to the CMS.

## Property group

`optimizely.config.mjs` defines one property group: **Taxonomy** (sortOrder 100).
The four taxonomy fields (`Intent`, `Persona`, `Service`, `Geo`) are assigned to
this group in each block's `contentType()` call, grouping them together in the
CMS editor UI.
