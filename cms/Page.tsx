import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyComponent, getPreviewUtils } from '@optimizely/cms-sdk/react/server';

import { HeroContentType } from './Hero';
import { RichTextContentType } from './RichText';
import { CibcHeroContentType } from './CibcHero';
import { CibcAlertFeedContentType } from './CibcAlertFeed';
import { CibcAssetGridContentType } from './CibcAssetGrid';
import { CibcOnboardingJourneyContentType } from './CibcOnboardingJourney';
import { CibcRegulatoryDirectiveContentType } from './CibcRegulatoryDirective';

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
  mayContainTypes: ['ExperiencePage', 'Page'],
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
        allowedTypes: [
          HeroContentType,
          RichTextContentType,
          CibcHeroContentType,
          CibcAlertFeedContentType,
          CibcAssetGridContentType,
          CibcOnboardingJourneyContentType,
          CibcRegulatoryDirectiveContentType,
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
    <main {...pa('Content')} className="w-full">
      {items.map((item, i) => (
        <OptimizelyComponent key={i} content={item} />
      ))}
    </main>
  );
}
