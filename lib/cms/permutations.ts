/**
 * Every (intent, persona, service, geo) combination that has at least one
 * matching content block in the seeded library. Derived from:
 *   seeds/library/discover-recommend/  (intent 1)
 *   seeds/library/educate-govern/      (intent 2)
 *   seeds/library/simulate-transact/   (intent 3)
 *
 * Heroes are excluded — they carry only intent+geo and always appear when
 * intent matches, independent of persona/service filtering.
 *
 * Multi-service paragraphs (e.g. service=[1,9]) are expanded to one row per
 * service so a simple equality filter works at every level.
 */

export type Permutation = {
  intent:  string;
  persona: string;
  service: string;
  geo:     string;
};

export const PERMUTATIONS: Permutation[] = [
  // ── Intent 1: Discover / Recommend ──────────────────────────────────────
  { intent: '1', persona: '1', service: '1',  geo: '1' },
  { intent: '1', persona: '1', service: '1',  geo: '2' },
  { intent: '1', persona: '5', service: '1',  geo: '1' },
  { intent: '1', persona: '2', service: '2',  geo: '1' },
  { intent: '1', persona: '2', service: '2',  geo: '2' },
  { intent: '1', persona: '4', service: '2',  geo: '1' },
  { intent: '1', persona: '2', service: '3',  geo: '1' },
  { intent: '1', persona: '3', service: '3',  geo: '1' },
  { intent: '1', persona: '3', service: '3',  geo: '3' },
  { intent: '1', persona: '1', service: '4',  geo: '1' },
  { intent: '1', persona: '2', service: '5',  geo: '1' },
  { intent: '1', persona: '1', service: '5',  geo: '4' },
  { intent: '1', persona: '2', service: '6',  geo: '1' },
  { intent: '1', persona: '1', service: '6',  geo: '1' },
  { intent: '1', persona: '4', service: '7',  geo: '1' },
  { intent: '1', persona: '4', service: '7',  geo: '2' },
  { intent: '1', persona: '4', service: '7',  geo: '3' },
  { intent: '1', persona: '5', service: '7',  geo: '3' },
  { intent: '1', persona: '2', service: '7',  geo: '1' },
  { intent: '1', persona: '1', service: '7',  geo: '4' },
  { intent: '1', persona: '2', service: '8',  geo: '1' },
  { intent: '1', persona: '3', service: '8',  geo: '4' },
  { intent: '1', persona: '1', service: '9',  geo: '1' },
  { intent: '1', persona: '2', service: '9',  geo: '1' },
  { intent: '1', persona: '1', service: '10', geo: '1' },
  { intent: '1', persona: '4', service: '10', geo: '1' },
  { intent: '1', persona: '2', service: '10', geo: '1' },
  { intent: '1', persona: '1', service: '11', geo: '1' },
  { intent: '1', persona: '1', service: '11', geo: '2' },
  { intent: '1', persona: '2', service: '11', geo: '1' },
  { intent: '1', persona: '4', service: '13', geo: '1' },
  { intent: '1', persona: '1', service: '13', geo: '1' },
  { intent: '1', persona: '2', service: '14', geo: '1' },
  { intent: '1', persona: '1', service: '14', geo: '1' },
  { intent: '1', persona: '4', service: '14', geo: '1' },

  // ── Intent 2: Educate / Govern ───────────────────────────────────────────
  { intent: '2', persona: '1', service: '1',  geo: '1' },
  { intent: '2', persona: '1', service: '1',  geo: '2' },
  { intent: '2', persona: '1', service: '2',  geo: '2' },
  { intent: '2', persona: '1', service: '5',  geo: '1' },
  { intent: '2', persona: '1', service: '6',  geo: '3' },
  { intent: '2', persona: '1', service: '12', geo: '1' },
  { intent: '2', persona: '2', service: '8',  geo: '1' },
  { intent: '2', persona: '3', service: '9',  geo: '1' },
  { intent: '2', persona: '4', service: '7',  geo: '1' },
  { intent: '2', persona: '4', service: '11', geo: '1' },
  { intent: '2', persona: '5', service: '10', geo: '1' },

  // ── Intent 3: Simulate / Transact ────────────────────────────────────────
  { intent: '3', persona: '1', service: '4',  geo: '1' },
  { intent: '3', persona: '1', service: '5',  geo: '1' },
  { intent: '3', persona: '1', service: '6',  geo: '4' },
  { intent: '3', persona: '1', service: '12', geo: '4' },
  { intent: '3', persona: '2', service: '1',  geo: '1' },
  { intent: '3', persona: '2', service: '8',  geo: '1' },
  { intent: '3', persona: '3', service: '2',  geo: '2' },
  { intent: '3', persona: '3', service: '3',  geo: '1' },
  { intent: '3', persona: '4', service: '7',  geo: '1' },
  { intent: '3', persona: '4', service: '13', geo: '4' },
  { intent: '3', persona: '4', service: '14', geo: '4' },
];
