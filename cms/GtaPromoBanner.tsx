import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import CtaButton, { type CtaVariant } from '../app/_components/CtaButton';
import RsImage from '../app/_components/RsImage';
import { blockWidth, widthClass } from './blockWidth';
import { urlOf } from './shared';

export const GtaPromoBannerContentType = contentType({
  key: 'GtaPromoBannerBlock',
  baseType: '_component',
  displayName: '[GTA] Promo Banner',
  description: 'Rounded promo panel with heading, short copy, one button and optional image. Use for Mission Creator, Career Progress, license plates or feedback prompts.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    ...blockWidth(),
    Eyebrow: {
      type: 'string',
      displayName: 'Eyebrow',
      description: 'Small label above the heading.',
      isLocalized: true,
      sortOrder: 10,
    },
    Heading: {
      type: 'string',
      displayName: 'Heading',
      isLocalized: true,
      sortOrder: 20,
    },
    Body: {
      type: 'string',
      displayName: 'Body',
      description: 'One or two sentences.',
      isLocalized: true,
      sortOrder: 30,
    },
    Cta: {
      type: 'link',
      displayName: 'Button',
      isLocalized: true,
      sortOrder: 40,
    },
    ImageUrl: {
      type: 'url',
      displayName: 'Image URL',
      description: 'Optional artwork. Shown beside the text, or as a small thumbnail when the layout is Centered.',
      sortOrder: 50,
    },
    Layout: {
      type: 'string',
      displayName: 'Layout',
      description: 'Where the image sits relative to the text. Default: Image right.',
      sortOrder: 60,
      enum: [
        { value: 'image-right', displayName: 'Image right' },
        { value: 'image-left', displayName: 'Image left' },
        { value: 'centered', displayName: 'Centered' },
      ],
    },
    Theme: {
      type: 'string',
      displayName: 'Theme',
      description: 'Panel colour. Default: Dark.',
      sortOrder: 70,
      enum: [
        { value: 'dark', displayName: 'Dark card' },
        { value: 'panel', displayName: 'Outlined panel' },
        { value: 'yellow', displayName: 'Yellow' },
      ],
    },
  },
});

type Props = { content: ContentProps<typeof GtaPromoBannerContentType> };

const THEME: Record<string, { box: string; body: string; eyebrow: string; cta: CtaVariant }> = {
  dark: { box: 'bg-rs-card text-white', body: 'text-rs-muted', eyebrow: 'bg-rs-yellow text-black', cta: 'yellow' },
  panel: {
    box: 'border border-rs-line bg-rs-panel text-white',
    body: 'text-rs-muted',
    eyebrow: 'bg-rs-yellow text-black',
    cta: 'white',
  },
  yellow: { box: 'bg-rs-yellow text-black', body: 'text-black/75', eyebrow: 'bg-black text-rs-yellow', cta: 'black' },
};

export default function GtaPromoBanner({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const theme = THEME[content.Theme ?? 'dark'] ?? THEME.dark;
  const layout =
    content.Layout === 'image-left' || content.Layout === 'centered' ? content.Layout : 'image-right';
  const image = urlOf(content.ImageUrl);
  const centered = layout === 'centered';
  const split = !centered && !!image;

  return (
    <section {...pa(block)} className="w-full px-6 py-8 md:py-12">
      <div className={`mx-auto ${widthClass(content.BlockWidth)}`}>
        <div className={`overflow-hidden rounded-3xl ${theme.box} ${split ? 'grid md:grid-cols-2' : ''}`}>
          <div
            className={`flex flex-col justify-center gap-4 p-8 md:p-12 ${
              centered ? 'items-center text-center' : 'items-start'
            } ${split && layout === 'image-left' ? 'md:order-2' : ''}`}
          >
            {centered && image ? <RsImage src={image} alt="" className="h-28 w-auto object-contain" /> : null}
            {content.Eyebrow ? (
              <p
                {...pa('Eyebrow')}
                className={`rounded-full px-3 py-1 text-xs font-bold uppercase tracking-wider ${theme.eyebrow}`}
              >
                {content.Eyebrow}
              </p>
            ) : null}
            {content.Heading ? (
              <h2 {...pa('Heading')} className="text-3xl font-black tracking-tight md:text-5xl">
                {content.Heading}
              </h2>
            ) : null}
            {content.Body ? (
              <p {...pa('Body')} className={`max-w-xl text-base leading-relaxed ${theme.body}`}>
                {content.Body}
              </p>
            ) : null}
            <CtaButton link={content.Cta} variant={theme.cta} className="mt-2" />
          </div>
          {split ? (
            <div className="relative min-h-[240px] md:min-h-[340px]">
              <RsImage src={image} alt="" className="absolute inset-0 h-full w-full object-cover" />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
