import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyComponent, getPreviewUtils } from '@optimizely/cms-sdk/react/server';

import { RichTextContentType } from './RichText';

/**
 * Page — a fixed-layout Page (`_page`). The body is a `Content` area: an ordered
 * list of content items the editor adds, each rendered via OptimizelyComponent.
 * `MetaTitle` feeds the per-page <title> (see generateMetadata in the catch-all).
 *
 * This key is shared with other demos in the tenant, which have already
 * extended it with SEO/AEO metadata properties (MetaDescription through
 * SpeakableSelectors below). This definition mirrors that full live schema so
 * pushing this type never drops fields those demos rely on.
 */
export const PageContentType = contentType({
  key: 'Page',
  baseType: '_page',
  displayName: 'Page (v1)',
  description: 'A page built from an ordered list of content blocks.',
  mayContainTypes: ['Page'],
  properties: {
    MetaTitle: {
      type: 'string',
      displayName: 'Meta Title',
      description: 'Browser tab / SEO title. Falls back to the site name when empty.',
      isLocalized: true,
      sortOrder: 5,
    },
    Content: {
      type: 'array',
      displayName: 'Content',
      isLocalized: true,
      items: {
        type: 'content',
        allowedTypes: [RichTextContentType],
        restrictedTypes: [],
      },
    },
    MetaDescription: {
      type: 'string',
      displayName: 'Meta Description',
      description: 'Summary shown in search results and AI answer engines (150–160 chars recommended).',
      isLocalized: true,
    },
    Keywords: {
      type: 'string',
      displayName: 'Keywords',
      description: 'Comma-separated keywords for the keywords meta tag.',
      isLocalized: true,
    },
    CanonicalUrl: {
      type: 'url',
      displayName: 'Canonical URL',
      description: 'Override the canonical URL to prevent duplicate content issues.',
    },
    RobotsDirectives: {
      type: 'string',
      displayName: 'Robots Directives',
      description: 'Controls crawler indexing. Examples: "noindex", "noindex, nofollow".',
    },
    OgImageUrl: {
      type: 'url',
      displayName: 'OG / Social Image URL',
      description: 'Image shown when the page is shared on social media or in AI previews (1200×630px recommended).',
    },
    FaqItems: {
      type: 'json',
      displayName: 'FAQ Items (AEO)',
      description: 'JSON array of {"Question":"…","Answer":"…"} pairs — rendered as FAQPage structured data for AI/answer engines.',
      isLocalized: true,
    },
    HowToName: {
      type: 'string',
      displayName: 'HowTo Name (AEO)',
      description: 'Headline for the HowTo schema block, e.g. "How to find pages with missing metadata".',
      isLocalized: true,
    },
    HowToDescription: {
      type: 'string',
      displayName: 'HowTo Description (AEO)',
      description: 'Short description of the HowTo process for structured data.',
      isLocalized: true,
    },
    HowToSteps: {
      type: 'json',
      displayName: 'HowTo Steps (AEO)',
      description: 'JSON array of {"name":"…","text":"…","url":"…"} steps — rendered as HowTo structured data.',
      isLocalized: true,
    },
    Author: {
      type: 'string',
      displayName: 'Author',
      description: 'Content author name — used in Article structured data for E-E-A-T trust signals.',
    },
    DatePublished: {
      type: 'dateTime',
      displayName: 'Date Published',
      description: 'Original publish date — signals content freshness to AI crawlers and search engines.',
    },
    DateModified: {
      type: 'dateTime',
      displayName: 'Date Modified',
      description: 'Last modified date — keeps E-E-A-T trust signals current.',
    },
    SpeakableSelectors: {
      type: 'string',
      displayName: 'Speakable CSS Selectors (AEO)',
      description: 'Comma-separated CSS selectors marking content readable aloud by voice assistants and AI overviews.',
    },
  },
});

type Props = {
  content: ContentProps<typeof PageContentType>;
};

export default function Page({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const items = content.Content ?? [];

  return (
    <main {...pa('Content')} className="w-full">
      {items.map((item, i) => (
        <OptimizelyComponent key={i} content={item} />
      ))}
    </main>
  );
}
