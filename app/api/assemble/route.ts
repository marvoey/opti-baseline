import { NextRequest, NextResponse } from 'next/server';
import { config } from '@optimizely/cms-sdk';
import { requireEnv } from '@/lib/env';
import { fetchByTaxonomy } from '@/lib/cms/fetchByTaxonomy';
import { assembleComposition, type AssemblyParams } from '@/lib/cms/assembleComposition';
import { seedExperience } from '@/lib/cms/seedExperience';

export const dynamic = 'force-dynamic';

function initGraph() {
  const env = requireEnv();
  config({ apiKey: env.OPTIMIZELY_GRAPH_SINGLE_KEY, graphUrl: env.OPTIMIZELY_GRAPH_GATEWAY });
}

function readParams(entries: Record<string, string | null>): AssemblyParams {
  return {
    intent:  entries.intent  || undefined,
    persona: entries.persona || undefined,
    service: entries.service || undefined,
    geo:     entries.geo     || undefined,
  };
}

/** GET /api/assemble?intent=1&persona=4&service=7&geo=1 — preview matching blocks */
export async function GET(req: NextRequest) {
  try { initGraph(); } catch (e) {
    return NextResponse.json({ error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }

  const sp = req.nextUrl.searchParams;
  const params = readParams({
    intent:  sp.get('intent'),
    persona: sp.get('persona'),
    service: sp.get('service'),
    geo:     sp.get('geo'),
  });

  const { results, error } = await fetchByTaxonomy(params);
  if (error) return NextResponse.json({ error }, { status: 500 });
  return NextResponse.json({ results });
}

/** POST /api/assemble — assemble + publish a BlankExperience, returns { ok, url } */
export async function POST(req: NextRequest) {
  try { initGraph(); } catch (e) {
    return NextResponse.json({ ok: false, error: e instanceof Error ? e.message : String(e) }, { status: 500 });
  }

  const clientId = process.env.OPTIMIZELY_CMS_CLIENT_ID?.trim();
  const clientSecret = process.env.OPTIMIZELY_CMS_CLIENT_SECRET?.trim();
  if (!clientId || !clientSecret) {
    return NextResponse.json(
      { ok: false, error: 'CMS credentials are not configured. Set OPTIMIZELY_CMS_CLIENT_ID and OPTIMIZELY_CMS_CLIENT_SECRET in your environment variables.' },
      { status: 500 },
    );
  }

  let body: AssemblyParams;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: 'Invalid JSON body' }, { status: 400 });
  }

  const params = readParams({
    intent:  body.intent  ?? null,
    persona: body.persona ?? null,
    service: body.service ?? null,
    geo:     body.geo     ?? null,
  });

  const { results, error } = await fetchByTaxonomy(params);
  if (error) return NextResponse.json({ ok: false, error }, { status: 500 });
  if (!results.length) {
    return NextResponse.json(
      { ok: false, error: 'No content matched those filters — try different attributes.' },
      { status: 422 },
    );
  }

  const seed = assembleComposition(results, params);
  const result = await seedExperience(seed);

  if (!result.ok) return NextResponse.json({ ok: false, error: result.message }, { status: 500 });
  if (result.skipped) return NextResponse.json({ ok: false, error: `A page for this combination already exists at ${result.url} — view it there or try different attributes.` }, { status: 409 });
  return NextResponse.json({ ok: true, url: result.url });
}
