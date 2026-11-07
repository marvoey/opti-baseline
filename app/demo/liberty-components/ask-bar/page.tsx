import AskBar from '@/app/_components_liberty/AskBar';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('ask-bar');

export default function Page() {
  return (
    <Showcase
      slug="ask-bar"
      flush
      props={[
        { name: 'question', type: 'string', defaultValue: '"Does my car insurance cover a rental car?"' },
        { name: 'buttonLabel', type: 'string', defaultValue: '"Ask"' },
        { name: 'inputLabel', type: 'string', defaultValue: '"Ask a question"', note: 'Accessible name for the text box' },
        { name: 'placeholder', type: 'string', defaultValue: 'none' },
        { name: 'action', type: 'string', defaultValue: 'current page', note: 'GET form target; unsafe URLs are ignored' },
        { name: 'name', type: 'string', defaultValue: '"q"', note: 'Query-string field name' },
        { name: 'className', type: 'string' },
      ]}
      variants={[
        {
          label: 'Custom text',
          note: 'question, buttonLabel and inputLabel changed.',
          flush: true,
          node: (
            <AskBar
              question="Is a burst pipe covered by home insurance?"
              buttonLabel="Search"
              inputLabel="Search Liberty answers"
            />
          ),
        },
        {
          label: 'Empty with placeholder',
          flush: true,
          node: <AskBar question="" placeholder="Ask a question about car, home or renters insurance" />,
        },
      ]}
    >
      <AskBar />
    </Showcase>
  );
}
