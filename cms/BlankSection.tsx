import type { StructureContainerProps } from '@optimizely/cms-sdk/react/server';
import { OptimizelyGridSection } from '@optimizely/cms-sdk/react/server';
import { ComponentWrapper } from './wrappers';

function SectionRow({ node, children }: StructureContainerProps) {
  const hasColumns = (node.nodes?.length ?? 0) > 0;
  return (
    <div className="flex gap-4 w-full">
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
    <div className="flex-1">
      {hasComponents ? children : (
        <p className="border border-dashed border-gray-300 rounded p-4 text-sm text-gray-400 text-center">
          This column has no content yet
        </p>
      )}
    </div>
  );
}

type Props = {
  content: {
    nodes?: Parameters<typeof OptimizelyGridSection>[0]['nodes'];
    [key: string]: unknown;
  };
};

export default function BlankSection({ content }: Props) {
  const nodes = content.nodes ?? [];

  if (nodes.length === 0) {
    return (
      <section className="w-full border border-dashed border-gray-300 rounded-lg p-8 text-center text-sm text-gray-400">
        This section has no rows yet
      </section>
    );
  }

  return (
    <section className="w-full">
      <OptimizelyGridSection
        nodes={nodes}
        row={SectionRow}
        column={SectionColumn}
        ComponentWrapper={ComponentWrapper}
      />
    </section>
  );
}
