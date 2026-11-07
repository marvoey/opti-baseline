import SourcesBlock from '@/app/_components_liberty/SourcesBlock';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('sources-block');

export default function Page() {
  return (
    <Showcase
      slug="sources-block"
      props={[
        { name: 'heading', type: 'string', defaultValue: '"Sources for this answer"' },
        {
          name: 'sources',
          type: '{ title; domain; quote; href? }[]',
          defaultValue: '2 rental-car sources',
        },
        { name: 'disclaimer', type: 'string', defaultValue: 'the standard legal paragraph', note: 'Pass "" to hide' },
        { name: 'className', type: 'string', defaultValue: "'mt-16'", note: 'Replaces the default spacing' },
      ]}
      variants={[
        {
          label: 'Texas sources (custom text)',
          node: (
            <SourcesBlock
              className="mt-0"
              sources={[
                {
                  title: 'Auto insurance guide',
                  domain: 'tdi.texas.gov (Texas Department of Insurance)',
                  quote: 'Texas law requires drivers to have liability insurance. The minimum required coverage is 30/60/25.',
                },
                {
                  title: 'Car insurance requirements by state',
                  domain: 'libertymutual.com',
                  quote:
                    'Each state has its own minimum car insurance requirements, and most require some form of liability coverage.',
                },
              ]}
            />
          ),
        },
        {
          label: 'One source, no disclaimer',
          node: (
            <SourcesBlock
              className="mt-0"
              heading="Where this came from"
              disclaimer=""
              sources={[
                {
                  title: 'Insurance discounts',
                  domain: 'libertymutual.com',
                  quote: 'You can also save when you insure more than one car with us, with our multi-car discount.',
                },
              ]}
            />
          ),
        },
      ]}
    >
      <SourcesBlock className="mt-0" />
    </Showcase>
  );
}
