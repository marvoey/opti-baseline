import Image from 'next/image';
import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { getTopicTagLabel } from '@/lib/topicTags';
import { pickGradient } from '@/lib/gradients';

export const FeaturedArticlesContentType = contentType({
  key: 'FeaturedArticles',
  baseType: '_component',
  displayName: 'Featured Articles',
  description: 'A curated list of featured article pages.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Title: {
      type: 'string',
      format: 'shortString',
      displayName: 'Title',
      description: 'Section heading displayed above the article cards.',
      isRequired: false,
      isLocalized: true,
      sortOrder: 10,
    },
    Articles: {
      type: 'array',
      displayName: 'Articles',
      description: 'Select one or more Article Pages to feature.',
      isRequired: false,
      sortOrder: 20,
      items: {
        type: 'contentReference',
        allowedTypes: ['ArticlePage'],
        restrictedTypes: [],
      },
    },
  },
});

export const FeaturedArticlesDisplayTemplate = displayTemplate({
  key: 'FeaturedArticlesDefault',
  isDefault: true,
  displayName: 'Featured Articles',
  contentType: 'FeaturedArticles',
  settings: {},
});

type ArticleRef = {
  url?: { default?: string | null };
  name?: string;
  Headline?: string | null;
  Author?: string | null;
  TopicTag?: string[] | null;
  HeroImage?: { url?: { default?: string | null } } | null;
};

type Props = {
  content: ContentProps<typeof FeaturedArticlesContentType>;
};

export default function FeaturedArticles({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const articles = (content.Articles ?? []) as ArticleRef[];

  return (
    <section {...pa(block)} className="w-full py-10 px-4 sm:px-6">
      <div className="max-w-7xl mx-auto">
        {content.Title && (
          <h2 {...pa('Title')} className="font-display font-bold text-2xl text-blue-950 mb-6">
            {content.Title}
          </h2>
        )}

        {articles.length > 0 ? (
          <ul className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            {articles.map((ref, i) => {
              const url = ref.url?.default ?? '#';
              const headline = ref.Headline ?? ref.name ?? 'Article';
              const heroUrl = ref.HeroImage?.url?.default;
              const tags = ref.TopicTag ?? [];

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
                              <pattern id={`fa-dots-${i}`} x="0" y="0" width="20" height="20" patternUnits="userSpaceOnUse">
                                <circle cx="2.5" cy="2.5" r="1.5" fill="white" />
                              </pattern>
                            </defs>
                            <rect width="100%" height="100%" fill={`url(#fa-dots-${i})`} />
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
                      {ref.Author && (
                        <p className="mt-auto text-xs text-gray-400">By {ref.Author}</p>
                      )}
                    </div>
                  </a>
                </li>
              );
            })}
          </ul>
        ) : (
          <p className="border border-dashed border-gray-300 rounded p-4 text-sm text-gray-400 text-center">
            No articles selected yet
          </p>
        )}
      </div>
    </section>
  );
}
