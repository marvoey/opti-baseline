import StateSelectorCard from '@/app/_components_liberty/StateSelectorCard';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('state-selector-card');

export default function Page() {
  return (
    <Showcase
      slug="state-selector-card"
      props={[
        { name: 'label', type: 'string', defaultValue: '"Where is your car registered?"' },
        { name: 'placeholder', type: 'string', defaultValue: '"Select a state"' },
        { name: 'buttonLabel', type: 'string', defaultValue: '"See requirements"' },
        { name: 'popularLabel', type: 'string', defaultValue: '"Popular states"' },
        { name: 'popularStates', type: 'string[]', defaultValue: '10 states, Texas first' },
        { name: 'highlightedState', type: 'string', defaultValue: '"Texas"', note: 'Shown in teal outline' },
        { name: 'allStates', type: 'string[]', defaultValue: 'popularStates', note: 'Options in the dropdown' },
        { name: 'locationLabel', type: 'string', defaultValue: '"Use my location"' },
        { name: 'locationHref', type: 'string', defaultValue: '"#"' },
        { name: 'action', type: 'string', defaultValue: 'current page', note: 'GET form target; submits a `state` field' },
        { name: 'attention', type: 'boolean', defaultValue: 'false', note: 'Pulse the card twice' },
        { name: 'className', type: 'string', defaultValue: "'mt-10'", note: 'Replaces the default spacing' },
      ]}
      variants={[
        {
          label: 'With attention pulse',
          note: 'Reload the page to see it pulse.',
          node: <StateSelectorCard className="mt-0" attention />,
        },
        {
          label: 'Custom text',
          node: (
            <StateSelectorCard
              className="mt-0"
              label="Where is your home located?"
              buttonLabel="See home requirements"
              popularLabel="Common states"
              popularStates={['Florida', 'Texas', 'California']}
              highlightedState="Florida"
              locationLabel="Find me"
            />
          ),
        },
      ]}
    >
      <StateSelectorCard className="mt-0" />
    </Showcase>
  );
}
