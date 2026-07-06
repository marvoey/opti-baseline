/**
 * Shared Tailwind layout-utility catalog for the V1 structural components
 * (Section / Row / Column). Single source of truth: each utility is declared
 * once with its editor label AND its literal Tailwind class, then two helpers
 * derive both the display-template `settings` object and the runtime className.
 *
 * IMPORTANT — every `class` here MUST be a *literal* string. Tailwind v4 scans
 * source files for class names; a dynamically built class (e.g. `col-span-${n}`)
 * would never be generated. That's why the numeric ranges below are enumerated
 * as literals rather than looped.
 *
 * Utilities are grouped by the role an element plays:
 *   BOX_UTILITIES       — the Tailwind "Layout" category (box-level props)
 *   CONTAINER_UTILITIES — "Flexbox & Grid" props that act on a flex/grid CONTAINER
 *   ITEM_UTILITIES      — "Flexbox & Grid" props that act on a flex/grid ITEM
 *
 * AUTHOR-FACING LABELS. The CMS setting type has no description/help field —
 * `displayName` is the only text surface — so labels are written in plain
 * language (not CSS jargon) and fold short guidance inline, e.g. a "(grid)"
 * marker on settings that only take effect when Display is set to Grid. Group
 * headers are added by `buildSettings` via each group's `label` (rendered as
 * "Label · Setting"), since the CMS can't render true setting sections.
 *
 * Values are mobile-first: a chosen value is emitted as an unprefixed base class
 * (the one exception is the `span` width, which is `md:`-prefixed so columns are
 * full-width on mobile and split at `md` — the Column renderer supplies the base).
 */

export type Choice = { displayName: string; class: string };
export type Utility = {
  key: string;
  displayName: string;
  editor?: 'select' | 'checkbox';
  choices: Record<string, Choice>;
};

/** A named set of utilities. `label` becomes a pseudo-group prefix on each setting. */
export type UtilityGroup = { label?: string; utilities: Utility[] };

// The shape @optimizely/cms-sdk expects for a display template's `settings`.
type SettingDef = {
  displayName: string;
  editor: 'select' | 'checkbox';
  sortOrder: number;
  choices: Record<string, { displayName: string; sortOrder: number }>;
};
export type Settings = Record<string, SettingDef>;

/**
 * Compact choice builder. Each tuple is [key, literalClass, label?]; when the
 * label is omitted the key is used. Keeping the class as a literal in the tuple
 * is what lets Tailwind's scanner discover it.
 *
 * The CMS requires choice keys to start with a non-numeric character, contain
 * only alphanumerics/underscore, and be at least 2 characters. Numeric keys
 * (`'1'`, `'12'`, `'0'`, …) are therefore prefixed with `n` → `'n1'`, `'n12'`,
 * `'n0'`. The label is unaffected (every numeric tuple carries an explicit
 * label showing the plain number), and both the template and `resolveClasses`
 * read from this same normalized map, so the stored value round-trips correctly.
 */
function normalizeKey(key: string): string {
  return /^[0-9]/.test(key) ? `n${key}` : key;
}

function choices(entries: Array<[string, string, string?]>): Record<string, Choice> {
  const out: Record<string, Choice> = {};
  for (const [key, cls, label] of entries) {
    out[normalizeKey(key)] = { displayName: label ?? key, class: cls };
  }
  return out;
}

/* ------------------------------------------------------------------ *
 * BOX — Tailwind "Layout" category
 * ------------------------------------------------------------------ */
