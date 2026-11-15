// app/api/rfp-followups/route.ts
//
// Read-only proxy for the LM RFP follow-up viewer (the React canvas in Mark).
// It keeps the Optimizely Graph app key and secret on the server, runs only the two
// fixed LM RFP queries below, and answers only callers that send the viewer token.
// That lets the "LM RFP Follow-ups" folder be restricted (Everyone's Read removed)
// while the viewer can still read it.
//
// Not to be confused with /proxy.ts, which is the Next.js request proxy (the old
// middleware) for locale URLs. Its matcher skips /api, so it never touches this route.
import { hasBearerToken, readLimitedText } from '@/lib/askMark/requestGuards';

export const dynamic = 'force-dynamic';

const MAX_BODY_BYTES = 1024;
const UPSTREAM_TIMEOUT_MS = 8000;

const clean = (v: string | undefined): string | undefined => v?.trim() || undefined;

/** OPTIMIZELY_GRAPH_GATEWAY may be set with or without /content/v2 (the SDK accepts both). */
function graphUrl(): string {
  const gateway = (clean(process.env.OPTIMIZELY_GRAPH_GATEWAY) ?? 'https://cg.optimizely.com').replace(/\/+$/, '');
  return gateway.endsWith('/content/v2') ? gateway : `${gateway}/content/v2`;
}

// The same queries as the viewer (keep them in sync). Only Published, or Published + Draft
// when the viewer's "Include drafts" box is ticked: Basic auth also returns Previous versions.
const META = '_metadata { key version status lastModified published }';
const statusWhere = (drafts: boolean) =>
  `where: { _metadata: { status: { in: [${(drafts ? ['Published', 'Draft'] : ['Published']).map((s) => `"${s}"`).join(', ')}] } } }`;

function buildMainQuery(drafts: boolean) {
  const w = statusWhere(drafts);
  return `query LmRfpFollowUps {
  responseSet: LmRfpResponseSet(locale: en, limit: 10, ${w}) {
    items { ${META} Eyebrow Title Intro SourceWorkbook AsOf FooterNote }
  }
  questions: LmRfpQuestion(locale: en, limit: 100, orderBy: { QuestionId: ASC }, ${w}) {
    total
    items { ${META} QuestionId LmRfpId Topic FollowUpQuestion ResponseFormat VendorResponse SupportingDocumentation }
  }
  flow: LmRfpDataFlowStep(locale: en, limit: 100, orderBy: { Step: ASC }, ${w}) {
    items { ${META} Step WhatHappens WhereItHappens Ownership ExpectedTime Notes }
  }
  erd: LmRfpErdEntity(locale: en, limit: 100, orderBy: { SortOrder: ASC }, ${w}) {
    items { ${META} SortOrder Entity KeyAttributes Relationships RetrievalEffect RelatedEntities }
  }
  sampleQueries: LmRfpSampleQuery(locale: en, limit: 10, ${w}) {
    items { ${META} QuestionId Title GraphqlRequest ExampleResponse Notes }
  }
}`;
}

// Optional tab. If the LmRfpDemoReference type doesn't exist, Graph answers 400 and the viewer hides the tab.
function buildRefsQuery(drafts: boolean) {
  return `query LmRfpDemoReferences {
  refs: LmRfpDemoReference(locale: en, limit: 100, orderBy: { QuestionId: ASC }, ${statusWhere(drafts)}) {
    items { ${META} QuestionId Points Gaps Files }
  }
}`;
}

/** CORS for the viewer's origin(s). RFP_VIEWER_ORIGINS is a comma-separated list, or * (the token is still required). */
function corsHeaders(request: Request): Record<string, string> {
  const allowed = (process.env.RFP_VIEWER_ORIGINS ?? '').split(',').map((s) => s.trim()).filter(Boolean);
  const origin = request.headers.get('origin') ?? '';
  const allow = allowed.includes('*') ? '*' : allowed.includes(origin) ? origin : '';
  return allow
    ? {
        'Access-Control-Allow-Origin': allow,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type, Authorization',
        'Access-Control-Max-Age': '600',
        Vary: 'Origin',
      }
    : { Vary: 'Origin' };
}

export async function OPTIONS(request: Request) {
  return new Response(null, { status: 204, headers: corsHeaders(request) });
}

export async function POST(request: Request) {
  const cors = corsHeaders(request);
  const reply = (status: number, body: unknown) =>
    Response.json(body, { status, headers: { 'Cache-Control': 'no-store', ...cors } });

  // 1. Who is asking? Fails closed: with no RFP_VIEWER_TOKEN set, nobody is let in.
  const viewerToken = clean(process.env.RFP_VIEWER_TOKEN);
  if (!viewerToken || !hasBearerToken(request, viewerToken)) return reply(401, { error: 'Unauthorized' });

  const appKey = clean(process.env.OPTIMIZELY_GRAPH_APP_KEY);
  const secret = clean(process.env.OPTIMIZELY_GRAPH_SECRET);
  if (!appKey || !secret) return reply(500, { error: 'Proxy is not configured' });

  // 2. What do they want? Only the two fixed operations.
  const raw = await readLimitedText(request, MAX_BODY_BYTES);
  if (raw === undefined) return reply(413, { error: 'Request too large' });
  let body: { op?: unknown; drafts?: unknown } = {};
  try {
    body = raw ? JSON.parse(raw) : {};
  } catch {
    return reply(400, { error: 'Invalid JSON body' });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) return reply(400, { error: 'Invalid JSON body' });
  if (body.op !== 'main' && body.op !== 'refs') return reply(400, { error: 'Unknown op' });
  const drafts = body.drafts === true;
  const query = body.op === 'main' ? buildMainQuery(drafts) : buildRefsQuery(drafts);

  // 3. Ask Graph with the app key and secret (Basic). RFP_GRAPH_ROLES is only for the case where
  //    restricted items come back empty: set it to a CMS role that has Read on the folder.
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    Authorization: `Basic ${Buffer.from(`${appKey}:${secret}`).toString('base64')}`,
  };
  const roles = clean(process.env.RFP_GRAPH_ROLES);
  if (roles) headers['cg-roles'] = roles;

  let upstream: Response;
  try {
    upstream = await fetch(graphUrl(), {
      method: 'POST',
      cache: 'no-store',
      signal: AbortSignal.timeout(UPSTREAM_TIMEOUT_MS),
      headers,
      body: JSON.stringify({ query }),
    });
  } catch {
    return reply(502, { error: 'Could not reach Optimizely Graph' });
  }

  // Graph refusing the key is our configuration problem, not the viewer's: don't pass the 401 on.
  if (upstream.status === 401 || upstream.status === 403) {
    console.error(`[rfp-followups] Graph rejected the app key and secret (HTTP ${upstream.status})`);
    return reply(502, { error: 'Optimizely Graph rejected the proxy credentials' });
  }
  const text = await upstream.text();
  if (!upstream.ok && body.op === 'main') console.error(`[rfp-followups] Graph returned HTTP ${upstream.status}`);
  return new Response(text, {
    status: upstream.status,
    headers: { 'Content-Type': 'application/json', 'Cache-Control': 'no-store', ...cors },
  });
}
