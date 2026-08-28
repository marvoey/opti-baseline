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
          <div className="flex-1 border border-dashed border-gray-300 rounded p-4 text-center">
            <p className="text-sm font-medium text-gray-500">This row has no columns yet</p>
            <p className="mt-1 text-sm text-gray-400">
              Split this row into columns to place content side by side, then drop elements like Rich Text into a column.
            </p>
          </div>
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
      <section {...pa(content as any)} className="w-full border border-dashed border-gray-300 rounded-lg p-8 text-center">
        <p className="text-sm font-medium text-gray-500">This section has no rows yet</p>
        <p className="mt-1 text-sm text-gray-400">
          Add a row to start filling this section, then split it into columns.
        </p>
        <dl className="mt-6 grid gap-4 text-left sm:grid-cols-2 max-w-lg mx-auto">
          <div>
            <dt className="text-sm font-medium text-gray-500">Row</dt>
            <dd className="mt-1 text-sm text-gray-400">
              A horizontal strip within the section. Add multiple rows to stack content vertically.
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Column</dt>
            <dd className="mt-1 text-sm text-gray-400">
              Splits a row into side-by-side slots. Once a row has columns, drop elements like Rich Text into them.
            </dd>
          </div>
        </dl>
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
