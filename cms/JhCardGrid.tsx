import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { numberedItems, numberedProperties } from './shared';

const COUNT = 6;

export const JhCardGridContentType = contentType({
  key: 'JhCardGrid',
  baseType: '_component',
  displayName: 'JH Card Grid',
  description: 'Titled grid of up to six cards (use cases, guarantees, resources) with optional links.',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    Title: { type: 'string', displayName: 'Title', isLocalized: true, sortOrder: 1 },
    Intro: { type: 'string', displayName: 'Intro', isLocalized: true, sortOrder: 2 },
    ...numberedProperties('Card', 'Card', COUNT, [
      { key: 'Title', label: 'Title' },
      { key: 'Text', label: 'Text' },
      { key: 'LinkLabel', label: 'Link Label' },
      { key: 'LinkHref', label: 'Link' },
    ]),
  },
});

type Props = { content: ContentProps<typeof JhCardGridContentType> };

export default function JhCardGrid({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const cards = numberedItems(content, 'Card', COUNT, ['Title', 'Text', 'LinkLabel', 'LinkHref']);

  return (
    <section {...pa(block)} className="px-4 sm:px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {content.Title && (
          <h2 {...pa('Title')} className="text-2xl sm:text-3xl font-extrabold text-jh-navy">
            {content.Title}
          </h2>
        )}
        {content.Intro && (
          <p {...pa('Intro')} className="mt-2 text-slate-600 max-w-2xl">
            {content.Intro}
          </p>
        )}
        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {cards.map((card) => (
            <article
              key={card.n}
              className="bg-white rounded-2xl border border-slate-200 p-6 shadow-sm flex flex-col"
            >
              <h3 {...pa(`Card${card.n}Title`)} className="text-lg font-bold text-jh-navy">
                {card.Title}
              </h3>
              <p {...pa(`Card${card.n}Text`)} className="text-sm text-slate-600 mt-2 leading-relaxed flex-1">
                {card.Text}
              </p>
              {card.LinkLabel && (
                <a
                  {...pa(`Card${card.n}LinkLabel`)}
                  href={card.LinkHref || '#'}
                  className="mt-4 text-sm font-bold text-jh-red hover:underline"
                >
                  {card.LinkLabel} →
                </a>
              )}
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
