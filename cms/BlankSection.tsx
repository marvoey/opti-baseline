import type { StructureContainerProps } from '@optimizely/cms-sdk/react/server';
import { OptimizelyGridSection, getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { ComponentWrapper } from './wrappers';

type Props = {
  content: {
    nodes?: Parameters<typeof OptimizelyGridSection>[0]['nodes'];
    [key: string]: unknown;
  };
};

export default function BlankSection({ content }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { pa } = getPreviewUtils(content as any);
  const nodes = content.nodes ?? [];

  function SectionRow({ node, children }: StructureContainerProps) {
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

  function SectionColumn({ node, children }: StructureContainerProps) {
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

  if (nodes.length === 0) {
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <section {...pa(content as any)} className="w-full border border-dashed border-gray-300 rounded-lg p-8 text-center text-sm text-gray-400">
        This section has no rows yet
      </section>
    );
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <section {...pa(content as any)} className="w-full">
      <OptimizelyGridSection
        nodes={nodes}
        row={SectionRow}
        column={SectionColumn}
        ComponentWrapper={ComponentWrapper}
      />
    </section>
  );
}
