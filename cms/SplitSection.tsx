import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyGridSection } from '@optimizely/cms-sdk/react/server';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import type { StructureContainerProps } from '@optimizely/cms-sdk/react/server';

export const SplitSectionContentType = contentType({
  key: 'SplitSection',
  baseType: '_section',
  displayName: 'Split Section (60/40)',
  description: 'Two-column split: wide left (60%) for primary content or forms, narrow right (40%) for contextual help or compliance. Best for task execution and consultation flows.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {},
});

function SplitRow({ children }: StructureContainerProps) {
  return <div className="flex flex-col gap-6 md:flex-row">{children}</div>;
}

function SplitColumn({ index, children }: StructureContainerProps) {
  const isPrimary = index === 0;
  return (
    <div className={isPrimary ? 'w-full md:w-3/5' : 'w-full md:w-2/5'}>
      {children}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SplitSection({ content }: { content: ContentProps<typeof SplitSectionContentType> & { nodes?: any[] } }) {
  const { pa } = getPreviewUtils(content);
  return (
    <section {...pa(content)} className="py-8">
      <OptimizelyGridSection
        nodes={content.nodes ?? []}
        row={SplitRow}
        column={SplitColumn}
      />
    </section>
  );
}
