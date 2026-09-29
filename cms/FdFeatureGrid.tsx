import { blockNode } from './shared';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';
import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { ICONS, ICON_OPTIONS } from '@/app/_components/fd/icons';

export const FdFeatureItemContentType = contentType({
  key: 'FdFeatureItem',
  baseType: '_component',
  displayName: 'F&D Feature Item',
  properties: {
    Icon: { type: 'string', displayName: 'Icon', enum: ICON_OPTIONS, sortOrder: 10 },
    Title: { type: 'string', format: 'shortString', displayName: 'Title', sortOrder: 20 },
    Caption: { type: 'string', displayName: 'Caption', sortOrder: 30 },
    ImageUrl: { type: 'string', displayName: 'Image URL', sortOrder: 40 },
    Badge: { type: 'string', format: 'shortString', displayName: 'Badge', sortOrder: 50 },
    Href: { type: 'string', format: 'shortString', displayName: 'Link URL', sortOrder: 60 },
  },
});

/**
 * Feature grid — one block for the value-prop bar, numbered steps, sub-category
 * tiles and image category cards, with an optional section header built in.
 */
export const FdFeatureGridContentType = contentType({
  key: 'FdFeatureGrid',
  baseType: '_component',
  displayName: 'F&D Feature Grid',
  description: 'Section header + grid of icon/image items (bar, steps, tiles or image cards).',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Layout: {
      type: 'string',
      displayName: 'Layout',
      enum: [
        { value: 'bar', displayName: 'Value-prop bar' },
        { value: 'steps', displayName: 'Numbered steps' },
        { value: 'tiles', displayName: 'Text tiles' },
        { value: 'cards', displayName: 'Image cards' },
      ],
      sortOrder: 5,
    },
    Eyebrow: { type: 'string', format: 'shortString', displayName: 'Eyebrow', isLocalized: true, sortOrder: 10 },
    Heading: { type: 'string', format: 'shortString', displayName: 'Heading', isLocalized: true, sortOrder: 20 },
    Subtext: { type: 'string', displayName: 'Subtext', isLocalized: true, sortOrder: 30 },
    LinkLabel: { type: 'string', format: 'shortString', displayName: 'Link label', isLocalized: true, sortOrder: 40 },
    LinkUrl: { type: 'string', format: 'shortString', displayName: 'Link URL', sortOrder: 50 },
    Items: {
      type: 'array',
      displayName: 'Items',
      isLocalized: true,
      items: { type: 'component', contentType: FdFeatureItemContentType },
      sortOrder: 60,
    },
  },
});

type Item = ContentProps<typeof FdFeatureItemContentType>;

function ItemBody({ it, layout, i }: { it: Item; layout: string; i: number }) {
  const Icon = it.Icon ? ICONS[it.Icon] : undefined;
  if (layout === 'bar')
    return (
      <div className="p-4 flex items-center gap-3">
        {Icon && <Icon className="w-8 h-8 text-brand-orange shrink-0" />}
        <div>
          <h4 className="font-bold text-xs uppercase text-brand-navy">{it.Title}</h4>
          <p className="text-[11px] text-neutral-500">{it.Caption}</p>
        </div>
      </div>
    );
  if (layout === 'steps')
    return (
      <div className="bg-white p-6 rounded-lg border border-neutral-200 shadow-sm text-center">
        <div className="w-10 h-10 bg-brand-orange/10 text-brand-orange font-black rounded-full flex items-center justify-center mx-auto mb-3">{i + 1}</div>
        <h3 className="font-bold text-sm text-brand-navy mb-2">{it.Title}</h3>
        <p className="text-xs text-neutral-600 leading-relaxed">{it.Caption}</p>
      </div>
    );
  if (layout === 'tiles')
    return (
      <div className="bg-white border border-neutral-200 hover:border-brand-orange rounded-md p-2.5 text-center transition shadow-sm hover:shadow">
        <span className="block text-xs font-bold text-brand-navy">{it.Title}</span>
        <span className="block text-[10px] text-neutral-500">{it.Caption}</span>
      </div>
    );
  return (
    <div className="group bg-white rounded-lg border border-neutral-200 overflow-hidden hover:shadow-lg transition flex flex-col h-full">
      <div className="h-32 overflow-hidden relative bg-neutral-100">
        {it.ImageUrl && (
          // eslint-disable-next-line @next/next/no-img-element
          <img src={it.ImageUrl} alt={it.Title ?? ''} className="w-full h-full object-cover group-hover:scale-105 transition duration-300" />
        )}
        {it.Badge && <span className="absolute top-2 left-2 bg-brand-navy/90 text-white text-[9px] font-bold px-1.5 py-0.5 rounded">{it.Badge}</span>}
      </div>
      <div className="p-3 text-center flex-1 flex items-center justify-center">
        <h3 className="font-bold text-xs text-brand-navy group-hover:text-brand-orange transition">{it.Title}</h3>
      </div>
    </div>
  );
}

const GRID: Record<string, string> = {
  bar: 'bg-white rounded-lg shadow-md border border-neutral-200 grid grid-cols-2 md:grid-cols-4 divide-y md:divide-y-0 md:divide-x divide-neutral-200',
  steps: 'grid grid-cols-1 md:grid-cols-3 gap-6',
  tiles: 'grid grid-cols-2 sm:grid-cols-4 md:grid-cols-6 gap-3',
  cards: 'grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4',
};

export default function FdFeatureGrid({ content }: { content: ContentProps<typeof FdFeatureGridContentType> }) {
  const { pa } = getPreviewUtils(content);
  const layout = content.Layout ?? 'cards';
  const items = content.Items ?? [];
  const hasHeader = content.Heading || content.Eyebrow;

  return (
    <section {...pa(blockNode(content))} className={`max-w-7xl mx-auto px-4 ${layout === 'bar' ? '-mt-6 relative z-20' : ''}`}>
      {hasHeader && (
        <div className="flex items-end justify-between mb-6 border-b border-neutral-200 pb-3">
          <div>
            {content.Eyebrow && <span className="text-xs font-bold text-brand-orange uppercase">{content.Eyebrow}</span>}
            <h2 {...pa('Heading')} className="text-2xl font-black tracking-tight text-brand-navy">{content.Heading}</h2>
            {content.Subtext && <p className="text-xs text-neutral-500 mt-1">{content.Subtext}</p>}
          </div>
          {content.LinkLabel && (
            <Link href={content.LinkUrl ?? '#'} className="text-brand-orange font-bold text-xs flex items-center gap-1 hover:underline">
              {content.LinkLabel} <ChevronRight className="w-4 h-4" />
            </Link>
          )}
        </div>
      )}
      <div {...pa('Items')} className={GRID[layout] ?? GRID.cards}>
        {items.map((it, i) => {
          const body = <ItemBody it={it} layout={layout} i={i} />;
          return it.Href ? (
            <Link key={i} href={it.Href} className="block h-full">{body}</Link>
          ) : (
            <div key={i} className="h-full">{body}</div>
          );
        })}
      </div>
    </section>
  );
}
