/**
 * Taxonomy numeric codes used in CMS content properties and seed files.
 * Opal AI receives short numeric tokens; this file is the canonical decode table.
 *
 * Usage:
 *   import { INTENT, PERSONA, GEO, SERVICE, taxonomyEnums } from '@/lib/cms/taxonomy';
 *   const label = INTENT["1"].displayName;  // "Discover / Recommend"
 *   const slug  = INTENT["1"].slug;         // "discover_recommend"
 */

export type TaxonomyEntry = { slug: string; displayName: string };

export const INTENT: Record<string, TaxonomyEntry> = {
  "1": { slug: "discover_recommend", displayName: "Discover / Recommend" },
  "2": { slug: "educate_govern",     displayName: "Educate / Govern" },
  "3": { slug: "simulate_transact",  displayName: "Simulate / Transact" },
};

export const PERSONA: Record<string, TaxonomyEntry> = {
  "1": { slug: "asset_manager",       displayName: "Asset Manager" },
  "2": { slug: "pension_fund",        displayName: "Pension Fund" },
  "3": { slug: "corporate_sponsor",   displayName: "Corporate Sponsor" },
  "4": { slug: "foreign_institution", displayName: "Foreign Institution" },
  "5": { slug: "insurance_provider",  displayName: "Insurance Provider" },
};

export const GEO: Record<string, TaxonomyEntry> = {
  "1": { slug: "canada",        displayName: "Canada" },
  "2": { slug: "europe",        displayName: "Europe" },
  "3": { slug: "united_states", displayName: "United States" },
  "4": { slug: "global",        displayName: "Global" },
};

export const SERVICE: Record<string, TaxonomyEntry> = {
  "1":  { slug: "fund_administration",     displayName: "Fund Administration" },
  "2":  { slug: "foreign_exchange",        displayName: "Foreign Exchange" },
  "3":  { slug: "treasury_services",       displayName: "Treasury Services" },
  "4":  { slug: "etf_services",            displayName: "ETF Services" },
  "5":  { slug: "alternative_investments", displayName: "Alternative Investments" },
  "6":  { slug: "securities_lending",      displayName: "Securities Lending" },
  "7":  { slug: "global_custody",          displayName: "Global Custody" },
  "8":  { slug: "recordkeeping",           displayName: "Recordkeeping" },
  "9":  { slug: "esg",                     displayName: "ESG" },
  "10": { slug: "regulatory",              displayName: "Regulatory" },
  "11": { slug: "tax",                     displayName: "Tax" },
  "12": { slug: "digital_assets",          displayName: "Digital Assets" },
  "13": { slug: "onboarding",              displayName: "Onboarding" },
  "14": { slug: "compliance",              displayName: "Compliance" },
};

/** Convenience: build the enum array expected by contentType() property definitions. */
export function taxonomyEnums(map: Record<string, TaxonomyEntry>) {
  return Object.entries(map).map(([value, { displayName }]) => ({ value, displayName }));
}
