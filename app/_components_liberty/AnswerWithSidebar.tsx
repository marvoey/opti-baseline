import type { ReactNode } from 'react';
import AnswerBlock from './AnswerBlock';
import CalloutPanel from './CalloutPanel';
import { cx } from './utils';

export type AnswerWithSidebarProps = {
  /** Left column (defaults to an <AnswerBlock />). */
  main?: ReactNode;
  /** Right 340px column (defaults to a checklist <CalloutPanel />). */
  sidebar?: ReactNode;
  /** Spacing classes. Replaces the default `mt-14`. */
  className?: string;
};

/**
 * C10 — two-column layout pairing an <AnswerBlock /> with a <CalloutPanel />.
 * Flexible left column, 340px right column on desktop; stacks on mobile.
 */
export default function AnswerWithSidebar({
  main = <AnswerBlock />,
  sidebar = <CalloutPanel />,
  className = 'mt-14',
}: AnswerWithSidebarProps) {
  return (
    <div className={cx('grid md:grid-cols-[1fr_340px] gap-12 items-start', className)}>
      <div>{main}</div>
      {sidebar}
    </div>
  );
}
