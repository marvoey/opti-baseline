import AnswerWithSidebar from '@/app/_components_liberty/AnswerWithSidebar';
import Breadcrumb from '@/app/_components_liberty/Breadcrumb';
import CoverageTable from '@/app/_components_liberty/CoverageTable';
import IllustrationBanner from '@/app/_components_liberty/IllustrationBanner';
import SectionHeading from '@/app/_components_liberty/SectionHeading';
import StagedReveal from '@/app/_components_liberty/StagedReveal';
import TitleBlock from '@/app/_components_liberty/TitleBlock';
import Replayable from '../_showcase/Replayable';
import Showcase from '../_showcase/Showcase';
import { componentMetadata } from '../_showcase/registry';

export const metadata = componentMetadata('staged-reveal');

function MiniAnswerPage() {
  return (
    <StagedReveal>
      <div className="max-w-5xl mx-auto px-6 pb-10">
        <Breadcrumb />
        <TitleBlock streamLead />
        <IllustrationBanner className="mt-10" scene="road" />
        <AnswerWithSidebar />
        <SectionHeading />
        <CoverageTable />
      </div>
    </StagedReveal>
  );
}

export default function Page() {
  return (
    <Showcase
      slug="staged-reveal"
      flush
      props={[
        { name: 'children', type: 'ReactNode', note: 'A composed answer page. Elements with data-reveal are revealed in reading order' },
        { name: 'autoPlay', type: 'boolean', defaultValue: 'true', note: 'false leaves everything visible' },
        { name: 'playKey', type: 'number', defaultValue: '0', note: 'Change to replay' },
        { name: 'speed', type: 'number', defaultValue: '1', note: '2 = twice as fast' },
        { name: 'className', type: 'string' },
        {
          name: 'data-reveal',
          type: "'card' | 'row' | 'li' | 'illo' | 'accent' | 'stream'",
          note: 'Attribute on your own markup. Every Liberty component sets it already',
        },
      ]}
      variants={[
        {
          label: 'Same page at double speed',
          flush: true,
          node: (
            <Replayable>
              <StagedReveal speed={2}>
                <div className="max-w-5xl mx-auto px-6 pb-10">
                  <TitleBlock streamLead />
                  <AnswerWithSidebar />
                </div>
              </StagedReveal>
            </Replayable>
          ),
        },
        {
          label: 'Without animation (autoPlay={false})',
          flush: true,
          node: (
            <StagedReveal autoPlay={false}>
              <div className="max-w-5xl mx-auto px-6 pb-10">
                <TitleBlock />
              </div>
            </StagedReveal>
          ),
        },
      ]}
    >
      <Replayable>
        <MiniAnswerPage />
      </Replayable>
    </Showcase>
  );
}
