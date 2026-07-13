import { subscribe } from '../_store';

export const dynamic = 'force-dynamic';

export function GET() {
  const encoder = new TextEncoder();

  let closeStream: (reason: string) => void = () => {};

  const stream = new ReadableStream({
    start(controller) {
      console.log('[opal/response] SSE client connected — waiting for Opal callback');

      let closed = false;

      function close(reason: string) {
        if (closed) return;
        closed = true;
        clearTimeout(timeout);
        unsubscribe();
        try { controller.close(); } catch { /* already closed */ }
        console.log(`[opal/response] stream closed — reason: ${reason}`);
      }

      closeStream = close;

      const unsubscribe = subscribe((payload) => {
        if (closed) return;
        console.log('[opal/response] pushing payload to SSE client');
        try {
          controller.enqueue(encoder.encode(`data: ${JSON.stringify(payload)}\n\n`));
          close('message-sent');
        } catch {
          close('enqueue-error');
        }
      });

      const timeout = setTimeout(() => {
        if (closed) return;
        console.log('[opal/response] SSE stream timed out after 60s — closing');
        try {
          controller.enqueue(encoder.encode('event: close\ndata: timeout\n\n'));
        } catch { /* ignore */ }
        close('timeout');
      }, 60_000);
    },
    cancel() {
      closeStream('client-disconnect');
    },
  });

  return new Response(stream, {
    headers: {
      'Content-Type': 'text/event-stream',
      'Cache-Control': 'no-cache',
      'Connection': 'keep-alive',
    },
  });
}
