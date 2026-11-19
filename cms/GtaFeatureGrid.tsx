import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import CtaButton from '../app/_components/CtaButton';
import EmptyBlock from '../app/_components/EmptyBlock';
import RsImage from '../app/_components/RsImage';
import { urlOf } from './shared';

/** One feature card. Embedded inside the Feature Grid block, not placed on its own. */
export const GtaFeatureItemContentType = contentType({
  key: 'GtaFeatureItem',
  baseType: '_component',
  displayName: '[GTA] Feature Item',
  description: 'A card in a Feature Grid: optional image, kicker label, title, short copy and an optional button.',
  properties: {
    Kicker: {
      type: 'string',
      displayName: 'Kicker',
      description: 'Small yellow label above the title, for example 01 or New.',
      isLocalized: true,
      sortOrder: 10,
    },
    Title: {
      type: 'string',
      displayName: 'Title',
      isLocalized: true,
      sortOrder: 20,
    },
    Body: {
      type: 'string',
      displayName: 'Body',
      isLocalized: true,
      sortOrder: 30,
    },
    ImageUrl: {
      type: 'url',
      displayName: 'Image URL',
      sortOrder: 40,
    },
    Cta: {
      type: 'link',
      displayName: 'Button',
      isLocalized: true,
      sortOrder: 50,
    },
  },
});

export const GtaFeatureGridContentType = contentType({
  key: 'GtaFeatureGridBlock',
  baseType: '_component',
  displayName: '[GTA] Feature Grid',
  description: 'Responsive grid of feature cards with an optional heading and intro, in two, three or four columns.',
  // Section-level only: this block holds lists of inline items (array of components), and the CMS does not
  // allow element-enabled blocks to have component properties. It still works in the experience outline
  // and in Page > Content, just not inside a section column.
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Eyebrow: {
      type: 'string',
      displayName: 'Eyebrow',
      isLocalized: true,
      sortOrder: 10,
    },
    Heading: {
      type: 'string',
      displayName: 'Heading',
      isLocalized: true,
      sortOrder: 20,
    },
    Intro: {
      type: 'string',
      displayName: 'Intro',
      isLocalized: true,
      sortOrder: 30,
    },
    Columns: {
      type: 'string',
      displayName: 'Columns',
      description: 'Cards per row on wide screens. Default: 3.',
      sortOrder: 40,
      enum: [
        { value: '2', displayName: '2 columns' },
        { value: '3', displayName: '3 columns' },
        { value: '4', displayName: '4 columns' },
      ],
    },
    Items: {
      type: 'array',
      displayName: 'Items',
      isLocalized: true,
      sortOrder: 50,
      items: {
        type: 'component',
        contentType: GtaFeatureItemContentType,
      },
    },
  },
});

type Props = { content: ContentProps<typeof GtaFeatureGridContentType> };
type Item = NonNullable<Props['content']['Items']>[number];

const COLUMNS: Record<string, string> = {
  '2': 'sm:grid-cols-2',
  '3': 'sm:grid-cols-2 lg:grid-cols-3',
  '4': 'sm:grid-cols-2 lg:grid-cols-4',
};

function FeatureCard({ item }: { item: Item }) {
  const image = urlOf(item.ImageUrl);
  return (
    <li className="group flex flex-col overflow-hidden rounded-3xl bg-rs-card">
      {image ? (
        <div className="relative aspect-[16/10] overflow-hidden bg-rs-panel">
          <RsImage
            src={image}
            alt=""
            className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
          />
        </div>
      ) : null}
      <div className="flex flex-1 flex-col gap-3 p-6">
        {item.Kicker ? (
          <span className="text-xs font-extrabold uppercase tracking-widest text-rs-yellow">{item.Kicker}</span>
        ) : null}
        {item.Title ? <h3 className="text-xl font-extrabold tracking-tight">{item.Title}</h3> : null}
        {item.Body ? <p className="text-sm leading-relaxed text-rs-muted">{item.Body}</p> : null}
        <CtaButton link={item.Cta} variant="outline" className="mt-auto w-fit" />
      </div>
    </li>
  );
}

export default function GtaFeatureGrid({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const items = content.Items ?? [];
  const columns = COLUMNS[content.Columns ?? '3'] ?? COLUMNS['3'];

  return (
    <section {...pa(block)} className="w-full px-6 py-12">
      <div className="mx-auto max-w-6xl">
        {content.Eyebrow || content.Heading || content.Intro ? (
          <header className="mb-8 flex max-w-3xl flex-col gap-3">
            {content.Eyebrow ? (
              <p {...pa('Eyebrow')} className="w-fit rounded-full bg-rs-yellow px-3 py-1 text-xs font-bold uppercase tracking-wider text-black">
                {content.Eyebrow}
              </p>
            ) : null}
            {content.Heading ? (
              <h2 {...pa('Heading')} className="text-3xl font-black tracking-tight md:text-5xl">
                {content.Heading}
              </h2>
            ) : null}
            {content.Intro ? (
              <p {...pa('Intro')} className="text-base leading-relaxed text-rs-muted md:text-lg">
                {content.Intro}
              </p>
            ) : null}
          </header>
        ) : null}

        {items.length > 0 ? (
          <ul {...pa('Items')} className={`grid gap-5 ${columns}`}>
            {items.map((item, i) => (
              <FeatureCard key={i} item={item} />
            ))}
          </ul>
        ) : (
          <EmptyBlock title="This grid has no items yet" hint="Add Feature Item entries to the Items property." />
        )}
      </div>
    </section>
  );
}
