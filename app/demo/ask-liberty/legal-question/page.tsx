import type { Metadata } from 'next';
import { AnswerLinkCardGrid } from '@/app/_components_liberty/AnswerLinkCard';
import AskBar from '@/app/_components_liberty/AskBar';
import Breadcrumb from '@/app/_components_liberty/Breadcrumb';
import Button from '@/app/_components_liberty/Button';
import HandoffBanner from '@/app/_components_liberty/HandoffBanner';
import HelpfulRow from '@/app/_components_liberty/HelpfulRow';
import SectionHeading from '@/app/_components_liberty/SectionHeading';
import TitleBlock from '@/app/_components_liberty/TitleBlock';

const TITLE = "We can't give legal advice";
const LEAD =
  "Questions about taking legal action are best answered by an attorney. Here's how we can help you after an accident.";

export const metadata: Metadata = { title: `${TITLE} — Ask Liberty`, description: LEAD };

/**
 * Ask Liberty "Legal question" fallback (page 7 of public/use-case-1-ask-liberty.html).
 * A question we must not answer: it says so, then points to real help and approved answers.
 */
export default function LegalQuestionPage() {
  return (
    <main className="bg-white">
      <AskBar question="Should I sue the other driver?" />
      <div className="max-w-5xl mx-auto px-6">
        <Breadcrumb rootHref="/demo/ask-liberty" items={['Claims', 'After an accident']} />
        <TitleBlock
          title={TITLE}
          lead={LEAD}
          actions={
            <>
              <Button href="#">Start a claim</Button>
              <Button href="#" variant="outline">
                Talk to an agent
              </Button>
            </>
          }
        />
        <HandoffBanner />
        <SectionHeading title="Answers that may help" description="" />
        <AnswerLinkCardGrid
          cards={[
            {
              category: 'After an accident',
              title: 'What should I do after a car accident?',
              description: 'Steps to take at the scene and in the days after to protect yourself and your claim.',
            },
            {
              category: 'Claims',
              title: 'How is fault decided in a car insurance claim?',
              description: "How adjusters review police reports, statements and damage to decide who's responsible.",
            },
            {
              category: 'Coverage',
              title: 'What does uninsured motorist coverage pay for?',
              description:
                "How this coverage helps when the other driver doesn't have enough insurance, or none at all.",
            },
          ]}
        />
        <HelpfulRow />
      </div>
    </main>
  );
}
