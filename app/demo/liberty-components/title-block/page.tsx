import Button from '@/app/_components_liberty/Button';
import StatePill from '@/app/_components_liberty/StatePill';
import StreamText from '@/app/_components_liberty/StreamText';
import TitleBlock from '@/app/_components_liberty/TitleBlock';
import Replayable from '../_showcase/Replayable';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('title-block');

export default function Page() {
  return (
    <Showcase
      slug="title-block"
      props={[
        { name: 'title', type: 'string', defaultValue: '"Does my car insurance cover a rental car?"' },
        { name: 'lead', type: 'string', defaultValue: '"In most cases, yes. The coverages on your personal auto policy…"' },
        { name: 'streamLead', type: 'boolean', defaultValue: 'false', note: 'Fade the lead in word by word' },
        { name: 'pill', type: 'ReactNode', note: 'Shown above the headline, e.g. <StatePill />' },
        { name: 'actions', type: 'ReactNode', note: 'Shown below the lead, e.g. two <Button />s' },
        { name: 'className', type: 'string', defaultValue: "'pt-6'", note: 'Replaces the default spacing' },
      ]}
      variants={[
        {
          label: 'With a state pill (Texas page)',
          node: (
            <TitleBlock
              pill={<StatePill />}
              title="Car insurance requirements in Texas"
              lead="Texas requires drivers to carry liability coverage of at least 30/60/25. Here's what that means for you."
            />
          ),
        },
        {
          label: 'With buttons (legal page)',
          node: (
            <TitleBlock
              title="We can't give legal advice"
              lead="Questions about taking legal action are best answered by an attorney. Here's how we can help you after an accident."
              actions={
                <>
                  <Button href="#">Start a claim</Button>
                  <Button href="#" variant="outline">
                    Talk to an agent
                  </Button>
                </>
              }
            />
          ),
        },
        {
          label: 'Streamed lead (streamLead)',
          note: 'Words fade in on load. Reload to see it again.',
          node: <TitleBlock streamLead />,
        },
        {
          label: 'StreamText on its own',
          note: 'The component behind streamLead. Use Replay to run it again.',
          flush: true,
          node: (
            <Replayable>
              <StreamText
                className="p-6 text-center text-[17px] text-gray-600"
                text="In most cases, yes. The coverages on your personal auto policy typically extend to a car you rent for personal use in the U.S."
              />
            </Replayable>
          ),
        },
      ]}
    >
      <TitleBlock />
    </Showcase>
  );
}
