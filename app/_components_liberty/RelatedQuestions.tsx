import Anchor from './Anchor';
import { cx, LINK_CLASS } from './utils';

export type RelatedQuestion = string | { question: string; href?: string };

export type RelatedQuestionsProps = {
  heading?: string;
  questions?: RelatedQuestion[];
  /** Text of the fake link at the bottom of each card. */
  linkLabel?: string;
  /** Spacing classes. Replaces the default `mt-14`. */
  className?: string;
};

const DEFAULT_QUESTIONS: RelatedQuestion[] = [
  'What is rental car reimbursement coverage?',
  "Should I buy the rental company's insurance?",
  'Does my car insurance cover me in another state?',
];

/** C30 — "People also ask": a 3-column grid of related-question cards. */
export default function RelatedQuestions({
  heading = 'People also ask',
  questions = DEFAULT_QUESTIONS,
  linkLabel = 'Get the answer ›',
  className = 'mt-14',
}: RelatedQuestionsProps) {
  return (
    <section data-reveal="card" className={className}>
      <h2 className="text-2xl font-light text-navy">{heading}</h2>
      <div className="mt-6 grid md:grid-cols-3 gap-5">
        {questions.map((q, i) => {
          const { question, href } = typeof q === 'string' ? { question: q, href: undefined } : q;
          return (
            <Anchor
              key={`${question}-${i}`}
              href={href}
              className="block rounded-xl border border-gray-200 p-5 hover:shadow-md"
            >
              <div className="text-navy font-medium">{question}</div>
              <div className={cx(LINK_CLASS, 'text-sm mt-3')}>{linkLabel}</div>
            </Anchor>
          );
        })}
      </div>
    </section>
  );
}
