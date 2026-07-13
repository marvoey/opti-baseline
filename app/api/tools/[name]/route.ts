import { NextRequest } from 'next/server';
import { getTool } from '../../_tools/registry';

export const dynamic = 'force-dynamic';

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ name: string }> },
) {
  const { name } = await params;
  const tool = getTool(name);

  console.log(`[tools/${name}] ✅ Opal reached the route handler — the endpoint URL is correct and Next.js routed the request here.`);
  console.log(`[tools/${name}] 🔍 Looking up tool in registry — registered name must match exactly (hyphens vs underscores matter).`, { found: !!tool });

  if (!tool) {
    console.log(`[tools/${name}] ❌ No tool registered under this name. Check that defineTool({ name: '${name}' }) exists in registry.ts.`);
    return Response.json({ error: `Tool '${name}' not found` }, { status: 404 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
    console.log(`[tools/${name}] 📦 Raw request body received from Opal:`, JSON.stringify(body));
  } catch (err) {
    console.log(`[tools/${name}] ❌ Failed to parse request body as JSON — Opal may have sent an empty or malformed body.`, err);
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const parameters = (body.parameters ?? body) as Record<string, unknown>;
  console.log(`[tools/${name}] 🧩 Parameters extracted and passed to handler — these are the values your tool logic will receive:`, JSON.stringify(parameters));

  try {
    const result = await tool.handler(parameters);
    console.log(`[tools/${name}] ✅ Handler completed successfully — sending this response back to Opal:`, JSON.stringify(result));
    return Response.json(result);
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    console.log(`[tools/${name}] ❌ Handler threw an error — check the tool logic in registry.ts:`, message);
    return Response.json({ error: message }, { status: 500 });
  }
}
