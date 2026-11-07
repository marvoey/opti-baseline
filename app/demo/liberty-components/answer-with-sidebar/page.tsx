import AnswerBlock from '@/app/_components_liberty/AnswerBlock';
import AnswerWithSidebar from '@/app/_components_liberty/AnswerWithSidebar';
import CalloutPanel from '@/app/_components_liberty/CalloutPanel';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('answer-with-sidebar');

export default function Page() {
  return (
    <Showcase
      slug="answer-with-sidebar"
      props={[
        { name: 'main', type: 'ReactNode', defaultValue: '<AnswerBlock />', note: 'Left, flexible column' },
        { name: 'sidebar', type: 'ReactNode', defaultValue: '<CalloutPanel />', note: 'Right, 340px column' },
        { name: 'className', type: 'string', defaultValue: "'mt-14'", note: 'Replaces the default spacing' },
      ]}
      variants={[
        {
          label: 'Burst pipe: answer with numbered steps',
          node: (
            <AnswerWithSidebar
              className="mt-0"
              main={
                <AnswerBlock
                  headingBold="Sudden damage is usually covered,"
                  headingLight="gradual damage usually isn't."
                  paragraphs={[
                    'If a pipe bursts and soaks your floors, walls and belongings, your dwelling and personal property coverages typically help pay for repairs and replacement, minus your deductible.',
                    'Damage that builds up over time, such as a slow drip under a sink, is usually considered a maintenance issue. Flooding from outside water, like heavy rain or an overflowing river, requires a separate flood insurance policy.',
                  ]}
                />
              }
              sidebar={<CalloutPanel variant="steps" />}
            />
          ),
        },
        {
          label: 'Bundling: answer with a link list',
          node: (
            <AnswerWithSidebar
              className="mt-0"
              main={
                <AnswerBlock
                  headingBold="Auto and home,"
                  headingLight="better together."
                  paragraphs={[
                    'A bundle is when you have more than one policy with the same insurance company. When you combine auto and home insurance with Liberty Mutual, you can qualify for a multi-policy discount.',
                  ]}
                />
              }
              sidebar={<CalloutPanel variant="links" />}
            />
          ),
        },
      ]}
    >
      <AnswerWithSidebar className="mt-0" />
    </Showcase>
  );
}
