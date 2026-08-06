import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';

export const CardItemBlockContentType = contentType({
  key: 'CardItemBlock',
  baseType: '_component',
  displayName: '(Verticals) Card Item Block',
  description: 'A single card representing a product, article, doctor, or account.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Image: {
      type: 'contentReference',
      allowedTypes: ['_image'],
      displayName: 'Card Image / Icon',
      sortOrder: 10,
    },
    EyebrowText: {
      type: 'string',
      displayName: 'Eyebrow Text',
      isLocalized: true,
      sortOrder: 20,
    },
    Title: {
      type: 'string',
      displayName: 'Title',
      isLocalized: true,
      sortOrder: 30,
    },
    FeatureList: {
      type: 'richText',
      displayName: 'Feature List',
      isLocalized: true,
      sortOrder: 40,
    },
    ValueOrPrice: {
      type: 'string',
      displayName: 'Value / Price',
      isLocalized: true,
      sortOrder: 50,
    },
    PrimaryCTA: {
      type: 'url',
      displayName: 'Primary Call to Action',
      sortOrder: 60,
    },
    Badge: {
      type: 'string',
      displayName: 'Badge Highlight',
      description: 'e.g., Recommended, Best Match',
      isLocalized: true,
      sortOrder: 70,
    },
  },
});

type Props = { content: ContentProps<typeof CardItemBlockContentType> };

export default function CardItemBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const imageUrl = (content.Image as any)?.url?.default as string | undefined;

  return (
    <article
      {...pa(block)}
      className="relative flex flex-col bg-white rounded-[32px] border-4 border-[#08251A] shadow-[8px_8px_0px_#08251A] overflow-hidden"
    >
      {content.Badge && (
        <div
          {...pa('Badge')}
          className="absolute top-4 right-4 px-3 py-1 bg-[#ABFF44] text-[#08251A] text-xs font-black uppercase rounded-full border-2 border-[#08251A]"
        >
          {content.Badge}
        </div>
      )}

      {imageUrl && (
        <div {...pa('Image')} className="w-full aspect-video overflow-hidden border-b-4 border-[#08251A]">
          <img src={imageUrl} alt={content.Title ?? ''} className="w-full h-full object-cover" />
        </div>
      )}

      <div className="flex flex-col flex-1 p-6 space-y-3">
        {content.EyebrowText && (
          <span {...pa('EyebrowText')} className="text-xs font-black uppercase tracking-widest text-[#197050]">
            {content.EyebrowText}
          </span>
        )}

        {content.Title && (
          <h3 {...pa('Title')} className="text-xl font-black text-[#08251A] tracking-tight">
            {content.Title}
          </h3>
        )}

        {content.FeatureList?.json && (
          <div {...pa('FeatureList')} className="prose prose-sm text-[#08251A]">
            <RichTextRenderer content={content.FeatureList.json} />
          </div>
        )}

        {content.ValueOrPrice && (
          <p {...pa('ValueOrPrice')} className="text-2xl font-black text-[#08251A] mt-auto pt-2">
            {content.ValueOrPrice}
          </p>
        )}

        {content.PrimaryCTA && (
          <a
            {...pa('PrimaryCTA')}
            href={content.PrimaryCTA as unknown as string}
            className="mt-4 w-full flex items-center justify-center gap-2 px-6 py-4 bg-[#08251A] hover:bg-[#197050] text-white font-black rounded-[24px] border-4 border-[#08251A] transition-colors"
          >
            <span>Learn More</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="3" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
            </svg>
          </a>
        )}
      </div>
    </article>
  );
}