export const BOX_UTILITIES: Utility[] = [
  {
    key: 'aspect',
    displayName: 'Aspect ratio',
    choices: choices([
      ['auto', 'aspect-auto', 'Auto'],
      ['square', 'aspect-square', 'Square (1:1)'],
      ['video', 'aspect-video', 'Widescreen (16:9)'],
    ]),
  },
  {
    key: 'boxSizing',
    displayName: 'Box sizing',
    choices: choices([
      ['border', 'box-border', 'Include border & padding'],
      ['content', 'box-content', 'Content only'],
    ]),
  },
  {
    key: 'float',
    displayName: 'Float',
    choices: choices([
      ['none', 'float-none', 'None'],
      ['left', 'float-left', 'Left'],
      ['right', 'float-right', 'Right'],
    ]),
  },
  {
    key: 'clear',
    displayName: 'Clear floats',
    choices: choices([
      ['none', 'clear-none', 'None'],
      ['left', 'clear-left', 'Left'],
      ['right', 'clear-right', 'Right'],
      ['both', 'clear-both', 'Both'],
    ]),
  },
  {
    key: 'isolation',
    displayName: 'Isolate (new stacking context)',
    choices: choices([
      ['isolate', 'isolate', 'Isolate'],
      ['auto', 'isolation-auto', 'Auto'],
    ]),
  },
  {
    key: 'objectFit',
    displayName: 'Media fit (images / video)',
    choices: choices([
      ['contain', 'object-contain', 'Fit inside (contain)'],
      ['cover', 'object-cover', 'Fill & crop (cover)'],
      ['fill', 'object-fill', 'Stretch to fill'],
      ['none', 'object-none', 'Original size'],
      ['scaleDown', 'object-scale-down', 'Scale down if needed'],
    ]),
  },
  {
    key: 'objectPosition',
    displayName: 'Media position (images / video)',
    choices: choices([
      ['center', 'object-center', 'Center'],
      ['top', 'object-top', 'Top'],
      ['bottom', 'object-bottom', 'Bottom'],
      ['left', 'object-left', 'Left'],
      ['right', 'object-right', 'Right'],
    ]),
  },
  {
    key: 'overflow',
    displayName: 'Overflow (content that spills out)',
    choices: choices([
      ['visible', 'overflow-visible', 'Show (visible)'],
      ['auto', 'overflow-auto', 'Scroll if needed'],
      ['hidden', 'overflow-hidden', 'Clip (hidden)'],
      ['clip', 'overflow-clip', 'Clip (no scroll)'],
      ['scroll', 'overflow-scroll', 'Always scroll'],
    ]),
  },
  {
    key: 'overflowX',
    displayName: 'Horizontal overflow',
    choices: choices([
      ['visible', 'overflow-x-visible', 'Show (visible)'],
      ['auto', 'overflow-x-auto', 'Scroll if needed'],
      ['hidden', 'overflow-x-hidden', 'Clip (hidden)'],
      ['clip', 'overflow-x-clip', 'Clip (no scroll)'],
      ['scroll', 'overflow-x-scroll', 'Always scroll'],
    ]),
  },
  {
    key: 'overflowY',
    displayName: 'Vertical overflow',
    choices: choices([
      ['visible', 'overflow-y-visible', 'Show (visible)'],
      ['auto', 'overflow-y-auto', 'Scroll if needed'],
      ['hidden', 'overflow-y-hidden', 'Clip (hidden)'],
      ['clip', 'overflow-y-clip', 'Clip (no scroll)'],
      ['scroll', 'overflow-y-scroll', 'Always scroll'],
    ]),
  },
  {
    key: 'overscroll',
    displayName: 'Overscroll behaviour',
    choices: choices([
      ['auto', 'overscroll-auto', 'Auto'],
      ['contain', 'overscroll-contain', 'Contain'],
      ['none', 'overscroll-none', 'None'],
    ]),
  },
  {
    key: 'position',
    displayName: 'Positioning',
    choices: choices([
      ['static', 'static', 'Default (in flow)'],
      ['relative', 'relative', 'Relative'],
      ['absolute', 'absolute', 'Absolute'],
      ['fixed', 'fixed', 'Fixed to screen'],
      ['sticky', 'sticky', 'Sticky'],
    ]),
  },
  {
    key: 'inset',
    displayName: 'Offset from edges (needs positioning)',
    choices: choices([
      ['0', 'inset-0', 'None (0)'],
      ['px', 'inset-px', '1px'],
      ['1', 'inset-1', 'Tiny'],
      ['2', 'inset-2', 'Small'],
      ['4', 'inset-4', 'Medium'],
      ['8', 'inset-8', 'Large'],
      ['auto', 'inset-auto', 'Auto'],
      ['full', 'inset-full', 'Full'],
    ]),
  },
  {
    key: 'visibility',
    displayName: 'Visibility',
    choices: choices([
      ['visible', 'visible', 'Visible'],
      ['invisible', 'invisible', 'Hidden (keeps space)'],
      ['collapse', 'collapse', 'Collapse'],
    ]),
  },
  {
    key: 'zIndex',
    displayName: 'Stacking order (front / back)',
    choices: choices([
      ['0', 'z-0', 'Base (0)'],
      ['10', 'z-10', '10'],
      ['20', 'z-20', '20'],
      ['30', 'z-30', '30'],
      ['40', 'z-40', '40'],
      ['50', 'z-50', 'Front (50)'],
      ['auto', 'z-auto', 'Auto'],
    ]),
  },
  {
    key: 'columns',
    displayName: 'Text columns (newspaper-style)',
    choices: choices([
      ['1', 'columns-1', '1'],
      ['2', 'columns-2', '2'],
      ['3', 'columns-3', '3'],
      ['auto', 'columns-auto', 'Auto'],
    ]),
  },
  {
    key: 'padding',
    displayName: 'Inner padding',
    choices: choices([
      ['none', 'p-0', 'None'],
      ['sm',   'p-4', 'Small  (16px)'],
      ['md',   'p-6', 'Medium (24px)'],
      ['lg',   'p-8', 'Large  (32px)'],
    ]),
  },
  {
    key: 'background',
    displayName: 'Background',
    choices: choices([
      ['none',  '',                        'None'],
      ['white', 'bg-white',                'White'],
      ['stone', 'bg-cibc-stone',           'Stone'],
      ['brand', 'bg-cibc-teal text-white', 'Brand (navy)'],
    ]),
  },
];

