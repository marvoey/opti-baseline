/**
 * Taxonomy numeric codes used in CMS content properties and seed files.
 * Opal AI receives short numeric tokens; this file is the canonical decode table.
 *
 * Usage:
 *   import { PRODUCT_CATEGORY, MAKER_ATTRIBUTE, RECOGNITION, EVENT, taxonomyEnums } from '@/lib/cms/taxonomy';
 *   const label = PRODUCT_CATEGORY["101"].displayName;  // "Hot Sauce"
 *   const slug  = PRODUCT_CATEGORY["101"].slug;         // "hot_sauce"
 */

export type TaxonomyEntry = { slug: string; displayName: string };

export const PRODUCT_CATEGORY: Record<string, TaxonomyEntry> = {
  "101": { slug: "hot_sauce",   displayName: "Hot Sauce" },
  "102": { slug: "cheese",      displayName: "Cheese" },
  "103": { slug: "chocolate",   displayName: "Chocolate" },
  "104": { slug: "charcuterie", displayName: "Charcuterie" },
  "105": { slug: "beverages",   displayName: "Beverages" },
  "106": { slug: "snacks",      displayName: "Snacks" },
};

export const MAKER_ATTRIBUTE: Record<string, TaxonomyEntry> = {
  "201": { slug: "minority_owned", displayName: "Minority-Owned" },
  "202": { slug: "woman_owned",    displayName: "Woman-Owned" },
  "203": { slug: "veteran_owned",  displayName: "Veteran-Owned" },
  "204": { slug: "sustainable",    displayName: "Sustainable" },
  "205": { slug: "small_batch",    displayName: "Small Batch" },
};

export const RECOGNITION: Record<string, TaxonomyEntry> = {
  "301": { slug: "award_winning",     displayName: "Award-Winning" },
  "302": { slug: "sofi_gold",         displayName: "sofi™ Award Gold" },
  "303": { slug: "sofi_new_product",  displayName: "sofi™ New Product" },
  "304": { slug: "trendspotter_pick", displayName: "Trendspotter Pick" },
};

export const EVENT: Record<string, TaxonomyEntry> = {
  "401": { slug: "winter_fancy_food", displayName: "Winter Fancy Food Show" },
  "402": { slug: "summer_fancy_food", displayName: "Summer Fancy Food Show" },
};

/** Convenience: build the enum array expected by contentType() property definitions. */
export function taxonomyEnums(map: Record<string, TaxonomyEntry>) {
  return Object.entries(map).map(([value, { displayName }]) => ({ value, displayName }));
}