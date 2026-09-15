import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { intentTaxonomyProperties } from './shared';

export const WayfindingBlockContentType = contentType({
  key: 'WayfindingPrimitiveBlock',
  baseType: '_component',
  displayName: 'Wayfinding Primitive',
  description: 'Step indicators, breadcrumbs, and progressive disclosure navigation.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    StepTitle: {
      type: 'string',
      displayName: 'Current Stage / Step Title',
      isRequired: true,
      isLocalized: true,
      sortOrder: 10,
    },
    TotalSteps: {
      type: 'string',
      displayName: 'Total Steps Indicator (e.g. Step 1 of 3)',
      isLocalized: true,
      sortOrder: 20,
    },
    ...intentTaxonomyProperties,
  },
});

type Props = { content: ContentProps<typeof WayfindingBlockContentType> };

export default function WayfindingBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  return (
    <nav {...pa(block)} aria-label="Progress" className="my-4">
      <div className="flex items-center space-x-3 text-sm">
        <span {...pa('TotalSteps')} className="font-semibold text-blue-600">
          {content.TotalSteps ?? 'Phase 1'}
        </span>
        <span className="text-neutral-300">/</span>
        <span {...pa('StepTitle')} className="font-medium text-neutral-800">
          {content.StepTitle}
        </span>
      </div>
    </nav>
  );
}
