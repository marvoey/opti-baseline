import type { Metadata } from 'next';
import AnswerWithSidebar from '@/app/_components_liberty/AnswerWithSidebar';
import AskBar from '@/app/_components_liberty/AskBar';
import Breadcrumb from '@/app/_components_liberty/Breadcrumb';
import Button from '@/app/_components_liberty/Button';
import CoverageTable from '@/app/_components_liberty/CoverageTable';
import HelpfulRow from '@/app/_components_liberty/HelpfulRow';
import IllustrationBanner from '@/app/_components_liberty/IllustrationBanner';
import RelatedQuestions from '@/app/_components_liberty/RelatedQuestions';
import SectionHeading from '@/app/_components_liberty/SectionHeading';
import SourcesBlock from '@/app/_components_liberty/SourcesBlock';
import TitleBlock from '@/app/_components_liberty/TitleBlock';

export const metadata: Metadata = {
  title: 'Does my car insurance cover a rental car? — Ask Liberty',
  description:
    'In most cases, yes. The coverages on your personal auto policy typically extend to a car you rent for personal use in the U.S.',
};

/**
 * Ask Liberty "Rental car" answer (page 1 of public/use-case-1-ask-liberty.html),
 * composed from app/_components_liberty. The components' default text is this
 * page's copy, so only the parts that differ from the defaults are passed in.
 * The site header and footer come from ../layout.tsx (SiteChrome).
 */
export default function RentalCarPage() {
  return (
    <main className="bg-white">
      <AskBar />
      <div className="max-w-5xl mx-auto px-6">
        <Breadcrumb rootHref="/demo/ask-liberty" />
        <TitleBlock />
        <IllustrationBanner scene="road" className="mt-10" />
        <AnswerWithSidebar />
        <SectionHeading />
        <CoverageTable />
        <div className="text-center mt-8">
          <Button href="#">View all car coverages</Button>
        </div>
        <SourcesBlock />
        <RelatedQuestions />
        <HelpfulRow />
      </div>
    </main>
  );
}
