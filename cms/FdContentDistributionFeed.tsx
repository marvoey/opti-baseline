import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { blockNode } from './shared';
import { Sparkles, Video, FileText, ArrowRight } from 'lucide-react';
import type { ContentFeedItem } from '@/app/_components/fd/types';

export const FdContentDistributionFeedContentType = contentType({
  key: 'FdContentDistributionFeed',
  baseType: '_component',
  displayName: 'Floor & Decor Automated Content Feed (Graph)',
  description: 'Dynamic carousel aggregating blogs, TV Page videos, and installation guides by taxonomy.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Heading: { type: 'string', displayName: 'Feed Heading', isLocalized: true, sortOrder: 10 },
    Subheading: { type: 'string', displayName: 'Subheading', isLocalized: true, sortOrder: 20 },
    TargetTaxonomyTag: {
      type: 'string',
      format: 'shortString',
      displayName: 'Filter Tag (e.g., Tile, Hardwood, Luxury Vinyl)',
      sortOrder: 30,
    },
    ItemLimit: { type: 'integer', displayName: 'Max Items to Display', sortOrder: 40 },
  },
});

const MOCK_ITEMS: ContentFeedItem[] = [
  {
    id: 'f1',
    type: 'Video Guide (TV Page)',
    title: 'How to Install 12x24 Large Format Porcelain Like a Pro',
    tag: 'Installation',
    durationOrReadTime: '4:18 min',
    thumbnailUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=600&q=80',
    viewsOrAuthor: '18.4k views'
  },
  {
    id: 'f2',
    type: 'DIY Article (Blog)',
    title: 'Zellige vs. Marble Look: Which Backsplash Fits Your Kitchen?',
    tag: 'Design Trends',
    durationOrReadTime: '3 min read',
    thumbnailUrl: 'https://images.unsplash.com/photo-1595428774223-ef52624120d2?auto=format&fit=crop&w=600&q=80',
    viewsOrAuthor: 'Floor & Decor Design Studio'
  },
  {
    id: 'f3',
    type: 'Installation Guide',
    title: 'Commercial PEI Rating & Sealing Guide for Polished Tile',
    tag: 'Maintenance',
    durationOrReadTime: '5 min read',
    thumbnailUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    viewsOrAuthor: 'Technical Services'
  }
];

export default function FdContentDistributionFeed({ content }: { content: ContentProps<typeof FdContentDistributionFeedContentType> }) {
  const { pa } = getPreviewUtils(content);
  const items = MOCK_ITEMS.slice(0, content.ItemLimit || 3);

  return (
    <section {...pa(blockNode(content))} className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex flex-wrap items-end justify-between mb-6 border-b border-neutral-200 pb-4">
        <div>
          <span className="text-xs font-bold text-[#df4a26] uppercase tracking-wider flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" /> Optimizely Graph Automated Distribution
          </span>
          <h2 {...pa('Heading')} className="text-2xl font-black text-[#1b2a4a] mt-1">
            {content.Heading || 'Inspiration, Installation Videos & Guides'}
          </h2>
          <p className="text-xs text-neutral-500 mt-1">
            {content.Subheading || `Auto-queried across blogs and TV Page via tag: "${content.TargetTaxonomyTag || 'Tile'}"`}
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {items.map((item) => (
          <div key={item.id} className="bg-white rounded-lg border border-neutral-200 overflow-hidden shadow-sm hover:shadow-md transition flex flex-col justify-between">
            <div>
              <div className="h-44 relative overflow-hidden bg-neutral-100">
                <img src={item.thumbnailUrl} alt={item.title} className="w-full h-full object-cover" />
                <span className="absolute top-2 left-2 bg-[#1b2a4a] text-white text-[10px] font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  {item.type.includes('Video') ? <Video className="w-3 h-3 text-[#df4a26]" /> : <FileText className="w-3 h-3 text-[#df4a26]" />}
                  {item.type}
                </span>
                <span className="absolute bottom-2 right-2 bg-black/70 text-white text-[10px] px-2 py-0.5 rounded">
                  {item.durationOrReadTime}
                </span>
              </div>
              <div className="p-4">
                <span className="text-[11px] font-bold text-[#df4a26] uppercase">{item.tag}</span>
                <h3 className="font-bold text-sm text-[#1b2a4a] mt-1 hover:text-[#df4a26] cursor-pointer leading-snug">
                  {item.title}
                </h3>
              </div>
            </div>
            <div className="p-4 pt-0 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-500 mt-2">
              <span>{item.viewsOrAuthor}</span>
              <span className="text-[#df4a26] font-bold flex items-center gap-0.5">Learn more <ArrowRight className="w-3 h-3" /></span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
