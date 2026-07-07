import {
  config,
  initContentTypeRegistry,
  initDisplayTemplateRegistry,
} from '@optimizely/cms-sdk';
import { initReactComponentRegistry } from '@optimizely/cms-sdk/react/server';
import { requireEnv } from '@/lib/env';

import ExperiencePage, { ExperiencePageContentType } from './ExperiencePage';
import Page, { PageContentType } from './Page';
import RichText, { RichTextContentType } from './RichText';
import MediaBlock, { MediaBlockContentType } from './MediaBlock';
import ActionBlock, { ActionBlockContentType } from './ActionBlock';
import { NavigationNodeContentType } from './NavigationNode';
import WayfindingBlock, { WayfindingBlockContentType } from './WayfindingBlock';
import CardBlock, { CardBlockContentType } from './CardBlock';

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
  RichTextContentType,
  MediaBlockContentType,
  ActionBlockContentType,
  NavigationNodeContentType,
  WayfindingBlockContentType,
  CardBlockContentType,
];

initContentTypeRegistry(registeredContentTypes);

initDisplayTemplateRegistry([]);

initReactComponentRegistry({
  resolver: {
    ExperiencePage,
    Page,
    // Blocks (resolver key === content-type key)
    ProseBlock: RichText,
    MediaBlock,
    ActionBlock,
    WayfindingBlock,
    CardBlock,
  },
});
