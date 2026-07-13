'use server';

import '@/cms/registry';
import { getClient } from '@optimizely/cms-sdk';

// ─── CMS REST helpers (shared with admin actions) ─────────────────────────────

const CMS_BASE = (process.env.OPTIMIZELY_CMS_API_URL || 'https://api.cms.optimizely.com').replace(/\/$/, '');
const GRAPH_GATEWAY = (process.env.OPTIMIZELY_GRAPH_GATEWAY || 'https://cg.optimizely.com/content/v2').replace(/\/$/, '');

let _token: string | null = null;
let _tokenExpiry = 0;

async function getCmsToken(): Promise<string> {
  if (_token && Date.now() < _tokenExpiry) return _token;
  const clientId = process.env.OPTIMIZELY_CMS_CLIENT_ID?.trim();
  const clientSecret = process.env.OPTIMIZELY_CMS_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) throw new Error('Missing OPTIMIZELY_CMS_CLIENT_ID / OPTIMIZELY_CMS_CLIENT_SECRET');
  const res = await fetch(`${CMS_BASE}/oauth/token`, {
    method: 'POST',
    headers: { 'content-type': 'application/json' },
    body: JSON.stringify({ grant_type: 'client_credentials', client_id: clientId, client_secret: clientSecret }),
    cache: 'no-store',
  });
  const data = (await res.json()) as { access_token?: string; expires_in?: number };
  if (!data.access_token) throw new Error('Auth failed: no access_token');
  _token = data.access_token;
  _tokenExpiry = Date.now() + ((data.expires_in ?? 3600) - 30) * 1000;
  return _token;
}

const FIELDS_WITH_JURISDICTION = `
  _metadata { key displayName }
  InternalName
  LOB
  Topic
  Jurisdiction
  RichTextValue { json }
`;

const FIELDS_WITHOUT_JURISDICTION = `
  _metadata { key displayName }
  InternalName
  LOB
  Topic
  RichTextValue { json }
`;

function buildQuery(withJurisdiction: boolean) {
  return `
    query FetchKbBlocks($lob: String, $topic: String${withJurisdiction ? ', $jurisdiction: String' : ''}) {
      PrgvCorePrinciple(
        limit: 100
        where: { LOB: { eq: $lob } Topic: { eq: $topic } }
      ) {
        items { ${FIELDS_WITHOUT_JURISDICTION} }
      }

      PrgvProceduralSafeguard(
        limit: 100
        where: { LOB: { eq: $lob } Topic: { eq: $topic } }
      ) {
        items { ${FIELDS_WITH_JURISDICTION} }
      }

      ${withJurisdiction ? `
      PrgvJurisdictionalOverride(
        limit: 100
        where: { LOB: { eq: $lob } Topic: { eq: $topic } Jurisdiction: { eq: $jurisdiction } }
      ) {
        items { ${FIELDS_WITH_JURISDICTION} }
      }

      PrgvStatutoryDisclosure(
        limit: 100
        where: { LOB: { eq: $lob } Topic: { eq: $topic } Jurisdiction: { eq: $jurisdiction } }
      ) {
        items { ${FIELDS_WITH_JURISDICTION} }
      }
      ` : ''}
    }
  `;
}

// ─── Rich text serializer ─────────────────────────────────────────────────────

