import { displayTemplate } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import type { StructureContainerProps } from '@optimizely/cms-sdk/react/server';

// ─── V1Row ────────────────────────────────────────────────────────────────────

const ROW_CLASSES: Record<string, Record<string, string>> = {
  columnGap: {
    none:   'gap-0',
    narrow: 'gap-2',
    normal: 'gap-4',
    wide:   'gap-8',
  },
  verticalAlignment: {
    top:    'items-start',
    center: 'items-center',
    bottom: 'items-end',
  },
};

// Column layout switches the row to CSS Grid. Each entry has two variants:
// `base` (all sizes) and `stacked` (1-col on mobile → layout at md).
// `equal` uses auto-fit so the grid places all items in one row automatically
// without needing to count children.
const COLUMN_LAYOUT: Record<string, { base: string; stacked: string }> = {
  equal:        { base: '', stacked: '' },
  wideLeft:     { base: 'grid-cols-[2fr_1fr]',  stacked: 'grid-cols-1 md:grid-cols-[2fr_1fr]' },
  wideRight:    { base: 'grid-cols-[1fr_2fr]',  stacked: 'grid-cols-1 md:grid-cols-[1fr_2fr]' },
  sidebarLeft:  { base: 'grid-cols-[1fr_3fr]',  stacked: 'grid-cols-1 md:grid-cols-[1fr_3fr]' },
  sidebarRight: { base: 'grid-cols-[3fr_1fr]',  stacked: 'grid-cols-1 md:grid-cols-[3fr_1fr]' },
};

const ROW_DEFAULTS: Record<string, string> = {
  columnGap:         'normal',
  verticalAlignment: 'top',
};

export function V1Row({ node, children, displaySettings }: StructureContainerProps) {
  const { pa } = getPreviewUtils(node);
  const ds = (displaySettings ?? {}) as Record<string, string | boolean>;

  const stack   = ds.stackOnMobile   === true || ds.stackOnMobile   === 'true';
  const reverse = ds.reverseOnMobile === true || ds.reverseOnMobile === 'false';

  const layoutKey = String(ds.columnLayout ?? '');
  const layout = layoutKey && layoutKey !== 'unset' ? COLUMN_LAYOUT[layoutKey] : null;

  const isGrid = layout !== null && layoutKey !== 'equal';
  const base          = isGrid ? 'grid' : 'flex flex-wrap';
  const layoutClass   = isGrid ? (stack ? layout!.stacked : layout!.base) : '';
  const flexMobileClass = !isGrid
    ? (reverse ? 'flex-col-reverse md:flex-row' : stack ? 'flex-col md:flex-row' : '')
    : '';

  const resolved = Object.entries(ROW_CLASSES).map(([key, map]) => {
    const raw = ds[key];
    const value = raw !== undefined && raw !== 'unset' ? String(raw) : (ROW_DEFAULTS[key] ?? '');
    return map[value] ?? '';
  });

  const className = [base, layoutClass, flexMobileClass, ...resolved]
    .filter(Boolean)
    .join(' ');

  return (
    <div {...pa(node)} data-layout="row" className={className}>
      {children}
    </div>
  );
}

export const V1RowDefault = displayTemplate({
  key: 'V1RowDefault',
  isDefault: true,
  displayName: 'V1: Row',
  nodeType: 'row',
  settings: {
    columnLayout: {
      editor: 'select',
      displayName: 'Column layout',
      sortOrder: 10,
      choices: {
        equal:        { displayName: 'Equal columns',            sortOrder: 10 },
        wideLeft:     { displayName: 'Wide left, narrow right',  sortOrder: 20 },
        wideRight:    { displayName: 'Narrow left, wide right',  sortOrder: 30 },
        sidebarLeft:  { displayName: 'Sidebar left, main right', sortOrder: 40 },
        sidebarRight: { displayName: 'Main left, sidebar right', sortOrder: 50 },
      },
    },
    verticalAlignment: {
      editor: 'select',
      displayName: 'Vertical alignment',
      sortOrder: 20,
      choices: {
        top:    { displayName: 'Top',    sortOrder: 10 },
        center: { displayName: 'Center', sortOrder: 20 },
        bottom: { displayName: 'Bottom', sortOrder: 30 },
      },
    },
    columnGap: {
      editor: 'select',
      displayName: 'Column gap',
      sortOrder: 30,
      choices: {
        none:   { displayName: 'None',   sortOrder: 10 },
        narrow: { displayName: 'Narrow', sortOrder: 20 },
        normal: { displayName: 'Normal', sortOrder: 30 },
        wide:   { displayName: 'Wide',   sortOrder: 40 },
      },
    },
    reverseOnMobile: {
      editor: 'checkbox',
      displayName: 'Reverse column order on mobile',
      sortOrder: 40,
      choices: {
        true:  { displayName: 'Reverse column order on mobile', sortOrder: 1 },
        false: { displayName: 'No change',                      sortOrder: 2 },
      },
    },
    stackOnMobile: {
      editor: 'checkbox',
      displayName: 'Stack columns on mobile',
      sortOrder: 50,
      choices: {
        true:  { displayName: 'Stack columns vertically on mobile', sortOrder: 1 },
        false: { displayName: 'No change',                          sortOrder: 2 },
      },
    },
  },
});

