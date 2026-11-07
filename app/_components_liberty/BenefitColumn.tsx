import AccentBar from './AccentBar';
import { cx } from './utils';

export type BenefitColumnProps = {
  title?: string;
  description?: string;
  className?: string;
};

/** C19 — short selling point: title, accent bar, paragraph (no card background). */
export default function BenefitColumn({
  title = 'Save money',
  description = 'Bundling is one of the easiest ways to lower what you pay for both policies.',
  className,
}: BenefitColumnProps) {
  return (
    <div data-reveal="card" className={className}>
      <h3 className="font-medium text-navy text-lg">{title}</h3>
      <AccentBar className="mt-3" />
      <p className="mt-4 text-sm leading-6">{description}</p>
    </div>
  );
}

export type BenefitColumnGridProps = {
  benefits?: BenefitColumnProps[];
  /** Spacing classes. Replaces the default `mt-16`. */
  className?: string;
};

const DEFAULT_BENEFITS: BenefitColumnProps[] = [
  {
    title: 'Save money',
    description: 'Bundling is one of the easiest ways to lower what you pay for both policies.',
  },
  {
    title: 'One place to manage',
    description:
      'View documents, pay bills and file claims for all your policies in the Liberty Mutual app.',
  },
  {
    title: 'Flexibility',
    description: 'Manage your bundle online, by phone, or with a local agent, whichever works for you.',
  },
];

/** A row of three <BenefitColumn />s. */
export function BenefitColumnGrid({ benefits = DEFAULT_BENEFITS, className = 'mt-16' }: BenefitColumnGridProps) {
  return (
    <div className={cx('grid md:grid-cols-3 gap-8', className)}>
      {benefits.map((b, i) => (
        <BenefitColumn key={`${b.title}-${i}`} {...b} />
      ))}
    </div>
  );
}
