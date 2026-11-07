import Anchor from './Anchor';
import { cx, LINK_CLASS } from './utils';

export type ComparisonState = {
  name: string;
  /** Minimum coverage figure, e.g. "25/50/25". */
  minimums: string;
  /** Link text. Defaults to "See {name} requirements ›". */
  linkLabel?: string;
  href?: string;
};

export type StateComparisonPanelProps = {
  title?: string;
  states?: ComparisonState[];
  /** Spacing classes. Replaces the default `mt-14`. */
  className?: string;
};

const DEFAULT_STATES: ComparisonState[] = [
  { name: 'Ohio', minimums: '25/50/25' },
  { name: 'California', minimums: '30/60/15' },
  { name: 'Pennsylvania', minimums: '15/30/5' },
];

/** C23 — grey panel inviting comparison with nearby states. */
export default function StateComparisonPanel({
  title = 'Moving or comparing states?',
  states = DEFAULT_STATES,
  className = 'mt-14',
}: StateComparisonPanelProps) {
  return (
    <div data-reveal="card" className={cx('bg-[#F5F5F5] rounded-2xl p-8', className)}>
      <h3 className="text-xl font-light text-navy">{title}</h3>
      <div className="mt-5 grid md:grid-cols-3 gap-4 text-sm">
        {states.map((s, i) => (
          <Anchor
            key={`${s.name}-${i}`}
            href={s.href}
            className="block bg-white rounded-lg p-5 hover:shadow"
          >
            <div className="text-gray-500">{s.name}</div>
            <div className="text-2xl font-light text-navy mt-1">{s.minimums}</div>
            <div className={cx(LINK_CLASS, 'mt-2')}>{s.linkLabel ?? `See ${s.name} requirements ›`}</div>
          </Anchor>
        ))}
      </div>
    </div>
  );
}
