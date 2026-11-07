import type { Metadata } from 'next';

/**
 * Index of every Liberty component shown under /demo/liberty-components.
 * IDs match docs/ask-liberty-component-library.md. Each entry's `slug` is its
 * route: /demo/liberty-components/<slug>.
 */
export type ComponentEntry = {
  slug: string;
  id: string;
  title: string;
  group: string;
  description: string;
  /** Which Ask Liberty pages use it (0 Home … 7 Legal). */
  usedOn: string;
  /** File in app/_components_liberty/. */
  source: string;
};

export const GROUPS = [
  'Page shell and navigation',
  'Home page',
  'Answer content',
  'Interactive and task',
  'Buttons and trust content',
  'Loading experience',
] as const;

export const COMPONENTS: ComponentEntry[] = [
  // A. Page shell and navigation
  {
    slug: 'ask-bar',
    id: 'C01',
    title: 'Ask bar',
    group: GROUPS[0],
    description:
      'Grey strip at the top of every answer page, pre-filled with the question being answered. A plain GET form, so Enter and the button both work without JavaScript.',
    usedOn: 'Pages 1–7',
    source: 'AskBar.tsx',
  },
  {
    slug: 'breadcrumb',
    id: 'C02',
    title: 'Breadcrumb',
    group: GROUPS[0],
    description: 'Small "Answers › Section › Topic" trail under the ask bar. The last item is the current page.',
    usedOn: 'Pages 1–7',
    source: 'Breadcrumb.tsx',
  },
  {
    slug: 'title-block',
    id: 'C03',
    title: 'Title block',
    group: GROUPS[0],
    description:
      'Centred H1 and lead paragraph. Can show a pill above the headline (Texas page), buttons below the lead (legal page), and stream the lead word by word.',
    usedOn: 'Pages 1–7',
    source: 'TitleBlock.tsx',
  },
  {
    slug: 'section-heading',
    id: 'C04',
    title: 'Section heading',
    group: GROUPS[0],
    description: 'Centred light H2 with an optional grey supporting paragraph. Introduces a block of content.',
    usedOn: 'Pages 0–7',
    source: 'SectionHeading.tsx',
  },
  {
    slug: 'accent-bar',
    id: 'C05',
    title: 'Accent bar',
    group: GROUPS[0],
    description: 'The short yellow rule under headings. 44px × 4px. Used on its own and inside other components.',
    usedOn: 'Pages 1–5',
    source: 'AccentBar.tsx',
  },

  // B. Home page
  {
    slug: 'search-hero',
    id: 'C06',
    title: 'Search hero',
    group: GROUPS[1],
    description: 'Home page hero: headline, subtitle and a large pill search box. Accepts children for the chips below.',
    usedOn: 'Page 0',
    source: 'SearchHero.tsx',
  },
  {
    slug: 'suggested-chips',
    id: 'C07',
    title: 'Suggested chips',
    group: GROUPS[1],
    description: 'Row of outlined pill links offering one-click example questions.',
    usedOn: 'Page 0',
    source: 'SuggestedChips.tsx',
  },
  {
    slug: 'question-tile-grid',
    id: 'C08',
    title: 'Question tile grid',
    group: GROUPS[1],
    description: 'Grey band with a heading and a 3-column grid of popular-question tiles.',
    usedOn: 'Page 0',
    source: 'QuestionTileGrid.tsx',
  },

  // C. Answer content
  {
    slug: 'answer-block',
    id: 'C09',
    title: 'Answer block',
    group: GROUPS[2],
    description: 'The main explanation: two-tone heading (bold then light), accent bar and paragraphs.',
    usedOn: 'Pages 1–5',
    source: 'AnswerBlock.tsx',
  },
  {
    slug: 'answer-with-sidebar',
    id: 'C10',
    title: 'Answer with sidebar',
    group: GROUPS[2],
    description: 'Two-column layout: flexible answer on the left, 340px callout on the right. Stacks on mobile.',
    usedOn: 'Pages 1–5',
    source: 'AnswerWithSidebar.tsx',
  },
  {
    slug: 'callout-panel',
    id: 'C11',
    title: 'Callout panel',
    group: GROUPS[2],
    description: 'Cream side panel with four bodies: checklist, text with link, numbered steps, and a link list.',
    usedOn: 'Pages 1–5',
    source: 'CalloutPanel.tsx',
  },
  {
    slug: 'checklist-item',
    id: 'C12',
    title: 'Checklist item',
    group: GROUPS[2],
    description: 'One checklist line with a teal check icon. Also ships a <Checklist /> wrapper for a whole list.',
    usedOn: 'Pages 1, 3, 4',
    source: 'ChecklistItem.tsx',
  },
  {
    slug: 'step-list',
    id: 'C13',
    title: 'Step list',
    group: GROUPS[2],
    description: 'Numbered "what to do now" list with navy number circles.',
    usedOn: 'Page 4',
    source: 'StepList.tsx',
  },
  {
    slug: 'coverage-table',
    id: 'C14',
    title: 'Coverage table',
    group: GROUPS[2],
    description: 'Three-column comparison table (coverage, real-life example, outcome) with striped rows.',
    usedOn: 'Pages 1, 4',
    source: 'CoverageTable.tsx',
  },
  {
    slug: 'status-indicator',
    id: 'C15',
    title: 'Status indicator',
    group: GROUPS[2],
    description: 'The outcome in a coverage table: a check with text, a teal pill, or a grey pill.',
    usedOn: 'Pages 1, 4',
    source: 'StatusIndicator.tsx',
  },
  {
    slug: 'feature-card',
    id: 'C16',
    title: 'Feature card',
    group: GROUPS[2],
    description: 'Cream card with optional icon, title, description and link. Used as a row of three.',
    usedOn: 'Pages 2, 4, 5, 6',
    source: 'FeatureCard.tsx',
  },
  {
    slug: 'icon-badge',
    id: 'C17',
    title: 'Icon badge',
    group: GROUPS[2],
    description: 'Circle with a teal line icon. Three sizes and two background tones.',
    usedOn: 'Pages 2, 4, 5, 7',
    source: 'IconBadge.tsx',
  },
  {
    slug: 'stat-card',
    id: 'C18',
    title: 'Stat card',
    group: GROUPS[2],
    description: 'Bordered card with a large light figure, accent bar and caption.',
    usedOn: 'Page 3',
    source: 'StatCard.tsx',
  },
  {
    slug: 'benefit-column',
    id: 'C19',
    title: 'Benefit column',
    group: GROUPS[2],
    description: 'Short selling point: title, accent bar and paragraph, with no card background.',
    usedOn: 'Page 5',
    source: 'BenefitColumn.tsx',
  },
  {
    slug: 'illustration-banner',
    id: 'C20',
    title: 'Illustration banner',
    group: GROUPS[2],
    description: 'Wide rounded SVG scene that sets the topic: road, house or family.',
    usedOn: 'Pages 0, 1, 4, 5',
    source: 'IllustrationBanner.tsx',
  },

  // D. Interactive and task
  {
    slug: 'state-selector-card',
    id: 'C21',
    title: 'State selector card',
    group: GROUPS[3],
    description:
      'Asks the visitor for the one missing detail. A real GET form: the dropdown and each state button submit a `state` value.',
    usedOn: 'Page 2',
    source: 'StateSelectorCard.tsx',
  },
  {
    slug: 'state-pill',
    id: 'C22',
    title: 'State pill',
    group: GROUPS[3],
    description: 'Mist pill showing the chosen state with a "Change state" action.',
    usedOn: 'Page 3',
    source: 'StatePill.tsx',
  },
  {
    slug: 'state-comparison-panel',
    id: 'C23',
    title: 'State comparison panel',
    group: GROUPS[3],
    description: 'Grey panel inviting comparison with nearby states.',
    usedOn: 'Page 3',
    source: 'StateComparisonPanel.tsx',
  },
  {
    slug: 'account-action-card',
    id: 'C24',
    title: 'Account action card',
    group: GROUPS[3],
    description: 'Large rounded card offering a secure route to claim details: log in, or look up a claim.',
    usedOn: 'Page 6',
    source: 'AccountActionCard.tsx',
  },
  {
    slug: 'lookup-form-fields',
    id: 'C25',
    title: 'Look-up form fields',
    group: GROUPS[3],
    description: 'Claim number, last name and ZIP fields. Place them inside your own form.',
    usedOn: 'Page 6',
    source: 'LookupFormFields.tsx',
  },
  {
    slug: 'handoff-banner',
    id: 'C26',
    title: 'Handoff banner',
    group: GROUPS[3],
    description: 'Mist banner that redirects an out-of-scope question to real help.',
    usedOn: 'Page 7',
    source: 'HandoffBanner.tsx',
  },
  {
    slug: 'answer-link-card',
    id: 'C27',
    title: 'Answer link card',
    group: GROUPS[3],
    description: 'Whole-card link to an approved answer: category, title, description.',
    usedOn: 'Page 7',
    source: 'AnswerLinkCard.tsx',
  },

  // E. Buttons and trust content
  {
    slug: 'buttons',
    id: 'C28',
    title: 'Buttons',
    group: GROUPS[4],
    description: 'The button family: solid teal, teal outline and navy. Renders a link when given an href.',
    usedOn: 'Pages 1, 2, 4, 6, 7',
    source: 'Button.tsx',
  },
  {
    slug: 'sources-block',
    id: 'C29',
    title: 'Sources block',
    group: GROUPS[4],
    description: 'Numbered sources with quotes, plus the legal disclaimer.',
    usedOn: 'Pages 1, 3, 4, 5',
    source: 'SourcesBlock.tsx',
  },
  {
    slug: 'related-questions',
    id: 'C30',
    title: 'Related questions',
    group: GROUPS[4],
    description: '"People also ask": a 3-column grid of related-question cards.',
    usedOn: 'Pages 1–6',
    source: 'RelatedQuestions.tsx',
  },
  {
    slug: 'helpful-row',
    id: 'C31',
    title: 'Helpful row',
    group: GROUPS[4],
    description: '"Was this answer helpful?" with Yes/No buttons and a "last reviewed" note.',
    usedOn: 'Pages 1, 3–7',
    source: 'HelpfulRow.tsx',
  },

  // F. Loading experience
  {
    slug: 'ai-progress-panel',
    id: 'C32',
    title: 'AI progress panel',
    group: GROUPS[5],
    description:
      'The "assistant at work" card: send question, classify, retrieve approved content, build answer. Standard, warning and short flows.',
    usedOn: 'Pages 1–7',
    source: 'AiProgressPanel.tsx',
  },
  {
    slug: 'staged-reveal',
    id: 'C33',
    title: 'Staged reveal',
    group: GROUPS[5],
    description:
      'Wrap a composed answer page and its pieces appear one after another in reading order. Behaviour rather than a visual component.',
    usedOn: 'Pages 1–7',
    source: 'StagedReveal.tsx',
  },
];

export const BASE_PATH = '/demo/liberty-components';

export function getEntry(slug: string): ComponentEntry {
  const entry = COMPONENTS.find((c) => c.slug === slug);
  if (!entry) throw new Error(`Unknown Liberty component slug: ${slug}`);
  return entry;
}

/** `export const metadata = componentMetadata('ask-bar')` in each page. */
export function componentMetadata(slug: string): Metadata {
  const { id, title, description } = getEntry(slug);
  return { title: `${id} ${title} · Liberty components`, description };
}
