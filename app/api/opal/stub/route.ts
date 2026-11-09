import { NextRequest, after } from 'next/server';
import { stubEnabled, toolToken, webhookConfig } from '@/lib/askMark/config';
import { hasBearerToken, readLimitedText } from '@/lib/askMark/requestGuards';

export const dynamic = 'force-dynamic';
export const maxDuration = 60;

/**
 * NON-PRODUCTION ONLY. A stand-in for Mark's webhook, so the whole round trip can
 * be tested and probed without Mark: it acknowledges at once, then after a short
 * delay calls this app's `liberty_ask` tool over the public URL with a canned
 * classification, exactly as Mark would. Returns 404 unless ASK_MARK_STUB=on and
 * this is not a production deployment.
 */

type Canned = {
  intent: string;
  product?: string;
  topic?: string;
  state?: string;
  confidence: number;
  reasoning: string;
};

function classify(question: string): Canned {
  const t = question.toLowerCase();
  if (/\bsue\b|lawyer|attorney|legal advice|court/.test(t)) {
    return { intent: 'Legal advice', confidence: 0.9, reasoning: 'The question asks about legal action.' };
  }
  if (/claim/.test(t)) {
    return { intent: 'Account service', topic: 'Claim status', confidence: 0.88, reasoning: 'The question is about a claim.' };
  }
  if (/bundl|home and auto|auto and home|one policy|together/.test(t)) {
    return { intent: 'Compare options', product: 'Home + Auto', topic: 'Bundling', confidence: 0.86, reasoning: 'The question compares home and auto policies.' };
  }
  if (/pipe|water|leak|burst|flood/.test(t)) {
    return { intent: 'Learn about coverage', product: 'Home', topic: 'Water damage', confidence: 0.9, reasoning: 'The question is about water damage at home.' };
  }
  if (/requir|minimum|by law|legally|mandatory|need to have/.test(t)) {
    const texas = /texas|\btx\b/.test(t);
    return {
      intent: 'Learn about requirements',
      product: 'Auto',
      topic: 'State minimums',
      ...(texas ? { state: 'Texas' } : {}),
      confidence: 0.87,
      reasoning: texas ? 'The question asks for car insurance minimums in Texas.' : 'The question asks what car insurance is required.',
    };
  }
  if (/\brental\b|rent a car|rental car/.test(t)) {
    return { intent: 'Learn about coverage', product: 'Auto', topic: 'Rental cars', confidence: 0.9, reasoning: 'The question is about rental car coverage.' };
  }
  return { intent: 'Out of scope', confidence: 0.3, reasoning: 'The question does not match an approved topic.' };
}

export async function POST(request: NextRequest) {
  if (!stubEnabled()) return new Response('Not found', { status: 404 });

  const webhook = webhookConfig();
  if (webhook?.token && !hasBearerToken(request, webhook.token)) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const raw = await readLimitedText(request, 4 * 1024);
  let question = '';
  let correlationId = '';
  try {
    const body = JSON.parse(raw ?? '') as { question?: unknown; correlationId?: unknown };
    question = typeof body.question === 'string' ? body.question : '';
    correlationId = typeof body.correlationId === 'string' ? body.correlationId : '';
  } catch {
    return Response.json({ error: 'Invalid JSON body' }, { status: 400 });
  }
  const token = toolToken();
  if (!question || !correlationId || !token) return Response.json({ error: 'Bad request' }, { status: 400 });

  const host = request.headers.get('x-forwarded-host') ?? request.headers.get('host') ?? '';
  const proto = request.headers.get('x-forwarded-proto') ?? (host.startsWith('localhost') ? 'http' : 'https');
  const delayMs = 1000 + Math.floor(Math.random() * 2000);

  // Reply later, over the public URL, the way Mark does.
  after(async () => {
    await new Promise((r) => setTimeout(r, delayMs));
    try {
      const res = await fetch(`${proto}://${host}/api/tools/liberty_ask`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        // `reasoning` carries the stub's own delay so the probe can measure the overhead the round trip adds.
        body: JSON.stringify({
          parameters: {
            payload: { correlationId, ...classify(question), reasoning: `stub delay=${delayMs}ms` },
          },
        }),
        signal: AbortSignal.timeout(8000),
      });
      console.log(`[ask-mark] stub replied cid=${correlationId} status=${res.status}`);
    } catch (err) {
      console.error('[ask-mark] stub could not call the tool', err instanceof Error ? err.message : String(err));
    }
  });

  return Response.json({ ok: true });
}
