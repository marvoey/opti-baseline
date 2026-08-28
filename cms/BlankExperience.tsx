import { BlankExperienceContentType, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyComposition, getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { ComponentWrapper } from './wrappers';

type Props = {
  content: ContentProps<typeof BlankExperienceContentType>;
};

export default function BlankExperience({ content }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { pa } = getPreviewUtils(content as any);
  const nodes = content.composition?.nodes ?? [];

  if (nodes.length === 0) {
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <main {...pa(content as any)} className="w-full border border-dashed border-gray-300 rounded-lg p-12 text-center">
        <p className="text-sm font-medium text-gray-500">This experience is empty</p>
        <p className="mt-1 text-sm text-gray-400">
          Add a section to start building the layout.
        </p>
        <dl className="mt-6 grid gap-4 text-left sm:grid-cols-3 max-w-2xl mx-auto">
          <div>
            <dt className="text-sm font-medium text-gray-500">Section</dt>
            <dd className="mt-1 text-sm text-gray-400">
              A horizontal band of the page, such as a hero or a feature grid. Sections stack top to bottom to form the layout.
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Row</dt>
            <dd className="mt-1 text-sm text-gray-400">
              Splits a section into one or more horizontal strips. Add multiple rows to stack content within a section.
            </dd>
          </div>
          <div>
            <dt className="text-sm font-medium text-gray-500">Column</dt>
            <dd className="mt-1 text-sm text-gray-400">
              Splits a row into side-by-side slots. Elements like Rich Text are dropped into columns.
            </dd>
          </div>
        </dl>
      </main>
    );
  }

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <main {...pa(content as any)}>
      <OptimizelyComposition nodes={nodes} ComponentWrapper={ComponentWrapper} />
    </main>
  );
}
