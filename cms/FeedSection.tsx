import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyGridSection } from '@optimizely/cms-sdk/react/server';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import type { StructureContainerProps } from '@optimizely/cms-sdk/react/server';

export const FeedSectionContentType = contentType({
  key: 'FeedSection',
  baseType: '_section',
  displayName: 'Feed Section (1-Column)',
  description: 'Sequential vertical feed for chronological or reverse-chronological content. Best for timelines, claim histories, audit logs, and support tickets.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {},
});

function FeedRow({ children }: StructureContainerProps) {
  return (
    <li className="border-b border-neutral-100 py-4 last:border-0 dark:border-neutral-800">
      {children}
    </li>
  );
}

function FeedColumn({ children }: StructureContainerProps) {
  return <div className="w-full">{children}</div>;
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function FeedSection({ content }: { content: ContentProps<typeof FeedSectionContentType> & { nodes?: any[] } }) {
  const { pa } = getPreviewUtils(content);
  return (
    <section {...pa(content)} className="py-8">
      <ol className="divide-y divide-neutral-100 dark:divide-neutral-800">
        <OptimizelyGridSection
          nodes={content.nodes ?? []}
          row={FeedRow}
          column={FeedColumn}
        />
      </ol>
    </section>
  );
}
