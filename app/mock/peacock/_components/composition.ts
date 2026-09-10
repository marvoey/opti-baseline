import { BlankExperienceContentType, type ContentProps } from '@optimizely/cms-sdk';
import { PeacockHeroBlockContentType } from './Hero';
import { PeacockSportsCarouselBlockContentType } from './SportsCarousel';
import { PeacockShowcaseBlockContentType } from './Showcase';
import { PeacockPricingBlockContentType } from './Pricing';
import { PeacockFeaturesBlockContentType } from './Features';
import { PeacockGiftCardsBlockContentType } from './GiftCards';
import { PeacockFaqBlockContentType } from './Faq';
import { PeacockExploreMoreBlockContentType } from './ExploreMore';

type PeacockMockExperience = ContentProps<typeof BlankExperienceContentType>;
type PeacockMockComposition = NonNullable<PeacockMockExperience['composition']>;
type PeacockMockNode = NonNullable<PeacockMockComposition['nodes']>[number];

function sectionNode(key: string, displayName: string, contentTypeKey: string): PeacockMockNode {
  return {
    __typename: 'CompositionComponentNode',
    key,
    type: contentTypeKey,
    layoutType: null,
    displayName,
    displayTemplateKey: null,
    displaySettings: null,
    nodeType: 'component',
    component: { __typename: contentTypeKey },
  };
}

/**
 * Hand-authored composition tree standing in for what a real Visual Builder
 * experience's `composition.nodes` would contain from Optimizely Graph. Each
 * Peacock section content type declares `compositionBehaviors:
 * ['sectionEnabled']`, so it can sit directly as a top-level node here — no
 * BlankSection/row/column wrapping needed (that's only for composing
 * arbitrary elements, e.g. RichText, inside a `_section`).
 *
 * `component.__typename` must exactly match a key registered in
 * `cms/registry.ts`'s `initReactComponentRegistry` resolver.
 */
const composition: PeacockMockComposition = {
  __typename: 'CompositionStructureNode',
  key: 'peacock-mock-root',
  type: null,
  layoutType: null,
  displayName: 'Peacock Mock Home',
  displayTemplateKey: null,
  displaySettings: null,
  nodeType: 'root',
  nodes: [
    sectionNode('hero', 'Hero', PeacockHeroBlockContentType.key),
    sectionNode('sports-carousel', 'Sports Carousel', PeacockSportsCarouselBlockContentType.key),
    sectionNode('showcase', 'Showcase', PeacockShowcaseBlockContentType.key),
    sectionNode('pricing', 'Pricing', PeacockPricingBlockContentType.key),
    sectionNode('features', 'Features', PeacockFeaturesBlockContentType.key),
    sectionNode('gift-cards', 'Gift Cards', PeacockGiftCardsBlockContentType.key),
    sectionNode('faq', 'FAQ', PeacockFaqBlockContentType.key),
    sectionNode('explore-more', 'Explore More', PeacockExploreMoreBlockContentType.key),
  ],
};

/**
 * `_id`/`_metadata`/`__typename` are required by `ContentProps<...>` but are
 * never read by BlankExperience/OptimizelyComposition outside edit mode (no
 * `__context` here) — stubbed via one cast rather than fabricating a fake but
 * fully-compliant `_metadata` object nothing consumes.
 */
export const peacockMockExperienceContent = {
  __typename: BlankExperienceContentType.key,
  composition,
} as unknown as PeacockMockExperience;
