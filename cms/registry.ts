import {
  config,
  initContentTypeRegistry,
  initDisplayTemplateRegistry,
} from '@optimizely/cms-sdk';
import { initReactComponentRegistry } from '@optimizely/cms-sdk/react/server';
import { requireEnv } from '@/lib/env';

import ExperiencePage, { ExperiencePageContentType } from './ExperiencePage';
import Page, { PageContentType } from './Page';
import Hero, { HeroContentType } from './Hero';
import RichText, { RichTextContentType } from './RichText';
import CibcHero, { CibcHeroContentType, CibcHeroDisplayTemplate } from './CibcHero';
import CibcAlertFeed, { CibcAlertContentType, CibcAlertFeedContentType } from './CibcAlertFeed';
import CibcAssetGrid, {
  CibcAssetCardContentType,
  CibcAssetGridContentType,
  CibcAssetGridDisplayTemplate,
} from './CibcAssetGrid';
import CibcOnboardingJourney, {
  CibcMilestoneContentType,
  CibcOnboardingJourneyContentType,
} from './CibcOnboardingJourney';
import CibcRegulatoryDirective, { CibcRegulatoryDirectiveContentType } from './CibcRegulatoryDirective';

// V1 atomic design system — primitives composed in the Visual Builder grid.
import V1Text, { V1TextContentType, V1TextDefault } from './V1Text';
import V1Button, { V1ButtonContentType, V1ButtonDefault } from './V1Button';
import V1Image, { V1ImageContentType, V1ImageDefault } from './V1Image';
import V1Icon, { V1IconContentType, V1IconDefault } from './V1Icon';
import V1Divider, { V1DividerContentType, V1DividerDefault } from './V1Divider';
import V1Section, { V1SectionContentType, V1SectionDefault } from './V1Section';
import { V1RowDefault, V1ColumnDefault } from './gridContainers';

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
  // CIBC leaf items (held inline by their parent section block).
  CibcAlertContentType,
  CibcAssetCardContentType,
  CibcMilestoneContentType,
  // CIBC section blocks.
  CibcHeroContentType,
  CibcAlertFeedContentType,
  CibcAssetGridContentType,
  CibcOnboardingJourneyContentType,
  CibcRegulatoryDirectiveContentType,
  // V1 atomic design system: composition shell + atoms.
  V1SectionContentType,
  V1TextContentType,
  V1ButtonContentType,
  V1ImageContentType,
  V1IconContentType,
  V1DividerContentType,
];

initContentTypeRegistry(registeredContentTypes);

initDisplayTemplateRegistry([
  CibcHeroDisplayTemplate,
  CibcAssetGridDisplayTemplate,
  // V1 atomic design system. Row/Column target structural nodeTypes; the rest
  // target their content type.
  V1SectionDefault,
  V1RowDefault,
  V1ColumnDefault,
  V1TextDefault,
  V1ButtonDefault,
  V1ImageDefault,
  V1IconDefault,
  V1DividerDefault,
]);

initReactComponentRegistry({
  resolver: {
    ExperiencePage,
    Page,
    // Blocks (resolver key === content-type key)
    HeroBlock: Hero,
    RichTextBlock: RichText,
    // CIBC section blocks. Leaf items (CibcAlert, CibcAssetCard, CibcMilestone)
    // are rendered inline by their parent block, so they need no entry here.
    CibcHero,
    CibcAlertFeed,
    CibcAssetGrid,
    CibcOnboardingJourney,
    CibcRegulatoryDirective,
    // V1 atomic design system. V1Row/V1Column are NOT here — they're passed
    // directly to OptimizelyGridSection by V1Section, not resolved by key.
    V1Section,
    V1Text,
    V1Button,
    V1Image,
    V1Icon,
    V1Divider,
  },
});
