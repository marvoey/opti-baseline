import { OptimizelyGridSection, getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { ComponentWrapper } from './wrappers';
import SectionRow from './SectionRow';
import SectionColumn from './SectionColumn';

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
