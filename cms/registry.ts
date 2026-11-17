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
import Page, { PageContentType } from './Page';
import RichText, { RichTextContentType } from './RichText';
import HrbArticleCard, { HrbArticleCardContentType } from './hrb/ArticleCard';
import HrbArticleList, { HrbArticleListContentType } from './hrb/ArticleList';
import HrbCallout, { HrbCalloutContentType } from './hrb/Callout';
import HrbCategoryNav, { HrbCategoryNavContentType } from './hrb/CategoryNav';
import HrbComplianceDisclosure, { HrbComplianceDisclosureContentType } from './hrb/ComplianceDisclosure';
import HrbCtaBanner, { HrbCtaBannerContentType, HrbCtaBannerDisplayTemplate } from './hrb/CtaBanner';
import HrbGuaranteeItem, { HrbGuaranteeItemContentType } from './hrb/GuaranteeItem';
import HrbGuarantees, { HrbGuaranteesContentType } from './hrb/Guarantees';
import HrbHero, { HrbHeroContentType, HrbHeroDisplayTemplate } from './hrb/Hero';
import HrbLandingExperience, { HrbLandingExperienceContentType } from './hrb/LandingExperience';
import HrbLinkItem, { HrbLinkItemContentType } from './hrb/LinkItem';
import HrbOfferCard, { HrbOfferCardContentType, HrbOfferCardDisplayTemplate } from './hrb/OfferCard';
import HrbOfficeCard, { HrbOfficeCardContentType } from './hrb/OfficeCard';
import HrbOfficeFinder, { HrbOfficeFinderContentType } from './hrb/OfficeFinder';
import HrbQuickLinks, { HrbQuickLinksContentType } from './hrb/QuickLinks';
import HrbSection, { HrbSectionContentType, HrbSectionDisplayTemplate } from './hrb/Section';
import HrbSectionHeading, { HrbSectionHeadingContentType } from './hrb/SectionHeading';
import HrbStatItem, { HrbStatItemContentType } from './hrb/StatItem';
import HrbTaxCenterCategoryPage, { HrbTaxCenterCategoryPageContentType } from './hrb/TaxCenterCategoryPage';
import HrbTrustBar, { HrbTrustBarContentType } from './hrb/TrustBar';

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
  // [HRB] — H&R Block demo types (keys HRB_*)
  HrbArticleCardContentType,
  HrbArticleListContentType,
  HrbCalloutContentType,
  HrbCategoryNavContentType,
  HrbComplianceDisclosureContentType,
  HrbCtaBannerContentType,
  HrbGuaranteeItemContentType,
  HrbGuaranteesContentType,
  HrbHeroContentType,
  HrbLandingExperienceContentType,
  HrbLinkItemContentType,
  HrbOfferCardContentType,
  HrbOfficeCardContentType,
  HrbOfficeFinderContentType,
  HrbQuickLinksContentType,
  HrbSectionContentType,
  HrbSectionHeadingContentType,
  HrbStatItemContentType,
  HrbTaxCenterCategoryPageContentType,
  HrbTrustBarContentType,
];

initContentTypeRegistry(registeredContentTypes);

initDisplayTemplateRegistry([
  HrbCtaBannerDisplayTemplate,
  HrbHeroDisplayTemplate,
  HrbOfferCardDisplayTemplate,
  HrbSectionDisplayTemplate,
]);

initReactComponentRegistry({
  resolver: {
    BlankExperience,
    BlankSection,
    Page,
    // Blocks (resolver key === content-type key)
    RichTextBlock: RichText,
    // [HRB] (resolver key === content-type key)
    HRB_ArticleCard: HrbArticleCard,
    HRB_ArticleList: HrbArticleList,
    HRB_Callout: HrbCallout,
    HRB_CategoryNav: HrbCategoryNav,
    HRB_ComplianceDisclosure: HrbComplianceDisclosure,
    HRB_CtaBanner: HrbCtaBanner,
    HRB_GuaranteeItem: HrbGuaranteeItem,
    HRB_Guarantees: HrbGuarantees,
    HRB_Hero: HrbHero,
    HRB_LandingExperience: HrbLandingExperience,
    HRB_LinkItem: HrbLinkItem,
    HRB_OfferCard: HrbOfferCard,
    HRB_OfficeCard: HrbOfficeCard,
    HRB_OfficeFinder: HrbOfficeFinder,
    HRB_QuickLinks: HrbQuickLinks,
    HRB_Section: HrbSection,
    HRB_SectionHeading: HrbSectionHeading,
    HRB_StatItem: HrbStatItem,
    HRB_TaxCenterCategoryPage: HrbTaxCenterCategoryPage,
    HRB_TrustBar: HrbTrustBar,
  },
});
