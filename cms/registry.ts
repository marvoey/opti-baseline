import {
  config,
  initContentTypeRegistry,
  initDisplayTemplateRegistry,
  BlankSectionContentType,
} from '@optimizely/cms-sdk';
import { initReactComponentRegistry } from '@optimizely/cms-sdk/react/server';
import { requireEnv } from '@/lib/env';

import BlankExperience, { BlankExperienceContentType } from './BlankExperience';
import BlankSection from './BlankSection';
import Page, { PageContentType } from './Page';
import RichText, { RichTextContentType } from './RichText';
import PromoBannerBlock, { PromoBannerBlockContentType } from './PromoBannerBlock';
import HeroBlock, { HeroBlockContentType } from './HeroBlock';
import ShopByRoom, { ShopByRoomContentType } from './ShopByRoom';
import ShopByCategory, { ShopByCategoryContentType } from './ShopByCategory';
import ProductGrid, { ProductGridContentType } from './ProductGrid';
import Breadcrumb, { BreadcrumbContentType } from './Breadcrumb';
import PDPView, { PDPViewContentType } from './PDPView';

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
  PromoBannerBlockContentType,
  HeroBlockContentType,
  ShopByRoomContentType,
  ShopByCategoryContentType,
  ProductGridContentType,
  BreadcrumbContentType,
  PDPViewContentType,
];

initContentTypeRegistry(registeredContentTypes);

initDisplayTemplateRegistry([]);

initReactComponentRegistry({
  resolver: {
    BlankExperience,
    BlankSection,
    Page,
    // Blocks (resolver key === content-type key)
    RichTextBlock: RichText,
    PromoBannerBlock,
    HeroBlock,
    ShopByRoom,
    ShopByCategory,
    ProductGrid,
    Breadcrumb,
    PDPView,
  },
});
