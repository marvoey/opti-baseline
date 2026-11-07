import BenefitColumn, { BenefitColumnGrid } from '@/app/_components_liberty/BenefitColumn';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('benefit-column');

export default function Page() {
  return (
    <Showcase
      slug="benefit-column"
      props={[
        { name: 'title', type: 'string', defaultValue: '"Save money"' },
        { name: 'description', type: 'string', defaultValue: '"Bundling is one of the easiest ways to lower…"' },
        { name: 'className', type: 'string' },
        { name: 'BenefitColumnGrid benefits', type: 'BenefitColumnProps[]', defaultValue: '3 bundling benefits', note: 'Row of three' },
        { name: 'BenefitColumnGrid className', type: 'string', defaultValue: "'mt-16'", note: 'Replaces the default spacing' },
      ]}
      variants={[
        { label: '<BenefitColumnGrid /> (row of three)', node: <BenefitColumnGrid className="mt-0" /> },
        {
          label: 'Custom text',
          node: (
            <BenefitColumnGrid
              className="mt-0"
              benefits={[
                { title: 'Fast quotes', description: 'Get a price in minutes, online or in the app.' },
                { title: 'Local agents', description: 'Talk to someone near you who knows your area.' },
                { title: 'Claims help', description: 'Start a claim any time, day or night.' },
              ]}
            />
          ),
        },
      ]}
    >
      <div className="max-w-xs">
        <BenefitColumn />
      </div>
    </Showcase>
  );
}
