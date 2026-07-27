import { displayTemplate } from '@optimizely/cms-sdk';
import { OptimizelyGridSection, getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import type { StructureContainerProps } from '@optimizely/cms-sdk/react/server';

function BlankRow({ children }: StructureContainerProps) {
  return <div className="flex flex-col gap-4 md:flex-row">{children}</div>;
}

function BlankColumn({ children }: StructureContainerProps) {
  return <div className="flex-1">{children}</div>;
}

type EmptyReason = 'no-rows' | 'no-columns' | 'no-content' | null;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function getEmptyReason(nodes: any[]): EmptyReason {
  if (!nodes?.length) return 'no-rows';
  const allRowsEmpty = nodes.every(row => !row.nodes?.length);
  if (allRowsEmpty) return 'no-columns';
  const allColumnsEmpty = nodes.every(row =>
    row.nodes?.every((col: any) => !col.nodes?.length),
  );
  if (allColumnsEmpty) return 'no-content';
  return null;
}

const EMPTY_MESSAGES: Record<Exclude<EmptyReason, null>, string> = {
  'no-rows': 'This section has no rows. Add a row in the Visual Builder to get started.',
  'no-columns': 'This section has rows but no columns. Add columns inside each row to hold content.',
  'no-content': 'This section has columns but no content elements. Drag elements into the columns to display content.',
};

const SPACING_CHOICES = {
  none: { displayName: 'None',   sortOrder: 1 },
  sm:   { displayName: 'Small',  sortOrder: 2 },
  md:   { displayName: 'Medium', sortOrder: 3 },
  lg:   { displayName: 'Large',  sortOrder: 4 },
};

export const BlankSectionCustomDisplayTemplate = displayTemplate({
  key: 'BlankSectionCustom',
  isDefault: false,
  displayName: 'Custom',
  contentType: 'BlankSection',
  settings: {
    paddingTop:    { editor: 'select', displayName: 'Padding Top',    sortOrder: 1, choices: SPACING_CHOICES },
    paddingRight:  { editor: 'select', displayName: 'Padding Right',  sortOrder: 2, choices: SPACING_CHOICES },
    paddingBottom: { editor: 'select', displayName: 'Padding Bottom', sortOrder: 3, choices: SPACING_CHOICES },
    paddingLeft:   { editor: 'select', displayName: 'Padding Left',   sortOrder: 4, choices: SPACING_CHOICES },
    marginTop:     { editor: 'select', displayName: 'Margin Top',     sortOrder: 5, choices: SPACING_CHOICES },
    marginRight:   { editor: 'select', displayName: 'Margin Right',   sortOrder: 6, choices: SPACING_CHOICES },
    marginBottom:  { editor: 'select', displayName: 'Margin Bottom',  sortOrder: 7, choices: SPACING_CHOICES },
    marginLeft:    { editor: 'select', displayName: 'Margin Left',    sortOrder: 8, choices: SPACING_CHOICES },
  },
});

const PT = { none: 'pt-0', sm: 'pt-4',  md: 'pt-8',  lg: 'pt-16'  } as const;
const PR = { none: 'pr-0', sm: 'pr-4',  md: 'pr-8',  lg: 'pr-16'  } as const;
const PB = { none: 'pb-0', sm: 'pb-4',  md: 'pb-8',  lg: 'pb-16'  } as const;
const PL = { none: 'pl-0', sm: 'pl-4',  md: 'pl-8',  lg: 'pl-16'  } as const;
const MT = { none: 'mt-0', sm: 'mt-4',  md: 'mt-8',  lg: 'mt-16'  } as const;
const MR = { none: 'mr-0', sm: 'mr-4',  md: 'mr-8',  lg: 'mr-16'  } as const;
const MB = { none: 'mb-0', sm: 'mb-4',  md: 'mb-8',  lg: 'mb-16'  } as const;
const ML = { none: 'ml-0', sm: 'ml-4',  md: 'ml-8',  lg: 'ml-16'  } as const;
type Spacing = keyof typeof PT;

// BlankSection is a CMS system type — no contentType() definition needed.
export default function BlankSection({
  content,
  displaySettings,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  content: any;
  displaySettings?: Record<string, string>;
}) {
  const { pa } = getPreviewUtils(content);
  const emptyReason = getEmptyReason(content.nodes);

  const spacing = displaySettings ? [
    PT[displaySettings.paddingTop    as Spacing],
    PR[displaySettings.paddingRight  as Spacing],
    PB[displaySettings.paddingBottom as Spacing],
    PL[displaySettings.paddingLeft   as Spacing],
    MT[displaySettings.marginTop     as Spacing],
    MR[displaySettings.marginRight   as Spacing],
    MB[displaySettings.marginBottom  as Spacing],
    ML[displaySettings.marginLeft    as Spacing],
  ].filter(Boolean).join(' ') : '';

  return (
    <section {...pa(content)} className={spacing || undefined}>
      {emptyReason ? (
        <p className="text-muted-foreground py-8 text-center text-sm italic">
          {EMPTY_MESSAGES[emptyReason]}
        </p>
      ) : (
        <OptimizelyGridSection
          nodes={content.nodes}
          row={BlankRow}
          column={BlankColumn}
        />
      )}
    </section>
  );
}
