import type { StructureContainerProps } from '@optimizely/cms-sdk/react/server';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export default function SectionRow({ node, children }: StructureContainerProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { pa } = getPreviewUtils(node as any);
  const hasColumns = (node.nodes?.length ?? 0) > 0;
  return (
    <div {...pa(node)} className="flex gap-4 w-full">
      {hasColumns ? children : (
        <p className="flex-1 border border-dashed border-gray-300 rounded p-4 text-sm text-gray-400 text-center">
          This row has no columns yet
        </p>
      )}
    </div>
  );
}
