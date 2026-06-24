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

export default function ExperiencePage({ content }: Props) {
  return (
    <main>
      <OptimizelyComposition
        nodes={content.composition.nodes ?? []}
        ComponentWrapper={ComponentWrapper}
      />
    </main>
  );
}
