import { randomUUID } from 'node:crypto';
import { NextRequest, after } from 'next/server';
import { askRateLimitPerMinute, markReady, webhookConfig } from '@/lib/askMark/config';
import { clientIp, createLimiter, isSameOrigin, readLimitedText } from '@/lib/askMark/requestGuards';
import { CmsRateLimitedError } from '@/lib/cms/managementApi';
import { prepareResult, sweepResults, takeResult } from '../_resultStore';

export const dynamic = 'force-dynamic';
/** The longest the server will hold one question open. The browser gives up sooner (a CMS setting). */
export const maxDuration = 60;

const MAX_QUESTION_CHARS = 300;
const MAX_BODY_BYTES = 2 * 1024;
const WEBHOOK_TIMEOUT_MS = 8000;
const HOLD_LIMIT_MS = 60_000;
/** Mark never replies sooner than this, so the first check waits. */
const FIRST_CHECK_MS = 1500;
/**
 * The check is cheap (~80 ms) but the CMS rate-limits (429) under sustained load,
 * and a 100-question probe at 500 ms hit it. One check a second for the first 10 s,
 * then every 1.5 s.
 */
const CHECK_EVERY_MS = 1000;
const SLOW_CHECK_EVERY_MS = 1500;
const MAX_WAITING = 50;

// Best effort only: this memory is per server instance. The real limit is the Vercel Firewall rule.
const allow = createLimiter(askRateLimitPerMinute(), 60_000);
let waiting = 0;

const sseHeaders = {
  'Content-Type': 'text/event-stream; charset=utf-8',
  'Cache-Control': 'no-store, no-transform',
  'X-Accel-Buffering': 'no',
};

function fail(status: number, error: string) {
  return Response.json({ error }, { status });
}

/**
 * One question to Mark. Starts the Mark workflow, then streams events back on the
 * same connection until Mark's reply appears in the CMS store, the hold limit
 * passes, or the browser leaves.
 *
 * Events: `sent` (Mark acknowledged), `result` {payload}, `timeout`, `error` {code}.
 */
export async function POST(request: NextRequest) {
  const webhook = webhookConfig();
  if (!markReady() || !webhook) return fail(503, 'Mark is not configured');
  if (!isSameOrigin(request)) return fail(403, 'Forbidden');
  if (!allow(clientIp(request))) return fail(429, 'Too many questions, try again shortly');

  const raw = await readLimitedText(request, MAX_BODY_BYTES);
  if (raw === undefined) return fail(413, 'Request too large');
  let question = '';
  try {
    const body = JSON.parse(raw) as { question?: unknown };
    question = typeof body.question === 'string' ? body.question.trim() : '';
  } catch {
    return fail(400, 'Invalid JSON body');
  }
  if (!question || question.length > MAX_QUESTION_CHARS) {
    return fail(400, `question must be 1 to ${MAX_QUESTION_CHARS} characters`);
  }

  if (waiting >= MAX_WAITING) return fail(503, 'Too many questions in progress');

  // The server, not the browser, makes the handle that Mark's reply is matched to.
  const cid = randomUUID().replace(/-/g, '');
  // The question text is never logged (it can contain personal details).
  console.log(`[ask-mark] ask start cid=${cid} chars=${question.length}`);

  // Start the CMS lookup now (not awaited) so storing Mark's reply later is fast.
  prepareResult(cid);

  waiting += 1;
  let aborted = false;
  let released = false;
  const release = () => {
    if (!released) {
      released = true;
      waiting -= 1;
    }
  };
  const wake = new Set<() => void>();
  const stop = () => {
    aborted = true;
    wake.forEach((fn) => fn());
  };
  request.signal.addEventListener('abort', stop, { once: true });
  /** Wait, but return early if the browser leaves. */
  const pause = (ms: number) =>
    new Promise<void>((resolve) => {
      const done = () => {
        clearTimeout(timer);
        wake.delete(done);
        resolve();
      };
      const timer = setTimeout(done, ms);
      wake.add(done);
    });

  const encoder = new TextEncoder();
  const stream = new ReadableStream({
    start(controller) {
      let closed = false;
      const write = (chunk: string) => {
        if (closed) return;
        try {
          controller.enqueue(encoder.encode(chunk));
        } catch {
          closed = true;
        }
      };
      const send = (event: string, data: unknown = {}) => write(`event: ${event}\ndata: ${JSON.stringify(data)}\n\n`);
      const ping = setInterval(() => write(': ping\n\n'), 10_000);

      const run = async () => {
        try {
          const headers: Record<string, string> = { 'Content-Type': 'application/json' };
          if (webhook.token) headers.Authorization = `Bearer ${webhook.token}`;
          const res = await fetch(webhook.url, {
            method: 'POST',
            headers,
            body: JSON.stringify({ question, correlationId: cid }),
            signal: AbortSignal.timeout(WEBHOOK_TIMEOUT_MS),
          });
          if (!res.ok) {
            console.error(`[ask-mark] webhook answered ${res.status} cid=${cid}`);
            send('error', { code: 'webhook' });
            return;
          }
          send('sent');

          const sentAt = Date.now();
          let errors = 0;
          await pause(FIRST_CHECK_MS);
          while (!aborted && Date.now() - sentAt < HOLD_LIMIT_MS) {
            try {
              const taken = await takeResult(cid);
              errors = 0;
              if (taken) {
                console.log(`[ask-mark] ask answered cid=${cid} after ${Date.now() - sentAt}ms`);
                send('result', { payload: taken.result });
                await taken.cleanup(); // delete on read, after the reply is on its way
                return;
              }
            } catch (err) {
              if (err instanceof CmsRateLimitedError) {
                await pause(err.retryAfterMs);
                continue;
              }
              errors += 1;
              console.warn(`[ask-mark] store check failed cid=${cid}`, err instanceof Error ? err.message : String(err));
              if (errors >= 3) {
                send('error', { code: 'store' });
                return;
              }
            }
            await pause(Date.now() - sentAt < 10_000 ? CHECK_EVERY_MS : SLOW_CHECK_EVERY_MS);
          }
          if (!aborted) {
            console.log(`[ask-mark] ask timed out cid=${cid}`);
            send('timeout');
          }
        } catch (err) {
          console.error(`[ask-mark] ask failed cid=${cid}`, err instanceof Error ? err.message : String(err));
          send('error', { code: 'webhook' });
        } finally {
          clearInterval(ping);
          release();
          closed = true;
          try {
            controller.close();
          } catch {
            /* already closed */
          }
        }
      };

      void run();
    },
    cancel() {
      stop();
    },
  });

  // Clean up any replies nobody collected, once this response has finished.
  after(() => sweepResults());

  return new Response(stream, { headers: sseHeaders });
}
