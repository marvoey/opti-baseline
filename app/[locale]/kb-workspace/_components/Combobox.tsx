"use client";

import { useState, useRef, useEffect } from "react";
import questions from "../_data/_questions.json";

type Question = { id: string; question: string; lob: string; topic: string };

const ALL_QUESTIONS: Question[] = questions as Question[];

export function Combobox({
  onSubmit,
}: {
  onSubmit: (question: string, lob?: string, topic?: string) => void;
}) {
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
