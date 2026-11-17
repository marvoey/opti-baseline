import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import type { StructureContainerProps } from '@optimizely/cms-sdk/react/server';
import { OptimizelyGridSection, getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { widthClass } from '../blockWidth';
import { choice } from './shared';
import { ComponentWrapper } from '../wrappers';

export const HrbSectionContentType = contentType({
  key: 'HRB_Section',
  baseType: '_section',
  displayName: '[HRB] Section',
  description:
    'H&R Block demo: the section for every H&R Block page. Carries the [HRB] Section style (background, spacing, width) so the styling stays isolated from other demos in this instance.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {},
});

export const HrbSectionDisplayTemplate = displayTemplate({
  key: 'HRB_SectionStyle',
  isDefault: true,
  displayName: '[HRB] Section style',
  contentType: 'HRB_Section',
  settings: {
    ResponsiveBackground: {
      editor: 'select',
      displayName: 'Background',
      sortOrder: 0,
      choices: {
        warmWhite: { displayName: 'Warm white', sortOrder: 1 },
        sand: { displayName: 'Sand', sortOrder: 2 },
        darkGreen: { displayName: 'Dark green', sortOrder: 3 },
        white: { displayName: 'White', sortOrder: 4 },
      },
    },
    ResponsiveSpacing: {
      editor: 'select',
      displayName: 'Spacing',
      sortOrder: 1,
      choices: {
        standard: { displayName: 'Standard', sortOrder: 1 },
        compact: { displayName: 'Compact', sortOrder: 2 },
        spacious: { displayName: 'Spacious', sortOrder: 3 },
      },
    },
    ResponsiveWidth: {
      editor: 'select',
      displayName: 'Width',
      sortOrder: 2,
      choices: {
        full: { displayName: 'Full', sortOrder: 1 },
        medium: { displayName: 'Medium', sortOrder: 2 },
        narrow: { displayName: 'Narrow', sortOrder: 3 },
      },
    },
  },
});

const BACKGROUNDS = {
  warmWhite: 'bg-hrb-warm-white text-hrb-ink',
  sand: 'bg-hrb-sand text-hrb-ink',
  darkGreen: 'bg-blue-950 text-white',
  white: 'bg-white text-hrb-ink',
} as const;

const SPACING = { standard: 'py-12', compact: 'py-6', spacious: 'py-20' } as const;

// A section is a wrapper: its own properties aren't delivered, so the look comes
// entirely from the display template's settings.
type Props = {
  content: {
    nodes?: Parameters<typeof OptimizelyGridSection>[0]['nodes'];
    [key: string]: unknown;
  };
  displaySettings?: ContentProps<typeof HrbSectionDisplayTemplate>;
};

export default function Section({ content, displaySettings }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { pa } = getPreviewUtils(content as any);
  const nodes = content.nodes ?? [];

  const bg = choice(BACKGROUNDS, displaySettings?.ResponsiveBackground, 'warmWhite');
  const spacing = choice(SPACING, displaySettings?.ResponsiveSpacing, 'standard');

  function Row({ node, children }: StructureContainerProps) {
    return (
      <div {...pa(node)} className="flex w-full flex-col gap-6 md:flex-row">
        {children}
      </div>
    );
  }

  function Column({ node, children }: StructureContainerProps) {
    return (
      <div {...pa(node)} className="flex min-w-0 flex-1 flex-col [&>*:only-child]:flex-1">
        {children}
      </div>
    );
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <section {...pa(content as any)}
      data-dark={bg === 'darkGreen'}
      className={`group w-full px-6 ${BACKGROUNDS[bg]} ${SPACING[spacing]}`}
    >
      <div className={`mx-auto ${widthClass(String(displaySettings?.ResponsiveWidth ?? ''))}`}>
        <OptimizelyGridSection
          nodes={nodes}
          row={Row}
          column={Column}
          ComponentWrapper={ComponentWrapper}
        />
      </div>
    </section>
  );
}
