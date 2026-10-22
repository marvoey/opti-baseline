import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { numberedItems, numberedProperties } from './shared';

const COUNT = 6;

export const JhArticleListContentType = contentType({
  key: 'JhArticleList',
  baseType: '_component',
  displayName: 'JH Article List',
  description: 'Category heading with up to six article teasers (title, summary, author, date).',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    Title: { type: 'string', displayName: 'Category Title', isLocalized: true, sortOrder: 1 },
    SeeMoreLabel: { type: 'string', displayName: 'See More Label', isLocalized: true, sortOrder: 2 },
    SeeMoreHref: { type: 'string', displayName: 'See More Link', sortOrder: 3 },
    ...numberedProperties('Article', 'Article', COUNT, [
      { key: 'Title', label: 'Title' },
      { key: 'Summary', label: 'Summary' },
      { key: 'Author', label: 'Author' },
      { key: 'Date', label: 'Date' },
      { key: 'Href', label: 'Link' },
    ]),
  },
});

type Props = { content: ContentProps<typeof JhArticleListContentType> };

export default function JhArticleList({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const articles = numberedItems(content, 'Article', COUNT, ['Title', 'Summary', 'Author', 'Date', 'Href']);

  return (
    <section {...pa(block)} className="px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex items-end justify-between border-b-2 border-jh-red pb-2 mb-5">
          <h2 {...pa('Title')} className="text-xl sm:text-2xl font-extrabold text-jh-navy">
            {content.Title}
          </h2>
          {content.SeeMoreLabel && (
            <a
              {...pa('SeeMoreLabel')}
              href={content.SeeMoreHref || '#'}
              className="text-sm font-bold text-jh-red hover:underline"
            >
              {content.SeeMoreLabel} →
            </a>
          )}
        </div>
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {articles.map((a) => (
            <article key={a.n} className="bg-white rounded-xl border border-slate-200 p-5 shadow-sm flex flex-col">
              <h3 {...pa(`Article${a.n}Title`)} className="font-bold text-jh-navy leading-snug">
                <a href={a.Href || '#'} className="hover:underline">
                  {a.Title}
                </a>
              </h3>
              <p {...pa(`Article${a.n}Summary`)} className="mt-2 text-sm text-slate-600 leading-relaxed flex-1">
                {a.Summary}
              </p>
              <p className="mt-3 text-[11px] text-slate-400">
                <span {...pa(`Article${a.n}Author`)}>{a.Author}</span>
                {a.Author && a.Date ? ' · ' : ''}
                <span {...pa(`Article${a.n}Date`)}>{a.Date}</span>
              </p>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
