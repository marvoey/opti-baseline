import Image from 'next/image';
import { contentType, getClient, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { getTopicTagLabel } from '@/lib/topicTags';
import { pickGradient } from '@/lib/gradients';

export const AllArticlesContentType = contentType({
  key: 'AllArticles',
  baseType: '_component',
  displayName: 'All Articles',
  description: 'Fetches and displays all published Article Pages as cards in a 4-column grid.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {},
});

export const AllArticlesDisplayTemplate = displayTemplate({
  key: 'AllArticlesDefault',
  isDefault: true,
  displayName: 'All Articles',
  contentType: 'AllArticles',
  settings: {},
});

type ArticleCard = {
  _metadata?: { displayName?: string; url?: { default?: string | null } };
  Headline?: string | null;
  Author?: string | null;
  TopicTag?: string[] | null;
  HeroImage?: { url?: { default?: string | null } } | null;
};

const ARTICLES_QUERY = `
  {
    ArticlePage(limit: 100) {
      items {
        _metadata { displayName url { default } }
        Headline
        Author
        TopicTag
        HeroImage { url { default } }
      }
    }
  }
`;

async function fetchAllArticles(): Promise<ArticleCard[]> {
  try {
    const data = await getClient().request(ARTICLES_QUERY, {});
    return (data?.ArticlePage?.items ?? []) as ArticleCard[];
  } catch {
    return [];
  }
}

type Props = { content: ContentProps<typeof AllArticlesContentType> };

export default async function AllArticles({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const articles = await fetchAllArticles();

  return (
    <section {...pa(block)} className="w-full py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
      {articles.length === 0 ? (
        <p className="border border-dashed border-gray-300 rounded p-4 text-sm text-gray-400 text-center">
          No published articles found.
        </p>
      ) : (
        <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {articles.map((article, i) => {
            const url = article._metadata?.url?.default ?? '#';
            const headline = article.Headline ?? article._metadata?.displayName ?? 'Article';
            const heroUrl = article.HeroImage?.url?.default;
            const tags = article.TopicTag ?? [];

            return (
              <li key={i}>
                <a
                  href={url}
                  className="group flex flex-col h-full border border-gray-200 rounded-lg overflow-hidden hover:border-blue-300 hover:shadow-sm transition-all"
                >
                  {/* Thumbnail */}
                  <div className="relative w-full h-48 sm:h-40 bg-gray-100 shrink-0">
                    {heroUrl ? (
                      <Image
                        src={heroUrl}
                        alt=""
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                    ) : (
                      <div className={`absolute inset-0 bg-linear-to-br ${pickGradient(headline)}`}>
                        <svg className="absolute inset-0 w-full h-full opacity-[0.07]" aria-hidden="true">
                          <defs>
                            <pattern id={`dots-${i}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                              <circle cx="2.5" cy="2.5" r="1.5" fill="white" />
                            </pattern>
                          </defs>
                          <rect width="100%" height="100%" fill={`url(#dots-${i})`} />
                        </svg>
                      </div>
                    )}
                  </div>

                  {/* Card body */}
                  <div className="flex flex-col flex-1 p-4 gap-2">
                    {tags.length > 0 && (
                      <div className="flex flex-wrap gap-1">
                        {tags.map(tag => (
                          <span
                            key={tag}
                            className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-blue-100 text-blue-800"
                          >
                            {getTopicTagLabel(tag)}
                          </span>
                        ))}
                      </div>
                    )}
                    <p className="text-sm font-semibold text-blue-950 leading-snug line-clamp-3">
                      {headline}
                    </p>
                    {article.Author && (
                      <p className="mt-auto text-xs text-gray-400">By {article.Author}</p>
                    )}
                  </div>
                </a>
              </li>
            );
          })}
        </ul>
      )}
      </div>
    </section>
  );
}