/**
 * The subset of the Layout category that is meaningful on a *pure container* —
 * box props that establish a positioning / stacking / clipping context FOR the
 * children it arranges. Excludes leaf/content-oriented Layout props (aspect,
 * object-fit/position, float, clear, columns, box-sizing), which belong on the
 * elements that hold actual content, not on an arranger.
 */
const CONTAINER_BOX_KEYS = new Set([
  'position',
  'inset',
  'overflow',
  'overflowX',
  'overflowY',
  'overscroll',
  'zIndex',
  'isolation',
  'visibility',
]);
export const CONTAINER_BOX_UTILITIES: Utility[] = BOX_UTILITIES.filter((u) =>
  CONTAINER_BOX_KEYS.has(u.key),
);

/* ------------------------------------------------------------------ *
 * CONTAINER — "Flexbox & Grid" props acting on the flex/grid container
 * ------------------------------------------------------------------ */
export const CONTAINER_UTILITIES: Utility[] = [
  {
    key: 'display',
    displayName: 'Display mode',
    choices: choices([
      ['block', 'block', 'Block (default)'],
      ['inlineBlock', 'inline-block', 'Inline block'],
      ['flex', 'flex', 'Flex (rows or columns)'],
      ['inlineFlex', 'inline-flex', 'Inline flex'],
      ['grid', 'grid', 'Grid'],
      ['inlineGrid', 'inline-grid', 'Inline grid'],
      ['contents', 'contents', 'No box (contents)'],
      ['hidden', 'hidden', 'Hidden'],
    ]),
  },
  {
    key: 'direction',
    displayName: 'Direction of items (flex)',
    choices: choices([
      ['row', 'flex-row', 'Row → (left to right)'],
      ['rowReverse', 'flex-row-reverse', 'Row ← (right to left)'],
      ['col', 'flex-col', 'Stacked ↓ (top to bottom)'],
      ['colReverse', 'flex-col-reverse', 'Stacked ↑ (bottom to top)'],
    ]),
  },
  {
    key: 'wrap',
    displayName: 'Wrap items to new lines (flex)',
    choices: choices([
      ['wrap', 'flex-wrap', 'Wrap'],
      ['nowrap', 'flex-nowrap', 'Single line (no wrap)'],
      ['wrapReverse', 'flex-wrap-reverse', 'Wrap (reversed)'],
    ]),
  },
  {
    key: 'justify',
    displayName: 'Spacing of items along the direction',
    choices: choices([
      ['start', 'justify-start', 'Start'],
      ['end', 'justify-end', 'End'],
      ['center', 'justify-center', 'Center'],
      ['between', 'justify-between', 'Space between'],
      ['around', 'justify-around', 'Space around'],
      ['evenly', 'justify-evenly', 'Space evenly'],
      ['normal', 'justify-normal', 'Normal'],
      ['stretch', 'justify-stretch', 'Stretch'],
    ]),
  },
  {
    key: 'justifyItems',
    displayName: 'Item horizontal align (grid only)',
    choices: choices([
      ['start', 'justify-items-start', 'Start'],
      ['end', 'justify-items-end', 'End'],
      ['center', 'justify-items-center', 'Center'],
      ['stretch', 'justify-items-stretch', 'Stretch'],
      ['normal', 'justify-items-normal', 'Normal'],
    ]),
  },
  {
    key: 'alignItems',
    displayName: 'Align items (across the direction)',
    choices: choices([
      ['start', 'items-start', 'Start'],
      ['end', 'items-end', 'End'],
      ['center', 'items-center', 'Center'],
      ['baseline', 'items-baseline', 'Baseline'],
      ['stretch', 'items-stretch', 'Stretch (equal height)'],
    ]),
  },
  {
    key: 'alignContent',
    displayName: 'Line alignment when wrapped',
    choices: choices([
      ['normal', 'content-normal', 'Normal'],
      ['start', 'content-start', 'Start'],
      ['end', 'content-end', 'End'],
      ['center', 'content-center', 'Center'],
      ['between', 'content-between', 'Space between'],
      ['around', 'content-around', 'Space around'],
      ['evenly', 'content-evenly', 'Space evenly'],
      ['stretch', 'content-stretch', 'Stretch'],
      ['baseline', 'content-baseline', 'Baseline'],
    ]),
  },
  {
    key: 'placeContent',
    displayName: 'Place content (grid only)',
    choices: choices([
      ['start', 'place-content-start', 'Start'],
      ['end', 'place-content-end', 'End'],
      ['center', 'place-content-center', 'Center'],
      ['between', 'place-content-between', 'Space between'],
      ['around', 'place-content-around', 'Space around'],
      ['evenly', 'place-content-evenly', 'Space evenly'],
      ['stretch', 'place-content-stretch', 'Stretch'],
    ]),
  },
  {
    key: 'placeItems',
    displayName: 'Place items (grid only)',
    choices: choices([
      ['start', 'place-items-start', 'Start'],
      ['end', 'place-items-end', 'End'],
      ['center', 'place-items-center', 'Center'],
      ['stretch', 'place-items-stretch', 'Stretch'],
      ['baseline', 'place-items-baseline', 'Baseline'],
    ]),
  },
  {
    key: 'gap',
    displayName: 'Space between items',
    choices: choices([
      ['none', 'gap-0',  'None'],
      ['sm',   'gap-3',  'Small  (12px)'],
      ['md',   'gap-6',  'Medium (24px)'],
      ['lg',   'gap-10', 'Large  (40px)'],
      ['xl',   'gap-16', 'XL     (64px)'],
    ]),
  },
  {
    key: 'gapX',
    displayName: 'Horizontal space between items',
    choices: choices([
      ['none', 'gap-x-0',  'None'],
      ['sm',   'gap-x-3',  'Small  (12px)'],
      ['md',   'gap-x-6',  'Medium (24px)'],
      ['lg',   'gap-x-10', 'Large  (40px)'],
      ['xl',   'gap-x-16', 'XL     (64px)'],
    ]),
  },
  {
    key: 'gapY',
    displayName: 'Vertical space between items',
    choices: choices([
      ['none', 'gap-y-0',  'None'],
      ['sm',   'gap-y-3',  'Small  (12px)'],
      ['md',   'gap-y-6',  'Medium (24px)'],
      ['lg',   'gap-y-10', 'Large  (40px)'],
      ['xl',   'gap-y-16', 'XL     (64px)'],
    ]),
  },
  {
    key: 'gridCols',
    displayName: 'Number of columns (grid only)',
    choices: choices([
      ['none', 'grid-cols-none', 'None'],
      ['1', 'grid-cols-1', '1'],
      ['2', 'grid-cols-2', '2'],
      ['3', 'grid-cols-3', '3'],
      ['4', 'grid-cols-4', '4'],
      ['5', 'grid-cols-5', '5'],
      ['6', 'grid-cols-6', '6'],
      ['7', 'grid-cols-7', '7'],
      ['8', 'grid-cols-8', '8'],
      ['9', 'grid-cols-9', '9'],
      ['10', 'grid-cols-10', '10'],
      ['11', 'grid-cols-11', '11'],
      ['12', 'grid-cols-12', '12'],
      ['subgrid', 'grid-cols-subgrid', 'Subgrid'],
    ]),
  },
  {
    key: 'gridRows',
    displayName: 'Number of rows (grid only)',
    choices: choices([
      ['none', 'grid-rows-none', 'None'],
      ['1', 'grid-rows-1', '1'],
      ['2', 'grid-rows-2', '2'],
      ['3', 'grid-rows-3', '3'],
      ['4', 'grid-rows-4', '4'],
      ['5', 'grid-rows-5', '5'],
      ['6', 'grid-rows-6', '6'],
      ['subgrid', 'grid-rows-subgrid', 'Subgrid'],
    ]),
  },
  {
    key: 'autoFlow',
    displayName: 'Auto-placement flow (grid only)',
    choices: choices([
      ['row', 'grid-flow-row', 'Row'],
      ['col', 'grid-flow-col', 'Column'],
      ['dense', 'grid-flow-dense', 'Dense'],
      ['rowDense', 'grid-flow-row-dense', 'Row dense'],
      ['colDense', 'grid-flow-col-dense', 'Column dense'],
    ]),
  },
  {
    key: 'autoCols',
    displayName: 'Auto column size (grid only)',
    choices: choices([
      ['auto', 'auto-cols-auto', 'Auto'],
      ['min', 'auto-cols-min', 'Fit content (min)'],
      ['max', 'auto-cols-max', 'Fit content (max)'],
      ['fr', 'auto-cols-fr', 'Equal share'],
    ]),
  },
  {
    key: 'autoRows',
    displayName: 'Auto row size (grid only)',
    choices: choices([
      ['auto', 'auto-rows-auto', 'Auto'],
      ['min', 'auto-rows-min', 'Fit content (min)'],
      ['max', 'auto-rows-max', 'Fit content (max)'],
      ['fr', 'auto-rows-fr', 'Equal share'],
    ]),
  },
];

