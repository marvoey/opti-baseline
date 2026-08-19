import Image from 'next/image';
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';
import { getTopicTagLabel } from '@/lib/topicTags';
import { pickGradient } from '@/lib/gradients';

export const ArticlePageContentType = contentType({
  key: 'ArticlePage',
  baseType: '_page',
  displayName: 'Article Page',
  description: 'Editorial article with hero image, rich text body, topic tagging for ODP intent, and curated related resources.',
  properties: {
    Headline: {
      type: 'string',
      format: 'shortString',
      displayName: 'Headline',
      description: 'The main H1 of the article.',
      isRequired: true,
      isLocalized: true,
      sortOrder: 10,
    },
    HeroImage: {
      type: 'contentReference',
      allowedTypes: ['_image'],
      displayName: 'Hero Image',
      description: 'Full-width hero image sourced from the native DAM.',
      isRequired: false,
      sortOrder: 20,
    },
    Author: {
      type: 'string',
      format: 'shortString',
      displayName: 'Author',
      description: "Author's display name.",
      isRequired: false,
      sortOrder: 30,
    },
    BodyContent: {
      type: 'richText',
      displayName: 'Body Content',
      description: 'Main article body text.',
      isLocalized: true,
      isRequired: false,
      sortOrder: 40,
    },
    TopicTag: {
      type: 'array',
      format: 'selectMany',
      displayName: 'Topic Tag',
      description: 'Tags this article for ODP intent signals. Choose one of the predefined values.',
      isRequired: false,
      isLocalized: true,
      sortOrder: 50,
      items: {
        type: 'string',
        enum: [
          { value: '1',  displayName: 'Mortgage'             },
          { value: '2',  displayName: 'Home Equity'          },
          { value: '3',  displayName: 'Auto Loans'           },
          { value: '4',  displayName: 'Personal Loans'       },
          { value: '5',  displayName: 'Checking'             },
          { value: '6',  displayName: 'Savings'              },
          { value: '7',  displayName: 'Credit Cards'         },
          { value: '8',  displayName: 'Wealth & Investments' },
          { value: '9',  displayName: 'Retirement'           },
          { value: '10', displayName: 'Trust Services'       },
          { value: '11', displayName: 'Business Banking'     },
          { value: '12', displayName: 'Financial Wellness'   },
        ],
      },
    },
    RelatedResources: {
      type: 'array',
      displayName: 'Related Resources',
      description: 'Curated list of 2–3 related articles or tools shown at the bottom of the page.',
      isRequired: false,
      sortOrder: 60,
      items: {
        type: 'contentReference',
        allowedTypes: ['ArticlePage'],
        restrictedTypes: [],
      },
    },
  },
});

type RelatedRef = {
  url?: { default?: string | null };
  name?: string;
};

type Props = { content: ContentProps<typeof ArticlePageContentType> };

export default function ArticlePage({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const heroUrl = (content.HeroImage as { url?: { default?: string | null } } | undefined)?.url?.default;
  const topics = (content.TopicTag ?? []) as string[];
  const resources = (content.RelatedResources ?? []) as RelatedRef[];

  return (
    <article>
      {/* Hero — image or branded gradient, with headline + tags centered over it */}
      <div {...pa('HeroImage')} className="relative w-full h-56 sm:h-80 lg:h-96 overflow-hidden">
        {heroUrl ? (
          <>
            <Image src={heroUrl} alt="" fill className="object-cover" />
            <div className="absolute inset-0 bg-blue-950/50" />
          </>
        ) : (
          <div className={`absolute inset-0 bg-linear-to-br ${pickGradient(content.Headline ?? '')}`}>
            <svg className="absolute inset-0 w-full h-full opacity-[0.07]" aria-hidden="true">
              <defs>
                <pattern id="hero-dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
                  <circle cx="3" cy="3" r="2" fill="white" />
                </pattern>
              </defs>
              <rect width="100%" height="100%" fill="url(#hero-dots)" />
            </svg>
          </div>
        )}

        {/* Headline + tags centred over the hero */}
        <div className="absolute inset-0 flex flex-col items-center justify-center px-6 text-center gap-3">
          {topics.length > 0 && (
            <div {...pa('TopicTag')} className="flex flex-wrap justify-center gap-2">
              {topics.map(tag => (
                <span key={tag} className="inline-block px-3 py-1 rounded-full bg-white/20 text-white text-xs font-semibold uppercase tracking-wide backdrop-blur-sm">
                  {getTopicTagLabel(tag)}
                </span>
              ))}
            </div>
          )}
          <h1 {...pa('Headline')} className="font-display font-bold text-3xl sm:text-4xl lg:text-5xl text-white leading-tight drop-shadow-sm max-w-3xl">
            {content.Headline ?? 'Article Headline'}
          </h1>
          {content.Author && (
            <p {...pa('Author')} className="text-sm text-white/70">
              By {content.Author}
            </p>
          )}
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">

        {/* Body */}
        <div {...pa('BodyContent')} className="prose prose-blue max-w-none">
          <RichTextRenderer content={content.BodyContent?.json} />
        </div>
      </div>

      {/* Related Resources */}
      {resources.length > 0 && (
        <section {...pa('RelatedResources')} className="border-t border-gray-200">
          <div className="max-w-3xl mx-auto px-4 sm:px-6 py-10">
            <h2 className="font-display font-bold text-xl text-blue-950 mb-6">Related Resources</h2>
            <ul className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {resources.map((ref, i) => (
                <li key={i}>
                  <a
                    href={ref.url?.default ?? '#'}
                    className="block p-5 border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all"
                  >
                    <span className="text-sm font-semibold text-blue-800 leading-snug">
                      {ref.name ?? 'Resource'}
                    </span>
                    <span className="block mt-1 text-xs text-gray-400">Read more →</span>
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}
    </article>
  );
}
