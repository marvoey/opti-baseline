import IconBadge from '@/app/_components_liberty/IconBadge';
import { ICON_NAMES } from '@/app/_components_liberty/Icons';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('icon-badge');

export default function Page() {
  return (
    <Showcase
      slug="icon-badge"
      props={[
        { name: 'icon', type: 'IconName', defaultValue: "'auto'", note: ICON_NAMES.join(' · ') },
        { name: 'size', type: "'md' | 'lg' | 'xl'", defaultValue: "'md'", note: '40px · 56px · 48px' },
        { name: 'tone', type: "'white' | 'mist'", defaultValue: "'white'", note: 'white on cream/mist cards, mist on white cards' },
        { name: 'label', type: 'string', defaultValue: 'none', note: 'Accessible name; omit for decorative icons' },
        { name: 'className', type: 'string' },
      ]}
      variants={[
        {
          label: 'Sizes and tones',
          node: (
            <div className="flex flex-wrap items-center gap-6">
              <div className="bg-cream p-4 rounded-xl flex items-center gap-4">
                <IconBadge size="md" />
                <IconBadge size="lg" />
                <IconBadge size="xl" />
              </div>
              <div className="flex items-center gap-4">
                <IconBadge size="md" tone="mist" icon="user" />
                <IconBadge size="lg" tone="mist" icon="user" />
                <IconBadge size="xl" tone="mist" icon="user" />
              </div>
            </div>
          ),
        },
        {
          label: 'Every icon',
          node: (
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-4">
              {ICON_NAMES.map((name) => (
                <div key={name} className="flex flex-col items-center gap-2 bg-cream rounded-xl p-4">
                  <IconBadge icon={name} />
                  <code className="text-xs text-navy">{name}</code>
                </div>
              ))}
            </div>
          ),
        },
      ]}
    >
      <div className="bg-cream inline-block p-4 rounded-xl">
        <IconBadge />
      </div>
    </Showcase>
  );
}
