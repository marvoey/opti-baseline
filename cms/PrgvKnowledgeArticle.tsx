import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';
import { TARGET_AUDIENCE, taxonomyEnums, labelFor } from '@/lib/cms/taxonomy';

export const PrgvKnowledgeArticleContentType = contentType({
  key: 'PrgvKnowledgeArticle',
  baseType: '_page',
  displayName: '[PRGV] Knowledge Article',
  description: 'The primary content type for frontline staff procedures and handling guides.',
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
    Author: {
      type: 'string',
      displayName: 'Author / Owner',
    },
    TargetAudience: {
      type: 'string',
      displayName: 'Target Audience',
      format: 'selectOne',
      enum: taxonomyEnums(TARGET_AUDIENCE),
    },
    LastUpdated: {
      type: 'dateTime',
      displayName: 'Last Updated / Review Date',
    },
    OverviewScope: {
      type: 'richText',
      displayName: 'Overview & Scope',
    },
    ProceduralSteps: {
      type: 'richText',
      displayName: 'Procedural Steps',
    },
    FraudRiskCheckpoints: {
      type: 'richText',
      displayName: 'Fraud/Risk Checkpoints',
    },
    StateSpecificNotes: {
      type: 'string',
      displayName: 'State-Specific Notes',
    },
    RelatedComplianceDisclosures: {
      type: 'string',
      displayName: 'Related Compliance Disclosures',
    },
    Supersedes: {
      type: 'string',
      displayName: 'Supersedes',
    },
    ProductsLOBs: {
      type: 'contentReference',
      displayName: 'Products / LOBs',
      description: 'Select the applicable products or LOBs from the Taxonomy tree.',
      allowedTypes: [],
    },
  },
});

type Props = { content: ContentProps<typeof PrgvKnowledgeArticleContentType> };

export default function PrgvKnowledgeArticle({ content }: Props) {
  const { pa } = getPreviewUtils(content);

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <header className="border-b pb-4">
        <p className="text-sm text-gray-500">{content.DocumentId}</p>
        <h1 {...pa('Title')} className="text-2xl font-bold text-gray-900">{content.Title}</h1>
        <div className="mt-2 flex flex-wrap gap-4 text-sm text-gray-500">
          {content.Author && <span>Author: {content.Author}</span>}
          {content.TargetAudience != null && <span>Audience: {labelFor(TARGET_AUDIENCE, content.TargetAudience)}</span>}
          {content.LastUpdated && <span>Updated: {new Date(content.LastUpdated).toLocaleDateString()}</span>}
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
      {content.ProceduralSteps && (
        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-800">Procedural Steps</h2>
          <div {...pa('ProceduralSteps')} className="prose prose-sm max-w-none text-gray-700">
            <RichTextRenderer content={content.ProceduralSteps?.json} />
          </div>
        </section>
      )}
      {content.FraudRiskCheckpoints && (
        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-800">Fraud / Risk Checkpoints</h2>
          <div {...pa('FraudRiskCheckpoints')} className="prose prose-sm max-w-none text-gray-700">
            <RichTextRenderer content={content.FraudRiskCheckpoints?.json} />
          </div>
        </section>
      )}
      {content.StateSpecificNotes && (
        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-800">State-Specific Notes</h2>
          <p {...pa('StateSpecificNotes')} className="text-gray-700">{content.StateSpecificNotes}</p>
        </section>
      )}
    </main>
  );
}
