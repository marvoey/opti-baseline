import { Bell } from 'lucide-react';
import { shortAgency, type Agent } from '@/lib/agent/personas';

/**
 * The signed-in end of the portal headers: the notification bell, then the agent's
 * initials in a navy circle with their name and agency beside it (the name and
 * agency show from the `xl` breakpoint up, as in the mockup). Rendered inside
 * `.lmig-FloatingHeader-actions`, in the full header and in the dashboards' header.
 */
export default function AgentIdentity({ agent }: { agent: Agent }) {
  return (
    <>
      <button type="button" aria-label="Notifications">
        <Bell size={16} aria-hidden="true" />
      </button>
      <span className="flex items-center gap-2">
        <span
          className="flex h-9 w-9 items-center justify-center rounded-full bg-navy text-xs font-bold text-white"
          aria-hidden="true"
        >
          {agent.initials}
        </span>
        <span className="hidden leading-tight xl:block">
          <span className="block text-[13px] font-bold text-navy">{agent.name}</span>
          <span className="block text-[11px] font-normal text-gray-500">{shortAgency(agent.agency)}</span>
        </span>
      </span>
    </>
  );
}
