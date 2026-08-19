import { contentType, displayTemplate, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import ExperimentDemoWidget from '@/app/_components/custom/ExperimentDemoWidget';

export const ExperimentContentType = contentType({
  key: 'Experiment',
  baseType: '_component',
  displayName: 'Experiment (Web Experimentation Demo)',
  description: 'Interactive demo showing an A/B/n experiment with configurable traffic splits per variant.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    ExperimentName: {
      type: 'string', format: 'shortString',
      displayName: 'Experiment Name',
      description: 'Short name identifying this experiment (e.g. "Homepage Hero Q3").',
      isRequired: true, isLocalized: false, sortOrder: 10,
    },
    Hypothesis: {
      type: 'string', format: 'shortString',
      displayName: 'Hypothesis',
      description: 'The hypothesis being tested (e.g. "A benefit-led headline will increase apply clicks by 15%").',
      isRequired: false, isLocalized: true, sortOrder: 20,
    },

    // ── Control ────────────────────────────────────────────────────
    ControlLabel: {
      type: 'string', format: 'shortString',
      displayName: 'Control: Label',
      description: 'Display name for the control variant (e.g. "Control").',
      isRequired: false, isLocalized: false, sortOrder: 30,
    },
    ControlHeadline: {
      type: 'string', format: 'shortString',
      displayName: 'Control: Headline',
      isRequired: true, isLocalized: true, sortOrder: 40,
    },
    ControlSubheadline: {
      type: 'string', format: 'shortString',
      displayName: 'Control: Subheadline',
      isRequired: false, isLocalized: true, sortOrder: 50,
    },
    ControlCtaLabel: {
      type: 'string', format: 'shortString',
      displayName: 'Control: CTA Label',
      isRequired: false, isLocalized: true, sortOrder: 60,
    },
    ControlHeroImage: {
      type: 'contentReference', allowedTypes: ['_image'],
      displayName: 'Control: Hero Image',
      isRequired: false, sortOrder: 70,
    },
    ControlWeight: {
      type: 'integer',
      displayName: 'Control: Traffic %',
      description: 'Percentage of traffic assigned to this variant (0–100). All variants should sum to 100.',
      isRequired: false, sortOrder: 80,
    },

    // ── Variant A ──────────────────────────────────────────────────
    VariantALabel: {
      type: 'string', format: 'shortString',
      displayName: 'Variant A: Label',
      isRequired: false, isLocalized: false, sortOrder: 90,
    },
    VariantAHeadline: {
      type: 'string', format: 'shortString',
      displayName: 'Variant A: Headline',
      isRequired: false, isLocalized: true, sortOrder: 100,
    },
    VariantASubheadline: {
      type: 'string', format: 'shortString',
      displayName: 'Variant A: Subheadline',
      isRequired: false, isLocalized: true, sortOrder: 110,
    },
    VariantACtaLabel: {
      type: 'string', format: 'shortString',
      displayName: 'Variant A: CTA Label',
      isRequired: false, isLocalized: true, sortOrder: 120,
    },
    VariantAHeroImage: {
      type: 'contentReference', allowedTypes: ['_image'],
      displayName: 'Variant A: Hero Image',
      isRequired: false, sortOrder: 130,
    },
    VariantAWeight: {
      type: 'integer',
      displayName: 'Variant A: Traffic %',
      description: 'Percentage of traffic assigned to Variant A.',
      isRequired: false, sortOrder: 140,
    },

    // ── Variant B ──────────────────────────────────────────────────
    VariantBLabel: {
      type: 'string', format: 'shortString',
      displayName: 'Variant B: Label',
      isRequired: false, isLocalized: false, sortOrder: 150,
    },
    VariantBHeadline: {
      type: 'string', format: 'shortString',
      displayName: 'Variant B: Headline',
      isRequired: false, isLocalized: true, sortOrder: 160,
    },
    VariantBSubheadline: {
      type: 'string', format: 'shortString',
      displayName: 'Variant B: Subheadline',
      isRequired: false, isLocalized: true, sortOrder: 170,
    },
    VariantBCtaLabel: {
      type: 'string', format: 'shortString',
      displayName: 'Variant B: CTA Label',
      isRequired: false, isLocalized: true, sortOrder: 180,
    },
    VariantBHeroImage: {
      type: 'contentReference', allowedTypes: ['_image'],
      displayName: 'Variant B: Hero Image',
      isRequired: false, sortOrder: 190,
    },
    VariantBWeight: {
      type: 'integer',
      displayName: 'Variant B: Traffic %',
      description: 'Percentage of traffic assigned to Variant B.',
      isRequired: false, sortOrder: 200,
    },
  },
});

export const ExperimentDisplayTemplate = displayTemplate({
  key: 'ExperimentDefault',
  isDefault: true,
  displayName: 'Experiment (Web Experimentation Demo)',
  contentType: 'Experiment',
  settings: {},
});

type Props = { content: ContentProps<typeof ExperimentContentType> };

function getImageUrl(ref: unknown): string | null {
  if (!ref || typeof ref !== 'object') return null;
  return (ref as { url?: { default?: string | null } }).url?.default ?? null;
}

export default function Experiment({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  return (
    <div {...pa(block)} className="w-full px-4 sm:px-6 py-10">
      <ExperimentDemoWidget
        experimentName={content.ExperimentName ?? 'Homepage Hero Test'}
        hypothesis={content.Hypothesis ?? 'A benefit-led headline will increase hero CTA clicks by 15% vs. the current product-led control.'}
        control={{
          label:       content.ControlLabel      ?? 'Control',
          headline:    content.ControlHeadline   ?? 'Flexible home equity, on your terms.',
          subheadline: content.ControlSubheadline ?? '3.95% intro APR for 12 months. No closing costs.',
          ctaLabel:    content.ControlCtaLabel    ?? 'Apply Today',
          heroImageUrl: getImageUrl(content.ControlHeroImage),
          weight:      (content.ControlWeight  as number | null) ?? 50,
        }}
        variantA={{
          label:       content.VariantALabel      ?? 'Variant A',
          headline:    content.VariantAHeadline   ?? 'Put your home to work — fund what matters most.',
          subheadline: content.VariantASubheadline ?? 'Rates from 3.95% APR. Apply in minutes.',
          ctaLabel:    content.VariantACtaLabel    ?? 'See My Rate',
          heroImageUrl: getImageUrl(content.VariantAHeroImage),
          weight:      (content.VariantAWeight as number | null) ?? 34,
        }}
        variantB={{
          label:       content.VariantBLabel      ?? 'Variant B',
          headline:    content.VariantBHeadline   ?? 'Your home has value. Use it wisely.',
          subheadline: content.VariantBSubheadline ?? 'Members save an average of $4,200 vs. personal loans.',
          ctaLabel:    content.VariantBCtaLabel    ?? 'Calculate Savings',
          heroImageUrl: getImageUrl(content.VariantBHeroImage),
          weight:      (content.VariantBWeight as number | null) ?? 16,
        }}
      />
    </div>
  );
}
