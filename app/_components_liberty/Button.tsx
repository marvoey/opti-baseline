import type { ReactNode } from 'react';
import Anchor from './Anchor';
import { cx } from './utils';

export type ButtonVariant = 'primary' | 'outline' | 'navy';

export type ButtonProps = {
  /** Button text. */
  children?: ReactNode;
  variant?: ButtonVariant;
  /** `md` = px-8, `sm` = px-6. Ignored when `fullWidth` is set. */
  size?: 'md' | 'sm';
  /** Full-width, centred block (used inside cards and callouts). */
  fullWidth?: boolean;
  /** Slightly shorter button (py-2.5), as used inside callout panels. */
  tight?: boolean;
  /** Renders a link when set, otherwise a <button>. */
  href?: string;
  type?: 'button' | 'submit' | 'reset';
  className?: string;
};

const VARIANT: Record<ButtonVariant, string> = {
  primary: 'bg-lmt hover:bg-lmtd text-white',
  outline: 'border-2 border-lmt text-lmt hover:bg-mist',
  navy: 'bg-navy text-white whitespace-nowrap',
};

/**
 * C28 — the button family: solid teal (primary), teal outline, and navy.
 * The outline style has a 2px border, so it uses slightly less vertical padding
 * to keep the same height as the primary button.
 */
export default function Button({
  children = 'Start a claim',
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  tight = false,
  href,
  type = 'button',
  className,
}: ButtonProps) {
  const padY = variant === 'outline' || tight ? 'py-2.5' : 'py-3';
  const classes = cx(
    'font-medium rounded-md',
    VARIANT[variant],
    fullWidth ? 'block text-center' : cx('inline-block', size === 'md' ? 'px-8' : 'px-6'),
    padY,
    className,
  );

  if (href !== undefined) {
    return (
      <Anchor href={href} className={classes}>
        {children}
      </Anchor>
    );
  }
  return (
    <button type={type} className={classes}>
      {children}
    </button>
  );
}
