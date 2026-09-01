import { displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import type { StructureContainerProps } from '@optimizely/cms-sdk/react/server';
import { OptimizelyGridSection, getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { ComponentWrapper } from './wrappers';
import type { BlockWidthValue } from './blockWidth';

/**
 * Section-level container width. Unlike `widthClass()` in blockWidth.ts (whose
 * "Full" is a bounded max-w-6xl content width for blocks inside a column),
 * a section's "Full" must be true edge-to-edge width — no max-width at all.
 */
const CONTAINER_WIDTH_CLASS: Record<BlockWidthValue, string> = {
  full: 'max-w-none',
  medium: 'max-w-3xl',
  narrow: 'max-w-xl',
};

function containerWidthClass(value: string | null | undefined): string {
  return CONTAINER_WIDTH_CLASS[value as BlockWidthValue] ?? CONTAINER_WIDTH_CLASS.full;
}

/**
 * Layout Preview display template for BlankSection.
 *
 * Lets editors set the section's container width in Visual Builder — Full,
 * Medium or Narrow — previewed live via the Tailwind max-width classes from
 * `widthClass()`. isDefault so it applies out of the box without picking a
 * variant/tag.
 */
export const LayoutPreviewDisplayTemplate = displayTemplate({
  key: 'LayoutPreview',
  isDefault: true,
  displayName: 'Layout Preview',
  contentType: 'BlankSection',
  settings: {
    ContainerWidth: {
      editor: 'select',
      displayName: 'Container Width',
      sortOrder: 0,
      choices: {
        full: { displayName: 'Full', sortOrder: 1 },
        medium: { displayName: 'Medium', sortOrder: 2 },
        narrow: { displayName: 'Narrow', sortOrder: 3 },
      },
    },
  },
});

type Props = {
  content: {
    nodes?: Parameters<typeof OptimizelyGridSection>[0]['nodes'];
    [key: string]: unknown;
  };
  displaySettings?: ContentProps<typeof LayoutPreviewDisplayTemplate>;
};

export default function BlankSection({ content, displaySettings }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { pa } = getPreviewUtils(content as any);
  const nodes = content.nodes ?? [];
  const containerClass = containerWidthClass(displaySettings?.ContainerWidth);

  function SectionRow({ node, children }: StructureContainerProps) {
    const hasColumns = (node.nodes?.length ?? 0) > 0;
    return (
      <div {...pa(node)} className="flex gap-4 w-full">
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
      <div {...pa(node)} className="flex-1">
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
      <section {...pa(content as any)} className="w-full border border-dashed border-gray-300 rounded-lg p-8 text-center">
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
      </section>
    );
  }

  return (
    <section
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      {...pa(content as any)}
      className={`mx-auto w-full my-8 px-4 py-8 sm:my-12 sm:px-6 sm:py-12 lg:px-8 ${containerClass}`}
    >
      <div className="rounded border border-dashed border-sky-300 bg-sky-50/80 p-2">
        <OptimizelyGridSection
          nodes={nodes}
          row={SectionRow}
          column={SectionColumn}
          ComponentWrapper={ComponentWrapper}
        />
      </div>
    </section>
  );
}
