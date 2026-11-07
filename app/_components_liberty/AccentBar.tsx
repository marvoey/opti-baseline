import { cx } from './utils';

export type AccentBarProps = {
  /** Extra classes, e.g. `mt-4` or `mx-auto mt-3` to centre it. */
  className?: string;
};

/** C05 — the short yellow rule that sits under headings. 44px × 4px. */
export default function AccentBar({ className }: AccentBarProps) {
  return (
    <div
      data-reveal="accent"
      aria-hidden="true"
      className={cx('w-11 h-1 rounded-[2px] bg-lmy', className)}
    />
  );
}
