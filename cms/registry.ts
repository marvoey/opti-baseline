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
import Hero, { HeroContentType } from './Hero';
import RichText, { RichTextContentType } from './RichText';
import ArticleCard, { ArticleCardContentType } from './ArticleCardBlock';
import MainBody, { MainBodyContentType } from './MainBodyBlock';
import CardContainer, { CardContainerContentType } from './CardContainerBlock';

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
  ExperiencePageContentType,
  PageContentType,
  // Blocks
  HeroContentType,
  RichTextContentType,
  ArticleCardContentType,
  MainBodyContentType,
  CardContainerContentType,
];

// BlankExperience and BlankSection are SDK built-ins — not pushed to the CMS
// (the CLI's filterOutBuiltinTypes strips them), but must be registered so
// getPreviewContent() can resolve them during Visual Builder preview.
initContentTypeRegistry([
  ...registeredContentTypes,
  BlankExperienceContentType,
  BlankSectionContentType,
]);

initDisplayTemplateRegistry([]);

initReactComponentRegistry({
  resolver: {
    // SDK built-ins
    BlankExperience: ExperiencePage,
    BlankSection,
    ExperiencePage,
    Page,
    // Blocks (resolver key === content-type key)
    HeroBlock: Hero,
    RichTextBlock: RichText,
    ArticleCardBlock: ArticleCard,
    MainBodyBlock: MainBody,
    CardContainerBlock: CardContainer,
  },
});
