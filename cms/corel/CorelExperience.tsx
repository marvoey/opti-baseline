import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyComposition, getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { ComponentWrapper } from '../wrappers';

/**
 * Corel: Experience — the page type for every Corel page (home, product, special
 * offers, free trials, learning center, support). A Visual Builder experience
 * whose blocks are the `Corel: …` section blocks. SEO fields mirror
 * BlankExperience so `generateMetadata` in the catch-all route works unchanged
 * (it reads `MetaTitle`).
 */
export const CorelExperienceContentType = contentType({
  key: 'CorelExperience',
  baseType: '_experience',
  displayName: 'Corel: Experience',
  description: 'A Corel page built in Visual Builder from the Corel section blocks.',
  mayContainTypes: ['*'],
  properties: {
    MetaTitle: {
      type: 'string',
      displayName: 'Meta Title',
      description: 'Browser tab / SEO title. Falls back to the site name when empty.',
      isLocalized: true,
      sortOrder: 5,
    },
    MetaDescription: {
      type: 'string',
      displayName: 'Meta Description',
      description: 'Summary shown in search results (150–160 chars recommended).',
      isLocalized: true,
      sortOrder: 10,
    },
    Keywords: {
      type: 'string',
      displayName: 'Keywords',
      description: 'Comma-separated keywords for the keywords meta tag.',
      isLocalized: true,
      sortOrder: 15,
    },
    CanonicalUrl: {
      type: 'url',
      displayName: 'Canonical URL',
      description: 'Override the canonical URL to prevent duplicate content issues.',
      sortOrder: 20,
    },
    RobotsDirectives: {
      type: 'string',
      displayName: 'Robots Directives',
      description: 'Controls crawler indexing. Examples: "noindex", "noindex, nofollow".',
      sortOrder: 25,
    },
    OgImageUrl: {
      type: 'url',
      displayName: 'OG / Social Image URL',
      description: 'Image shown when the page is shared (1200×630px recommended).',
      sortOrder: 30,
    },
  },
});

type Props = { content: ContentProps<typeof CorelExperienceContentType> };

export function CorelExperience({ content }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { pa } = getPreviewUtils(content as any);
  const nodes = content.composition?.nodes ?? [];

  if (nodes.length === 0) {
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <main {...pa(content as any)} className="site-container my-12 rounded-lg border border-dashed border-gray-300 p-12 text-center">
        <p className="text-sm font-medium text-gray-500">This Corel page is empty</p>
        <p className="mt-1 text-sm text-gray-400">
          Add blocks such as “Corel: Hero split” or “Corel: Product tier cards” to build the page.
        </p>
      </main>
    );
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <main {...pa(content as any)}>
      <OptimizelyComposition nodes={nodes} ComponentWrapper={ComponentWrapper} />
    </main>
  );
}
