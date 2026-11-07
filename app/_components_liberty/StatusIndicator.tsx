import { CheckIcon } from './Icons';

export type StatusVariant = 'positive' | 'mist' | 'gray';

export type StatusIndicatorProps = {
  /** positive = check icon + text · mist = teal pill · gray = neutral pill. */
  variant?: StatusVariant;
  label?: string;
};

/** C15 — the outcome shown in the last column of a <CoverageTable />. */
export default function StatusIndicator({
  variant = 'positive',
  label = 'Yes',
}: StatusIndicatorProps) {
  if (variant === 'positive') {
    return (
      <span className="inline-flex items-center gap-2">
        <CheckIcon />
        {label}
      </span>
    );
  }
  const tone = variant === 'mist' ? 'bg-mist text-lmtd' : 'bg-gray-100 text-gray-700';
  return (
    <span className={`inline-block text-xs font-medium rounded-full px-3 py-1 ${tone}`}>{label}</span>
  );
}
