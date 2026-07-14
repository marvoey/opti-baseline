"use client";

import { useState, useRef, useEffect } from "react";
import type { OpalPayload, PolicyContentWithDebug, Message } from "../_types";

async function fetchPolicyContent(
  lob: string,
  topic: string,
  jurisdiction?: string,
): Promise<PolicyContentWithDebug | null> {
  console.log('[fetchPolicyContent] lob:', lob, '| topic:', topic, '| jurisdiction:', jurisdiction);
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
  const esRef = useRef<EventSource | null>(null);

  const isLoading = messages.some((m) => m.loading || m.contentLoading);

  useEffect(
    () => () => {
      esRef.current?.close();
    },
    [],
  );

  async function submit(question: string, knownLob?: string, knownTopic?: string) {
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

    const es = new EventSource("/api/opal/response");
    esRef.current = es;

    function onPayload(rawPayload: unknown) {
      const payload =
        rawPayload &&
        typeof rawPayload === "object" &&
        !Array.isArray(rawPayload)
          ? (rawPayload as OpalPayload)
          : {};

      console.log('[opal] raw payload from Opal:', JSON.stringify(payload, null, 2));

      // Opal may send LOB/Topic (capitalised) or lob/topic (lowercase) — check both
      const lob   = (typeof payload.lob === 'string'   && payload.lob)
                 || (typeof payload.LOB === 'string'   && payload.LOB)
                 || knownLob;
      const topic = (typeof payload.topic === 'string' && payload.topic)
                 || (typeof payload.Topic === 'string' && payload.Topic)
                 || knownTopic;

      console.log('[opal] resolved lob:', lob, '| topic:', topic);

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
        fetchPolicyContent(
          lob,
          topic,
          typeof payload.jurisdiction === 'string' ? payload.jurisdiction : undefined,
        ).then((policyContent) => {
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
    };

    es.addEventListener("close", () => {
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id ? { ...m, loading: false, contentLoading: false } : m,
        ),
      );
      es.close();
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
    };

    try {
      const res = await fetch("/api/opal/trigger", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      if (!res.ok) throw new Error(`Trigger failed (${res.status})`);
    } catch (err) {
      console.error('[opal] trigger error:', err);
      esRef.current?.close();
      setMessages((prev) =>
        prev.map((m) =>
          m.id === id
            ? { ...m, loading: false, contentLoading: false, error: err instanceof Error ? err.message : 'Failed to send question to Opal.' }
            : m,
        ),
      );
    }
  }

  return { messages, isLoading, submit };
}
