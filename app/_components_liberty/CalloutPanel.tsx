import Anchor from './Anchor';
import { Checklist } from './ChecklistItem';
import StepList from './StepList';
import Button from './Button';
import { cx, LINK_CLASS } from './utils';

export type CalloutVariant = 'checklist' | 'text' | 'steps' | 'links';

export type CalloutLink = { label: string; description: string; href?: string };

export type CalloutPanelProps = {
  /** Which body to show. Each variant has its own default text. */
  variant?: CalloutVariant;
  title?: string;
  // checklist
  items?: string[];
  // text
  text?: string;
  // steps
  steps?: string[];
  // links
  links?: CalloutLink[];
  // shared call-to-action (checklist/text: text link · steps: full-width button)
  actionLabel?: string;
  actionHref?: string;
  className?: string;
};

const DEFAULTS = {
  checklist: {
    title: 'Before you pick up the keys',
    actionLabel: 'Talk to a local agent ›',
  },
  text: {
    title: 'Not sure what you need?',
    text: "A local agent can walk you through your state's requirements and the coverage that fits your budget.",
    actionLabel: 'Find a local agent ›',
  },
  steps: {
    title: 'If a pipe just burst',
    actionLabel: 'Start a claim',
  },
  links: { title: undefined as string | undefined, actionLabel: undefined as string | undefined },
} as const;

const DEFAULT_LINKS: CalloutLink[] = [
  { label: 'What can I bundle?', description: 'Auto with home, renters, condo and more.' },
  { label: 'How much could I save?', description: 'Get a quote to see your bundled price.' },
  { label: 'Can I bundle if I rent?', description: 'Yes, auto and renters is a popular bundle.' },
];

/**
 * C11 — cream side panel with practical next steps. One component, four bodies:
 * `checklist`, `text`, `steps` and `links`. Every string is a prop; each
 * variant defaults to the text used in the Ask Liberty mockup.
 */
export default function CalloutPanel({
  variant = 'checklist',
  title,
  items,
  text,
  steps,
  links = DEFAULT_LINKS,
  actionLabel,
  actionHref,
  className,
}: CalloutPanelProps) {
  const d = DEFAULTS[variant];
  const heading = title ?? d.title;
  const action = actionLabel ?? d.actionLabel;

  return (
    <aside
      data-reveal="card"
      className={cx(
        'bg-cream border border-creamb rounded-xl p-6',
        variant === 'links' && 'space-y-4 text-sm',
        className,
      )}
    >
      {variant !== 'links' && heading && <h3 className="font-medium text-navy">{heading}</h3>}

      {variant === 'checklist' && (
        <>
          <Checklist items={items} />
          {action && (
            <Anchor href={actionHref} className={cx(LINK_CLASS, 'text-sm mt-5 inline-block')}>
              {action}
            </Anchor>
          )}
        </>
      )}

      {variant === 'text' && (
        <>
          <p className="mt-2 text-sm leading-6">{text ?? DEFAULTS.text.text}</p>
          {action && (
            <Anchor href={actionHref} className={cx(LINK_CLASS, 'text-sm mt-4 inline-block')}>
              {action}
            </Anchor>
          )}
        </>
      )}

      {variant === 'steps' && (
        <>
          <StepList steps={steps} />
          {action && (
            <Button href={actionHref ?? '#'} fullWidth tight className="mt-5">
              {action}
            </Button>
          )}
        </>
      )}

      {variant === 'links' &&
        links.map((link, i) => (
          <div key={`${link.label}-${i}`}>
            <Anchor href={link.href} className={cx(LINK_CLASS, 'font-medium')}>
              {link.label}
            </Anchor>
            <p className="mt-1">{link.description}</p>
          </div>
        ))}
    </aside>
  );
}
