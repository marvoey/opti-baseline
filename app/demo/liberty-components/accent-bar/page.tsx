import AccentBar from '@/app/_components_liberty/AccentBar';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('accent-bar');

export default function Page() {
  return (
    <Showcase
      slug="accent-bar"
      props={[{ name: 'className', type: 'string', note: 'Spacing and alignment, e.g. "mt-4" or "mx-auto mt-3"' }]}
      variants={[
        {
          label: 'Under a heading',
          node: (
            <div>
              <h2 className="text-[30px] leading-tight text-navy">
                <span className="font-bold">Auto and home,</span>
                <br />
                <span className="font-light">better together.</span>
              </h2>
              <AccentBar className="mt-4" />
            </div>
          ),
        },
        {
          label: 'Centred',
          node: (
            <div className="text-center">
              <div className="text-[44px] font-light text-navy">$30,000</div>
              <AccentBar className="mx-auto mt-3" />
            </div>
          ),
        },
      ]}
    >
      <AccentBar />
    </Showcase>
  );
}
