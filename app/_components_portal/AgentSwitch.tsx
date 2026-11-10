'use client';

import { useTransition } from 'react';
import { usePathname, useRouter } from 'next/navigation';
import { AGENT_KEYS, agentKeyFromPath, isAgentKey, type AgentKey } from '@/lib/agent/personas';

type Option = { key: AgentKey; label: string };

/**
 * "View as" switch for the demo: picks which of the four agents the portal is
 * shown for. DEMO ONLY (see lib/agent/getAgent.ts): it stores a preference and
 * is not a sign-in. A native <select> keeps it keyboard and screen-reader
 * friendly with no extra code. On a per-agent dashboard it navigates to the
 * chosen agent's page instead of refreshing.
 */
export default function AgentSwitch({ current, options }: { current: AgentKey; options: Option[] }) {
  const router = useRouter();
  const pathname = usePathname();
  const [pending, startTransition] = useTransition();

  function choose(value: string) {
    if (!isAgentKey(value) || value === current) return;
    startTransition(async () => {
      try {
        const res = await fetch('/api/agent', {
          method: 'POST',
          headers: { 'content-type': 'application/json' },
          body: JSON.stringify({ agent: value }),
        });
        // On failure nothing changes and the select snaps back to the current agent.
        if (!res.ok) return;
        if (agentKeyFromPath(pathname)) {
          // On a per-agent dashboard (/agent/dana) the page is fixed to its agent,
          // so "view as" moves to that agent's own page.
          router.push(pathname.replace(new RegExp(`/agent/(${AGENT_KEYS.join('|')})`), `/agent/${value}`));
        } else {
          router.refresh();
        }
      } catch {
        /* network error: keep the current agent */
      }
    });
  }

  return (
    <label className="inline-flex items-center gap-2">
      <span className="text-gray-500">View as</span>
      <select
        value={current}
        disabled={pending}
        onChange={(e) => choose(e.target.value)}
        className="rounded-md border border-gray-300 bg-white px-2 py-1 text-xs text-navy disabled:opacity-60"
      >
        {options.map((o) => (
          <option key={o.key} value={o.key}>
            {o.label}
          </option>
        ))}
      </select>
    </label>
  );
}
