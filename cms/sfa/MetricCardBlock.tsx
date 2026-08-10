import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { sfaContainerWidthSettings, containerWidthClass } from './sfaDisplaySettings';
import { taxonomyEnums, PRODUCT_CATEGORY, MAKER_ATTRIBUTE, RECOGNITION, EVENT } from '@/lib/cms/taxonomy';

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
    ProductCategory: { type: 'string', format: 'selectOne', displayName: 'Product Category', isLocalized: false, indexingType: 'queryable', group: 'Taxonomy', sortOrder: 50, enum: taxonomyEnums(PRODUCT_CATEGORY) },
    MakerAttribute:  { type: 'string', format: 'selectOne', displayName: 'Maker Attribute',  isLocalized: false, indexingType: 'queryable', group: 'Taxonomy', sortOrder: 51, enum: taxonomyEnums(MAKER_ATTRIBUTE) },
    Recognition:     { type: 'string', format: 'selectOne', displayName: 'Recognition',       isLocalized: false, indexingType: 'queryable', group: 'Taxonomy', sortOrder: 52, enum: taxonomyEnums(RECOGNITION) },
    Event:           { type: 'string', format: 'selectOne', displayName: 'Event',             isLocalized: false, indexingType: 'queryable', group: 'Taxonomy', sortOrder: 53, enum: taxonomyEnums(EVENT) },
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
  const widthClass = containerWidthClass(displaySettings?.containerWidth);

  return (
    <div {...pa(block)} className={widthClass}>
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
