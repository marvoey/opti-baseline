import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';

export const RichTextValuePropBlockContentType = contentType({
  key: 'RichTextValuePropBlock',
  baseType: '_component',
  displayName: '(Verticals) Rich Text & Value Prop Block',
  description: 'Text component for headlines, paragraphs, and CTAs.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    EyebrowTag: {
      type: 'string',
      displayName: 'Eyebrow Tag',
      isLocalized: true,
      sortOrder: 10,
    },
    Headline: {
      type: 'richText',
      displayName: 'Headline',
      description: 'Supports inline highlights and underlines via rich text.',
      isLocalized: true,
      sortOrder: 20,
    },
    Body: {
      type: 'richText',
      displayName: 'Body Copy',
      isLocalized: true,
      sortOrder: 30,
    },
    PrimaryCTA: {
      type: 'url',
      displayName: 'Primary Call to Action',
      sortOrder: 40,
    },
    ShowSocialProof: {
      type: 'boolean',
      displayName: 'Show Social Proof Widget',
      description: "Toggles the 'Trusted by X million' avatar UI.",
      sortOrder: 50,
    },
  },
});

type Props = { content: ContentProps<typeof RichTextValuePropBlockContentType> };

export default function RichTextValuePropBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  return (
    <div {...pa(block)} className="w-full flex flex-col gap-6">
      {content.EyebrowTag && (
        <span
          {...pa('EyebrowTag')}
          className="text-xs font-black uppercase tracking-widest text-[#197050]"
        >
          {content.EyebrowTag}
        </span>
      )}

      {content.Headline?.json && (
        <div
          {...pa('Headline')}
          className="text-4xl md:text-5xl font-black text-[#08251A] tracking-tighter leading-[1.1] [&_strong]:text-[#3AB533] [&_em]:underline [&_em]:not-italic"
        >
          <RichTextRenderer content={content.Headline.json} />
        </div>
      )}

      {content.Body?.json && (
        <div {...pa('Body')} className="prose prose-lg text-[#08251A] max-w-none">
          <RichTextRenderer content={content.Body.json} />
        </div>
      )}

      {content.ShowSocialProof && (
        <div className="flex items-center gap-3">
          <div className="flex -space-x-3">
            {[1, 2, 3, 4].map((i) => (
              <div
                key={i}
                className="w-10 h-10 rounded-full bg-[#E4F0DA] border-2 border-white flex items-center justify-center text-xs font-bold text-[#08251A]"
              >
                {i}
              </div>
            ))}
          </div>
          <span className="text-sm font-bold text-[#197050]">Trusted by millions of customers</span>
        </div>
      )}

      {content.PrimaryCTA && (
        <a
          {...pa('PrimaryCTA')}
          href={content.PrimaryCTA as unknown as string}
          className="self-start flex items-center gap-2 px-8 py-4 bg-[#08251A] hover:bg-[#197050] text-white font-black rounded-[32px] border-4 border-[#08251A] shadow-[4px_4px_0px_#08251A] hover:shadow-[2px_2px_0px_#08251A] hover:translate-y-[2px] transition-all"
        >
          <span>Get Started</span>
          <svg className="w-5 h-5" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
          </svg>
        </a>
      )}
    </div>
  );
}
