import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import PlanFinderWidget from '@/app/_components/PlanFinderWidget';
import { planFinderProperties, planFinderPropsFrom } from './planFinderFields';

/**
 * Standalone eHealth plan finder ("Find your health insurance plan match"):
 * a section heading plus the plan tiles / ZIP / CTA / agent phone, shown in a
 * white card (default) or flat on the section background.
 *
 * Place it in a section styled Grey to match eHealth.com.
 */
export const EhPlanFinderContentType = contentType({
  key: 'EhPlanFinder',
  baseType: '_component',
  displayName: '[eHealth] Plan Finder',
  description: '[EH] Standalone plan finder: heading, plan-type tiles, ZIP code field, orange CTA and licensed-agent phone.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Heading: {
      type: 'string',
      displayName: 'Heading',
      description: 'Section heading, e.g. "Find your health insurance plan match". Leave blank to hide.',
      isLocalized: true,
      sortOrder: 10,
    },
    Layout: {
      type: 'string',
      format: 'selectOne',
      displayName: 'Layout',
      description: 'White card (default) or flat on the section background.',
      sortOrder: 11,
      enum: [
        { value: 'card', displayName: 'White card' },
        { value: 'flat', displayName: 'Flat' },
      ],
    },
    ...planFinderProperties(50),
  },
});

type Props = { content: ContentProps<typeof EhPlanFinderContentType> };

export default function EhPlanFinder({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;
  const flat = content.Layout === 'flat';

  return (
    <div {...pa(block)} className="w-full px-6 py-10 md:py-14">
      <div className="mx-auto max-w-5xl">
        {content.Heading && (
          <h2
            {...pa('Heading')}
            className="mb-6 text-center font-display text-2xl font-bold text-blue-950 sm:text-3xl"
          >
            {content.Heading}
          </h2>
        )}
        <div className={flat ? '' : 'rounded-2xl bg-white px-4 py-8 shadow-md sm:px-10'}>
          <PlanFinderWidget {...planFinderPropsFrom(content, pa)} />
        </div>
      </div>
    </div>
  );
}
