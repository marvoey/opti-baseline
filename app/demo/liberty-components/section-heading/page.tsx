import SectionHeading from '@/app/_components_liberty/SectionHeading';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('section-heading');

export default function Page() {
  return (
    <Showcase
      slug="section-heading"
      props={[
        { name: 'title', type: 'string', defaultValue: '"How your coverages apply to a rental car"' },
        { name: 'description', type: 'string', defaultValue: '"Here\'s how the most common car insurance coverages…"', note: 'Pass "" to hide' },
        { name: 'as', type: "'h2' | 'h3'", defaultValue: "'h2'" },
        { name: 'className', type: 'string', defaultValue: "'mt-16'", note: 'Spacing; replaces the default (e.g. mt-0)' },
      ]}
      variants={[
        {
          label: 'Heading only',
          node: <SectionHeading className="mt-0" title="What 30/60/25 means" description="" />,
        },
        {
          label: 'Custom text',
          node: (
            <SectionHeading
              className="mt-0"
              title="When water gets in: what's typically covered"
              description="How a claim is handled depends on where the water came from and how the damage happened."
            />
          ),
        },
      ]}
    >
      <SectionHeading className="mt-0" />
    </Showcase>
  );
}
