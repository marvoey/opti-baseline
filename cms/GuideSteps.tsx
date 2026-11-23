import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { GuideStepItemContentType } from './GuideStepItem';
import { SECTION_BACKGROUNDS, eyebrowClass, h2Class, innerClass, introClass, sectionBg, sectionClass } from './guideShared';

/** "How it works": numbered stages side by side (2 to 4). */
export const GuideStepsContentType = contentType({
  key: 'GuideSteps',
  baseType: '_component',
  displayName: '[GUIDE] Steps',
  description: 'Heading and intro with numbered stages, for example before, during and after the session.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Eyebrow: { type: 'string', displayName: 'Eyebrow', isLocalized: true, sortOrder: 10 },
    Heading: { type: 'string', displayName: 'Heading', isLocalized: true, sortOrder: 20 },
    Intro: { type: 'string', displayName: 'Intro', isLocalized: true, sortOrder: 30 },
    Background: { type: 'string', displayName: 'Background', enum: SECTION_BACKGROUNDS, sortOrder: 40 },
    Items: {
      type: 'array',
      displayName: 'Stages',
      isLocalized: true,
      maxItems: 4,
      items: { type: 'component', contentType: GuideStepItemContentType },
      sortOrder: 50,
    },
  },
});

type Props = { content: ContentProps<typeof GuideStepsContentType> };

export default function GuideSteps({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const items = content.Items ?? [];
  const card = content.Background === 'neutral' ? 'bg-white' : 'bg-neutral-3';

  return (
    <section {...pa(block)} className={`${sectionClass} ${sectionBg(content.Background)}`}>
      <div className={innerClass}>
        {content.Eyebrow && (
          <p {...pa('Eyebrow')} className={eyebrowClass}>
            {content.Eyebrow}
          </p>
        )}
        {content.Heading && (
          <h2 {...pa('Heading')} className={h2Class}>
            {content.Heading}
          </h2>
        )}
        {content.Intro && (
          <p {...pa('Intro')} className={introClass}>
            {content.Intro}
          </p>
        )}
        <ol {...pa('Items')} className="mt-10 grid gap-5 md:grid-cols-3">
          {items.map((item, i) => (
            <li key={i} className={`flex flex-col rounded-[32px] p-7 ${card}`}>
              <div className="flex items-center gap-3">
                <span
                  aria-hidden="true"
                  className="grid h-12 w-12 flex-none place-items-center rounded-full border-2 border-dark-fir bg-lfgreen font-display text-xl font-extrabold"
                >
                  {i + 1}
                </span>
                {item?.Label && <span className="text-sm font-bold">{item.Label}</span>}
              </div>
              <h3 className="mt-5 font-display text-xl font-extrabold leading-tight">{item?.Title}</h3>
              <p className="mt-2 flex-1 leading-relaxed">{item?.Body}</p>
              {item?.Duration && (
                <p className="mt-5 self-start rounded-full border-2 border-dark-fir bg-white px-4 py-1 text-sm font-semibold">
                  {item.Duration}
                </p>
              )}
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
