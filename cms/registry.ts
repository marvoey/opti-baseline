import {
  config,
  initContentTypeRegistry,
  initDisplayTemplateRegistry,
  BlankExperienceContentType,
  BlankSectionContentType,
} from '@optimizely/cms-sdk';
import { initReactComponentRegistry } from '@optimizely/cms-sdk/react/server';
import { requireEnv } from '@/lib/env';

import AllArticles, { AllArticlesContentType, AllArticlesDisplayTemplate } from './AllArticles';
import ArticlePage, { ArticlePageContentType } from './ArticlePage';
import FeaturedArticles, { FeaturedArticlesContentType, FeaturedArticlesDisplayTemplate } from './FeaturedArticles';
import ExperiencePage, { ExperiencePageContentType } from './ExperiencePage';
import BlankSection from './BlankSection';
import Page, { PageContentType } from './Page';
import RichText, { RichTextContentType } from './RichText';
import HeroBlock, { HeroBlockContentType } from './HeroBlock';
import LoginForm, { LoginFormContentType, LoginFormDisplayTemplate } from './LoginForm';
import ExistingLoanCalculator, { ExistingLoanCalculatorContentType, ExistingLoanCalculatorDisplayTemplate } from './ExistingLoanCalculator';
import PayoffCalculator, { PayoffCalculatorContentType, PayoffCalculatorDisplayTemplate } from './PayoffCalculator';
import PersonalizedHero, { PersonalizedHeroContentType, PersonalizedHeroDisplayTemplate } from './PersonalizedHero';
import Experiment, { ExperimentContentType, ExperimentDisplayTemplate } from './Experiment';
import BrandColorPalette, { BrandColorPaletteContentType, BrandColorPaletteDisplayTemplate } from './BrandColorPalette';
import BrandTypography, { BrandTypographyContentType, BrandTypographyDisplayTemplate } from './BrandTypography';
import BrandButtons, { BrandButtonsContentType, BrandButtonsDisplayTemplate } from './BrandButtons';
import BrandLogos, { BrandLogosContentType, BrandLogosDisplayTemplate } from './BrandLogos';
import SharedContent, { SharedContentContentType, SharedContentDisplayTemplate } from './SharedContent';
import { SectionRowDisplayTemplate } from './SectionRow';
import { SectionColumnDisplayTemplate } from './SectionColumn';

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
  ArticlePageContentType,
  BlankExperienceContentType,
  BlankSectionContentType,
  ExperiencePageContentType,
  PageContentType,
  // Blocks
  AllArticlesContentType,
  BrandColorPaletteContentType,
  BrandTypographyContentType,
  BrandButtonsContentType,
  BrandLogosContentType,
  ExistingLoanCalculatorContentType,
  ExperimentContentType,
  FeaturedArticlesContentType,
  HeroBlockContentType,
  PayoffCalculatorContentType,
  PersonalizedHeroContentType,
  LoginFormContentType,
  RichTextContentType,
  SharedContentContentType,
];

initContentTypeRegistry(registeredContentTypes);

initDisplayTemplateRegistry([AllArticlesDisplayTemplate, BrandColorPaletteDisplayTemplate, BrandTypographyDisplayTemplate, BrandButtonsDisplayTemplate, BrandLogosDisplayTemplate, ExperimentDisplayTemplate, ExistingLoanCalculatorDisplayTemplate, FeaturedArticlesDisplayTemplate, LoginFormDisplayTemplate, PayoffCalculatorDisplayTemplate, PersonalizedHeroDisplayTemplate, SharedContentDisplayTemplate, SectionRowDisplayTemplate, SectionColumnDisplayTemplate]);

initReactComponentRegistry({
  resolver: {
    // SDK-native experience type — same composition rendering as ExperiencePage.
    ArticlePage,
    BlankExperience: ExperiencePage,
    BlankSection,
    ExperiencePage,
    Page,
    // Blocks (resolver key === content-type key)
    AllArticles,
    BrandColorPalette,
    BrandTypography,
    BrandButtons,
    BrandLogos,
    Experiment,
    ExistingLoanCalculator,
    FeaturedArticles,
    HeroBlock,
    PayoffCalculator,
    PersonalizedHero,
    LoginForm,
    RichTextBlock: RichText,
    SharedContent,
  },
});
