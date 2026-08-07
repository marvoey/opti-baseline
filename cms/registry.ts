import {
  config,
  initContentTypeRegistry,
  initDisplayTemplateRegistry,
  BlankExperienceContentType,
  BlankSectionContentType,
} from '@optimizely/cms-sdk';
import { initReactComponentRegistry } from '@optimizely/cms-sdk/react/server';
import { requireEnv } from '@/lib/env';

import ExperiencePage, { ExperiencePageContentType } from './ExperiencePage';
import BlankSection from './BlankSection';
import Page, { PageContentType } from './Page';
import RichText, { RichTextContentType } from './RichText';
import DemoPhaseBlock, { DemoPhaseBlockContentType } from './DemoPhaseBlock';
import DemoScriptPage, { DemoScriptPageContentType } from './DemoScriptPage';

// SFA Modular Component System
import HeroBannerBlock, { HeroBannerBlockContentType } from './sfa/HeroBannerBlock';
import TwoColumnSplitBlock, { TwoColumnSplitBlockContentType } from './sfa/TwoColumnSplitBlock';
import AlertCalloutBlock, { AlertCalloutBlockContentType } from './sfa/AlertCalloutBlock';
import MetricCardBlock, { MetricCardBlockContentType } from './sfa/MetricCardBlock';
import DynamicCarouselBlock, { DynamicCarouselBlockContentType } from './sfa/DynamicCarouselBlock';
import IframeEmbedBlock, { IframeEmbedBlockContentType } from './sfa/IframeEmbedBlock';
import ImageGalleryBlock, { ImageGalleryBlockContentType } from './sfa/ImageGalleryBlock';
import MultiColumnGridContainer, { MultiColumnGridContainerContentType } from './sfa/MultiColumnGridContainer';

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
  ExperiencePageContentType,
  PageContentType,
  // Blocks
  RichTextContentType,
  DemoPhaseBlockContentType,
  // Pages
  DemoScriptPageContentType,
  // SFA Modular Component System
  HeroBannerBlockContentType,
  TwoColumnSplitBlockContentType,
  AlertCalloutBlockContentType,
  MetricCardBlockContentType,
  DynamicCarouselBlockContentType,
  IframeEmbedBlockContentType,
  ImageGalleryBlockContentType,
  MultiColumnGridContainerContentType,
];

initContentTypeRegistry(registeredContentTypes);

initDisplayTemplateRegistry([]);

initReactComponentRegistry({
  resolver: {
    // SDK-native experience type — same composition rendering as ExperiencePage.
    BlankExperience: ExperiencePage,
    BlankSection,
    ExperiencePage,
    Page,
    // Blocks (resolver key === content-type key)
    RichTextBlock: RichText,
    DemoPhaseBlock,
    DemoScriptPage,
    // SFA Modular Component System
    SFA_HeroBannerBlock: HeroBannerBlock,
    SFA_TwoColumnSplitBlock: TwoColumnSplitBlock,
    SFA_AlertCalloutBlock: AlertCalloutBlock,
    SFA_MetricCardBlock: MetricCardBlock,
    SFA_DynamicCarouselBlock: DynamicCarouselBlock,
    SFA_IframeEmbedBlock: IframeEmbedBlock,
    SFA_ImageGalleryBlock: ImageGalleryBlock,
    SFA_MultiColumnGridContainer: MultiColumnGridContainer,
  },
});
