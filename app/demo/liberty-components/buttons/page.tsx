import Button from '@/app/_components_liberty/Button';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('buttons');

export default function Page() {
  return (
    <Showcase
      slug="buttons"
      props={[
        { name: 'children', type: 'ReactNode', defaultValue: '"Start a claim"', note: 'Button text' },
        { name: 'variant', type: "'primary' | 'outline' | 'navy'", defaultValue: "'primary'" },
        { name: 'size', type: "'md' | 'sm'", defaultValue: "'md'", note: 'px-8 or px-6; ignored when fullWidth' },
        { name: 'fullWidth', type: 'boolean', defaultValue: 'false', note: 'Block, centred' },
        { name: 'tight', type: 'boolean', defaultValue: 'false', note: 'py-2.5, as in callout panels' },
        { name: 'href', type: 'string', note: 'Renders a link when set, a <button> when not' },
        { name: 'type', type: "'button' | 'submit' | 'reset'", defaultValue: "'button'", note: 'Only for <button>' },
        { name: 'className', type: 'string' },
      ]}
      variants={[
        {
          label: 'The three variants',
          node: (
            <div className="flex flex-wrap items-center gap-3">
              <Button href="#">View all car coverages</Button>
              <Button href="#" variant="outline">
                Find my claim
              </Button>
              <Button href="#" variant="navy">
                Start a claim
              </Button>
            </div>
          ),
        },
        {
          label: 'Full width (inside a card)',
          node: (
            <div className="max-w-sm space-y-3">
              <Button href="#" fullWidth>
                Log in
              </Button>
              <Button href="#" variant="outline" fullWidth>
                Find my claim
              </Button>
            </div>
          ),
        },
        {
          label: 'Submit button (no href)',
          node: <Button type="submit">See requirements</Button>,
        },
      ]}
    >
      <Button href="#">Start a claim</Button>
    </Showcase>
  );
}
