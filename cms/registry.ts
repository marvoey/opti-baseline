import {
  config,
  initContentTypeRegistry,
  initDisplayTemplateRegistry,
} from '@optimizely/cms-sdk';
import { initReactComponentRegistry } from '@optimizely/cms-sdk/react/server';
import { requireEnv } from '@/lib/env';

import BlankExperience, { BlankExperienceContentType } from './BlankExperience';
import BlankSection, { BlankSectionCustomDisplayTemplate } from './BlankSection';
import Paragraph, { ParagraphContentType, ParagraphDisplayTemplate, ParagraphSimpleDisplayTemplate } from './BasicBlocks/Paragraph';
import CardBlock, { CardBlockContentType } from './BasicBlocks/CardBlock';
import ActionBlock, { ActionBlockContentType } from './BasicBlocks/ActionBlock';
import ComplianceBlock, { ComplianceBlockContentType } from './BasicBlocks/ComplianceBlock';
import SidebarSection, { SidebarSectionContentType } from './SidebarSection';
import SplitSection, { SplitSectionContentType } from './SplitSection';
import HeroSection, { HeroSectionContentType, HeroSectionDisplayTemplate } from './HeroSection';
import FeedSection, { FeedSectionContentType } from './FeedSection';
import ImageBlock, { ImageContentType, ImageDisplayTemplate } from './Image';
import HeroBlock, { HeroBlockContentType, HeroBlockDisplayTemplate } from './BasicBlocks/HeroBlock';
import MainNavBlock, { MainNavContentType } from './BasicBlocks/MainNav';
import { ColumnDisplayTemplate } from './ColumnTemplate';
import AdminPage, { AdminPageContentType } from './AdminPage';
import SharedCard, { SharedCardContentType } from './BasicBlocks/SharedCard';

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
  BlankExperienceContentType,
  ParagraphContentType,
  CardBlockContentType,
  ActionBlockContentType,
  ComplianceBlockContentType,
  SidebarSectionContentType,
  SplitSectionContentType,
  HeroSectionContentType,
  FeedSectionContentType,
  ImageContentType,
  HeroBlockContentType,
  MainNavContentType,
  AdminPageContentType,
  SharedCardContentType,
];

initContentTypeRegistry(registeredContentTypes);

initDisplayTemplateRegistry([ParagraphDisplayTemplate, ParagraphSimpleDisplayTemplate, ImageDisplayTemplate, ColumnDisplayTemplate, HeroBlockDisplayTemplate, HeroSectionDisplayTemplate, BlankSectionCustomDisplayTemplate]);

initReactComponentRegistry({
  resolver: {
    BlankExperience,
    BlankSection,
    Paragraph,
    CardBlock,
    ActionBlock,
    ComplianceBlock,
    SidebarSection,
    SplitSection,
    HeroSection,
    FeedSection,
    Image: ImageBlock,
    HeroBlockv2: HeroBlock,
    MainNav: MainNavBlock,
    AdminPage,
    SharedCard,
  },
});
