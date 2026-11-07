import Anchor from './Anchor';
import { cx, LINK_CLASS } from './utils';

export type Source = {
  title: string;
  /** Site the source comes from, e.g. "libertymutual.com". */
  domain: string;
  /** Short quote from the source. */
  quote: string;
  href?: string;
};

export type SourcesBlockProps = {
  heading?: string;
  sources?: Source[];
  /** Small legal disclaimer under the list. Pass "" to hide it. */
  disclaimer?: string;
  /** Spacing classes. Replaces the default `mt-16`. */
  className?: string;
};

const DEFAULT_SOURCES: Source[] = [
  {
    title: 'Does car insurance cover rental cars?',
    domain: 'libertymutual.com',
    quote:
      'If you have comprehensive and collision coverage on your personal auto policy, it will usually extend to a rental car.',
  },
  {
    title: 'Rental car reimbursement coverage',
    domain: 'libertymutual.com',
    quote:
      'Rental car reimbursement helps pay for a rental car while your vehicle is being repaired after a covered claim.',
  },
];

const DEFAULT_DISCLAIMER =
  'Coverage is subject to the terms, conditions and exclusions of your policy. Coverages, discounts and features may vary by state and are not available in all states. This information is general in nature and does not replace your policy documents.';

/** C29 — numbered list of sources with quotes, plus the legal disclaimer. */
export default function SourcesBlock({
  heading = 'Sources for this answer',
  sources = DEFAULT_SOURCES,
  disclaimer = DEFAULT_DISCLAIMER,
  className = 'mt-16',
}: SourcesBlockProps) {
  return (
    <section data-reveal="card" className={cx('border-t border-gray-200 pt-10', className)}>
      <h2 className="text-2xl font-light text-navy">{heading}</h2>
      <ol className="mt-6 space-y-5">
        {sources.map((source, i) => (
          <li key={`${source.title}-${i}`} data-reveal="li" className="flex gap-4">
            <span className="w-7 h-7 shrink-0 rounded-full bg-navy text-white text-sm flex items-center justify-center">
              {i + 1}
            </span>
            <div>
              <Anchor href={source.href} className={cx(LINK_CLASS, 'font-medium')}>
                {source.title}
              </Anchor>
              <div className="text-xs text-gray-500 mt-0.5">{source.domain}</div>
              <blockquote className="mt-2 border-l-4 border-lmy pl-4 text-sm italic text-gray-600">
                &ldquo;{source.quote}&rdquo;
              </blockquote>
            </div>
          </li>
        ))}
      </ol>
      {disclaimer && <p className="mt-8 text-xs text-gray-500 leading-5">{disclaimer}</p>}
    </section>
  );
}
