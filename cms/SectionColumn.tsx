import { displayTemplate } from '@optimizely/cms-sdk';
import type { StructureContainerProps } from '@optimizely/cms-sdk/react/server';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const SectionColumnDisplayTemplate = displayTemplate({
  key: 'DefaultColumn',
  displayName: 'Default Column',
  isDefault: true,
  nodeType: 'column',
  settings: {
    weight: {
      editor: 'select',
      displayName: 'Width',
      sortOrder: 1,
      choices: {
        w1: { displayName: '1× (narrow)', sortOrder: 1 },
        w2: { displayName: '2×',          sortOrder: 2 },
        w3: { displayName: '3×',          sortOrder: 3 },
        w4: { displayName: '4× (wide)',   sortOrder: 4 },
      },
    },
  },
});

// On mobile all columns stack full-width (col-span-1); on sm+ apply the configured span.
const SPAN_CLASS: Record<string, string> = {
  w1: 'col-span-1',
  w2: 'col-span-1 sm:col-span-2',
  w3: 'col-span-1 sm:col-span-3',
  w4: 'col-span-1 sm:col-span-4',
};

export default function SectionColumn({ node, children, displaySettings }: StructureContainerProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { pa } = getPreviewUtils(node as any);
  const hasComponents = (node.nodes?.length ?? 0) > 0;
  const spanClass = SPAN_CLASS[displaySettings?.weight as string] ?? 'col-span-1';
  return (
    <div
      {...pa(node)}
      className={`min-w-0 ${spanClass}`}
    >
      {hasComponents ? children : (
        <p className="border border-dashed border-gray-300 rounded p-4 text-sm text-gray-400 text-center">
          This column has no content yet
        </p>
      )}
    </div>
  );
}
