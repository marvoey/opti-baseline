import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';

export const AccordionItemContentType = contentType({
  key: 'UpsAccordionItem',
  baseType: '_component',
  displayName: 'UPS Accordion Item',
  description: 'A collapsible notice: a title and rich-text body.',
  properties: {
    Title: { type: 'string', displayName: 'Title', isLocalized: true, sortOrder: 10 },
    Body: { type: 'richText', displayName: 'Body', isLocalized: true, sortOrder: 20 },
  },
});

export const AccordionSectionContentType = contentType({
  key: 'UpsAccordionSection',
  baseType: '_component',
  displayName: 'UPS Important Updates',
  description: '"Important Updates": collapsible regulatory and policy notices.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    Heading: { type: 'string', displayName: 'Heading', isLocalized: true, sortOrder: 10 },
    Notices: {
      type: 'array',
      displayName: 'Items',
      isLocalized: true,
      items: { type: 'component', contentType: AccordionItemContentType },
      sortOrder: 20,
    },
  },
});

type Props = { content: ContentProps<typeof AccordionSectionContentType> };

export default function AccordionSection({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const items = content.Notices ?? [];

  return (
    <section className="w-full px-4 py-12">
      <div className="mx-auto max-w-4xl">
        <h2 {...pa('Heading')} className="mb-6 text-3xl font-bold text-blue-950">
          {content.Heading || 'Important Updates'}
        </h2>
        {/* Native <details> — accessible and needs no client JS */}
        <div {...pa('Notices')} className="divide-y divide-blue-100 rounded-xl border border-blue-100">
          {items.map((item, i) => (
            <details key={i} className="group p-4">
              <summary className="cursor-pointer list-none font-bold text-blue-950 marker:content-none">
                {item.Title}
              </summary>
              <div className="prose mt-3 max-w-none text-sm">
                <RichTextRenderer content={item.Body?.json} />
              </div>
            </details>
          ))}
        </div>
      </div>
    </section>
  );
}
