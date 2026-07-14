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
  const esRef = useRef<EventSource | null>(null);

  const isLoading = messages.some((m) => m.loading || m.contentLoading);

  const addLog = useCallback((level: LogLevel, label: string, detail?: string) => {
    setLogs((prev) => [
      ...prev,
      { id: crypto.randomUUID(), ts: Date.now(), level, label, detail },
    ]);
  }, []);

  const clearLogs = useCallback(() => setLogs([]), []);

  useEffect(
    () => () => {
      esRef.current?.close();
    },
    [],
  );

  async function submit(question: string, knownLob?: string, knownTopic?: string, knownJurisdiction?: string) {
    const id = crypto.randomUUID();

    esRef.current?.close();
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

    const es = new EventSource("/api/opal/response");
    esRef.current = es;
    addLog('info', 'SSE stream opened', 'GET /api/opal/response');

    function onPayload(rawPayload: unknown) {
      const payload =
        rawPayload &&
        typeof rawPayload === "object" &&
        !Array.isArray(rawPayload)
          ? (rawPayload as OpalPayload)
          : {};

      addLog('success', 'Opal payload received', JSON.stringify(payload));

      // Opal may send LOB/Topic (capitalised) or lob/topic (lowercase) — check both
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

    es.onmessage = (e) => {
      try {
        onPayload(JSON.parse(e.data));
      } catch {
        onPayload(e.data);
      }
      es.close();
      addLog('info', 'SSE stream closed', 'message received');
    };

    es.addEventListener("close", () => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, loading: false, contentLoading: false } : m,
        ),
      );
      es.close();
      addLog('info', 'SSE stream closed', 'server sent close event');
    });

    es.onerror = () => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, loading: false, contentLoading: false, error: 'No response received from Opal.' }
            : m,
        ),
      );
      es.close();
      addLog('error', 'SSE stream error', 'no response received from Opal');
    };

    try {
      addLog('info', 'POST /api/opal/trigger', question);
      const res = await fetch("/api/opal/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error(`Trigger failed (${res.status})`);
      addLog('success', 'Trigger acknowledged', `status ${res.status}`);
    } catch (err) {
      const message = err instanceof Error ? err.message : 'Failed to send question to Opal.';
      addLog('error', 'Trigger failed', message);
      esRef.current?.close();
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
