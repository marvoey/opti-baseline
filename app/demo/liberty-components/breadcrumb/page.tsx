import Breadcrumb from '@/app/_components_liberty/Breadcrumb';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('breadcrumb');

export default function Page() {
  return (
    <Showcase
      slug="breadcrumb"
      props={[
        { name: 'rootLabel', type: 'string', defaultValue: '"Answers"' },
        { name: 'rootHref', type: 'string', defaultValue: '"#"' },
        {
          name: 'items',
          type: 'string | { label: string; href?: string }[]',
          defaultValue: '["Car insurance", "Rental cars"]',
          note: 'The last item is the current page and is not a link',
        },
        { name: 'ariaLabel', type: 'string', defaultValue: '"Breadcrumb"' },
        { name: 'className', type: 'string', defaultValue: "'pt-4'", note: 'Replaces the default spacing' },
      ]}
      variants={[
        {
          label: 'Three levels (Texas page)',
          node: <Breadcrumb items={['Car insurance', 'State requirements', 'Texas']} />,
        },
        {
          label: 'Custom text and links',
          node: (
            <Breadcrumb
              rootLabel="Help centre"
              rootHref="/demo/liberty-components"
              items={[{ label: 'Claims', href: '/demo/liberty-components' }, 'Track your claim']}
            />
          ),
        },
      ]}
    >
      <Breadcrumb />
    </Showcase>
  );
}
