import { NextRequest } from 'next/server';
import { isToolRequestAuthorized, readLimitedText } from '@/lib/askMark/requestGuards';
import { getTool } from '../../_tools/registry';
import { ToolError } from '../../_tools/types';

export const dynamic = 'force-dynamic';

/** Mark's tool calls are small; anything larger is refused. */
const MAX_BODY_BYTES = 8 * 1024;

/**
 * Mark calls this to hand a tool its input. Requires the bearer token (fails
 * closed if none is configured), accepts only registered tools, limits the body
 * size, and never logs request bodies.
 */
export async function POST(request: NextRequest, { params }: { params: Promise<{ name: string }> }) {
  if (!isToolRequestAuthorized(request)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { name } = await params;
  const tool = getTool(name);
  if (!tool) return Response.json({ error: 'Tool not found' }, { status: 404 });

  const raw = await readLimitedText(request, MAX_BODY_BYTES);
  if (raw === undefined) return Response.json({ error: 'Request too large' }, { status: 413 });

  let body: unknown;
  try {
    body = JSON.parse(raw);
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  if (!body || typeof body !== 'object' || Array.isArray(body)) {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const record = body as Record<string, unknown>;
  const parameters = (record.parameters ?? record) as Record<string, unknown>;

  try {
    return Response.json(await tool.handler(parameters));
  } catch (err) {
    if (err instanceof ToolError) return Response.json({ error: err.message }, { status: err.status });
    console.error(`[ask-mark] tool ${name} failed`, err instanceof Error ? err.message : String(err));
    return Response.json({ error: 'Tool failed' }, { status: 500 });
  }
}
