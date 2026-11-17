import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import { RichText as RichTextRenderer } from '@optimizely/cms-sdk/react/richText';
import { tierProperties } from './shared';

export const HrbComplianceDisclosureContentType = contentType({
  key: 'HRB_ComplianceDisclosure',
  baseType: '_component',
  displayName: '[HRB] Compliance Disclosure',
  description:
    'H&R Block demo: one shared disclosure (guarantee terms once captured, or the "demonstration site" line). Referenced by every page as a required property.',
  properties: {
    Body: { type: 'richText', displayName: 'Body', isLocalized: true, isRequired: true },
    ...tierProperties(),
  },
});

type Props = { content: ContentProps<typeof HrbComplianceDisclosureContentType> };

/** Small-print band. Pages normally render this from their `Disclosure` reference. */
export default function ComplianceDisclosure({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  return (
    <div {...pa('Body')} className="prose prose-sm max-w-none text-xs text-hrb-ink/70">
      <RichTextRenderer content={content.Body?.json} />
    </div>
  );
}
