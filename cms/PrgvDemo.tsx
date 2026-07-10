import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyComposition } from '@optimizely/cms-sdk/react/server';
import { ComponentWrapper } from './wrappers';

export const PrgvDemoContentType = contentType({
  key: 'PrgvDemo',
  baseType: '_experience',
  displayName: 'Progressive: Demo',
  description: 'This is the Demo path.',
  mayContainTypes: ['PrgvDemo', 'PrgvDemov2'],
  properties: {},
});

type Props = {
  content: ContentProps<typeof PrgvDemoContentType>;
};

export default function PrgvDemo({ content }: Props) {
  return (
    <main>
      <OptimizelyComposition
        nodes={content.composition.nodes ?? []}
        ComponentWrapper={ComponentWrapper}
      />
    </main>
  );
}
