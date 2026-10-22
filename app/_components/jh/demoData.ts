// Demo data for the Jackson Hewitt "Trojan Horse" blocks. Ported from the
// standalone mock in app/demo/page.tsx so the CMS-driven blocks and the mock
// tell the same story. Plain data only — safe to import from server or client.

export type TaxRuleSnapshot = {
  taxYear: string;
  thresholdAmount: string;
  previousAmount: string;
  effectiveDeadline: string;
  ruleSummary: string;
  irsComplianceDisclaimer: string;
};

export type TaxRule = TaxRuleSnapshot & {
  id: string;
  ruleTitle: string;
  category: string;
  cmsPath: string;
  auditStatus: string;
  proposed2026: TaxRuleSnapshot;
};

export const INITIAL_TAX_RULES: TaxRule[] = [
  {
    id: 'rule-std-deduction',
    ruleTitle: 'Standard Deduction Thresholds',
    category: 'Deductions and Credits',
    cmsPath: '/tax-help/deductions/standard-deduction/',
    taxYear: '2025',
    thresholdAmount: '$14,600 (Single) / $29,200 (Married Joint)',
    previousAmount: '$13,850 (Single) / $27,700 (Married Joint)',
    effectiveDeadline: 'April 15, 2026',
    ruleSummary: 'The standard deduction reduces the amount of your income subject to federal tax. For the 2025 tax year, single filers can claim $14,600 and married couples filing jointly can claim $29,200 without itemizing.',
    irsComplianceDisclaimer: 'Per IRS Rev. Proc. 2024-40. Additional standard deduction applies for taxpayers aged 65 or older or blind.',
    auditStatus: 'Needs 2026 Audit',
    proposed2026: {
      taxYear: '2026',
      thresholdAmount: '$15,000 (Single) / $30,000 (Married Joint)',
      previousAmount: '$14,600 (Single) / $29,200 (Married Joint)',
      effectiveDeadline: 'April 15, 2027',
      ruleSummary: 'The standard deduction reduces the amount of your income subject to federal tax. For the 2026 tax year, single filers can claim $15,000 and married couples filing jointly can claim $30,000 without itemizing.',
      irsComplianceDisclaimer: 'Updated per IRS 2026 Inflation Adjustments (Rev. Proc. 2025-32). Verified against standard deduction tables.'
    }
  },
  {
    id: 'rule-eitc',
    ruleTitle: 'Earned Income Tax Credit (EITC) Max Credit',
    category: 'Refundable Credits',
    cmsPath: '/tax-help/tax-credits/earned-income-tax-credit/',
    taxYear: '2025',
    thresholdAmount: 'Up to $7,830 (3+ Qualifying Children)',
    previousAmount: 'Up to $7,430 (3+ Qualifying Children)',
    effectiveDeadline: 'April 15, 2026',
    ruleSummary: 'Working families with low-to-moderate income may qualify for the 2025 EITC worth up to $7,830. EITC refunds cannot be issued by the IRS before mid-February.',
    irsComplianceDisclaimer: 'Subject to PATH Act holding period. Investment income limit is $11,600 for tax year 2025.',
    auditStatus: 'Needs 2026 Audit',
    proposed2026: {
      taxYear: '2026',
      thresholdAmount: 'Up to $8,046 (3+ Qualifying Children)',
      previousAmount: 'Up to $7,830 (3+ Qualifying Children)',
      effectiveDeadline: 'April 15, 2027',
      ruleSummary: 'Working families with low-to-moderate income may qualify for the 2026 EITC worth up to $8,046. EITC refunds are subject to statutory mid-February release windows.',
      irsComplianceDisclaimer: 'Subject to PATH Act holding period. Investment income limit updated to $11,950 for tax year 2026.'
    }
  },
  {
    id: 'rule-refund-advance',
    ruleTitle: 'Early Tax Refund Advance Loan Window',
    category: 'Financial Products',
    cmsPath: '/file-taxes-options-products/refund-advance/',
    taxYear: '2025',
    thresholdAmount: '$250 to $3,500 (0% APR)',
    previousAmount: '$200 to $3,200',
    effectiveDeadline: 'February 23, 2026',
    ruleSummary: 'Get up to $3,500 the same day you file in-store or at participating Walmart locations during the 2025 filing season with a paystub or W-2.',
    irsComplianceDisclaimer: 'The Refund Advance Loan is a short-term loan issued by Republic Bank and Trust Company, Member FDIC. Subject to underwriting.',
    auditStatus: 'Needs 2026 Audit',
    proposed2026: {
      taxYear: '2026',
      thresholdAmount: '$300 to $4,000 (0% APR)',
      previousAmount: '$250 to $3,500 (0% APR)',
      effectiveDeadline: 'February 21, 2027',
      ruleSummary: 'Get up to $4,000 the same day you file in-store or at participating Walmart kiosks during the 2026 tax season with valid proof of income.',
      irsComplianceDisclaimer: '2026 Refund Advance Loan issued by Republic Bank and Trust Company, Member FDIC. $0 loan fees and 0% APR apply.'
    }
  },
  {
    id: 'rule-gig-1099',
    ruleTitle: 'Self-Employed and 1099-K Reporting Threshold',
    category: 'Self-Employment',
    cmsPath: '/tax-services/self-employment-tax/',
    taxYear: '2025',
    thresholdAmount: '$5,000 Third-Party Network Threshold',
    previousAmount: '$20,000 and 200 Transactions',
    effectiveDeadline: 'January 31, 2026 (Form Receipt)',
    ruleSummary: 'Freelancers, rideshare drivers, and online sellers receiving over $5,000 via payment apps in 2025 will receive Form 1099-K and must report business income on Schedule C.',
    irsComplianceDisclaimer: 'IRS phased implementation threshold for 2025. Standard mileage rate for 2025 is 67 cents per mile.',
    auditStatus: 'Needs 2026 Audit',
    proposed2026: {
      taxYear: '2026',
      thresholdAmount: '$2,500 Phase-In Reporting Threshold',
      previousAmount: '$5,000 Third-Party Network Threshold',
      effectiveDeadline: 'January 31, 2027 (Form Receipt)',
      ruleSummary: 'Freelancers, gig workers, and online sellers receiving over $2,500 via payment apps in 2026 will receive Form 1099-K. Deduct eligible expenses on Schedule C.',
      irsComplianceDisclaimer: 'Updated for 2026 IRS Notice phase-in schedule. Standard business mileage rate updated to 70 cents per mile.'
    }
  }
];
