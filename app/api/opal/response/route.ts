import { NextRequest } from 'next/server';
import { subscribe } from '../_store';

export const dynamic = 'force-dynamic';

export function GET(request: NextRequest) {
  const clientId = request.nextUrl.searchParams.get('clientId');

  if (!clientId) {
    return new Response('clientId query param is required', { status: 400 });
  }

  const encoder = new TextEncoder();
  let unsubscribe: () => void = () => {};
  let closeStream: () => void = () => {};

  const FILE = 'api/opal/response/route.ts';

  const stream = new ReadableStream({
    start(controller) {
      console.log(`[${FILE}:20] client connected — client-${clientId}`);

      let closed = false;

      function close() {
        if (closed) return;
        closed = true;
        clearInterval(heartbeat);
        clearTimeout(timeout);
        unsubscribe();
        try { controller.close(); } catch { /* already closed */ }
        console.log(`[${FILE}:30] stream closed — client-${clientId}`);
      }

      closeStream = close;

      const heartbeat = setInterval(() => {
        if (closed) return;
        try { controller.enqueue(encoder.encode(': ping\n\n')); } catch { close(); }
      }, 15_000);

      unsubscribe = subscribe(clientId, (correlationId, payload) => {
        if (closed) return;
        try {
          const data = JSON.stringify({ correlationId, payload });
          controller.enqueue(encoder.encode(`data: ${data}\n\n`));
          console.log(`[${FILE}:38] pushed SSE message — client-${clientId} | correlation-${correlationId}`);
        } catch {
          close();
        }
      });

      // Safety-net timeout — client should reconnect if it hits this
      const timeout = setTimeout(() => {
        if (closed) return;
        console.log(`[${FILE}:47] timeout reached — clientId: ${clientId}`);
        try {
          controller.enqueue(encoder.encode('event: timeout\ndata: reconnect\n\n'));
        } catch { /* ignore */ }
        close();
      }, 3 * 60_000);
    },
    cancel() {
      closeStream();
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
      'X-Accel-Buffering': 'no',
    },
  });
}
