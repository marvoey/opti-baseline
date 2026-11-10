import { CheckIcon } from '@/app/_components_liberty/Icons';
import { cx, safeHref } from '@/app/_components_liberty/utils';
import PriorityIcon from './PriorityIcon';

export type PriorityCardProps = {
  icon?: string | null;
  title: string;
  description?: string;
  benefits?: string[];
  linkLabel?: string;
  linkHref?: string;
  /** The teal button, e.g. "Start a quote". Omitted when empty. */
  buttonLabel?: string;
  /** Small label top right, e.g. "Top priority". Omitted when empty. */
  tag?: string;
  /** The first card gets the yellow top rule and yellow tag. */
  top?: boolean;
  className?: string;
};

/**
 * Focus card of the Independent Agent Portal dashboard (the mockup's `fcard`):
 * icon, tag, title, description, benefits, a link and a button. All text is
 * rendered as text by React; the link goes through safeHref.
 */
export default function PriorityCard({
  icon,
  title,
  description,
  benefits = [],
  linkLabel,
  linkHref,
  buttonLabel,
  tag,
  top = false,
  className,
}: PriorityCardProps) {
  return (
    <div
      className={cx(
        'flex flex-col rounded-2xl border bg-white p-6',
        top ? 'border-lmy border-t-[6px]' : 'border-gray-200',
        className,
      )}
    >
      <div className="flex items-center justify-between">
        <div className="flex h-11 w-11 items-center justify-center rounded-full bg-mist text-lmt">
          <PriorityIcon name={icon} className="h-6 w-6" />
        </div>
        {tag && (
          <span
            className={cx(
              'rounded-full px-3 py-1 text-[11px] font-bold uppercase tracking-wider',
              top ? 'bg-lmy text-navy' : 'border border-creamb bg-cream text-navy',
            )}
          >
            {tag}
          </span>
        )}
      </div>
      <h3 className="mt-4 text-xl font-medium text-navy">{title}</h3>
      {description && <p className="mt-2 text-sm leading-6 text-gray-600">{description}</p>}
      {benefits.length > 0 && (
        <ul className="mt-4 space-y-2 text-sm">
          {benefits.map((b, i) => (
            <li key={`${b}-${i}`} className="flex gap-2">
              <CheckIcon />
              <span>{b}</span>
            </li>
          ))}
        </ul>
      )}
      {(linkLabel || buttonLabel) && (
        <div className="mt-auto flex flex-wrap items-center gap-x-4 gap-y-2 pt-6 text-sm">
          {linkLabel && (
            <a href={safeHref(linkHref)} className="font-medium text-lmt underline underline-offset-2">
              {linkLabel} ›
            </a>
          )}
          {buttonLabel && (
            <span className="inline-block rounded-md bg-lmt px-4 py-2 font-medium text-white">{buttonLabel}</span>
          )}
        </div>
      )}
    </div>
  );
}
