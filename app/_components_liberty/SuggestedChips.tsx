import Anchor from './Anchor';
import { cx } from './utils';

export type SuggestedChip = { label: string; href?: string };

export type SuggestedChipsProps = {
  chips?: SuggestedChip[];
  /** Spacing classes. Replaces the default `mt-5`. */
  className?: string;
};

const DEFAULT_CHIPS: SuggestedChip[] = [
  { label: 'Does my car insurance cover a rental car?' },
  { label: 'Is a burst pipe covered by home insurance?' },
  { label: 'What car insurance am I required to have?' },
  { label: 'Can I bundle home and auto?' },
];

/** C07 — row of outlined pill links offering one-click example questions. */
export default function SuggestedChips({ chips = DEFAULT_CHIPS, className = 'mt-5' }: SuggestedChipsProps) {
  return (
    <div className={cx('flex flex-wrap justify-center gap-2 text-sm', className)}>
      {chips.map((chip, i) => (
        <Anchor
          key={`${chip.label}-${i}`}
          href={chip.href}
          className="border border-gray-300 rounded-full px-4 py-2 hover:border-lmt hover:text-lmt"
        >
          {chip.label}
        </Anchor>
      ))}
    </div>
  );
}
