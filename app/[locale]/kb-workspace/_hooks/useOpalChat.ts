"use client";

import { useState, useRef, useEffect, useCallback } from "react";
import type { OpalPayload, PolicyContentWithDebug, Message, LogEntry, LogLevel } from "../_types";

async function fetchPolicyContent(
  lob: string,
  topic: string,
  jurisdiction?: string,
): Promise<PolicyContentWithDebug | null> {
  const params = new URLSearchParams({ lob, topic });
  if (jurisdiction) params.set("jurisdiction", jurisdiction);
  try {
    const res = await fetch(`/api/kb-content?${params}`);
    if (!res.ok) return null;
    return res.json();
  } catch {
    return null;
  }
}

export function useOpalChat() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [logs, setLogs] = useState<LogEntry[]>([]);

  const clientIdRef = useRef(`client-${crypto.randomUUID()}`);
  const esRef = useRef<EventSource | null>(null);
  const handlersRef = useRef(new Map<string, (payload: unknown) => void>());

  const isLoading = messages.some((m) => m.loading || m.contentLoading);

  const addLog = useCallback((level: LogLevel, label: string, detail?: string) => {
    setLogs((prev) => [
      ...prev,
      { id: crypto.randomUUID(), ts: Date.now(), level, label, detail },
    ]);
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  useEffect(() => {
    const es = new EventSource(`/api/opal/response?clientId=${clientIdRef.current}`);
    esRef.current = es;
    addLog('info', 'SSE stream opened', `clientId: ${clientIdRef.current}`);

    es.onmessage = (e) => {
      try {
        const { correlationId, payload } = JSON.parse(e.data) as {
          correlationId: string;
          payload: unknown;
        };
        const pendingIds = [...handlersRef.current.keys()];
        addLog('info', 'SSE message received', `correlationId: ${correlationId}`);
        addLog('info', 'Pending handlers', pendingIds.join(', ') || '(none)');
        const handler = handlersRef.current.get(correlationId);
        if (handler) {
          addLog('success', 'Handler matched', correlationId);
          handler(payload);
          handlersRef.current.delete(correlationId);
        } else {
          addLog('error', 'No handler matched', `received: ${correlationId}`);
        }
      } catch (err) {
        addLog('error', 'SSE parse error', String(err));
      }
    };

    es.addEventListener('timeout', () => {
      addLog('warn', 'SSE timeout', 'browser will reconnect automatically');
    });

    es.onerror = () => {
      addLog('error', 'SSE connection error', 'browser will attempt to reconnect');
    };

    return () => {
      es.close();
    };
  // addLog is stable (useCallback with no deps) — safe to include
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  async function submit(question: string, knownLob?: string, knownTopic?: string, knownJurisdiction?: string) {
    const id = crypto.randomUUID();
    const correlationId = `correlation-${crypto.randomUUID()}`;

    setMessages((prev) => [
      ...prev,
      {
        id,
        question,
        loading: true,
        opalPayload: null,
        policyContent: null,
        contentLoading: false,
      },
    ]);

    addLog('info', 'Question submitted', question);
    addLog('info', 'Routing IDs', `clientId: ${clientIdRef.current} | correlationId: ${correlationId}`);

    function onPayload(rawPayload: unknown) {
      const payload =
        rawPayload &&
        typeof rawPayload === "object" &&
        !Array.isArray(rawPayload)
          ? (rawPayload as OpalPayload)
          : {};

      addLog('success', 'Opal payload received', JSON.stringify(payload));

      const lob   = (typeof payload.lob === 'string'   && payload.lob)
                 || (typeof payload.LOB === 'string'   && payload.LOB)
                 || knownLob;
      const topic = (typeof payload.topic === 'string' && payload.topic)
                 || (typeof payload.Topic === 'string' && payload.Topic)
                 || knownTopic;

      const jurisdiction = (typeof payload.jurisdiction === 'string' && payload.jurisdiction)
                        || (typeof payload.Jurisdiction === 'string' && payload.Jurisdiction)
                        || knownJurisdiction
                        || undefined;

      addLog('info', 'LOB / topic resolved', `lob=${lob ?? '—'} · topic=${topic ?? '—'} · jurisdiction=${jurisdiction ?? '—'}`);

      setMessages((prev) =>
        prev.map((m) =>
          m.id === id
            ? {
                ...m,
                loading: false,
                opalPayload: payload,
                contentLoading: !!(lob && topic),
              }
            : m,
        ),
      );

      if (lob && topic) {
        addLog('info', 'GET /api/kb-content', `lob=${lob} · topic=${topic}${jurisdiction ? ` · jurisdiction=${jurisdiction}` : ''}`);

        fetchPolicyContent(lob, topic, jurisdiction).then((policyContent) => {
          if (policyContent?._debug?.found) {
            addLog('success', 'Policy content loaded', `${lob} · ${topic}`);
          } else {
            addLog('warn', 'No policy content found', `lob=${lob} · topic=${topic}`);
          }
          setMessages((prev) =>
            prev.map((m) =>
              m.id === id ? { ...m, policyContent, contentLoading: false } : m,
            ),
          );
        });
      }
    }

    handlersRef.current.set(correlationId, onPayload);

    try {
      addLog('info', 'POST /api/opal/trigger', question);
      const res = await fetch("/api/opal/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question, clientId: clientIdRef.current, correlationId }),
      });
      if (!res.ok) throw new Error(`Trigger failed (${res.status})`);
      addLog('success', 'Trigger acknowledged', `status ${res.status}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send question to Opal.';
      addLog('error', 'Trigger failed', message);
      handlersRef.current.delete(correlationId);
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, loading: false, contentLoading: false, error: message }
            : m,
        ),
      );
    }
  }

  return { messages, isLoading, submit, logs, clearLogs };
}
