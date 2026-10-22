import { contentType, type ContentProps } from '@optimizely/cms-sdk';
import { getPreviewUtils } from '@optimizely/cms-sdk/react/server';
import TaxRuleAuditClient from '@/app/_components/jh/TaxRuleAuditClient';
import { AUDIT_ROW_COUNT, auditRowKeys, buildAuditRows } from '@/app/_components/jh/auditDefaults';

// One group of flat string properties per audit row (json isn't allowed on element-enabled types).
function auditRowProperties() {
  const props: Record<string, { type: 'string'; displayName: string; description?: string; isLocalized: true; sortOrder: number }> = {};
  for (let n = 1; n <= AUDIT_ROW_COUNT; n++) {
    const k = auditRowKeys(n);
    const base = 10 * n;
    props[k.block] = { type: 'string', displayName: `Row ${n} – Page / Content Block`, isLocalized: true, sortOrder: base };
    props[k.current] = { type: 'string', displayName: `Row ${n} – Current 2025 Copy`, isLocalized: true, sortOrder: base + 1 };
    props[k.proposed] = { type: 'string', displayName: `Row ${n} – Proposed 2026 Update`, isLocalized: true, sortOrder: base + 2 };
    props[k.risk] = { type: 'string', displayName: `Row ${n} – Risk (High/Medium/Low)`, isLocalized: true, sortOrder: base + 3 };
    props[k.action] = { type: 'string', displayName: `Row ${n} – Editor Action (Approve Update/Manual Review Needed)`, isLocalized: true, sortOrder: base + 4 };
  }
  return props;
}

export const JhTaxRuleAuditBlockContentType = contentType({
  key: 'JhTaxRuleAuditBlock',
  baseType: '_component',
  displayName: 'JH Tax Rule 2025/2026 Audit Block',
  description: 'Interactive tax threshold comparison table demonstrating Opal AI content audit capabilities.',
  compositionBehaviors: ['elementEnabled', 'sectionEnabled'],
  properties: {
    Title: { type: 'string', displayName: 'Section Title', isLocalized: true, sortOrder: 1 },
    Description: { type: 'string', displayName: 'Section Description', isLocalized: true, sortOrder: 2 },
    ...auditRowProperties(),
  },
});

type Props = { content: ContentProps<typeof JhTaxRuleAuditBlockContentType> };

export default function JhTaxRuleAuditBlock({ content }: Props) {
  const { pa } = getPreviewUtils(content);
  const block = (content as { __composition?: { key: string } }).__composition;

  return (
    <section {...pa(block)} className="py-12 px-4">
      <TaxRuleAuditClient
        title={content.Title || '2026 Tax Season Content Audit'}
        description={
          content.Description ||
          'Opal scans tax education and promotional pages for outdated 2025 parameters and proposes IRS-compliant 2026 updates for editor approval.'
        }
        rows={buildAuditRows(content as unknown as Record<string, unknown>)}
        edit={{
          title: pa('Title'),
          description: pa('Description'),
          rowProposed: Array.from({ length: AUDIT_ROW_COUNT }, (_, i) => pa(auditRowKeys(i + 1).proposed)),
        }}
      />
    </section>
  );
}
