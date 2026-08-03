'use server';

const GRAPH_GATEWAY = (
  process.env.OPTIMIZELY_GRAPH_GATEWAY || 'https://cg.optimizely.com/content/v2'
).replace(/\/$/, '');

// ── Rich-text helpers ─────────────────────────────────────────────────────────

function nodeToText(node: unknown): string {
  if (!node || typeof node !== 'object') return '';
  if (Array.isArray(node)) return (node as unknown[]).map(nodeToText).join(' ');
  const n = node as Record<string, unknown>;
  if (typeof n.text === 'string') return n.text;
  if (typeof n.value === 'string') return n.value;
  if (Array.isArray(n.children)) return (n.children as unknown[]).map(nodeToText).join(' ');
  return '';
}

function richTextToPlain(json: unknown): string {
  return nodeToText(json).replace(/\s+/g, ' ').trim();
}

function esc(t: string) {
  return t.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

function nodeToHtml(node: unknown): string {
  if (!node || typeof node !== 'object') return '';
  if (Array.isArray(node)) return (node as unknown[]).map(nodeToHtml).join('');
  const n = node as Record<string, unknown>;
  const children = Array.isArray(n.children)
    ? (n.children as unknown[]).map(nodeToHtml).join('')
    : '';
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
  if (type === 'bulleted-list' || type === 'ul') return `<ul>${children}</ul>`;
  if (type === 'numbered-list' || type === 'ol') return `<ol>${children}</ol>`;
  if (type === 'list-item' || type === 'li') return `<li>${children}</li>`;
  if (type === 'link' || type === 'a')
    return `<a href="${esc(String(n.url ?? n.href ?? ''))}">${children}</a>`;
  if (type === 'blockquote') return `<blockquote>${children}</blockquote>`;
  return children;
}

function richTextToHtml(json: unknown): string {
  if (!json) return '';
  return nodeToHtml(json);
}

// ── Types ─────────────────────────────────────────────────────────────────────

export type BlockType =
  | 'prgv_GlobalComplianceDisclosure'
  | 'prgv_HandlingNoteBlock'
  | 'prgv_ScriptingBlock'
  | 'prgv_StandardInstructionBlock';

export type PrgvBlock = {
  _metadata: { key: string; displayName?: string };
  blockType: BlockType;
  contentHtml: string;
  contentPlain: string;
  DisclosureName?: string;
  EffectiveDate?: string;
  Jurisdiction?: string;
  RuleCategory?: string;
  SeverityLevel?: string;
  TargetAudience?: string;
  LineOfBusiness?: string[];
  ApplicableState?: string;
};

// ── Query builder ─────────────────────────────────────────────────────────────

function buildQuery(q?: string): string {
  const ftWhere = q ? `, where: { _fulltext: { match: ${JSON.stringify(q)} } }` : '';
  return `{
    prgv_GlobalComplianceDisclosure(limit: 100${ftWhere}) {
      total
      items {
        _metadata { key displayName }
        DisclosureName
        EffectiveDate
        LegalText { json }
        LineOfBusiness
        ApplicableState
        Jurisdiction
      }
    }
    prgv_HandlingNoteBlock(limit: 100${ftWhere}) {
      total
      items {
        _metadata { key displayName }
        NoteContent { json }
        LineOfBusiness
        ApplicableState
        RuleCategory
        SeverityLevel
      }
    }
    prgv_ScriptingBlock(limit: 100${ftWhere}) {
      total
      items {
        _metadata { key displayName }
        VerbatimScript { json }
        LineOfBusiness
        ApplicableState
      }
    }
    prgv_StandardInstructionBlock(limit: 100${ftWhere}) {
      total
      items {
        _metadata { key displayName }
        InstructionText { json }
        LineOfBusiness
        ApplicableState
        TargetAudience
      }
    }
  }`;
}

// ── Raw shapes ────────────────────────────────────────────────────────────────

type Meta   = { key?: string; displayName?: string };
type RT     = { json?: unknown };
type RawDisc  = { _metadata?: Meta; DisclosureName?: string; EffectiveDate?: string; LegalText?: RT; LineOfBusiness?: string[]; ApplicableState?: string; Jurisdiction?: string };
type RawNote  = { _metadata?: Meta; NoteContent?: RT; LineOfBusiness?: string[]; ApplicableState?: string; RuleCategory?: string; SeverityLevel?: string };
type RawScript = { _metadata?: Meta; VerbatimScript?: RT; LineOfBusiness?: string[]; ApplicableState?: string };
type RawInstr = { _metadata?: Meta; InstructionText?: RT; LineOfBusiness?: string[]; ApplicableState?: string; TargetAudience?: string };

// ── Main export ───────────────────────────────────────────────────────────────

export type FetchResult = { blocks: PrgvBlock[]; graphTotal: number };

export async function fetchPrgvBlocks(q?: string): Promise<FetchResult> {
  const singleKey = process.env.OPTIMIZELY_GRAPH_SINGLE_KEY?.trim();
  if (!singleKey) throw new Error('OPTIMIZELY_GRAPH_SINGLE_KEY is not set');

  const res = await fetch(GRAPH_GATEWAY, {
    method: 'POST',
    headers: {
      'content-type': 'application/json',
      authorization: `epi-single ${singleKey}`,
    },
    body: JSON.stringify({ query: buildQuery(q) }),
    cache: 'no-store',
  });

  if (!res.ok) {
    const body = await res.text().catch(() => res.statusText);
    throw new Error(`Graph HTTP ${res.status}: ${body}`);
  }

  const json = (await res.json()) as {
    data?: Record<string, { total?: number; items?: unknown[] } | null>;
    errors?: { message: string }[];
  };

  if (json.errors?.length) throw new Error(json.errors.map(e => e.message).join('; '));

  const data = json.data ?? {};
  const results: PrgvBlock[] = [];
  let graphTotal = 0;

  graphTotal += data.prgv_GlobalComplianceDisclosure?.total ?? 0;
  graphTotal += data.prgv_HandlingNoteBlock?.total ?? 0;
  graphTotal += data.prgv_ScriptingBlock?.total ?? 0;
  graphTotal += data.prgv_StandardInstructionBlock?.total ?? 0;

  for (const raw of (data.prgv_GlobalComplianceDisclosure?.items ?? []) as RawDisc[]) {
    results.push({
      _metadata: { key: raw._metadata?.key ?? '', displayName: raw._metadata?.displayName },
      blockType: 'prgv_GlobalComplianceDisclosure',
      contentHtml: richTextToHtml(raw.LegalText?.json),
      contentPlain: richTextToPlain(raw.LegalText?.json),
      DisclosureName: raw.DisclosureName,
      EffectiveDate: raw.EffectiveDate,
      Jurisdiction: raw.Jurisdiction,
      LineOfBusiness: raw.LineOfBusiness,
      ApplicableState: raw.ApplicableState,
    });
  }

  for (const raw of (data.prgv_HandlingNoteBlock?.items ?? []) as RawNote[]) {
    results.push({
      _metadata: { key: raw._metadata?.key ?? '', displayName: raw._metadata?.displayName },
      blockType: 'prgv_HandlingNoteBlock',
      contentHtml: richTextToHtml(raw.NoteContent?.json),
      contentPlain: richTextToPlain(raw.NoteContent?.json),
      RuleCategory: raw.RuleCategory,
      SeverityLevel: raw.SeverityLevel,
      LineOfBusiness: raw.LineOfBusiness,
      ApplicableState: raw.ApplicableState,
    });
  }

  for (const raw of (data.prgv_ScriptingBlock?.items ?? []) as RawScript[]) {
    results.push({
      _metadata: { key: raw._metadata?.key ?? '', displayName: raw._metadata?.displayName },
      blockType: 'prgv_ScriptingBlock',
      contentHtml: richTextToHtml(raw.VerbatimScript?.json),
      contentPlain: richTextToPlain(raw.VerbatimScript?.json),
      LineOfBusiness: raw.LineOfBusiness,
      ApplicableState: raw.ApplicableState,
    });
  }

  for (const raw of (data.prgv_StandardInstructionBlock?.items ?? []) as RawInstr[]) {
    results.push({
      _metadata: { key: raw._metadata?.key ?? '', displayName: raw._metadata?.displayName },
      blockType: 'prgv_StandardInstructionBlock',
      contentHtml: richTextToHtml(raw.InstructionText?.json),
      contentPlain: richTextToPlain(raw.InstructionText?.json),
      TargetAudience: raw.TargetAudience,
      LineOfBusiness: raw.LineOfBusiness,
      ApplicableState: raw.ApplicableState,
    });
  }

  return { blocks: results, graphTotal };
}
