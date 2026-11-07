import type { ReactNode } from 'react';
import StreamText from './StreamText';
import { cx } from './utils';

export type TitleBlockProps = {
  title?: string;
  /** The short direct answer under the headline. */
  lead?: string;
  /** Stream the lead word by word (client-side) instead of showing it at once. */
  streamLead?: boolean;
  /** Optional element above the headline, e.g. a <StatePill />. */
  pill?: ReactNode;
  /** Optional element(s) below the lead, e.g. two <Button />s. */
  actions?: ReactNode;
  /** Spacing classes. Replaces the default `pt-6`. */
  className?: string;
};

const LEAD_CLASS = 'mt-3 text-[17px] text-gray-600 max-w-3xl mx-auto';

/** C03 — centred H1 and lead paragraph at the top of an answer. */
export default function TitleBlock({
  title = 'Does my car insurance cover a rental car?',
  lead = 'In most cases, yes. The coverages on your personal auto policy typically extend to a car you rent for personal use in the U.S.',
  streamLead = false,
  pill,
  actions,
  className = 'pt-6',
}: TitleBlockProps) {
  return (
    <div className={cx('text-center', className)}>
      {pill && <div data-reveal="card">{pill}</div>}
      <h1
        data-reveal="card"
        className={cx('text-[40px] leading-tight font-light text-navy', Boolean(pill) && 'mt-4')}
      >
        {title}
      </h1>
      {streamLead ? (
        <StreamText text={lead} className={LEAD_CLASS} />
      ) : (
        <p data-reveal="card" className={LEAD_CLASS}>
          {lead}
        </p>
      )}
      {actions && (
        <div data-reveal="card" className="mt-7 flex justify-center gap-3">
          {actions}
        </div>
      )}
    </div>
  );
}
