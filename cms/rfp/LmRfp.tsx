import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import RfpQuestionCard from '@/app/_components_rfp/RfpQuestionCard';

/**
 * Content types behind the RFP follow-ups viewer (app/demo/rfp-followups).
 *
 * These were first created directly in the CMS. They are mirrored here, field for
 * field, so the SDK knows them: without a registry entry, opening one of these
 * items in the CMS (which loads /preview) throws "Content type ... is not available
 * in the component registry". The viewer itself reads them with plain GraphQL
 * (app/api/rfp-followups), so it does not depend on this file.
 *
 * Keep the definitions identical to the CMS ones; `config push` would otherwise
 * change the live types. (LmRfpDemoReference is optional and not defined here.)
 */

const GROUP = 'Content';

export const LmRfpQuestionContentType = contentType({
  key: 'LmRfpQuestion',
  baseType: '_component',
  displayName: 'LM RFP: Follow-up question',
  description:
    "One follow-up question from Liberty Mutual and Optimizely's response. One item per row of the Follow Up Questions sheet.",
  properties: {
    QuestionId: {
      type: 'string',
      displayName: 'Question ID',
      description: "Optimizely's follow-up ID, zero-padded (OP-01). Sorting by it gives the workbook order.",
      isRequired: true,
      group: GROUP,
      sortOrder: 10,
      indexingType: 'queryable',
      maxLength: 10,
    },
    LmRfpId: {
      type: 'string',
      displayName: 'LM RFP ID',
      description: "Liberty Mutual's RFP requirement IDs, or Demo. Leave empty if there are none.",
      group: GROUP,
      sortOrder: 20,
      indexingType: 'queryable',
      maxLength: 255,
    },
    Topic: {
      type: 'string',
      displayName: 'Topic',
      description: 'Short topic line shown above the question.',
      isLocalized: true,
      isRequired: true,
      group: GROUP,
      sortOrder: 30,
      indexingType: 'searchable',
      maxLength: 255,
    },
    FollowUpQuestion: {
      type: 'string',
      displayName: 'Follow-up question',
      description: "Liberty Mutual's follow-up question, word for word.",
      isLocalized: true,
      isRequired: true,
      group: GROUP,
      sortOrder: 40,
      indexingType: 'searchable',
    },
    ResponseFormat: {
      type: 'string',
      displayName: 'Response format',
      description: 'How Liberty Mutual asked for the response.',
      isRequired: true,
      group: GROUP,
      sortOrder: 50,
      indexingType: 'queryable',
      format: 'selectOne',
      enum: [
        { value: 'written', displayName: 'Written follow-up' },
        { value: 'visual', displayName: 'Visual demonstration follow-up' },
        { value: 'written-visual', displayName: 'Written and visual demonstration follow-up' },
      ],
    },
    VendorResponse: {
      type: 'string',
      displayName: 'Vendor response',
      description:
        "Optimizely's response, word for word. Plain text: start a line with • for a bullet or 1. for a numbered step. Keep [CONFIRM: …] notes inline until they are resolved.",
      isLocalized: true,
      group: GROUP,
      sortOrder: 60,
      indexingType: 'searchable',
    },
    SupportingDocumentation: {
      type: 'array',
      displayName: 'Supporting documentation',
      description: 'One URL per item.',
      group: GROUP,
      sortOrder: 70,
      indexingType: 'queryable',
      maxItems: 20,
      items: { type: 'string' },
    },
  },
});

