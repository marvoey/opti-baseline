import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import CtaButton from '../app/_components/CtaButton';
import RsImage from '../app/_components/RsImage';
import { blockWidth, widthClass } from './blockWidth';
import { urlOf } from './shared';

export const GtaHeroContentType = contentType({
  key: 'GtaHeroBlock',
  baseType: '_component',
  displayName: '[GTA] Hero Banner',
  description: 'Full-bleed hero with a background image, eyebrow label, headline, supporting text and up to two buttons.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    ...blockWidth(),
    Eyebrow: {
      type: 'string',
      displayName: 'Eyebrow',
      description: 'Small yellow label above the headline, for example New or Out Now.',
      isLocalized: true,
      sortOrder: 10,
    },
    Headline: {
      type: 'string',
      displayName: 'Headline',
      description: 'Main page headline, rendered as the H1.',
      isLocalized: true,
      sortOrder: 20,
    },
    Subtext: {
      type: 'string',
      displayName: 'Supporting Text',
      description: 'One or two sentences under the headline.',
      isLocalized: true,
      sortOrder: 30,
    },
    BackgroundImageUrl: {
      type: 'url',
      displayName: 'Background Image URL',
      description: 'Full-width background artwork. A dark gradient is added automatically for text contrast.',
      sortOrder: 40,
    },
    PrimaryCta: {
      type: 'link',
      displayName: 'Primary Button',
      description: 'Solid yellow button.',
      isLocalized: true,
      sortOrder: 50,
    },
    SecondaryCta: {
      type: 'link',
      displayName: 'Secondary Button',
      description: 'Outline button.',
      isLocalized: true,
      sortOrder: 60,
    },
    Alignment: {
      type: 'string',
      displayName: 'Text Alignment',
      description: 'Where the text sits. Default: Left.',
      sortOrder: 70,
      enum: [
        { value: 'left', displayName: 'Left' },
        { value: 'center', displayName: 'Center' },
      ],
    },
    Height: {
      type: 'string',
      displayName: 'Height',
      description: 'Minimum hero height. Default: Standard.',
      sortOrder: 80,
      enum: [
        { value: 'compact', displayName: 'Compact' },
        { value: 'standard', displayName: 'Standard' },
        { value: 'tall', displayName: 'Tall' },
      ],
    },
  },
});

type Props = { content: ContentProps<typeof GtaHeroContentType> };

const HEIGHT: Record<string, string> = {
  compact: 'min-h-[320px] md:min-h-[400px]',
  standard: 'min-h-[460px] md:min-h-[580px]',
  tall: 'min-h-[560px] md:min-h-[740px]',
};

export default function GtaHero({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const center = content.Alignment === 'center';
  const background = urlOf(content.BackgroundImageUrl);
  const height = HEIGHT[content.Height ?? 'standard'] ?? HEIGHT.standard;

  return (
    <section {...pa(block)} className={`relative isolate flex w-full items-end overflow-hidden bg-rs-ink ${height}`}>
      <RsImage
        src={background}
        alt=""
        loading="eager"
        className="absolute inset-0 -z-20 h-full w-full object-cover"
      />
      <div aria-hidden className="absolute inset-0 -z-10 bg-gradient-to-t from-black via-black/55 to-black/10" />

      <div className={`mx-auto w-full px-6 py-14 md:py-20 ${widthClass(content.BlockWidth)}`}>
        <div className={`flex flex-col gap-5 ${center ? 'items-center text-center' : 'items-start'}`}>
          {content.Eyebrow ? (
            <p
              {...pa('Eyebrow')}
              className="rounded-full bg-rs-yellow px-3 py-1 text-xs font-bold uppercase tracking-wider text-black"
            >
              {content.Eyebrow}
            </p>
          ) : null}
          {content.Headline ? (
            <h1
              {...pa('Headline')}
              className="max-w-4xl text-5xl font-black leading-[0.95] tracking-tighter md:text-7xl"
            >
              {content.Headline}
            </h1>
          ) : null}
          {content.Subtext ? (
            <p {...pa('Subtext')} className="max-w-2xl text-base leading-relaxed text-white/80 md:text-lg">
              {content.Subtext}
            </p>
          ) : null}
          {content.PrimaryCta?.text || content.SecondaryCta?.text ? (
            <div className="mt-2 flex flex-wrap gap-3">
              <CtaButton link={content.PrimaryCta} variant="yellow" />
              <CtaButton link={content.SecondaryCta} variant="outline" />
            </div>
          ) : null}
        </div>
      </div>
    </section>
  );
}
