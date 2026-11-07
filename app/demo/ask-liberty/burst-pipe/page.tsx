import type { Metadata } from 'next';
import AnswerBlock from '@/app/_components_liberty/AnswerBlock';
import AnswerWithSidebar from '@/app/_components_liberty/AnswerWithSidebar';
import AskBar from '@/app/_components_liberty/AskBar';
import Breadcrumb from '@/app/_components_liberty/Breadcrumb';
import CalloutPanel from '@/app/_components_liberty/CalloutPanel';
import CoverageTable from '@/app/_components_liberty/CoverageTable';
import { FeatureCardGrid } from '@/app/_components_liberty/FeatureCard';
import HelpfulRow from '@/app/_components_liberty/HelpfulRow';
import IllustrationBanner from '@/app/_components_liberty/IllustrationBanner';
import RelatedQuestions from '@/app/_components_liberty/RelatedQuestions';
import SectionHeading from '@/app/_components_liberty/SectionHeading';
import SourcesBlock from '@/app/_components_liberty/SourcesBlock';
import TitleBlock from '@/app/_components_liberty/TitleBlock';

const TITLE = 'Is water damage from a burst pipe covered?';
const LEAD =
  "Typically, yes. Homeowners insurance usually covers water damage that's sudden and accidental, like a pipe that bursts. Damage from slow leaks or flooding usually isn't covered.";

export const metadata: Metadata = { title: `${TITLE} — Ask Liberty`, description: LEAD };

/** Ask Liberty "Burst pipe" answer (page 4 of public/use-case-1-ask-liberty.html). */
export default function BurstPipePage() {
  return (
    <main className="bg-white">
      <AskBar question="Is water damage from a burst pipe covered by home insurance?" />
      <div className="max-w-5xl mx-auto px-6">
        <Breadcrumb rootHref="/demo/ask-liberty" items={['Homeowners insurance', 'Water damage']} />
        <TitleBlock title={TITLE} lead={LEAD} />
        <IllustrationBanner scene="house" className="mt-10" />
        <AnswerWithSidebar
          main={
            <AnswerBlock
              headingBold="Sudden damage is usually covered,"
              headingLight="gradual damage usually isn't."
              paragraphs={[
                'If a pipe bursts and soaks your floors, walls and belongings, your dwelling and personal property coverages typically help pay for repairs and replacement, minus your deductible.',
                'Damage that builds up over time, such as a slow drip under a sink, is usually considered a maintenance issue. Flooding from outside water, like heavy rain or an overflowing river, requires a separate flood insurance policy.',
              ]}
            />
          }
          sidebar={<CalloutPanel variant="steps" />}
        />
        <SectionHeading
          title="When water gets in: what's typically covered"
          description="How a claim is handled depends on where the water came from and how the damage happened."
        />
        <CoverageTable
          headers={['Situation', 'Real-life example', 'Typically covered']}
          columns={['200px', '1fr', '190px']}
          rows={[
            {
              name: 'Burst pipe',
              example: 'A pipe inside a wall bursts during a cold snap and floods the kitchen.',
              status: { variant: 'positive', label: 'Yes' },
              nameAsLink: true,
            },
            {
              name: 'Appliance failure',
              example: 'Your washing machine hose suddenly splits.',
              status: { variant: 'positive', label: 'Yes' },
              nameAsLink: true,
            },
            {
              name: 'Slow, ongoing leak',
              example: 'A drip under the bathroom sink damages the cabinet over several months.',
              status: { variant: 'gray', label: 'Usually not' },
            },
            {
              name: 'Flood',
              example: 'Heavy rain causes a nearby creek to overflow into your basement.',
              status: { variant: 'mist', label: 'Separate flood policy' },
              nameAsLink: true,
            },
            {
              name: 'Water backup',
              example: 'Your sump pump fails and water backs up into the finished basement.',
              status: { variant: 'mist', label: 'With optional coverage' },
              nameAsLink: true,
            },
          ]}
        />
        <SectionHeading title="Coverage you can add for more protection" description="" />
        <FeatureCardGrid
          cards={[
            {
              icon: 'home',
              title: 'Water backup and sump pump overflow',
              description: 'Helps cover damage when water backs up through drains or your sump pump overflows.',
              linkLabel: 'Learn more ›',
            },
            {
              icon: 'condo',
              title: 'Flood insurance',
              description: "Protects your home and belongings from flooding, which homeowners policies don't cover.",
              linkLabel: 'Learn more ›',
            },
            {
              icon: 'renters',
              title: 'Personal property replacement cost',
              description: 'Helps pay to replace damaged belongings with new ones, not their depreciated value.',
              linkLabel: 'Learn more ›',
            },
          ]}
        />
        <SourcesBlock
          sources={[
            {
              title: 'Does homeowners insurance cover water damage?',
              domain: 'libertymutual.com',
              quote:
                'Homeowners insurance typically covers water damage that is sudden and accidental, such as from a burst pipe, but not damage from flooding or a lack of maintenance.',
            },
            {
              title: 'Water backup and sump pump overflow coverage',
              domain: 'libertymutual.com',
              quote:
                'This optional coverage helps pay for damage caused when water backs up through a drain or your sump pump overflows.',
            },
          ]}
        />
        <RelatedQuestions
          questions={['How do I prevent frozen pipes?', 'Does home insurance cover mold?', 'Do I need flood insurance?']}
        />
        <HelpfulRow />
      </div>
    </main>
  );
}
