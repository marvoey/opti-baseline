import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { OptimizelyComposition } from '@optimizely/cms-sdk/react/server';
import { ComponentWrapper } from './wrappers';

export const BlankExperienceContentType = contentType({
  key: 'BlankExperience',
  baseType: '_experience',
  displayName: 'Blank Experience',
  description: 'A blank routable experience composed visually in the Visual Builder.',
  properties: {},
});

type Props = {
  content: ContentProps<typeof BlankExperienceContentType>;
};

export default function BlankExperience({ content }: Props) {
  return (
    <main>
      <OptimizelyComposition
        nodes={content.composition.nodes ?? []}
        ComponentWrapper={ComponentWrapper}
      />
    </main>
  );
}
