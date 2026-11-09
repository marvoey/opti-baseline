'use client';

import { useCallback, useEffect, useRef } from 'react';
import { readAskStream, type AskMarkOutcome } from './askStream';

export type { AskMarkOutcome };

type SubmitOptions = {
  /** How long to wait for Mark before giving up. */
  timeoutMs: number;
  /** Called when Mark has acknowledged the question. */
  onSent?: () => void;
};

/**
 * Send one question to Mark through `/api/opal/ask` and wait for the reply.
 * There is no connection until a question is asked: a single request that
 * streams events back. A new question cancels the previous one, and leaving the
 * page cancels it too (which frees the server).
 */
export function useAskMark() {
  const controller = useRef<AbortController | null>(null);

  const cancel = useCallback(() => {
    controller.current?.abort();
    controller.current = null;
  }, []);

  useEffect(() => cancel, [cancel]);

  const submit = useCallback(
    async (question: string, { timeoutMs, onSent }: SubmitOptions): Promise<AskMarkOutcome> => {
      cancel();
      const ctrl = new AbortController();
      controller.current = ctrl;
      let timedOut = false;
      const timer = setTimeout(() => {
        timedOut = true;
        ctrl.abort();
      }, timeoutMs);

      try {
        const res = await fetch('/api/opal/ask', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ question: question.slice(0, 300) }),
          signal: ctrl.signal,
        });
        return await readAskStream(res, onSent);
      } catch {
        if (timedOut) return { status: 'timeout' };
        return ctrl.signal.aborted ? { status: 'aborted' } : { status: 'error', code: 'network' };
      } finally {
        clearTimeout(timer);
        if (controller.current === ctrl) controller.current = null;
        ctrl.abort(); // closes the connection if it is still open
      }
    },
    [cancel],
  );

  return { submit, cancel };
}
