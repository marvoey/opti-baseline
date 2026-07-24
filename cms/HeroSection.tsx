import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyGridSection } from '@optimizely/cms-sdk/react/server';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import type { StructureContainerProps } from '@optimizely/cms-sdk/react/server';

export const HeroSectionContentType = contentType({
  key: 'HeroSection',
  baseType: '_section',
  displayName: 'Hero Section (Full Width)',
  description: 'Full-width single-slot layout for critical announcements, alerts, and high-impact feature moments.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {},
});

function HeroRow({ children }: StructureContainerProps) {
  return <div className="w-full">{children}</div>;
}

function HeroColumn({ children, displaySettings }: StructureContainerProps) {
  const isRelative = displaySettings?.position === 'relative';
  return (
    <div className={isRelative ? 'relative w-full overflow-hidden' : 'w-full'}>
      {children}
    </div>
  );
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export default function HeroSection({ content }: { content: ContentProps<typeof HeroSectionContentType> & { nodes?: any[] } }) {
  const { pa } = getPreviewUtils(content);
  return (
    <section {...pa(content)} className="w-full py-12">
      <OptimizelyGridSection
        nodes={content.nodes ?? []}
        row={HeroRow}
        column={HeroColumn}
      />
    </section>
  );
}
