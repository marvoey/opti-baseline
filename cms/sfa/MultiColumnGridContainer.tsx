import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyComponent, getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { sfaContainerWidthSettings } from './sfaDisplaySettings';

const GRID_COLS: Record<string, string> = {
  '2': 'grid-cols-2',
  '3': 'grid-cols-3',
  '4': 'grid-cols-4',
  '5': 'grid-cols-5',
};

export const MultiColumnGridContainerContentType = contentType({
  key: 'SFA_MultiColumnGridContainer',
  baseType: '_component',
  displayName: '(_SFA) Multi-Column Grid Container',
  description: 'Required for feature highlights, trade show statistics, and multi-column date/hour grids.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    SectionTitle: {
      type: 'string',
      displayName: 'Section Title',
      isLocalized: true,
      sortOrder: 5,
    },
    ColumnCount: {
      type: 'string',
      displayName: 'Column Count',
      sortOrder: 10,
      enum: [
        { value: '2', displayName: '2 Columns' },
        { value: '3', displayName: '3 Columns' },
        { value: '4', displayName: '4 Columns' },
        { value: '5', displayName: '5 Columns' },
      ],
    },
    Items: {
      type: 'array',
      displayName: 'Grid Items',
      sortOrder: 15,
      items: { type: 'content', restrictedTypes: [] },
    },
  },
});

export const MultiColumnGridContainerDisplayTemplate = displayTemplate({
  key: 'SFA_MultiColumnGridContainerDefault',
  contentType: 'SFA_MultiColumnGridContainer',
  isDefault: true,
  displayName: 'Multi-Column Grid Container',
  settings: sfaContainerWidthSettings,
});

type Props = {
  content: ContentProps<typeof MultiColumnGridContainerContentType>;
  displaySettings?: ContentProps<typeof MultiColumnGridContainerDisplayTemplate>;
};

export default function MultiColumnGridContainer({ content, displaySettings }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const colClass = GRID_COLS[content.ColumnCount ?? '3'] ?? 'grid-cols-3';
  const constrained = displaySettings?.containerWidth === 'constrained';

  return (
    <div {...pa(block)} className={constrained ? 'mx-auto max-w-3xl' : undefined}>
      <section className="w-full px-6 py-10">
        {content.SectionTitle && (
          <h2 {...pa('SectionTitle')} className="text-2xl font-bold text-center mb-8">
            {content.SectionTitle}
          </h2>
        )}
        <div {...pa('Items')} className={`grid ${colClass} gap-6`}>
          {(content.Items ?? []).map((item, i) => (
            <OptimizelyComponent key={i} content={item} />
          ))}
        </div>
      </section>
    </div>
  );
}
