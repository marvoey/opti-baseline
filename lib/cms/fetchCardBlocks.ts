import { getClient } from '@optimizely/cms-sdk';
import type { TaxonomyFilters } from './fetchByTaxonomy';

export type { TaxonomyFilters };

export type CardBlockItem = {
  key: string;
  displayName: string;
  Title: string | null;
  Body: { json: unknown } | null;
  Link: { default: string } | null;
  Intent: string | null;
  Persona: string | null;
  Service: string[] | null;
  Geo: string | null;
};

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

type RawLink    = { default?: string | null } | null;
type RawBody    = { json?: unknown } | null;
type RawItem    = { _metadata?: { key?: string | null; displayName?: string | null } | null; Title?: string | null; Body?: RawBody; Link?: RawLink; Intent?: string | null; Persona?: string | null; Service?: unknown; Geo?: string | null };
type QueryData  = { CardBlock?: { items?: (RawItem | null)[] | null } | null };

function normalizeService(raw: unknown): string[] | null {
  if (!raw) return null;
  if (Array.isArray(raw)) return raw.filter((v): v is string => typeof v === 'string');
  if (typeof raw === 'string') { try { return JSON.parse(raw) as string[]; } catch { return null; } }
  return null;
}

export async function fetchCardBlocks(
  filters: TaxonomyFilters,
): Promise<{ items: CardBlockItem[]; error?: string }> {
  const where = buildWhere(filters);
  const query = `
    query FetchCardBlocks {
      CardBlock(${where}limit: 50) {
        items {
          _metadata { key displayName }
          Title
          Body { json }
          Link { default }
          Intent Persona Service Geo
        }
      }
    }
  `;

  try {
    const data = (await getClient().request(query, {})) as QueryData;
    const serviceFilter = sanitize(filters.service);
    const items: CardBlockItem[] = (data.CardBlock?.items ?? []).flatMap((raw) => {
      if (!raw?._metadata?.key) return [];
      const service = normalizeService(raw.Service);
      if (serviceFilter && !(service ?? []).includes(serviceFilter)) return [];
      return [{
        key:         raw._metadata.key,
        displayName: raw._metadata.displayName ?? raw._metadata.key,
        Title:       raw.Title ?? null,
        Body:        raw.Body ? { json: raw.Body.json } : null,
        Link:        raw.Link?.default ? { default: raw.Link.default } : null,
        Intent:      raw.Intent  ?? null,
        Persona:     raw.Persona ?? null,
        Service:     service,
        Geo:         raw.Geo    ?? null,
      }];
    });
    return { items };
  } catch (err) {
    return { items: [], error: err instanceof Error ? err.message : String(err) };
  }
}
