import { displayTemplate } from '@optimizely/cms-sdk';
import type { StructureContainerProps } from '@optimizely/cms-sdk/react/server';
import { OptimizelyGridSection, getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { ComponentWrapper } from './wrappers';

/**
 * eHealth section style: the background band (White / Mint / Grey) and the
 * vertical spacing around a Visual Builder section. Editors pick it from the
 * section's Style panel; the values arrive here as `displaySettings`.
 */
export const EhSectionStyle = displayTemplate({
  key: 'EhSectionStyle',
  displayName: '[eHealth] Section style',
  contentType: 'BlankSection',
  isDefault: false,
  settings: {
    background: {
      displayName: 'Background',
      editor: 'select',
      sortOrder: 10,
      choices: {
        white: { displayName: 'White', sortOrder: 10 },
        mint: { displayName: 'Mint', sortOrder: 20 },
        grey: { displayName: 'Grey', sortOrder: 30 },
      },
    },
    spacing: {
      displayName: 'Vertical spacing',
      editor: 'select',
      sortOrder: 20,
      choices: {
        none: { displayName: 'None (blocks set their own)', sortOrder: 10 },
        compact: { displayName: 'Compact', sortOrder: 20 },
        standard: { displayName: 'Standard', sortOrder: 30 },
        roomy: { displayName: 'Roomy', sortOrder: 40 },
      },
    },
  },
});

/** Background classes. Also maps the older BlankSectionDefault choices. */
const BACKGROUND_CLASS: Record<string, string> = {
  white: 'bg-white',
  mint: 'bg-mint',
  grey: 'bg-surface',
  // Legacy BlankSectionDefault values
  muted: 'bg-surface',
  dark: 'bg-blue-950 text-white',
};

const SPACING_CLASS: Record<string, string> = {
  none: '',
  compact: 'py-6',
  standard: 'py-12',
  roomy: 'py-20',
  // Legacy BlankSectionDefault values
  sm: 'py-6',
  md: 'py-12',
  lg: 'py-20',
};

type DisplaySettingsInput =
  | Record<string, string | boolean | null | undefined>
  | Array<{ key: string; value: string }>
  | null
  | undefined;

/** Normalise display settings (object or Graph `[{ key, value }]`) to a map. */
function toSettings(input: DisplaySettingsInput): Record<string, string> {
  if (!input) return {};
  if (Array.isArray(input)) {
    return Object.fromEntries(input.map((s) => [s.key, String(s.value)]));
  }
  return Object.fromEntries(
    Object.entries(input).filter(([, v]) => v != null).map(([k, v]) => [k, String(v)]),
  );
}

type Props = {
  content: {
    nodes?: Parameters<typeof OptimizelyGridSection>[0]['nodes'];
    [key: string]: unknown;
  };
  displaySettings?: DisplaySettingsInput;
};

export default function BlankSection({ content, displaySettings }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { pa } = getPreviewUtils(content as any);
  const nodes = content.nodes ?? [];

  const fromComposition = (content as { __composition?: { displaySettings?: DisplaySettingsInput } })
    .__composition?.displaySettings;
  const settings = toSettings(displaySettings ?? fromComposition);
  const bandClass = [
    BACKGROUND_CLASS[settings.background ?? ''] ?? '',
    SPACING_CLASS[settings.spacing ?? ''] ?? '',
  ].join(' ').trim();

  function SectionRow({ node, children }: StructureContainerProps) {
    const hasColumns = (node.nodes?.length ?? 0) > 0;
    return (
      <div {...pa(node)} className="flex w-full flex-col gap-4 md:flex-row">
        {hasColumns ? children : (
          <div className="flex-1 border border-dashed border-gray-300 rounded p-4 text-center">
            <p className="text-sm font-medium text-gray-500">This row has no columns yet</p>
            <p className="mt-1 text-sm text-gray-400">
              Split this row into columns to place content side by side, then drop elements like Rich Text into a column.
            </p>
          </div>
        )}
      </div>
    );
  }

  function SectionColumn({ node, children }: StructureContainerProps) {
    const hasComponents = (node.nodes?.length ?? 0) > 0;
    return (
      <div {...pa(node)} className="min-w-0 flex-1">
        {hasComponents ? children : (
          <div className="border border-dashed border-gray-300 rounded p-4 text-center">
            <p className="text-sm font-medium text-gray-500">This column has no content yet</p>
            <p className="mt-1 text-sm text-gray-400">
              Add an element, such as Rich Text, to fill this column.
            </p>
          </div>
        )}
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <section {...pa(content as any)} className={`w-full ${bandClass}`}>
        <div className="mx-auto max-w-6xl px-6 py-8">
          <div className="border border-dashed border-gray-300 rounded-lg p-8 text-center">
            <p className="text-sm font-medium text-gray-500">This section has no rows yet</p>
            <p className="mt-1 text-sm text-gray-400">
              Add a row to start filling this section, then split it into columns.
            </p>
            <dl className="mt-6 grid gap-4 text-left sm:grid-cols-2 max-w-lg mx-auto">
              <div>
                <dt className="text-sm font-medium text-gray-500">Row</dt>
                <dd className="mt-1 text-sm text-gray-400">
                  A horizontal strip within the section. Add multiple rows to stack content vertically.
                </dd>
              </div>
              <div>
                <dt className="text-sm font-medium text-gray-500">Column</dt>
                <dd className="mt-1 text-sm text-gray-400">
                  Splits a row into side-by-side slots. Once a row has columns, drop elements like Rich Text into them.
                </dd>
              </div>
            </dl>
          </div>
        </div>
      </section>
    );
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <section {...pa(content as any)} className={`w-full ${bandClass}`}>
      <OptimizelyGridSection
        nodes={nodes}
        row={SectionRow}
        column={SectionColumn}
        ComponentWrapper={ComponentWrapper}
      />
    </section>
  );
}
