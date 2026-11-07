import Anchor from './Anchor';
import { LibertyIcon } from './Icons';
import { cx } from './utils';

export type StatePillProps = {
  state?: string;
  /** The underlined action text after the state. */
  changeLabel?: string;
  /** Where "Change state" goes. */
  href?: string;
  className?: string;
};

/** C22 — mist pill showing the chosen state with a "Change state" action. */
export default function StatePill({
  state = 'Texas',
  changeLabel = 'Change state',
  href,
  className,
}: StatePillProps) {
  return (
    <Anchor
      href={href}
      className={cx(
        'inline-flex items-center gap-2 text-sm bg-mist text-lmtd rounded-full px-4 py-1.5',
        className,
      )}
    >
      <LibertyIcon name="pin" className="w-4 h-4" strokeWidth={2} />
      {state} · <span className="underline">{changeLabel}</span>
    </Anchor>
  );
}
