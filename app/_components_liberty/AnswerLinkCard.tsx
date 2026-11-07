import Anchor from './Anchor';
import { cx, LINK_CLASS } from './utils';

export type AnswerLinkCardProps = {
  category?: string;
  title?: string;
  description?: string;
  linkLabel?: string;
  href?: string;
  className?: string;
};

/** C27 — whole-card link to an approved answer: category, title, description. */
export default function AnswerLinkCard({
  category = 'After an accident',
  title = 'What should I do after a car accident?',
  description = 'Steps to take at the scene and in the days after to protect yourself and your claim.',
  linkLabel = 'Read the answer ›',
  href,
  className,
}: AnswerLinkCardProps) {
  return (
    <Anchor
      href={href}
      data-reveal="card"
      className={cx('block rounded-xl border border-gray-200 p-6 hover:shadow-md', className)}
    >
      <div className="text-xs font-bold tracking-wider text-lmt uppercase">{category}</div>
      <h3 className="mt-2 text-lg font-medium text-navy">{title}</h3>
      <p className="mt-2 text-sm leading-6">{description}</p>
      <div className={cx(LINK_CLASS, 'text-sm mt-3')}>{linkLabel}</div>
    </Anchor>
  );
}

export type AnswerLinkCardGridProps = {
  cards?: AnswerLinkCardProps[];
  /** Spacing classes. Replaces the default `mt-8`. */
  className?: string;
};

const DEFAULT_CARDS: AnswerLinkCardProps[] = [
  {
    category: 'After an accident',
    title: 'What should I do after a car accident?',
    description: 'Steps to take at the scene and in the days after to protect yourself and your claim.',
  },
  {
    category: 'Claims',
    title: 'How is fault decided in a car insurance claim?',
    description: "How adjusters review police reports, statements and damage to decide who's responsible.",
  },
  {
    category: 'Coverage',
    title: 'What does uninsured motorist coverage pay for?',
    description:
      "How this coverage helps when the other driver doesn't have enough insurance, or none at all.",
  },
];

/** A row of three <AnswerLinkCard />s. */
export function AnswerLinkCardGrid({ cards = DEFAULT_CARDS, className = 'mt-8' }: AnswerLinkCardGridProps) {
  return (
    <div className={cx('grid md:grid-cols-3 gap-6', className)}>
      {cards.map((card, i) => (
        <AnswerLinkCard key={`${card.title}-${i}`} {...card} />
      ))}
    </div>
  );
}
