import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils, OptimizelyComponent } from '@optimizely/cms-sdk/react/server';
import { blockNode } from './shared';
import { ShieldCheck, BarChart3 } from 'lucide-react';

export const FdExperimentContainerContentType = contentType({
  key: 'FdExperimentContainer',
  baseType: '_component',
  displayName: 'Floor & Decor Experimentation & Holdout Container',
  description: 'Embeds an A/B test isolated within a Mutual Exclusion Group.',
  compositionBehaviors: ['sectionEnabled'],
  properties: {
    ExperimentKey: { type: 'string', format: 'shortString', displayName: 'Optimizely Experiment Key', sortOrder: 10 },
    MutualExclusionGroupId: { type: 'string', format: 'shortString', displayName: 'Mutual Exclusion Group ID', sortOrder: 20 },
    HoldoutPercentage: { type: 'float', displayName: 'Global Holdout % (e.g. 5.0)', sortOrder: 30 },
    ControlVariation: {
      type: 'content',
      displayName: 'Control Experience',
      allowedTypes: [],
      sortOrder: 40,
    },
    ChallengerVariationA: {
      type: 'content',
      displayName: 'Variation A (Mark AI Prompted)',
      allowedTypes: [],
      sortOrder: 50,
    },
  },
});

export default function FdExperimentContainer({ content }: { content: ContentProps<typeof FdExperimentContainerContentType> }) {
  const { pa } = getPreviewUtils(content);

  return (
    <section {...pa(blockNode(content))} className="max-w-7xl mx-auto px-4 py-4">
      <div className="border border-indigo-200 bg-indigo-50/60 rounded-xl p-4 mb-4 text-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <BarChart3 className="w-4 h-4 text-indigo-700" />
          <span className="font-bold text-indigo-950">Active Experiment: {content.ExperimentKey || 'exp_clp_conversion'}</span>
          <span className="bg-indigo-200 text-indigo-900 px-2 py-0.5 rounded font-mono text-[10px]">
            MEG: {content.MutualExclusionGroupId || '#MEG-402 (Checkout Protection)'}
          </span>
        </div>
        <div className="flex items-center gap-2 text-indigo-800 font-semibold">
          <ShieldCheck className="w-4 h-4 text-emerald-600" />
          <span>Global Holdout: {content.HoldoutPercentage || 5.0}% Traffic Shielded</span>
        </div>
      </div>

      <div className="relative">
        {content.ChallengerVariationA ? (
          <OptimizelyComponent content={content.ChallengerVariationA} />
        ) : content.ControlVariation ? (
          <OptimizelyComponent content={content.ControlVariation} />
        ) : null}
      </div>
    </section>
  );
}
