import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyGridSection, getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { BarChart3 } from 'lucide-react';
import { V1Row, V1Column } from './gridContainers';

/**
 * V1: Section — the composition shell that hosts the row/column grid. A section
 * is a WRAPPER: its own content properties are never delivered by the
 * composition query, so all presentation (theme, decoration, padding, corners)
 * lives on the display template and is read via `displaySettings`.
 *
 * Theme `dark` reproduces the CibcHero teal gradient; `light` the stone panel —
 * so a V1Section + atoms can recreate the hero at high fidelity.
 */
export const V1SectionContentType = contentType({
  key: 'V1Section',
  baseType: '_section',
  displayName: 'V1: Section',
  description: 'Composition shell — hosts the row/column grid; styled via display template.',
  properties: {},
});

export const V1SectionDefault = displayTemplate({
  key: 'V1SectionDefault',
  isDefault: true,
  displayName: 'V1: Section',
  contentType: 'V1Section',
  settings: {
    theme: {
      editor: 'select',
      displayName: 'Theme',
      sortOrder: 0,
      choices: {
        dark: { displayName: 'Teal (dark)', sortOrder: 1 },
        light: { displayName: 'Stone (light)', sortOrder: 2 },
        plain: { displayName: 'Plain (transparent)', sortOrder: 3 },
      },
    },
    decoration: {
      editor: 'select',
      displayName: 'Decoration',
      sortOrder: 1,
      choices: {
        none: { displayName: 'None', sortOrder: 1 },
        chart: { displayName: 'Chart motif', sortOrder: 2 },
      },
    },
    padding: {
      editor: 'select',
      displayName: 'Padding',
      sortOrder: 2,
      choices: {
        sm: { displayName: 'Small', sortOrder: 1 },
        md: { displayName: 'Medium', sortOrder: 2 },
        lg: { displayName: 'Large', sortOrder: 3 },
      },
    },
    rounded: {
      editor: 'checkbox',
      displayName: 'Rounded corners',
      sortOrder: 3,
      choices: {
        true: { displayName: 'Rounded', sortOrder: 1 },
        false: { displayName: 'Square', sortOrder: 2 },
      },
    },
  },
});

type Theme = 'dark' | 'light' | 'plain';
type Padding = 'sm' | 'md' | 'lg';

const THEME: Record<Theme, string> = {
  dark: 'bg-linear-to-br from-cibc-teal to-cibc-teal-dark text-white',
  light: 'bg-cibc-stone text-cibc-teal-dark',
  plain: '',
};
const PADDING: Record<Padding, string> = { sm: 'p-6', md: 'p-8', lg: 'p-12' };

type Props = {
  content: ContentProps<typeof V1SectionContentType> & { nodes?: unknown[] };
  displaySettings?: ContentProps<typeof V1SectionDefault>;
};

export default function V1Section({ content, displaySettings }: Props) {
  const { pa } = getPreviewUtils(content);

  const theme = (displaySettings?.theme ?? 'dark') as Theme;
  const padding = (displaySettings?.padding ?? 'lg') as Padding;
  const decoration = displaySettings?.decoration ?? 'none';
  // Checkbox settings arrive as boolean from the SDK, but seeded/raw data may
  // carry the string "true" — accept both.
  const rounded =
    displaySettings?.rounded === true || (displaySettings?.rounded as unknown) === 'true'
      ? 'rounded-2xl'
      : '';

  const className = [
    'relative overflow-hidden',
    THEME[theme],
    PADDING[padding],
    rounded,
    theme !== 'plain' ? 'shadow-xl' : '',
  ]
    .filter(Boolean)
    .join(' ');

  // The SDK delivers a section's child grid as `content.nodes`.
  const nodes = (content as { nodes?: Parameters<typeof OptimizelyGridSection>[0]['nodes'] }).nodes ?? [];

  return (
    <section {...pa(content)} className={className}>
      {decoration === 'chart' ? (
        <div className="pointer-events-none absolute right-0 top-0 h-full w-1/3 overflow-hidden p-12 opacity-10">
          <BarChart3 size={400} className="translate-x-20 translate-y-20 text-cibc-gold" />
        </div>
      ) : null}
      <div className="relative z-10 max-w-2xl">
        <OptimizelyGridSection nodes={nodes} row={V1Row} column={V1Column} />
      </div>
    </section>
  );
}
