import { cx } from './utils';

export type StepListProps = {
  steps?: string[];
  /** Spacing classes. Replaces the default `mt-4`. */
  className?: string;
};

const DEFAULT_STEPS = [
  'Turn off your main water valve',
  'Take photos and video of the damage',
  "Move belongings out of harm's way if it's safe",
  'Start your claim online or in the app',
];

/** C13 — numbered "what to do now" list (navy number circles). */
export default function StepList({ steps = DEFAULT_STEPS, className = 'mt-4' }: StepListProps) {
  return (
    <ol className={cx('space-y-3 text-sm', className)}>
      {steps.map((step, i) => (
        <li key={`${step}-${i}`} data-reveal="li" className="flex gap-3">
          <span className="w-6 h-6 shrink-0 rounded-full bg-navy text-white text-xs flex items-center justify-center">
            {i + 1}
          </span>
          {step}
        </li>
      ))}
    </ol>
  );
}
