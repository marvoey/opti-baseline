import CoverageTable, { type CoverageRow } from '@/app/_components_liberty/CoverageTable';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('coverage-table');

const WATER_ROWS: CoverageRow[] = [
  {
    name: 'Burst pipe',
    example: 'A pipe inside a wall bursts during a cold snap and floods the kitchen.',
    status: { variant: 'positive', label: 'Yes' },
    nameAsLink: true,
  },
  {
    name: 'Appliance failure',
    example: 'Your washing machine hose suddenly splits.',
    status: { variant: 'positive', label: 'Yes' },
    nameAsLink: true,
  },
  {
    name: 'Slow, ongoing leak',
    example: 'A drip under the bathroom sink damages the cabinet over several months.',
    status: { variant: 'gray', label: 'Usually not' },
  },
  {
    name: 'Flood',
    example: 'Heavy rain causes a nearby creek to overflow into your basement.',
    status: { variant: 'mist', label: 'Separate flood policy' },
    nameAsLink: true,
  },
  {
    name: 'Water backup',
    example: 'Your sump pump fails and water backs up into the finished basement.',
    status: { variant: 'mist', label: 'With optional coverage' },
    nameAsLink: true,
  },
];

export default function Page() {
  return (
    <Showcase
      slug="coverage-table"
      props={[
        { name: 'headers', type: '[string, string, string]', defaultValue: '["Coverage", "Real-life example", "Applies to your rental"]' },
        {
          name: 'rows',
          type: '{ name; example; status: { variant; label }; nameAsLink? }[]',
          defaultValue: '5 rental-car rows',
          note: 'status.variant is positive, mist or gray (see Status indicator)',
        },
        { name: 'columns', type: '[string, string, string]', defaultValue: '["200px", "1fr", "180px"]', note: 'CSS column widths' },
        { name: 'ariaLabel', type: 'string', defaultValue: 'the headers, joined' },
        { name: 'className', type: 'string', defaultValue: "'mt-8'", note: 'Replaces the default spacing' },
      ]}
      variants={[
        {
          label: 'Burst pipe: custom headers, rows and column widths',
          node: (
            <CoverageTable
              className="mt-0"
              headers={['Situation', 'Real-life example', 'Typically covered']}
              columns={['200px', '1fr', '190px']}
              rows={WATER_ROWS}
            />
          ),
        },
      ]}
    >
      <CoverageTable className="mt-0" />
    </Showcase>
  );
}
