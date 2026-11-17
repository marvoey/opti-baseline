import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';
import { expandReferences, previewContextOf } from '../expandRefs';
import ArticleCard, { HrbArticleCardContentType } from './ArticleCard';
import { HrbComplianceDisclosureContentType } from './ComplianceDisclosure';
import { tierProperties } from './shared';
import { ExternalLink, hrefOf } from './ui';

export const HrbTaxCenterCategoryPageContentType = contentType({
  key: 'HRB_TaxCenterCategoryPage',
  baseType: '_page',
  displayName: '[HRB] Tax Center Category Page',
  description:
    'H&R Block demo: a fixed-layout page for a Tax Center category such as Life Stages: heading, intro and a list of article cards that link out to hrblock.com. The structured contrast to the composed landing pages.',
  properties: {
    MetaTitle: { type: 'string', displayName: 'Meta title', isLocalized: true, isRequired: false },
    MetaDescription: {
      type: 'string',
      displayName: 'Meta description',
      isLocalized: true,
      isRequired: false,
    },
    CategoryName: {
      type: 'string',
      displayName: 'Category name',
      isLocalized: true,
      isRequired: true,
    },
    Intro: { type: 'string', displayName: 'Intro', isLocalized: true, isRequired: false },
    CategoryUrl: {
      type: 'url',
      displayName: 'Live category URL',
      description: 'The category page on hrblock.com, for the "see all" link.',
      isRequired: false,
    },
    Articles: {
      type: 'array',
      displayName: 'Articles',
      description: 'Shared article cards. Each opens the live article in a new tab.',
      isRequired: false,
      items: { type: 'contentReference', allowedTypes: [HrbArticleCardContentType] },
    },
    Disclosure: {
      type: 'contentReference',
      displayName: 'Compliance disclosure',
      isRequired: true,
      allowedTypes: [HrbComplianceDisclosureContentType],
    },
    ...tierProperties(),
  },
});

type Props = { content: ContentProps<typeof HrbTaxCenterCategoryPageContentType> };

export default async function TaxCenterCategoryPage({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const ctx = previewContextOf(content);
  const [cards, [disclosure]] = await Promise.all([
    expandReferences<ContentProps<typeof HrbArticleCardContentType>>(content.Articles, ctx),
    expandReferences<ContentProps<typeof HrbComplianceDisclosureContentType>>(
      [content.Disclosure],
      ctx,
    ),
  ]);

  return (
    <main className="w-full bg-hrb-warm-white text-hrb-ink">
      <section className="px-6 py-12">
        <div className="mx-auto max-w-6xl">
          <h1 {...pa('CategoryName')} className="text-3xl font-semibold md:text-4xl">
            {content.CategoryName}
          </h1>
          {content.Intro && (
            <p {...pa('Intro')} className="mt-3 max-w-2xl opacity-80">{content.Intro}</p>
          )}
          <div {...pa('Articles')} className="mt-8 grid gap-4 md:grid-cols-3">
            {cards.map((card, i) => (
              <ArticleCard key={card._id ?? i} content={card} />
            ))}
          </div>
          {content.CategoryUrl?.default && (
            <div className="mt-6 text-sm font-semibold text-blue-800">
              <ExternalLink href={hrefOf(content.CategoryUrl)} className="hover:underline">
                See all {content.CategoryName} articles ↗
              </ExternalLink>
            </div>
          )}
        </div>
      </section>
      {disclosure && (
        <footer className="px-6 pb-8">
          <div className="mx-auto max-w-6xl prose prose-sm text-xs text-hrb-ink/70">
            <RichTextRenderer content={disclosure.Body?.json} />
          </div>
        </footer>
      )}
    </main>
  );
}
