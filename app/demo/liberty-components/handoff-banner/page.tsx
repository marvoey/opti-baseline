import HandoffBanner from '@/app/_components_liberty/HandoffBanner';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('handoff-banner');

export default function Page() {
  return (
    <Showcase
      slug="handoff-banner"
      props={[
        { name: 'icon', type: 'IconName', defaultValue: "'auto'" },
        { name: 'title', type: 'string', defaultValue: '"Were you just in an accident?"' },
        { name: 'description', type: 'string', defaultValue: '"Make sure everyone is safe and call 911 if anyone is hurt…"' },
        { name: 'buttonLabel', type: 'string', defaultValue: '"Start a claim"' },
        { name: 'buttonHref', type: 'string', defaultValue: '"#"' },
        { name: 'className', type: 'string', defaultValue: "'mt-14'", note: 'Replaces the default spacing' },
      ]}
      variants={[
        {
          label: 'Custom text',
          node: (
            <HandoffBanner
              className="mt-0"
              icon="home"
              title="Has something happened at home?"
              description="If anyone is in danger, call 911 first. When it's safe, we can help you start a home claim."
              buttonLabel="Report home damage"
            />
          ),
        },
      ]}
    >
      <HandoffBanner className="mt-0" />
    </Showcase>
  );
}
