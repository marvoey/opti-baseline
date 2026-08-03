/**
 * Taxonomy numeric codes used in CMS content properties.
 * Opal AI receives short numeric tokens; this file is the canonical decode table.
 *
 * Usage:
 *   import { TARGET_AUDIENCE, taxonomyEnums, labelFor } from '@/lib/cms/taxonomy';
 *   const label = labelFor(TARGET_AUDIENCE, content.TargetAudience);  // "Tier 1 Service"
 *   // In contentType(): enum: taxonomyEnums(TARGET_AUDIENCE)
 */

export type TaxonomyEntry = { displayName: string };

export const RULE_CATEGORY: Record<string, TaxonomyEntry> = {
  "0": { displayName: "Severity Flag" },
  "1": { displayName: "Escalation Rule" },
  "2": { displayName: "State Exception" },
  "3": { displayName: "General Handling Note" },
};

export const SEVERITY_LEVEL: Record<string, TaxonomyEntry> = {
  "0": { displayName: "Low Priority" },
  "1": { displayName: "Medium Priority" },
  "2": { displayName: "High Priority" },
  "3": { displayName: "Critical - Stop/Review" },
};

export const TARGET_AUDIENCE: Record<string, TaxonomyEntry> = {
  "0": { displayName: "Tier 1 Service" },
  "1": { displayName: "Tier 2 Service" },
  "2": { displayName: "Tier 1 Claims Intake" },
  "3": { displayName: "Tier 2 Claims Support" },
  "4": { displayName: "Escalation Desk" },
  "5": { displayName: "Retention" },
  "6": { displayName: "Supervisor Queue" },
  "7": { displayName: "Agency Support" },
};

export const LINE_OF_BUSINESS: Record<string, TaxonomyEntry> = {
  personal_auto: { displayName: "Personal Auto" },
  commercial_auto: { displayName: "Commercial Auto" },
  homeowners: { displayName: "Homeowners" },
  renters: { displayName: "Renters" },
  motorcycle_atv: { displayName: "Motorcycle / ATV" },
  boat_pwc: { displayName: "Boat / Watercraft" },
  rv_trailer: { displayName: "RV / Trailer" },
  umbrella: { displayName: "Umbrella Policy" },
};

/** Build the enum array expected by contentType() string property definitions. */
export function taxonomyEnums(map: Record<string, TaxonomyEntry>) {
  return Object.entries(map).map(([value, { displayName }]) => ({ value, displayName }));
}

/** Decode a stored numeric string code back to its display name. */
export function labelFor(map: Record<string, TaxonomyEntry>, code: string | null | undefined): string | null {
  if (code == null) return null;
  return map[code]?.displayName ?? code;
}
