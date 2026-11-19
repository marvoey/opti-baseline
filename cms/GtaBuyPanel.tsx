import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import CtaButton from '../app/_components/CtaButton';
import RsImage from '../app/_components/RsImage';
import { blockWidth, widthClass } from './blockWidth';
import { urlOf } from './shared';

export const GtaBuyPanelContentType = contentType({
  key: 'GtaBuyPanelBlock',
  baseType: '_component',
  displayName: '[GTA] Buy Panel',
  description: 'Purchase panel with box art, copy, platform badges and a Buy Now button.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    ...blockWidth(),
    Heading: {
      type: 'string',
      displayName: 'Heading',
      isLocalized: true,
      sortOrder: 10,
    },
    Body: {
      type: 'string',
      displayName: 'Body',
      isLocalized: true,
      sortOrder: 20,
    },
    BoxArtUrl: {
      type: 'url',
      displayName: 'Box Art URL',
      description: 'Optional product art shown beside the text.',
      sortOrder: 30,
    },
    Platforms: {
      type: 'array',
      displayName: 'Platforms',
      description: 'One badge per entry, for example PlayStation 5 or Xbox Series X and S.',
      sortOrder: 40,
      items: {
        type: 'string',
      },
    },
    Cta: {
      type: 'link',
      displayName: 'Buy Button',
      isLocalized: true,
      sortOrder: 50,
    },
    Note: {
      type: 'string',
      displayName: 'Small Print',
      description: 'Optional fine print under the button.',
      isLocalized: true,
      sortOrder: 60,
    },
  },
});

type Props = { content: ContentProps<typeof GtaBuyPanelContentType> };

export default function GtaBuyPanel({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const art = urlOf(content.BoxArtUrl);
  const platforms = (content.Platforms ?? []).filter(Boolean);

  return (
    <section {...pa(block)} className="w-full px-6 py-12">
      <div className={`mx-auto ${widthClass(content.BlockWidth)}`}>
        <div className="grid items-center gap-8 overflow-hidden rounded-3xl border border-rs-line bg-rs-panel p-8 md:p-12 md:grid-cols-[auto_1fr]">
          {art ? (
            <RsImage
              src={art}
              alt=""
              className="mx-auto aspect-[3/4] w-44 rounded-xl object-cover shadow-2xl shadow-black/60 md:w-52"
            />
          ) : null}
          <div className={`flex flex-col items-start gap-4 ${art ? '' : 'md:col-span-2'}`}>
            {content.Heading ? (
              <h2 {...pa('Heading')} className="text-3xl font-black tracking-tight md:text-5xl">
                {content.Heading}
              </h2>
            ) : null}
            {content.Body ? (
              <p {...pa('Body')} className="max-w-xl text-base leading-relaxed text-rs-muted">
                {content.Body}
              </p>
            ) : null}
            {platforms.length > 0 ? (
              <ul {...pa('Platforms')} className="flex flex-wrap gap-2">
                {platforms.map((platform) => (
                  <li
                    key={platform}
                    className="rounded-full border border-white/20 bg-white/5 px-4 py-2 text-xs font-bold uppercase tracking-wider text-white/85"
                  >
                    {platform}
                  </li>
                ))}
              </ul>
            ) : null}
            <CtaButton link={content.Cta} variant="yellow" className="mt-2" />
            {content.Note ? (
              <p {...pa('Note')} className="text-xs text-white/45">
                {content.Note}
              </p>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
