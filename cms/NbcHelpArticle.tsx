import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyComponent } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';
import { expandReferences, previewContextOf } from './expandRefs';
import { RichTextContentType } from './RichText';
import { NbcStepGroupBlockContentType } from './NbcStepGroupBlock';
import { NbcPartnerCardGridBlockContentType } from './NbcPartnerCardGridBlock';
import { NbcImageBlockContentType } from './NbcImageBlock';
import { NbcSharedNoticeBlockContentType } from './NbcSharedNoticeBlock';
import { NbcFaqAccordionBlockContentType } from './NbcFaqAccordionBlock';

export const NbcHelpArticleContentType = contentType({
  key: 'NbcHelpArticle',
  baseType: '_page',
  displayName: 'NBC Help Article Page',
  description: 'Root help center article container for Peacock and NOW propositions.',
  properties: {
    articleId: {
      type: 'string',
      displayName: 'Article ID',
      description: 'Immutable UUID for cross-system tracking and Adobe Analytics.',
      isRequired: true,
      isLocalized: false,
      indexingType: 'searchable',
      sortOrder: 10,
    },
    topicFamilyId: {
      type: 'string',
      displayName: 'Topic Family ID',
      description: 'Cross-proposition linking key grouping Peacock and NOW articles (e.g. help-payment-update).',
      isRequired: true,
      isLocalized: false,
      indexingType: 'queryable',
      sortOrder: 20,
    },
    legacySalesforceId: {
      type: 'string',
      displayName: 'Legacy Salesforce ID',
      description: 'Original Salesforce Knowledge ID used for automated 301 redirects.',
      isRequired: false,
      isLocalized: false,
      indexingType: 'queryable',
      sortOrder: 30,
    },
    proposition: {
      type: 'string',
      displayName: 'Proposition Scope',
      description: 'peacock, now_tv, wow, skyshowtime, or shared.',
      isRequired: true,
      isLocalized: false,
      indexingType: 'queryable',
      sortOrder: 40,
    },
    intentCategory: {
      type: 'string',
      displayName: 'Intent Category',
      description: 'Semantic intent classification (e.g. billing.update_payment_method).',
      isRequired: true,
      isLocalized: false,
      indexingType: 'queryable',
      sortOrder: 50,
    },
    categoryLabel: {
      type: 'string',
      displayName: 'Category Label (Breadcrumb)',
      description: 'Middle breadcrumb label shown between "Help Center" and the article title, e.g. "Managing My Account".',
      isRequired: false,
      isLocalized: true,
      indexingType: 'searchable',
      sortOrder: 55,
    },
    title: {
      type: 'string',
      displayName: 'Article Title',
      isRequired: true,
      isLocalized: true,
      indexingType: 'searchable',
      sortOrder: 60,
    },
    summary: {
      type: 'richText',
      displayName: 'Lead Summary',
      isRequired: true,
      isLocalized: true,
      sortOrder: 70,
    },
    mainContent: {
      type: 'array',
      displayName: 'Main Content Blocks',
      description: 'Assembly slot for NbcStepGroupBlock, NbcPartnerCardGridBlock, NbcImageBlock, and RichTextBlock.',
      isRequired: false,
      isLocalized: true,
      sortOrder: 80,
      items: {
        type: 'content',
        allowedTypes: [
          NbcStepGroupBlockContentType,
          NbcPartnerCardGridBlockContentType,
          NbcImageBlockContentType,
          RichTextContentType,
        ],
      },
    },
    sharedNoticeRef: {
      type: 'contentReference',
      displayName: 'Shared Policy Notice Reference',
      description: 'Reference to a centralized NbcSharedNoticeBlock.',
      isRequired: false,
      isLocalized: false,
      allowedTypes: [NbcSharedNoticeBlockContentType],
      sortOrder: 90,
    },
    faqContent: {
      type: 'array',
      displayName: 'FAQ Accordion Area',
      description: 'Assembly slot for NbcFaqAccordionBlock components.',
      isRequired: false,
      isLocalized: true,
      sortOrder: 100,
      items: {
        type: 'content',
        allowedTypes: [NbcFaqAccordionBlockContentType],
      },
    },
  },
});

type Props = { content: ContentProps<typeof NbcHelpArticleContentType> };

const RELATED_ARTICLES = [
  'How do I cancel my subscription?',
  'Why was my payment declined?',
  'How do I view my billing history?',
  'How do I update the email address on my account?',
];

