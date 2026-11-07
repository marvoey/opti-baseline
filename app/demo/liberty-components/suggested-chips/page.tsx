import SuggestedChips from '@/app/_components_liberty/SuggestedChips';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('suggested-chips');

export default function Page() {
  return (
    <Showcase
      slug="suggested-chips"
      props={[
        {
          name: 'chips',
          type: '{ label: string; href?: string }[]',
          defaultValue: '4 chips: rental car, burst pipe, required insurance, bundling',
        },
        { name: 'className', type: 'string', defaultValue: "'mt-5'", note: 'Replaces the default spacing' },
      ]}
      variants={[
        {
          label: 'Custom chips with links',
          node: (
            <SuggestedChips
              chips={[
                { label: 'How do I file a claim?', href: '/demo/liberty-components' },
                { label: 'Can I add a driver to my policy?', href: '/demo/liberty-components' },
                { label: 'What does renters insurance cover?' },
              ]}
            />
          ),
        },
      ]}
    >
      <SuggestedChips />
    </Showcase>
  );
}
