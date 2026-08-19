import { displayTemplate } from '@optimizely/cms-sdk';
import type { StructureContainerProps } from '@optimizely/cms-sdk/react/server';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const SectionRowDisplayTemplate = displayTemplate({
  key: 'DefaultRow',
  displayName: 'Default Row',
  isDefault: true,
  nodeType: 'row',
  settings: {
    columns: {
      editor: 'select',
      displayName: 'Max Columns',
      sortOrder: 1,
      choices: {
        c1: { displayName: '1 Column',  sortOrder: 1 },
        c2: { displayName: '2 Columns', sortOrder: 2 },
        c3: { displayName: '3 Columns', sortOrder: 3 },
        c4: { displayName: '4 Columns', sortOrder: 4 },
      },
    },
  },
});

const COL_CLASS: Record<string, string> = {
  c1: 'grid-cols-1',
  c2: 'grid-cols-1 sm:grid-cols-2',
  c3: 'grid-cols-1 sm:grid-cols-3',
  c4: 'grid-cols-1 sm:grid-cols-4',
};

export default function SectionRow({ node, children, displaySettings }: StructureContainerProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { pa } = getPreviewUtils(node as any);
  const hasColumns = (node.nodes?.length ?? 0) > 0;
  const colClass = COL_CLASS[displaySettings?.columns as string] ?? 'grid-cols-1 sm:grid-cols-3';
  return (
    <div
      {...pa(node)}
      className={`grid gap-4 w-full ${colClass}`}
    >
      {hasColumns ? children : (
        <p className="col-span-full border border-dashed border-gray-300 rounded p-4 text-sm text-gray-400 text-center">
          This row has no columns yet
        </p>
      )}
    </div>
  );
}
