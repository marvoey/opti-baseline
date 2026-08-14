import type { StructureContainerProps } from '@optimizely/cms-sdk/react/server';
import { OptimizelyGridSection, getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { ComponentWrapper } from './wrappers';
import {
  type SectionDisplaySettings,
  sectionBgClass,
  sectionPaddingClass,
  sectionInnerClass,
} from './sectionDisplayTemplate';

type Props = {
  content: {
    nodes?: Parameters<typeof OptimizelyGridSection>[0]['nodes'];
    [key: string]: unknown;
  };
  displaySettings?: SectionDisplaySettings;
};

export default function BlankSection({ content, displaySettings }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { pa } = getPreviewUtils(content as any);
  const nodes = content.nodes ?? [];

  const bg      = sectionBgClass[displaySettings?.background ?? '']      ?? '';
  const padding = sectionPaddingClass[displaySettings?.padding ?? '']    ?? 'py-12';
  const inner   = sectionInnerClass[displaySettings?.width ?? '']        ?? 'w-full';

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
      <section {...pa(content as any)} className={`w-full ${bg} ${padding}`}>
        <div className={inner}>
          <p className="border border-dashed border-gray-300 rounded p-8 text-center text-sm text-gray-400">
            This section has no rows yet
          </p>
        </div>
      </section>
    );
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <section {...pa(content as any)} className={`w-full m-4 ${bg} ${padding}`}>
      <div className={inner}>
        <OptimizelyGridSection
          nodes={nodes}
          row={SectionRow}
          column={SectionColumn}
          ComponentWrapper={ComponentWrapper}
        />
      </div>
    </section>
  );
}
