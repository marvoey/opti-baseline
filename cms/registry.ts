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
import AskLibertyExperience, {
  AskLibertyExperienceContentType,
  LibAskQuestionContentType,
} from './liberty/AskLibertyExperience';
import LibAskQuestionBlock from './liberty/LibAskQuestionBlock';
import { libShellTypes, libShellRenderers } from './liberty/LibShell';
import { libAnswerTypes, libAnswerRenderers } from './liberty/LibAnswer';
import { libTaskTypes, libTaskRenderers } from './liberty/LibTask';
import LibSourcesBlock, { LibSourcesBlockContentType, LibSourceContentType } from './liberty/LibSourcesBlock';
import AgentPriorityBlock, { AgentPriorityContentType } from './agent/AgentPriority';
import AgentPriorities, { AgentPrioritiesContentType } from './agent/AgentPriorities';
import AgentDashboardExperience, { AgentDashboardExperienceContentType } from './agent/AgentDashboardExperience';
import AgentPriorityCards, { AgentPriorityCardsContentType } from './agent/AgentPriorityCards';
import AgentPortal, { AgentPortalContentType } from './agent/AgentPortal';
import AgentProductExperience, { AgentProductExperienceContentType } from './agent/AgentProductExperience';
import { agentBlockTypes, agentBlockRenderers } from './agent/AgentBlocks';
import AgentDisclosure, { AgentDisclosureContentType, AgentDisclosureChannelTemplate } from './agent/AgentDisclosure';
import AgentRenewalsCard, { AgentRenewalsCardContentType } from './agent/AgentRenewalsCard';

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
  // Liberty (Ask Liberty) blocks — all section-enabled, keys prefixed `Lib`
  LibSourceContentType,
  LibSourcesBlockContentType,
  LibAskQuestionContentType,
  AskLibertyExperienceContentType,
  ...libShellTypes,
  ...libAnswerTypes,
  ...libTaskTypes,
  // Independent Agent Portal (use case 2) — keys prefixed `Agent`
  AgentPriorityContentType,
  AgentPrioritiesContentType,
  AgentDashboardExperienceContentType,
  AgentPriorityCardsContentType,
  AgentPortalContentType,
  AgentProductExperienceContentType,
  AgentDisclosureContentType,
  AgentRenewalsCardContentType,
  ...agentBlockTypes,
];

initContentTypeRegistry(registeredContentTypes);

initDisplayTemplateRegistry([AgentDisclosureChannelTemplate]);

initReactComponentRegistry({
  resolver: {
    BlankExperience,
    BlankSection,
    Page,
    // Blocks (resolver key === content-type key)
    RichTextBlock: RichText,
    LibSourcesBlock,
    LibAskQuestion: LibAskQuestionBlock,
    AskLibertyExperience,
    AgentPriority: AgentPriorityBlock,
    AgentPriorities,
    AgentDashboardExperience,
    AgentPriorityCards,
    AgentPortal,
    AgentProductExperience,
    AgentDisclosure,
    AgentRenewalsCard,
    ...agentBlockRenderers,
    ...libShellRenderers,
    ...libAnswerRenderers,
    ...libTaskRenderers,
  },
});
