import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';

export const PrgvComplianceDisclosureMatrixContentType = contentType({
  key: 'PrgvComplianceDisclosureMatrix',
  baseType: '_page',
  displayName: '[PRGV] Compliance Disclosure Matrix',
  description: 'A matrix of required state-specific disclosures, handling notes, and compliance rules.',
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
    StateJurisdiction: {
      type: 'string',
      displayName: 'State / Jurisdiction',
    },
    EffectiveDate: {
      type: 'dateTime',
      displayName: 'Effective Date',
    },
    MandatoryLanguage: {
      type: 'richText',
      displayName: 'Mandatory Language / Scripting',
    },
    ImpactedDownstreamContent: {
      type: 'string',
      displayName: 'Impacted Downstream Content',
    },
    ProductsLOBs: {
      type: 'contentReference',
      displayName: 'Products / LOBs',
      description: 'Select the applicable products or LOBs from the Taxonomy tree.',
    },
  },
});

type Props = { content: ContentProps<typeof PrgvComplianceDisclosureMatrixContentType> };

export default function PrgvComplianceDisclosureMatrix({ content }: Props) {
  const { pa } = getPreviewUtils(content);

  return (
    <main className="mx-auto max-w-4xl space-y-6 p-6">
      <header className="border-b pb-4">
        <p className="text-sm text-gray-500">{content.DocumentId}{content.StateJurisdiction && ` · ${content.StateJurisdiction}`}</p>
        <h1 {...pa('Title')} className="text-2xl font-bold text-gray-900">{content.Title}</h1>
        {content.EffectiveDate && (
          <p className="mt-2 text-sm text-gray-500">Effective: {new Date(content.EffectiveDate).toLocaleDateString()}</p>
        )}
      </header>
      {content.MandatoryLanguage && (
        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-800">Mandatory Language / Scripting</h2>
          <div {...pa('MandatoryLanguage')} className="prose prose-sm max-w-none text-gray-700">
            <RichTextRenderer content={content.MandatoryLanguage?.json} />
          </div>
        </section>
      )}
      {content.ImpactedDownstreamContent && (
        <section>
          <h2 className="mb-2 text-lg font-semibold text-gray-800">Impacted Downstream Content</h2>
          <p {...pa('ImpactedDownstreamContent')} className="text-gray-700">{content.ImpactedDownstreamContent}</p>
        </section>
      )}
    </main>
  );
}
