import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyGridSection } from '@optimizely/cms-sdk/react/server';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import type { StructureContainerProps } from '@optimizely/cms-sdk/react/server';

export const SidebarSectionContentType = contentType({
  key: 'SidebarSection',
  baseType: '_section',
  displayName: 'Sidebar Section (25/75)',
  description: 'Asymmetric layout: narrow left column (25%) for navigation or TOC, wide right column (75%) for main content. Best for deep documentation and knowledge portals.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {},
});

function SidebarRow({ children }: StructureContainerProps) {
  return <div className="flex flex-col gap-6 md:flex-row">{children}</div>;
}

function SidebarColumn({ index, children }: StructureContainerProps) {
  const isNav = index === 0;
  return (
    <div className={isNav ? 'w-full shrink-0 md:w-1/4' : 'flex-1'}>
      {children}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function SidebarSection({ content }: { content: ContentProps<typeof SidebarSectionContentType> & { nodes?: any[] } }) {
  const { pa } = getPreviewUtils(content);
  return (
    <section {...pa(content)} className="py-8">
      <OptimizelyGridSection
        nodes={content.nodes ?? []}
        row={SidebarRow}
        column={SidebarColumn}
      />
    </section>
  );
}
