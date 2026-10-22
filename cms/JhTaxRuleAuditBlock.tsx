import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import TaxRuleAuditClient from '@/app/_components/jh/TaxRuleAuditClient';

export const JhTaxRuleAuditBlockContentType = contentType({
  key: 'JhTaxRuleAuditBlock',
  baseType: '_component',
  displayName: 'JH Tax Rule 2025/2026 Audit Block',
  description: 'Tax threshold cards demonstrating the Opal annual content audit (2025 → 2026).',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Title: { type: 'string', displayName: 'Section Title', isLocalized: true, sortOrder: 1 },
    Description: { type: 'string', displayName: 'Section Description', isLocalized: true, sortOrder: 2 },
  },
});

type Props = { content: ContentProps<typeof JhTaxRuleAuditBlockContentType> };

export default function JhTaxRuleAuditBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  return (
    <section {...pa(block)} className="w-full px-4 sm:px-6 py-12">
      <TaxRuleAuditClient
        title={content.Title || 'Key Tax Deductions, Credits and Filing Thresholds'}
        description={
          content.Description ||
          'Structured CMS content blocks powering Jackson Hewitt calculators, landing pages, and FAQ hubs.'
        }
        edit={{ title: pa('Title'), description: pa('Description') }}
      />
    </section>
  );
}
