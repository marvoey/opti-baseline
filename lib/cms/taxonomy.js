/**
 * Taxonomy numeric codes used in CMS content properties.
 * Opal AI receives short numeric tokens; this file is the canonical decode table.
 *
 * Usage:
 *   import { TARGET_AUDIENCE, taxonomyEnums, labelFor } from '@/lib/cms/taxonomy';
 *   const label = labelFor(TARGET_AUDIENCE, content.TargetAudience);  // "Tier 1 Service"
 *   // In contentType(): enum: taxonomyEnums(TARGET_AUDIENCE)
 */

export type TaxonomyEntry = { displayName: string; abbr?: string };

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

export const US_JURISDICTION: Record<string, TaxonomyEntry> = {
  "0":  { displayName: "Alabama",              abbr: "AL" },
  "1":  { displayName: "Alaska",               abbr: "AK" },
  "2":  { displayName: "Arizona",              abbr: "AZ" },
  "3":  { displayName: "Arkansas",             abbr: "AR" },
  "4":  { displayName: "California",           abbr: "CA" },
  "5":  { displayName: "Colorado",             abbr: "CO" },
  "6":  { displayName: "Connecticut",          abbr: "CT" },
  "7":  { displayName: "Delaware",             abbr: "DE" },
  "8":  { displayName: "District of Columbia", abbr: "DC" },
  "9":  { displayName: "Florida",              abbr: "FL" },
  "10": { displayName: "Georgia",              abbr: "GA" },
  "11": { displayName: "Hawaii",               abbr: "HI" },
  "12": { displayName: "Idaho",                abbr: "ID" },
  "13": { displayName: "Illinois",             abbr: "IL" },
  "14": { displayName: "Indiana",              abbr: "IN" },
  "15": { displayName: "Iowa",                 abbr: "IA" },
  "16": { displayName: "Kansas",               abbr: "KS" },
  "17": { displayName: "Kentucky",             abbr: "KY" },
  "18": { displayName: "Louisiana",            abbr: "LA" },
  "19": { displayName: "Maine",                abbr: "ME" },
  "20": { displayName: "Maryland",             abbr: "MD" },
  "21": { displayName: "Massachusetts",        abbr: "MA" },
  "22": { displayName: "Michigan",             abbr: "MI" },
  "23": { displayName: "Minnesota",            abbr: "MN" },
  "24": { displayName: "Mississippi",          abbr: "MS" },
  "25": { displayName: "Missouri",             abbr: "MO" },
  "26": { displayName: "Montana",              abbr: "MT" },
  "27": { displayName: "Nebraska",             abbr: "NE" },
  "28": { displayName: "Nevada",               abbr: "NV" },
  "29": { displayName: "New Hampshire",        abbr: "NH" },
  "30": { displayName: "New Jersey",           abbr: "NJ" },
  "31": { displayName: "New Mexico",           abbr: "NM" },
  "32": { displayName: "New York",             abbr: "NY" },
  "33": { displayName: "North Carolina",       abbr: "NC" },
  "34": { displayName: "North Dakota",         abbr: "ND" },
  "35": { displayName: "Ohio",                 abbr: "OH" },
  "36": { displayName: "Oklahoma",             abbr: "OK" },
  "37": { displayName: "Oregon",               abbr: "OR" },
  "38": { displayName: "Pennsylvania",         abbr: "PA" },
  "39": { displayName: "Rhode Island",         abbr: "RI" },
  "40": { displayName: "South Carolina",       abbr: "SC" },
  "41": { displayName: "South Dakota",         abbr: "SD" },
  "42": { displayName: "Tennessee",            abbr: "TN" },
  "43": { displayName: "Texas",                abbr: "TX" },
  "44": { displayName: "Utah",                 abbr: "UT" },
  "45": { displayName: "Vermont",              abbr: "VT" },
  "46": { displayName: "Virginia",             abbr: "VA" },
  "47": { displayName: "Washington",           abbr: "WA" },
  "48": { displayName: "West Virginia",        abbr: "WV" },
  "49": { displayName: "Wisconsin",            abbr: "WI" },
  "50": { displayName: "Wyoming",              abbr: "WY" },
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

/** Decode a stored numeric string code back to its abbreviation (falls back to displayName). */
export function abbrFor(map: Record<string, TaxonomyEntry>, code: string | null | undefined): string | null {
  if (code == null) return null;
  return map[code]?.abbr ?? labelFor(map, code);
}
