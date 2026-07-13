'use client';

import { useState, useRef, useEffect } from 'react';
import questions from '../_data/_questions.json';

type Question = { id: string; question: string; lob: string; topic: string };

const ALL_QUESTIONS: Question[] = questions as Question[];

export default function OpalPage() {
  const [input, setInput] = useState('');
  const [open, setOpen] = useState(false);
  const [highlighted, setHighlighted] = useState(-1);
  const [submittedQuestion, setSubmittedQuestion] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [response, setResponse] = useState<unknown>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const esRef = useRef<EventSource | null>(null);

  const filtered = input.trim()
    ? ALL_QUESTIONS.filter((q) =>
        q.question.toLowerCase().includes(input.toLowerCase()) ||
        q.lob.toLowerCase().includes(input.toLowerCase()) ||
        q.topic.toLowerCase().includes(input.toLowerCase())
      )
    : ALL_QUESTIONS;

  function select(q: Question) {
    setInput(q.question);
    setOpen(false);
    setHighlighted(-1);
  }

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (!open) {
      if (e.key === 'ArrowDown') { setOpen(true); setHighlighted(0); }
      return;
    }
    if (e.key === 'ArrowDown') {
      e.preventDefault();
      setHighlighted((h) => Math.min(h + 1, filtered.length - 1));
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      setHighlighted((h) => Math.max(h - 1, 0));
    } else if (e.key === 'Enter') {
      if (highlighted >= 0 && filtered[highlighted]) select(filtered[highlighted]);
      else setOpen(false);
    } else if (e.key === 'Escape') {
      setOpen(false);
      setHighlighted(-1);
    }
  }

  useEffect(() => {
    if (highlighted >= 0 && listRef.current) {
      const item = listRef.current.children[highlighted] as HTMLElement;
      item?.scrollIntoView({ block: 'nearest' });
    }
  }, [highlighted]);

  // Clean up SSE on unmount
  useEffect(() => () => { esRef.current?.close(); }, []);

  async function handleSubmit() {
    const question = input.trim();
    if (!question) return;

    // Close any previous SSE stream
    esRef.current?.close();

    setSubmittedQuestion(question);
    setLoading(true);
    setResponse(null);
    setOpen(false);

    // Open SSE stream BEFORE triggering so we don't miss the callback
    const es = new EventSource('/api/opal/response');
    esRef.current = es;

    es.onmessage = (e) => {
      try {
        setResponse(JSON.parse(e.data));
      } catch {
        setResponse(e.data);
      }
      setLoading(false);
      es.close();
    };

    es.addEventListener('close', () => {
      setLoading(false);
      es.close();
    });

    es.onerror = () => {
      setLoading(false);
      es.close();
    };

    // Fire the webhook via server-side proxy
    await fetch('/api/opal/trigger', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ question }),
    });
  }

  return (
    <div className="bg-gray-100 min-h-screen flex flex-col">
      <header className="bg-white border-b border-gray-200 h-14 flex items-center px-6 shrink-0 shadow-sm gap-3">
        <span className="text-[#007BC7] font-bold text-lg tracking-tight italic">PROGRESSIVE</span>
        <span className="text-gray-300">|</span>
        <span className="text-gray-500 text-sm">Opal</span>
      </header>

      <main className="flex-1 flex flex-col items-center pt-16 px-4">
        <div className="w-full max-w-2xl space-y-3">
          <label className="block text-sm font-semibold text-gray-700">
            Ask a question
          </label>

          <div className="relative">
            <input
              ref={inputRef}
              type="text"
              value={input}
              onChange={(e) => { setInput(e.target.value); setOpen(true); setHighlighted(-1); }}
              onFocus={() => setOpen(true)}
              onBlur={() => setTimeout(() => setOpen(false), 150)}
              onKeyDown={(e) => { if (e.key === 'Enter' && !open) handleSubmit(); else handleKeyDown(e); }}
              placeholder="Type a question or choose from the list…"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 pr-10 text-sm bg-white shadow-sm focus:outline-none focus:ring-2 focus:ring-[#007BC7] focus:border-transparent"
            />
            <button
              tabIndex={-1}
              onMouseDown={(e) => { e.preventDefault(); setOpen((o) => !o); inputRef.current?.focus(); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              <svg className={`w-4 h-4 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </button>

            {open && filtered.length > 0 && (
              <ul
                ref={listRef}
                className="absolute z-20 mt-1 w-full bg-white border border-gray-200 rounded-lg shadow-lg max-h-72 overflow-y-auto"
              >
                {filtered.map((q, i) => (
                  <li
                    key={q.id}
                    onMouseDown={(e) => { e.preventDefault(); select(q); }}
                    onMouseEnter={() => setHighlighted(i)}
                    className={`px-4 py-3 cursor-pointer text-sm border-b border-gray-100 last:border-0 ${
                      i === highlighted ? 'bg-[#007BC7] text-white' : 'text-gray-700 hover:bg-gray-50'
                    }`}
                  >
                    <p className="font-medium leading-snug">{q.question}</p>
                    <p className={`text-xs mt-0.5 ${i === highlighted ? 'text-blue-100' : 'text-gray-400'}`}>
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
              onClick={handleSubmit}
              disabled={loading}
              className="mt-2 bg-[#007BC7] hover:bg-[#004A8F] disabled:opacity-50 text-white text-sm font-semibold px-5 py-2.5 rounded-lg transition shadow"
            >
              {loading ? 'Waiting for Opal…' : 'Submit'}
            </button>
          )}

          {/* ── Response area ───────────────────────────────────────────── */}
          {submittedQuestion && (
            <div className="mt-6 space-y-4">
              <div className="bg-[#007BC7] text-white rounded-lg px-4 py-3 text-sm font-medium shadow-sm">
                {submittedQuestion}
              </div>

              {loading && (
                <div className="flex items-center gap-3 bg-white border border-gray-200 rounded-lg px-4 py-4 shadow-sm text-sm text-gray-500">
                  <svg className="w-4 h-4 animate-spin text-[#007BC7] shrink-0" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
                  </svg>
                  Waiting for Opal to respond…
                </div>
              )}

              {!loading && response != null && (
                <div className="bg-white border border-gray-200 rounded-lg p-4 shadow-sm space-y-2">
                  <p className="text-xs font-bold uppercase tracking-wider text-gray-400">Opal Response</p>
                  <pre className="text-sm text-gray-800 whitespace-pre-wrap break-words">
                    {typeof response === 'string' ? response : JSON.stringify(response, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
