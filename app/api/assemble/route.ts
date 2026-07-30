import { NextRequest, NextResponse } from 'next/server';
import { config } from '@optimizely/cms-sdk';
import { requireEnv } from '@/lib/env';
import { fetchByTaxonomy } from '@/lib/cms/fetchByTaxonomy';
import { assembleComposition, type AssemblyParams } from '@/lib/cms/assembleComposition';
import { seedExperience } from '@/lib/cms/seedExperience';

export const dynamic = 'force-dynamic';

// API routes don't run app/layout.tsx, so initialize the Graph SDK here.
const env = requireEnv();
config({ apiKey: env.OPTIMIZELY_GRAPH_SINGLE_KEY, graphUrl: env.OPTIMIZELY_GRAPH_GATEWAY });

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
  return NextResponse.json({ ok: true, url: result.url });
}
