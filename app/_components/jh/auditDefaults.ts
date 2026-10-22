// Act 1 failsafe data: the pre-baked audit report from the demo script. Used when
// the CMS `AuditRows` property is empty or malformed. Plain data — server/client safe.

export type AuditRisk = 'High' | 'Medium' | 'Low';
export type AuditAction = 'Approve Update' | 'Manual Review Needed';

export type AuditRow = {
  block: string;
  current: string;
  proposed: string;
  risk: AuditRisk;
  action: AuditAction;
};

export const DEFAULT_AUDIT_ROWS: AuditRow[] = [
  {
    block: 'Tax Help / Standard Deduction',
    current:
      'For 2025, single filers can claim a $14,600 standard deduction, while married couples filing jointly receive $29,200.',
    proposed:
      'For the 2026 tax year, single filers can claim a $15,000 standard deduction, while married couples filing jointly receive $30,000.',
    risk: 'High',
    action: 'Approve Update',
  },
  {
    block: 'Important Tax Deadlines',
    current: 'Mark your calendar: Tax Day is Tuesday, April 15, 2025. File before midnight to avoid IRS penalties.',
    proposed:
      'Mark your calendar: Tax Day is Wednesday, April 15, 2026. File before midnight to avoid IRS penalties.',
    risk: 'High',
    action: 'Approve Update',
  },
  {
    block: 'Refund Advance Loan Overview',
    current: 'Get up to $3,500 with a 0% APR Refund Advance starting December 2024 through February 2025.',
    proposed: 'Get up to $3,500 with a 0% APR Refund Advance starting December 2025 through February 2026.',
    risk: 'Medium',
    action: 'Approve Update',
  },
  {
    block: 'Walmart In-Store Kiosk FAQ',
    current: 'Drop off your 2024 W-2s at any of our 3,000+ Walmart locations during January 2025.',
    proposed: 'Drop off your 2025 W-2s at any of our 3,000+ Walmart locations during January 2026.',
    risk: 'Medium',
    action: 'Approve Update',
  },
];

const RISKS: AuditRisk[] = ['High', 'Medium', 'Low'];
const ACTIONS: AuditAction[] = ['Approve Update', 'Manual Review Needed'];

/** Number of audit rows exposed as CMS properties (Row1Block … Row4Action). */
export const AUDIT_ROW_COUNT = DEFAULT_AUDIT_ROWS.length;

/** CMS property keys for audit row `n` (1-based). */
export const auditRowKeys = (n: number) => ({
  block: `Row${n}Block`,
  current: `Row${n}Current`,
  proposed: `Row${n}Proposed`,
  risk: `Row${n}Risk`,
  action: `Row${n}Action`,
});

/**
 * Build the audit rows from the flat `RowNBlock/Current/Proposed/Risk/Action` CMS
 * properties, falling back per field to the demo-script defaults. (`json` properties
 * aren't allowed on element-enabled types, hence the flat fields.)
 */
export function buildAuditRows(content: Record<string, unknown>): AuditRow[] {
  const str = (v: unknown) => (typeof v === 'string' && v.trim() ? v : undefined);
  return DEFAULT_AUDIT_ROWS.map((d, i) => {
    const k = auditRowKeys(i + 1);
    const risk = str(content[k.risk]) as AuditRisk | undefined;
    const action = str(content[k.action]) as AuditAction | undefined;
    return {
      block: str(content[k.block]) ?? d.block,
      current: str(content[k.current]) ?? d.current,
      proposed: str(content[k.proposed]) ?? d.proposed,
      risk: risk && RISKS.includes(risk) ? risk : d.risk,
      action: action && ACTIONS.includes(action) ? action : d.action,
    };
  });
}
