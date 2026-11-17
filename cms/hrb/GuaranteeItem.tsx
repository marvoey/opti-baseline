import { contentType, type ContentProps } from '@optimizely/cms-sdk';

export const HrbGuaranteeItemContentType = contentType({
  key: 'HRB_GuaranteeItem',
  baseType: '_component',
  displayName: '[HRB] Guarantee Item',
  description:
    'H&R Block demo: one guarantee with its title and short-form text. Used inline inside Guarantees.',
  properties: {
    Title: { type: 'string', displayName: 'Title', isLocalized: true, isRequired: true },
    Text: { type: 'string', displayName: 'Text', isLocalized: true, isRequired: true },
  },
});

type Props = { content: ContentProps<typeof HrbGuaranteeItemContentType> };

export default function GuaranteeItem({ content }: Props) {
  return (
    <div className="h-full rounded-xl bg-white p-6 text-hrb-ink shadow-sm">
      <div className="font-bold text-blue-800">{content.Title}</div>
      <p className="mt-2 text-sm opacity-80">{content.Text}</p>
    </div>
  );
}
