import type { ReactNode } from 'react';
import { CheckIcon } from './Icons';
import { cx } from './utils';

export type ChecklistItemProps = {
  /** The line of text. */
  children?: ReactNode;
};

/** C12 — one checklist line: teal check icon plus text. Use inside a <ul>. */
export function ChecklistItem({
  children = 'Confirm your policy includes collision and comprehensive',
}: ChecklistItemProps) {
  return (
    <li data-reveal="li" className="flex gap-3">
      <CheckIcon />
      {children}
    </li>
  );
}

export type ChecklistProps = {
  items?: string[];
  /** Spacing classes. Replaces the default `mt-4`. */
  className?: string;
};

const DEFAULT_ITEMS = [
  'Confirm your policy includes collision and comprehensive',
  'Know your deductible amount',
  'Ask the rental company which fees they charge after damage',
  'Keep your ID card handy in the Liberty Mutual app',
];

/** A list of <ChecklistItem />s with the mockup's spacing. */
export function Checklist({ items = DEFAULT_ITEMS, className = 'mt-4' }: ChecklistProps) {
  return (
    <ul className={cx('space-y-3 text-sm', className)}>
      {items.map((item, i) => (
        <ChecklistItem key={`${item}-${i}`}>{item}</ChecklistItem>
      ))}
    </ul>
  );
}

export default ChecklistItem;
