import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyComponent, getPreviewUtils } from '@optimizely/cms-sdk/react/server';

import { RichTextContentType } from './RichText';
import { HeroBlockContentType } from './HeroBlock';
import { FdPromoSplitContentType } from './FdPromoSplit';
import { FdFeatureGridContentType } from './FdFeatureGrid';
import { FdProductGridContentType } from './FdProductGrid';
import { FdProductDetailContentType } from './FdProductDetail';
import { FdShopTheLookContentType } from './FdShopTheLook';

/**
 * Page — a fixed-layout Page (`_page`). The body is a `Content` area: an ordered
 * list of content items the editor adds, each rendered via OptimizelyComponent.
 * `MetaTitle` feeds the per-page <title> (see generateMetadata in the catch-all).
 */
export const PageContentType = contentType({
  key: 'Page',
  baseType: '_page',
  displayName: 'Page (v1)',
  description: 'A page built from an ordered list of content blocks.',
  // Wildcard on purpose: 'BlankExperience' is an SDK built-in that isn't pushed from this
  // repo, so the CLI rejects its key as unknown, and the CMS rejects base types such as
  // '_experience'. '*' lets a Page contain Pages and BlankExperiences (and any other type).
  mayContainTypes: ['*'],
  properties: {
    MetaTitle: {
      type: 'string',
      displayName: 'Meta Title',
      description: 'Browser tab / SEO title. Falls back to the site name when empty.',
      isLocalized: true,
      group: 'Content',
      sortOrder: 5,
    },
    MetaDescription: {
      type: 'string',
      displayName: 'Meta Description',
      description: 'Summary shown in search results and AI answer engines (150–160 chars recommended).',
      isLocalized: true,
      group: 'Content',
    },
    Keywords: {
      type: 'string',
      displayName: 'Keywords',
      description: 'Comma-separated keywords for the keywords meta tag.',
      isLocalized: true,
      group: 'Content',
    },
    CanonicalUrl: {
      type: 'url',
      displayName: 'Canonical URL',
      description: 'Override the canonical URL to prevent duplicate content issues.',
      isLocalized: false,
      group: 'Content',
    },
    RobotsDirectives: {
      type: 'string',
      displayName: 'Robots Directives',
      description: 'Controls crawler indexing. Examples: "noindex", "noindex, nofollow".',
      isLocalized: false,
      group: 'Content',
    },
    OgImageUrl: {
      type: 'url',
      displayName: 'OG / Social Image URL',
      description: 'Image shown when the page is shared on social media or in AI previews (1200×630px recommended).',
      isLocalized: false,
      group: 'Content',
    },
    FaqItems: {
      type: 'json',
      displayName: 'FAQ Items (AEO)',
      description: 'JSON array of {"Question":"…","Answer":"…"} pairs — rendered as FAQPage structured data for AI/answer engines.',
      isLocalized: true,
      group: 'Content',
    },
    HowToName: {
      type: 'string',
      displayName: 'HowTo Name (AEO)',
      description: 'Headline for the HowTo schema block, e.g. "How to find pages with missing metadata".',
      isLocalized: true,
      group: 'Content',
    },
    HowToDescription: {
      type: 'string',
      displayName: 'HowTo Description (AEO)',
      description: 'Short description of the HowTo process for structured data.',
      isLocalized: true,
      group: 'Content',
    },
    HowToSteps: {
      type: 'json',
      displayName: 'HowTo Steps (AEO)',
      description: 'JSON array of {"name":"…","text":"…","url":"…"} steps — rendered as HowTo structured data.',
      isLocalized: true,
      group: 'Content',
    },
    Author: {
      type: 'string',
      displayName: 'Author',
      description: 'Content author name — used in Article structured data for E-E-A-T trust signals.',
      isLocalized: false,
      group: 'Content',
    },
    DatePublished: {
      type: 'dateTime',
      displayName: 'Date Published',
      description: 'Original publish date — signals content freshness to AI crawlers and search engines.',
      isLocalized: false,
      group: 'Content',
    },
    DateModified: {
      type: 'dateTime',
      displayName: 'Date Modified',
      description: 'Last modified date — keeps E-E-A-T trust signals current.',
      isLocalized: false,
      group: 'Content',
    },
    SpeakableSelectors: {
      type: 'string',
      displayName: 'Speakable CSS Selectors (AEO)',
      description: 'Comma-separated CSS selectors marking content readable aloud by voice assistants and AI overviews.',
      isLocalized: false,
      group: 'Content',
    },
    Content: {
      type: 'array',
      displayName: 'Content',
      isLocalized: true,
      group: 'Content',
      items: {
        type: 'content',
        allowedTypes: [
          RichTextContentType,
          HeroBlockContentType,
          FdPromoSplitContentType,
          FdFeatureGridContentType,
          FdProductGridContentType,
          FdProductDetailContentType,
          FdShopTheLookContentType,
        ],
        restrictedTypes: [],
      },
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
    <div {...pa('Content')} className="w-full space-y-10">
      {items.map((item, i) => (
        <OptimizelyComponent key={i} content={item} />
      ))}
    </div>
  );
}
