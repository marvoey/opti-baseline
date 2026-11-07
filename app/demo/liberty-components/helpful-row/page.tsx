import HelpfulRow from '@/app/_components_liberty/HelpfulRow';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('helpful-row');

export default function Page() {
  return (
    <Showcase
      slug="helpful-row"
      props={[
        { name: 'question', type: 'string', defaultValue: '"Was this answer helpful?"' },
        { name: 'yesLabel', type: 'string', defaultValue: '"Yes"' },
        { name: 'noLabel', type: 'string', defaultValue: '"No"' },
        { name: 'reviewedLabel', type: 'string', defaultValue: '"Last reviewed October 2026"', note: 'Pass "" to hide' },
        { name: 'className', type: 'string', defaultValue: "'mt-12 mb-14'", note: 'Replaces the default spacing' },
      ]}
      variants={[
        {
          label: 'Custom text',
          node: (
            <HelpfulRow
              className="my-0"
              question="Did this answer your question?"
              yesLabel="Yes, thanks"
              noLabel="Not really"
              reviewedLabel="Reviewed November 2026"
            />
          ),
        },
        {
          label: 'Without the reviewed date',
          node: <HelpfulRow className="my-0" reviewedLabel="" />,
        },
      ]}
    >
      <HelpfulRow className="my-0" />
    </Showcase>
  );
}
