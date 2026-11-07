import RelatedQuestions from '@/app/_components_liberty/RelatedQuestions';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('related-questions');

export default function Page() {
  return (
    <Showcase
      slug="related-questions"
      props={[
        { name: 'heading', type: 'string', defaultValue: '"People also ask"' },
        {
          name: 'questions',
          type: 'string | { question: string; href?: string }[]',
          defaultValue: '3 rental-car questions',
        },
        { name: 'linkLabel', type: 'string', defaultValue: '"Get the answer ›"' },
        { name: 'className', type: 'string', defaultValue: "'mt-14'", note: 'Replaces the default spacing' },
      ]}
      variants={[
        {
          label: 'Custom text and links',
          node: (
            <RelatedQuestions
              className="mt-0"
              heading="Related answers"
              linkLabel="Read ›"
              questions={[
                { question: 'How do I prevent frozen pipes?', href: '/demo/liberty-components' },
                { question: 'Does home insurance cover mold?', href: '/demo/liberty-components' },
                { question: 'Do I need flood insurance?', href: '/demo/liberty-components' },
              ]}
            />
          ),
        },
      ]}
    >
      <RelatedQuestions className="mt-0" />
    </Showcase>
  );
}
