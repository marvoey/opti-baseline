import StatePill from '@/app/_components_liberty/StatePill';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('state-pill');

export default function Page() {
  return (
    <Showcase
      slug="state-pill"
      props={[
        { name: 'state', type: 'string', defaultValue: '"Texas"' },
        { name: 'changeLabel', type: 'string', defaultValue: '"Change state"' },
        { name: 'href', type: 'string', defaultValue: '"#"', note: 'Where "Change state" goes' },
        { name: 'className', type: 'string' },
      ]}
      variants={[
        {
          label: 'Custom text',
          node: <StatePill state="Ohio" changeLabel="Pick a different state" href="/demo/liberty-components/state-selector-card" />,
        },
      ]}
    >
      <StatePill />
    </Showcase>
  );
}
