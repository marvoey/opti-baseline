import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { GuideFeatureItemContentType } from './GuideFeatureItem';
import { SECTION_BACKGROUNDS, eyebrowClass, h2Class, iconSrc, innerClass, introClass, sectionBg, sectionClass } from './guideShared';

/** A heading with a grid of icon cards (2 to 6). */
export const GuideFeatureGridContentType = contentType({
  key: 'GuideFeatureGrid',
  baseType: '_component',
  displayName: '[GUIDE] Feature grid',
  description: 'Heading and intro with a grid of icon cards.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Eyebrow: { type: 'string', displayName: 'Eyebrow', isLocalized: true, sortOrder: 10 },
    Heading: { type: 'string', displayName: 'Heading', isLocalized: true, sortOrder: 20 },
    Intro: { type: 'string', displayName: 'Intro', isLocalized: true, sortOrder: 30 },
    Background: { type: 'string', displayName: 'Background', enum: SECTION_BACKGROUNDS, sortOrder: 40 },
    Items: {
      type: 'array',
      displayName: 'Cards',
      isLocalized: true,
      maxItems: 6,
      items: { type: 'component', contentType: GuideFeatureItemContentType },
      sortOrder: 50,
    },
  },
});

type Props = { content: ContentProps<typeof GuideFeatureGridContentType> };

export default function GuideFeatureGrid({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const items = content.Items ?? [];
  // Card bodies sit on the opposite tint to the section, so they always stand out.
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
        <ul {...pa('Items')} className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((item, i) => (
            <li key={i} className={`rounded-[32px] p-7 ${card}`}>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={iconSrc(item?.Icon)} alt="" width={44} height={44} className="h-11 w-11" />
              <h3 className="mt-5 font-display text-xl font-extrabold leading-tight">{item?.Title}</h3>
              <p className="mt-2 leading-relaxed">{item?.Body}</p>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
