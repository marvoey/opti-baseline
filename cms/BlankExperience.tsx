import { OptimizelyComposition, getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { ComponentWrapper } from './wrappers';

type Props = {
  content: {
    composition?: { nodes?: Parameters<typeof OptimizelyComposition>[0]['nodes'] };
    [key: string]: unknown;
  };
};

export default function BlankExperience({ content }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { pa } = getPreviewUtils(content as any);
  const nodes = content.composition?.nodes ?? [];

  return (
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    <main {...pa(content as any)} className="w-full">
      <OptimizelyComposition nodes={nodes} ComponentWrapper={ComponentWrapper} />
    </main>
  );
}
