import {
  config,
  initContentTypeRegistry,
  initDisplayTemplateRegistry,
  BlankExperienceContentType,
  BlankSectionContentType,
} from '@optimizely/cms-sdk';
import { initReactComponentRegistry } from '@optimizely/cms-sdk/react/server';
import { requireEnv } from '@/lib/env';

import BlankExperience from './BlankExperience';
import BlankSection from './BlankSection';
import RichText, { RichTextContentType } from './RichText';
import NbcSharedNoticeBlock, { NbcSharedNoticeBlockContentType } from './NbcSharedNoticeBlock';
import NbcStepGroupBlock, { NbcStepGroupBlockContentType } from './NbcStepGroupBlock';
import { NbcPartnerCardGridBlockContentType } from './NbcPartnerCardGridBlock';
import NbcFaqAccordionBlock, { NbcFaqAccordionBlockContentType } from './NbcFaqAccordionBlock';
import { NbcImageBlockContentType } from './NbcImageBlock';
import NbcHelpArticle, { NbcHelpArticleContentType } from './NbcHelpArticle';
import PeacockHero, { PeacockHeroBlockContentType } from '@/app/mock/peacock/_components/Hero';
import PeacockSportsCarousel, { PeacockSportsCarouselBlockContentType } from '@/app/mock/peacock/_components/SportsCarousel';
import PeacockShowcase, { PeacockShowcaseBlockContentType } from '@/app/mock/peacock/_components/Showcase';
import PeacockPricing, { PeacockPricingBlockContentType } from '@/app/mock/peacock/_components/Pricing';
import PeacockFeatures, { PeacockFeaturesBlockContentType } from '@/app/mock/peacock/_components/Features';
import PeacockGiftCards, { PeacockGiftCardsBlockContentType } from '@/app/mock/peacock/_components/GiftCards';
import PeacockFaq, { PeacockFaqBlockContentType } from '@/app/mock/peacock/_components/Faq';
import PeacockExploreMore, { PeacockExploreMoreBlockContentType } from '@/app/mock/peacock/_components/ExploreMore';
import NowTvPromoBanner, { NowTvPromoBannerBlockContentType } from '@/app/mock/nowtv/gb/_components/PromoBanner';
import NowTvMemberships, { NowTvMembershipsBlockContentType } from '@/app/mock/nowtv/gb/_components/Memberships';
import NowTvSports, { NowTvSportsBlockContentType } from '@/app/mock/nowtv/gb/_components/Sports';
import NowTvEntertainment, { NowTvEntertainmentBlockContentType } from '@/app/mock/nowtv/gb/_components/Entertainment';
import NowTvCinema, { NowTvCinemaBlockContentType } from '@/app/mock/nowtv/gb/_components/Cinema';
import NowTvFaq, { NowTvFaqBlockContentType } from '@/app/mock/nowtv/gb/_components/Faq';
import NowTvExploreMore, { NowTvExploreMoreBlockContentType } from '@/app/mock/nowtv/gb/_components/ExploreMore';

/**
 * Single configuration + registration point for the Optimizely SDK.
 * Imported for side effects by app/layout.tsx.
 *
 * Named registry.ts (not .tsx) so the optimizely.config.mjs `./cms/**\/*.tsx`
 * glob does not pick it up during `opti-cli config push` — only the files that
 * define content types should be scanned.
 *
 * To add a new content type:
 *   1. Define it in a cms/<Name>.tsx file (export the contentType() + a default
 *      React component, plus any display template).
 *   2. Import it here and register it in the three calls below:
 *        - initContentTypeRegistry      → the contentType() definition
 *        - initDisplayTemplateRegistry  → any display template(s)
 *        - initReactComponentRegistry   → map the content type key → component
 *   3. Run `npm run config:push` to push the type(s) to the CMS.
 */
const env = requireEnv();

config({
  apiKey: env.OPTIMIZELY_GRAPH_SINGLE_KEY,
  graphUrl: env.OPTIMIZELY_GRAPH_GATEWAY,
});

/**
 * The content types this app defines and pushes to the CMS. Exported so other
 * surfaces (e.g. the /admin inspector) can read the same source of truth that's
 * registered with the SDK below.
 */
export const registeredContentTypes = [
  // SDK-native types the CMS can send (e.g. during preview).
  BlankExperienceContentType,
  BlankSectionContentType,
  // Blocks
  RichTextContentType,
  // NBC Help Center content types (NbcSharedNoticeBlock, NbcStepGroupBlock and
  // NbcHelpArticle have renderers below; the rest remain schema only)
  NbcSharedNoticeBlockContentType,
  NbcStepGroupBlockContentType,
  NbcPartnerCardGridBlockContentType,
  NbcFaqAccordionBlockContentType,
  NbcImageBlockContentType,
  NbcHelpArticleContentType,
  // Peacock mock homepage section content types
  PeacockHeroBlockContentType,
  PeacockSportsCarouselBlockContentType,
  PeacockShowcaseBlockContentType,
  PeacockPricingBlockContentType,
  PeacockFeaturesBlockContentType,
  PeacockGiftCardsBlockContentType,
  PeacockFaqBlockContentType,
  PeacockExploreMoreBlockContentType,
  // NOW TV mock homepage section content types
  NowTvPromoBannerBlockContentType,
  NowTvMembershipsBlockContentType,
  NowTvSportsBlockContentType,
  NowTvEntertainmentBlockContentType,
  NowTvCinemaBlockContentType,
  NowTvFaqBlockContentType,
  NowTvExploreMoreBlockContentType,
];

initContentTypeRegistry(registeredContentTypes);

initDisplayTemplateRegistry([]);

initReactComponentRegistry({
  resolver: {
    BlankExperience,
    BlankSection,
    // Blocks (resolver key === content-type key)
    RichTextBlock: RichText,
    // NBC Help Center content types with renderers (NbcPartnerCardGridBlock
    // and NbcImageBlock remain schema only for now).
    NbcSharedNoticeBlock,
    NbcStepGroupBlock,
    NbcFaqAccordionBlock,
    NbcHelpArticle,
    // Peacock mock homepage sections
    PeacockHeroBlock: PeacockHero,
    PeacockSportsCarouselBlock: PeacockSportsCarousel,
    PeacockShowcaseBlock: PeacockShowcase,
    PeacockPricingBlock: PeacockPricing,
    PeacockFeaturesBlock: PeacockFeatures,
    PeacockGiftCardsBlock: PeacockGiftCards,
    PeacockFaqBlock: PeacockFaq,
    PeacockExploreMoreBlock: PeacockExploreMore,
    // NOW TV mock homepage sections
    NowTvPromoBannerBlock: NowTvPromoBanner,
    NowTvMembershipsBlock: NowTvMemberships,
    NowTvSportsBlock: NowTvSports,
    NowTvEntertainmentBlock: NowTvEntertainment,
    NowTvCinemaBlock: NowTvCinema,
    NowTvFaqBlock: NowTvFaq,
    NowTvExploreMoreBlock: NowTvExploreMore,
  },
});
