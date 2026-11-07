/**
 * Liberty Mutual "Ask Liberty" component library — barrel file.
 *
 * Every component takes its text as props and defaults to the copy used in
 * public/use-case-1-ask-liberty.html. The header and footer live in
 * app/_components. IDs (C01…C33) match docs/ask-liberty-component-library.md.
 * Live examples: /demo/liberty-components
 */

// A. Page shell and navigation
export { default as AskBar } from './AskBar'; // C01
export { default as Breadcrumb } from './Breadcrumb'; // C02
export { default as TitleBlock } from './TitleBlock'; // C03
export { default as SectionHeading } from './SectionHeading'; // C04
export { default as AccentBar } from './AccentBar'; // C05

// B. Home-only
export { default as SearchHero } from './SearchHero'; // C06
export { default as SuggestedChips } from './SuggestedChips'; // C07
export { default as QuestionTileGrid } from './QuestionTileGrid'; // C08

// C. Answer content
export { default as AnswerBlock } from './AnswerBlock'; // C09
export { default as AnswerWithSidebar } from './AnswerWithSidebar'; // C10
export { default as CalloutPanel } from './CalloutPanel'; // C11
export { ChecklistItem, Checklist } from './ChecklistItem'; // C12
export { default as StepList } from './StepList'; // C13
export { default as CoverageTable } from './CoverageTable'; // C14
export { default as StatusIndicator } from './StatusIndicator'; // C15
export { default as FeatureCard, FeatureCardGrid } from './FeatureCard'; // C16
export { default as IconBadge } from './IconBadge'; // C17
export { default as StatCard, StatCardGrid } from './StatCard'; // C18
export { default as BenefitColumn, BenefitColumnGrid } from './BenefitColumn'; // C19
export { default as IllustrationBanner, Car, House, Tree } from './IllustrationBanner'; // C20

// D. Interactive and task
export { default as StateSelectorCard } from './StateSelectorCard'; // C21
export { default as StatePill } from './StatePill'; // C22
export { default as StateComparisonPanel } from './StateComparisonPanel'; // C23
export { default as AccountActionCard } from './AccountActionCard'; // C24
export { default as LookupFormFields } from './LookupFormFields'; // C25
export { default as HandoffBanner } from './HandoffBanner'; // C26
export { default as AnswerLinkCard, AnswerLinkCardGrid } from './AnswerLinkCard'; // C27

// E. Buttons and trust content
export { default as Button } from './Button'; // C28
export { default as SourcesBlock } from './SourcesBlock'; // C29
export { default as RelatedQuestions } from './RelatedQuestions'; // C30
export { default as HelpfulRow } from './HelpfulRow'; // C31

// F. Loading experience
export { default as AiProgressPanel } from './AiProgressPanel'; // C32
export { default as StagedReveal } from './StagedReveal'; // C33
export { default as StreamText } from './StreamText'; // used by C03 / C33

// Helpers
export { default as Anchor } from './Anchor';
export { LibertyIcon, CheckIcon, ICON_NAMES, type IconName } from './Icons';
export { safeHref } from './utils';
