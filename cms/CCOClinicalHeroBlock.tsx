import { contentType, damAssets, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';

export const CCOClinicalHeroBlockContentType = contentType({
  key: 'CCOClinicalHeroBlock',
  baseType: '_component',
  displayName: 'CCO Clinical Hero',
  description: 'Motivational-interviewing headline, body and start-session CTA.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Headline: {
      type: 'string',
      displayName: 'Headline',
      isLocalized: true,
      sortOrder: 10,
    },
    MotivationalBody: {
      type: 'richText',
      displayName: 'Motivational Body',
      description: 'Clinical MI copy (about 100–150 words).',
      isLocalized: true,
      sortOrder: 20,
    },
    CtaButtonText: {
      type: 'string',
      displayName: 'CTA Button Text',
      isLocalized: true,
      sortOrder: 30,
    },
    CtaDeepLink: {
      type: 'string',
      displayName: 'CTA Deep Link',
      description: 'Where the button goes, e.g. #launch-hygia.',
      sortOrder: 40,
    },
    HeroImage: {
      type: 'contentReference',
      allowedTypes: ['_image'],
      displayName: 'Hero Image',
      description: 'Optional supporting image.',
      sortOrder: 50,
    },
  },
});

type Props = { content: ContentProps<typeof CCOClinicalHeroBlockContentType> };

export default function CCOClinicalHeroBlock({ content }: Props) {
  const { pa, src } = getPreviewUtils(content);
  const { getAlt } = damAssets(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const editing = Boolean((content as { __context?: { edit?: boolean } }).__context?.edit);

  return (
    <section {...pa(block)} className="w-full bg-slate-950 px-6 py-14 text-slate-100">
      <div className="mx-auto max-w-3xl">
        <h1
          {...pa('Headline')}
          className="text-3xl font-bold tracking-tight text-white md:text-4xl"
        >
          {content.Headline}
        </h1>
        <div
          {...pa('MotivationalBody')}
          className="prose prose-invert mt-5 max-w-none prose-p:text-slate-300"
        >
          <RichTextRenderer content={content.MotivationalBody?.json} />
        </div>
        {content.HeroImage && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            {...pa('HeroImage')}
            src={src(content.HeroImage)}
            alt={getAlt(content.HeroImage, '')}
            className="mt-6 max-h-64 w-full rounded-2xl object-cover"
          />
        )}
        {content.CtaButtonText && (
          <a
            {...pa('CtaButtonText')}
            // Inert while editing so clicking the button selects the field
            // instead of navigating away.
            href={editing ? undefined : content.CtaDeepLink || '#'}
            className="mt-7 inline-flex items-center rounded-xl bg-teal-500 px-5 py-3 text-sm font-semibold text-slate-950 transition hover:bg-teal-400"
          >
            {content.CtaButtonText}
          </a>
        )}
      </div>
    </section>
  );
}
