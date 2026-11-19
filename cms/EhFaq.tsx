import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import JsonLd from '@/app/_components/JsonLd';

/**
 * "Frequently asked questions": a heading over an accordion of questions and answers.
 *
 * Each question is one line in `Items`, formatted `Question | Answer` (plain text). The same
 * lines are also published as FAQPage structured data (schema.org JSON-LD) in the page, so the
 * questions are readable by search engines and AI answer engines without anyone maintaining
 * a second copy. Use ONE FAQ block per page: a page should carry a single FAQPage.
 *
 * The accordion is plain HTML (`<details>`), so it works without JavaScript and the answers
 * are in the page source whether or not a question is open.
 *
 * Answers are editorial content, and for insurance they are regulated. Keep them general,
 * avoid promises about coverage or savings, and have compliance review the wording.
 */
export const EhFaqContentType = contentType({
  key: 'EhFaq',
  baseType: '_component',
  displayName: '[eHealth] FAQ',
  description:
    '[EH] Heading plus an accordion of questions and answers (Question | Answer). Also published as FAQPage structured data for search and AI answer engines. Use one per page.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Heading: {
      type: 'string',
      displayName: 'Heading',
      description: 'e.g. "Frequently asked questions". Leave blank to hide.',
      isLocalized: true,
      sortOrder: 10,
    },
    Intro: {
      type: 'string',
      displayName: 'Intro',
      description: 'Optional line under the heading.',
      isLocalized: true,
      sortOrder: 11,
    },
    Items: {
      type: 'array',
      displayName: 'Questions',
      description:
        'One per line (up to 12): Question | Answer. Plain text. The same text is published as FAQPage structured data.',
      isLocalized: true,
      sortOrder: 20,
      maxItems: 12,
      items: { type: 'string' },
    },
    Disclaimer: {
      type: 'string',
      displayName: 'Disclaimer',
      description: 'Small print under the list, e.g. that plans and costs vary by carrier, location and year.',
      isLocalized: true,
      sortOrder: 30,
    },
  },
});

type Props = { content: ContentProps<typeof EhFaqContentType> };

type Faq = { question: string; answer: string };

function parseFaqs(lines: Array<string | null> | null | undefined): Faq[] {
  return (lines ?? [])
    .map((l) => (l ?? '').trim())
    .filter(Boolean)
    .map((line) => {
      const [question = '', ...rest] = line.split('|').map((p) => p.trim());
      return { question, answer: rest.join(' | ') };
    })
    .filter((f) => f.question && f.answer);
}

export default function EhFaq({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  const faqs = parseFaqs(content.Items as Array<string | null> | null);

  const schema =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: { '@type': 'Answer', text: f.answer },
          })),
        }
      : null;

  return (
    <div {...pa(block)} className="w-full px-6 py-10 md:py-14">
      {schema && <JsonLd data={schema} />}
      <div className="mx-auto max-w-3xl">
        {content.Heading && (
          <h2
            {...pa('Heading')}
            className="text-center font-display text-2xl font-bold text-blue-950 sm:text-3xl"
          >
            {content.Heading}
          </h2>
        )}
        {content.Intro && (
          <p
            {...pa('Intro')}
            className="mx-auto mt-3 max-w-2xl text-center text-sm leading-relaxed text-foreground sm:text-base"
          >
            {content.Intro}
          </p>
        )}

        <div {...pa('Items')} className="mt-8">
          {faqs.length > 0 ? (
            <div className="divide-y divide-gray-200 overflow-hidden rounded-xl bg-white shadow-md">
              {faqs.map((f, i) => (
                <details key={i} className="group">
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-4 px-5 py-4 font-display text-base font-semibold text-blue-950 hover:bg-surface focus:outline-none focus-visible:bg-surface [&::-webkit-details-marker]:hidden">
                    <span>{f.question}</span>
                    <svg
                      viewBox="0 0 20 20"
                      className="h-5 w-5 shrink-0 text-blue-800 transition-transform group-open:rotate-180"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden
                    >
                      <path d="M5 8l5 5 5-5" />
                    </svg>
                  </summary>
                  <p className="px-5 pb-5 text-sm leading-relaxed text-foreground">{f.answer}</p>
                </details>
              ))}
            </div>
          ) : (
            <p className="rounded border border-dashed border-gray-300 p-6 text-center text-sm text-gray-500">
              Add questions to this block (Question | Answer, one per line).
            </p>
          )}
        </div>

        {content.Disclaimer && (
          <p {...pa('Disclaimer')} className="mx-auto mt-6 max-w-3xl text-center text-xs text-gray-600">
            {content.Disclaimer}
          </p>
        )}
      </div>
    </div>
  );
}