function esc(text: string): string {
  return text.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function nodeToHtml(node: unknown): string {
  if (!node || typeof node !== 'object') return '';
  const n = node as Record<string, unknown>;

  if (Array.isArray(node)) return (node as unknown[]).map(nodeToHtml).join('');

  const children = Array.isArray(n.children)
    ? (n.children as unknown[]).map(nodeToHtml).join('')
    : '';

  // Text leaf
  if (n.type === 'text' || typeof n.text === 'string') {
    let t = esc(typeof n.text === 'string' ? n.text : typeof n.value === 'string' ? n.value : '');
    if (n.bold) t = `<strong>${t}</strong>`;
    if (n.italic) t = `<em>${t}</em>`;
    if (n.underline) t = `<u>${t}</u>`;
    if (n.code) t = `<code>${t}</code>`;
    return t;
  }

  const type = typeof n.type === 'string' ? n.type : '';
  if (type === 'paragraph' || type === 'p') return `<p>${children}</p>`;
  if (type === 'heading-one' || type === 'h1') return `<h1>${children}</h1>`;
  if (type === 'heading-two' || type === 'h2') return `<h2>${children}</h2>`;
  if (type === 'heading-three' || type === 'h3') return `<h3>${children}</h3>`;
  if (type === 'bulleted-list' || type === 'ul') return `<ul>${children}</ul>`;
  if (type === 'numbered-list' || type === 'ol') return `<ol>${children}</ol>`;
  if (type === 'list-item' || type === 'li') return `<li>${children}</li>`;
  if (type === 'link' || type === 'a') return `<a href="${esc(String(n.url ?? n.href ?? ''))}">${children}</a>`;
  if (type === 'blockquote') return `<blockquote>${children}</blockquote>`;

  // Root / doc / unknown container — just emit children
  return children;
}

function richTextToHtml(json: unknown): string {
  if (!json) return '';
  return nodeToHtml(json);
}

// ─── Types ────────────────────────────────────────────────────────────────────

export type KbItem = {
  _metadata: { key: string; displayName?: string };
  InternalName: string;
  LOB: string;
  Topic: string;
  Jurisdiction?: string;
  richTextHtml: string;
};

export type FetchKbResult = {
  corePrinciples: KbItem[];
  proceduralSafeguards: KbItem[];
  overrides: KbItem[];
  disclosures: KbItem[];
};

type RawItem = {
  _metadata?: { key?: string; displayName?: string };
  InternalName?: string;
  LOB?: string;
  Topic?: string;
  Jurisdiction?: string;
  RichTextValue?: { json?: unknown };
};

function toKbItem(raw: RawItem): KbItem {
  return {
    _metadata: { key: raw._metadata?.key ?? '', displayName: raw._metadata?.displayName },
    InternalName: raw.InternalName ?? '',
    LOB: raw.LOB ?? '',
    Topic: raw.Topic ?? '',
    Jurisdiction: raw.Jurisdiction,
    richTextHtml: richTextToHtml(raw.RichTextValue?.json),
  };
}

export async function fetchKbBlocks(
  lob: string,
  topic: string,
  jurisdiction?: string,
): Promise<FetchKbResult> {
  const client = getClient();
  const query = buildQuery(!!jurisdiction);
  const variables = jurisdiction ? { lob, topic, jurisdiction } : { lob, topic };
  const data = await client.request(query, variables);
  return {
    corePrinciples: (data?.PrgvCorePrinciple?.items ?? []).map(toKbItem),
    proceduralSafeguards: (data?.PrgvProceduralSafeguard?.items ?? []).map(toKbItem),
    overrides: (data?.PrgvJurisdictionalOverride?.items ?? []).map(toKbItem),
    disclosures: (data?.PrgvStatutoryDisclosure?.items ?? []).map(toKbItem),
  };
}

// ─── Delete Core Principles with "Master" in displayName ─────────────────────

export type DeleteResult = {
  found: { key: string; displayName: string }[];
  deleted: string[];
  errors: { key: string; message: string }[];
};

async function fetchAllCorePrincipleKeys(): Promise<{ key: string; displayName: string }[]> {
  const singleKey = process.env.OPTIMIZELY_GRAPH_SINGLE_KEY?.trim();
  if (!singleKey) throw new Error('OPTIMIZELY_GRAPH_SINGLE_KEY is not set');

  const results: { key: string; displayName: string }[] = [];
  let skip = 0;

  while (true) {
    const query = `{
      PrgvCorePrinciple(limit: 100, skip: ${skip}) {
        items { _metadata { key displayName } }
        total
      }
    }`;
    const res = await fetch(GRAPH_GATEWAY, {
      method: 'POST',
      headers: { 'content-type': 'application/json', authorization: `epi-single ${singleKey}` },
      body: JSON.stringify({ query }),
      cache: 'no-store',
    });
    if (!res.ok) throw new Error(`Graph request failed (${res.status})`);
    const json = (await res.json()) as {
      data?: { PrgvCorePrinciple?: { items?: Array<{ _metadata?: { key?: string; displayName?: string } }>; total?: number } };
      errors?: { message: string }[];
    };
    if (json.errors?.length) throw new Error(json.errors.map(e => e.message).join('; '));

    const page = json.data?.PrgvCorePrinciple;
    const total = page?.total ?? 0;
    for (const item of page?.items ?? []) {
      if (item._metadata?.key && item._metadata?.displayName) {
        results.push({ key: item._metadata.key, displayName: item._metadata.displayName });
      }
    }
    skip += 100;
    if (skip >= total) break;
  }

  return results;
}

export async function deleteMasterCorePrinciples(): Promise<DeleteResult> {
  const token = await getCmsToken();
  const all = await fetchAllCorePrincipleKeys();
  const found = all.filter(item => item.displayName.includes('Master'));

  const deleted: string[] = [];
  const errors: { key: string; message: string }[] = [];

  await Promise.all(
    found.map(async ({ key, displayName }) => {
      const res = await fetch(`${CMS_BASE}/v1/content/${key}`, {
        method: 'DELETE',
        headers: { authorization: `Bearer ${token}` },
        cache: 'no-store',
      });
      if (res.ok) {
        deleted.push(displayName);
      } else {
        const text = await res.text().catch(() => res.statusText);
        errors.push({ key, message: `${res.status}: ${text}` });
      }
    }),
  );

  return { found, deleted, errors };
}
