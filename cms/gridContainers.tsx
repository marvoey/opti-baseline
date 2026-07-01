import { displayTemplate } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import type { StructureContainerProps } from '@optimizely/cms-sdk/react/server';
import {
  BOX_UTILITIES,
  CONTAINER_BOX_UTILITIES,
  CONTAINER_UTILITIES,
  ITEM_UTILITIES,
  buildSettings,
  resolveClasses,
  type UtilityGroup,
} from './layout/catalog';

/**
 * Row / Column render containers for the V1 grid (passed to
 * `OptimizelyGridSection` by cms/V1Section.tsx). These are NOT content types —
 * they're structure-node renderers — so they are registered only via their
 * `nodeType` display templates, not in the React component resolver.
 *
 * Row is a PURE CONTAINER: it only arranges its children, so it exposes the
 * Flexbox/Grid CONTAINER utilities (direction, wrap, justify, gap, grid tracks…)
 * plus the container-relevant Layout props (position, overflow, z-index…). It
 * deliberately omits item utilities — a row is not sized as a child.
 *
 * Column is a container AND a leaf/item: it arranges its own children, sits as
 * an ITEM of the Row (span, order, self-alignment…), and holds content, so it
 * additionally gets the full Layout box group (aspect, object-fit…).
 *
 * `resolveClasses` only emits a class when a value is chosen or defaulted, so an
 * unconfigured row/column stays clean.
 */

const ROW_GROUPS: UtilityGroup[] = [
  { label: 'Layout', utilities: CONTAINER_UTILITIES },
  { label: 'Position', utilities: CONTAINER_BOX_UTILITIES },
];
// Mobile-first, sensible baseline for a horizontal row of columns.
const ROW_DEFAULTS: Record<string, string> = {
  display: 'flex',
  direction: 'row',
  wrap: 'wrap',
  justify: 'start',
  alignItems: 'stretch',
  gap: 'md',
};

const COLUMN_GROUPS: UtilityGroup[] = [
  { label: 'Layout', utilities: CONTAINER_UTILITIES },
  { label: 'Placement', utilities: ITEM_UTILITIES },
  { label: 'Box', utilities: BOX_UTILITIES },
];
// A column stacks its own children vertically and, mobile-first, is full width
// until `md` where its chosen `span` (md:basis-*) applies.
const COLUMN_DEFAULTS: Record<string, string> = {
  display: 'flex',
  direction: 'col',
  gap: 'md',
  alignItems: 'start',
  span: 'full',
};

export function V1Row({ node, children, displaySettings }: StructureContainerProps) {
  const { pa } = getPreviewUtils(node);
  const className = resolveClasses(ROW_GROUPS, displaySettings, ROW_DEFAULTS);
  return (
    <div {...pa(node)} className={className}>
      {children}
    </div>
  );
}

export function V1Column({ node, children, displaySettings }: StructureContainerProps) {
  const { pa } = getPreviewUtils(node);
  // Constant mobile-first base: full width until `md`, then the `span` utility's
  // `md:basis-*` narrows it; `min-w-0` guards against flex overflow.
  const className = `basis-full min-w-0 ${resolveClasses(COLUMN_GROUPS, displaySettings, COLUMN_DEFAULTS)}`;
  return (
    <div {...pa(node)} className={className}>
      {children}
    </div>
  );
}

export const V1RowDefault = displayTemplate({
  key: 'V1RowDefault',
  isDefault: true,
  displayName: 'V1: Row',
  nodeType: 'row',
  settings: buildSettings(ROW_GROUPS),
});

export const V1ColumnDefault = displayTemplate({
  key: 'V1ColumnDefault',
  isDefault: true,
  displayName: 'V1: Column',
  nodeType: 'column',
  settings: buildSettings(COLUMN_GROUPS),
});