// ─── V1Column ─────────────────────────────────────────────────────────────────

const COLUMN_CLASSES: Record<string, Record<string, string>> = {
  columnSpan: {
    auto:          'flex-1',
    quarter:       'flex-none md:basis-1/4',
    third:         'flex-none md:basis-1/3',
    half:          'flex-none md:basis-1/2',
    twoThirds:     'flex-none md:basis-2/3',
    threeQuarters: 'flex-none md:basis-3/4',
    full:          'flex-none basis-full col-span-full',
  },
  selfAlignment: {
    auto:    '',
    start:   'self-start',
    center:  'self-center',
    end:     'self-end',
    stretch: 'self-stretch',
  },
  contentGap: {
    none:   'gap-0',
    narrow: 'gap-2',
    normal: 'gap-4',
    wide:   'gap-8',
  },
  contentAlignment: {
    start:  'items-start',
    center: 'items-center',
    end:    'items-end',
  },
};

const COLUMN_DEFAULTS: Record<string, string> = {
  columnSpan:       'auto',
  selfAlignment:    'auto',
  contentGap:       'normal',
  contentAlignment: 'start',
};

export function V1Column({ node, children, displaySettings }: StructureContainerProps) {
  const { pa } = getPreviewUtils(node);
  const ds = (displaySettings ?? {}) as Record<string, string | boolean>;

  const resolved = Object.entries(COLUMN_CLASSES).map(([key, map]) => {
    const raw = ds[key];
    const value = raw !== undefined && raw !== 'unset' ? String(raw) : (COLUMN_DEFAULTS[key] ?? '');
    return map[value] ?? '';
  });

  const className = ['min-w-0 flex flex-col', ...resolved]
    .filter(Boolean)
    .join(' ');

  return (
    <div {...pa(node)} data-layout="column" className={className}>
      {children}
    </div>
  );
}

export const V1ColumnDefault = displayTemplate({
  key: 'V1ColumnDefault',
  isDefault: true,
  displayName: 'V1: Column',
  nodeType: 'column',
  settings: {
    columnSpan: {
      editor: 'select',
      displayName: 'Column width',
      sortOrder: 10,
      choices: {
        auto:          { displayName: 'Auto (equal share)', sortOrder: 10 },
        quarter:       { displayName: 'One quarter',        sortOrder: 20 },
        third:         { displayName: 'One third',          sortOrder: 30 },
        half:          { displayName: 'Half',               sortOrder: 40 },
        twoThirds:     { displayName: 'Two thirds',         sortOrder: 50 },
        threeQuarters: { displayName: 'Three quarters',     sortOrder: 60 },
        full:          { displayName: 'Full width',         sortOrder: 70 },
      },
    },
    selfAlignment: {
      editor: 'select',
      displayName: 'Vertical alignment',
      sortOrder: 20,
      choices: {
        auto:    { displayName: 'Follow row setting', sortOrder: 10 },
        start:   { displayName: 'Top',                sortOrder: 20 },
        center:  { displayName: 'Center',             sortOrder: 30 },
        end:     { displayName: 'Bottom',             sortOrder: 40 },
        stretch: { displayName: 'Stretch',            sortOrder: 50 },
      },
    },
    contentGap: {
      editor: 'select',
      displayName: 'Content gap',
      sortOrder: 30,
      choices: {
        none:   { displayName: 'None',   sortOrder: 10 },
        narrow: { displayName: 'Narrow', sortOrder: 20 },
        normal: { displayName: 'Normal', sortOrder: 30 },
        wide:   { displayName: 'Wide',   sortOrder: 40 },
      },
    },
    contentAlignment: {
      editor: 'select',
      displayName: 'Content alignment',
      sortOrder: 40,
      choices: {
        start:  { displayName: 'Top',    sortOrder: 10 },
        center: { displayName: 'Center', sortOrder: 20 },
        end:    { displayName: 'Bottom', sortOrder: 30 },
      },
    },
  },
});
