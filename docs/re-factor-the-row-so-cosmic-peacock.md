# Expose Tailwind Layout + Flexbox/Grid utilities on Section, Row & Column

## Context

Earlier this session the Row was refactored into a flexbox with a handful of flex
settings, and the Column into `flex-basis` widths. The user now wants the **full
Tailwind "Layout" and "Flexbox & Grid" utility surface** available as display-template
settings on **Section, Row, and Column**, so editors can compose layout entirely from
the CMS without code changes.

Decisions locked with the user:
- **Scope:** every utility from the docs' *Layout* + *Flexbox & Grid* nav groups, each with
  a **curated** value set (not arbitrary values / not full numeric scales).
- **Responsive:** **single mobile-first value** per utility — one `select`, emitted as an
  unprefixed base class (mobile-first). No per-breakpoint controls.
- **Per-component:** **role-appropriate** — Row/Column get container + item utilities;
  Section gets box + container (keeps its existing brand settings).

Constraints (confirmed): the SDK only supports `editor: 'select' | 'checkbox'` with
`choices: {displayName, sortOrder}`; `displaySettings` arrives as
`Record<string, string|boolean>`; **all Tailwind classes must be literal strings in source**
(v4 auto-scan — dynamic `md:${cls}` concatenation is NOT scanned). No shared catalog exists
today — every component inlines its own settings + class maps.

## Approach: one shared, declarative utility catalog

Create **`cms/layout/catalog.ts`** as the single source of truth. Each utility is declared
once with its choices carrying BOTH the editor label and the **literal** Tailwind class:

```ts
export type Choice = { displayName: string; class: string };
export type Utility = { key: string; displayName: string; editor?: 'select' | 'checkbox'; choices: Record<string, Choice> };

// grouped by role
export const BOX_UTILITIES: Utility[]       = [ /* Layout category */ ];
export const CONTAINER_UTILITIES: Utility[] = [ /* Flexbox & Grid — container */ ];
export const ITEM_UTILITIES: Utility[]      = [ /* Flexbox & Grid — item */ ];
```

Two helpers derive everything from the catalog:

```ts
// → the displayTemplate `settings` object; sortOrder auto-assigned from array order,
//   `class` stripped out. Groups concatenated in the order given.
export function buildSettings(groups: Utility[][]): SettingsType

// → className string: for each utility, value = displaySettings[key] ?? defaults[key];
//   push choices[value].class when present. Unset utilities emit nothing.
export function resolveClasses(groups: Utility[][], ds?: Record<string,string|boolean>, defaults?: Record<string,string>): string
```

Because `resolveClasses` only emits a class when a value is set (or a per-component default
is given), an unconfigured element stays clean — no utility is forced on.

### Catalog contents (curated values)

**BOX_UTILITIES** (Layout category): `aspect` (auto/square/video), `boxSizing` (border/content),
`float` (none/left/right), `clear` (none/left/right/both), `isolation` (isolate/auto),
`objectFit` (contain/cover/fill/none/scale-down), `objectPosition` (center/top/bottom/left/right),
`overflow` + `overflowX` + `overflowY` (visible/auto/hidden/clip/scroll), `overscroll`
(auto/contain/none), `position` (static/relative/absolute/fixed/sticky), `inset`
(0/px/1/2/4/8/auto/full), `visibility` (visible/invisible/collapse), `zIndex`
(0/10/20/30/40/50/auto), `columns` (1/2/3/auto). *(break-before/after/inside and
box-decoration omitted as not useful on these containers — noted, not silently dropped.)*

**CONTAINER_UTILITIES** (Flexbox & Grid — container): `display`
(block/inline-block/flex/inline-flex/grid/inline-grid/hidden/contents), `direction`
(row/rowReverse/col/colReverse), `wrap` (wrap/nowrap/wrapReverse), `justify` (justify-content:
start/end/center/between/around/evenly/normal/stretch), `justifyItems`
(start/end/center/stretch/normal), `alignItems` (items-*: start/end/center/baseline/stretch),
`alignContent` (content-*), `placeContent`, `placeItems`, `gap` + `gapX` + `gapY`
(none/sm/md/lg/xl → gap-0/3/6/10/16), `gridCols` (none/1..12/subgrid), `gridRows`
(none/1..6/subgrid), `autoFlow` (row/col/dense/row-dense/col-dense), `autoCols`
(auto/min/max/fr), `autoRows` (auto/min/max/fr).

**ITEM_UTILITIES** (Flexbox & Grid — item): `flex` (initial/auto/one→flex-1/none),
`grow` (grow-0/grow), `shrink` (shrink-0/shrink), `order` (first/last/none/1..12),
`span` (**flex width**, keeps existing key: full/twoThird/half/third/quarter → `md:basis-*`),
`colSpan` (1..12/full/auto → col-span-*/col-auto), `colStart` (1..13/auto),
`colEnd` (1..13/auto), `rowSpan` (1..6/full/auto), `rowStart`, `rowEnd`,
`justifySelf`, `alignSelf` (self-*), `placeSelf`.

