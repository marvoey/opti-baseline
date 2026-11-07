import AiProgressPanel from '@/app/_components_liberty/AiProgressPanel';
import Replayable from '../_showcase/Replayable';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('ai-progress-panel');

export default function Page() {
  return (
    <Showcase
      slug="ai-progress-panel"
      flush
      props={[
        { name: 'question', type: 'string', defaultValue: '"Does my car insurance cover a rental car?"' },
        { name: 'eyebrow', type: 'string', defaultValue: '"Ask Liberty"' },
        { name: 'stepLabels', type: '[string, string, string, string]', defaultValue: '"Send question to Mark" … "Build your answer"' },
        { name: 'chips', type: '{ label; value; warn? }[]', defaultValue: '5 rental-car classification chips' },
        { name: 'retrievingLabel / retrievedLabel', type: 'string', defaultValue: '"Retrieving approved Liberty Mutual content" / "Approved content retrieved"' },
        { name: 'items', type: 'string[]', defaultValue: '5 retrieved lines' },
        { name: 'warn', type: 'boolean', defaultValue: 'false', note: 'Step 3 ends with "!" and the last item is flagged' },
        { name: 'short', type: 'boolean', defaultValue: 'false', note: 'Short flow (after the visitor supplies a detail)' },
        { name: 'texts', type: 'Partial<ProgressTexts>', note: 'Override any status sentence (sending, sent, classifying, classified, building, ready, shortSelection, shortUpdating, shortUpdated)' },
        { name: 'autoPlay', type: 'boolean', defaultValue: 'true', note: 'false shows the finished state' },
        { name: 'playKey', type: 'number', defaultValue: '0', note: 'Change to replay' },
        { name: 'speed', type: 'number', defaultValue: '1', note: '2 = twice as fast' },
        { name: 'className', type: 'string' },
      ]}
      variants={[
        {
          label: 'Warning flow (claim status)',
          note: 'Personal account info: a yellow chip and a "!" on step 3.',
          flush: true,
          node: (
            <Replayable>
              <AiProgressPanel
                question="My claim hasn’t been paid yet, where is it?"
                chips={[
                  { label: 'Intent', value: 'Account service' },
                  { label: 'Topic', value: 'Claim status' },
                  { label: 'Handling', value: 'Personal account info', warn: true },
                ]}
                retrievingLabel="Finding the secure way to help"
                retrievedLabel="Secure claim options found"
                items={['Log in to track your claim', 'Look up a claim without logging in', 'Other ways to get help']}
                warn
              />
            </Replayable>
          ),
        },
        {
          label: 'Short flow (Texas)',
          note: 'Skips full classification after the visitor picks a state.',
          flush: true,
          node: (
            <Replayable>
              <AiProgressPanel
                short
                question="What car insurance am I required to have?"
                chips={[
                  { label: 'Intent', value: 'Learn about requirements' },
                  { label: 'Product', value: 'Auto' },
                  { label: 'Topic', value: 'State minimums' },
                  { label: 'State', value: 'Texas' },
                ]}
                retrievingLabel="Retrieving approved Texas content"
                retrievedLabel="Approved Texas content retrieved"
                items={[
                  'Answer · Texas minimum coverage (30/60/25)',
                  'Texas Department of Insurance source',
                  'Nearby state comparisons',
                  'Next step · Get a Texas quote',
                  'Disclosure',
                ]}
              />
            </Replayable>
          ),
        },
        {
          label: 'Finished state (autoPlay={false})',
          flush: true,
          node: <AiProgressPanel autoPlay={false} />,
        },
      ]}
    >
      <Replayable>
        <AiProgressPanel />
      </Replayable>
    </Showcase>
  );
}
