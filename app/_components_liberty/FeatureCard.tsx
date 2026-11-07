import Anchor from './Anchor';
import IconBadge from './IconBadge';
import type { IconName } from './Icons';
import { cx, LINK_CLASS } from './utils';

export type FeatureCardProps = {
  title?: string;
  description?: string;
  /** Icon badge above the title. Omit (or pass null) for a text-only card. */
  icon?: IconName | null;
  /** Optional link under the description. */
  linkLabel?: string;
  linkHref?: string;
  className?: string;
};

/** C16 — cream card with optional icon, title, description and link. */
export default function FeatureCard({
  title = 'Water backup and sump pump overflow',
  description = 'Helps cover damage when water backs up through drains or your sump pump overflows.',
  icon = 'home',
  linkLabel,
  linkHref,
  className,
}: FeatureCardProps) {
  return (
    <div data-reveal="card" className={cx('bg-cream border border-creamb rounded-xl p-6', className)}>
      {icon && <IconBadge icon={icon} />}
      <h3 className={cx('text-lg font-medium text-navy', icon && 'mt-4')}>{title}</h3>
      <p className="mt-2 text-sm leading-6">{description}</p>
      {linkLabel && (
        <Anchor href={linkHref} className={cx(LINK_CLASS, 'text-sm mt-3 inline-block')}>
          {linkLabel}
        </Anchor>
      )}
    </div>
  );
}

export type FeatureCardGridProps = {
  cards?: FeatureCardProps[];
  /** Spacing classes. Replaces the default `mt-8`. */
  className?: string;
};

const DEFAULT_CARDS: FeatureCardProps[] = [
  {
    title: 'Water backup and sump pump overflow',
    description: 'Helps cover damage when water backs up through drains or your sump pump overflows.',
    icon: 'home',
    linkLabel: 'Learn more ›',
  },
  {
    title: 'Flood insurance',
    description: "Protects your home and belongings from flooding, which homeowners policies don't cover.",
    icon: 'condo',
    linkLabel: 'Learn more ›',
  },
  {
    title: 'Personal property replacement cost',
    description: 'Helps pay to replace damaged belongings with new ones, not their depreciated value.',
    icon: 'renters',
    linkLabel: 'Learn more ›',
  },
];

/** A row of three <FeatureCard />s with the mockup's grid spacing. */
export function FeatureCardGrid({ cards = DEFAULT_CARDS, className = 'mt-8' }: FeatureCardGridProps) {
  return (
    <div className={cx('grid md:grid-cols-3 gap-6', className)}>
      {cards.map((card, i) => (
        <FeatureCard key={`${card.title}-${i}`} {...card} />
      ))}
    </div>
  );
}
