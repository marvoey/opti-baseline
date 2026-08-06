import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const InteractiveWidgetBlockContentType = contentType({
  key: 'InteractiveWidgetBlock',
  baseType: '_component',
  displayName: '(Verticals) Interactive Widget Block',
  description: 'Mounts a complex frontend React application/widget.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    WidgetType: {
      type: 'string',
      displayName: 'Widget Application Name',
      description: 'e.g., InsuranceWizard, AssetCalculator, MapDirectory',
      sortOrder: 10,
    },
    ConfigurationPayload: {
      type: 'string',
      displayName: 'Configuration Payload (JSON)',
      description: 'Pass variables to the widget (e.g., API endpoints, default filters).',
      sortOrder: 20,
    },
  },
});

type Props = { content: ContentProps<typeof InteractiveWidgetBlockContentType> };

/**
 * Server-side shell. Renders a mount point with data attributes so a
 * client-side widget loader can hydrate the correct application.
 * Wire up the actual React widget in a `'use client'` component that
 * reads `data-widget-type` and `data-config` from this div.
 */
export default function InteractiveWidgetBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  return (
    <div
      {...pa(block)}
      data-widget-type={content.WidgetType ?? undefined}
      data-config={content.ConfigurationPayload ?? undefined}
      className="w-full"
    >
      {/* Fallback shown before client hydration or when widget type is unset. */}
      {!content.WidgetType && (
        <div
          {...pa('WidgetType')}
          className="w-full rounded-[24px] border-4 border-dashed border-[#08251A] bg-[#E4F0DA] p-10 flex flex-col items-center justify-center gap-3"
        >
          <span className="text-4xl">⚙️</span>
          <p className="font-black text-[#08251A]">Interactive Widget</p>
          <p className="text-sm text-[#197050]">Set a Widget Application Name to mount the widget here.</p>
        </div>
      )}
    </div>
  );
}
