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
      <main {...pa(content as any)} className="w-full border border-dashed border-gray-300 rounded-lg p-8 text-center text-sm text-gray-400">
        This experience has no sections yet
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
