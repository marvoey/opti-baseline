import { contentType } from '@optimizely/cms-sdk';
import { OptimizelyComposition, getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { ComponentWrapper } from './wrappers';

export const BlankExperienceContentType = contentType({
  key: 'BlankExperience',
  baseType: '_experience',
  displayName: 'Blank Experience',
  mayContainTypes: ['*'],
  properties: {
    // ── SEO signals ────────────────────────────────────────────────────────────
    MetaTitle: {
      type: 'string',
      displayName: 'Meta Title',
      description: 'Browser tab / SEO title. Falls back to the site name when empty.',
      isLocalized: true,
      group: 'Settings',
      sortOrder: 5,
    },
    MetaDescription: {
      type: 'string',
      displayName: 'Meta Description',
      description: 'Summary shown in search results and AI answer engines (150–160 chars recommended).',
      isLocalized: true,
      group: 'Settings',
      sortOrder: 6,
    },
    Keywords: {
      type: 'string',
      displayName: 'Keywords',
      description: 'Comma-separated keywords for the keywords meta tag.',
      isLocalized: true,
      group: 'Settings',
      sortOrder: 7,
    },
    CanonicalUrl: {
      type: 'url',
      displayName: 'Canonical URL',
      description: 'Override the canonical URL to prevent duplicate content issues.',
      group: 'Settings',
      sortOrder: 8,
    },
    RobotsDirectives: {
      type: 'string',
      displayName: 'Robots Directives',
      description: 'Controls crawler indexing. Examples: "noindex", "noindex, nofollow".',
      group: 'Settings',
      sortOrder: 9,
    },
    OgImageUrl: {
      type: 'url',
      displayName: 'OG / Social Image URL',
      description: 'Image shown when the page is shared on social media or in AI previews (1200×630px recommended).',
      group: 'Settings',
      sortOrder: 10,
    },

    // ── AEO structured data ────────────────────────────────────────────────────
    FaqItems: {
      type: 'json',
      displayName: 'FAQ Items (AEO)',
      description: 'JSON array of {"Question":"…","Answer":"…"} pairs — rendered as FAQPage structured data for AI/answer engines.',
      isLocalized: true,
      group: 'Settings',
      sortOrder: 40,
    },
    HowToName: {
      type: 'string',
      displayName: 'HowTo Name (AEO)',
      description: 'Headline for the HowTo schema block, e.g. "How to find pages with missing metadata".',
      isLocalized: true,
      group: 'Settings',
      sortOrder: 50,
    },
    HowToDescription: {
      type: 'string',
      displayName: 'HowTo Description (AEO)',
      description: 'Short description of the HowTo process for structured data.',
      isLocalized: true,
      group: 'Settings',
      sortOrder: 51,
    },
    HowToSteps: {
      type: 'json',
      displayName: 'HowTo Steps (AEO)',
      description: 'JSON array of {"name":"…","text":"…","url":"…"} steps — rendered as HowTo structured data.',
      isLocalized: true,
      group: 'Settings',
      sortOrder: 52,
    },
    Author: {
      type: 'string',
      displayName: 'Author',
      description: 'Content author name — used in Article structured data for E-E-A-T trust signals.',
      group: 'Settings',
      sortOrder: 60,
    },
    DatePublished: {
      type: 'dateTime',
      displayName: 'Date Published',
      description: 'Original publish date — signals content freshness to AI crawlers and search engines.',
      group: 'Settings',
      sortOrder: 61,
    },
    DateModified: {
      type: 'dateTime',
      displayName: 'Date Modified',
      description: 'Last modified date — keeps E-E-A-T trust signals current.',
      group: 'Settings',
      sortOrder: 62,
    },
    SpeakableSelectors: {
      type: 'string',
      displayName: 'Speakable CSS Selectors (AEO)',
      description: 'Comma-separated CSS selectors marking content readable aloud by voice assistants and AI overviews.',
      group: 'Settings',
      sortOrder: 70,
    },
  },
});

type FaqItem = { Question?: string; Answer?: string };
type HowToStep = { name?: string; text?: string; url?: string };

type Props = {
  content: {
    MetaTitle?: string;
    MetaDescription?: string;
    Keywords?: string;
    CanonicalUrl?: string;
    RobotsDirectives?: string;
    OgImageUrl?: string;
    FaqItems?: FaqItem[];
    HowToName?: string;
    HowToDescription?: string;
    HowToSteps?: HowToStep[];
    Author?: string;
    DatePublished?: string;
    DateModified?: string;
    SpeakableSelectors?: string;
    composition?: { nodes?: Parameters<typeof OptimizelyComposition>[0]['nodes'] };
    [key: string]: unknown;
  };
};

export default function BlankExperience({ content }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { pa } = getPreviewUtils(content as any);
  const nodes = content.composition?.nodes ?? [];

  // FAQPage JSON-LD
  const faqItems = (content.FaqItems ?? []).filter((f) => f.Question && f.Answer);
  const faqLd =
    faqItems.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqItems.map((f) => ({
            '@type': 'Question',
            name: f.Question,
            acceptedAnswer: { '@type': 'Answer', text: f.Answer },
          })),
        }
      : null;

  // HowTo JSON-LD
  const howToSteps = (content.HowToSteps ?? []).filter((s) => s.name || s.text);
  const howToLd =
    content.HowToName && howToSteps.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'HowTo',
          name: content.HowToName,
          ...(content.HowToDescription ? { description: content.HowToDescription } : {}),
          step: howToSteps.map((s) => ({
            '@type': 'HowToStep',
            ...(s.name ? { name: s.name } : {}),
            ...(s.text ? { text: s.text } : {}),
            ...(s.url ? { url: s.url } : {}),
          })),
        }
      : null;

  // Article JSON-LD (E-E-A-T + Speakable)
  const speakableSelectors = content.SpeakableSelectors
    ? content.SpeakableSelectors.split(',').map((s) => s.trim()).filter(Boolean)
    : [];
  const articleLd =
    content.Author || content.DatePublished
      ? {
          '@context': 'https://schema.org',
          '@type': 'Article',
          ...(content.MetaTitle ? { headline: content.MetaTitle } : {}),
          ...(content.Author
            ? { author: { '@type': 'Person', name: content.Author } }
            : {}),
          ...(content.DatePublished ? { datePublished: content.DatePublished } : {}),
          ...(content.DateModified ? { dateModified: content.DateModified } : {}),
          ...(speakableSelectors.length > 0
            ? { speakable: { '@type': 'SpeakableSpecification', cssSelector: speakableSelectors } }
            : {}),
        }
      : null;

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <main {...pa(content as any)} className="w-full">
      {faqLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(faqLd) }} />
      )}
      {howToLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(howToLd) }} />
      )}
      {articleLd && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(articleLd) }} />
      )}
      <OptimizelyComposition nodes={nodes} ComponentWrapper={ComponentWrapper} />
    </main>
  );
}
