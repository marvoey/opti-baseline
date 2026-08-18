import type { StructureContainerProps } from '@optimizely/cms-sdk/react/server';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export default function SectionColumn({ node, children }: StructureContainerProps) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { pa } = getPreviewUtils(node as any);
  const hasComponents = (node.nodes?.length ?? 0) > 0;
  return (
    <div {...pa(node)} className="flex-1">
      {hasComponents ? children : (
        <p className="border border-dashed border-gray-300 rounded p-4 text-sm text-gray-400 text-center">
          This column has no content yet
        </p>
      )}
    </div>
  );
}
