import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { tierProperties } from './shared';

export const HrbSectionHeadingContentType = contentType({
  key: 'HRB_SectionHeading',
  baseType: '_component',
  displayName: '[HRB] Section Heading',
  description:
    'H&R Block demo: kicker, heading and intro above a group of elements, e.g. "Tax options for any situation" or the Tax Center hub header.',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    Kicker: { type: 'string', displayName: 'Kicker', isLocalized: true, isRequired: false },
    Heading: { type: 'string', displayName: 'Heading', isLocalized: true, isRequired: true },
    Intro: { type: 'string', displayName: 'Intro', isLocalized: true, isRequired: false },
    ...tierProperties(),
  },
});

type Props = { content: ContentProps<typeof HrbSectionHeadingContentType> };

export default function SectionHeading({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  return (
    <div {...pa(block)} className="py-2">
      {content.Kicker && (
        <div {...pa('Kicker')} className="mb-2 text-xs font-semibold uppercase tracking-[0.14em] text-blue-800 group-data-[dark=true]:text-blue-400">
          {content.Kicker}
        </div>
      )}
      <h2 {...pa('Heading')} className="text-2xl font-semibold md:text-3xl">{content.Heading}</h2>
      {content.Intro && (
        <p {...pa('Intro')} className="mt-3 max-w-2xl opacity-80">{content.Intro}</p>
      )}
    </div>
  );
}
