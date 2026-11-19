import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import EmptyBlock from '../app/_components/EmptyBlock';
import RsImage from '../app/_components/RsImage';
import ScrollRow from '../app/_components/ScrollRow';
import { urlOf } from './shared';

/** One update. Embedded inside the Update Showcase block, not placed on its own. */
export const GtaUpdateCardContentType = contentType({
  key: 'GtaUpdateCard',
  baseType: '_component',
  displayName: '[GTA] Update Card',
  description: 'A layered update card: background art, optional character cutout and title logo.',
  properties: {
    Title: {
      type: 'string',
      displayName: 'Title',
      description: 'Update name. Used as the logo alt text, and shown as text when there is no logo.',
      isLocalized: true,
      sortOrder: 10,
    },
    BackgroundUrl: {
      type: 'url',
      displayName: 'Background Art URL',
      description: 'Bottom layer. Also the thumbnail in the marquee variant.',
      sortOrder: 20,
    },
    CutoutUrl: {
      type: 'url',
      displayName: 'Cutout Art URL',
      description: 'Optional transparent PNG layered over the background, anchored to the bottom.',
      sortOrder: 30,
    },
    LogoUrl: {
      type: 'url',
      displayName: 'Title Logo URL',
      description: 'Optional logo shown at the bottom of the card.',
      sortOrder: 40,
    },
    Cta: {
      type: 'link',
      displayName: 'Link',
      description: 'Makes the whole card clickable. Button text is not shown.',
      isLocalized: true,
      sortOrder: 50,
    },
  },
});

export const GtaUpdateShowcaseContentType = contentType({
  key: 'GtaUpdateShowcaseBlock',
  baseType: '_component',
  displayName: '[GTA] Update Showcase',
  description: 'Content updates shown either as a scrolling slider of layered cards or as an endless thumbnail marquee.',
  // Section-level only: this block holds lists of inline items (array of components), and the CMS does not
  // allow element-enabled blocks to have component properties. It still works in the experience outline
  // and in Page > Content, just not inside a section column.
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Heading: {
      type: 'string',
      displayName: 'Heading',
      isLocalized: true,
      sortOrder: 10,
    },
    Variant: {
      type: 'string',
      displayName: 'Variant',
      description: 'Slider shows tall layered cards with arrows. Marquee shows auto-scrolling thumbnails. Default: Slider.',
      sortOrder: 20,
      enum: [
        { value: 'slider', displayName: 'Slider' },
        { value: 'marquee', displayName: 'Marquee' },
      ],
    },
    Cards: {
      type: 'array',
      displayName: 'Updates',
      isLocalized: true,
      sortOrder: 30,
      items: {
        type: 'component',
        contentType: GtaUpdateCardContentType,
      },
    },
  },
});

type Props = { content: ContentProps<typeof GtaUpdateShowcaseContentType> };
type Card = NonNullable<Props['content']['Cards']>[number];

/** Split cards across rows, round-robin, so each marquee row has a similar mix. */
function toRows<T>(items: T[], rows: number): T[][] {
  const out: T[][] = Array.from({ length: rows }, () => []);
  items.forEach((item, i) => out[i % rows].push(item));
  return out;
}

function SliderCard({ card }: { card: Card }) {
  const title = card.Title ?? '';
  const logo = urlOf(card.LogoUrl);
  const href = card.Cta?.url?.default || undefined;
  const cls =
    'group relative block aspect-[4/5] w-[260px] shrink-0 snap-start overflow-hidden rounded-3xl bg-rs-card md:w-[320px] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-rs-yellow';

  const inner = (
    <>
      <RsImage
        src={urlOf(card.BackgroundUrl)}
        alt=""
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
      />
      <RsImage
        src={urlOf(card.CutoutUrl)}
        alt=""
        className="absolute inset-0 h-full w-full object-contain object-bottom transition-transform duration-700 group-hover:scale-110"
      />
      <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-transparent to-transparent" />
      {logo ? (
        <RsImage
          src={logo}
          alt={title}
          className="absolute inset-x-6 bottom-6 h-20 w-[calc(100%-3rem)] object-contain object-bottom"
        />
      ) : title ? (
        <h3 className="absolute inset-x-6 bottom-6 text-xl font-black leading-tight tracking-tight">{title}</h3>
      ) : null}
    </>
  );

  return href ? (
    <a href={href} aria-label={title || undefined} className={cls}>
      {inner}
    </a>
  ) : (
    <div className={cls}>{inner}</div>
  );
}

function MarqueeRow({ cards, index }: { cards: Card[]; index: number }) {
  if (cards.length === 0) return null;
  // Repeat short rows so the strip always overfills the viewport, then double it for a seamless loop.
  const base = Array.from({ length: Math.ceil(8 / cards.length) }, () => cards).flat();
  const strip = [...base, ...base];

  return (
    <div className="rs-marquee overflow-hidden">
      <ul
        className="rs-marquee-track flex w-max gap-4"
        style={{
          animationDuration: `${42 + index * 9}s`,
          animationDirection: index % 2 ? 'reverse' : 'normal',
        }}
      >
        {strip.map((card, i) => (
          <li
            key={i}
            aria-hidden={i >= base.length ? true : undefined}
            className="relative aspect-[16/10] w-56 shrink-0 overflow-hidden rounded-2xl bg-rs-card md:w-64"
          >
            <RsImage src={urlOf(card.BackgroundUrl)} alt="" className="absolute inset-0 h-full w-full object-cover" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
            {card.Title ? (
              <p className="absolute inset-x-4 bottom-3 text-sm font-extrabold leading-tight">{card.Title}</p>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function GtaUpdateShowcase({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const cards = content.Cards ?? [];
  const marquee = content.Variant === 'marquee';

  const heading = content.Heading ? (
    <h2 {...pa('Heading')} className="text-3xl font-black tracking-tight md:text-5xl">
      {content.Heading}
    </h2>
  ) : null;

  return (
    <section {...pa(block)} className="w-full overflow-hidden px-6 py-12">
      <div {...pa('Cards')} className="mx-auto max-w-7xl">
        {cards.length === 0 ? (
          <>
            {heading}
            <EmptyBlock title="This showcase has no updates yet" hint="Add Update Card items to the Updates property." />
          </>
        ) : marquee ? (
          <>
            {heading ? <div className="mb-6">{heading}</div> : null}
            <div className="flex flex-col gap-4">
              {toRows(cards, cards.length >= 9 ? 3 : cards.length >= 6 ? 2 : 1).map((row, i) => (
                <MarqueeRow key={i} cards={row} index={i} />
              ))}
            </div>
          </>
        ) : (
          <ScrollRow title={heading} label={content.Heading || 'Updates'}>
            {cards.map((card, i) => (
              <SliderCard key={i} card={card} />
            ))}
          </ScrollRow>
        )}
      </div>
    </section>
  );
}
