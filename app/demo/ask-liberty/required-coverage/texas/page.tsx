import type { Metadata } from 'next';
import AnswerBlock from '@/app/_components_liberty/AnswerBlock';
import AnswerWithSidebar from '@/app/_components_liberty/AnswerWithSidebar';
import AskBar from '@/app/_components_liberty/AskBar';
import Breadcrumb from '@/app/_components_liberty/Breadcrumb';
import CalloutPanel from '@/app/_components_liberty/CalloutPanel';
import HelpfulRow from '@/app/_components_liberty/HelpfulRow';
import RelatedQuestions from '@/app/_components_liberty/RelatedQuestions';
import SectionHeading from '@/app/_components_liberty/SectionHeading';
import SourcesBlock from '@/app/_components_liberty/SourcesBlock';
import StateComparisonPanel from '@/app/_components_liberty/StateComparisonPanel';
import StatePill from '@/app/_components_liberty/StatePill';
import { StatCardGrid } from '@/app/_components_liberty/StatCard';
import TitleBlock from '@/app/_components_liberty/TitleBlock';

const TITLE = 'Car insurance requirements in Texas';
const LEAD = "Texas requires drivers to carry liability coverage of at least 30/60/25. Here's what that means for you.";

export const metadata: Metadata = { title: `${TITLE} — Ask Liberty`, description: LEAD };

/** Ask Liberty "Texas" answer (page 3 of public/use-case-1-ask-liberty.html). */
export default function TexasPage() {
  return (
    <main className="bg-white">
      <AskBar question="What car insurance am I required to have?" />
      <div className="max-w-5xl mx-auto px-6">
        <Breadcrumb
          rootHref="/demo/ask-liberty"
          items={[
            'Car insurance',
            { label: 'State requirements', href: '/demo/ask-liberty/required-coverage' },
            'Texas',
          ]}
        />
        <TitleBlock
          pill={<StatePill state="Texas" href="/demo/ask-liberty/required-coverage" />}
          title={TITLE}
          lead={LEAD}
        />
        <SectionHeading title="What 30/60/25 means" description="" className="mt-14" />
        <StatCardGrid />
        <AnswerWithSidebar
          main={
            <AnswerBlock
              headingBold="Also good to know,"
              headingLight="if you drive in Texas."
              paragraphs={[
                'Insurance companies in Texas must offer you personal injury protection (PIP) and uninsured/underinsured motorist coverage. Both are included in your policy unless you reject them in writing.',
                "You'll need to show proof of insurance when you register your vehicle and if you're stopped by law enforcement. You can show your ID card right from the Liberty Mutual app.",
              ]}
            />
          }
          sidebar={
            <CalloutPanel
              title="Coverages Texas drivers often add"
              items={['Collision', 'Comprehensive', 'Uninsured/underinsured motorist', 'Roadside assistance']}
              actionLabel="Get a Texas car insurance quote ›"
            />
          }
        />
        <StateComparisonPanel />
        <SourcesBlock
          sources={[
            {
              title: 'Auto insurance guide',
              domain: 'tdi.texas.gov (Texas Department of Insurance)',
              quote: 'Texas law requires drivers to have liability insurance. The minimum required coverage is 30/60/25.',
            },
            {
              title: 'Car insurance requirements by state',
              domain: 'libertymutual.com',
              quote:
                'Each state has its own minimum car insurance requirements, and most require some form of liability coverage.',
            },
          ]}
        />
        <RelatedQuestions
          questions={[
            'What is personal injury protection (PIP)?',
            'What happens if I drive without insurance in Texas?',
            'How much car insurance do I need?',
          ]}
        />
        <HelpfulRow />
      </div>
    </main>
  );
}
