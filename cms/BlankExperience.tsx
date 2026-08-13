import { type ContentProps } from '@optimizely/cms-sdk';
import { BlankExperienceContentType } from '@optimizely/cms-sdk';
import { OptimizelyComposition, getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { ComponentWrapper } from './wrappers';

type Props = {
  content: ContentProps<typeof BlankExperienceContentType>;
};

// Optimizely Graph returns __typename: '_Component' for every
// CompositionComponentNode's .component regardless of actual type.
// The concrete type is available as node.type, so we inject it as __typename
// so the SDK's findComponent lookup works correctly.
// eslint-disable-next-line @typescript-eslint/no-explicit-any
function fixCompositionTypes(nodes: any[]): any[] {
  return nodes.map((node) => {
    if (
      node.__typename === 'CompositionComponentNode' &&
      node.type &&
      node.component?.__typename === '_Component'
    ) {
      return { ...node, component: { ...node.component, __typename: node.type } };
    }
    if (node.nodes) {
      return { ...node, nodes: fixCompositionTypes(node.nodes) };
    }
    return node;
  });
}

export default function BlankExperience({ content }: Props) {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { pa } = getPreviewUtils(content as any);
  const nodes = fixCompositionTypes(content.composition?.nodes ?? []);

  if (nodes.length === 0) {
    return (
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      <main {...pa(content as any)} className="w-full rounded-lg border border-dashed border-gray-300 p-8 text-center text-sm text-gray-400">
        This experience has no sections yet
      </main>
    );
  }

  return (
    <main>
      <OptimizelyComposition nodes={nodes} ComponentWrapper={ComponentWrapper} />
    </main>
  );
}
