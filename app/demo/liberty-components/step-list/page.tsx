import StepList from '@/app/_components_liberty/StepList';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('step-list');

export default function Page() {
  return (
    <Showcase
      slug="step-list"
      props={[
        { name: 'steps', type: 'string[]', defaultValue: '4 burst-pipe steps' },
        { name: 'className', type: 'string', defaultValue: "'mt-4'", note: 'Replaces the default spacing' },
      ]}
      variants={[
        {
          label: 'Custom steps',
          node: (
            <div className="max-w-[340px]">
              <StepList
                className="mt-0"
                steps={['Make sure everyone is safe', 'Exchange details with the other driver', 'Start your claim in the app']}
              />
            </div>
          ),
        },
      ]}
    >
      <div className="max-w-[340px]">
        <StepList className="mt-0" />
      </div>
    </Showcase>
  );
}
