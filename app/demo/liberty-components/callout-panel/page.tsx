import CalloutPanel from '@/app/_components_liberty/CalloutPanel';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('callout-panel');

export default function Page() {
  return (
    <Showcase
      slug="callout-panel"
      props={[
        { name: 'variant', type: "'checklist' | 'text' | 'steps' | 'links'", defaultValue: "'checklist'", note: 'Each variant has its own default text' },
        { name: 'title', type: 'string', defaultValue: 'per variant', note: 'Not shown for "links"' },
        { name: 'items', type: 'string[]', note: 'checklist: the list lines' },
        { name: 'text', type: 'string', note: 'text: the paragraph' },
        { name: 'steps', type: 'string[]', note: 'steps: the numbered lines' },
        { name: 'links', type: '{ label; description; href? }[]', note: 'links: link + description pairs' },
        { name: 'actionLabel', type: 'string', defaultValue: 'per variant', note: 'checklist/text: text link · steps: button' },
        { name: 'actionHref', type: 'string', defaultValue: '"#"' },
        { name: 'className', type: 'string' },
      ]}
      variants={[
        { label: 'variant="text"', node: <div className="max-w-[340px]"><CalloutPanel variant="text" /></div> },
        { label: 'variant="steps"', node: <div className="max-w-[340px]"><CalloutPanel variant="steps" /></div> },
        { label: 'variant="links"', node: <div className="max-w-[340px]"><CalloutPanel variant="links" /></div> },
        {
          label: 'Checklist with custom text',
          node: (
            <div className="max-w-[340px]">
              <CalloutPanel
                title="Coverages Texas drivers often add"
                items={['Collision', 'Comprehensive', 'Uninsured/underinsured motorist', 'Roadside assistance']}
                actionLabel="Get a Texas car insurance quote ›"
              />
            </div>
          ),
        },
      ]}
    >
      <div className="max-w-[340px]">
        <CalloutPanel />
      </div>
    </Showcase>
  );
}
