import { getClient } from '@optimizely/cms-sdk';

export type TaxonomyFilters = {
  intent?: string;
  persona?: string;
  geo?: string;
  service?: string;
};

export type TaxonomyBlock = {
  _type: 'CardBlock' | 'Paragraph' | 'ActionBlock' | 'HeroBlockv2';
  key: string;
  displayName: string;
  intent: string | null;
  persona: string | null;
  service: string[] | null;
  geo: string | null;
  preview: string | null;
};

/** Numeric-only codes like "1" or "14" — prevents injection via searchParams. */
function sanitize(val: string | undefined): string | undefined {
  return val && /^\d{1,2}$/.test(val) ? val : undefined;
}

function buildWhere(filters: TaxonomyFilters): string {
  const parts: string[] = [];
  const intent  = sanitize(filters.intent);
  const persona = sanitize(filters.persona);
  const geo     = sanitize(filters.geo);
  if (intent)  parts.push(`Intent: { eq: "${intent}" }`);
  if (persona) parts.push(`Persona: { eq: "${persona}" }`);
  if (geo)     parts.push(`Geo: { eq: "${geo}" }`);
  return parts.length ? `where: { ${parts.join(', ')} }, ` : '';
}

type RawMeta   = { key?: string | null; displayName?: string | null } | null;
type RawItem   = { _metadata?: RawMeta; Intent?: string | null; Persona?: string | null; Service?: unknown; Geo?: string | null; Title?: string | null; Label?: string | null };
type QueryData = { CardBlock?: { items?: (RawItem | null)[] | null } | null; Paragraph?: { items?: (RawItem | null)[] | null } | null; ActionBlock?: { items?: (RawItem | null)[] | null } | null; HeroBlockv2?: { items?: (RawItem | null)[] | null } | null };

function normalizeService(raw: unknown): string[] | null {
  if (!raw) return null;
  if (Array.isArray(raw)) return raw.filter((v) => typeof v === 'string');
  if (typeof raw === 'string') {
    try { return JSON.parse(raw) as string[]; } catch { return null; }
  }
  return null;
}

function mapItems(
  type: TaxonomyBlock['_type'],
  items: (RawItem | null)[] | null | undefined,
  serviceFilter: string | undefined,
): TaxonomyBlock[] {
  return (items ?? []).flatMap((item) => {
    if (!item?._metadata?.key) return [];
    const service = normalizeService(item.Service);
    if (serviceFilter && sanitize(serviceFilter) && !(service ?? []).includes(serviceFilter)) return [];
    return [{
      _type: type,
      key: item._metadata.key,
      displayName: item._metadata.displayName ?? item._metadata.key,
      intent:  item.Intent  ?? null,
      persona: item.Persona ?? null,
      service,
      geo:     item.Geo     ?? null,
      preview: item.Title ?? item.Label ?? null,
    }];
  });
}

export async function fetchByTaxonomy(
  filters: TaxonomyFilters,
): Promise<{ results: TaxonomyBlock[]; error?: string }> {
  const where = buildWhere(filters);
  const limit = 'limit: 50';
  const args  = `${where}${limit}`;

  const query = `
    query FetchByTaxonomy {
      CardBlock(${args}) {
        items {
          _metadata { key displayName }
          Title Intent Persona Service Geo
        }
      }
      Paragraph(${args}) {
        items {
          _metadata { key displayName }
          Intent Persona Service Geo
        }
      }
      ActionBlock(${args}) {
        items {
          _metadata { key displayName }
          Label Intent Persona Service Geo
        }
      }
      HeroBlockv2(${args}) {
        items {
          _metadata { key displayName }
          Intent Persona Service Geo
        }
      }
    }
  `;

  try {
    const data = (await getClient().request(query, {})) as QueryData;
    const seen = new Set<string>();
    const results = [
      ...mapItems('CardBlock',   data.CardBlock?.items,   filters.service),
      ...mapItems('Paragraph',   data.Paragraph?.items,   filters.service),
      ...mapItems('ActionBlock', data.ActionBlock?.items,  filters.service),
      ...mapItems('HeroBlockv2', data.HeroBlockv2?.items,  filters.service),
    ].filter(b => {
      if (seen.has(b.key)) return false;
      seen.add(b.key);
      return true;
    });
    return { results };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    return { results: [], error: message };
  }
}
