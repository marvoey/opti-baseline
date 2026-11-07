import StatCard, { StatCardGrid } from '@/app/_components_liberty/StatCard';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('stat-card');

export default function Page() {
  return (
    <Showcase
      slug="stat-card"
      props={[
        { name: 'value', type: 'string', defaultValue: '"$30,000"' },
        { name: 'caption', type: 'string', defaultValue: '"Bodily injury liability for each person injured"' },
        { name: 'className', type: 'string' },
        { name: 'StatCardGrid stats', type: 'StatCardProps[]', defaultValue: '3 Texas figures', note: 'Row of three' },
        { name: 'StatCardGrid className', type: 'string', defaultValue: "'mt-8'", note: 'Replaces the default spacing' },
      ]}
      variants={[
        { label: '<StatCardGrid /> (row of three)', node: <StatCardGrid className="mt-0" /> },
        {
          label: 'Custom figures (Ohio 25/50/25)',
          node: (
            <StatCardGrid
              className="mt-0"
              stats={[
                { value: '$25,000', caption: 'Bodily injury liability for each person injured' },
                { value: '$50,000', caption: 'Bodily injury liability total for each accident' },
                { value: '$25,000', caption: 'Property damage liability for each accident' },
              ]}
            />
          ),
        },
      ]}
    >
      <div className="max-w-xs">
        <StatCard />
      </div>
    </Showcase>
  );
}
