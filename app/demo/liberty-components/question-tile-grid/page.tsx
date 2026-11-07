import QuestionTileGrid from '@/app/_components_liberty/QuestionTileGrid';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('question-tile-grid');

export default function Page() {
  return (
    <Showcase
      slug="question-tile-grid"
      flush
      props={[
        { name: 'heading', type: 'string', defaultValue: '"Questions people are asking"' },
        {
          name: 'tiles',
          type: '{ category: string; question: string; linkLabel?: string; href?: string }[]',
          defaultValue: '6 tiles (Car ×2, Home, Bundles, Claims ×2)',
          note: 'linkLabel defaults to "Get the answer ›"',
        },
        { name: 'className', type: 'string', defaultValue: "'py-14'", note: 'Vertical padding; replaces the default' },
      ]}
      variants={[
        {
          label: 'Custom heading and tiles',
          flush: true,
          node: (
            <QuestionTileGrid
              heading="Popular with renters"
              tiles={[
                { category: 'Renters', question: 'What does renters insurance cover?', linkLabel: 'Read more ›' },
                { category: 'Renters', question: 'Do I need renters insurance?', linkLabel: 'Read more ›' },
                { category: 'Bundles', question: 'Can I bundle renters and auto?', linkLabel: 'Read more ›' },
              ]}
            />
          ),
        },
      ]}
    >
      <QuestionTileGrid />
    </Showcase>
  );
}
