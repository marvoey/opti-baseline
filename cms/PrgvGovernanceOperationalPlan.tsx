import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';
import { TARGET_AUDIENCE, taxonomyEnums, labelFor } from '@/lib/cms/taxonomy';

export const PrgvGovernanceOperationalPlanContentType = contentType({
  key: 'PrgvGovernanceOperationalPlan',
  baseType: '_page',
  displayName: '[PRGV] Governance Operational Plan',
  description: 'Governance plans, standards, and operation tracking.',
  properties: {
    Title: {
      type: 'string',
      displayName: 'Title',
      isRequired: true,
    },
    DocumentId: {
      type: 'string',
      displayName: 'Document ID',
      isRequired: true,
    },
    ProgramName: {
      type: 'string',
      displayName: 'Program / Project Name',
    },
    TargetAudience: {
      type: 'string',
      displayName: 'Target Audience',
      format: 'selectOne',
      enum: taxonomyEnums(TARGET_AUDIENCE),
    },
    ReviewCycle: {
      type: 'dateTime',
      displayName: 'Review Cycle',
    },
    OverviewScope: {
      type: 'richText',
      displayName: 'Overview & Scope',
    },
    PolicyBody: {
      type: 'richText',
      displayName: 'Policy Body',
    },
    ProductsLOBs: {
      type: 'contentReference',
      displayName: 'Products / LOBs',
      description: 'Select the applicable products or LOBs from the Taxonomy tree.',
    },
  },
});

type Props = { content: ContentProps<typeof PrgvGovernanceOperationalPlanContentType> };

export default function PrgvGovernanceOperationalPlan({ content }: Props) {
  const { pa } = getPreviewUtils(content);

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <header className="border-b pb-4">
        <p className="text-sm text-gray-500">{content.DocumentId}{content.ProgramName && ` · ${content.ProgramName}`}</p>
        <h1 {...pa('Title')} className="text-2xl font-bold text-gray-900">{content.Title}</h1>
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
          {content.ReviewCycle && <span>Next review: {new Date(content.ReviewCycle).toLocaleDateString()}</span>}
          {content.TargetAudience != null && <span>Audience: {labelFor(TARGET_AUDIENCE, content.TargetAudience)}</span>}
        </div>
      </header>
      {content.OverviewScope && (
        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-800">Overview &amp; Scope</h2>
          <div {...pa('OverviewScope')} className="prose prose-sm max-w-none text-gray-700">
            <RichTextRenderer content={content.OverviewScope?.json} />
          </div>
        </section>
      )}
      {content.PolicyBody && (
        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-800">Policy Body</h2>
          <div {...pa('PolicyBody')} className="prose prose-sm max-w-none text-gray-700">
            <RichTextRenderer content={content.PolicyBody?.json} />
          </div>
        </section>
      )}
    </main>
  );
}