function ChevronRight({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="m9 18 6-6-6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function ThumbIcon({ up, className }: { up?: boolean; className?: string }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      className={className}
      style={up ? undefined : { transform: 'scaleY(-1)' }}
      aria-hidden="true"
    >
      <path
        d="M7 10v11H3V10h4Zm0 0 4-7a2 2 0 0 1 2 2v4h5.5a2 2 0 0 1 1.94 2.5l-1.7 6.5A2 2 0 0 1 16.8 21H7"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

/**
 * Renders the full help-article page body: breadcrumb, title, lead summary,
 * `mainContent` blocks, an FAQ accordion, the shared policy notice, a
 * related-articles list, and a feedback widget — everything except site
 * chrome (header/footer), which `SiteChrome`/`BrandHeader`/`BrandFooter`
 * already supply for every real CMS-driven page.
 *
 * `mainContent` and `faqContent` items are each delivered fully expanded
 * with their own `__typename` by Graph, so they dispatch straight through
 * `OptimizelyComponent` against the registry in cms/registry.ts.
 * `sharedNoticeRef` and the FAQ/related-articles/feedback sections are
 * optional/no-data "assembly slots" — when empty, they render nothing
 * rather than falling through to the SDK's generic "No component found"
 * fallback.
 *
 * `sharedNoticeRef` is a genuine `contentReference` — Graph only returns
 * `{key, url}` for it (never `null`, even when unset), so it must be
 * expanded into the real NbcSharedNoticeBlock content via
 * cms/expandRefs.ts before being dispatched; passing the raw stub straight
 * to OptimizelyComponent is what previously produced the fallback whenever
 * the field was empty. A caller without a live Graph client (e.g. a mock
 * page) can instead pass an already-expanded object (carrying its own
 * `__typename`) directly, which is used as-is without an expansion fetch.
 *
 * The related-articles list is a static placeholder (no content type/data
 * source exists yet) kept brand-neutral since this one component renders
 * both Peacock and NOW TV articles.
 */
export default async function NbcHelpArticle({ content }: Props) {
  const mainContentBlocks = (content.mainContent ?? []).filter((block) => !!block?.__typename);
  const faqBlocks = (content.faqContent ?? []).filter((block) => !!block?.__typename);
  const rawNoticeRef = content.sharedNoticeRef as { __typename?: string } | null;
  const notice = rawNoticeRef?.__typename
    ? (rawNoticeRef as unknown as ContentProps<typeof NbcSharedNoticeBlockContentType>)
    : (
        await expandReferences<ContentProps<typeof NbcSharedNoticeBlockContentType>>(
          [content.sharedNoticeRef],
          previewContextOf(content),
        )
      )[0];

  return (
    <main className="bg-white text-black">
      <div className="mx-auto max-w-3xl px-6 py-10">
        <nav aria-label="Breadcrumb" className="mb-6 flex flex-wrap items-center gap-1 text-xs text-black/60">
          <span>Help Center</span>
          {content.categoryLabel && (
            <>
              <ChevronRight className="h-3.5 w-3.5" />
              <span>{content.categoryLabel}</span>
            </>
          )}
          <ChevronRight className="h-3.5 w-3.5" />
          <span className="text-black">{content.title}</span>
        </nav>

        <h2 className="text-3xl font-extrabold leading-tight">{content.title}</h2>
        {content.summary?.json && (
          <div className="mt-5 text-[15px] leading-relaxed text-black/80">
            <RichTextRenderer content={content.summary.json} />
          </div>
        )}
        {mainContentBlocks.map((block, index) => (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <OptimizelyComponent key={(block as any).key ?? index} content={block} />
        ))}

        {faqBlocks.length > 0 && (
          <>
            <hr className="my-10 border-black/10" />
            <h3 className="text-lg font-bold">Frequently asked questions</h3>
            <div className="mt-4 divide-y divide-black/10 rounded-xl border border-black/10">
              {faqBlocks.map((block, index) => (
                // eslint-disable-next-line @typescript-eslint/no-explicit-any
                <OptimizelyComponent key={(block as any).key ?? index} content={block} />
              ))}
            </div>
          </>
        )}

        {notice && (
          // eslint-disable-next-line @typescript-eslint/no-explicit-any
          <OptimizelyComponent content={notice as any} />
        )}

        <hr className="my-10 border-black/10" />
        <h3 className="text-lg font-bold">Related articles</h3>
        <ul className="mt-4 space-y-2 text-[15px]">
          {RELATED_ARTICLES.map((title) => (
            <li key={title}>
              <a href="#" className="text-[#0091D6] hover:underline">{title}</a>
            </li>
          ))}
        </ul>

        <hr className="my-10 border-black/10" />
        <div className="rounded-xl border border-black/10 p-6 text-center">
          <p className="font-semibold">Help us improve our articles. Was this one clear?</p>
          <div className="mt-4 flex items-center justify-center gap-3">
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-black/20 px-4 py-2 text-sm font-medium hover:bg-black/5"
            >
              <ThumbIcon up className="h-4 w-4" /> Yes
            </button>
            <button
              type="button"
              className="flex items-center gap-2 rounded-full border border-black/20 px-4 py-2 text-sm font-medium hover:bg-black/5"
            >
              <ThumbIcon className="h-4 w-4" /> No
            </button>
          </div>
          <p className="mt-4 text-xs text-black/50">
            Still need help? <a href="#" className="text-[#0091D6] hover:underline">Contact Support</a>
          </p>
        </div>
      </div>
    </main>
  );
}
