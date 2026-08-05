import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyComposition } from '@optimizely/cms-sdk/react/server';
import { ComponentWrapper } from './wrappers';

/**
 * Experience Page — a routable Experience (`_experience`) with no page-level
 * fields. The entire layout is built visually in the Visual Builder; sections
 * and elements live in `composition.nodes`.
 */
export const ExperiencePageContentType = contentType({
  key: 'ExperiencePage',
  baseType: '_experience',
  displayName: 'Experience Page (v1)',
  description: 'A routable page composed visually in the Visual Builder.',
  mayContainTypes: ['ExperiencePage', 'Page'],
  properties: {},
});

type Props = {
  content: ContentProps<typeof ExperiencePageContentType>;
};

// Optimizely Graph always returns __typename: '_Component' for every
// CompositionComponentNode's .component, regardless of the actual type.
// The concrete type is reliably available as node.type (part of the fixed
// ICompositionNode fragment) — so we inject it as __typename so the SDK's
// findComponent lookup works correctly.
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

export default function ExperiencePage({ content }: Props) {
  return (
    <main>
      <OptimizelyComposition
        nodes={fixCompositionTypes(content.composition.nodes ?? [])}
        ComponentWrapper={ComponentWrapper}
      />
    </main>
  );
}
