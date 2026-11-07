import Button from './Button';
import IconBadge from './IconBadge';
import type { IconName } from './Icons';
import { cx } from './utils';

export type HandoffBannerProps = {
  icon?: IconName;
  title?: string;
  description?: string;
  buttonLabel?: string;
  buttonHref?: string;
  /** Spacing classes. Replaces the default `mt-14`. */
  className?: string;
};

/** C26 — mist banner that redirects an out-of-scope question to real help. */
export default function HandoffBanner({
  icon = 'auto',
  title = 'Were you just in an accident?',
  description = "Make sure everyone is safe and call 911 if anyone is hurt. When you're ready, we'll help you start your claim and explain what happens next.",
  buttonLabel = 'Start a claim',
  buttonHref = '#',
  className = 'mt-14',
}: HandoffBannerProps) {
  return (
    <div
      data-reveal="card"
      className={cx(
        'bg-mist rounded-2xl p-8 flex flex-col md:flex-row md:items-center gap-6',
        className,
      )}
    >
      <IconBadge icon={icon} size="lg" />
      <div className="flex-1">
        <h2 className="text-2xl font-light text-navy">{title}</h2>
        <p className="mt-2 text-sm leading-6">{description}</p>
      </div>
      <Button href={buttonHref} variant="navy" size="sm">
        {buttonLabel}
      </Button>
    </div>
  );
}
