import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { GuideFaqItemContentType } from './GuideFaqItem';
import { SECTION_BACKGROUNDS, eyebrowClass, h2Class, introClass, sectionBg, sectionClass } from './guideShared';

/** Questions and answers as native disclosure widgets (works without JavaScript). */
export const GuideFaqContentType = contentType({
  key: 'GuideFaq',
  baseType: '_component',
  displayName: '[GUIDE] FAQ',
  description: 'Heading with questions people can click to open.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Eyebrow: { type: 'string', displayName: 'Eyebrow', isLocalized: true, sortOrder: 10 },
    Heading: { type: 'string', displayName: 'Heading', isLocalized: true, sortOrder: 20 },
    Intro: { type: 'string', displayName: 'Intro', isLocalized: true, sortOrder: 30 },
    Background: { type: 'string', displayName: 'Background', enum: SECTION_BACKGROUNDS, sortOrder: 40 },
    Items: {
      type: 'array',
      displayName: 'Questions',
      isLocalized: true,
      maxItems: 12,
      items: { type: 'component', contentType: GuideFaqItemContentType },
      sortOrder: 50,
    },
  },
});

type Props = { content: ContentProps<typeof GuideFaqContentType> };

export default function GuideFaq({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const items = content.Items ?? [];
  const card = content.Background === 'neutral' ? 'bg-white' : 'bg-neutral-2';

  return (
    <section {...pa(block)} className={`${sectionClass} ${sectionBg(content.Background)}`}>
      <div className="mx-auto grid max-w-6xl gap-10 lg:grid-cols-[1fr_1.6fr]">
        <div>
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
        </div>
        <div {...pa('Items')} className="space-y-3">
          {items.map((item, i) => (
            <details key={i} className={`group rounded-2xl border-2 border-dark-fir ${card}`}>
              <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-semibold [&::-webkit-details-marker]:hidden">
                {item?.Question}
                <span
                  aria-hidden="true"
                  className="grid h-7 w-7 flex-none place-items-center rounded-full border-2 border-dark-fir bg-lfgreen font-mono text-sm leading-none"
                >
                  <span className="group-open:hidden">+</span>
                  <span className="hidden group-open:inline">&minus;</span>
                </span>
              </summary>
              <p className="px-5 pb-5 leading-relaxed">{item?.Answer}</p>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
