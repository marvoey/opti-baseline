import type { Metadata } from 'next';
import AnswerBlock from '@/app/_components_liberty/AnswerBlock';
import AnswerWithSidebar from '@/app/_components_liberty/AnswerWithSidebar';
import AskBar from '@/app/_components_liberty/AskBar';
import { BenefitColumnGrid } from '@/app/_components_liberty/BenefitColumn';
import Breadcrumb from '@/app/_components_liberty/Breadcrumb';
import CalloutPanel from '@/app/_components_liberty/CalloutPanel';
import { FeatureCardGrid } from '@/app/_components_liberty/FeatureCard';
import HelpfulRow from '@/app/_components_liberty/HelpfulRow';
import IllustrationBanner from '@/app/_components_liberty/IllustrationBanner';
import RelatedQuestions from '@/app/_components_liberty/RelatedQuestions';
import SectionHeading from '@/app/_components_liberty/SectionHeading';
import SourcesBlock from '@/app/_components_liberty/SourcesBlock';
import TitleBlock from '@/app/_components_liberty/TitleBlock';

const TITLE = 'Can I bundle my home and auto insurance?';
const LEAD =
  'Yes. When you insure your home and car with Liberty Mutual, you could save on both and manage your policies in one place.';

export const metadata: Metadata = { title: `${TITLE} — Ask Liberty`, description: LEAD };

/** Ask Liberty "Bundling" answer (page 5 of public/use-case-1-ask-liberty.html). */
export default function BundlingPage() {
  return (
    <main className="bg-white">
      <AskBar question={TITLE} />
      <div className="max-w-5xl mx-auto px-6">
        <Breadcrumb rootHref="/demo/ask-liberty" items={['Insurance discounts', 'Bundle and save']} />
        <TitleBlock title={TITLE} lead={LEAD} />
        <IllustrationBanner scene="family" className="mt-10" />
        <AnswerWithSidebar
          main={
            <AnswerBlock
              headingBold="Auto and home,"
              headingLight="better together."
              paragraphs={[
                'A bundle is when you have more than one policy with the same insurance company. When you combine auto and home insurance with Liberty Mutual, you can qualify for a multi-policy discount.',
                'You can also bundle auto with renters or condo insurance, and add other policies like motorcycle or boat. The more you insure with us, the more you could save.',
              ]}
            />
          }
          sidebar={<CalloutPanel variant="links" />}
        />
        <SectionHeading title="What can you bundle with Liberty Mutual?" description="" />
        <FeatureCardGrid
          cards={[
            {
              icon: 'home',
              title: 'Auto and home insurance bundle',
              description: 'Protect your car and your home with one company and one point of contact.',
              linkLabel: 'Start your home quote to bundle and save ›',
            },
            {
              icon: 'renters',
              title: 'Auto and renters insurance bundle',
              description: "Cover your car and your belongings, even if you don't own your home.",
              linkLabel: 'Start your renters quote to bundle and save ›',
            },
            {
              icon: 'condo',
              title: 'Auto and condo insurance bundle',
              description: 'Insure your car and your condo unit together.',
              linkLabel: 'Start your condo quote to bundle and save ›',
            },
          ]}
        />
        <BenefitColumnGrid />
        <SourcesBlock
          sources={[
            {
              title: 'Bundle auto and home insurance to save',
              domain: 'libertymutual.com',
              quote: 'A home and auto insurance bundle is the easiest way to save money on your insurance.',
            },
            {
              title: 'Insurance discounts',
              domain: 'libertymutual.com',
              quote: 'You can also save when you insure more than one car with us, with our multi-car discount.',
            },
          ]}
        />
        <RelatedQuestions
          questions={[
            'What other car insurance discounts are there?',
            'Can I bundle renters and auto insurance?',
            'Can I add my motorcycle to a bundle?',
          ]}
        />
        <HelpfulRow />
      </div>
    </main>
  );
}
