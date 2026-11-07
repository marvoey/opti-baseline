import AnswerLinkCard, { AnswerLinkCardGrid } from '@/app/_components_liberty/AnswerLinkCard';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('answer-link-card');

export default function Page() {
  return (
    <Showcase
      slug="answer-link-card"
      props={[
        { name: 'category', type: 'string', defaultValue: '"After an accident"' },
        { name: 'title', type: 'string', defaultValue: '"What should I do after a car accident?"' },
        { name: 'description', type: 'string', defaultValue: '"Steps to take at the scene and in the days after…"' },
        { name: 'linkLabel', type: 'string', defaultValue: '"Read the answer ›"' },
        { name: 'href', type: 'string', defaultValue: '"#"' },
        { name: 'className', type: 'string' },
        { name: 'AnswerLinkCardGrid cards', type: 'AnswerLinkCardProps[]', defaultValue: '3 legal-fallback cards', note: 'Row of three' },
        { name: 'AnswerLinkCardGrid className', type: 'string', defaultValue: "'mt-8'", note: 'Replaces the default spacing' },
      ]}
      variants={[
        { label: '<AnswerLinkCardGrid /> (row of three)', node: <AnswerLinkCardGrid className="mt-0" /> },
        {
          label: 'Custom text',
          node: (
            <div className="max-w-sm">
              <AnswerLinkCard
                category="Home"
                title="Does home insurance cover mold?"
                description="When mold is covered, when it isn't, and how to protect your home."
                linkLabel="Read more ›"
              />
            </div>
          ),
        },
      ]}
    >
      <div className="max-w-sm">
        <AnswerLinkCard />
      </div>
    </Showcase>
  );
}
