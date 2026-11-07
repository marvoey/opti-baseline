import StatusIndicator from '@/app/_components_liberty/StatusIndicator';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('status-indicator');

export default function Page() {
  return (
    <Showcase
      slug="status-indicator"
      props={[
        { name: 'variant', type: "'positive' | 'mist' | 'gray'", defaultValue: "'positive'", note: 'positive = check + text · mist = teal pill · gray = neutral pill' },
        { name: 'label', type: 'string', defaultValue: '"Yes"' },
      ]}
      variants={[
        {
          label: 'All three variants',
          node: (
            <div className="flex flex-wrap items-center gap-8 text-sm">
              <StatusIndicator variant="positive" label="If on your policy" />
              <StatusIndicator variant="mist" label="Optional coverage" />
              <StatusIndicator variant="gray" label="Varies by policy" />
            </div>
          ),
        },
      ]}
    >
      <div className="text-sm">
        <StatusIndicator />
      </div>
    </Showcase>
  );
}
