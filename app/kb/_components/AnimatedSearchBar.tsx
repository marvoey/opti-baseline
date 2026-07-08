'use client';
import { useRef, useState } from 'react';
import { Search } from 'lucide-react';

const DEMO_QUERY = 'Commercial auto hail deductible Florida vs Georgia';
const CHAR_DELAY = 48; // ms per character
const START_DELAY = 200; // ms before first character

export default function AnimatedSearchBar() {
  const [value, setValue] = useState('');
  const [typing, setTyping] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function clearTimer() {
    if (timerRef.current) clearTimeout(timerRef.current);
  }

  function startTyping() {
    if (value.length > 0 || typing) return;
    setTyping(true);
    let i = 0;
    function tick() {
      if (i < DEMO_QUERY.length) {
        i++;
        setValue(DEMO_QUERY.slice(0, i));
        timerRef.current = setTimeout(tick, CHAR_DELAY);
      } else {
        setTyping(false);
      }
    }
    timerRef.current = setTimeout(tick, START_DELAY);
  }

  return (
    <form method="GET" action="/kb" className="w-full max-w-2xl relative">
      <input
        type="text"
        name="q"
        value={value}
        onChange={e => {
          clearTimer();
          setTyping(false);
          setValue(e.target.value);
        }}
        onFocus={startTyping}
        className="w-full p-4 pl-12 rounded-lg border border-slate-300 shadow-sm text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
        placeholder="Click to search…"
        autoComplete="off"
        spellCheck={false}
      />
      <Search className="absolute left-4 top-4 text-slate-400" size={24} />
      {typing && (
        <span
          className="absolute right-[120px] top-4 w-0.5 h-6 bg-slate-700 animate-pulse pointer-events-none"
          aria-hidden
        />
      )}
      <button
        type="submit"
        className="absolute right-3 top-3 bg-blue-600 text-white px-6 py-1.5 rounded hover:bg-blue-700 transition-colors disabled:opacity-50"
        disabled={typing}
      >
        Search
      </button>
    </form>
  );
}
