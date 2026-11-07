import StateComparisonPanel from '@/app/_components_liberty/StateComparisonPanel';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('state-comparison-panel');

export default function Page() {
  return (
    <Showcase
      slug="state-comparison-panel"
      props={[
        { name: 'title', type: 'string', defaultValue: '"Moving or comparing states?"' },
        {
          name: 'states',
          type: '{ name; minimums; linkLabel?; href? }[]',
          defaultValue: 'Ohio 25/50/25, California 30/60/15, Pennsylvania 15/30/5',
          note: 'linkLabel defaults to "See {name} requirements ›"',
        },
        { name: 'className', type: 'string', defaultValue: "'mt-14'", note: 'Replaces the default spacing' },
      ]}
      variants={[
        {
          label: 'Custom text',
          node: (
            <StateComparisonPanel
              className="mt-0"
              title="Compare with nearby states"
              states={[
                { name: 'Oklahoma', minimums: '25/50/25', linkLabel: 'View Oklahoma ›' },
                { name: 'Louisiana', minimums: '15/30/25', linkLabel: 'View Louisiana ›' },
              ]}
            />
          ),
        },
      ]}
    >
      <StateComparisonPanel className="mt-0" />
    </Showcase>
  );
}
