import { displayTemplate } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import type { StructureContainerProps } from '@optimizely/cms-sdk/react/server';

/**
 * Row / Column render containers for the V1 grid (passed to
 * `OptimizelyGridSection` by cms/V1Section.tsx). These are NOT content types —
 * they're structure-node renderers — so they are registered only via their
 * `nodeType` display templates, not in the React component resolver.
 *
 * Each container applies `pa(node)` so the row/column is selectable in the
 * editor, and reads layout knobs from `displaySettings` (the SDK resolves a
 * node's chosen template settings into a flat `Record<string, string|boolean>`).
 */

const GAP: Record<string, string> = { sm: 'gap-3', md: 'gap-6', lg: 'gap-10' };
const ALIGN: Record<string, string> = {
  start: 'items-start',
  center: 'items-center',
  end: 'items-end',
};
const JUSTIFY: Record<string, string> = {
  start: 'justify-start',
  center: 'justify-center',
  end: 'justify-end',
  between: 'justify-between',
};

export function V1Row({ node, children, displaySettings }: StructureContainerProps) {
  const { pa } = getPreviewUtils(node);
  const gap = GAP[String(displaySettings?.gap ?? 'md')] ?? GAP.md;
  const align = ALIGN[String(displaySettings?.align ?? 'start')] ?? ALIGN.start;
  const justify = JUSTIFY[String(displaySettings?.justify ?? 'start')] ?? JUSTIFY.start;
  return (
    <div {...pa(node)} className={`flex flex-col md:flex-row ${gap} ${align} ${justify}`}>
      {children}
    </div>
  );
}

export function V1Column({ node, children, displaySettings }: StructureContainerProps) {
  const { pa } = getPreviewUtils(node);
  const gap = GAP[String(displaySettings?.gap ?? 'md')] ?? GAP.md;
  const align = ALIGN[String(displaySettings?.align ?? 'start')] ?? ALIGN.start;
  return (
    <div {...pa(node)} className={`flex flex-1 flex-col ${gap} ${align}`}>
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
    gap: {
      editor: 'select',
      displayName: 'Gap',
      sortOrder: 0,
      choices: {
        sm: { displayName: 'Small', sortOrder: 1 },
        md: { displayName: 'Medium', sortOrder: 2 },
        lg: { displayName: 'Large', sortOrder: 3 },
      },
    },
    align: {
      editor: 'select',
      displayName: 'Vertical align',
      sortOrder: 1,
      choices: {
        start: { displayName: 'Top', sortOrder: 1 },
        center: { displayName: 'Center', sortOrder: 2 },
        end: { displayName: 'Bottom', sortOrder: 3 },
      },
    },
    justify: {
      editor: 'select',
      displayName: 'Horizontal distribution',
      sortOrder: 2,
      choices: {
        start: { displayName: 'Start', sortOrder: 1 },
        center: { displayName: 'Center', sortOrder: 2 },
        end: { displayName: 'End', sortOrder: 3 },
        between: { displayName: 'Space between', sortOrder: 4 },
      },
    },
  },
});

export const V1ColumnDefault = displayTemplate({
  key: 'V1ColumnDefault',
  isDefault: true,
  displayName: 'V1: Column',
  nodeType: 'column',
  settings: {
    gap: {
      editor: 'select',
      displayName: 'Gap',
      sortOrder: 0,
      choices: {
        sm: { displayName: 'Small', sortOrder: 1 },
        md: { displayName: 'Medium', sortOrder: 2 },
        lg: { displayName: 'Large', sortOrder: 3 },
      },
    },
    align: {
      editor: 'select',
      displayName: 'Align items',
      sortOrder: 1,
      choices: {
        start: { displayName: 'Start', sortOrder: 1 },
        center: { displayName: 'Center', sortOrder: 2 },
        end: { displayName: 'End', sortOrder: 3 },
      },
    },
  },
});
