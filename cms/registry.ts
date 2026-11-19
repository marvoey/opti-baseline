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
import BlankSection, { EhSectionStyle } from './BlankSection';
import Page, { PageContentType } from './Page';
import RichText, { RichTextContentType } from './RichText';
import EhHero, { EhHeroContentType } from './EhHero';
import EhPlanFinder, { EhPlanFinderContentType } from './EhPlanFinder';
import EhCarrierLogos, { EhCarrierLogosContentType } from './EhCarrierLogos';
import EhFeatureRow, { EhFeatureRowContentType } from './EhFeatureRow';
import EhTestimonial, { EhTestimonialContentType } from './EhTestimonial';
import EhTestimonials, { EhTestimonialsContentType } from './EhTestimonials';
import EhCoverageCard, { EhCoverageCardContentType } from './EhCoverageCard';
import EhCoverageGrid, { EhCoverageGridContentType } from './EhCoverageGrid';
import EhSavingsBand, { EhSavingsBandContentType } from './EhSavingsBand';
import EhLiveAdvise, { EhLiveAdviseContentType } from './EhLiveAdvise';
import EhStepsBand, { EhStepsBandContentType } from './EhStepsBand';
import EhReviews, { EhReviewsContentType } from './EhReviews';
import EhSiteSettings, { EhSiteSettingsContentType } from './EhSiteSettings';
import EhFaq, { EhFaqContentType } from './EhFaq';

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
  PageContentType,
  // Blocks
  RichTextContentType,
  // eHealth blocks
  EhHeroContentType,
  EhPlanFinderContentType,
  EhCarrierLogosContentType,
  EhFeatureRowContentType,
  EhTestimonialContentType,
  EhTestimonialsContentType,
  EhCoverageCardContentType,
  EhCoverageGridContentType,
  EhSavingsBandContentType,
  EhLiveAdviseContentType,
  EhStepsBandContentType,
  EhReviewsContentType,
  EhFaqContentType,
  // Site-wide settings item (banner, phone, legal line). The site chrome reads it through
  // lib/siteSettings.ts; the component only renders it when previewed in the CMS.
  EhSiteSettingsContentType,
];

initContentTypeRegistry(registeredContentTypes);

initDisplayTemplateRegistry([EhSectionStyle]);

initReactComponentRegistry({
  resolver: {
    BlankExperience,
    BlankSection,
    Page,
    // Blocks (resolver key === content-type key)
    RichTextBlock: RichText,
    EhHero,
    EhPlanFinder,
    EhCarrierLogos,
    EhFeatureRow,
    EhTestimonial,
    EhTestimonials,
    EhCoverageCard,
    EhCoverageGrid,
    EhSavingsBand,
    EhLiveAdvise,
    EhStepsBand,
    EhReviews,
    EhFaq,
    EhSiteSettings,
  },
});
