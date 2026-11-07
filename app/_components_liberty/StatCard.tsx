import AccentBar from './AccentBar';
import { cx } from './utils';

export type StatCardProps = {
  /** The big figure, e.g. "$30,000". */
  value?: string;
  caption?: string;
  className?: string;
};

/** C18 — bordered card with a large light figure, accent bar and caption. */
export default function StatCard({
  value = '$30,000',
  caption = 'Bodily injury liability for each person injured',
  className,
}: StatCardProps) {
  return (
    <div
      data-reveal="card"
      className={cx('rounded-xl border border-gray-200 p-8 text-center', className)}
    >
      <div className="text-[44px] font-light text-navy">{value}</div>
      <AccentBar className="mx-auto mt-3" />
      <p className="mt-4 text-sm">{caption}</p>
    </div>
  );
}

export type StatCardGridProps = {
  stats?: StatCardProps[];
  /** Spacing classes. Replaces the default `mt-8`. */
  className?: string;
};

const DEFAULT_STATS: StatCardProps[] = [
  { value: '$30,000', caption: 'Bodily injury liability for each person injured' },
  { value: '$60,000', caption: 'Bodily injury liability total for each accident' },
  { value: '$25,000', caption: 'Property damage liability for each accident' },
];

/** A row of three <StatCard />s. */
export function StatCardGrid({ stats = DEFAULT_STATS, className = 'mt-8' }: StatCardGridProps) {
  return (
    <div className={cx('grid md:grid-cols-3 gap-6', className)}>
      {stats.map((stat, i) => (
        <StatCard key={`${stat.value}-${i}`} {...stat} />
      ))}
    </div>
  );
}
