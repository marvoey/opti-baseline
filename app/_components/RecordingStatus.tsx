'use client';

import { useCallback, useEffect, useState } from 'react';

type Status = { recording: boolean; name?: string; clientId?: string; since?: number };

const POLL_MS = 5_000;
const NAME_KEY = 'recording-name';
const ID_KEY = 'recording-client-id';
const COLLAPSED_KEY = 'recording-collapsed';

// Per-browser identity so the server can tell "me" from "someone else".
function getClientId() {
  try {
    let id = localStorage.getItem(ID_KEY);
    if (!id) {
      id = crypto.randomUUID();
      localStorage.setItem(ID_KEY, id);
    }
    return id;
  } catch {
    return 'anon-' + Math.random().toString(36).slice(2);
  }
}

const post = (url: string, method: string, body: object) =>
  fetch(url, { method, headers: { 'content-type': 'application/json' }, body: JSON.stringify(body) });

export default function RecordingStatus() {
  const [clientId, setClientId] = useState('');
  const [status, setStatus] = useState<Status>({ recording: false });
  const [asking, setAsking] = useState(false);
  const [name, setName] = useState('');
  const [collapsed, setCollapsed] = useState(false);

  const refresh = useCallback(async () => {
    try {
      const res = await fetch('/api/recording', { cache: 'no-store' });
      setStatus(await res.json());
    } catch {}
  }, []);

  useEffect(() => {
    setClientId(getClientId());
    try {
      setName(localStorage.getItem(NAME_KEY) ?? '');
      setCollapsed(localStorage.getItem(COLLAPSED_KEY) === '1');
    } catch {}
    refresh();
    const t = setInterval(refresh, POLL_MS);
    return () => clearInterval(t);
  }, [refresh]);

  const mine = status.recording && status.clientId === clientId;

  // Heartbeat while I hold the slot, so it frees itself if my tab closes.
  useEffect(() => {
    if (!mine) return;
    const t = setInterval(() => post('/api/recording', 'POST', { clientId, name }).catch(() => {}), 20_000);
    return () => clearInterval(t);
  }, [mine, clientId, name]);

  const start = async () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    try {
      localStorage.setItem(NAME_KEY, trimmed);
    } catch {}
    const res = await post('/api/recording', 'POST', { clientId, name: trimmed });
    setStatus(await res.json());
    setAsking(false);
  };

  const stop = async (force = false) => {
    const res = await post('/api/recording', 'DELETE', { clientId, force });
    setStatus(await res.json());
  };

  const toggleCollapsed = (value: boolean) => {
    setCollapsed(value);
    try {
      localStorage.setItem(COLLAPSED_KEY, value ? '1' : '0');
    } catch {}
  };

  const label = !status.recording
    ? 'Recording room is free'
    : mine
      ? 'You are recording'
      : `${status.name} is recording`;

  const dot = (
    <span
      className={`inline-block h-3 w-3 rounded-full ${status.recording ? 'animate-pulse' : ''}`}
      style={{ backgroundColor: status.recording ? '#D6001C' : '#197050' }}
    />
  );
  const colors = {
    backgroundColor: status.recording ? '#FF99B6' : '#E4F0DA',
    borderColor: '#08251A',
    color: '#08251A',
  };

  if (collapsed) {
    return (
      <button
        onClick={() => toggleCollapsed(false)}
        className="fixed bottom-4 right-4 z-50 flex items-center gap-2 rounded-full border-2 px-3 py-2 text-sm font-semibold shadow-lg"
        style={colors}
        aria-label={`${label} (show recording status)`}
        title={label}
      >
        {dot}
        <span aria-hidden>◂</span>
      </button>
    );
  }

  return (
    <div
      className="fixed bottom-4 right-4 z-50 flex items-center gap-3 rounded-full border-2 px-4 py-2 text-sm font-semibold shadow-lg"
      style={colors}
      role="status"
    >
      {dot}
      <span>{label}</span>

      {asking && !status.recording ? (
        <form
          className="flex items-center gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            start();
          }}
        >
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="Your name"
            maxLength={40}
            className="w-32 rounded-full border px-3 py-1 text-sm"
            style={{ borderColor: '#08251A', backgroundColor: '#fff' }}
          />
          <button type="submit" className="rounded-full px-3 py-1 text-white" style={{ backgroundColor: '#08251A' }}>
            Start
          </button>
          <button type="button" onClick={() => setAsking(false)} className="underline">
            Cancel
          </button>
        </form>
      ) : !status.recording ? (
        <button
          onClick={() => (name.trim() ? start() : setAsking(true))}
          className="rounded-full px-3 py-1 text-white"
          style={{ backgroundColor: '#08251A' }}
        >
          I&apos;m recording
        </button>
      ) : mine ? (
        <button onClick={() => stop()} className="rounded-full px-3 py-1 text-white" style={{ backgroundColor: '#08251A' }}>
          I&apos;m done
        </button>
      ) : (
        <button
          onClick={() => confirm(`Clear ${status.name}'s recording status?`) && stop(true)}
          className="underline"
        >
          Clear
        </button>
      )}

      <button onClick={() => toggleCollapsed(true)} aria-label="Hide recording status" title="Hide" className="px-1">
        ▸
      </button>
    </div>
  );
}
