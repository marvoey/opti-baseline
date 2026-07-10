import rawData from '../_data/policies.json';

const LOB   = 'Personal Auto';
const TOPIC = 'Liability';
const DEFAULT_STATE = 'FL';

interface PolicyBlock {
  BlockType: string;
  InternalName: string;
  Taxonomy: { LOB: string; Topic: string; Jurisdiction: string };
  CopyType: string;
  RichTextValue: string;
}

export type ResolvedContent = {
  lob: string;
  topic: string;
  jurisdiction: string;
  jurisdictionName: string;
  pass: 1 | 2;
  corePrinciple: string | null;
  override: string | null;
  overrideLabel: string;
  proceduralSafeguard: string | null;
  disclosure: string | null;
};

const STATE_NAMES: Record<string, string> = {
  AL: 'Alabama', AK: 'Alaska', AZ: 'Arizona', AR: 'Arkansas',
  CA: 'California', CO: 'Colorado', CT: 'Connecticut', DE: 'Delaware',
  DC: 'Washington D.C.', FL: 'Florida', GA: 'Georgia', HI: 'Hawaii',
  ID: 'Idaho', IL: 'Illinois', IN: 'Indiana', IA: 'Iowa',
  KS: 'Kansas', KY: 'Kentucky', LA: 'Louisiana', ME: 'Maine',
  MD: 'Maryland', MA: 'Massachusetts', MI: 'Michigan', MN: 'Minnesota',
  MS: 'Mississippi', MO: 'Missouri', MT: 'Montana', NE: 'Nebraska',
  NV: 'Nevada', NH: 'New Hampshire', NJ: 'New Jersey', NM: 'New Mexico',
  NY: 'New York', NC: 'North Carolina', ND: 'North Dakota', OH: 'Ohio',
  OK: 'Oklahoma', OR: 'Oregon', PA: 'Pennsylvania', RI: 'Rhode Island',
  SC: 'South Carolina', SD: 'South Dakota', TN: 'Tennessee', TX: 'Texas',
  UT: 'Utah', VT: 'Vermont', VA: 'Virginia', WA: 'Washington',
  WV: 'West Virginia', WI: 'Wisconsin', WY: 'Wyoming',
};

export function twoPassResolve(rawSlug: string | undefined): ResolvedContent {
  const raw  = rawSlug?.toUpperCase() ?? DEFAULT_STATE;
  const code = STATE_NAMES[raw] ? raw : DEFAULT_STATE;

  const allBlocks = rawData.blocks as unknown as PolicyBlock[];

  const stateBlocks = allBlocks.filter(b =>
    b.Taxonomy.LOB === LOB &&
    b.Taxonomy.Topic === TOPIC &&
    b.Taxonomy.Jurisdiction === code
  );
  const nationalBlocks = allBlocks.filter(b =>
    b.Taxonomy.LOB === LOB &&
    b.Taxonomy.Topic === TOPIC &&
    b.Taxonomy.Jurisdiction === 'National'
  );

  const find = (copyType: string) =>
    stateBlocks.find(b => b.CopyType === copyType) ??
    nationalBlocks.find(b => b.CopyType === copyType) ??
    null;

  const corePrincipleBlock  = nationalBlocks.find(b => b.CopyType === 'Core Principle') ?? null;
  const overrideBlock       = find('Jurisdictional Override');
  const safeguardBlock      = nationalBlocks.find(b => b.CopyType === 'Procedural Safeguard') ?? null;
  const disclosureBlock     = find('Statutory Disclosure');

  const pass: 1 | 2 = stateBlocks.some(b => b.CopyType === 'Jurisdictional Override') ? 1 : 2;

  return {
    lob: LOB,
    topic: TOPIC,
    jurisdiction: code,
    jurisdictionName: STATE_NAMES[code],
    pass,
    corePrinciple:      corePrincipleBlock?.RichTextValue ?? null,
    override:           overrideBlock?.RichTextValue ?? null,
    overrideLabel:      overrideBlock?.InternalName ?? `${code} - Hail Deductible`,
    proceduralSafeguard: safeguardBlock?.RichTextValue ?? null,
    disclosure:         disclosureBlock?.RichTextValue ?? null,
  };
}
