import type { Metadata } from 'next';
import { redirect } from 'next/navigation';
import AnswerBlock from '@/app/_components_liberty/AnswerBlock';
import AnswerWithSidebar from '@/app/_components_liberty/AnswerWithSidebar';
import AskBar from '@/app/_components_liberty/AskBar';
import Breadcrumb from '@/app/_components_liberty/Breadcrumb';
import CalloutPanel from '@/app/_components_liberty/CalloutPanel';
import { FeatureCardGrid } from '@/app/_components_liberty/FeatureCard';
import RelatedQuestions from '@/app/_components_liberty/RelatedQuestions';
import SectionHeading from '@/app/_components_liberty/SectionHeading';
import StateSelectorCard from '@/app/_components_liberty/StateSelectorCard';
import TitleBlock from '@/app/_components_liberty/TitleBlock';

const QUESTION = 'What car insurance am I required to have?';
const LEAD =
  'It depends on where your car is registered. Every state sets its own minimum requirements. Choose your state to see what applies to you.';

export const metadata: Metadata = { title: `${QUESTION} — Ask Liberty`, description: LEAD };

/**
 * Ask Liberty "Required coverage" answer (page 2 of public/use-case-1-ask-liberty.html).
 * The question needs one more detail, so the page asks for the state first. The
 * state picker is a GET form: choosing Texas continues to ./texas (the only state
 * page in this demo); other states stay here.
 */
export default async function RequiredCoveragePage({
  searchParams,
}: {
  searchParams: Promise<{ state?: string | string[] }>;
}) {
  const { state } = await searchParams;
  if (state === 'Texas') redirect('/demo/ask-liberty/required-coverage/texas');

  return (
    <main className="bg-white">
      <AskBar question={QUESTION} />
      <div className="max-w-5xl mx-auto px-6">
        <Breadcrumb rootHref="/demo/ask-liberty" items={['Car insurance', 'State requirements']} />
        <TitleBlock title={QUESTION} lead={LEAD} />
        <StateSelectorCard attention />
        <SectionHeading
          title="What most states require"
          description="Nearly every state requires liability coverage. Some states require additional coverages too."
        />
        <FeatureCardGrid
          cards={[
            {
              icon: 'auto',
              title: 'Bodily injury liability',
              description: 'Helps pay for injuries to other people when you cause an accident.',
            },
            {
              icon: 'home',
              title: 'Property damage liability',
              description: "Helps pay for damage you cause to someone else's car or property.",
            },
            {
              icon: 'life',
              title: 'Additional state coverages',
              description:
                'Some states also require personal injury protection, uninsured motorist coverage, or both.',
            },
          ]}
        />
        <AnswerWithSidebar
          main={
            <AnswerBlock
              headingBold="Is the state minimum enough?"
              headingLight="It's a starting point."
              paragraphs={[
                'State minimums set the least coverage you can legally carry. If you cause an accident, costs above your limits could be your responsibility, so many drivers choose higher limits and add coverages like collision and comprehensive.',
              ]}
            />
          }
          sidebar={<CalloutPanel variant="text" />}
        />
        <RelatedQuestions
          className="mt-14 pb-14"
          questions={[
            'What does liability insurance cover?',
            'What is uninsured motorist coverage?',
            'How much car insurance do I need?',
          ]}
        />
      </div>
    </main>
  );
}
