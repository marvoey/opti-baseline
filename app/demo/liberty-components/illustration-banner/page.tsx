import IllustrationBanner from '@/app/_components_liberty/IllustrationBanner';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('illustration-banner');

export default function Page() {
  return (
    <Showcase
      slug="illustration-banner"
      props={[
        { name: 'scene', type: "'road' | 'house' | 'family'", defaultValue: "'road'", note: 'road = rental car · house = water damage · family = home + auto' },
        { name: 'ariaLabel', type: 'string', defaultValue: 'a description per scene', note: 'Accessible description of the picture' },
        { name: 'className', type: 'string' },
        { name: 'Car / House / Tree', type: '{ x; y; s? }', note: 'The SVG pieces are also exported to build new scenes' },
      ]}
      variants={[
        { label: 'scene="house"', node: <IllustrationBanner scene="house" /> },
        { label: 'scene="family"', node: <IllustrationBanner scene="family" /> },
        {
          label: 'Custom accessible description',
          node: <IllustrationBanner scene="road" ariaLabel="A yellow car driving past a tree" />,
        },
      ]}
    >
      <IllustrationBanner />
    </Showcase>
  );
}
