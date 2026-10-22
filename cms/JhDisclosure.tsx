import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';

export const JhDisclosureContentType = contentType({
  key: 'JhDisclosure',
  baseType: '_component',
  displayName: 'JH Disclosure',
  description: 'Small-print legal or loan disclosure text. Separate paragraphs with a blank line.',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    Title: { type: 'string', displayName: 'Title', isLocalized: true, sortOrder: 1 },
    Body: { type: 'string', displayName: 'Body (blank line between paragraphs)', isLocalized: true, sortOrder: 2 },
  },
});

type Props = { content: ContentProps<typeof JhDisclosureContentType> };

export default function JhDisclosure({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const paragraphs = (content.Body ?? '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);

  return (
    <section {...pa(block)} className="bg-slate-100 px-4 sm:px-6 py-8">
      <div className="max-w-6xl mx-auto">
        {content.Title && (
          <h2 {...pa('Title')} className="text-sm font-bold uppercase tracking-wider text-slate-600 mb-3">
            {content.Title}
          </h2>
        )}
        <div {...pa('Body')} className="space-y-3 text-xs text-slate-500 leading-relaxed">
          {paragraphs.map((p, i) => (
            <p key={i}>{p}</p>
          ))}
        </div>
      </div>
    </section>
  );
}