/* ------------------------------------------------------------------ *
 * ITEM — "Flexbox & Grid" props acting on a flex/grid item
 * ------------------------------------------------------------------ */
export const ITEM_UTILITIES: Utility[] = [
  {
    key: 'flex',
    displayName: 'Flexible sizing',
    choices: choices([
      ['initial', 'flex-initial', 'Shrink only (initial)'],
      ['auto', 'flex-auto', 'Grow & shrink (auto)'],
      ['one', 'flex-1', 'Fill available space'],
      ['none', 'flex-none', 'Fixed size (none)'],
    ]),
  },
  {
    key: 'grow',
    displayName: 'Grow to fill space',
    choices: choices([
      ['0', 'grow-0', "Don't grow"],
      ['1', 'grow', 'Grow'],
    ]),
  },
  {
    key: 'shrink',
    displayName: 'Allow shrinking',
    choices: choices([
      ['0', 'shrink-0', "Don't shrink"],
      ['1', 'shrink', 'Shrink'],
    ]),
  },
  {
    key: 'order',
    displayName: 'Display order',
    choices: choices([
      ['first', 'order-first', 'First'],
      ['last', 'order-last', 'Last'],
      ['none', 'order-none', 'Default'],
      ['1', 'order-1', '1'],
      ['2', 'order-2', '2'],
      ['3', 'order-3', '3'],
      ['4', 'order-4', '4'],
      ['5', 'order-5', '5'],
      ['6', 'order-6', '6'],
      ['7', 'order-7', '7'],
      ['8', 'order-8', '8'],
      ['9', 'order-9', '9'],
      ['10', 'order-10', '10'],
      ['11', 'order-11', '11'],
      ['12', 'order-12', '12'],
    ]),
  },
  {
    // Flex width — kept under the existing `span` key so already-configured
    // columns keep mapping. Mobile-first: `md:`-prefixed so it applies at md+
    // (the Column renderer supplies the `basis-full` mobile base).
    key: 'span',
    displayName: 'Width',
    choices: choices([
      ['full',         'md:basis-full', 'Full width'],
      ['threeQuarter', 'md:basis-3/4',  'Three-quarters'],
      ['twoThird',     'md:basis-2/3',  'Two-thirds'],
      ['half',         'md:basis-1/2',  'Half'],
      ['third',        'md:basis-1/3',  'One-third'],
      ['quarter',      'md:basis-1/4',  'Quarter'],
    ]),
  },
  {
    key: 'colSpan',
    displayName: 'Columns to span (grid only)',
    choices: choices([
      ['1', 'col-span-1', '1'],
      ['2', 'col-span-2', '2'],
      ['3', 'col-span-3', '3'],
      ['4', 'col-span-4', '4'],
      ['5', 'col-span-5', '5'],
      ['6', 'col-span-6', '6'],
      ['7', 'col-span-7', '7'],
      ['8', 'col-span-8', '8'],
      ['9', 'col-span-9', '9'],
      ['10', 'col-span-10', '10'],
      ['11', 'col-span-11', '11'],
      ['12', 'col-span-12', '12'],
      ['full', 'col-span-full', 'Full width'],
      ['auto', 'col-auto', 'Auto'],
    ]),
  },
  {
    key: 'colStart',
    displayName: 'Start at column (grid only)',
    choices: choices([
      ['1', 'col-start-1', '1'],
      ['2', 'col-start-2', '2'],
      ['3', 'col-start-3', '3'],
      ['4', 'col-start-4', '4'],
      ['5', 'col-start-5', '5'],
      ['6', 'col-start-6', '6'],
      ['7', 'col-start-7', '7'],
      ['8', 'col-start-8', '8'],
      ['9', 'col-start-9', '9'],
      ['10', 'col-start-10', '10'],
      ['11', 'col-start-11', '11'],
      ['12', 'col-start-12', '12'],
      ['13', 'col-start-13', '13'],
      ['auto', 'col-start-auto', 'Auto'],
    ]),
  },
  {
    key: 'colEnd',
    displayName: 'End at column (grid only)',
    choices: choices([
      ['1', 'col-end-1', '1'],
      ['2', 'col-end-2', '2'],
      ['3', 'col-end-3', '3'],
      ['4', 'col-end-4', '4'],
      ['5', 'col-end-5', '5'],
      ['6', 'col-end-6', '6'],
      ['7', 'col-end-7', '7'],
      ['8', 'col-end-8', '8'],
      ['9', 'col-end-9', '9'],
      ['10', 'col-end-10', '10'],
      ['11', 'col-end-11', '11'],
      ['12', 'col-end-12', '12'],
      ['13', 'col-end-13', '13'],
      ['auto', 'col-end-auto', 'Auto'],
    ]),
  },
  {
    key: 'rowSpan',
    displayName: 'Rows to span (grid only)',
    choices: choices([
      ['1', 'row-span-1', '1'],
      ['2', 'row-span-2', '2'],
      ['3', 'row-span-3', '3'],
      ['4', 'row-span-4', '4'],
      ['5', 'row-span-5', '5'],
      ['6', 'row-span-6', '6'],
      ['full', 'row-span-full', 'Full height'],
      ['auto', 'row-auto', 'Auto'],
    ]),
  },
  {
    key: 'rowStart',
    displayName: 'Start at row (grid only)',
    choices: choices([
      ['1', 'row-start-1', '1'],
      ['2', 'row-start-2', '2'],
      ['3', 'row-start-3', '3'],
      ['4', 'row-start-4', '4'],
      ['5', 'row-start-5', '5'],
      ['6', 'row-start-6', '6'],
      ['7', 'row-start-7', '7'],
      ['auto', 'row-start-auto', 'Auto'],
    ]),
  },
  {
    key: 'rowEnd',
    displayName: 'End at row (grid only)',
    choices: choices([
      ['1', 'row-end-1', '1'],
      ['2', 'row-end-2', '2'],
      ['3', 'row-end-3', '3'],
      ['4', 'row-end-4', '4'],
      ['5', 'row-end-5', '5'],
      ['6', 'row-end-6', '6'],
      ['7', 'row-end-7', '7'],
      ['auto', 'row-end-auto', 'Auto'],
    ]),
  },
  {
    key: 'justifySelf',
    displayName: 'Own horizontal align (grid only)',
    choices: choices([
      ['auto', 'justify-self-auto', 'Auto'],
      ['start', 'justify-self-start', 'Start'],
      ['end', 'justify-self-end', 'End'],
      ['center', 'justify-self-center', 'Center'],
      ['stretch', 'justify-self-stretch', 'Stretch'],
    ]),
  },
  {
    key: 'alignSelf',
    displayName: 'Own alignment (overrides parent)',
    choices: choices([
      ['auto', 'self-auto', 'Auto'],
      ['start', 'self-start', 'Start'],
      ['end', 'self-end', 'End'],
      ['center', 'self-center', 'Center'],
      ['stretch', 'self-stretch', 'Stretch'],
      ['baseline', 'self-baseline', 'Baseline'],
    ]),
  },
  {
    key: 'placeSelf',
    displayName: 'Own placement (grid only)',
    choices: choices([
      ['auto', 'place-self-auto', 'Auto'],
      ['start', 'place-self-start', 'Start'],
      ['end', 'place-self-end', 'End'],
      ['center', 'place-self-center', 'Center'],
      ['stretch', 'place-self-stretch', 'Stretch'],
    ]),
  },
];

