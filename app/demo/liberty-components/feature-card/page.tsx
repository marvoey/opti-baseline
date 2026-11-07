import FeatureCard, { FeatureCardGrid } from '@/app/_components_liberty/FeatureCard';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('feature-card');

export default function Page() {
  return (
    <Showcase
      slug="feature-card"
      props={[
        { name: 'title', type: 'string', defaultValue: '"Water backup and sump pump overflow"' },
        { name: 'description', type: 'string', defaultValue: '"Helps cover damage when water backs up…"' },
        { name: 'icon', type: 'IconName | null', defaultValue: "'home'", note: 'null removes the icon' },
        { name: 'linkLabel', type: 'string', defaultValue: 'none', note: 'Link is only shown when set' },
        { name: 'linkHref', type: 'string', defaultValue: '"#"' },
        { name: 'FeatureCardGrid cards', type: 'FeatureCardProps[]', defaultValue: '3 water-damage cards', note: 'Row of three' },
        { name: 'FeatureCardGrid className', type: 'string', defaultValue: "'mt-8'", note: 'Replaces the default spacing' },
      ]}
      variants={[
        {
          label: 'Icon and link',
          node: (
            <div className="max-w-sm">
              <FeatureCard linkLabel="Learn more ›" />
            </div>
          ),
        },
        {
          label: 'No icon, link only (claim help)',
          node: (
            <div className="max-w-sm">
              <FeatureCard
                icon={null}
                title="Use the Liberty Mutual app"
                description="Get claim updates, upload photos and message your representative from your phone."
                linkLabel="Get the app ›"
              />
            </div>
          ),
        },
        { label: '<FeatureCardGrid /> (row of three)', node: <FeatureCardGrid className="mt-0" /> },
      ]}
    >
      <div className="max-w-sm">
        <FeatureCard />
      </div>
    </Showcase>
  );
}
