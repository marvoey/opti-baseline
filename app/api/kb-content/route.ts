import { fetchKbBlocks } from '@/app/[locale]/kb-workspace/test/_actions';
import type { PolicyContent } from '@/app/[locale]/kb-workspace/_lib/twoPassResolve';
import type { ServerLogEntry } from '@/app/[locale]/kb-workspace/_types';

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

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lob          = searchParams.get('lob') ?? '';
  const topic        = searchParams.get('topic') ?? '';
  const jurisdiction = searchParams.get('jurisdiction')?.toUpperCase() || undefined;

  const logs: ServerLogEntry[] = [];

  logs.push({ level: 'info', label: 'Query params', detail: `lob="${lob}" topic="${topic}" jurisdiction="${jurisdiction ?? '—'}"` });

  if (!lob || !topic) {
    return Response.json({ error: 'lob and topic are required' }, { status: 400 });
  }

  const result = await fetchKbBlocks(lob, topic, jurisdiction);

  logs.push({
    level: 'info',
    label: 'Graph results',
    detail: `corePrinciples=${result.corePrinciples.length} overrides=${result.overrides.length} safeguards=${result.proceduralSafeguards.length} disclosures=${result.disclosures.length}`,
  });

  const hasJurisdiction = !!jurisdiction;
  const pass: 1 | 2 = result.overrides.length > 0 ? 1 : 2;
  const jurisdictionName = (jurisdiction && STATE_NAMES[jurisdiction]) ?? jurisdiction ?? 'National';

  const content: PolicyContent = {
    lob,
    topic,
    jurisdiction: jurisdiction ?? 'National',
    jurisdictionName,
    pass,
    corePrinciple:       result.corePrinciples[0]?.richTextHtml ?? null,
    override:            hasJurisdiction ? (result.overrides[0]?.richTextHtml ?? null) : null,
    overrideLabel:       result.overrides[0]?.InternalName ?? result.disclosures[0]?.InternalName ?? `${jurisdictionName} - ${topic}`,
    proceduralSafeguard: result.proceduralSafeguards[0]?.richTextHtml ?? null,
    disclosure:          hasJurisdiction ? (result.disclosures[0]?.richTextHtml ?? null) : null,
  };

  const found = !!(content.corePrinciple || content.override || content.proceduralSafeguard || content.disclosure);
  logs.push({ level: found ? 'success' : 'warn', label: 'Content found', detail: String(found) });
  logs.push({ level: 'info', label: 'PolicyContent', detail: JSON.stringify(content) });

  return Response.json({ ...content, _debug: { lob, topic, jurisdiction, found }, _logs: logs });
}