export const LmRfpResponseSetContentType = contentType({
  key: 'LmRfpResponseSet',
  baseType: '_component',
  displayName: 'LM RFP: Response set',
  description:
    'Document-level text: the heading, introduction, source and as-of date the viewer shows. One item.',
  properties: {
    Eyebrow: {
      type: 'string',
      displayName: 'Eyebrow',
      description: 'Small line above the title.',
      isLocalized: true,
      group: GROUP,
      sortOrder: 10,
      maxLength: 255,
    },
    Title: {
      type: 'string',
      displayName: 'Title',
      description: 'Page title in the viewer.',
      isLocalized: true,
      isRequired: true,
      group: GROUP,
      sortOrder: 20,
      maxLength: 255,
    },
    Intro: {
      type: 'string',
      displayName: 'Introduction',
      description: 'Introduction under the title.',
      isLocalized: true,
      group: GROUP,
      sortOrder: 30,
    },
    SourceWorkbook: {
      type: 'string',
      displayName: 'Source workbook',
      description: 'The workbook file this content was last synced from.',
      group: GROUP,
      sortOrder: 40,
      maxLength: 255,
    },
    AsOf: {
      type: 'dateTime',
      displayName: 'As of',
      description: 'Date of that workbook version.',
      group: GROUP,
      sortOrder: 50,
    },
    FooterNote: {
      type: 'string',
      displayName: 'Footer note',
      description: "Note shown in the viewer's footer.",
      isLocalized: true,
      group: GROUP,
      sortOrder: 60,
    },
  },
});

export const LmRfpDataFlowStepContentType = contentType({
  key: 'LmRfpDataFlowStep',
  baseType: '_component',
  displayName: 'LM RFP: Data flow step',
  description:
    "One step from an author's edit to a live page behind Akamai. One item per row of the OP-14 Data Flow sheet.",
  properties: {
    Step: {
      type: 'integer',
      displayName: 'Step',
      description: 'Step number (1–12). The viewer sorts on it.',
      isRequired: true,
      group: GROUP,
      sortOrder: 10,
      indexingType: 'queryable',
    },
    WhatHappens: {
      type: 'string',
      displayName: 'What happens',
      description: 'What happens in this step.',
      isLocalized: true,
      isRequired: true,
      group: GROUP,
      sortOrder: 20,
      indexingType: 'searchable',
    },
    WhereItHappens: {
      type: 'string',
      displayName: 'Where',
      description: 'Where the step happens.',
      isLocalized: true,
      group: GROUP,
      sortOrder: 30,
      indexingType: 'queryable',
      maxLength: 255,
    },
    Ownership: {
      type: 'string',
      displayName: 'Vendor-managed or customer-built',
      description: 'Vendor-managed, customer-built, or both, as written in the workbook.',
      isLocalized: true,
      group: GROUP,
      sortOrder: 40,
      indexingType: 'queryable',
      maxLength: 255,
    },
    ExpectedTime: {
      type: 'string',
      displayName: 'Expected time',
      description: 'Expected time for this step.',
      isLocalized: true,
      group: GROUP,
      sortOrder: 50,
      maxLength: 255,
    },
    Notes: {
      type: 'string',
      displayName: 'Notes',
      description: 'Optional notes.',
      isLocalized: true,
      group: GROUP,
      sortOrder: 60,
    },
  },
});

export const LmRfpErdEntityContentType = contentType({
  key: 'LmRfpErdEntity',
  baseType: '_component',
  displayName: 'LM RFP: ERD entity',
  description:
    'One entity in the example data model and how it affects content and asset retrieval. One item per row of the OP-14 ERD sheet.',
  properties: {
    SortOrder: {
      type: 'integer',
      displayName: 'Sort order',
      description: 'Display order.',
      isRequired: true,
      group: GROUP,
      sortOrder: 10,
      indexingType: 'queryable',
    },
    Entity: {
      type: 'string',
      displayName: 'Entity',
      description: 'Entity name.',
      isLocalized: true,
      isRequired: true,
      group: GROUP,
      sortOrder: 20,
      indexingType: 'queryable',
      maxLength: 255,
    },
    KeyAttributes: {
      type: 'string',
      displayName: 'Key attributes',
      description: 'Key attributes of the entity.',
      isLocalized: true,
      group: GROUP,
      sortOrder: 30,
      indexingType: 'searchable',
    },
    Relationships: {
      type: 'string',
      displayName: 'Relationships',
      description: 'How it relates to other entities, as a sentence.',
      isLocalized: true,
      group: GROUP,
      sortOrder: 40,
      indexingType: 'searchable',
    },
    RetrievalEffect: {
      type: 'string',
      displayName: 'Effect on content/asset retrieval',
      description: 'How this entity affects content and asset retrieval.',
      isLocalized: true,
      group: GROUP,
      sortOrder: 50,
      indexingType: 'searchable',
    },
    RelatedEntities: {
      type: 'array',
      displayName: 'Related entities',
      description: "Exact names of the related entities. Drives the highlight in the viewer's ERD tab.",
      group: GROUP,
      sortOrder: 60,
      indexingType: 'queryable',
      maxItems: 20,
      items: { type: 'string' },
    },
  },
});

