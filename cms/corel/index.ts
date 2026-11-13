// Single index of everything Corel: the content types to register/push and the
// content-type-key → React component map. Imported by cms/registry.ts.
//
// `.ts` (not `.tsx`) so the `./cms/**/*.tsx` push glob does not scan it.

import { CorelExperience, CorelExperienceContentType } from './CorelExperience';
import { corelItemContentTypes } from './items';
import {
  CorelCtaBanner,
  CorelCtaBannerContentType,
  CorelHeroSplit,
  CorelHeroSplitContentType,
  CorelPageBanner,
  CorelPageBannerContentType,
  CorelProductHero,
  CorelProductHeroContentType,
  CorelSplitCta,
  CorelSplitCtaContentType,
  CorelTrialHero,
  CorelTrialHeroContentType,
} from './heroes';
import {
  CorelComparisonTable,
  CorelComparisonTableContentType,
  CorelOfferCards,
  CorelOfferCardsContentType,
  CorelTierCards,
  CorelTierCardsContentType,
} from './commerce';
import {
  CorelAwardsStrip,
  CorelAwardsStripContentType,
  CorelGalleryGrid,
  CorelGalleryGridContentType,
  CorelLogoMarquee,
  CorelLogoMarqueeContentType,
  CorelRatings,
  CorelRatingsContentType,
  CorelTestimonialCarousel,
  CorelTestimonialCarouselContentType,
} from './proof';
import {
  CorelAppGrid,
  CorelAppGridContentType,
  CorelCardCarousel,
  CorelCardCarouselContentType,
  CorelCardGrid,
  CorelCardGridContentType,
  CorelFaqAccordion,
  CorelFaqAccordionContentType,
  CorelFeatureSpotlight,
  CorelFeatureSpotlightContentType,
  CorelIncludedApps,
  CorelIncludedAppsContentType,
  CorelIntroSplit,
  CorelIntroSplitContentType,
  CorelSubNav,
  CorelSubNavContentType,
  CorelTechSpecs,
  CorelTechSpecsContentType,
} from './product';
import {
  CorelAnnouncements,
  CorelAnnouncementsContentType,
  CorelContactOptions,
  CorelContactOptionsContentType,
  CorelIconLinkCards,
  CorelIconLinkCardsContentType,
} from './support';

/** Page type + section blocks + item components (items listed last). */
export const corelContentTypes = [
  CorelExperienceContentType,
  // Blocks
  CorelHeroSplitContentType,
  CorelPageBannerContentType,
  CorelProductHeroContentType,
  CorelTrialHeroContentType,
  CorelSplitCtaContentType,
  CorelCtaBannerContentType,
  CorelTierCardsContentType,
  CorelOfferCardsContentType,
  CorelComparisonTableContentType,
  CorelTestimonialCarouselContentType,
  CorelLogoMarqueeContentType,
  CorelAwardsStripContentType,
  CorelGalleryGridContentType,
  CorelRatingsContentType,
  CorelSubNavContentType,
  CorelIntroSplitContentType,
  CorelAppGridContentType,
  CorelIncludedAppsContentType,
  CorelCardGridContentType,
  CorelCardCarouselContentType,
  CorelFeatureSpotlightContentType,
  CorelFaqAccordionContentType,
  CorelTechSpecsContentType,
  CorelIconLinkCardsContentType,
  CorelAnnouncementsContentType,
  CorelContactOptionsContentType,
  // Items
  ...corelItemContentTypes,
];

/** Resolver entries: content-type key → component. Items are data, not rendered directly. */
export const corelResolver = {
  CorelExperience,
  CorelHeroSplit,
  CorelPageBanner,
  CorelProductHero,
  CorelTrialHero,
  CorelSplitCta,
  CorelCtaBanner,
  CorelTierCards,
  CorelOfferCards,
  CorelComparisonTable,
  CorelTestimonialCarousel,
  CorelLogoMarquee,
  CorelAwardsStrip,
  CorelGalleryGrid,
  CorelRatings,
  CorelSubNav,
  CorelIntroSplit,
  CorelAppGrid,
  CorelIncludedApps,
  CorelCardGrid,
  CorelCardCarousel,
  CorelFeatureSpotlight,
  CorelFaqAccordion,
  CorelTechSpecs,
  CorelIconLinkCards,
  CorelAnnouncements,
  CorelContactOptions,
};
