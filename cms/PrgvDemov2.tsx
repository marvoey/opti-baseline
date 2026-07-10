import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyComposition } from '@optimizely/cms-sdk/react/server';
import { ComponentWrapper } from './wrappers';

export const PrgvDemov2ContentType = contentType({
  key: 'PrgvDemov2',
  baseType: '_experience',
  displayName: 'Progressive Demo v2',
  mayContainTypes: ['PrgvDemo', 'PrgvDemov2'],
  properties: {},
});

type Props = {
  content: ContentProps<typeof PrgvDemov2ContentType>;
};

export default function PrgvDemov2({ content }: Props) {
  return (
    <main>
      <OptimizelyComposition
        nodes={content.composition.nodes ?? []}
        ComponentWrapper={ComponentWrapper}
      />
    </main>
  );
}