/**
 * Build a display-template `settings` object from one or more utility groups.
 * A group's `label` is prefixed onto each setting's displayName ("Label ·
 * Setting") to visually cluster related controls — the CMS has no real setting
 * sections, so this pseudo-grouping is the closest available. `sortOrder` is
 * assigned from group + array order; `startOrder` lets a component prepend its
 * own bespoke settings first.
 *
 * Every select setting gets a leading `_` choice ("—") as its first option.
 * The CMS initialises each setting to the first choice when a template is first
 * applied; without this sentinel it would pick the first *real* choice and emit
 * that class on every element even though the author never touched the setting.
 * `resolveClasses` treats `_` as "not set" and falls back to component defaults.
 */
export function buildSettings(groups: UtilityGroup[], startOrder = 0): Settings {
  const settings: Settings = {};
  let order = startOrder;
  for (const { label, utilities } of groups) {
    for (const util of utilities) {
      const editor = util.editor ?? 'select';
      let choiceOrder = 1;
      const builtChoices: SettingDef['choices'] = {};
      if (editor === 'select') {
        builtChoices['unset'] = { displayName: '—', sortOrder: 0 };
      }
      for (const [choiceKey, choice] of Object.entries(util.choices)) {
        builtChoices[choiceKey] = { displayName: choice.displayName, sortOrder: choiceOrder++ };
      }
      settings[util.key] = {
        displayName: label ? `${label} · ${util.displayName}` : util.displayName,
        editor,
        sortOrder: order++,
        choices: builtChoices,
      };
    }
  }
  return settings;
}

/**
 * Resolve chosen display settings into a className string. For each utility, the
 * value is `displaySettings[key]` (falling back to `defaults[key]`); when that
 * value maps to a known choice, its literal class is emitted. Unset utilities
 * contribute nothing, so an unconfigured element stays clean.
 *
 * `_` is treated as "not set" — the CMS initialises selects to this sentinel so
 * that a freshly-applied template emits only the component's hardcoded defaults,
 * not every first choice in the catalog.
 */
export function resolveClasses(
  groups: UtilityGroup[],
  ds?: Record<string, string | boolean>,
  defaults: Record<string, string> = {},
): string {
  const out: string[] = [];
  for (const { utilities } of groups) {
    for (const util of utilities) {
      const raw = ds?.[util.key];
      // '_' is the "not set" sentinel; treat it the same as undefined.
      const value = (raw === undefined || raw === '' || raw === 'unset') ? defaults[util.key] : String(raw);
      const choice = value ? util.choices[value] : undefined;
      if (choice?.class) out.push(choice.class);
    }
  }
  return out.join(' ');
}
