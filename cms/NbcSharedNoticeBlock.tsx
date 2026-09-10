import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';

export const NbcSharedNoticeBlockContentType = contentType({
  key: 'NbcSharedNoticeBlock',
  baseType: '_component',
  displayName: 'NBC Shared Policy Notice Block',
  description: 'Centralized compliance disclaimer with cross-article usage tracking.',
  properties: {
    noticeId: {
      type: 'string',
      displayName: 'Notice ID',
      description: 'Unique identifier for cross-reference tracking (e.g. block-bank-updater-01).',
      isRequired: true,
      isLocalized: false,
      indexingType: 'queryable',
      sortOrder: 10,
    },
    noticeType: {
      type: 'string',
      displayName: 'Notice Severity',
      description: 'Visual severity: info, warning, policy.',
      isRequired: true,
      isLocalized: false,
      indexingType: 'queryable',
      sortOrder: 20,
    },
    heading: {
      type: 'string',
      displayName: 'Notice Heading',
      isRequired: true,
      isLocalized: true,
      indexingType: 'searchable',
      sortOrder: 30,
    },
    body: {
      type: 'richText',
      displayName: 'Notice Body',
      isRequired: true,
      isLocalized: true,
      sortOrder: 40,
    },
  },
});

type Props = { content: ContentProps<typeof NbcSharedNoticeBlockContentType> };

export default function NbcSharedNoticeBlock({ content }: Props) {
  return (
    <div className="mt-8 rounded-xl border border-black/10 bg-neutral-50 p-4 text-[14px] text-black/70">
      <p className="font-semibold text-black">{content.heading}</p>
      <div className="mt-1">
        <RichTextRenderer content={content.body?.json} />
      </div>
    </div>
  );
}
