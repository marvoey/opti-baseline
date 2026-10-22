import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { numberedItems, numberedProperties } from './shared';

const COUNT = 12;

export const JhFaqAccordionContentType = contentType({
  key: 'JhFaqAccordion',
  baseType: '_component',
  displayName: 'JH FAQ Accordion',
  description: 'Expandable FAQ list (up to twelve questions). Emits FAQPage structured data.',
  compositionBehaviors: ['elementEnabled'],
  properties: {
    Title: { type: 'string', displayName: 'Title', isLocalized: true, sortOrder: 1 },
    ...numberedProperties('Faq', 'FAQ', COUNT, [
      { key: 'Question', label: 'Question' },
      { key: 'Answer', label: 'Answer' },
    ]),
  },
});

type Props = { content: ContentProps<typeof JhFaqAccordionContentType> };

export default function JhFaqAccordion({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const faqs = numberedItems(content, 'Faq', COUNT, ['Question', 'Answer']);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question',
      name: f.Question,
      acceptedAnswer: { '@type': 'Answer', text: f.Answer },
    })),
  };

  return (
    <section {...pa(block)} className="bg-jh-surface px-4 sm:px-6 py-12">
      <div className="max-w-3xl mx-auto">
        {content.Title && (
          <h2 {...pa('Title')} className="text-2xl sm:text-3xl font-extrabold text-jh-navy mb-6">
            {content.Title}
          </h2>
        )}
        <div className="divide-y divide-slate-200 bg-white rounded-2xl border border-slate-200 overflow-hidden">
          {faqs.map((faq) => (
            <details key={faq.n} className="group p-5">
              <summary
                {...pa(`Faq${faq.n}Question`)}
                className="cursor-pointer list-none font-bold text-jh-navy flex items-center justify-between gap-4"
              >
                {faq.Question}
                <span className="text-jh-red text-xl leading-none transition-transform group-open:rotate-45">+</span>
              </summary>
              <p {...pa(`Faq${faq.n}Answer`)} className="mt-3 text-sm text-slate-600 leading-relaxed">
                {faq.Answer}
              </p>
            </details>
          ))}
        </div>
      </div>
      {faqs.length > 0 && (
        <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      )}
    </section>
  );
}
