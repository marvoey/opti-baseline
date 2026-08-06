import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils, OptimizelyComponent } from '@optimizely/cms-sdk/react/server';
import { CardItemBlockContentType } from './CardItemBlock';

export const UniversalCardGridBlockContentType = contentType({
  key: 'UniversalCardGridBlock',
  baseType: '_component',
  displayName: '(Verticals) Universal Card Grid Block',
  description: 'A grid container for rendering lists of Card Item Blocks.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    GridLayout: {
      type: 'string',
      displayName: 'Grid Layout Variant',
      description: 'e.g., 2-Column, 3-Column, Masonry',
      sortOrder: 10,
      enum: [
        { value: '2-column', displayName: '2-Column' },
        { value: '3-column', displayName: '3-Column' },
        { value: 'masonry', displayName: 'Masonry' },
      ],
    },
    ShowSidebarFilters: {
      type: 'boolean',
      displayName: 'Show Sidebar Filters',
      sortOrder: 20,
    },
    Cards: {
      type: 'array',
      displayName: 'Card Items',
      description: 'Add Card Item Blocks here.',
      sortOrder: 30,
      items: {
        type: 'content',
        allowedTypes: [CardItemBlockContentType],
      },
    },
  },
});

const GRID_CLASSES: Record<string, string> = {
  '2-column': 'grid-cols-1 sm:grid-cols-2',
  'masonry': 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3',
};
const DEFAULT_GRID = 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3';

type Props = { content: ContentProps<typeof UniversalCardGridBlockContentType> };

export default function UniversalCardGridBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const cards = (content.Cards ?? []) as any[];
  const gridCols = GRID_CLASSES[content.GridLayout ?? ''] ?? DEFAULT_GRID;

  return (
    <div {...pa(block)} className="w-full">
      <div className="flex gap-8">
        {content.ShowSidebarFilters && (
          <aside className="hidden lg:block w-64 shrink-0 rounded-[24px] border-4 border-[#08251A] bg-[#E4F0DA] p-6">
            <p className="text-xs font-black uppercase tracking-widest text-[#197050] mb-4">Filters</p>
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-8 bg-white rounded-full border-2 border-[#08251A]" />
              ))}
            </div>
          </aside>
        )}

        <div {...pa('Cards')} className={`flex-1 grid gap-8 ${gridCols}`}>
          {cards.map((card, idx) => (
            <OptimizelyComponent key={idx} content={card} />
          ))}
        </div>
      </div>
    </div>
  );
}
