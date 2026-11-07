import AccentBar from './AccentBar';
import { cx } from './utils';

export type AnswerBlockProps = {
  /** First line of the heading, set in bold. */
  headingBold?: string;
  /** Second line of the heading, set in light weight. */
  headingLight?: string;
  /** Body paragraphs (any number). */
  paragraphs?: string[];
  className?: string;
};

const DEFAULT_PARAGRAPHS = [
  'If you have liability coverage, it typically applies when you drive a rental car. If your policy includes collision and comprehensive coverage, damage to the rental car is usually covered the same way it would be for your own car, minus your deductible.',
  "Rental companies may still charge for things your policy might not cover, such as loss of use while their car is being repaired or administrative fees. Review your policy or talk with an agent before you decline the rental company's coverage at the counter.",
];

/** C09 — the main explanation: two-tone heading, accent bar and paragraphs. */
export default function AnswerBlock({
  headingBold = 'Your coverage usually comes with you,',
  headingLight = 'when you rent a car.',
  paragraphs = DEFAULT_PARAGRAPHS,
  className,
}: AnswerBlockProps) {
  return (
    <div className={className}>
      <h2 data-reveal="card" className="text-[30px] leading-tight text-navy">
        <span className="font-bold">{headingBold}</span>
        <br />
        <span className="font-light">{headingLight}</span>
      </h2>
      <AccentBar className="mt-4" />
      {paragraphs.map((p, i) => (
        <p key={i} data-reveal="card" className={cx('leading-7', i === 0 ? 'mt-6' : 'mt-4')}>
          {p}
        </p>
      ))}
    </div>
  );
}
