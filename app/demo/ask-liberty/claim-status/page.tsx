import type { Metadata } from 'next';
import AccountActionCard from '@/app/_components_liberty/AccountActionCard';
import AskBar from '@/app/_components_liberty/AskBar';
import Breadcrumb from '@/app/_components_liberty/Breadcrumb';
import { FeatureCardGrid } from '@/app/_components_liberty/FeatureCard';
import HelpfulRow from '@/app/_components_liberty/HelpfulRow';
import RelatedQuestions from '@/app/_components_liberty/RelatedQuestions';
import SectionHeading from '@/app/_components_liberty/SectionHeading';
import TitleBlock from '@/app/_components_liberty/TitleBlock';

const TITLE = 'Check the status of your claim';
const LEAD =
  "To protect your privacy, claim details are only available once we verify it's you. Log in or look up your claim below.";

export const metadata: Metadata = { title: `${TITLE} — Ask Liberty`, description: LEAD };

/**
 * Ask Liberty "Claim status" answer (page 6 of public/use-case-1-ask-liberty.html).
 * Account-specific, so it hands off to login / claim look-up instead of answering.
 */
export default function ClaimStatusPage() {
  return (
    <main className="bg-white">
      <AskBar question="My claim hasn't been paid yet, where is it?" />
      <div className="max-w-5xl mx-auto px-6">
        <Breadcrumb rootHref="/demo/ask-liberty" items={['Claims', 'Track your claim']} />
        <TitleBlock title={TITLE} lead={LEAD} />
        <div className="mt-10 grid md:grid-cols-2 gap-6">
          <AccountActionCard variant="login" />
          <AccountActionCard variant="lookup" />
        </div>
        <SectionHeading title="Other ways to get help with your claim" description="" />
        <FeatureCardGrid
          cards={[
            {
              icon: null,
              title: 'Use the Liberty Mutual app',
              description: 'Get claim updates, upload photos and message your representative from your phone.',
              linkLabel: 'Get the app ›',
            },
            {
              icon: null,
              title: 'Message your claims representative',
              description: 'Log in to send a secure message and get a reply from the person handling your claim.',
              linkLabel: 'Send a message ›',
            },
            {
              icon: null,
              title: 'Call us 24/7',
              description: 'Claims support is available any time, day or night.',
              linkLabel: 'See claims contact options ›',
            },
          ]}
        />
        <RelatedQuestions
          questions={[
            'How long does a car insurance claim take?',
            'What happens after I file a claim?',
            'How will I receive my claim payment?',
          ]}
        />
        <HelpfulRow />
      </div>
    </main>
  );
}
