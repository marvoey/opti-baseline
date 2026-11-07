import Anchor from './Anchor';
import Button from './Button';
import IconBadge from './IconBadge';
import type { IconName } from './Icons';
import LookupFormFields from './LookupFormFields';
import { cx, LINK_CLASS } from './utils';

export type AccountActionVariant = 'login' | 'lookup';

export type AccountActionCardProps = {
  /** login = text + button + sign-up link · lookup = claim look-up fields + button. */
  variant?: AccountActionVariant;
  icon?: IconName;
  title?: string;
  /** Paragraph (login variant). */
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
  /** Small link under the button (login variant). */
  secondaryLabel?: string;
  secondaryHref?: string;
  className?: string;
};

const DEFAULTS = {
  login: {
    icon: 'user' as IconName,
    title: 'Log in to track your claim',
    description:
      "See your claim status, payment details, your claims representative's contact information and what happens next.",
    buttonLabel: 'Log in',
    secondaryLabel: 'Create an account',
  },
  lookup: {
    icon: 'search' as IconName,
    title: 'Look up a claim',
    description: undefined,
    buttonLabel: 'Find my claim',
    secondaryLabel: undefined,
  },
};

/** C24 — large rounded card offering a secure route to claim details. */
export default function AccountActionCard({
  variant = 'login',
  icon,
  title,
  description,
  buttonLabel,
  buttonHref,
  secondaryLabel,
  secondaryHref,
  className,
}: AccountActionCardProps) {
  const d = DEFAULTS[variant];
  const desc = description ?? d.description;
  const secondary = secondaryLabel ?? d.secondaryLabel;

  return (
    <div data-reveal="card" className={cx('rounded-2xl border border-gray-200 shadow-sm p-8', className)}>
      <IconBadge icon={icon ?? d.icon} size="xl" tone="mist" />
      <h2 className="mt-5 text-2xl font-light text-navy">{title ?? d.title}</h2>
      {variant === 'login' && desc && <p className="mt-3 text-sm leading-6">{desc}</p>}
      {variant === 'lookup' && <LookupFormFields />}
      {variant === 'login' ? (
        <Button href={buttonHref ?? '#'} fullWidth className="mt-6">
          {buttonLabel ?? d.buttonLabel}
        </Button>
      ) : (
        <Button href={buttonHref ?? '#'} variant="outline" fullWidth className="mt-5">
          {buttonLabel ?? d.buttonLabel}
        </Button>
      )}
      {secondary && (
        <Anchor href={secondaryHref} className={cx(LINK_CLASS, 'text-sm mt-4 inline-block')}>
          {secondary}
        </Anchor>
      )}
    </div>
  );
}
