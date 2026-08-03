import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { expandReferences, previewContextOf } from './expandRefs';

export const ArticleContainerContentType = contentType({
  key: 'ArticleContainerBlock',
  baseType: '_component',
  displayName: 'Article Container Block',
  description: 'Article Container Block',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    SectionHeading: {
      type: 'string',
      displayName: 'Section Heading',
      isLocalized: true,
      sortOrder: 10,
    },
    Articles: {
      type: 'array',
      displayName: 'Articles',
      minItems: 3,
      items: {
        type: 'contentReference',
        contentType: 'BlankExperience',
      },
      sortOrder: 20,
    },
  },
});

type ArticleRef = { key?: string | null; url?: { default?: string | null } | null } | null;

type ExpandedArticle = {
  _metadata?: { displayName?: string | null; url?: { default?: string | null } | null; key?: string | null } | null;
  ThumbnailImage?: unknown;
};

type Props = { content: ContentProps<typeof ArticleContainerContentType> };

export default async function ArticleContainer({ content }: Props) {
  const { pa, src } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const refs = (content.Articles as ArticleRef[] | null | undefined) ?? [];

  const articles = await expandReferences<ExpandedArticle>(refs, previewContextOf(content));

  return (
    <section {...pa(block)} className="w-full px-6 py-12">
      {content.SectionHeading && (
        <h2
          {...pa('SectionHeading')}
          className="mb-8 text-center text-2xl font-bold text-slate-800 dark:text-slate-100"
        >
          {content.SectionHeading}
        </h2>
      )}
      <div {...pa('Articles')} className="mx-auto grid max-w-5xl grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {articles.map((article, i) => {
          const href = article._metadata?.url?.default ?? '#';
          const name = article._metadata?.displayName ?? 'Article';
          const imageSrc = article.ThumbnailImage ? src(article.ThumbnailImage) : undefined;
          return (
            <a
              key={article._metadata?.key ?? i}
              href={href}
              className="group flex flex-col overflow-hidden rounded-2xl bg-blue-100 transition-shadow hover:shadow-md"
            >
              <div className="aspect-[4/3] w-full overflow-hidden bg-blue-200">
                {imageSrc ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={imageSrc}
                    alt={name}
                    className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                  />
                ) : (
                  <div className="flex h-full w-full items-center justify-center bg-blue-200">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img src="/logo.svg" alt="" className="w-24 opacity-20" />
                  </div>
                )}
              </div>
              <div className="flex flex-1 flex-col gap-4 p-5">
                <p className="font-semibold text-slate-800 dark:text-slate-100">{name}</p>
                <p className="mt-auto flex items-center gap-1 text-sm font-semibold text-pink">
                  Read article <span aria-hidden="true">→</span>
                </p>
              </div>
            </a>
          );
        })}
      </div>
    </section>
  );
}