export const LmRfpSampleQueryContentType = contentType({
  key: 'LmRfpSampleQuery',
  baseType: '_component',
  displayName: 'LM RFP: Sample query',
  description:
    'The sample GraphQL request, abridged response and assembly notes. One item for the OP-16 Sample Query sheet.',
  properties: {
    QuestionId: {
      type: 'string',
      displayName: 'Question ID',
      description: 'The follow-up this sample supports (OP-16).',
      isRequired: true,
      group: GROUP,
      sortOrder: 10,
      indexingType: 'queryable',
      maxLength: 10,
    },
    Title: {
      type: 'string',
      displayName: 'Title',
      description: 'Short title for the sample.',
      isLocalized: true,
      isRequired: true,
      group: GROUP,
      sortOrder: 20,
      maxLength: 255,
    },
    GraphqlRequest: {
      type: 'string',
      displayName: 'GraphQL request',
      description: 'The sample GraphQL request, word for word, including # comments.',
      isRequired: true,
      group: GROUP,
      sortOrder: 30,
    },
    ExampleResponse: {
      type: 'string',
      displayName: 'Example response (abridged)',
      description: 'The abridged example response.',
      group: GROUP,
      sortOrder: 40,
    },
    Notes: {
      type: 'string',
      displayName: 'Notes',
      description: 'How the page is assembled.',
      isLocalized: true,
      group: GROUP,
      sortOrder: 50,
      indexingType: 'searchable',
    },
  },
});

export const lmRfpTypes = [
  LmRfpQuestionContentType,
  LmRfpResponseSetContentType,
  LmRfpDataFlowStepContentType,
  LmRfpErdEntityContentType,
  LmRfpSampleQueryContentType,
];

/** LmRfpQuestion renders as the same card the viewer (/demo/rfp-followups) shows. */
function LmRfpQuestionPreview({ content }: { content: ContentProps<typeof LmRfpQuestionContentType> }) {
  return <RfpQuestionCard content={content} />;
}

/**
 * Fallback preview for the other four types: a labelled list of the item's
 * fields, so an editor opening one in the CMS sees its content.
 */
function LmRfpPreview({ content }: { content: Record<string, unknown> }) {
  const meta = content._metadata as { displayName?: string } | undefined;
  const rows = Object.entries(content).filter(([k, v]) => !k.startsWith('_') && v != null && v !== '');
  return (
    <section className="mx-auto max-w-3xl p-6 text-[15px] text-[#343741]">
      <p className="text-xs font-bold uppercase tracking-wider text-[#707070]">{String(content.__typename)}</p>
      <h1 className="mt-1 mb-4 text-xl font-bold text-[#1A1446]">{meta?.displayName}</h1>
      <dl className="space-y-3">
        {rows.map(([k, v]) => (
          <div key={k}>
            <dt className="text-xs font-bold uppercase tracking-wider text-[#707070]">{k}</dt>
            <dd className="whitespace-pre-wrap">{Array.isArray(v) ? v.join('\n') : String(v)}</dd>
          </div>
        ))}
      </dl>
    </section>
  );
}

export const lmRfpRenderers = {
  LmRfpQuestion: LmRfpQuestionPreview,
  LmRfpResponseSet: LmRfpPreview,
  LmRfpDataFlowStep: LmRfpPreview,
  LmRfpErdEntity: LmRfpPreview,
  LmRfpSampleQuery: LmRfpPreview,
};
