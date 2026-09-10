import { contentType, type ContentProps } from '@optimizely/cms-sdk';

/**
 * Shape of each entry in `stepsJson`. The SDK infers `json` properties as
 * `any` (no generic/schema param on the property builder), so this type is
 * asserted at the authoring/rendering call sites rather than by the SDK.
 * `stepBody` may contain simple inline HTML (e.g. `<strong>`) since the
 * field isn't a `richText` property.
 */
export type InstructionItem = {
  stepNumber: number;
  stepTitle?: string;
  stepBody: string;
  ctaUrl?: string;
};

export const NbcStepGroupBlockContentType = contentType({
  key: 'NbcStepGroupBlock',
  baseType: '_component',
  displayName: 'NBC Step Group Block',
  description: 'Ordered sequence of numbered instructions.',
  properties: {
    groupHeading: {
      type: 'string',
      displayName: 'Group Heading',
      isRequired: false,
      isLocalized: true,
      indexingType: 'searchable',
      sortOrder: 10,
    },
    layoutStyle: {
      type: 'string',
      displayName: 'Layout Style',
      description: 'numbered_list or tabbed_subviews.',
      isRequired: true,
      isLocalized: false,
      indexingType: 'queryable',
      sortOrder: 20,
    },
    stepsJson: {
      type: 'json',
      displayName: 'Instruction Steps (Structured List)',
      description: 'JSON array of InstructionItem objects: [{stepNumber, stepTitle, stepBody, ctaUrl}].',
      isRequired: true,
      isLocalized: true,
      sortOrder: 30,
    },
  },
});

type Props = { content: ContentProps<typeof NbcStepGroupBlockContentType> };

/**
 * Renders as a numbered `<ol>` for `layoutStyle: 'numbered_list'`, or as a
 * sequence of titled subsections (heading + body, no numbering) for
 * `layoutStyle: 'tabbed_subviews'`.
 */
export default function NbcStepGroupBlock({ content }: Props) {
  const steps = (content.stepsJson ?? []) as InstructionItem[];

  if (content.layoutStyle === 'tabbed_subviews') {
    return (
      <>
        {steps.map((step) => (
          <div key={step.stepNumber}>
            {step.stepTitle && <h3 className="mt-8 text-xl font-bold">{step.stepTitle}</h3>}
            <p
              className="mt-3 text-[15px] leading-relaxed text-black/80"
              dangerouslySetInnerHTML={{ __html: step.stepBody }}
            />
          </div>
        ))}
      </>
    );
  }

  return (
    <>
      {content.groupHeading && <h3 className="mt-8 text-xl font-bold">{content.groupHeading}</h3>}
      <ol className="mt-6 list-decimal space-y-3 pl-5 text-[15px] leading-relaxed text-black/80 marker:font-bold marker:text-black">
        {steps.map((step) => (
          <li key={step.stepNumber} dangerouslySetInnerHTML={{ __html: step.stepBody }} />
        ))}
      </ol>
    </>
  );
}
