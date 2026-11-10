'use client';

import { useEffect, useId, useRef, useState } from 'react';
import { isAgentKey, shortAgency, type AgentKey } from '@/lib/agent/personas';

export type CompareAgent = { key: AgentKey; name: string; role: string; state: string; agency: string };

/** Width the dashboard is laid out at inside a frame; it is scaled down to fit the column. */
const FRAME_WIDTH = 1200;
const FRAME_HEIGHT = 1100;

/**
 * One agent's dashboard (/agent/<key>), shown as a small scaled-down live frame.
 * The scale is worked out from the column width in the browser; until then a fixed
 * value is used so the server and the first client render match.
 */
function ScaledFrame({ src, title }: { src: string; title: string }) {
  const box = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.45);

  useEffect(() => {
    const el = box.current;
    if (!el) return;
    const update = () => setScale(Math.min(1, el.clientWidth / FRAME_WIDTH));
    update();
    const ro = new ResizeObserver(update);
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  return (
    <div
      ref={box}
      className="overflow-hidden rounded-xl border border-gray-200 bg-white shadow-sm"
      style={{ height: FRAME_HEIGHT * scale }}
    >
      <iframe
        src={src}
        title={title}
        loading="lazy"
        style={{
          width: FRAME_WIDTH,
          height: FRAME_HEIGHT,
          border: 0,
          transform: `scale(${scale})`,
          transformOrigin: 'top left',
        }}
      />
    </div>
  );
}

function Pane({
  label,
  agents,
  value,
  onChange,
}: {
  label: string;
  agents: CompareAgent[];
  value: AgentKey;
  onChange: (key: AgentKey) => void;
}) {
  const id = useId();
  const agent = agents.find((a) => a.key === value) ?? agents[0];
  // Only the four allow-listed keys can ever reach the URL.
  const href = isAgentKey(agent.key) ? `/agent/${agent.key}` : '/agent';
  return (
    <div className="min-w-0">
      <div className="flex items-center gap-3">
        <label htmlFor={id} className="whitespace-nowrap text-xs font-bold uppercase tracking-wider text-gray-500">
          {label}
        </label>
        <select
          id={id}
          value={value}
          onChange={(e) => isAgentKey(e.target.value) && onChange(e.target.value)}
          className="min-w-0 flex-1 rounded-md border border-gray-300 bg-white px-3 py-2 text-sm text-navy"
        >
          {agents.map((a) => (
            <option key={a.key} value={a.key}>
              {a.name} · {a.role} · {a.state} · {shortAgency(a.agency)}
            </option>
          ))}
        </select>
      </div>
      <div className="mt-3 flex flex-wrap gap-2 text-xs">
        {[
          ['Role', agent.role],
          ['State', agent.state],
          ['Agency', shortAgency(agent.agency)],
        ].map(([k, v]) => (
          <span key={k} className="rounded-full border border-gray-200 bg-white px-3 py-1">
            <span className="text-gray-500">{k}</span> <span className="font-medium text-navy">{v}</span>
          </span>
        ))}
      </div>
      <div className="mt-4">
        <ScaledFrame src={href} title={`${agent.name}'s dashboard`} />
      </div>
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-3 inline-block text-sm text-lmt underline underline-offset-2"
      >
        Open {agent.name.split(' ')[0]}&rsquo;s dashboard &rsaquo;
      </a>
    </div>
  );
}

/**
 * "Preview by agent audience": two agents' dashboards side by side, each with its
 * own agent picker, so a marketer can see what different roles, states and
 * agencies get from the same priorities. Shows the published dashboards.
 */
export default function AgentCompare({
  agents,
  initial,
}: {
  agents: CompareAgent[];
  initial: [AgentKey, AgentKey];
}) {
  const [a, setA] = useState<AgentKey>(initial[0]);
  const [b, setB] = useState<AgentKey>(initial[1]);
  return (
    <div className="mt-6 grid gap-8 lg:grid-cols-2">
      <Pane label="View A" agents={agents} value={a} onChange={setA} />
      <Pane label="View B" agents={agents} value={b} onChange={setB} />
    </div>
  );
}