Every `class` value is a literal (e.g. `'flex-row'`, `'md:basis-1/2'`, `'col-span-6'`,
`'z-10'`), so Tailwind scans them from `catalog.ts`. No `@source inline` needed.

## Per-component wiring

**`cms/gridContainers.tsx`** — replace the inline maps + hand-written templates with the catalog:

```ts
const ROW_GROUPS = [CONTAINER_UTILITIES, BOX_UTILITIES, ITEM_UTILITIES];
const ROW_DEFAULTS = { display:'flex', direction:'row', wrap:'wrap', alignItems:'stretch', justify:'start', gap:'md' };
export function V1Row({node, children, displaySettings}) {
  const { pa } = getPreviewUtils(node);
  return <div {...pa(node)} className={resolveClasses(ROW_GROUPS, displaySettings, ROW_DEFAULTS)}>{children}</div>;
}
export const V1RowDefault = displayTemplate({ key:'V1RowDefault', isDefault:true, displayName:'V1: Row', nodeType:'row', settings: buildSettings(ROW_GROUPS) });

const COLUMN_GROUPS = [CONTAINER_UTILITIES, BOX_UTILITIES, ITEM_UTILITIES];
const COLUMN_DEFAULTS = { display:'flex', direction:'col', gap:'md', span:'full', alignItems:'start' };
export function V1Column({node, children, displaySettings}) {
  const { pa } = getPreviewUtils(node);
  // constant mobile-first base: full width until md, then the `span` utility's md:basis-* applies
  const cls = `basis-full min-w-0 ${resolveClasses(COLUMN_GROUPS, displaySettings, COLUMN_DEFAULTS)}`;
  return <div {...pa(node)} className={cls}>{children}</div>;
}
export const V1ColumnDefault = displayTemplate({ key:'V1ColumnDefault', isDefault:true, displayName:'V1: Column', nodeType:'column', settings: buildSettings(COLUMN_GROUPS) });
```

**`cms/V1Section.tsx`** — keep the existing brand settings (theme/decoration/padding/rounded)
and their `THEME`/`PADDING` logic; append catalog groups. Section is a box + container (no
item group), and must NOT default to flex (its child is a single wrapper div):

```ts
const SECTION_GROUPS = [CONTAINER_UTILITIES, BOX_UTILITIES];   // no defaults → block unless chosen
settings: { ...BRAND_SETTINGS, ...buildSettings(SECTION_GROUPS) }
// className: [...existing brand classes, resolveClasses(SECTION_GROUPS, displaySettings)]
```
Brand settings stay authored inline (they carry bespoke classes, not 1:1 Tailwind utilities);
merge their `sortOrder`s before the catalog block so they lead the editor panel.

## Compatibility & notes

- **Preserve existing keys** so already-configured/seeded content keeps mapping: `gap`
  (sm/md/lg retained: gap-3/6/10, plus none/xl), `direction`, `wrap`, `justify`, `alignItems`,
  and Column `span` (full/twoThird/half/third/quarter). Column previously used key `align` →
  standardize on `alignItems`; any Column that had an explicit align set must be re-picked
  (demo content, low risk — call this out to the user).
- **Typing:** dynamic `buildSettings(...)` loosens `ContentProps<typeof V1*Default>` to the
  generic `Record<string,string|boolean>`. That's exactly `StructureContainerProps.displaySettings`
  and is read via `resolveClasses`, so no runtime impact; adjust V1Section's `Props.displaySettings`
  type to `Record<string,string|boolean>`.
- `registry.ts` is unchanged — the three templates are already registered.
- No `app/globals.css` change (all classes literal in the catalog).

## Files
- **New:** `cms/layout/catalog.ts` (catalog + `buildSettings` + `resolveClasses`).
- **Edit:** `cms/gridContainers.tsx` (Row/Column use catalog; delete old inline maps/templates).
- **Edit:** `cms/V1Section.tsx` (append catalog groups to brand settings; merge into className).

## Verification
1. `yarn tsc --noEmit` — types clean across the three files + catalog.
2. Spot-check emitted classes are literal: `grep -o "class: '[^']*'" cms/layout/catalog.ts | head` —
   confirm real Tailwind utilities; build (`yarn build`) and confirm no missing-class warnings.
3. `opti-cli config push` (project's push step) so the expanded Row/Column/Section settings reach the CMS.
4. Run the dev server; in the editor confirm each of Section/Row/Column now lists the full
   curated utility set, and that changing e.g. `display: grid` + `gridCols: 3` on a Row, or
   `position: absolute` + `zIndex: 20` on a Column, visibly takes effect.
5. Confirm an unconfigured Row/Column still renders sensibly (defaults only) and a Section
   with no layout settings stays a plain block.
