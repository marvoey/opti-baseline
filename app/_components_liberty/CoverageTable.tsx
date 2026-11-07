import StatusIndicator, { type StatusIndicatorProps } from './StatusIndicator';
import { cx } from './utils';

export type CoverageRow = {
  /** First column, e.g. "Liability". */
  name: string;
  /** Second column: a plain-language example. */
  example: string;
  /** Third column: the outcome. */
  status: StatusIndicatorProps;
  /** Show the name in teal underlined link style (the mockup does for most rows). */
  nameAsLink?: boolean;
};

export type CoverageTableProps = {
  /** The three column headings. */
  headers?: [string, string, string];
  rows?: CoverageRow[];
  /** CSS widths of the three columns. */
  columns?: [string, string, string];
  /** Accessible name for the table. */
  ariaLabel?: string;
  /** Spacing classes. Replaces the default `mt-8`. */
  className?: string;
};

const DEFAULT_HEADERS: [string, string, string] = [
  'Coverage',
  'Real-life example',
  'Applies to your rental',
];

const DEFAULT_ROWS: CoverageRow[] = [
  {
    name: 'Liability',
    example: 'You back into another car in the hotel parking lot.',
    status: { variant: 'positive', label: 'Yes' },
    nameAsLink: true,
  },
  {
    name: 'Collision',
    example: 'The rental car is damaged in a fender bender.',
    status: { variant: 'positive', label: 'If on your policy' },
    nameAsLink: true,
  },
  {
    name: 'Comprehensive',
    example: 'A tree branch falls on the rental car during a storm.',
    status: { variant: 'positive', label: 'If on your policy' },
    nameAsLink: true,
  },
  {
    name: 'Rental car reimbursement',
    example:
      "Your own car is in the shop after a covered accident and you need a rental while it's repaired.",
    status: { variant: 'mist', label: 'Optional coverage' },
    nameAsLink: true,
  },
  {
    name: 'Rental company fees',
    example: 'The rental company charges a daily fee while their damaged car is out of service.',
    status: { variant: 'gray', label: 'Varies by policy' },
  },
];

/**
 * C14 — three-column comparison table: coverage / real-life example / outcome.
 * Alternate rows are striped. Built from a CSS grid with table ARIA roles, and
 * scrolls sideways on narrow screens instead of squashing the columns.
 */
export default function CoverageTable({
  headers = DEFAULT_HEADERS,
  rows = DEFAULT_ROWS,
  columns = ['200px', '1fr', '180px'],
  ariaLabel,
  className = 'mt-8',
}: CoverageTableProps) {
  const grid = { gridTemplateColumns: columns.join(' ') };
  return (
    <div className={cx('border border-gray-200 rounded-lg overflow-hidden text-sm', className)}>
      <div className="overflow-x-auto">
        <div role="table" aria-label={ariaLabel ?? headers.join(', ')} className="min-w-[640px]">
          <div
            role="row"
            data-reveal="row"
            style={grid}
            className="grid bg-[#F5F5F5] font-medium text-navy"
          >
            {headers.map((h) => (
              <div key={h} role="columnheader" className="p-4">
                {h}
              </div>
            ))}
          </div>
          {rows.map((row, i) => (
            <div
              key={`${row.name}-${i}`}
              role="row"
              data-reveal="row"
              style={grid}
              className={cx('grid border-t border-gray-200', i % 2 === 1 && 'bg-[#FAFAFA]')}
            >
              <div role="cell" className={cx('p-4', row.nameAsLink && 'text-lmt underline underline-offset-2')}>
                {row.name}
              </div>
              <div role="cell" className="p-4">
                {row.example}
              </div>
              <div role="cell" className="p-4 flex items-center gap-2">
                <StatusIndicator {...row.status} />
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
