import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { sfaContainerWidthSettings } from './sfaDisplaySettings';

export const MetricCardBlockContentType = contentType({
  key: 'SFA_MetricCardBlock',
  baseType: '_component',
  displayName: '(_SFA) Metric / KPI Card',
  description: 'Used in multi-column grids to show event stats.',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    MetricNumber: {
      type: 'string',
      displayName: 'Large Number / Stat',
      isLocalized: true,
      sortOrder: 5,
    },
    MetricLabel: {
      type: 'string',
      displayName: 'Label',
      isLocalized: true,
      sortOrder: 10,
    },
    IconAsset: {
      type: 'contentReference',
      displayName: 'Icon Image',
      restrictedTypes: [],
      sortOrder: 15,
    },
  },
});

export const MetricCardBlockDisplayTemplate = displayTemplate({
  key: 'SFA_MetricCardBlockDefault',
  contentType: 'SFA_MetricCardBlock',
  isDefault: true,
  displayName: 'Metric / KPI Card',
  settings: sfaContainerWidthSettings,
});

type Props = {
  content: ContentProps<typeof MetricCardBlockContentType>;
  displaySettings?: ContentProps<typeof MetricCardBlockDisplayTemplate>;
};

export default function MetricCardBlock({ content, displaySettings }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const iconSrc = content.IconAsset?.url?.default;
  const constrained = displaySettings?.containerWidth === 'constrained';

  return (
    <div {...pa(block)} className={constrained ? 'mx-auto max-w-3xl' : undefined}>
      <div className="flex flex-col items-center text-center gap-2 p-6">
        {iconSrc && (
          <img
            {...pa('IconAsset')}
            src={iconSrc}
            alt=""
            className="w-10 h-10 object-contain"
          />
        )}
        <span {...pa('MetricNumber')} className="text-4xl font-bold leading-none">
          {content.MetricNumber}
        </span>
        <span {...pa('MetricLabel')} className="text-sm text-gray-600 uppercase tracking-wide">
          {content.MetricLabel}
        </span>
      </div>
    </div>
  );
}
