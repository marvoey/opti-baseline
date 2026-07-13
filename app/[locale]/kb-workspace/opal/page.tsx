"use client";

import { useState, useRef, useEffect } from "react";
import questions from "../_data/_questions.json";
import type { PolicyContent } from "../_lib/twoPassResolve";

type Question = { id: string; question: string; lob: string; topic: string };

type OpalPayload = {
  lob?: string;
  topic?: string;
  jurisdiction?: string;
  [key: string]: unknown;
};

type PolicyContentWithDebug = PolicyContent & {
  _debug?: Record<string, unknown>;
};

type Message = {
  id: string;
  question: string;
  loading: boolean;
  opalPayload: OpalPayload | null;
  policyContent: PolicyContentWithDebug | null;
  contentLoading: boolean;
  error?: string;
};

const ALL_QUESTIONS: Question[] = questions as Question[];

// ─── Policy content card — mirrors _KbWorkspaceShell.tsx sections ─────────────

function PolicyCard({ policy }: { policy: PolicyContent }) {
  return (
    <div className="space-y-4">
      <h4 className="font-bold text-gray-900">
        Coverage Found: {policy.lob}
        <span className="ml-2 text-sm font-normal text-gray-500">
          · {policy.topic}
        </span>
      </h4>

      {/* 1 — Core Principle */}
      {policy.corePrinciple && (
        <div>
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-gray-600 bg-gray-100 px-2 py-0.5 rounded border border-gray-200 mb-2">
            National Policy
          </span>
          <div
            className="text-gray-700 text-sm prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: policy.corePrinciple }}
          />
        </div>
      )}

      {/* 2 — Jurisdictional Override */}
      {policy.override && (
        <div className="border-t border-gray-100 pt-4">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-bold uppercase tracking-wider text-[#004A8F] bg-blue-50 px-2 py-0.5 rounded border border-blue-200">
              {policy.jurisdictionName} Override
            </span>
            <span
              className={`text-xs px-2 py-0.5 rounded font-semibold ${
                policy.pass === 1
                  ? "bg-blue-100 text-blue-700 border border-blue-200"
                  : "bg-yellow-100 text-yellow-700 border border-yellow-200"
              }`}
            >
              {policy.pass === 1
                ? `Pass 1 · ${policy.jurisdiction}`
                : "Pass 2 · National"}
            </span>
          </div>
          <div
            className="text-gray-700 text-sm prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: policy.override }}
          />
        </div>
      )}

      {/* 3 — Procedural Safeguard */}
      {policy.proceduralSafeguard && (
        <div className="border-t border-gray-100 pt-4">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-amber-800 bg-amber-50 px-2 py-0.5 rounded border border-amber-200 mb-2">
            Consultant Action
          </span>
          <div
            className="text-gray-700 text-sm prose prose-sm max-w-none"
            dangerouslySetInnerHTML={{ __html: policy.proceduralSafeguard }}
          />
        </div>
      )}

      {/* 4 — Statutory Disclosure */}
      {policy.disclosure && (
        <div className="border-t border-gray-100 pt-4">
          <span className="inline-block text-xs font-bold uppercase tracking-wider text-red-800 bg-red-50 px-2 py-0.5 rounded border border-red-200 mb-2">
            Required Disclosure
          </span>
          <div
            className="text-gray-700 text-sm prose prose-sm max-w-none bg-red-50 border border-red-100 rounded p-3"
            dangerouslySetInnerHTML={{ __html: policy.disclosure }}
          />
        </div>
      )}

      {/* Source badge */}
      <div className="pt-4 border-t border-gray-100">
        <p className="text-xs text-gray-500 uppercase tracking-wider font-bold mb-2">
          Sources
        </p>
        <div className="flex gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-600 text-xs px-2 py-1 rounded border border-gray-200">
            <svg
              className="w-3 h-3 text-[#007BC7]"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            {policy.overrideLabel}
          </span>
          <span
            className={`inline-flex items-center gap-1 text-xs px-2 py-1 rounded font-semibold ${
              policy.pass === 1
                ? "bg-blue-100 text-blue-800 border border-blue-200"
                : "bg-yellow-100 text-yellow-800 border border-yellow-200"
            }`}
          >
            {policy.pass === 1
              ? `Pass 1 · ${policy.jurisdiction}`
              : "Pass 2 · National"}
          </span>
        </div>
      </div>
    </div>
  );
}

// Shown when Opal responds but no matching policy block exists in the data
function NoContentCard({
  payload,
  policyContent,
}: {
  payload: OpalPayload;
  policyContent: PolicyContentWithDebug | null;
}) {
  return (
    <div className="space-y-3">
      <h4 className="font-bold text-gray-900">
        {payload.lob ?? "Response"}
        {payload.topic && (
          <span className="ml-2 text-sm font-normal text-gray-500">
            · {String(payload.topic)}
          </span>
        )}
      </h4>
      <p className="text-sm text-amber-700 bg-amber-50 border border-amber-200 rounded px-3 py-2">
        No policy content found for this LOB / topic combination.
      </p>
      <div className="space-y-1">
        <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
          Opal payload
        </p>
        <pre className="text-xs text-gray-500 bg-gray-50 rounded p-3 overflow-x-auto">
          {JSON.stringify(payload, null, 2)}
        </pre>
      </div>
      {policyContent?._debug && (
        <div className="space-y-1">
          <p className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Resolution debug
          </p>
          <pre className="text-xs text-gray-500 bg-gray-50 rounded p-3 overflow-x-auto">
            {JSON.stringify(policyContent._debug, null, 2)}
          </pre>
        </div>
      )}
    </div>
  );
}

// ─── Combobox ─────────────────────────────────────────────────────────────────

function Combobox({ onSubmit }: { onSubmit: (question: string, lob?: string, topic?: string) => void }) {
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [selected, setSelected] = useState<Question | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);

  const filtered = input.trim()
    ? ALL_QUESTIONS.filter(
        (q) =>
          q.question.toLowerCase().includes(input.toLowerCase()) ||
          q.lob.toLowerCase().includes(input.toLowerCase()) ||
          q.topic.toLowerCase().includes(input.toLowerCase()),
      )
    : ALL_QUESTIONS;

  function select(q: Question) {
    setInput(q.question);
    setSelected(q);
    setOpen(false);
    setHighlighted(-1);
  }

  function submit() {
    const q = input.trim();
    if (!q) return;
    const s = selected;
    setInput("");
    setSelected(null);
    setOpen(false);
    setHighlighted(-1);
    onSubmit(q, s?.lob, s?.topic);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) {
      if (e.key === "ArrowDown") {
        setOpen(true);
        setHighlighted(0);
      }
      if (e.key === "Enter") submit();
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === "Enter") {
      if (highlighted >= 0 && filtered[highlighted])
        select(filtered[highlighted]);
      else {
        setOpen(false);
        submit();
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setHighlighted(-1);
    }
  }

  useEffect(() => {
    if (highlighted >= 0 && listRef.current) {
      const item = listRef.current.children[highlighted] as HTMLElement;
      item?.scrollIntoView({ block: "nearest" });
    }
  }, [highlighted]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  return (
    <div className="space-y-2">
      <div className="relative">
        <input
          ref={inputRef}
          type="text"
          value={input}
          onChange={(e) => {
            setInput(e.target.value);
            setSelected(null);
            setOpen(true);
            setHighlighted(-1);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
          onKeyDown={handleKeyDown}
          placeholder="Type a question or choose from the list…"
          className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#007BC7] focus:border-transparent"
        />
        <button
          tabIndex={-1}
          onMouseDown={(e) => {
            e.preventDefault();
            setOpen((o) => !o);
            inputRef.current?.focus();
          }}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
        >
          <svg
            className={`w-4 h-4 transition-transform ${open ? "rotate-180" : ""}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M19 9l-7 7-7-7"
            />
          </svg>
        </button>

        {open && filtered.length > 0 && (
          <ul
            ref={listRef}
            className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-64 overflow-y-auto"
          >
            {filtered.map((q, i) => (
              <li
                key={q.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  select(q);
                }}
                onMouseEnter={() => setHighlighted(i)}
                className={`px-4 py-3 cursor-pointer text-sm border-b border-gray-100 last:border-0 ${
                  i === highlighted
                    ? "bg-[#007BC7] text-white"
                    : "text-gray-700 hover:bg-gray-50"
                }`}
              >
                <p className="font-medium leading-snug">{q.question}</p>
                <p
                  className={`text-xs mt-0.5 ${i === highlighted ? "text-blue-100" : "text-gray-400"}`}
                >
                  {q.lob} · {q.topic}
                </p>
              </li>
            ))}
          </ul>
        )}

        {open && input.trim() && filtered.length === 0 && (
          <div className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg px-4 py-3 text-sm text-gray-400">
            No matching questions — your custom question will be used.
          </div>
        )}
      </div>

      {input.trim() && (
        <button
          onClick={submit}
          className="bg-[#007BC7] hover:bg-[#004A8F] text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition shadow"
        >
          Submit
        </button>
      )}
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

const LightningIcon = ({ className }: { className?: string }) => (
  <svg
    className={className}
    fill="none"
    stroke="currentColor"
    viewBox="0 0 24 24"
  >
    <path
      strokeLinecap="round"
      strokeLinejoin="round"
      strokeWidth={2}
      d="M13 10V3L4 14h7v7l9-11h-7z"
    />
  </svg>
);

const OpalAvatar = () => (
  <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center shrink-0">
    <LightningIcon className="w-4 h-4 text-purple-600" />
  </div>
);

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

export default function OpalPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const esRef = useRef<EventSource | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  const isLoading = messages.some((m) => m.loading || m.contentLoading);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(
    () => () => {
      esRef.current?.close();
    },
    [],
  );

  async function handleSubmit(question: string, knownLob?: string, knownTopic?: string) {
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

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col font-sans">
      <header className="bg-white border-b border-gray-200 h-14 flex items-center px-6 shrink-0 shadow-sm gap-3">
        <span className="text-[#007BC7] font-bold text-lg tracking-tight italic">
          PROGRESSIVE
        </span>
        <span className="text-gray-300">|</span>
        <LightningIcon className="w-4 h-4 text-purple-600" />
        <span className="text-gray-600 font-medium text-sm">
          Opal Knowledge Assistant
        </span>
      </header>

      <main className="flex-1 flex flex-col items-center pt-8 px-4 pb-10">
        <div className="w-full max-w-2xl flex flex-col gap-6">
          {messages.map((msg) => (
            <div key={msg.id} className="flex flex-col gap-3">
              {/* User question */}
              <div className="flex justify-end">
                <div className="bg-[#007BC7] text-white rounded-2xl rounded-tr-sm px-4 py-3 text-sm max-w-lg shadow-sm">
                  {msg.question}
                </div>
              </div>

              {/* Opal response */}
              {msg.loading || msg.contentLoading ? (
                <div className="flex items-center gap-3">
                  <OpalAvatar />
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm px-4 py-4 shadow-sm text-sm text-gray-500 flex items-center gap-2">
                    <svg className="w-4 h-4 animate-spin text-[#007BC7] shrink-0" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                    </svg>
                    {msg.loading ? "Waiting for Opal…" : "Fetching policy content…"}
                  </div>
                </div>
              ) : msg.error ? (
                <div className="flex items-center gap-3">
                  <OpalAvatar />
                  <div className="bg-white border border-red-200 rounded-2xl rounded-tl-sm px-4 py-3 shadow-sm text-sm text-red-600 flex items-center gap-3">
                    <span>{msg.error}</span>
                    <button
                      onClick={() => handleSubmit(msg.question, undefined, undefined)}
                      className="shrink-0 text-xs font-semibold text-[#007BC7] hover:underline"
                    >
                      Retry
                    </button>
                  </div>
                </div>
              ) : msg.opalPayload != null ? (
                <div className="flex items-start gap-3">
                  <OpalAvatar />
                  <div className="bg-white border border-gray-200 rounded-2xl rounded-tl-sm p-5 shadow-sm flex-1">
                    {msg.policyContent?._debug?.found ? (
                      <PolicyCard policy={msg.policyContent} />
                    ) : (
                      <NoContentCard
                        payload={msg.opalPayload}
                        policyContent={msg.policyContent}
                      />
                    )}
                  </div>
                </div>
              ) : null}
            </div>
          ))}

          {!isLoading && <Combobox onSubmit={handleSubmit} />}

          <div ref={bottomRef} />
        </div>
      </main>
    </div>
  );
}
