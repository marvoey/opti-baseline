import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { BadgeDollarSign, FileCheck2, MessageCircle, ShieldCheck, Smartphone, Sparkles } from 'lucide-react';
import { numberedItems, numberedProperties } from './shared';

const COUNT = 6;
const ICONS = [MessageCircle, Smartphone, FileCheck2, ShieldCheck, BadgeDollarSign, Sparkles];

export const JhFeatureListContentType = contentType({
  key: 'JhFeatureList',
  baseType: '_component',
  displayName: 'JH Feature List',
  description: 'Icon-led list of up to six short feature bullets.',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    Title: { type: 'string', displayName: 'Title', isLocalized: true, sortOrder: 1 },
    ...numberedProperties('Item', 'Feature', COUNT, [
      { key: 'Title', label: 'Title' },
      { key: 'Text', label: 'Text' },
    ]),
  },
});

type Props = { content: ContentProps<typeof JhFeatureListContentType> };

export default function JhFeatureList({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const items = numberedItems(content, 'Item', COUNT, ['Title', 'Text']);

  return (
    <section {...pa(block)} className="px-4 sm:px-6 py-12">
      <div className="max-w-6xl mx-auto">
        {content.Title && (
          <h2 {...pa('Title')} className="text-2xl sm:text-3xl font-extrabold text-jh-navy mb-8">
            {content.Title}
          </h2>
        )}
        <ul className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => {
            const Icon = ICONS[i % ICONS.length];
            return (
              <li key={i} className="flex gap-4">
                <span className="shrink-0 w-11 h-11 rounded-xl bg-blue-50 text-jh-navy flex items-center justify-center">
                  <Icon className="w-5 h-5" />
                </span>
                <div>
                  <h3 {...pa(`Item${item.n}Title`)} className="font-bold text-jh-navy">
                    {item.Title}
                  </h3>
                  <p {...pa(`Item${item.n}Text`)} className="text-sm text-slate-600 mt-1 leading-relaxed">
                    {item.Text}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
