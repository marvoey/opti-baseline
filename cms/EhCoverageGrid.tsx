import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { expandReferences, previewContextOf } from './expandRefs';
import { CoverageCard } from './EhCoverageCard';

/**
 * "Select the coverage you need for any stage of life": a heading over a
 * two-column grid of shared EhCoverageCard blocks.
 */
export const EhCoverageGridContentType = contentType({
  key: 'EhCoverageGrid',
  baseType: '_component',
  displayName: '[eHealth] Coverage Grid',
  description: '[EH] Heading plus a two-column grid of coverage cards, picked from shared [eHealth] Coverage Card blocks.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Heading: {
      type: 'string',
      displayName: 'Heading',
      description: 'e.g. "Select the coverage you need for any stage of life". Leave blank to hide.',
      isLocalized: true,
      sortOrder: 10,
    },
    Cards: {
      type: 'array',
      displayName: 'Coverage cards',
      description: 'Shared coverage card blocks, shown in this order.',
      sortOrder: 20,
      items: { type: 'contentReference', allowedTypes: ['EhCoverageCard'] },
    },
  },
});

type Props = { content: ContentProps<typeof EhCoverageGridContentType> };

export default async function EhCoverageGrid({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  const cards = await expandReferences<Record<string, unknown>>(
    content.Cards as Array<{ key?: string | null }> | null,
    previewContextOf(content),
  );

  return (
    <div {...pa(block)} className="w-full px-6 py-10 md:py-14">
      <div className="mx-auto max-w-5xl">
        {content.Heading && (
          <h2
            {...pa('Heading')}
            className="mb-8 text-center font-display text-2xl font-bold text-blue-950 sm:text-3xl"
          >
            {content.Heading}
          </h2>
        )}
        <div {...pa('Cards')} className="grid gap-6 md:grid-cols-2">
          {cards.length > 0 ? (
            cards.map((card, i) => <CoverageCard key={i} content={card} />)
          ) : (
            <p className="rounded border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500 md:col-span-2">
              Add coverage cards to this grid.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
