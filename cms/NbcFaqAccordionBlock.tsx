import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';

export const NbcFaqAccordionBlockContentType = contentType({
  key: 'NbcFaqAccordionBlock',
  baseType: '_component',
  displayName: 'NBC FAQ Accordion Block',
  description: 'Collapsible question-and-answer item.',
  properties: {
    question: {
      type: 'string',
      displayName: 'Question',
      isRequired: true,
      isLocalized: true,
      indexingType: 'searchable',
      sortOrder: 10,
    },
    answer: {
      type: 'richText',
      displayName: 'Answer Text',
      isRequired: true,
      isLocalized: true,
      sortOrder: 20,
    },
  },
});

type Props = { content: ContentProps<typeof NbcFaqAccordionBlockContentType> };

function ChevronDown({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className={className} aria-hidden="true">
      <path d="m6 9 6 6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function NbcFaqAccordionBlock({ content }: Props) {
  return (
    <details className="group p-4 open:pb-4">
      <summary className="flex cursor-pointer list-none items-center justify-between text-[15px] font-semibold">
        {content.question}
        <ChevronDown className="h-4 w-4 shrink-0 text-black/50 transition-transform group-open:rotate-180" />
      </summary>
      <div className="mt-3 text-[14px] leading-relaxed text-black/70">
        <RichTextRenderer content={content.answer?.json} />
      </div>
    </details>
  );
}
